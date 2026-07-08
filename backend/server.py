from fastapi import FastAPI, APIRouter, Query, Response, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import hashlib
from pathlib import Path

from emergentintegrations.llm.openai.text_to_speech import OpenAITextToSpeech

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ['EMERGENT_LLM_KEY']

app = FastAPI()
api_router = APIRouter(prefix="/api")

# In-memory cache: text -> mp3 bytes (avoids regenerating identical phrases)
_tts_cache: dict[str, bytes] = {}


@api_router.get("/")
async def root():
    return {"message": "Grammar app API"}


@api_router.get("/tts")
async def text_to_speech(
    text: str = Query(..., min_length=1, max_length=300),
    voice: str = Query("nova"),
):
    """Return spoken English audio (mp3) for the given text.

    Served as a streamable audio URL so the mobile client can play it
    directly with expo-audio on both web and native.
    """
    key = hashlib.sha256(f"{voice}|{text}".encode()).hexdigest()
    audio = _tts_cache.get(key)

    if audio is None:
        try:
            tts = OpenAITextToSpeech(api_key=EMERGENT_LLM_KEY)
            b64 = await tts.generate_speech_base64(
                text=text, model="tts-1", voice=voice, response_format="mp3"
            )
            import base64
            audio = base64.b64decode(b64)
            _tts_cache[key] = audio
        except Exception as e:
            logger.error(f"TTS failed: {e}")
            raise HTTPException(status_code=502, detail="Audio generation failed")

    return Response(
        content=audio,
        media_type="audio/mpeg",
        headers={"Cache-Control": "public, max-age=86400"},
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

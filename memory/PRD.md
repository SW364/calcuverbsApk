# PRD — App de Gramática Inglesa (Verbos)

## Problem Statement (original)
App móvil en español para aprender a construir frases en inglés. Pantalla 1 (Módulos): quitar tarjeta de puntos/porcentaje/nivel y las barras de progreso de cada módulo. Pantalla 2 (M1.A): carruseles de sujeto/auxiliar/verbo SIN flechas, arrastrables con el dedo/mouse (lo que quede en el centro se selecciona), botón "Generar" bajo el carrusel de verbo que crea cards de Afirmativa/Negativa/Pregunta automáticamente. Quitar barra de progreso/puntos/estrella/porcentaje del top. Hacer todo un poco más pequeño. El arrastre DEBE funcionar con mouse (usuario en web base44). Sliders fluidos y suaves.

## Architecture
- Frontend: Expo Router (SDK 54), react-native-reanimated + react-native-gesture-handler (custom drag carousel), expo-audio (playback), expo-linear-gradient, Nunito font (expo-font).
- Backend: FastAPI. `GET /api/tts` → OpenAI TTS (tts-1, voice nova) via emergentintegrations + EMERGENT_LLM_KEY, served as streamable audio/mpeg with in-memory cache.
- Data: local (`src/data/verbs.ts`), grammar builder for affirmative/negative/question.

## User Persona
Estudiante hispanohablante aprendiendo estructura de frases en inglés con verbos modales.

## Core Requirements (static)
- Draggable carousels (touch + mouse), center-selects, no arrows, smooth spring snap.
- "Generar" builds 3 grammar cards from current selection.
- Real English TTS on each card.
- Módulos screen without gamification stats/progress bars.

## Implemented (2026-06)
- Pantalla Módulos (grid 2 col, sin stats ni barras de progreso, badge "Nuevo"). Solo M1.A navega; resto → toast "Próximamente".
- Pantalla M1.A: 3 carruseles arrastrables (DragCarousel con Gesture.Pan + reanimated, marco central de selección, scale/opacity), botón Generar, cards Afirmativa/Negativa/Pregunta con resaltado de color y botón de audio TTS.
- Header sin barra de progreso/puntos/estrella/porcentaje. Tamaños reducidos.
- Backend TTS endpoint con caché. Verificado: drag con mouse (I→You), grammar correcta, audio funciona. Testing agent: 9/9 backend, frontend pass.

## Backlog
- P1: Persistir última selección (storage) y favoritos (bookmark del header ya presente, sin lógica).
- P1: Completar M1.B–M4.B con contenido real.
- P2: Modo práctica/quiz, control de velocidad de audio, elección de voz.
- P2: Listas de verbos/sujetos personalizables por el usuario.

## Next Tasks
- Recibir del usuario las listas específicas de sujeto/auxiliar/verbo y sustituir los defaults.

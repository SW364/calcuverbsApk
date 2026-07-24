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
- (Todos los módulos definidos hasta ahora están implementados.)

## Implemented (2026-07 · fase 3 · Tita)
- Renombrados M3.B→**Tita I** (`/tita1`, presente) y M4.B→**Tita II** (`/tita2`, pasado).
- `src/data/tita.ts` + `src/components/TitaScreen.tsx`: estructuras There is/are (Tita I) y There was/were (Tita II).
- Selectores: carrusel de **cantidad** (One..Eight, el número NO aparece en la oración, solo define singular/plural), carrusel de **color** (Blue/Green/Yellow/Red/Orange con muestra), y **objeto** vía botón→modal con pestañas de categoría (Fruits/Vegetables/Shapes/Animals/Senses).
- Reglas: singular→"There is/was a|an ...", plural→"There are/were ..." con pluralización automática (apple→apples, fish→fish, tomato→tomatoes, etc.). Negativos: Tita I "no"; Tita II singular "no", plural "not" (según spec del usuario). Artículo a/an según color (orange→an). Verificado con test Node.
- NOTA: la categoría "Senses" se modeló con sustantivos base (ear/ears, eye/eyes, hand/hands, nose/noses, mouth/mouths) para que la regla singular/plural funcione (las etiquetas "Two Ears/One Nose" chocaban con el selector de cantidad).

## Implemented (2026-06 · fase 2)
- Motor de conjugación `src/data/conjugation.ts` (3ª persona -s/-es/-ies, pasados regulares con doblado CVC, gerundios con reglas de spelling, mapa de irregulares, verbo "be" especial). Verificado con test Node contra todos los ejemplos del usuario.
- Componente reutilizable `PracticeScreen` (sujeto + selector [auxiliar/tiempo] + botón de verbo con lista/buscador + Generar + cards con TTS). M1.A refactorizado a este componente.
- Módulos añadidos y enrutados desde el menú:
  - M1.B `/m1b`: gerundio con auxiliar modal + "be" + verbo-ing (159 verbos, lista directa). Ej: "I can be adding."
  - M2.A `/m2a`: 4 tiempos (no continuos), 30 verbos invariables (gemini-code). Ej: "I hit / I do not hit / Do I hit?".
  - M2.B `/m2b`: 4 tiempos continuos, 159 verbos. Ej: "I am adding / I have been adding".
  - M3.A `/m3a`: 4 tiempos, 58 verbos regulares (lista_verbos_directa).
  - M4.A `/m4a`: 4 tiempos, 42 verbos irregulares con formas explícitas (lista_verbos_segundo). Ej: "I have awoken".
- M3.B y M4.B siguen como "Próximamente" (según instrucción del usuario).

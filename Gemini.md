# Gemini Project Status: Number Buddies

## Project Overview
**Number Buddies** is a specialized React-based educational web application designed to help children learn and practice numbers in an interactive way. It features multiple game modes, voice feedback via the Web Speech API, and a configurable number range for progressive learning.

## Tech Stack
- **Framework:** React 19 (TypeScript)
- **Build System:** Vite
- **Styling:** Tailwind CSS v4 (with `@tailwindcss/vite` plugin)
- **Deployment:** Cloudflare Workers (using Workers Assets binding)
- **Core APIs:** Web Speech API for number narration

## Core Architecture
- **State Management:** The application state (navigation mode, current number, number range) is managed in `src/App.tsx` using React's `useState` and `useCallback` hooks.
- **Routing:** A simplified SPA routing mechanism implemented via conditional rendering in the root component.
- **Game Logic:**
    - **Explore Mode:** Interactive number cycling with voice synthesis.
    - **Challenge Mode:** A "Before and After" identification game that tests numerical sequence knowledge.
- **Custom Hooks:**
    - `useSpeech.ts`: Encapsulates logic for the browser's `SpeechSynthesis` API.
    - `useSpeechRecognition.ts`: Preliminary setup for voice input (future enhancement).

## Deployment Details
The project is configured for Cloudflare Workers:
- `wrangler.toml`: Configures `assets` binding to the `./dist` directory.
- `worker.ts`: A custom worker script that handles SPA routing by falling back to `index.html` for non-API requests not matched by static assets.

## Project Structure
- `src/components/`: Modular UI components for game modes and layout.
- `src/hooks/`: Business logic for speech and interaction.
- `src/util/`: Application-wide constants.
- `worker.ts`: Cloudflare Worker entry point.

## Current Status
- **Phase:** Fully functional MVP.
- **Completed Features:**
    - Interactive Explore mode.
    - Before/After Quiz in Challenge mode.
    - Customizable number range (Settings).
    - Speech synthesis for numbers.
    - Cloudflare Workers deployment pipeline.
- **Next Steps:**
    - Enhanced voice recognition for quiz answers.
    - Additional game modes (e.g., simple addition/subtraction).
    - Progress tracking and local storage for user settings.

## Getting Started
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build and Deploy: `npm run deploy`

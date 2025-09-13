# Cliniscribe 2.0 – Backend

Production-ready Express + MongoDB backend for AI nurse assistant.

## Features

- Symptom input (voice/text) + AI SOAP analysis (Whisper, GPT)
- Advice generator (illness, home remedies, OTC, red flags)
- Nearby clinic/pharmacy finder (Google Maps)
- Educational video generator (Gemini Veo 3)
- Consultation history (MongoDB)
- Ready for Firebase Google Auth integration

## Setup

1. Copy `.env.example` to `.env` and fill in keys.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start server:

   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/auth/google` — Google auth (stub)
- `POST /api/symptom` — Submit symptoms, get SOAP + advice + video
- `GET /api/maps/nearby?lat=...&lng=...` — Nearby clinics/pharmacies
- `GET /api/history/:userId` — User's history
- `GET /api/history/entry/:id` — Single consultation
- `POST /api/video` — Generate explainer video

## TODO

- Integrate real Whisper/GPT/Gemini/Veo APIs
- Add authentication middleware (when frontend ready)
- Connect to production MongoDB
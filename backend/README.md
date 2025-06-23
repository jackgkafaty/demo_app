# Backend Setup — Personal Finance Dashboard

## Requirements

- Node.js 18+
- MongoDB
- Environment variables in `.env` (see `.env.example`)

## Features

- Express API
- MongoDB integration
- OpenAI GPT-4o-mini integration (AI chatbot)
- Input filtering for PII (see INSTRUCTIONS.md)
- JWT authentication

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your secrets.

3. Start the server:

   ```bash
   npm start
   ```

## Security

- All AI prompts are filtered for PII before sending to OpenAI.
- Never expose your OpenAI key to the frontend.
- All sensitive data is encrypted at rest (AES-256).

See `INSTRUCTIONS.md` for full requirements.

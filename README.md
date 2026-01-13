# Gemini Text-to-Voice

This Node.js application converts a string of text into a WAV audio file using the Google Gemini API.

## Prerequisites

- Node.js installed (https://nodejs.org/)
- A Google Gemini API Key.

## Setup

- Clone or download the repository
-  Get your API key from Google AI Studio: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
-  Create a copy of the `.env.example` file and rename it to `.env`.
-  In the `.env` file, set the `GEMINI_API_KEY` variable to the API key you just obtained.

Example `.env` file:
```
GEMINI_API_KEY="your...key...here"
```

## Quick Start

To run the program:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your `.env` file with your `GEMINI_API_KEY` (see Setup section below)

3. Edit the text and voice in `index.js`:
   ```javascript
   const textToConvert = 'Your text here';
   const chosenVoice = 'Puck'; // or another available voice
   ```

4. Run the program:
   ```bash
   npm start
   ```
   or
   ```bash
   node index.js
   ```

The script will generate an `output.wav` file with the synthesized speech.

Available commands:
- `npm start` - Convert text to speech (default tts-mode)
- `npm run list-models` - List available models
- `npm run list-gen-models` - List generative models
- `npm start tts-mode` - Text-to-speech mode (TTS API)
- `npm start live-mode` - Native audio engine mode (Live API)
- `npm start test-mode` - Experimenting with latest from Gemini conversation

## Available Voices

The example uses the `Puck` voice. You can change this to any of the following pre-built voices:

- `Puck`
- `Charon`
- `Aoede`
- `Fenrir`
- `Kore`

These voices are available through the Gemini API's text-to-speech models.

## Notes

### Google Cloud Console

Create a project before you can get an API key

https://console.cloud.google.com/

* Project name: Gemini-Api-Key-Project
* Project number: 955770032652
* Project ID: gemini-api-key-project-484003

### Google AI Studio

Import the Cloud Console project in AI Studio in order to create an API Keys

https://aistudio.google.com/api-keys

## Blockers

### Gemini API Rate Limit

If a "rate limit" error occurs, monitor your usage and request limits here

https://ai.dev/rate-limit

Rate limits may also exist until a billing card is put on file (even though access is still free)

https://console.cloud.google.com/billing

Takes 15 to 30 minutes (and sometimes up to 24 hours) for a new billing account to propagate across all Google services. If you just added the card, the API might still be looking at a cached version of your "Unbilled/Limit 0" status.

### Gemini API

API can be disabled by default. Visit the following page and click the "Enable" button

https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com?project=upbeat-grammar-484005-n8

### Gemini Service Account

Account created. This may not have been necessary

* Service account name: JeremyGeminiService
* Service account ID: jeremygeminiservice
1/11/2026 12:50pm service account deleted and calls started being rejected, quota exceeded limit 10. Looks like it is just that.
Exceeded 10 requests per day rate limit
https://aistudio.google.com/usage?timeRange=last-7-days&project=gemini-api-key-project-484003&tab=rate-limit

Try again tomorrow

Search results from this week (Jan 2026) confirm that many developers are seeing exactly what you described:
The "Sizzling" Bug: There is a confirmed regression in the 2.5-flash-preview-tts model where a "metallic sizzling" or "radio interference" background noise appears, even on short text.
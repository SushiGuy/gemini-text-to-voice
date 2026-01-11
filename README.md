# Gemini Text-to-Voice

This Node.js application converts a string of text into a WAV audio file using the Google Gemini API.

## Prerequisites

- Node.js installed (https://nodejs.org/)
- A Google Gemini API Key.

## Setup

1.  **Clone the repository or download the code.**

2.  **Install dependencies:**
    Open your terminal in the project directory and run:
    ```bash
    npm install
    ```
    This will install the `@google/generative-ai` and `dotenv` packages.

3.  **Set up your Gemini API Key:**
    a.  Get your API key from Google AI Studio: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
    b.  Create a copy of the `.env.example` file and rename it to `.env`.
    c.  In the `.env` file, set the `GEMINI_API_KEY` variable to the API key you just obtained.
    
    For example:
    ```
    GEMINI_API_KEY="AIzaSy...your...key...here..."
    ```

## Usage

1.  **Modify the input text and voice:**
    Open the `index.js` file and change the values of the `textToConvert` and `chosenVoice` variables to your liking.

    ```javascript
    const textToConvert = 'Hello, this is a test of the Gemini text-to-speech API with the new voices.';
    const chosenVoice = 'Puck'; // Change this to any of the available voice names
    const outputFileName = 'output.wav';
    ```

2.  **Run the script:**
    Execute the following command in your terminal:
    ```bash
    npm start
    ```
    or
    ```bash
    node index.js
    ```

    This will create an `output.wav` file in the project directory containing the synthesized speech.

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

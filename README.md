# Phone Agent POC

AI-powered phone agent for customer support and call management using OpenAI Realtime API and Twilio SIP integration.

![Phone Agent POC](https://img.shields.io/badge/Phone%20Agent-POC-blue)
![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)

## Overview

Phone Agent POC is a proof-of-concept application that enables AI-powered voice conversations through phone calls. It integrates OpenAI's Realtime API for natural language processing and Twilio for telephony infrastructure, allowing you to make and receive AI-powered phone calls.

## Features

- 📞 **Make Outbound Calls**: Initiate AI-powered calls to any phone number
- 📱 **Receive Incoming Calls**: Handle incoming calls with AI agents
- 🤖 **Prebuilt Agent Templates**: 
  - Maroc Telecom Call Center Agent
  - Nike Order Confirmation Agent
  - Banco Sabadell Customer Service Support
- 🎨 **Customizable Agent Settings**:
  - Custom instructions/prompts
  - Language selection
  - Voice selection (alloy, verse, ash, ballad, coral, echo, fable, onyx, nova, sage, shimmer)
- 💾 **Agent Configuration Management**: Save and manage agent settings
- 🎨 **Modern UI**: Built with Nuxt UI components and dark mode support

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com)
- **UI Library**: [Nuxt UI](https://ui.nuxt.com)
- **Telephony**: [Twilio](https://www.twilio.com)
- **AI**: [OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime)
- **Language**: TypeScript
- **Package Manager**: pnpm

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- A Twilio account with:
  - Account SID
  - Auth Token
  - A phone number
  - SIP configuration set up
- An OpenAI API key with access to Realtime API
- An OpenAI SIP project configured

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd realtime-sip-twilio
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Twilio Configuration
TWILIO_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_NUMBER=+1234567890

# TwiML Handler URL (your public URL + /api/twiml)
TWIML_URL=https://your-domain.com/api/twiml

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-openai-api-key
OPENAI_WEBHOOK_SECRET=your-webhook-secret
```

### 4. Configure Twilio

1. Set up a TwiML webhook pointing to your `/api/twiml` endpoint
2. Configure SIP trunking to connect to OpenAI's SIP endpoint
3. Update the `TWIML_URL` in your `.env` file

### 5. Configure OpenAI SIP

1. Create an OpenAI SIP project
2. Configure the SIP endpoint to point to your `/api/openai-sip` webhook
3. Set up the webhook secret for verification

## Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### `POST /api/make-call`

Initiates an outbound AI-powered call.

**Request Body:**
```json
{
  "to": "+1234567890",
  "instructions": "Custom agent instructions",
  "language": "English",
  "voice": "alloy"
}
```

**Response:**
```json
{
  "ok": true,
  "call": {
    "sid": "CAxxxxx",
    "status": "queued",
    "to": "+1234567890",
    "from": "+0987654321"
  }
}
```

### `POST /api/openai-sip`

Webhook endpoint for OpenAI SIP call events. Handles incoming SIP calls and manages the Realtime WebSocket connection.

**Events Handled:**
- `realtime.call.incoming`: Initial call event, accepts the call and sets up the agent

### `POST /api/agent-settings`

Saves agent configuration settings.

**Request Body:**
```json
{
  "instructions": "Agent instructions",
  "language": "English",
  "voice": "alloy"
}
```

### `GET /api/twiml`

Returns TwiML instructions for Twilio to connect calls to OpenAI SIP.

## Usage

### Making a Call

1. Navigate to the "Make a New Call" section
2. Enter the recipient's phone number (E.164 format, e.g., +1234567890)
3. Click "Make Call"
4. The AI agent will initiate the call using the configured agent settings

### Receiving Calls

1. Share your support phone number (displayed in the "Receive a Call" section)
2. When someone calls, the AI agent will automatically answer using your saved agent settings

### Configuring Agent Settings

1. Go to the "Agent Details Settings" section
2. Choose a prebuilt template or customize:
   - **Instructions**: Define the agent's personality, tone, and conversation flow
   - **Language**: Select the conversation language
   - **Voice**: Choose the AI voice (alloy, verse, ash, etc.)
3. Click "Save Settings" to apply the configuration

### Prebuilt Templates

The application includes three prebuilt agent templates:

- **Maroc Telecom**: Call center agent for telecommunications support
- **Nike Order**: Order confirmation and upsell agent for e-commerce
- **Banco Sabadell**: Banking customer service and satisfaction support

## Project Structure

```
realtime-sip-twilio/
├── app/
│   ├── app.config.ts       # UI configuration
│   ├── app.vue            # Root component
│   ├── pages/
│   │   └── index.vue      # Main application page
│   └── components/        # Vue components
├── server/
│   └── api/
│       ├── make-call.post.ts      # Outbound call endpoint
│       ├── openai-sip.post.ts      # OpenAI webhook handler
│       ├── agent-settings.post.ts  # Agent config endpoint
│       └── twiml.ts               # TwiML generator
├── public/
│   └── logo.png           # Application logo
├── nuxt.config.ts         # Nuxt configuration
└── package.json           # Dependencies
```

## Production Build

Build the application for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

## Deployment

### Environment Setup

Ensure all environment variables are set in your deployment platform:

- Vercel: Add variables in Project Settings → Environment Variables
- Netlify: Add variables in Site Settings → Environment Variables
- Other platforms: Follow their respective environment variable configuration

### Required Environment Variables

- `TWILIO_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_NUMBER`
- `TWIML_URL`
- `OPENAI_API_KEY`
- `OPENAI_WEBHOOK_SECRET`

### Webhook Configuration

1. **Twilio Webhook**: Point to `https://your-domain.com/api/twiml`
2. **OpenAI SIP Webhook**: Point to `https://your-domain.com/api/openai-sip`

## Troubleshooting

### Calls Not Connecting

- Verify Twilio credentials are correct
- Check that `TWIML_URL` is publicly accessible
- Ensure SIP trunking is properly configured

### OpenAI Webhook Not Receiving Events

- Verify the webhook URL is publicly accessible
- Check OpenAI SIP project configuration
- Verify `OPENAI_API_KEY` has Realtime API access

### Agent Not Responding

- Check agent settings are saved
- Verify instructions are properly formatted
- Check OpenAI API key permissions

## License

This project is a proof-of-concept and is provided as-is.

## Contributing

This is a POC project. For production use, consider:
- Adding database persistence for agent settings
- Implementing call logging and analytics
- Adding authentication and authorization
- Enhancing error handling and monitoring
- Adding unit and integration tests

## Support

For issues and questions, please refer to:
- [Nuxt Documentation](https://nuxt.com/docs)
- [Nuxt UI Documentation](https://ui.nuxt.com)
- [Twilio Documentation](https://www.twilio.com/docs)
- [OpenAI Realtime API Documentation](https://platform.openai.com/docs/guides/realtime)

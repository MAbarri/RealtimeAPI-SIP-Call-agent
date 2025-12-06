// server/api/openai-sip.post.ts
import { defineEventHandler, readRawBody } from 'h3'
//@ts-ignore
import WebSocket from 'ws'


const defaultInstructions = `
            # Personality & Tone
              ## Personality
  - Friendly, confident, and proactive sales agent.
              - Sounds like a helpful human representative calling from an online sportswear store.
              - Expert in product knowledge and customer service.

              ## Tone
  - Warm, natural, and conversational.
              - Slightly energetic but not pushy.
              - Speaks like a real retail agent, not a robot.

              ## Length
  - Keep responses short: 2–3 sentences per turn.
              - Move the conversation forward smoothly and naturally.

              ## Language
  - The conversation will be only in {{language}}.
              - Do not respond in any other language, even if the user asks.
              - If the user speaks another language, politely explain that support is limited to {{language}}.

              ## Variety
  - Do not repeat the same sentence twice.
              - Vary your greetings, confirmations, and upsell phrases so it doesn't sound robotic.

              # Role & Objective
  - You are calling the customer about their recent order of ** Nike running shoes ** from our website.
              - Confirm their order politely and verify basic details(e.g., size, color, delivery).
              - After confirmation, introduce a soft upsell: offer a matching ** Nike cap ** or ** tracksuit **, highlighting benefits.
              - Never pressure the customer; keep the upsell natural and optional.

              # Conversation Flow
1. ** Greeting **
  - Start the call with a friendly introduction as a representative from the online store.
                - State that you’re calling about their recent Nike shoes order.

              2. ** Order Confirmation **
  - Confirm: product, size, color, and that shipping is on the way.
                - Ask if everything looks correct.

              3. ** Upsell Opportunity **
  - After confirmation, offer a small optional recommendation:
                  - a ** Nike cap ** ("great match for running or casual wear")
  - OR a ** Nike tracksuit ** ("pairs perfectly with the shoes and is on discount")
    - Keep it friendly and light.

              4. ** Close the Call **
  - Thank the customer for their order.
                - Offer further assistance.
                - End politely.

              # Safety & Escalation
  - If the user sounds confused, frustrated, or asks for a human, apologize and say you will connect them to a specialist.

`

export default defineEventHandler(async (event) => {
  console.log('🔔 OpenAI SIP webhook received')
  const config = useRuntimeConfig(event)
  const openaiApiKey = config.openaiApiKey

  const agentSettings = await useStorage('data').getItem('info') as { instructions: string, language: string, voice: string }
  console.log("📤 Agent settings:", agentSettings)

  let instructions = agentSettings?.instructions || defaultInstructions
  let language = agentSettings?.language || 'English'
  let voice = agentSettings?.voice || 'alloy'

  instructions = instructions.replace('{{language}}', language).replace('{{language}}', language)

  const rawBody = await readRawBody(event, 'utf8')
  console.log("📩 Raw body:", rawBody)

  if (!rawBody) return { ok: false }

  const body = JSON.parse(rawBody)
  console.log('🔔 Parsed webhook body:', body)

  // Handle incoming SIP call
  if (body.type === 'realtime.call.incoming') {

    const callId = body?.data?.call_id
    console.log("📞 Incoming SIP call. call_id:", callId)

    if (!callId) {
      console.error("❌ Missing call_id")
      return { ok: false }
    }

    // Load env vars
    const config = useRuntimeConfig(event)
    const openaiKey = config.openaiApiKey

    // Accept call via REST request
    const acceptUrl = `https://api.openai.com/v1/realtime/calls/${callId}/accept`
    const acceptPayload = {
      model: "gpt-realtime",
      instructions: instructions
    }

    console.log("📤 Sending call.accept:", acceptPayload)

    const acceptResp = await fetch(acceptUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "realtime=v1"
      },
      body: JSON.stringify(acceptPayload)
    })

    const acceptText = await acceptResp.text()
    console.log("📞 OpenAI accept response:", acceptText)

    //
    // 🚀 STEP 2: OPEN REALTIME WEBSOCKET
    //
    console.log("🔌 Opening Realtime WebSocket...")

    const ws = new WebSocket(
      `wss://api.openai.com/v1/realtime?call_id=${callId}`,
      {
        headers: {
          "Authorization": `Bearer ${openaiKey}`,
          "OpenAI-Beta": "realtime=v1"
        }
      }
    )

    ws.on('open', () => {
      console.log("✅ WS connected to OpenAI realtime for call:", callId)

      //
      // 🚀 STEP 3: Mandatory session.update
      //
      const sessionUpdate = {
        type: "session.update",
        session: {
          type: "realtime",
          output_modalities: ["audio"], // crucial
          instructions: instructions,
          audio: {
            input: {
              format: { type: "audio/pcm", rate: 24000 },
              turn_detection: { type: "semantic_vad" }
            },
            output: {
              format: { type: "audio/pcm" },
              voice: voice
            }
          }
        }
      }

      console.log("📤 Sending session.update...")
      ws.send(JSON.stringify(sessionUpdate))

      //
      // 🚀 STEP 4: Trigger initial greeting (output audio)
      //
      console.log("📤 Sending greeting response...")
      ws.send(JSON.stringify({
        type: "response.create",
        response: {
          instructions: instructions
        }
      }))
    })

    ws.on('message', (data: any) => {
      try {
        const msg = JSON.parse(data.toString())
        console.log("📩 WS EVENT:", msg.type, msg.status, msg.transcript || msg.text)
      } catch (err) {
        console.error("❌ WS message parse error:", err)
      }
    })

    ws.on('close', () => console.log("🔌 WS CLOSED"))
    ws.on('error', (err: any) => console.error("❌ WS ERROR:", err))

    //
    // MUST send 200 OK to OpenAI webhook
    //
    return { ok: true }
  }

  // Non-call events
  return { ok: true }
})

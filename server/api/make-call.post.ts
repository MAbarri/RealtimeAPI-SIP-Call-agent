import twilio from 'twilio'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {

    const config = useRuntimeConfig(event)
    const twilioSid = config.twilioSid
    const twilioAuthToken = config.twilioAuthToken
    const twilioNumber = config.twilioNumber
    const twimlUrl = config.twimlUrl

    console.log("📤 Twilio config:", config)

    const body = await readBody(event)
    const { to } = body   // ex "+212699662816"
    console.log("📞 Initiating outbound AI call to:", to)

    if (!to) {
        return { error: "Missing 'to' number" }
    }

    // Twilio credentials
    const client = twilio(twilioSid, twilioAuthToken)
    console.log("📞 Twilio client created")

    const call = await client.calls.create({
        from: twilioNumber,
        to: to,
        url: twimlUrl
    })
    console.log("📤 Twilio outbound call created:", call.sid)

    return { ok: true, call: call }
})

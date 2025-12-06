import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler((event) => {
  // Twilio needs XML content-type
  setHeader(event, 'Content-Type', 'text/xml')

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial>
    <Sip>sip:proj_ByA4ghsefSss4C2e1mS43SaA@sip.api.openai.com;transport=tls</Sip>
  </Dial>
</Response>`
})

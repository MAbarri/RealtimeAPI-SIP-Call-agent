// /server/api/save.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("📤 Agent settings body:", body)
  await useStorage('data').setItem('info', body)

  const agentSettings = await useStorage('data').getItem('info') as { instructions: string, language: string, voice: string }
  console.log("📤 Agent settings:", agentSettings)

  return { ok: true, agentSettings: agentSettings }
})

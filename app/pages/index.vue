<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="grid grid-cols-1 gap-8">
      <!-- Make a New Call Section -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-phone-call" class="w-5 h-5" />
            <h2 class="text-2xl font-semibold">Make a New Call</h2>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Recipient Phone Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recipient Phone Number <span class="text-primary">*</span>
            </label>
            <UInput
              v-model="makeCallForm.recipientPhone"
              placeholder="+1234567890"
              type="tel"
              size="lg"
              icon="i-lucide-phone"
            />
          </div>

          <!-- Action Button -->
          <UButton
            color="primary"
            size="lg"
            block
            icon="i-lucide-phone-call"
            :loading="isMakingCall"
            :disabled="isMakingCall"
            @click="handleMakeCall"
          >
            {{ isMakingCall ? 'Making Call...' : 'Make Call' }}
          </UButton>
        </div>
      </UCard>

      <!-- Receive a Call Section -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-phone-incoming" class="w-5 h-5" />
            <h2 class="text-2xl font-semibold">Receive a Call</h2>
          </div>
        </template>

        <div class="space-y-6">
          <div class="text-center py-6">
            <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">
              Dial our Customer Support Phone Number and our AI Agent will answer you.
            </p>
            <div class="flex items-center justify-center gap-3">
              <UIcon name="i-lucide-phone" class="w-6 h-6 text-primary" />
              <p class="text-2xl font-bold text-primary">
                {{ supportPhoneNumber }}
              </p>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Agent Details Settings Section -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-settings" class="w-5 h-5" />
            <h2 class="text-2xl font-semibold">Agent Details Settings</h2>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Prebuilt Instruction Templates -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Prebuilt Templates
            </label>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <UButton
                :color="selectedTemplate === 'marocTelecom' ? 'primary' : 'neutral'"
                :variant="selectedTemplate === 'marocTelecom' ? 'solid' : 'outline'"
                block
                @click="loadTemplate('marocTelecom')"
              >
                <UIcon name="i-lucide-phone" class="w-4 h-4 mr-2" />
                Maroc Telecom
              </UButton>
              <UButton
                :color="selectedTemplate === 'nike' ? 'primary' : 'neutral'"
                :variant="selectedTemplate === 'nike' ? 'solid' : 'outline'"
                block
                @click="loadTemplate('nike')"
              >
                <UIcon name="i-lucide-shopping-bag" class="w-4 h-4 mr-2" />
                Nike Order
              </UButton>
              <UButton
                :color="selectedTemplate === 'bancoSabadell' ? 'primary' : 'neutral'"
                :variant="selectedTemplate === 'bancoSabadell' ? 'solid' : 'outline'"
                block
                @click="loadTemplate('bancoSabadell')"
              >
                <UIcon name="i-lucide-building-2" class="w-4 h-4 mr-2" />
                Banco Sabadell
              </UButton>
              <UButton
                :color="selectedTemplate === 'Sakina' ? 'primary' : 'neutral'"
                :variant="selectedTemplate === 'Sakina' ? 'solid' : 'outline'"
                block
                @click="loadTemplate('Sakina')"
              >
                <UIcon name="i-lucide-building-2" class="w-4 h-4 mr-2" />
                Sakina
              </UButton>
            </div>
          </div>

          <!-- Instructions (Collapsible) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Instructions
            </label>
            <UCollapsible class="flex flex-col gap-2">
              <UButton
                label="Show Instructions"
                color="neutral"
                variant="subtle"
                trailing-icon="i-lucide-chevron-down"
                block
              />
              <template #content>
                <UTextarea
                  v-model="agentDetails.instructions"
                  placeholder="Enter agent instructions..."
                  :rows="8"
                  size="lg"
                  class="w-full"
                />
              </template>
            </UCollapsible>
          </div>

          <!-- Language and Voice in Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Language -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <USelectMenu
                v-model="agentDetails.language"
                :items="languageOptions"
                placeholder="Select language"
                size="lg"
                class="w-full"
              />
            </div>

            <!-- Voice -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Voice
              </label>
              <USelectMenu
                v-model="agentDetails.voice"
                :items="voiceOptions"
                placeholder="Select voice"
                size="lg"
                class="w-full"
              />
            </div>
          </div>

          <!-- Save Button -->
          <UButton
            color="primary"
            size="lg"
            block
            icon="i-lucide-save"
            :loading="isSavingSettings"
            :disabled="isSavingSettings"
            @click="handleSaveSettings"
          >
            {{ isSavingSettings ? 'Saving...' : 'Save Settings' }}
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()

const supportPhoneNumber = '+13854756923'

const makeCallForm = ref({
  recipientPhone: '+212699662816'
})

const agentDetails = ref({
  instructions: `
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
  - If the user sounds confused, frustrated, or asks for a human, apologize and say you will connect them to a specialist.`,
  language: 'English',
  voice: 'alloy'
})

const isMakingCall = ref(false)
const isSavingSettings = ref(false)
const selectedTemplate = ref<'marocTelecom' | 'nike' | 'bancoSabadell' | 'Sakina' >('nike')

// Prebuilt instruction templates
const instructionTemplates = {
  marocTelecom: `# Personality & Tone
## Personality
- Professional, helpful, and patient telecommunications support agent.
- Represents Maroc Telecom with expertise in telecom services and technical support.
- Always takes the lead in guiding the conversation.
- Proactively asks questions to understand the customer's needs.

## Tone
- Warm, professional, and solution-oriented.
- Patient when explaining technical concepts.
- Empathetic when handling complaints or issues.
- Engaging and conversational, never passive.

## Length
- Keep responses concise: 2–3 sentences per turn.
- Always end your turn with a question to keep the conversation moving.

## Language
- The conversation will be only in {{language}}.
- Use formal but friendly language appropriate for customer service.
- If the user speaks another language, politely explain that support is available in {{language}}.

## Variety
- Vary your responses to avoid sounding repetitive.
- Use different phrases for greetings, confirmations, explanations, and closing.

# Role & Objective
- You are a Maroc Telecom call center agent assisting the customer.
- Your primary goal is to guide the conversation by asking clear and direct questions.
- Diagnose issues, explain plan or package details, and offer helpful solutions.
- Never wait silently: always drive the next step.

# Conversation Flow
1. **Greeting**
   - Greet the customer warmly.
   - Introduce yourself as a Maroc Telecom representative.
   - Immediately ask an opening question such as:
     - “Are you calling about your mobile plan, internet service, or a billing question today?”

2. **Understanding the Request**
   - Ask targeted clarifying questions.
   - If the user stays silent, gently prompt again:
     - “Just to help you quickly—are you having any issue with your line or connection?”

3. **Providing Assistance**
   - Explain solutions clearly.
   - After each explanation, ask a follow-up question to keep the interaction flowing.
   - Example: “I can check your line status. Before I do, could you confirm your service type?”

4. **Resolution & Follow-up**
   - Confirm that the issue is resolved.
   - Proactively offer additional checks or services:
     - “Would you like me to review your current plan to see if a cheaper option is available?”

5. **Closing**
   - Thank them warmly.
   - Offer help with another topic before ending the call.

# Safety & Escalation
- If the customer is frustrated or the issue is complex, offer to escalate to a specialist.
- Always maintain professionalism and empathy.
- If asked for a human agent, politely transfer or schedule a callback.
`,

  nike: `# Personality & Tone
## Personality
- Friendly, confident, and proactive sales agent.
- Sounds like a helpful human representative calling from an online sportswear store.
- Takes initiative: leads the conversation instead of waiting for input.
- Expert in product knowledge and upselling.

## Tone
- Warm, natural, and conversational.
- Slightly energetic but never pushy.
- Engaging and interactive, guiding the customer through each step.

## Length
- Keep responses short: 2–3 sentences per turn.
- Always end with a question to maintain momentum.

## Language
- The conversation will be only in {{language}}.
- Do not respond in any other language.
- If the user switches languages, politely explain that support is limited to {{language}}.

## Variety
- Vary greetings and upsell suggestions.
- Never repeat the same phrase twice.

# Role & Objective
- You are calling the customer about their Nike running shoes order.
- Your job is to guide the conversation:
  - Verify the order details proactively.
  - Ask questions and confirm preferences.
  - Naturally introduce upsell suggestions (Nike cap or tracksuit).
- Never wait passively—always initiate the next step.

# Conversation Flow
1. **Greeting**
   - Introduce yourself and mention their Nike order.
   - Immediately ask a question:
     - “Can I quickly confirm your shoe size and color?”

2. **Order Confirmation**
   - Confirm details.
   - Then ask:
     - “Does everything look correct so far?”

3. **Upsell Opportunity**
   - Lead the topic naturally:
     - “By the way, many customers who bought these shoes also grabbed a Nike cap or tracksuit. Would you like me to check availability for you?”
   - Always end with a question.

4. **Close the Call**
   - Summarize.
   - Ask:
     - “Is there anything else I can check for you before we finish?”

# Safety & Escalation
- If the user is confused or requests a human, escalate politely.
`,

  bancoSabadell: `# Personality & Tone
## Personality
- Professional, trustworthy, and empathetic banking representative.
- Confident, proactive, and takes the lead in conversations.
- Guides customers by asking clear questions.

## Tone
- Professional yet warm and approachable.
- Patient and reassuring.
- Engaging — never waits silently.

## Length
- Keep responses clear and concise: 2–3 sentences per turn.
- Always end with a guiding question.

## Language
- The conversation will be only in {{language}}.
- Use professional but friendly language.
- If the user changes language, politely redirect to {{language}}.

## Variety
- Vary your responses to maintain a natural flow.
- Use different phrases for each step of the conversation.

# Role & Objective
- You are a Banco Sabadell support agent.
- Your goal is to guide the customer by:
  - Asking questions
  - Understanding their financial need
  - Providing solutions
  - Checking satisfaction
- You lead the rhythm of the conversation.

# Conversation Flow
1. **Greeting**
   - Introduce yourself.
   - Immediately ask:
     - “Are you calling about an account, a transaction, or your card today?”

2. **Understanding the Request**
   - Ask clarifying questions.
   - If the user is silent, gently prompt again.

3. **Providing Assistance**
   - Explain solutions step by step.
   - After each piece of information, ask a follow-up question.

4. **Satisfaction Check**
   - Confirm resolution.
   - Ask:
     - “Is there anything else I can assist you with regarding your banking services?”

5. **Closing**
   - Thank them warmly.
   - Offer support for future needs.

# Safety & Escalation
- Never request sensitive data such as full card numbers or passwords.
- Escalate complex cases.
- Transfer to a human if requested.
`,
Sakina: `
# Personality & Tone
## Personality
- Friendly, professional, and confident recruiter.
- Represents **Hiberus Technology Tetouan** with clarity and enthusiasm.
- Takes charge of the conversation and guides the candidate through the screening process.
- Sounds human, attentive, and conversational.

## Tone
- Warm, respectful, and engaging.
- Clear, energetic, and well-paced.
- Avoids robotic or overly formal language; communicates naturally.

## Length
- Keep responses short and structured: 2–3 sentences maximum.
- Always end your turn with a question to move the conversation forward.

## Language
- The conversation will be only in {{language}}.
- If the candidate switches languages, politely redirect to {{language}}.
- Maintain a professional yet friendly recruiter tone.

## Variety
- Vary your greetings and question phrasing to avoid repetition.
- Use different formulations when confirming details or transitioning between topics.

# Role & Objective
- You are a recruiter calling from **Hiberus Technology Tetouan**.
- You are contacting a candidate about their application for the **Senior Java Engineer** position.
- Your goal is to:
  - Verify availability.
  - Collect key information (salary expectations, notice period, experience level).
  - Determine if they match the immediate staffing need.
  - Schedule a follow-up call if needed.
- You lead the conversation proactively — never wait silently.

# Conversation Flow
1. **Greeting & Introduction**
   - Begin with a warm, natural introduction:
     - “Hello, this is {{agentName}} calling from Hiberus Technology Tetouan. I'm reaching out regarding your application for the Senior Java Engineer position.”
   - Immediately ask a question to engage:
     - “Is this a good moment for a quick talk?”

2. **Availability Check**
   - If the candidate says yes → continue.
   - If they hesitate → propose a better time:
     - “No problem — when would you be available for a short call today or tomorrow?”
   - After availability is confirmed, ask:
     - “Before we continue, could you confirm that you're still actively looking for a new role?”

3. **Salary Expectations**
   - Ask proactively:
     - “Perfect. Could you tell me your current salary expectations for this position?”
   - Follow immediately with:
     - “And is that amount negotiable depending on the offer?”

4. **Notice Period / Preavis**
   - Ask clearly and confidently:
     - “How much notice period or preavis do you currently have?”
   - If unclear, ask a follow-up:
     - “Is that flexible, or is it fixed by your current contract?”

5. **Experience Snapshot**
   - To validate seniority:
     - “Great. Could you briefly confirm how many years of experience you have working with Java?”

6. **Availability for Rapid Start**
   - Because this is a priority hiring need:
     - “We are looking to fill this role as soon as possible. Are you available to start immediately after your preavis?”

7. **Next Steps**
   - Summarize what you gathered.
   - Proactively suggest the next action:
     - “Perfect, that gives me everything I need. I can schedule your technical interview. Are you available later today or tomorrow?”

8. **Closing**
   - Always end clearly and politely:
     - “Thank you very much for your time. We will contact you shortly with the next steps. Have a great day!”

# Safety & Escalation
- If the candidate asks for complex employment details, politely defer:
  - “I can connect you with our HR specialist for the exact details.”
- If the candidate becomes confused or unsure, slow down and rephrase clearly.
- If they ask for a human recruiter, apologize and offer to schedule a callback.
`
}

const loadTemplate = (templateKey: keyof typeof instructionTemplates) => {
  selectedTemplate.value = templateKey as 'marocTelecom' | 'nike' | 'bancoSabadell'
  agentDetails.value.instructions = instructionTemplates[templateKey]
  toast.add({
    title: 'Template Loaded',
    description: 'Instruction template has been loaded. You can customize it in the instructions field.',
    color: 'success'
  })
}

// Load Nike template by default on mount
onMounted(() => {
  loadTemplate('nike')
})

const languageOptions = ref([
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Chinese',
  'Japanese'
])

const voiceOptions = ref([
  'alloy',
  'verse',
  'ash',
  'ballad',
  'coral',
  'echo',
  'fable',
  'onyx',
  'nova',
  'sage',
  'shimmer'
])

const handleMakeCall = async () => {
  if (!makeCallForm.value.recipientPhone) {
    toast.add({
      title: 'Error',
      description: 'Please enter a recipient phone number',
      color: 'error'
    })
    return
  }

  isMakingCall.value = true

  try {
    const response = await $fetch<{
      success: boolean
      call: {
        sid: string
        status: string
        to: string
        from: string
      }
    }>('/api/make-call', {
      method: 'POST',
      body: {
        to: makeCallForm.value.recipientPhone,
        instructions: agentDetails.value.instructions,
        language: agentDetails.value.language,
        voice: agentDetails.value.voice
      }
    })
    console.log("📞 Call response:", response)

    toast.add({
      title: 'Success',
      description: `Call initiated successfully! Call SID: ${response.call.sid}`,
      color: 'success'
    })

  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || error.message || 'Failed to make call',
      color: 'error'
    })
  } finally {
    isMakingCall.value = false
  }
}

const handleSaveSettings = async () => {
  isSavingSettings.value = true

  try {

    const agentSettings = {
      instructions: agentDetails.value.instructions,
      language: agentDetails.value.language,
      voice: agentDetails.value.voice
    }

    await $fetch('/api/agent-settings', {
      method: 'POST',
      body: agentSettings
    })

    console.log("📤 Agent settings saved:", agentSettings)

    toast.add({
      title: 'Success',
      description: 'Agent details settings saved successfully. These settings will be used for all calls.',
      color: 'success'
    })

    // Note: In a production app, you'd want to store this configuration
    // (e.g., in a database) and retrieve it in openai-sip.post.ts based on the call
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || error.message || 'Failed to save settings',
      color: 'error'
    })
  } finally {
    isSavingSettings.value = false
  }
}
</script>

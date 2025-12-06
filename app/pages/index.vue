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
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
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
const selectedTemplate = ref<'marocTelecom' | 'nike' | 'bancoSabadell'>('nike')

// Prebuilt instruction templates
const instructionTemplates = {
  marocTelecom: `# Personality & Tone
## Personality
- Professional, helpful, and patient telecommunications support agent.
- Represents Maroc Telecom with expertise in telecom services and technical support.
- Knowledgeable about mobile plans, internet packages, and billing inquiries.

## Tone
- Warm, professional, and solution-oriented.
- Patient when explaining technical concepts.
- Empathetic when handling complaints or issues.

## Length
- Keep responses concise: 2-3 sentences per turn.
- Provide clear, actionable information.

## Language
- The conversation will be only in {{language}}.
- Use formal but friendly language appropriate for customer service.
- If the user speaks another language, politely explain that support is available in {{language}}.

## Variety
- Vary your responses to avoid sounding repetitive.
- Use different phrases for greetings, confirmations, and closing.

# Role & Objective
- You are a Maroc Telecom call center agent handling customer inquiries.
- Assist with: mobile plan information, internet package details, billing questions, technical support, service activation, and account management.
- Resolve issues efficiently and escalate complex problems when necessary.

# Conversation Flow
1. **Greeting**
   - Greet the customer warmly and identify yourself as a Maroc Telecom representative.
   - Ask how you can assist them today.

2. **Understanding the Request**
   - Listen carefully to the customer's inquiry or issue.
   - Ask clarifying questions if needed to understand the situation fully.

3. **Providing Assistance**
   - Offer clear solutions or information.
   - Explain options available (plans, packages, services).
   - If technical support is needed, guide them through troubleshooting steps.

4. **Resolution & Follow-up**
   - Confirm that the customer's issue is resolved or question is answered.
   - Offer additional assistance if needed.
   - Thank them for contacting Maroc Telecom.

# Safety & Escalation
- If the customer is frustrated or the issue is complex, offer to escalate to a specialist.
- Always maintain professionalism and empathy.
- If asked for a human agent, politely transfer or schedule a callback.`,

  nike: `# Personality & Tone
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
- You are calling the customer about their recent order of **Nike running shoes** from our website.
- Confirm their order politely and verify basic details (e.g., size, color, delivery).
- After confirmation, introduce a soft upsell: offer a matching **Nike cap** or **tracksuit**, highlighting benefits.
- Never pressure the customer; keep the upsell natural and optional.

# Conversation Flow
1. **Greeting**
   - Start the call with a friendly introduction as a representative from the online store.
   - State that you're calling about their recent Nike shoes order.

2. **Order Confirmation**
   - Confirm: product, size, color, and that shipping is on the way.
   - Ask if everything looks correct.

3. **Upsell Opportunity**
   - After confirmation, offer a small optional recommendation:
     - a **Nike cap** ("great match for running or casual wear")
     - OR a **Nike tracksuit** ("pairs perfectly with the shoes and is on discount")
   - Keep it friendly and light.

4. **Close the Call**
   - Thank the customer for their order.
   - Offer further assistance.
   - End politely.

# Safety & Escalation
- If the user sounds confused, frustrated, or asks for a human, apologize and say you will connect them to a specialist.`,

  bancoSabadell: `# Personality & Tone
## Personality
- Professional, trustworthy, and empathetic banking customer service representative.
- Represents Banco Sabadell with expertise in banking services and customer satisfaction.
- Knowledgeable about accounts, transactions, cards, loans, and digital banking.

## Tone
- Professional yet warm and approachable.
- Patient and understanding when handling concerns.
- Clear and precise when explaining banking procedures.

## Length
- Keep responses clear and concise: 2-3 sentences per turn.
- Provide accurate information without overwhelming the customer.

## Language
- The conversation will be only in {{language}}.
- Use professional banking terminology appropriately.
- If the user speaks another language, politely explain that support is available in {{language}}.

## Variety
- Vary your responses to maintain a natural conversation flow.
- Use different phrases for greetings, confirmations, and closing.

# Role & Objective
- You are a Banco Sabadell customer satisfaction and service support agent.
- Assist with: account inquiries, transaction questions, card services, digital banking support, loan information, and general banking questions.
- Focus on customer satisfaction and resolving issues efficiently.
- Collect feedback on customer experience when appropriate.

# Conversation Flow
1. **Greeting**
   - Greet the customer professionally and identify yourself as a Banco Sabadell representative.
   - Ask how you can assist them today.

2. **Understanding the Request**
   - Listen carefully to understand the customer's inquiry or concern.
   - Ask clarifying questions if needed, while being mindful of security and privacy.

3. **Providing Assistance**
   - Offer clear solutions or information related to their banking needs.
   - Explain available services, options, or next steps.
   - If technical support is needed, guide them through the process.

4. **Satisfaction Check**
   - Confirm that the customer's inquiry has been addressed.
   - Ask if they are satisfied with the service provided.
   - Offer additional assistance if needed.

5. **Closing**
   - Thank them for contacting Banco Sabadell.
   - Remind them they can contact us anytime for further assistance.

# Safety & Escalation
- Always prioritize security and privacy. Never ask for full account numbers or passwords over the phone.
- If the issue requires specialized attention or the customer requests it, offer to escalate to a specialist or branch manager.
- If asked for a human agent, politely transfer or schedule a callback.
- Maintain confidentiality and professionalism at all times.`
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

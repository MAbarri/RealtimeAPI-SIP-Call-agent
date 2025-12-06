// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    externals: {
      inline: ['ws']
    }
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  runtimeConfig: {
    twilioSid: process.env.TWILIO_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioNumber: process.env.TWILIO_NUMBER,
    twimlUrl: process.env.TWIML_URL,
    openaiApiKey: process.env.OPENAI_API_KEY
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  vite: {
    server: {
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        'grizzlier-forthrightly-maci.ngrok-free.dev'
      ]
    }
  }

})

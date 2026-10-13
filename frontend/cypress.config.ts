import { defineConfig } from 'cypress'
import { initPlugin } from '@pixsame/cypress-plugin-visual-regression-diff/plugins'

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'cypress/component/**/*.cy.{ts,tsx}',
    supportFile: 'cypress/support/component.ts',
    setupNodeEvents(on, config) {
      initPlugin(on, config)
    },
  },
})

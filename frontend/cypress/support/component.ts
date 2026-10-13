import { mount } from 'cypress/react'
import '@pixsame/cypress-plugin-visual-regression-diff'

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

Cypress.Commands.add('mount', mount)

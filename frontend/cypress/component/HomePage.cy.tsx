import { ClerkProvider } from '@clerk/react'
import App from '../../src/App'

describe('music diary home page', () => {
  it('opening the home page → shows the diary introduction', () => {
    cy.mount(
      <ClerkProvider publishableKey="pk_test_Y2xlcmsuYWNjb3VudHMuZGV2JA">
        <App />
      </ClerkProvider>,
    )

    cy.get('h1').should('contain.text', 'Some days have')
    cy.get('h1').should('contain.text', 'soundtrack.')
    cy.contains('h2', 'Your listening story starts here.')
    cy.get('body').matchImage()
  })
})

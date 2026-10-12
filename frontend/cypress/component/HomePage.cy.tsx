import App from '../../src/App'

describe('music diary home page', () => {
  it('introduces the diary and explains the first step', () => {
    cy.mount(<App />)

    cy.get('h1').should('contain.text', 'Some days have')
    cy.get('h1').should('contain.text', 'soundtrack.')
    cy.contains('h2', 'Your listening story starts here.')
    cy.contains('Spotify connection is coming soon.')
  })
})

describe('Prise de contact', () => {
  it('permet à un utilisateur d\'envoyer un message via le formulaire de contact et de voir une confirmation', () => {

    cy.visit('/')

    cy.get('[data-cy="contact-form"]').should('be.visible')

    cy.get('[data-cy="contact-lastname"]').type('Dupont')
    cy.get('[data-cy="contact-firstname"]').type('Jean')
    cy.get('[data-cy="contact-email"]').type('jean.dupont@example.com')
    cy.get('[data-cy="contact-message"]').type('Bonjour, je souhaite avoir plus d\'informations.')

    cy.get('[data-cy="contact-type"]').find('[data-testid="collapse-button-testid"]').click()
    cy.get('[data-cy="contact-type"]').contains('li', 'Entreprise').click()

    cy.get('[data-cy="contact-submit"]').click()

    cy.get('[data-cy="contact-success"]').should('be.visible')
    cy.get('[data-cy="contact-success"]').should('contain', 'Message envoyé !')
  })
})
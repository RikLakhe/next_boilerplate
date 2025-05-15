// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    getByTestId(testId: string): Chainable<JQuery<HTMLElement>>
    shouldExist(): Chainable<JQuery<HTMLElement>>
    shouldBeVisible(): Chainable<JQuery<HTMLElement>>
  }
}

// Example of a custom command
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`)
})

// Example of a custom command to check if element exists
Cypress.Commands.add('shouldExist', { prevSubject: 'element' }, (subject) => {
  return cy.wrap(subject).should('exist')
})

// Example of a custom command to check if element is visible
Cypress.Commands.add('shouldBeVisible', { prevSubject: 'element' }, (subject) => {
  return cy.wrap(subject).should('be.visible')
})

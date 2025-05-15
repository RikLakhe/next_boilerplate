describe('Master Data Management', () => {
  beforeEach(() => {
    // Assuming we have a login command
    cy.login('test@example.com', 'password123')
    cy.visit('/master-data')
  })

  it('should display master data list', () => {
    cy.get('[data-testid="master-data-list"]').should('exist')
    cy.get('[data-testid="master-data-item"]').should('have.length.at.least', 1)
  })

  it('should create new master data', () => {
    cy.get('[data-testid="add-master-data-btn"]').click()

    // Fill in the form
    cy.get('input[name="name"]').type('Test Master Data')
    cy.get('input[name="code"]').type('TEST001')
    cy.get('textarea[name="description"]').type('Test Description')

    // Submit the form
    cy.get('button[type="submit"]').click()

    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible')

    // Verify new item in list
    cy.get('[data-testid="master-data-list"]')
      .should('contain', 'Test Master Data')
  })

  it('should update existing master data', () => {
    // Click edit on first item
    cy.get('[data-testid="master-data-item"]').first()
      .find('[data-testid="edit-btn"]').click()

    // Update the form
    cy.get('input[name="name"]').clear().type('Updated Master Data')
    cy.get('textarea[name="description"]').clear().type('Updated Description')

    // Submit the form
    cy.get('button[type="submit"]').click()

    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible')

    // Verify updated item in list
    cy.get('[data-testid="master-data-list"]')
      .should('contain', 'Updated Master Data')
  })

  it('should delete master data', () => {
    // Click delete on first item
    cy.get('[data-testid="master-data-item"]').first()
      .find('[data-testid="delete-btn"]').click()

    // Confirm deletion
    cy.get('[data-testid="confirm-delete-btn"]').click()

    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible')
  })
})

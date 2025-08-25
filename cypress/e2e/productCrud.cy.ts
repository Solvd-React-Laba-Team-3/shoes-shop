const productName = 'End to end test';
const credentials = {
  email: 'test@email.com',
  password: 'password',
};

describe('Main flow', () => {
  it('It should allow user to buy shoes', () => {
    cy.viewport(1920, 1080);
    cy.visit('/');
    cy.contains('Sign in').click();
    cy.get('input[name="email"]').type(credentials.email);
    cy.get('input[name="password"]').type(credentials.password);
    cy.contains('Sign in').click();
    cy.intercept('/api/auth/callback/credentials');

    cy.contains('Add Product').click();
    cy.get('input[name="name"]').type(productName);
    cy.get('input[name="price"]').type('200');
    cy.contains('Select color').click();
    cy.contains('Red').click();
    cy.contains('Select gender').click();
    cy.contains('Men').click();
    cy.contains('Select brand').click();
    cy.contains('Nike').click();
    cy.contains('36').click();
    cy.contains('37').click();
    cy.contains('38').click();
    cy.contains('39').click();
    cy.contains('40').click();

    cy.contains('Drop your image here').selectFile(
      [
        'cypress/fixtures/images/nike1.jpg',
        'cypress/fixtures/images/nike2.jpg',
        'cypress/fixtures/images/nike3.avif',
        'cypress/fixtures/images/nike4.avif',
      ],
      { action: 'drag-drop' }
    );

    cy.get('textarea[name="description"]').type(
      'End to end tests sample product'
    );

    cy.contains('Save').click();
    cy.get('[data-cy="actionMenu"]').first().click();
    cy.contains('Edit').click();

    cy.get('textarea[name="description"]')
      .clear()
      .type('The most awesome pair of shoes you can have!');
    cy.contains('Save').click();
    cy.get('[data-cy="actionMenu"]').first().click();
    cy.contains('Duplicate').click();

    cy.get('[data-cy="actionMenu"]').first().click();
    cy.contains('Delete').click();
    cy.get('[data-cy="deleteItem"]').click();

    cy.intercept('https://shoes-shop-strapi.herokuapp.com/api/users/me**').as(
      'invalidateCache'
    );
    cy.wait('@invalidateCache');

    cy.get('[data-cy="actionMenu"]').click();
    cy.contains('Delete').click();
    cy.get('[data-cy="deleteItem"]').click();
  });
});

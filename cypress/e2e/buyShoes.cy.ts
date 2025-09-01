describe('Main flow', () => {
  it('It should allow user to buy shoes', () => {
    cy.viewport(1920, 1080);
    cy.visit('/');
    cy.fixture('credentials').then((credentials) => {
      cy.contains('Sign in').click();
      cy.get('input[name="email"]').type(credentials.email);
      cy.get('input[name="password"]').type(credentials.password);
      cy.contains('Sign in').click();
    });

    cy.intercept(
      'https://shoes-shop-strapi.herokuapp.com/api/products?filters%5Bname%5D%5B%24contains%5D=Air%20Jordan&pagination%5Bpage%5D=1&pagination%5BpageSize%5D=25&populate=*'
    ).as('search-products');
    const searchBar = cy.get('[data-testid="search-input"');
    searchBar.click();
    searchBar.type('Air Jordan{enter}');
    cy.wait('@search-products');

    cy.get('[data-cy="product-name"]').first().click();
    cy.get('.MuiToggleButton-root:not([disabled])')
      .should('be.visible')
      .first()
      .click();
    cy.contains('Add to Bag').click({ force: true });
    cy.get('[title="Go to Cart"]').click();
    cy.get('[data-cy="increaseButton"]').click();
    cy.contains('Do you have a promo code?').click();
    cy.get('input[name="promoCode"]').type('free10{enter}');
    cy.contains('Checkout').click();
    cy.get('[name="name"]').type('Test');
    cy.get('[name="surname"]').type('User');
    cy.get('[name="phone"]').type('55123456789');
    cy.contains('Select country').click();
    cy.contains('Brazil').click();
    cy.get('[name="city"]').type('São Paulo');
    cy.get('[name="zipCode"]').type('59999999');
    cy.get('[name="address"]').type('Mock Address');
    cy.contains('Confirm & Pay').click();
  });
});

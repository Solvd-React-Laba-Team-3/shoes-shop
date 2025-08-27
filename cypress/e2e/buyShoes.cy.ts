describe('Main flow', () => {
  it('It should allow user to buy shoes', () => {
    cy.viewport(1920, 1080);
    cy.visit('/');
    const searchBar = cy.get('[data-testid="search-input"');
    searchBar.click();
    searchBar.type('Air Jordan{enter}');

    cy.intercept(
      'https://shoes-shop-strapi.herokuapp.com/api/products?filters%5Bname%5D%5B%24contains%5D=Air%20Jordan&pagination%5Bpage%5D=1&pagination%5BpageSize%5D=25&populate=*'
    ).as('search-products');
    cy.wait('@search-products');
    cy.contains('Air Jordan').click();
    cy.get('.MuiToggleButton-root:not([disabled])').first().click();
    cy.contains('Add to Bag').click();
    cy.get('[title="Go to Cart"]').click();
    cy.get('[data-cy="increaseButton"]').click();
    cy.contains('Do you have a promo code?').click();
    cy.get('input[name="promoCode"]').type('free10{enter}');
    cy.contains('Checkout').click();
    cy.contains('Go to login').click();
    cy.get('input[name="email"]').type('test@email.com');
    cy.get('input[name="password"]').type('password');
    cy.contains('Sign in').click();
    cy.intercept('/api/auth/callback/credentials').as('login');
    cy.wait('@login').then((interception) => {
      assert.equal(interception?.response?.statusCode, 200);
    });
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

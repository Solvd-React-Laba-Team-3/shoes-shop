describe('Login flow', () => {
  it('It should not allow user login with invalid email', () => {
    cy.visit('/auth/sign-in');
    cy.get('input[name="email"]').type('wrong@email');
    cy.get('input[name="password"]').type('password');
    cy.contains('Sign in').click();

    cy.contains('Invalid email address').should('be.visible');
  });

  it('It should not allow user login with invalid password', () => {
    cy.visit('/auth/sign-in');
    cy.get('input[name="email"]').type('wrong@email');
    cy.get('input[name="password"]').type('pass');
    cy.contains('Sign in').click();

    cy.contains('Password must be at least 6 characters').should('be.visible');
  });

  it('It should fail with wrong credentials', () => {
    cy.visit('/auth/sign-in');
    cy.get('input[name="email"]').type('test@gmail.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.contains('Sign in').click();

    cy.contains('Invalid identifier or password').should('be.visible');
  });

  it('It should fail with not verified e-mail address', () => {
    cy.visit('/auth/sign-in');
    cy.get('input[name="email"]').type('test2@email.com');
    cy.get('input[name="password"]').type('password');
    cy.contains('Sign in').click();
    cy.intercept('');

    cy.contains('Your account email is not confirmed').should('be.visible');
  });

  it('It should log in with correct credentials', () => {
    cy.visit('/auth/sign-in');
    cy.get('input[name="email"]').type('jefferson.fl123@gmail.com');
    cy.get('input[name="password"]').type('Test1234');
    cy.contains('Sign in').click();
    cy.intercept('/api/auth/callback/credentials').as('login');

    cy.wait('@login').then((interception) => {
      assert.equal(interception?.response?.statusCode, 200);
    });
  });
});

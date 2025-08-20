module.exports = {
  routes: [
    {
      method: 'POST', 
      path: '/auth/google-custom',
      handler: 'google-custom.login', 
      config: {
        auth: false,
      },
    },
  ],
};

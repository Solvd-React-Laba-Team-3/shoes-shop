'use strict';

module.exports = {
  async login(ctx) {
    const { email, name } = ctx.request.body;
    if (!email || !name) {
      return ctx.badRequest('Email and name are required');
    }

    let user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { email },
    });

    if (!user) {
      user = await strapi.db.query('plugin::users-permissions.user').create({
        data: {
          username: name,
          email,
          provider: 'google',
          confirmed: true,
        },
      });
    }

    const jwt = strapi
      .plugin('users-permissions')
      .service('jwt')
      .issue({ id: user.id });

    ctx.send({ jwt, user });
  },
};

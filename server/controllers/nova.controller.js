'use strict';

module.exports = ({ strapi }) => ({
  async getConfig(ctx) {
    const config = await strapi
      .plugin('nova-datas-mocker')
      .service('datasMockerServices')
      .getConfig();
    ctx.send(config);
  },

  async updateConfig(ctx) {
    const config = await strapi
      .plugin('nova-datas-mocker')
      .service('datasMockerServices')
      .updateConfig(ctx);
    ctx.send(config);
  },
});

'use strict';

const { pluginId } = require('../utils/pluginId');

module.exports = ({ strapi }) => ({
  async getConfigPlugin(ctx) {
    const config = await strapi.plugin(pluginId).service('datasMockerServices').getConfigPlugin();
    ctx.send(config);
  },

  async isMockEnabled(ctx) {
    const config = await strapi.plugin(pluginId).service('datasMockerServices').isMockEnabled();
    ctx.send(config);
  },

  async getConfigStore(ctx) {
    const config = await strapi.plugin(pluginId).service('datasMockerServices').getConfigStore();
    ctx.send(config);
  },

  async updateConfigStore(ctx) {
    const config = await strapi
      .plugin(pluginId)
      .service('datasMockerServices')
      .updateConfigStore(ctx);
    ctx.send(config);
  },
});

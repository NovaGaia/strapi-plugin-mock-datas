'use strict';

const pluginId = require('../../admin/src/utils/pluginId');

module.exports = ({ strapi }) => ({
  async getConfig(ctx) {
    const config = await strapi.plugin(pluginId).service('datasMockerServices').getConfig();
    ctx.send(config);
  },

  async updateConfig(ctx) {
    const config = await strapi.plugin(pluginId).service('datasMockerServices').updateConfig(ctx);
    ctx.send(config);
  },
});

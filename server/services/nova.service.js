'use strict';

const pluginId = require('../../admin/src/utils/pluginId');

module.exports = ({ strapi }) => ({
  getConfigPlugin() {
    return strapi.config.get(`plugin.${pluginId}`);
  },
  getConfigStore() {
    try {
      const pluginStore = strapi.store({
        environment: strapi.config.environment,
        type: 'plugin',
        name: pluginId,
      });

      return pluginStore.get({ key: 'novaMockConfig' });
    } catch (error) {
      strapi.log.error(error.message);
      return {
        error:
          'An error occurred while fetching Nova Datas Mocker config. Please try after some time',
      };
    }
  },

  updateConfigStore(ctx) {
    try {
      const reqBody = ctx.request.body;
      const data = {
        mockEnabled: reqBody.mockEnabled,
      };
      const pluginStore = strapi.store({
        environment: strapi.config.environment,
        type: 'plugin',
        name: pluginId,
      });

      return pluginStore.set({
        key: 'novaMockConfig',
        value: data,
      });
    } catch (error) {
      strapi.log.error(error.message);
      return {
        error:
          'An error occurred while updting the Nova Datas Mocker config. Please try after some time',
      };
    }
  },
});

'use strict';

const { pluginId } = require('../utils/pluginId');
const _ = require('lodash');

module.exports = ({ strapi }) => ({
  getConfigPlugin() {
    return strapi.config.get(`plugin.${pluginId}`);
  },
  isMockEnabled() {
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
  getAllStrapiAPIs() {
    let apis = [];
    const apisList = _.keys(strapi.api);
    if (apisList)
      apisList.forEach((element) => {
        const obj = strapi.api[element].contentTypes[element].uid;
        apis.push({ prettyName: element, apiName: obj });
      });
    return apis;
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
        addImageInRichtextEnabled: reqBody.addImageInRichtextEnabled,
      };
      const pluginStore = strapi.store({
        environment: strapi.config.environment,
        type: 'plugin',
        name: pluginId,
      });

      return pluginStore.set({
        key: 'novaMockConfig',
        value: reqBody,
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

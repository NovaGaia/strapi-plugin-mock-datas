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
  async getAllStrapiAPIs() {
    let apis = [];
    const apisList = _.keys(strapi.api);
    // if (!apisList || apisList.length === 0) {
    //   return [];
    // }

    if (apisList) {
      await Promise.all(
        apisList.map(async (element) => {
          const {
            uid,
            apiName,
            info,
            options,
            options: { draftAndPublish },
          } = strapi.api[element].contentTypes[element];
          const nbEntitySaved = await strapi.db.query(uid).count();
          let nbEntityPublished = 'N/A';
          if (draftAndPublish) {
            nbEntityPublished = await strapi.db
              .query(uid)
              .count({ where: { publishedAt: { $ne: null } } });
          }
          const mustWarn =
            nbEntityPublished === 0 || (nbEntityPublished === `N/A` && nbEntitySaved === 0);
          apis.push({
            prettyName: info.displayName,
            apiName: apiName,
            uid: uid,
            options: options,
            description: info.description,
            nbEntitySaved: nbEntitySaved,
            nbEntityPublished: nbEntityPublished,
            mustWarn: mustWarn,
          });
        })
      );
    }
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

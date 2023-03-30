'use strict';
const _ = require('lodash');

const { transform } = require('./middleware/transform');
const { getPluginService } = require('./utils/getPluginService');

module.exports = ({ strapi }) => {
  // get config
  const settings = getPluginService('datasMockerServices').getConfigPlugin();

  // register transforms on all api routes
  const apis = _.get(strapi, ['api'], {});

  for (const ct in apis) {
    // ensure we are only processing direct properties
    if (!Object.hasOwnProperty.call(apis, ct)) {
      continue;
    }

    const uid = _.get(apis, [ct, 'contentTypes', ct, 'uid'], false);

    // skip routes that do not have an associated content type (i.e. routes not using createCoreRouter)
    if (!uid) {
      continue;
    }

    // get APIs to mock
    const apisToMock = _.get(settings, ['apisToMock', uid], false);
    if (!apisToMock && _.isBoolean(apisToMock)) {
      continue;
    }

    const apiRoutes = _.get(apis, [ct, 'routes', ct, 'routes'], []);
    for (let i = 0; i < apiRoutes.length; i++) {
      // ensure path exists
      if (!_.has(apiRoutes[i], 'config')) {
        _.set(strapi, ['api', ct, 'routes', ct, 'routes', i, 'config'], {});
      }

      if (!_.has(apiRoutes[i], ['config', 'middlewares'])) {
        _.set(strapi, ['api', ct, 'routes', ct, 'routes', i, 'config', 'middlewares'], []);
      }
      const datas = {
        apisToMock: uid,
        settings: settings,
      };
      // register route middleware
      strapi.api[ct].routes[ct].routes[i].config.middlewares.push((ctx, next) =>
        transform(strapi, ctx, next, datas)
      );
    }
  }
};

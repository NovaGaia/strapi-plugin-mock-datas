'use strict';

const _ = require('lodash');
const { getPluginService } = require('../utils/getPluginService');

const transform = async (strapi, ctx, next, datas) => {
  datas.settings = getPluginService('datasMockerServices').getConfigPlugin();
  datas.configStore = await getPluginService('datasMockerServices').getConfigStore();

  await next();

  // ensure body exists, occurs on non existent route
  if (!ctx.body) {
    return;
  }

  // ensure no error returned.
  if (!ctx.body.data) {
    return;
  }

  // execute response transforms
  getPluginService('transformServices').transformResponse(ctx, datas);
};

module.exports = { transform };

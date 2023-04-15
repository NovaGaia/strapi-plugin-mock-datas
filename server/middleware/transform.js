'use strict';

const _ = require('lodash');
const { getPluginService } = require('../utils/getPluginService');

const transform = async (strapi, ctx, next, datas) => {
  const tempConfigStore = await getPluginService('datasMockerServices').getConfigStore();

  if (tempConfigStore) {
    datas.configStore = tempConfigStore;
  } else {
    // add default value if settings has never been set.
    datas.configStore = { mockEnabled: false, addImageInRichtextEnabled: false };
  }

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

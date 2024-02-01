'use strict';

// Add permissions
const RBAC_ACTIONS = [
  {
    section: 'plugins',
    displayName: 'Access',
    uid: 'access',
    pluginName: 'nova-datas-mocker',
  },
];
module.exports = async ({ strapi }) => {
  if (!strapi.plugin('users-permissions')) {
    throw new Error(
      'In order to make the navigation plugin work the users-permissions plugin is required'
    );
  }
  await strapi.admin.services.permission.actionProvider.registerMany(
    RBAC_ACTIONS
  );
};

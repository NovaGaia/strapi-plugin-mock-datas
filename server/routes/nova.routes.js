'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/configPlugin',
      handler: 'novaController.getConfigPlugin',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/configStore',
      handler: 'novaController.getConfigStore',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/configStore/update',
      handler: 'novaController.updateConfigStore',
      config: {
        policies: [],
      },
    },
  ],
};

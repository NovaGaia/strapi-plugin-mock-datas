'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/config',
      handler: 'novaController.getConfig',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/config/update',
      handler: 'novaController.updateConfig',
      config: {
        policies: [],
      },
    },
  ],
};

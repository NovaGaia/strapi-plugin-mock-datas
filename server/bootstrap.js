'use strict';
const { getFullPopulateObject, getFullSchema, getMockedObject } = require('./helpers');

module.exports = ({ strapi }) => {
  const defaultDepth = strapi.plugin('strapi-plugin-mock-datas')?.config('defaultDepth');
  const consoleLog = strapi.plugin('strapi-plugin-mock-datas')?.config('consoleLog');
  // Subscribe to the lifecycles that we are intrested in.
  strapi.db.lifecycles.subscribe((event) => {
    if (event.action === 'afterFindMany' || event.action === 'afterFindOne') {
      if (
        event.model.uid.startsWith(`admin::`) ||
        event.model.uid.startsWith(`strapi::`) ||
        event.model.uid.startsWith(`plugin::users-permissions`) ||
        event.model.uid.startsWith(`plugin::i18n`)
      ) {
        // don't change result...
      } else {
        const schema = getFullSchema(event.model.uid, defaultDepth);
        if (schema !== undefined && consoleLog)
          console.log(`returned schema: ${JSON.stringify(schema)}`);
        const mockedObject = getMockedObject(schema);
        console.log(`returned mockedObject: ${JSON.stringify(mockedObject)}`);
        if (event.result) {
          event.result.length = 1;
          // console.log(typeof event.result);
          // event.result[0] = mockedObject;
          console.log(`event.result`, JSON.stringify(event.result));
          // console.log(`event`, event);
        }
      }

      // don't do event.model.uid === 'admin::api-token'
      // event.attributes => contient le schema de l'objet
      // event.result => [] d'objet
    }
  });
};

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
        console.log(JSON.stringify(strapi.getModel(event.model.uid).__schema__.attributes));
        const schema = getFullSchema(event.model.uid, defaultDepth);
        if (schema !== undefined && consoleLog)
          console.log(`returned schema: ${JSON.stringify(schema)}`);
        const mockedObject = getMockedObject(schema, null, defaultDepth);
        if (mockedObject !== undefined && consoleLog)
          console.log(`returned mockedObject: ${JSON.stringify(mockedObject)}`);
        // TODO: afterFindOne (single Type), ce ne doit pas être tableau, normalement...
        if (event.result && event.action === 'afterFindMany') {
          // Send only one result.
          event.result.length = 1;
          event.result[0] = mockedObject;
          // event.result.push(mockedObject);
        }
      }
    }
  });
};

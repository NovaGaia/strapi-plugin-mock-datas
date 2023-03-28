'use strict';
const { getFullSchema, getMockedObject } = require('./helpers');
// const { pluginId } = require('./pluginId');

module.exports = ({ strapi }) => {
  const defaultDepth = strapi.plugin('nova-datas-mocker')?.config('defaultDepth');
  const consoleLog = strapi.plugin('nova-datas-mocker')?.config('consoleLog');
  const addedPlugins = strapi.plugin('nova-datas-mocker')?.config('addedPlugins');
  // Subscribe to the lifecycles that we are intrested in.
  strapi.db.lifecycles.subscribe((event) => {
    if (event.action === 'afterFindMany' || event.action === 'afterFindOne') {
      if (process.env.NODE_ENV === 'production') {
        return event;
      } else {
        console.warn(`*************** FAKE DATA SENT BY API *********************`);
      }
      if (
        // TODO: find all plugins
        event.model.uid.startsWith(`admin::`) ||
        event.model.uid.startsWith(`strapi::`) ||
        event.model.uid.startsWith(`plugin::users-permissions`) ||
        event.model.uid.startsWith(`plugin::i18n`) ||
        event.model.uid.startsWith(`plugin::nova-datas-mocker`) ||
        addedPlugins.includes(event.model.uid)
      ) {
        // don't change result...
      } else {
        consoleLog &&
          console.log(
            `Inital Schema`,
            JSON.stringify(strapi.getModel(event.model.uid).__schema__.attributes)
          );
        const schema = getFullSchema(event.model.uid, defaultDepth);
        if (schema !== undefined && consoleLog)
          console.log(`returned schema: ${JSON.stringify(schema)}`);
        const mockedObject = getMockedObject(schema, null, defaultDepth);
        if (mockedObject !== undefined && consoleLog)
          console.log(`returned mockedObject: ${JSON.stringify(mockedObject)}`);
        if (event.result && event.action === 'afterFindMany') {
          // Send only one result.
          event.result.length = 1;
          event.result[0] = mockedObject;
        } else if (event.result && event.action === 'afterFindOne') {
          // result is protected, we clean it
          for (const [key, value] of Object.entries(event.result)) {
            event.result[key] = null;
          }
          // the we fill it with the mockedObject
          for (const [key, value] of Object.entries(mockedObject)) {
            event.result[key] = value;
          }
        }
      }
    }
  });
};

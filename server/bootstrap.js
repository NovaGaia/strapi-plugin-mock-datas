'use strict';
const { getFullSchema, getMockedObject } = require('./helpers');
const pluginId = require('../admin/src/utils/pluginId');

const getConfig = (strapi) => {
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
};

const processMock = async (event, strapi) => {
  const defaultDepth = strapi.plugin(pluginId)?.config('defaultDepth');
  const consoleLog = strapi.plugin(pluginId)?.config('consoleLog');

  strapi.log.warn(
    `*************** ${event.model.uid} IS SENDING MOCKED DATAS /!\\  *********************`
  );
  consoleLog &&
    strapi.log.log(
      `Inital Schema`,
      JSON.stringify(strapi.getModel(event.model.uid).__schema__.attributes)
    );
  const schema = getFullSchema(event.model.uid, defaultDepth);
  if (schema !== undefined && consoleLog)
    strapi.log.log(`returned schema: ${JSON.stringify(schema)}`);
  const mockedObject = getMockedObject(schema, null, defaultDepth);
  if (mockedObject !== undefined && consoleLog)
    strapi.log.log(`returned mockedObject: ${JSON.stringify(mockedObject)}`);
  if (event.result && event.action === 'afterFindMany') {
    // Send only one result.
    event.result.length = 1;
    event.result[0] = mockedObject;
  } else if (event.result && event.action === 'afterFindOne') {
    strapi.log.warn(
      `*************** ${event.model.uid} HAS NOT BEEN MOCKED! Nova Datas Mock currently working only on collection :(`
    );
    // event.result = mockedObject;
    // result is protected, we clean it
    for (const [key] of Object.entries(event.result)) {
      delete event.result[key];
    }
    // the we fill it with the mockedObject
    for (const [key, value] of Object.entries(mockedObject)) {
      event.result[key] = value;
    }
  }
  return event;
};

module.exports = ({ strapi }) => {
  const consoleLog = strapi.plugin(pluginId)?.config('consoleLog');
  const addedPlugins = strapi.plugin(pluginId)?.config('addedPlugins');

  // Subscribe to the lifecycles db events that we are intrested in.
  strapi.db.lifecycles.subscribe((event) => {
    // Prevent doing in production
    // and prevent to doing on current plugin
    if (process.env.NODE_ENV === 'production' || event.model.uid === `plugin::nova-datas-mocker`) {
      return event;
    }
    // Do only accurate events
    if (event.action === 'afterFindMany' || event.action === 'afterFindOne') {
      // Don't do this and all plugins ref in pluginConfig.options.addedPlugins →
      if (
        event.model.uid.startsWith(`admin::`) ||
        event.model.uid.startsWith(`strapi::`) ||
        event.model.uid.startsWith(`plugin::users-permissions`) ||
        event.model.uid.startsWith(`plugin::i18n`) ||
        event.model.uid.startsWith(`plugin::nova-datas-mocker`) ||
        addedPlugins.includes(event.model.uid)
      ) {
        // don't change result...
      } else {
        getConfig(strapi)
          .then((response) => {
            consoleLog && strapi.log.log(`mockEnabled > ${response.mockEnabled}`);
            if (response.mockEnabled)
              processMock(event, strapi).then(() => {
                return event;
              });
          })
          .catch(strapi.log.error);
      }
    }
  });
};

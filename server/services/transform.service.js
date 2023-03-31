const { pluginId } = require('../utils/pluginId');
const { getFullSchema, getMockedObject } = require('../helpers');
const _ = require('lodash');

module.exports = ({ strapi }) => ({
  transformResponse(ctx, datas) {
    const {
      configStore: { mockEnabled },
      apisToMock: modelUid,
      settings: { defaultDepth, customFields, consoleLog },
    } = datas;
    if (mockEnabled) {
      strapi.log.warn(`*************** ${modelUid} IS SENDING MOCKED DATAS /!\\ ***************`);
      consoleLog && strapi.log.info(`*************** START ${modelUid} ***************`);
      consoleLog && strapi.log.debug(`*************** GENERATING SCHEMA ***************`);
      const schema = getFullSchema(modelUid, defaultDepth, consoleLog, customFields);
      consoleLog && strapi.log.debug(`*************** GENERATING MOCK ***************`);
      const mockedObject = getMockedObject(schema, null, defaultDepth, consoleLog);
      consoleLog && strapi.log.debug(`*************** APPLYING MOCK ***************`);
      // single
      if (_.has(ctx.body.data, 'attributes')) {
        ctx.body.data = { id: 1, attributes: { ...ctx.body.data.attributes, ...mockedObject } };
      }

      // collection
      if (
        _.isArray(ctx.body.data) &&
        ctx.body.data.length &&
        _.has(_.head(ctx.body.data), 'attributes')
      ) {
        ctx.body.data = [
          { id: 1, attributes: { ...ctx.body.data[0].attributes, ...mockedObject } },
        ];
      }
      consoleLog && strapi.log.info(`*************** END ${modelUid} ***************`);
      return null;
    }
  },
});

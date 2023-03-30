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
      strapi.log.warn(
        `*************** ${modelUid} IS SENDING MOCKED DATAS /!\\  *********************`
      );
      const schema = getFullSchema(modelUid, defaultDepth, consoleLog, customFields);
      const mockedObject = getMockedObject(schema, null, defaultDepth, consoleLog);
      // single
      if (_.has(ctx.body.data, 'attributes')) {
        consoleLog && console.log(`In transformResponse > is single type`, ctx.body.data);
        ctx.body.data = { id: 1, attributes: mockedObject };
      }

      // collection
      if (
        _.isArray(ctx.body.data) &&
        ctx.body.data.length &&
        _.has(_.head(ctx.body.data), 'attributes')
      ) {
        consoleLog && console.log(`In transformResponse > is collection type`, ctx.body.data);
        ctx.body.data = [{ id: 1, attributes: mockedObject }];
      }
      return null;
    }
  },
});

const { pluginId } = require('../utils/pluginId');
const { getFullSchema, getMockedObject } = require('../helpers');

module.exports = ({ strapi }) => ({
  transformResponse(ctx, datas) {
    const {
      configStore: { mockEnabled },
      apisToMock: modelUid,
      defaultDepth,
    } = datas;
    if (mockEnabled) {
      const { kind } = strapi.getModel(modelUid);
      const schema = getFullSchema(modelUid, defaultDepth);
      const mockedObject = getMockedObject(schema, null, defaultDepth);
      const mockedBody = {};
      if (kind === `singleType`) {
        mockedBody = { id: 1, attributes: mockedObject };
      } else if (kind === `collectionType`) {
        mockedBody = {
          data: [mockedObject],
          meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 1 } },
        };
      }
      ctx.body = mockedBody;
      //   console.log(`CTX`, ctx);
      return null;
    }
  },
});

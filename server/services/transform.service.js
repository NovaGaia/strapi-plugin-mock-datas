const { getFullSchema, getMockedObject } = require('../helpers');
const _ = require('lodash');

module.exports = ({ strapi }) => ({
  transformResponse(ctx, datas) {
    const {
      apisToMock: modelUid,
      settings: { defaultDepth, customFields, consoleLog, imageNameToUse },
    } = datas;
    const apisToMock = _.get(datas.configStore, modelUid, false);
    if (datas.configStore && datas.configStore.mockEnabled && apisToMock) {
      strapi.log.warn(`*************** ${modelUid} IS SENDING MOCKED DATAS /!\\ ***************`);
      consoleLog && strapi.log.info(`*************** START ${modelUid} ***************`);
      consoleLog && strapi.log.debug(`*************** GENERATING SCHEMA ***************`);
      const schema = getFullSchema(modelUid, defaultDepth, consoleLog, customFields);
      consoleLog && strapi.log.debug(`*************** GENERATING MOCK ***************`);
      const mockedObject = getMockedObject(
        schema,
        null,
        defaultDepth,
        consoleLog,
        datas.configStore.addImageInRichtextEnabled,
        imageNameToUse
      );
      consoleLog && strapi.log.debug(`*************** APPLYING MOCK ***************`);
      const model = strapi.getModel(modelUid);
      if (model.kind === `collectionType`) {
        // collectionType
        if (
          _.isArray(ctx.body.data) &&
          ctx.body.data.length &&
          _.has(_.head(ctx.body.data), 'attributes')
        ) {
          ctx.body.data = [
            { id: 1, attributes: { ...ctx.body.data[0].attributes, ...mockedObject } },
          ];
        } else {
          strapi.log.warn(
            `YOUR COLLECTION \`${modelUid}\` HAS NO SAVED DATAS YET, IF YOU ADD SOME LOGIC IN CONTROLLER, THOSE ARE MISSING! FILL REQUIRED FIELDS AND SAVE TO REMOVE THIS WARN`
          );
          ctx.body.data = [{ id: 1, attributes: { ...mockedObject } }];
        }
      } else {
        // singleType
        if (_.has(ctx.body.data, 'attributes')) {
          ctx.body.data = { id: 1, attributes: { ...ctx.body.data.attributes, ...mockedObject } };
        } else {
          strapi.log.warn(
            `YOUR SINGLE \`${modelUid}\` HAS NO SAVED DATAS YET, IF YOU ADD SOME LOGIC IN CONTROLLER, THOSE ARE MISSING! FILL REQUIRED FIELDS AND SAVE TO REMOVE THIS WARN`
          );
          ctx.body.data = { id: 1, attributes: { ...mockedObject } };
        }
      }

      // single
      // if (_.has(ctx.body.data, 'attributes')) {
      //   ctx.body.data = { id: 1, attributes: { ...ctx.body.data.attributes, ...mockedObject } };
      // }

      // collection
      // if (
      //   _.isArray(ctx.body.data) &&
      //   ctx.body.data.length &&
      //   _.has(_.head(ctx.body.data), 'attributes')
      // ) {
      //   ctx.body.data = [
      //     { id: 1, attributes: { ...ctx.body.data[0].attributes, ...mockedObject } },
      //   ];
      // }
      consoleLog && strapi.log.info(`*************** END ${modelUid} ***************`);
      return null;
    }
  },
});

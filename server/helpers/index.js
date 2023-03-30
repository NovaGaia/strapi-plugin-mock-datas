const { isEmpty } = require('lodash/fp');
const { faker } = require('@faker-js/faker');
const { fakeMarkdown, fakeImage } = require('./fakeDatas');

const getModelPopulationAttributes = (model) => {
  if (model.uid === 'plugin::upload.file') {
    const { related, ...attributes } = model.attributes;
    return attributes;
  }

  return model.attributes;
};

/**
 * Methode to generate schema
 * @param {String} modelUid Model name
 * @param {Int} maxDepth Deep of the schema
 * @returns {}
 */
const getFullSchema = (modelUid, maxDepth = 20, consoleLog = false, customFields = {}) => {
  if (maxDepth <= 1) {
    return null;
  }

  if (modelUid === 'admin::user') {
    return null;
  }

  consoleLog &&
    strapi.log.info(
      `Schema > Enter in > getFullSchema with modelUid: ${modelUid} | maxDepth = ${maxDepth}`
    );
  const schema = {};
  const model = strapi.getModel(modelUid);
  for (const [key, value] of Object.entries(getModelPopulationAttributes(model))) {
    if (value) {
      if (value.customField) {
        consoleLog &&
          strapi.log.debug(
            `Schema > Do > ${modelUid} > ${key} is customField ${value.customField}`
          );
        schema[key] = customFields[value.customField];
      } else {
        consoleLog && strapi.log.debug(`Schema > Do > ${modelUid} > ${key} is ${value.type}`);
        switch (value.type) {
          case 'component':
            const componentPopulate = getFullSchema(
              value.component,
              maxDepth - 1,
              consoleLog,
              customFields
            );
            isEmpty(componentPopulate)
              ? null
              : (schema[key] = value.repeatable
                  ? [{ ...componentPopulate, id: 1 }]
                  : componentPopulate);
            break;
          case 'media':
            isEmpty(value)
              ? null
              : (schema[key] = value.multiple ? `media_multiple` : `media_simple`);
            break;
          case 'relation':
            const relationPopulate = getFullSchema(
              value.target,
              key === 'localizations' && maxDepth > 2 ? 1 : maxDepth - 1,
              consoleLog,
              customFields
            );
            isEmpty(relationPopulate) ? null : (schema[key] = { ...relationPopulate, id: 1 });
            break;
          case 'dynamiczone':
            const dynamicZonePopulate = [];
            let count = 1;
            value.components.forEach((item) => {
              const obj = getFullSchema(item, maxDepth - 1, consoleLog, customFields);
              if (obj) {
                obj[`__component`] = item;
                obj[`id`] = count;
                dynamicZonePopulate.push(obj);
                count++;
              }
            });
            isEmpty(dynamicZonePopulate) ? null : (schema[key] = dynamicZonePopulate);
            break;

          default:
            schema[key] = value.type;
            break;
        }
      }
    }
  }
  return isEmpty(schema) ? null : { ...schema, id: 1 };
};

/**
 * Methode to generate fake data
 * @param {Object} schema The full schema
 * @param {*} doing This method is recursive, so to know if it is recursive or not
 * @param {*} maxDepth Deep of the fake data
 * @returns {}
 */
const getMockedObject = (schema, doing = null, maxDepth = 20, consoleLog = false) => {
  if (maxDepth <= 1) {
    return null;
  }
  if (!schema) return null;
  if (doing === null) {
    consoleLog && strapi.log.debug(`Enter in > getMockedObject`);
  } else {
    consoleLog && strapi.log.debug(`Mocking > ${doing}`);
  }
  const results = {};
  for (const [key, value] of Object.entries(schema)) {
    if (value) {
      // consoleLog && strapi.log.debug(`Mocking > typeof ${key}: ${typeof value}`);
      if (typeof value === 'object') {
        // consoleLog && strapi.log.debug(`Mocking > isArray ${key}: ${Array.isArray(value)}`);
        if (Array.isArray(value)) {
          const tmpArr = value.map((item) => {
            return getMockedObject(item, key, maxDepth - 1, consoleLog);
          });
          results[key] = tmpArr;
        } else {
          results[key] = getMockedObject(value, key, maxDepth - 1, consoleLog);
        }
      } else {
        switch (value) {
          case `__component`:
            results[key] = value;
            break;

          case `string`:
            results[key] = faker.lorem.words(3);
            break;
          case `text`:
            results[key] = faker.lorem.paragraphs(1);
            break;

          case `richtext`:
            results[key] = fakeMarkdown;
            break;

          case `media_simple`:
            results[key] = fakeImage;
            break;

          case `media_multiple`:
            results[key] = [
              { ...fakeImage, id: 1 },
              { ...fakeImage, id: 2 },
            ];
            break;

          case `json`:
            results[key] = JSON.stringify(faker.datatype.json());
            break;

          case `email`:
            results[key] = faker.internet.email();
            break;

          case `password`:
            results[key] = faker.internet.password();
            break;

          case `uid`:
            results[key] = faker.datatype.uuid();
            break;

          case `boolean`:
            results[key] = faker.datatype.boolean();
            break;

          case `float`:
            results[key] = faker.datatype.float();
            break;

          case `integer`:
            results[key] = 1;
            break;

          case `biginteger`:
            results[key] = '123';
            break;

          case `decimal`:
            results[key] = faker.datatype.number({ min: 10, max: 100, precision: 0.01 });
            break;

          case `enumeration`:
            results[key] = faker.lorem.words(1);
            break;

          case `datetime`:
            results[key] = faker.datatype.datetime();
            break;

          case `date`:
            results[key] = '2023-03-15';
            break;

          case `time`:
            results[key] = '00:05:00.000';
            break;

          default:
            if (key === `__component` || key === `id`) {
              results[key] = value;
            } else {
              strapi.log.warn(`In ${key} > ${value} must be mocked!`);
              results[key] = `todo: ${value}`;
            }
            break;
        }
      }
    }
  }
  if (isEmpty(results)) {
    return null;
  } else {
    return results;
  }
};

module.exports = {
  getFullSchema,
  getMockedObject,
};

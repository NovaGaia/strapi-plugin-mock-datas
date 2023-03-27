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
 * Methode dedicate to generate part of the schema for dynamiczone
 * @param {String} modelUid Model name
 * @param {Int} maxDepth Deep of the schema
 * @returns {}
 */
const getMiniSchema = (modelUid, maxDepth = 20) => {
  if (maxDepth <= 1) {
    return null;
  }
  const schema = {};
  const model = strapi.getModel(modelUid);
  for (const [key, value] of Object.entries(model.attributes)) {
    // TODO: tester avec une relation...
    schema[key] =
      value.type === `component` ? getMiniSchema(value.component, maxDepth - 1) : value.type;
  }
  return schema;
};

/**
 * Methode to generate schema
 * @param {String} modelUid Model name
 * @param {Int} maxDepth Deep of the schema
 * @returns {}
 */
const getFullSchema = (modelUid, maxDepth = 20) => {
  if (maxDepth <= 1) {
    return null;
  }
  const customFields = strapi.plugin('strapi-plugin-mock-datas')?.config('customFields');
  const consoleLog = strapi.plugin('strapi-plugin-mock-datas')?.config('consoleLog');
  if (
    modelUid.startsWith(`admin::`) ||
    modelUid.startsWith(`strapi::`) ||
    modelUid.startsWith(`plugin::users-permissions`) ||
    modelUid.startsWith(`plugin::i18n`)
  ) {
    consoleLog && console.log(`Won't do ${modelUid}`);
    return null;
  }

  consoleLog && console.log(`Enter in > getFullSchema`);
  consoleLog && console.log(`maxDepth = ${maxDepth}`);
  const schema = {};
  const model = strapi.getModel(modelUid);
  for (const [key, value] of Object.entries(getModelPopulationAttributes(model))) {
    if (value) {
      if (value.customField) {
        consoleLog && console.log(`In ${modelUid} > ${key} is customField ${value.customField}`);
        schema[key] = customFields[value.customField];
      } else {
        consoleLog && console.log(`In ${modelUid} > ${key} is ${value.type}`);
        switch (value.type) {
          case 'component':
            schema[key] = getFullSchema(value.component, maxDepth - 1);
            break;
          case 'media':
            schema[key] = `media`;
            break;
          case 'relation':
            const relationPopulate = getFullSchema(
              value.target,
              key === 'localizations' && maxDepth > 2 ? 1 : maxDepth - 1
            );
            schema[key] = isEmpty(relationPopulate) ? null : relationPopulate;
            break;
          case 'dynamiczone':
            const dz = [];
            let count = 1;
            value.components.forEach((item) => {
              const obj = getMiniSchema(item, maxDepth - 1);
              if (obj) {
                obj[`__component`] = item;
                obj[`id`] = count;
                dz.push(obj);
                count++;
              }
            });
            consoleLog && console.log(`output of DZ`, dz);
            schema[key] = isEmpty(dz) ? null : dz;
            break;

          default:
            schema[key] = value.type;
            break;
        }
      }
    }
  }
  return isEmpty(schema) ? null : schema;
};

/**
 * Methode to generate fake data
 * @param {Object} schema The full schema
 * @param {*} doing This method is recursive, so to know if it is recursive or not
 * @param {*} maxDepth Deep of the fake data
 * @returns {}
 */
const getMockedObject = (schema, doing = null, maxDepth = 20) => {
  if (maxDepth <= 1) {
    return null;
  }
  if (!schema) return null;
  const consoleLog = strapi.plugin('strapi-plugin-mock-datas')?.config('consoleLog');
  if (doing === null) {
    consoleLog && console.log(`Enter in > getMockedObject`);
  } else {
    consoleLog && console.log(`Do > ${doing}`);
  }
  const results = {};
  for (const [key, value] of Object.entries(schema)) {
    if (value) {
      consoleLog && console.log(`typeof ${key}: ${typeof value}`);
      if (typeof value === 'object') {
        consoleLog && console.log(`isArray ${key}: ${Array.isArray(value)}`);
        if (Array.isArray(value)) {
          const tmpArr = value.map((item) => {
            console.log(item, key, maxDepth);
            return getMockedObject(item, key, maxDepth - 1);
          });
          results[key] = tmpArr;
        } else {
          results[key] = getMockedObject(value, key, maxDepth - 1);
        }
        doing === null && consoleLog ? console.log(results[key]) : null;
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

          case `media`:
            results[key] = fakeImage;
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

          case `number`:
            results[key] = faker.datatype.number();
            break;

          case `bigint`:
            results[key] = faker.datatype.bigInt();
            break;

          case `enumeration`:
            results[key] = faker.lorem.words(1);
            break;

          case `datetime`:
            results[key] = faker.date.between(
              '2020-01-01T00:00:00.000Z',
              '2030-01-01T00:00:00.000Z'
            );
            break;

          default:
            if (key === `__component` || key === `id`) {
              results[key] = value;
            } else {
              console.warn(`In ${key} > ${value} must be mocked!`);
              results[key] = `todo: ${value}`;
            }
            break;
        }
      }
    }
  }
  if (isEmpty(results)) {
    return null;
  } else if (doing === null) {
    results[`id`] = 1;
    return results;
  } else {
    return results;
  }
};

module.exports = {
  getFullSchema,
  getMockedObject,
};

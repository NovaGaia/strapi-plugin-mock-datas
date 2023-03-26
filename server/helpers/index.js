const { isEmpty, merge } = require('lodash/fp');
const { faker } = require('@faker-js/faker');
const { fakeMarkdown, fakeImage } = require('./fakeDatas');

const getModelPopulationAttributes = (model) => {
  if (model.uid === 'plugin::upload.file') {
    const { related, ...attributes } = model.attributes;
    return attributes;
  }

  return model.attributes;
};

const getFullSchema = (modelUid, maxDepth = 20, informations = {}) => {
  if (maxDepth <= 1) {
    return true;
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
            // console.log(`relationPopulate >`, key, relationPopulate);
            schema[key] = isEmpty(relationPopulate) ? null : relationPopulate;
            break;
          case 'dynamiczone':
            const dz = [];
            let count = 0;
            value.components.forEach((item) => {
              const obj = getFullSchema(item, maxDepth - 1);
              obj[`__component`] = item;
              obj[`id`] = count;
              dz.push(obj);
              count++;
            });
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
const getMockedObject = (schema, doing = null) => {
  if (!schema) return null;
  const consoleLog = strapi.plugin('strapi-plugin-mock-datas')?.config('consoleLog');
  if (doing === null) {
    consoleLog && console.log(`Enter in > getMockedObject`);
  } else {
    consoleLog && console.log(`Do > ${doing}`);
  }
  const results = {};
  // console.log(`results`, results);
  for (const [key, value] of Object.entries(schema)) {
    if (value) {
      // console.log(`typeof value: ${typeof value}`);
      if (typeof value === 'boolean') {
        consoleLog && console.log(`Won't do > ${key}`);
      } else if (typeof value === 'object') {
        results[key] = getMockedObject(value, key);
      } else {
        // console.log(`${key}: ${value}`);
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
            if (key !== `__component`) {
              console.warn(`In ${key} > ${value} must be mocked!`);
              results[key] = `todo: ${value}`;
            } else {
              results[key] = value;
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

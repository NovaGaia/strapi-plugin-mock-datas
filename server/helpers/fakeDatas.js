const pluginId = require('../../admin/src/utils/pluginId');

const fakeMarkdown =
  '{"time":1679820667782,"blocks":[{"id":"v_cAIxUduo","type":"paragraph","data":{"text":"Bonjour, je m\'appelle Renaud, je suis le fondateur de <b>NovaGaïa</b>."}},{"id":"2PkaUL63Vh","type":"paragraph","data":{"text":"Welcome&nbsp;👋"}}],"version":"2.23.2"}';

const fakeImage = {
  data: {
    id: 1,
    attributes: {
      name: '65535_52574134219_483fbd6523_c_640_480_nofilter.jpg',
      alternativeText: null,
      caption: null,
      width: 1600,
      height: 900,
      formats: {
        thumbnail: {
          name: '65535_52574134219_483fbd6523_c_640_480_nofilter.jpg',
          hash: '65535_52574134219_483fbd6523_c_640_480_nofilter',
          ext: '.jpg',
          mime: 'image/jpeg',
          path: null,
          width: 245,
          height: 138,
          size: 8.9,
          url: `https://loremflickr.com/cache/resized/65535_52574134219_483fbd6523_c_640_480_nofilter.jpg`,
        },
        small: {
          name: '65535_52574134219_483fbd6523_c_640_480_nofilter.jpg',
          hash: '65535_52574134219_483fbd6523_c_640_480_nofilter',
          ext: '.jpg',
          mime: 'image/jpeg',
          path: null,
          width: 500,
          height: 281,
          size: 36.38,
          url: 'https://loremflickr.com/cache/resized/65535_52574134219_483fbd6523_c_640_480_nofilter.jpg',
        },
        medium: {
          name: '65535_52574134219_483fbd6523_c_640_480_nofilter.jpg',
          hash: '65535_52574134219_483fbd6523_c_640_480_nofilter',
          ext: '.jpg',
          mime: 'image/jpeg',
          path: null,
          width: 750,
          height: 422,
          size: 84.38,
          url: 'https://loremflickr.com/cache/resized/65535_52574134219_483fbd6523_c_640_480_nofilter.jpg',
        },
        large: {
          name: '65535_52574134219_483fbd6523_c_640_480_nofilter.jpg',
          hash: '65535_52574134219_483fbd6523_c_640_480_nofilter',
          ext: '.jpg',
          mime: 'image/jpeg',
          path: null,
          width: 1000,
          height: 563,
          size: 152.43,
          url: 'https://loremflickr.com/cache/resized/65535_52574134219_483fbd6523_c_640_480_nofilter.jpg',
        },
      },
      hash: '65535_52574134219_483fbd6523_c_640_480_nofilter',
      ext: '.jpg',
      mime: 'image/jpeg',
      size: 387.73,
      url: 'https://loremflickr.com/cache/resized/65535_52574134219_483fbd6523_c_640_480_nofilter.jpg',
      previewUrl: null,
      provider: 'local',
      provider_metadata: null,
      createdAt: '2023-03-25T07:29:21.700Z',
      updatedAt: '2023-03-25T07:29:21.700Z',
    },
  },
};
module.exports = {
  fakeMarkdown,
  fakeImage,
};

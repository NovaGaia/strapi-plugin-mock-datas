<div align="center">
  <img style="width: 160px; height: auto;" src="./docs/logo-novagaia@3x.png" alt="Logo NovaGaïa" />
  <h1>Nova APIs Mocker</h1>
  <p>by <a href="https://novagaia.fr/" target="_blank">NovaGaïa</a>.</p>
  <p><strong>On demand, mock all responses from your Strapi APIs.</strong></p>
<p><a href="https://github.com/NovaGaia/strapi-plugin-mock-datas/blob/main/CHANGELOG.md">CHANGELOG</a></p>
</div>

## Get Started

- [1. Installation](#1-installation)
- [2. Configuration](#2-configuration)

## Why this plugin

This Strapi plugin was originally made to answer one of my problems when I develop for **Gatsby**.
In order not to have GraphQL errors when fields / components / DynamicZone are not filled at all, it is necessary to create or force the creation of a Schema by Gatsby which identifies these fields. To do this, on the Gatsby side I use the plugin `gatsby-plugin-schema-snapshot` ([1](#read-the-state-from-an-api-and-use-the-gatsby-compagnion-plugin)). But I have to fill at least 1 item for each Collection types with all the possibilities filled and the same for Single Types : it's tedious and generate errors, especially when we get snapshots from prod regularly.

That's why I created this plugin, so that it replaces, from time to time, the API responses by mocks that autogenerate with all the possibilities.

I advise you to use `strapi-plugin-populate-deep` in parallel, so you don't have to declare all the populate=[*] on the Gatsby side. I was largely inspired by his plugin and I thank him for his work and for being an inspiration 🙏

I was inspirad by this other plugin `strapi-plugin-transformer`, so I want to thank him too.

---

## Great changes:

- v1.4.0 - You can select the APIs to mock directely from the Plugin screen **BREAKING CHANGE**
- v1.3.10 - You can access an API to access the state of this plugin and a Gatsby plugin is avalaible.

---

### Read the state from an API and use the Gatsby compagnion plugin

(1) **Since v1.3.10**, you can access an API to access the state of this plugin.  
When calling `${strapiURL}/nova-datas-mocker/isMockEnabled` you can read the state of the switch **Auto Mock Datas** and get `{mockEnabled: true|false}`. This API is accessible without any authentification.  
If your are working with **Gatsby**, you can use the Gatsby plugin [`gatsby-plugin-strapi-datas-mocker`](https://github.com/NovaGaia/gatsby-plugin-strapi-datas-mocker#readme) who can be directely connected to this plugin and generate/update your Schema.

> More informations [here](#iii-read-the-plugin-status-with-api)

### ⚠️ WARNING ⚠️

- **In order for the plugin to return mocked data, at least 1 entry must be created in Strapi for each API**. _Enter only your required fields_.
- **This plugin is automatically deactivated in production.**
- I decided, for collection, to sent only one response in an Array. More is not needed.
- Your modifications in controllers are added to Mocked response without _inteligence_. It may breaks, fix my code and open a PR or [open an issue](https://github.com/NovaGaia/strapi-plugin-mock-datas/issues) and I'll try to fix.

### Note

As you modify the data returned by the API and the Strapi Admin uses these same APIs to display and modify the data, as long as the plugin is activated, you could have errors when displaying the Collection Types and the Single Types.

## 1. Installation

Copy the following code and run from your terminal

```
npm i nova-datas-mocker
```

or

```
yarn nova-datas-mocker
```

## 2. Configuration

### I. In `plugins.js`

The configuration is done in the plugin configuration.

```js
// ./config/plugins.js
// if change, run `npm run build --clean`
module.exports = ({ env }) => ({
  // ...
  'nova-datas-mocker': {
    enabled: true,
    config: {
      defaultDepth: 5, // default 5
      consoleLog: false, // default false
      customFields: { 'plugin::permalinks.permalink': `string` }, // default {}
      imageNameToUse: 'ExistingImageInMediaLibraryToUse.xxx', // default ''
    },
  },
  // ...
});
```

| Variable         | Description                                                                               | Type    | Default value |
| ---------------- | ----------------------------------------------------------------------------------------- | ------- | ------------- |
| `defaultDepth`   | Indicate the deep of the genration of Mocking datas                                       | Int     | 5             |
| `consoleLog`     | Enabled or not the verbous log                                                            | Boolean | false         |
| `customFields`   | Object specifying which data type (Date, integer, Json, etc.) a CustomField should return | Object  | {}            |
| `apisToMock`     | from v1.4.0 You can select them directely from screen                                     | Object  | deprecated    |
| `imageNameToUse` | An exiting image in your Strapi Media Library (gatsby-source-strapi need it)              | String  | ''            |

`customFields` must return one of those data types :

- `string`
- `text`
- `richtext`
- `media`
- `json`
- `email`
- `password`
- `uid`
- `boolean`
- `float`
- `integer`
- `biginteger`
- `enumeration`
- `datetime`
- `date`
- `time`

> The data is mostly generated by `@faker-js/faker` or copied from real data (Markdown and Media for example).

### II. In configuration screen, in Strapi

In the Strapi admin, you have a screen to enable/disable the mock functionality. You can olso add image to all mocked richtext.

![Nova Datas Mocker Configuration](https://github.com/NovaGaia/strapi-plugin-mock-datas/blob/main/docs/SCR-20230506-lna.png?raw=true)
Open it in Plugin > Nova APIs Mocker

In the screen you have only a Toogle allowing to activate/deactivate the mock of the API datas and an other to add an image in all Markdown fields.

### III. Read the plugin status with API

A least, v1.3.10 of this plugin is required.

> **Note**: On those routes, no credentials are required.

#### a. Get if the plugin is enabled with API

You can call and get plugin status with this route `/nova-datas-mocker/isMockEnabled`.

The returned object is:

```json
{
  "mockEnabled": false|true,
  "addImageInRichtextEnabled": false|true,
  "api::*": false|true
}
```

#### b. Read if the plugin is configured with API

You can call and get plugin status with this route `/nova-datas-mocker/configPlugin`.

The returned object is:

```json
{
  "defaultDepth": 6,
  "consoleLog": true,
  "customFields": {
    "plugin::permalinks.permalink": "string"
  },
  "imageNameToUse": "main_BCG_7099addefe.jpg"
}
```

#### c. Use the Gatsby plugin helper

To be more productive, you can add the Gatsby plugin [`gatsby-plugin-strapi-datas-mocker`](https://github.com/NovaGaia/gatsby-plugin-strapi-datas-mocker#readme) to your Gatsby project. After configure it, it will generate/update your Schema automaticaly.

---

<a href="https://www.buymeacoffee.com/renaudheluin" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

---

# Mocking image used

> The image is self hosted in this repository.

Photo de <a href="https://unsplash.com/@anitaaustvika?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Anita Austvika</a> sur <a href="https://unsplash.com/fr/photos/ornoDnE8E4A?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

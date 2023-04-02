<div align="center">
  <img style="width: 160px; height: auto;" src="./docs/logo-novagaia@3x.png" alt="Logo NovaGaïa" />
  <h1>Strapi plugin Nova Mock Datas</h1>
  <p>by <a href="https://novagaia.fr/" target="_blank">NovaGaïa</a>.</p>
  <p><strong>On demand, mock all responses from your Strapi APIs.</strong></p>

</div>

## Get Started

- [1. Installation](#1-installation)
- [2. Configuration](#2-configuration)

## Why this plugin

This Strapi plugin was originally made to answer one of my problems when I develop for **Gatsby**.
In order not to have GraphQL errors when fields / components / DynamicZone are not filled at all, it is necessary to create or force the creation of a Schema by Gatsby which identifies these fields. To do this, on the Gatsby side I use the plugin `gatsby-plugin-schema-snapshot`. But I have to fill at least 1 item for each Collection types with all the possibilities filled and the same for Single Types : it's tedious and generate errors, especially when we get snapshots from prod regularly.

That's why I created this plugin, so that it replaces, from time to time, the API responses by mocks that autogenerate with all the possibilities.

I advise you to use `strapi-plugin-populate-deep` in parallel, so you don't have to declare all the populate=[*] on the Gatsby side. I was largely inspired by his plugin and I thank him for his work and for being an inspiration 🙏

I was inspirad by this other plugin `strapi-plugin-transformer`, so I want to thank him too.

---

> **Warning**
>
> - **THIS PLUGIN IS AUTOMATICALLY DEACTIVATED IN PRODUCTION.**
> - I decided, for collection, to sent only one response in an Array. More is not needed.
> - Your modifications in controllers are added to Mocked response without _inteligence_. It may breaks, fix my code and open a PR or [open an issue](https://github.com/NovaGaia/strapi-plugin-mock-datas/issues) and I'll try to fix.

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
      apisToMock: { 'api::page.page': true, 'api::global.global': true }, // default {}
    },
  },
  // ...
});
```

| Variable       | Description                                                                               | Type    | Default value |
| -------------- | ----------------------------------------------------------------------------------------- | ------- | ------------- |
| `defaultDepth` | Indicate the deep of the genration of Mocking datas                                       | Int     | 5             |
| `consoleLog`   | Enabled or not the verbous log                                                            | Boolean | false         |
| `customFields` | Object specifying which data type (Date, integer, Json, etc.) a CustomField should return | Object  | {}            |
| `apisToMock`   | Object containing a list of plugins that should not be managed by this plugin             | Object  | {}            |

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

> The data is mostly generated by `@faker-js/faker` or copied real data (Markdown and Media for example).

### II. In configuration screen, in Strapi

In the Strapi admin, you have a screen to enable/disable the mock functionality.

![Nova Datas Mocker Configuration](https://github.com/NovaGaia/strapi-plugin-mock-datas/blob/main/docs/Capture-2023-03-29-013857.png?raw=true)
Open it in Plugin > Nova Datas Mocker

In the screen you have only a Toogle allowing to activate/deactivate the mock of the API datas.

> **Note**
> As you modify the data returned by the API and the Strapi Admin uses these same APIs to display and modify the data, as long as the plugin is activated, you will have errors when displaying the Collection Types and the Single Types.

---

<a href="https://www.buymeacoffee.com/renaudheluin" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

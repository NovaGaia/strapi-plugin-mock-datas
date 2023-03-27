# Strapi plugin strapi-plugin-mock-datas

A quick description of strapi-plugin-mock-datas.

plutot utiliser `yarn install` que `npm install`

utiliser node 16.19.0

Le plugin nécessite un autre `strapi-plugin-populate-deep` qui permet(ra) de ne pas devoir déclarer tous les populate=[*] coté Gatsby.
Il faudra peut-être aussi installer `@faker-js/faker`

Installation, clonner le plugin dans `./src/plugins`.

Ajouter à ./config/plugins.js :

```javascript
'strapi-plugin-mock-datas': {
    enabled: true,
    resolve: './src/plugins/strapi-plugin-mock-datas',
    config: {
        defaultDepth: 5, // default 5
        consoleLog: false, // default false
        customFields: { 'plugin::permalinks.permalink': `string` }, // default {}
    },
},
```

`customFields` contient un object référençant les types de mock à utiliser pour ce field non standard. Laisser vide si pas de customFields.

Pour tester.

Créer un nouveau projet Strapi vide avec la db sqlight pour faire plus simple.

- J'ai créé des composants pour les ajouter dans les dynamicZones ou pour les utiliser directement dans les single type ou les collection types.
- J'ai créé un collection type page avec la config plus bas. Il faudra tester aussi avec un Single type, c'est un des TODOS.
- j'ai fait une relation recursive pour avoir une relation (je ferai de même dans un composant car je n'ai pas testé, c'est un des TODOS).

Page :

```javascript
{
  "kind": "collectionType",
  "collectionName": "pages",
  "info": {
    "singularName": "page",
    "pluralName": "pages",
    "displayName": "Page",
    "description": ""
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "customField",
      "customField": "plugin::permalinks.permalink",
      "targetField": "title",
      "targetRelation": "parent",
      "required": true
    },
    "content": {
      "type": "richtext"
    },
    "parent": {
      "type": "relation",
      "relation": "oneToOne",
      "target": "api::page.page"
    },
    "seo": {
      "type": "component",
      "repeatable": false,
      "component": "shared.seo",
      "required": true
    },
    "dynamicZone": {
      "type": "dynamiczone",
      "components": [
        "simple.test",
        "shared.seo"
      ]
    },
    "myEmail": {
      "type": "email"
    },
    "myPassword": {
      "type": "password"
    },
    "myNumber": {
      "type": "float"
    },
    "myDate": {
      "type": "datetime"
    },
    "myUniqueMedia": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": [
        "images",
        "files",
        "videos",
        "audios"
      ]
    },
    "MyMultipleMedias": {
      "type": "media",
      "multiple": true,
      "required": false,
      "allowedTypes": [
        "images",
        "files",
        "videos",
        "audios"
      ]
    },
    "myBoolean": {
      "type": "boolean"
    },
    "myJson": {
      "type": "json"
    },
    "myUID": {
      "type": "uid",
      "targetField": "title"
    }
  }
}
```

Je n'ai pas connecté de Gatsby, donc je ne fais qu'un appel rest pour déclancher la contruction de la réponse
je fais un GET sur http://localhost:1337/api/pages?populate=deep en passant le bearer créé dans Strapi.

Pour debug Strapi

./.vscode/launch.json

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "command": "npm run develop",
      "name": "Run npm develop",
      "request": "launch",
      "type": "node-terminal",
      "env": {
        "DATABASE_SSL": "false",
        "NODE_ENV": "development"
      }
    }
  ]
}
```

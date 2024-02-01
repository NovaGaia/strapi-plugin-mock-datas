import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';
import pluginId from './utils/pluginId';
import pluginPermissions from "./permissions";
import pluginPkg from '../../package.json';
import { prefixPluginTranslations } from '@strapi/helper-plugin';

const name = pluginPkg.strapi.displayName;

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const component = await import(/* webpackChunkName: "[request]" */ './pages/App');

        return component;
      },
      permissions: pluginPermissions.access,
    });
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: process.env.NODE_ENV === `production`,
      name,
    });
  },
  bootstrap(app) {},
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};

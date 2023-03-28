/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import { Route, Switch } from 'react-router-dom';

import HomePage from '../HomePage';
import { NotFound } from '@strapi/helper-plugin';
import React from 'react';
import pluginId from '../../utils/pluginId';

const App = () => {
  return (
    <div>
      <Switch>
        <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default App;

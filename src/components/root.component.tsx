import { Loading } from './loading.component';

import { history } from '../providers';

import React, { FC, lazy, Suspense } from 'react';

import {
  Link, Redirect, Route, Router, Switch,
} from 'react-router-dom';

const One = lazy(() => import('../modules/one/one.container'));
const Two = lazy(() => import('../modules/two/two.container'));

export const Root: FC = () => (
  <Router history={history}>
    <nav>
      <Link to="/one">One</Link>
      <Link to="/two">Two</Link>
    </nav>
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route path="/one" component={One} />
        <Route path="/two" component={Two} />
        <Redirect exact from="/" to="/one" />
      </Switch>
    </Suspense>
  </Router>
);

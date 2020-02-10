
import * as React from 'react';
import { Router, Route, Switch, Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const oneRoute = React.lazy(() => import('../modules/one_module/index'));
const twoRoute = React.lazy(() => import('../modules/two_module/index'));

const history = createBrowserHistory();


export const App: React.FC<{}> = () => {
  return (
      <Router history={history}>
        <Link to="/">Home</Link>
        <Link to="/two">Two</Link>
        <React.Suspense fallback={<div>Загрузка...</div>}>
          <Switch>
            <Route exact path="/" component={oneRoute} />
            <Route path="/two" component={twoRoute} />
          </Switch>
        </React.Suspense>
      </Router>
  );
};
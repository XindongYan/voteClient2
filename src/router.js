import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import signUp from './routes/signUp';
import backend from './routes/backend';
import adminLogin from './routes/adminLogin';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/signup" exact component={signUp} />
        <Route path="/backend" exact component={backend} />
        <Route path="/backend/login" exact component={adminLogin} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;

import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Dashboard from "./dashboard";

export default (
  <Router>
    <Switch>
      <Route path="/" exact component={Dashboard} />
      <Redirect from="*" to="/" />
    </Switch>
  </Router>
);
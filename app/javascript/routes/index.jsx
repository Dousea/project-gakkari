import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Home from "../components/home";
import Books from "../components/books";

export default (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/books" exact component={Books} />
      <Redirect from="*" to="/" />
    </Switch>
  </Router>
);
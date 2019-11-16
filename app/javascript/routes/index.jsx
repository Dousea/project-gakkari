import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "../components/navbar";
import Home from "../components/home";
import Books from "../components/books";

const NavRoute = ({path, exact, component: Component}) => (
  <Route path={path} exact={exact} render={(props) => (
    <div>
      <Navbar {...props}/>
      <Component {...props}/>
    </div>
  )}/>
)

export default (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <NavRoute path="/books" exact component={Books} />
    </Switch>
  </Router>
);
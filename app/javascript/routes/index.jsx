import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/home";
import Books from "../components/books";
import Book from "../components/book";
import NewBook from "../components/new_book";

export default (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/books" exact component={Books} />
      <Route path="/books/:id" exact component={Book} />
      <Route path="/new_book" exact component={NewBook} />
    </Switch>
  </Router>
);
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "../components/navbar";
import Home from "../components/home";
import Books from "../components/books";
import NewBook from "../components/new_book";
import EditBook from "../components/edit_book";

export default (
  <Router>
    <Navbar/>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/books" exact component={Books} />
      <Route path="/books/:id/edit" exact component={EditBook} />
      <Route path="/new_book" exact component={NewBook} />
    </Switch>
  </Router>
);
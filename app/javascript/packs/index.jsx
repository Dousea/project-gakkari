import React from "react";
import { render } from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import App from "../components/app";

document.addEventListener("DOMContentLoaded", () => {
  render(
    <App />,
    document.body.appendChild(document.createElement("div"))
  );
});

$(document).on("turbolinks:load", () => {
  // Disable "enter" key-press event on forms, so it doesn't cause any trouble
  $("form").bind("keypress", event => { if (event.keyCode == 13) return false; });
})
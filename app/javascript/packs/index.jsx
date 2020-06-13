import React from "react";
import { render } from "react-dom";

import Routes from "../components/routes";

import "bootstrap/dist/js/bootstrap.bundle.min";

let wrapper = document.createElement("div");
wrapper.setAttribute("id", "wrapper")

document.addEventListener("DOMContentLoaded", () => {
  render(
    <>{Routes}</>,
    document.body.appendChild(wrapper)
  );
});
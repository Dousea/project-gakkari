import React from "react";
import $ from "jquery";

import "../stylesheets/navbar.scss";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $(() => {
      'use strict'

      $('[data-toggle="offcanvas"]').on('click', () => {
        $('.offcanvas-collapse').toggleClass('open')
      })
    });
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
        <span className="navbar-brand mr-auto mr-lg-0">Project Gakkari</span>
        <button className="navbar-toggler p-0 border-0" type="button" data-toggle="offcanvas">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-collapse offcanvas-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Dashboard <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Notifications</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Profile</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Switch account</a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
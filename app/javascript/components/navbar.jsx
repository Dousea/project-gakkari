import React from "react";
import { matchPath, Link } from "react-router-dom";
import $ from "jquery";

import "../stylesheets/navbar.scss";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $(() => {
      'use strict'

      $('body').css('padding-top', '56px');

      $('[data-toggle="offcanvas"]').on('click', () => {
        $('.offcanvas-collapse').toggleClass('open')
      })
    });
  }

  render() {
    const isCatalogActive = !!matchPath(this.props.location.pathname, "/books");
    const srOnlyCurrent = (<span className="sr-only">(current)</span>);

    return (
      <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
        <span className="navbar-brand mr-auto mr-lg-0">Perpustakaan Gakkari</span>
        <button className="navbar-toggler p-0 border-0" type="button" data-toggle="offcanvas">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-collapse offcanvas-collapse">
          <ul className="navbar-nav mr-auto">
            <li className={`nav-item ${isCatalogActive && "active"}`}>
              <Link to="/books" className="nav-link">Katalog {isCatalogActive && srOnlyCurrent}</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
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
    const navItems = [
      /*
      { name: "Katalog", path: "/books" },
      { name: "Buku Baru", path: "/new_book" }
      */
    ]

    const isActive = navItems.map(item => !!matchPath(this.props.location.pathname, item.path));
    const srOnlyCurrent = (<span className="sr-only">(current)</span>);

    return (
      <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
        <span className="navbar-brand mr-auto mr-lg-0">Perpustakaan Gakkari</span>
        {
          // It should be only testing
          navItems.length > 0 &&
          <button className="navbar-toggler p-0 border-0" type="button" data-toggle="offcanvas">
            <span className="navbar-toggler-icon"></span>
          </button>
        }
        <div className="navbar-collapse offcanvas-collapse">
          <ul className="navbar-nav mr-auto">
            {navItems.map((item, index) => (
              <li className={`nav-item ${isActive[index] && "active"}`}>
                <Link to={item.path} className="nav-link">{item.name} {isActive[index] && srOnlyCurrent}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
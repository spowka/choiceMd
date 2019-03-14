import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { withGlobalContext } from "../../context/GlobalContext.js";

class Header extends Component {
  constructor(self) {
    super(self);

    this.state = { isMobileVisible: false };

    this.menuClick = this.menuClick.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.filterClick = this.filterClick.bind(this);
  }

  menuClick(event) {
    event.preventDefault();

    const isMobileVisible = !this.state.isMobileVisible;

    const logoWhite = document.getElementById("header-logo-white");
    const logoDark = document.getElementById("header-logo-dark");
    const toggler = document.getElementById("navbar-toggler");
    const body = document.getElementsByTagName("body")[0];

    if (isMobileVisible) {
      logoWhite.classList.remove("d-none");
      logoDark.classList.add("d-none");
      toggler.classList.add("text-white");
      body.classList.add("overflow-hidden");
    } else {
      logoWhite.classList.add("d-none");
      logoDark.classList.remove("d-none");
      toggler.classList.remove("text-white");
      body.classList.remove("overflow-hidden");
    }

    this.setState({ isMobileVisible });
  }

  toggleMenu(event) {
    if (this.state.isMobileVisible) {
      event.preventDefault();
      document.getElementById("navbar-toggler").click();
    }
  }

  filterClick() {
    document.getElementById("filters").classList.toggle("d-none");
    document.getElementById("filters-icon").classList.toggle("fa-filter");
    document.getElementById("filters-icon").classList.toggle("fa-times");
  }

  render() {
    return (
      <nav
        className="navbar navbar-expand-lg navbar-light navbar-absolute"
        onClick={this.toggleMenu}
      >
        <div className="container w-lg-100">
          <button
            className="navbar-toggler"
            id="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavDropdown"
            style={{ zIndex: "99999" }}
            onClick={this.menuClick}
          >
            <i className="fas fa-bars" />
          </button>
          <Link className="navbar-brand" to="/" style={{ zIndex: "99999" }}>
            <img
              src="/images/header-logo.svg"
              alt="ChoiceMD"
              title="ChoiceMD"
              id="header-logo-dark"
            />
            <img
              src="/images/header-logo-white.svg"
              alt="ChoiceMD"
              title="ChoiceMD"
              id="header-logo-white"
              className="d-none"
            />
          </Link>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav navbar-nav-main ml-auto font-weight-bold text-uppercase">
              <li className="nav-item active">
                <Link className="nav-link" to="/provider-search">
                  Directory
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/events">
                  Events
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/knowledgebase">
                  Knowledge-base
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              <li className="nav-item d-none d-lg-block">
                <Link className="btn btn-getlisted" to="/providers">
                  Get listed
                </Link>
              </li>
            </ul>
          </div>
          {document.location.pathname.indexOf("provider-search") === -1 && (
            <a>
                <Link className="btn btn-getlisted btn-getlisted-mobile text-uppercase d-block d-lg-none" to="/providers">
                    Get listed
                </Link>
            </a>
          )}
          {document.location.pathname.indexOf("provider-search") !== -1 && (
            <button
              className="btn btn-sm btn-outline-secondary btn-getlisted-mobile d-block d-lg-none text-uppercase font-weight-bold"
              onClick={this.filterClick}
              id="filters-toggle-btn"
            >
              Filter<i id="filters-icon" className="fas fa-filter ml-2" />
            </button>
          )}
        </div>
      </nav>
    );
  }
}

export default withGlobalContext(withRouter(Header));

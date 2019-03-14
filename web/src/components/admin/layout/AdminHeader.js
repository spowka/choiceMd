import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withGlobalContext } from "../../../context/GlobalContext";

class AdminHeader extends Component {
  render() {
    const { pathname } = this.props.location;

    return this.props.user ? (
      <header className="admin-header">
        <nav className="d-flex mb-4">
          <Link to="/">
            <img
              alt="Choice MD"
              src="/images/logo-sm.svg"
              className="admin-header-logo"
            />
          </Link>

          <Link
            className={`admin-header-nav-link ${
              pathname === "/admin/providers" ? "active" : ""
            }`}
            to="/admin/providers"
          >
            Providers
          </Link>

          <Link
            className={`admin-header-nav-link ${
              pathname === "/admin/events" ? "active" : ""
            }`}
            to="/admin/events"
          >
            Events
          </Link>

          <Link
            className={`admin-header-nav-link ${
              pathname === "/admin/users" ? "active" : ""
            }`}
            to="/admin/users"
          >
            Users
          </Link>

          <Link
            className={`admin-header-nav-link ${
              pathname === "/admin/news" ? "active" : ""
            }`}
            to="/admin/news"
          >
            News
          </Link>
        </nav>

        <div className="admin-header-user">
          {this.props.user ? this.props.user.name : ""}
        </div>
      </header>
    ) : (
      <header className="admin-header-brand">
        <Link to="/">
          <img alt="Choice MD" src="/images/header-logo.svg" />
        </Link>
      </header>
    );
  }
}

export default withGlobalContext(AdminHeader);

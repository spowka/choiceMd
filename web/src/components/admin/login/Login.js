import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import * as axios from 'axios';
import { withGlobalContext } from '../../../context/GlobalContext.js';
import { validateEmail } from '../../../common/validation.js';
import * as auth from '../../../common/authorization.js';

class Login extends Component {
  constructor(self) {
    super(self);

    this.nodes = {};

    this.state = {
      errorMessage: null
    };

    this.checkDataValidity = this.checkDataValidity.bind(this);
    this.clearDataValidity = this.clearDataValidity.bind(this);
    this.loginSubmit = this.loginSubmit.bind(this);
    this.setNodeRef = this.setNodeRef.bind(this);
    this.login = this.login.bind(this);
  }

  setNodeRef(provider, node) {
    if (node) {
      this.nodes[provider] = node;
    }
  }

  login(email, password) {
    var data = new FormData();
    data.append('email', email);
    data.append('password', password);
    data.append('client_id', auth.CLIENT_ID);

    return axios
      .post('/api/v1/oauth/login', data)
      .then(response => {
        auth.setAuthToken(response.data.access_token);
        sessionStorage.setItem('access_token', response.data.access_token);
        this.props.setUser(response.data);
        this.props.history.push('/admin/providers');
      })
      .catch(error => {
        auth.setAuthToken(null);
        this.props.setUser(null);
        this.setState({ errorMessage: error.response.data });
        return false;
      });
  }

  checkDataValidity() {
    let isOk = true;
    document.getElementById('loginEmail').setCustomValidity('');

    if (
      this.refs.loginEmail.value === '' ||
      !validateEmail(this.refs.loginEmail.value)
    ) {
      document
        .getElementById('loginEmail')
        .setCustomValidity('Please enter a valid e-mail.');
      isOk = false;
    }

    return isOk;
  }

  clearDataValidity() {
    document.getElementById('loginEmail').setCustomValidity('');
  }

  loginSubmit(e) {
    e.preventDefault();

    if (!this.checkDataValidity()) return;

    this.login(this.refs.loginEmail.value, this.refs.loginPassword.value);
  }

  render() {
    return (
      <section className="admin-login-section">

        <div className="admin-login-wrapper">
          <h4>Login to your account</h4>

          <form onSubmit={this.loginSubmit} className="admin-login-form">
            <div className="form-group ua-form-group">
              <input
                type="email"
                className="form-control form-control-underline"
                id="loginEmail"
                ref="loginEmail"
                onChange={this.clearDataValidity}
                placeholder="Email address"
                defaultValue="tomislav@initgrupa.hr"
                required
              />
            </div>
            <div className="form-group ua-form-group">
              <input
                type="password"
                className="form-control form-control-underline"
                id="loginPassword"
                ref="loginPassword"
                placeholder="Password"
                defaultValue="test123"
                required
              />
            </div>
            {this.state.errorMessage && (
              <div className="ua-error">{this.state.errorMessage}</div>
            )}
            <button
              onClick={this.checkDataValidity}
              type="submit"
              className="btn btn-success ua-btn-primary admin-login-button"
            >
              Login
            </button>
            <div className="admin-login-form-links">
              <Link to="/forgot-password">
                Forgot password?
              </Link>
              <span>
                Don't have an account? <Link to="/registration">Register here</Link>
              </span>
            </div>
          </form>
        </div>

      </section>
    );
  }
}

export default withGlobalContext(withRouter(Login));

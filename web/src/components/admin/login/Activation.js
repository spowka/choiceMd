import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string';
import * as auth from '../../../common/authorization.js';

class Activation extends Component {
  constructor(self) {
    super(self);

    this.state = {
      errorMessage: null
    };
  }

  async componentDidMount() {
    const params = queryString.parse(window.location.search);

    if (!params.code || !params.email) {
      this.setState({ errorMessage: 'Invalid activation request' });
      return;
    }

    const data = {
      email: params.email,
      code: params.code
    };

    const user = await axios
      .post('/api/v1/users/activation', data)
      .then(response => {
        auth.setAuthToken(response.data.access_token);
        sessionStorage.setItem("access_token", response.data.access_token);
        return response.data;
      })
      .catch(error => {
        this.setState({ errorMessage: error.response.data });
        auth.setAuthToken(null);
        return null;
      });

    if (user) {
      this.props.history.push('/admin/providers');
    }
  }

  render() {
    return (
      <div className="ua-wrapper">
        <h4>User account activation</h4>

        {this.state.errorMessage && <div>{this.state.errorMessage}</div>}
      </div>
    );
  }
}

export default withRouter(Activation);

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { withGlobalContext } from '../../../context/GlobalContext.js';
import ModalAlert from '../../admin/layout/ModalAlert.js';

class UserEdit extends Component {
  constructor(self) {
    super(self);

    this.state = {
      user: null,
      idUser: self.match.params.id,
      idUserRole: 2,
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      isActivated: false,
      errors: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getUrl = this.getUrl.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async componentDidMount() {
    const user = this.props.user;
    if (!user) return;

    this.setState({ user });

    if (this.state.idUser != null) this.fetchData();
  }

  fetchData() {
    axios.get(`${this.getUrl()}`).then(response => {
      const user = response.data;
      this.setState({
        idUserRole: user.id_user_role,
        name: user.name,
        email: user.email,
        password: '',
        confirmPassword: '',
        isActivated: user.is_activated
      });
    });
  }

  getUrl() {
    let url = '/api/v1/users';

    if (this.state.idUser != null) url = url + '/' + this.state.idUser;

    return url;
  }

  handleSubmit(event) {
    event.preventDefault();

    const data = {
      ...(this.state.idUser ? { id_user: this.state.idUser } : {}),
      id_user_role: this.state.idUserRole,
      name: this.state.name,
      email: this.state.email,
      password: this.state.password ? this.state.password : null,
      is_activated: this.state.isActivated ? 1 : 0
    };

    if (this.validateForm()) {
      if (this.state.idUser != null) {
        axios
          .put(`${this.getUrl()}`, data)
          .then(response => {
            document.getElementById('btn-modal-alert').click();
            this.props.history.push('/admin/users');
          })
          .catch(error => console.log(error));
      } else {
        axios
          .post(`${this.getUrl()}`, data)
          .then(response => {
            document.getElementById('btn-modal-alert').click();
            this.props.history.push('/admin/users');
          })
          .catch(error => console.log(error));
      }
    }
  }

  validateForm() {
    let errors = {};
    let formIsValid = true;

    if (this.state.idUserRole === 0) {
      formIsValid = false;
      errors['idUserRole'] = '*Please enter user role';
    }
    if (this.state.name === '') {
      formIsValid = false;
      errors['name'] = '*Please enter name';
    }
    if (this.state.email === '') {
      formIsValid = false;
      errors['email'] = '*Please enter email';
    }
    if (this.state.dateTo === '') {
      formIsValid = false;
      errors['dateTo'] = '*Please enter date to';
    }

    if (this.state.idUser == null && this.state.password === '') {
      formIsValid = false;
      errors['password'] = '*Please enter password';
    }

    if (
      this.state.password !== '' &&
      this.state.password !== this.state.confirmPassword
    ) {
      formIsValid = false;
      errors['password'] = "*Passwords don't match";
    }

    this.setState({
      errors: errors
    });

    return formIsValid;
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="d-flex flex-column align-items-center">
          <div className="admin-edit-form-header">
            <h1>
              {this.state.idUser != null ? 'Edit user' : 'Add user'}
            </h1>
          </div>

          <form onSubmit={this.handleSubmit} className="admin-edit-form">
            <div className="">
              <label className="form-label" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={this.state.name}
                onChange={e => this.setState({ name: e.target.value })}
              />
              <div className="text-danger mb-3">
                {this.state.errors['name']}
              </div>
            </div>
            <div className="">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })}
              />
              <div className="text-danger mb-3">
                {this.state.errors['email']}
              </div>
            </div>
            <div className="">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })}
              />
              <div className="text-danger  mb-3">
                {this.state.errors['password']}
              </div>
            </div>
            <div className="">
              <label className="form-label" htmlFor="password">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={this.state.confirmPassword}
                onChange={e =>
                  this.setState({ confirmPassword: e.target.value })
                }
              />
              <div className="text-danger  mb-3">
                {this.state.errors['password']}
              </div>
            </div>
            <div className="">
              <label className="form-label" htmlFor="idUserRole">
                User Role
              </label>
              <select
                className="custom-select"
                name="idUserRole"
                value={this.state.idUserRole}
                onChange={e =>
                  this.setState({ idUserRole: e.target.value })
                }
              >
                <option value="1">Admin</option>
                <option value="2">User</option>
              </select>
              <div className="text-danger mb-3">
                {this.state.errors['idUserRole']}
              </div>
            </div>
            <div className="">
              <div className="custom-control custom-checkbox mb-3">
                <input
                  type="checkbox"
                  name="isActivated"
                  className="custom-control-input"
                  checked={this.state.isActivated}
                  onChange={this.handleInputChange}
                  id="isActivated"
                />
                <label
                  className="custom-control-label"
                  htmlFor="isActivated"
                >
                  Activated
                </label>
              </div>
            </div>
            <div className="" />
            <input
              type="submit"
              value="Save"
              className="btn btn-pill btn-primary btn-violet mt-3"
            />
            <Link
              className="btn btn-pill btn-hero btn-violet mt-3"
              to="/admin/users"
            >
              Back
              </Link>
          </form>
        </div>
        <ModalAlert
          modalTitle="Well done!"
          modalText="Data Successfully Saved"
        />
        <button
          id="btn-modal-alert"
          className="btn btn-pill btn-hero btn-violet"
          data-toggle="modal"
          data-target="#modalAlert"
          style={{ display: 'none' }}
        />
      </React.Fragment>
    );
  }
}

export default withGlobalContext(withRouter(UserEdit));

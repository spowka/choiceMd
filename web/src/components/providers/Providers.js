import React, { Component } from 'react';
import * as axios from 'axios';
import { validateEmail } from '../../common/validation.js';
import * as auth from "../../common/authorization.js";

class Providers extends Component {
  constructor(self) {
    super(self);

    this.nodes = {};

    this.state = {
      errorMessage: null
    };

    this.checkDataValidity = this.checkDataValidity.bind(this);
    this.clearDataValidity = this.clearDataValidity.bind(this);
    this.registerSubmit = this.registerSubmit.bind(this);
    this.register = this.register.bind(this);
  }

  register(name, email, password, isAuthorized) {
    const data = {
      name: name,
      email: email,
      password: password,
      is_authorized: isAuthorized,
      client_id: auth.CLIENT_ID
    }

    return axios
      .post('/api/v1/users/registration', data)
      .then(response => {
        this.props.history.push('/admin/login');
      })
      .catch(error => {
        this.setState({ errorMessage: error.response.data });
        return false;
      });
  }

  checkDataValidity() {
    let isOk = true;
    document.getElementById('email').setCustomValidity('');

    if (this.refs.email.value === '' || !validateEmail(this.refs.email.value)) {
      document
        .getElementById('email')
        .setCustomValidity('Please enter a valid e-mail.');
      isOk = false;
    }

    if (
      this.refs.password.value === '' ||
      this.refs.password.value !== this.refs.passwordConfirm.value
    ) {
      document
        .getElementById('password')
        .setCustomValidity("Passwords don't match");
      isOk = false;
    }

    return isOk;
  }

  clearDataValidity() {
    document.getElementById('email').setCustomValidity('');
  }

  registerSubmit(e) {
    e.preventDefault();

    if (!this.checkDataValidity()) return;

    this.register(
      this.refs.name.value,
      this.refs.email.value,
      this.refs.password.value,
      true //TODOthis.refs.type2.checked
    );
  }

  render() {
    return (
      <React.Fragment>
        {/* <!-- Hero --> */}
        <div className="providers-hero">
          <div className="container pb-sm-5">
            <h1>Get the Doctor’s cure for obscurity</h1>
            <h2>Stand out amongst the rest</h2>
            <div className="row mt-5">
              <div className="col-md-7">
                <div className="d-table mt-0 mt-sm-0 mt-md-1 mt-lg-5 mt-xl-5">
                  <div className="d-table-cell align-middle"><img src="/images/providers-icon1.png" className="mr-4" alt="" /></div>
                  <div className="d-table-cell align-middle">
                    <strong className="text-uppercase d-block font-roboto">97% of consumers search for businesses online</strong>
                    Be found and join the only medical community for Miami-Dade County.
                        </div>
                </div>
                <div className="d-table mt-5">
                  <div className="d-table-cell align-middle"><img src="/images/providers-icon2.png" className="mr-4" alt="" /></div>
                  <div className="d-table-cell align-middle">
                    <strong className="text-uppercase d-block font-roboto">Promote and drive traffic to your business</strong>
                    We’ve taken steps to ensure patients return to our site for community events and the latest health articles.
                        </div>
                </div>
                <div className="d-table mt-5">
                  <div className="d-table-cell align-middle"><img src="/images/providers-icon3.png" className="mr-4" alt=""/></div>
                  <div className="d-table-cell align-middle">
                    <strong className="text-uppercase d-block font-roboto">Be Discovered</strong>
                    The more information you provide the easier it is to connect you with a patient that is looking for your unique practice.
                        </div>
                </div>

                <div className="d-block d-md-none mt-5">
                  <img alt="ChoiceMD" src="/images/logo-sm.svg" style={{ marginTop: "-10px" }} /><strong className="text-uppercase ml-2">is the new online medical community.</strong><br />
                  Patients now have a way to find their physicians as well as connect with nearby support groups and stay up to date with any local medically related events and information.
                        <br /><br />
                  Our holistic view towards healthcare, which includes information on medical non-profit organizations and education, is part of our services. We are offering a resource to impact your patient’s health outside the office.
                    </div>
              </div>
              <div className="col-md-5">
                <div className="card bg-light shadow mt-5 mt-sm-5 mt-md-0 mt-lg-0 mt-xl-0 card-xs-full">
                  <div className="card-body">
                    <h5 className="card-title">Get listed!</h5>
                    <p>
                      We would love to hear from you. Write to us and we will get in touch with you shortly.
                            </p>
                    <form onSubmit={this.registerSubmit}>
                      <div className="form-group">
                        <input
                          type="text"
                          id="name"
                          ref="name"
                          className="form-control"
                          placeholder="Provider’s Full Name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="email"
                          id="email"
                          ref="email"
                          className="form-control"
                          placeholder="Email"
                          required />
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          id="password"
                          ref="password"
                          className="form-control"
                          placeholder="Password"
                          required />
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          id="passwordConfirm"
                          ref="passwordConfirm"
                          className="form-control"
                          placeholder="Verify Password"
                          required />
                      </div>
                      {this.state.errorMessage && (
                        //TO DO PROVJERIT JEL OVA KLASA ua-error i dalje ok
                        <div classNameName="ua-error">{this.state.errorMessage}</div>
                      )}
                      <button type="submit" className="btn btn-sm btn-primary">Get listed</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-none d-md-block">
              <div className="row pt-4">
                <div className="col-md-6 mb-3 mb-sm-3 mb-md-0">
                  <img alt="ChoiceMD" src="/images/logo-sm.svg" style={{ marginTop: "-10px" }} /><strong className="text-uppercase ml-2">is the new online medical community.</strong><br />
                  Patients now have a way to find their physicians as well as connect with nearby support groups and stay up to date with any local medically related events and information.
                    </div>
                <div className="col-md-6">
                  Our holistic view towards healthcare, which includes information on medical non-profit organizations and education, is part of our services. We are offering a resource to impact your patient’s health outside the office.
                    </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div classNameName="medical-professionals-hero clearfix">
          <div classNameName="container">
            <div classNameName="pl-4 py-5">
              <h1 classNameName="text-violet pt-0 mb-0 pb-1">
                Get the Doctor’s cure for obscurity
              </h1>
              <h4 classNameName="text-violet font-weight-normal pl-2 mb-4">
                ... and <strong>stand out</strong> amongst the rest.
              </h4>
              <form classNameName="w-50" onSubmit={this.registerSubmit}>
                <label classNameName="form-label" htmlFor="providersFullName">
                  Provider's full name *:
                </label>
                <div classNameName="mb-3">
                  <input
                    type="text"
                    id="name"
                    ref="name"
                    classNameName="form-control form-control-dark w-100"
                    autoFocus
                    required
                  />
                </div>

                <div classNameName="custom-control custom-radio">
                  <input
                    type="radio"
                    id="type1"
                    name="providerType"
                    ref="type1"
                    classNameName="custom-control-input"
                    checked
                  />
                  <label
                    classNameName="custom-control-label"
                    htmlFor="providerType1"
                  >
                    I am the provider
                  </label>
                </div>
                <div classNameName="custom-control custom-radio mb-3">
                  <input
                    type="radio"
                    id="type2"
                    name="providerType"
                    ref="type2"
                    classNameName="custom-control-input"
                  />
                  <label
                    classNameName="custom-control-label"
                    htmlFor="providerType2"
                  >
                    I am authorized to make decisions on behalf of provider
                  </label>
                </div>

                <label classNameName="form-label" htmlFor="providersEmailAddress">
                  Email Address *:
                </label>
                <div classNameName="mb-3">
                  <input
                    type="email"
                    id="email"
                    ref="email"
                    classNameName="form-control form-control-dark w-100"
                    required
                  />
                </div>

                <label classNameName="form-label" htmlFor="providersPassword">
                  Password *:
                </label>
                <div classNameName="mb-3">
                  <input
                    type="password"
                    id="password"
                    ref="password"
                    classNameName="form-control form-control-dark w-100"
                    required
                  />
                </div>

                <label
                  classNameName="form-label"
                  htmlFor="providersPasswordConfirm"
                >
                  Re-enter your password *:
                </label>
                <div classNameName="mb-3">
                  <input
                    type="password"
                    id="passwordConfirm"
                    ref="passwordConfirm"
                    classNameName="form-control form-control-dark w-100"
                    required
                  />
                </div>
                {this.state.errorMessage && (
                  <div classNameName="ua-error">{this.state.errorMessage}</div>
                )}
                <button
                  type="submit"
                  onClick={this.checkDataValidity}
                  classNameName="btn btn-pill btn-hero btn-violet pl-4 mt-2"
                >
                  Sign up for free
                  <i classNameName="fas fa-chevron-circle-right ml-2" />
                </button>
              </form>
            </div>
          </div>
        </div>
        <div classNameName="bg-sand">
          <div classNameName="container py-4">
            <h3 classNameName="font-weight-normal d-block text-center pt-2">
              <strong>
                Choice
                <sup>MD</sup>
              </strong>{' '}
              is the new online medical community.
            </h3>
            <p classNameName="px-4 py-3 text-center w-60 mx-auto">
              Patients now have a way to find their physicians as well as
              connect with nearby support groups and stay up to date with any
              local medically related events and information.
            </p>

            <div classNameName="row p-4 bg-tan-dark-tint rounded">
              <div classNameName="col-md-4 text-center">
                <i
                  classNameName="fas fa-search-location pb-4 pt-3"
                  style={{ fontSize: '5rem' }}
                />
                <h5>97% of consumers search for businesses online</h5>
                <p>
                  Be found and join the only medical community for Miami-Dade
                  County.
                </p>
              </div>
              <div classNameName="col-md-4 text-center">
                <i
                  classNameName="fas fa-chart-line pb-4 pt-3"
                  style={{ fontSize: '5rem' }}
                />
                <h5>Promote and drive traffic to your business</h5>
                <p>
                  We’ve taken steps to ensure patients return to our site for
                  community events and the latest health articles.
                </p>
              </div>
              <div classNameName="col-md-4 text-center">
                <i
                  classNameName="far fa-grin-stars pb-4 pt-3"
                  style={{ fontSize: '5rem' }}
                />
                <h5>
                  Be Discovered
                  <br />
                  &nbsp;
                </h5>
                <p>
                  The more information you provide the easier it is to connect
                  you with a patient that is looking for your unique practice.
                </p>
              </div>
            </div>

            <p classNameName="px-4 pt-4 pb-0 text-center w-60 mx-auto">
              Our holistic view towards healthcare, which includes information
              on medical non-profit organizations and education, is part of our
              services. We are offering a resource to impact your patient’s
              health outside the office.
            </p>
          </div>
        </div>
        <div classNameName="bg-mint py-5">
          <div classNameName="container">
            <h3 classNameName="d-block text-center font-weight-normal text-violet">
              Something for <strong>everyone</strong>
            </h3>
            <p classNameName="text-center">
              Choose the plan that best fits you and your business
            </p>
          </div>
        </div> */}
      </React.Fragment>
    );
  }
}

export default Providers;

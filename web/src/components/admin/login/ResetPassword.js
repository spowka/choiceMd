import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import queryString from "query-string";
import { validateEmail } from "../../../common/validation.js";

// export function setNewPassword(email, code, password) {
//   return function(dispatch) {
//     var data = {
//       action: "new",
//       email: email,
//       code: code,
//       password: password
//     };

//     return axios
//       .post("/api/v1/users/password", data)
//       .then(() => {
//         return true;
//       })
//       .catch(error => {
//         dispatch(resetPasswordError("Error resetting password."));
//         return false;
//       });
//   };
// }

class ResetPassword extends Component {
  constructor(self) {
    super(self);

    this.checkDataValidity = this.checkDataValidity.bind(this);
    this.clearDataValidity = this.clearDataValidity.bind(this);
    this.resetSubmit = this.resetSubmit.bind(this);
  }

  checkDataValidity() {
    let isOk = true;
    document.getElementById("resetEmail").setCustomValidity("");
    document.getElementById("resetPassword").setCustomValidity("");

    if (
      this.refs.resetEmail.value === "" ||
      !validateEmail(this.refs.resetEmail.value)
    ) {
      document
        .getElementById("resetEmail")
        .setCustomValidity("Please enter a valid e-mail.");
      isOk = false;
    }

    if (this.refs.resetPassword.value !== this.refs.resetPassword2.value) {
      document
        .getElementById("resetPassword")
        .setCustomValidity("Passwords don't match.");
      isOk = false;
    }

    return isOk;
  }

  clearDataValidity() {
    document.getElementById("resetEmail").setCustomValidity("");
    document.getElementById("resetPassword").setCustomValidity("");
  }

  resetSubmit(e) {
    e.preventDefault();

    if (!this.checkDataValidity()) return;

    let code = queryString.parse(this.props.location.search)["code"];

    const { setNewPassword } = this.props;
    setNewPassword(
      this.refs.resetEmail.value,
      code,
      this.refs.resetPassword.value
    ).then(res => {
      if (res) this.props.history.push("/login");
    });
  }

  render() {
    return (
      <div className="ua-wrapper">
        <Link to="/" className="ua-logo" />
        <h4>reset for an account</h4>

        <form onSubmit={this.resetSubmit}>
          <div className="form-group ua-form-group">
            <input
              type="email"
              className="form-control form-control-underline"
              id="resetEmail"
              ref="resetEmail"
              placeholder="Email address"
              required
            />
          </div>
          <div className="form-group ua-form-group">
            <input
              type="password"
              className="form-control form-control-underline"
              id="resetPassword"
              ref="resetPassword"
              placeholder="Password"
              required
            />
          </div>
          <div className="form-group ua-form-group">
            <input
              type="password"
              className="form-control form-control-underline"
              id="resetPassword2"
              ref="resetPassword2"
              placeholder="Confirm password"
              required
            />
          </div>

          {this.props.reset_password_error_message && (
            <div className="ua-error">
              {this.props.reset_password_error_message}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-success ua-btn-primary"
            onClick={this.checkDataValidity}
          >
            Set password
          </button>
        </form>
      </div>
    );
  }
}

export default withRouter(ResetPassword);

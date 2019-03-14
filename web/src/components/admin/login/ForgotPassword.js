import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { validateEmail } from "../../../common/validation.js";

// export function sendNewPassword(email) {
//   return function(dispatch) {
//     var data = {
//       action: "reset",
//       email: email
//     };

//     return axios
//       .post("/api/v1/users/password", data)
//       .then(response => {
//         dispatch(
//           loginError("Password reset link has been sent to your email.")
//         );
//         return true;
//       })
//       .catch(error => {
//         dispatch(loginError("Error sending mail."));
//         return false;
//       });
//   };
// }

class ForgotPassword extends Component {
  constructor(self) {
    super(self);

    this.checkDataValidity = this.checkDataValidity.bind(this);
    this.clearDataValidity = this.clearDataValidity.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
  }

  checkDataValidity() {
    let isOk = true;
    document.getElementById("email").setCustomValidity("");

    if (
      this.refs.email.value === "" ||
      !validateEmail(this.refs.email.value)
    ) {
      document
        .getElementById("email")
        .setCustomValidity("Please enter a valid e-mail.");
      isOk = false;
    }

    return isOk;
  }

  clearDataValidity() {
    document.getElementById("email").setCustomValidity("");
  }

  formSubmit(e) {
    e.preventDefault();

    if (!this.checkDataValidity()) return;

    const { sendNewPassword } = this.props;
    sendNewPassword(
      this.refs.email.value
    ).then(res => {
      if (res) this.props.history.push("/login");
    });
  }

  render() {
    return (
      <div className="ua-wrapper">
        <Link to="/" className="ua-logo" />
        <h4>Enter your email address</h4>

        <form onSubmit={this.formSubmit}>
          <div className="form-group ua-form-group">
            <input
              type="email"
              className="form-control form-control-underline"
              id="email"
              ref="email"
              onChange={this.clearDataValidity}
              placeholder="Email address"
              required
            />
          </div>

          <button
            onClick={this.checkDataValidity}
            type="submit"
            className="btn btn-success ua-btn-primary"
          >
            Reset password
          </button>
        </form>
      </div>
    );
  }
}

export default withRouter(ForgotPassword);

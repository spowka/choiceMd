import React from 'react';

const Contact = () => {
  return (
    <React.Fragment>
      <div className="bg-mint">
        <div className="container">
          <h1 className="m-0 py-4 px-3">Contact Us</h1>
        </div>
      </div>
      <div className="bg-sand">
        <div className="container py-4 px-3">
          <p className="px-3">
            We would love to hear from you. Please fill out this form and we
            will get in touch with you shortly.
            <br />
            <small>
              <i>
                Please note: Your message will be sent directly to Choice MD
                customer services and will not be received by entities listed on
                this website.
              </i>
            </small>
          </p>
          <form className="px-3">
            <label className="form-label" for="firstName">
              Name *:
            </label>
            <div className="form-row w-60 mb-3">
              <div className="col">
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  className="form-control"
                  placeholder="First name"
                  autofocus
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  className="form-control"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="form-row w-60 mb-3">
              <div className="col">
                <label className="form-label" for="email">
                  Email *:
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="form-control"
                />
              </div>
              <div className="col">
                <label className="form-label" for="phone">
                  Phone:
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-row w-60 mb-3">
              <div className="col">
                <label className="form-label" for="purpose">
                  Purpose *:
                </label>
                <select name="purpose" id="purpose" className="custom-select">
                  <option value="1">Purpose 1</option>
                  <option value="2">Purpose 2</option>
                  <option value="3">Purpose 3</option>
                </select>
              </div>
              <div className="col" />
            </div>

            <div className="form-row w-60 mb-3">
              <div className="col">
                <label className="form-label" for="message">
                  Message *:
                </label>
                <textarea
                  className="form-control"
                  name="message"
                  id="message"
                  rows="5"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-pill btn-hero btn-violet pl-4 mt-4"
            >
              Submit
              <i className="fas fa-chevron-circle-right ml-2" />
            </button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Contact;

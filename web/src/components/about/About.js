import React from 'react';
import axios from 'axios';

class About extends React.Component {
  constructor(self) {
    super(self);

    this.state = {
      form: {
        contactName: "",
        contactEmail: "",
        contactMessage: "",
      },
      errors: [],
      success: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  clearForm() {
    this.setState({
      form: {
        contactName: "",
        contactEmail: "",
        contactMessage: "",
      },
      errors: []
    });
  }
  getFieldError(fieldName) {
    const error = this.state.errors.filter(
      error => error.field === fieldName
    )[0];
    return error;
  }

  handleFormChange(key, value) {
    this.setState({
      form: {
        ...this.state.form,
        [key]: value
      }
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const data = this.state.form;

    await axios.post('', { data })
      .then(res => {
        this.setState({
          success: true
        });
        this.clearForm();
      })
      .catch(function (error) {
        this.setState({
          errors: error.response.data.fields,
          success: false
        });
        return error;
      })
  }

  render() {
    return (
      <React.Fragment>
        <div className="about-hero">
          <div className="container h-100">
            <div className="d-table h-100">
              <div className="d-table-cell h-100 align-middle">
                <h1 style={{ color: '#27344B' }}>Simplifying the process<br />of obtaining overall wellness</h1>
                <h4 style={{ color: '#27344B' }}>By providing you with local resources you need to improve both mental and physical health.</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="about-content">
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-lg-6">
                <p>
                  We’ve created this website to help you because we understand that health care can be overwhelming. Lots of resources are available; the issue is we don’t know where to start.
                    </p>
                <p>
                  The solution is Choice MD. A community-based platform for everything medically related, designed to help patients navigate through a journey to better health.
                    </p>
                <p>
                  Today we provide you with a way to find local:
                    </p>
                <ul>
                  <li>Doctors</li>
                  <li>Dentists</li>
                  <li>Hospitals & Assisted Living Facilities</li>
                  <li>Non-profit Organizations</li>
                </ul>
                <p>
                  as well as keeping you informed with the latest health news and connecting our community through our completely local, medically related Calendar of Events. All in the name of better health.
                    </p>
              </div>
              <div className="col-md-6 col-lg-6 col-xl-5 offset-xl-1">
                <div className="card bg-light shadow card-xs-full">
                  <div className="card-body">
                    <h5 className="card-title">Contact Us</h5>
                    <p>
                      We’d love to hear from you! Send us a brief message and someone will get in touch with you soon.
                            </p>
                    <form onSubmit={this.handleSubmit}>
                      <div className="form-group">
                        <input
                          type="text"
                          id="contactName"
                          name="contactName"
                          className={
                            "form-control" +
                            (this.getFieldError("contactName") ? " is-invalid" : "")
                          }
                          placeholder="Full Name"
                        />
                        {this.getFieldError("contactName") ? (
                          <span className="invalid-feedback">
                            {this.getFieldError("contactName").message}
                          </span>
                        ) : null}
                      </div>
                      <div className="form-group">
                        <input
                          type="email"
                          id="contactEmail"
                          name="contactEmail"
                          className={
                            "form-control" +
                            (this.getFieldError("contactEmail") ? " is-invalid" : "")
                          }
                          placeholder="Email" />
                        {this.getFieldError("contactEmail") ? (
                          <span className="invalid-feedback">
                            {this.getFieldError("contactEmail").message}
                          </span>
                        ) : null}
                      </div>
                      <div className="form-group">
                        <textarea
                          rows="4"
                          id="contactMessage"
                          name="contactMessage"
                          className={
                            "form-control" +
                            (this.getFieldError("contactMessage") ? " is-invalid" : "")
                          }
                          placeholder="Write us a message...">
                        </textarea>
                        {this.getFieldError("contactMessage") ? (
                          <span className="invalid-feedback">
                            {this.getFieldError("contactMessage").message}
                          </span>
                        ) : null}
                      </div>
                      <button type="submit" className="btn btn-sm btn-primary">Submit</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default About;

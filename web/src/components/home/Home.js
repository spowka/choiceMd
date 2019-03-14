import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withGlobalContext } from "../../context/GlobalContext.js";
import queryString from "query-string";

class Home extends Component {
  constructor(self) {
    super(self);

    this.locationChanged = this.locationChanged.bind(this);
    this.renderZipCodeSelect = this.renderZipCodeSelect.bind(this);
  }

  componentDidMount() {
    this.props.loadLocations();
  }

  locationChanged(event) {
    const searchParams = {};
    const patientsSearchLocation = parseInt(event.target.value, 10);

    this.props.setContext(
      "patientsSearchLocation",
      parseInt(event.target.value, 10)
    );

    if (patientsSearchLocation != null && patientsSearchLocation !== -1)
      searchParams.location = patientsSearchLocation;

    this.props.history.push(
      `/provider-search?${queryString.stringify(searchParams)}`
    );
  }

  renderZipCodeSelect() {
    return (
      <select
        className="custom-select shadow border-0"
        name="dentistCityOrZip"
        value={this.props.globalState.patientsSearchLocation}
        onChange={this.locationChanged}
      >
        <option placeholder="true" hidden>
          What’s your Zip-Code{/* of City or ZIP Code */}
        </option>
        <option placeholder="true" value={-1}>
          Search all zip codes
          </option>
        {this.props.globalState.locations.map(l => (
          <option key={l.id_location} value={l.id_location}>
            {l.zip_code} {l.name}
          </option>
        ))}
      </select>
    );
  }

  render() {
    return (
      <React.Fragment>
        {/* <!-- Hero --> */}
        <div className="home-hero">
          <div className="container h-100">
            <div className="d-table h-100">
              <div className="d-table-cell h-100 align-middle">
                <h1 style={{ color: "#27344B" }}>
                  Medical Decisions
                  <br />
                  Powered by Local Choices
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Location --> */}
        <div className="home-location">
          <div className="container h-100">
            <div className="d-table w-100 h-100">
              <div
                className="d-table-row align-middle"
                style={{ height: "430px" }}
              >
                <div className="d-table-cell align-middle h-100 home-location-txt">
                  <h1 style={{ color: "#27344B" }}>Find your local</h1>
                  <ul style={{ fontFamily: "Raleway", color: "#27344B" }}>
                    <li>Doctor</li>
                    <li>Dentist</li>
                    <li>Medical Facility</li>
                    <li>Non-Profit Organization</li>
                  </ul>
                  <form
                    className="d-none d-md-block"
                    style={{ maxWidth: "350px" }}
                  >
                    {this.renderZipCodeSelect()}
                  </form>
                </div>
              </div>
              <div className="d-table-row">
                <div className="d-table-cell align-middle h-100 pb-5">
                  <div className="row">
                    <div className="col-lg-6 mt-2 offset-lg-1" />
                    <div className="col-lg-4 d-md-none">
                      <form>{this.renderZipCodeSelect()}</form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Events --> */}
        <div className="home-events">
          <div className="container h-100">
            <div className="d-table w-100 h-100">
              <div className="d-table-cell w-50 h-100 align-middle" />
              <div className="d-table-cell w-50 h-100 align-middle pl-0 pl-lg-5 py-5 py-lg-0">
                <div className="pl-0 pl-lg-5">
                  <h1 style={{ color: "#27344B" }}>Get Connected</h1>
                  <ul>
                    <li>Join a Support Group</li>
                    <li>Attend Seminars</li>
                    <li>Participate in Charity Events</li>
                    <li>Find Volunteer Opportunities</li>
                  </ul>
                  <Link to="/events">See Current events</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Knowledge --> */}
        <div className="home-knowledge">
          <div className="container">
            <h1 style={{ color: "#27344B" }}>
              Stay Informed.
              <br />
              Knowledge is powerful medicine.
            </h1>
            <Link to="/knowledgebase">READ THE LATEST HEALTH NEWS</Link>
          </div>
        </div>

        {/* <div classNameName="home-hero">
          <div classNameName="d-table w-100">
            <div classNameName="d-table-cell home-hero-cell align-bottom w-100">
              <div classNameName="home-hero-gradient">
                <div classNameName="container">
                  <div classNameName="row">
                    <div classNameName="col-12 col-sm-4 text-center py-md-5">
                      <div classNameName="pt-4 clearfix">
                        <h5 classNameName="font-weight-normal home-hero-s-title">
                          The Directory
                        </h5>
                        <Link
                          to="/patients"
                          classNameName="btn btn-pill btn-violet pl-4 home-hero-s-btn"
                        >
                          Find a provider
                          <i classNameName="fas fa-chevron-circle-right ml-2" />
                        </Link>
                      </div>
                    </div>
                    <div classNameName="col-12 col-sm-4 text-center py-md-5">
                      <div classNameName="pt-4 clearfix">
                        <h5 classNameName="font-weight-normal home-hero-s-title">
                          The Events Calendar
                        </h5>
                        <Link
                          to="/calendar"
                          classNameName="btn btn-pill btn-violet pl-4 home-hero-s-btn"
                        >
                          Get Connected
                          <i classNameName="fas fa-chevron-circle-right ml-2" />
                        </Link>
                      </div>
                    </div>
                    <div classNameName="col-12 col-sm-4 text-center pb-5 pb-md-0 py-md-5">
                      <div classNameName="pt-4 clearfix">
                        <h5 classNameName="font-weight-normal home-hero-s-title">
                          The Newsletter
                        </h5>
                        <a classNameName="btn btn-pill btn-violet pl-4 home-hero-s-btn">
                          Stay Informed
                          <i classNameName="fas fa-chevron-circle-right ml-2" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <h4 classNameName=" mb-0 pb-4 text-center font-weight-normal">
                    Medical decisions
                    <br classNameName="d-inline d-sm-none" /> powered by local
                    choices
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div classNameName="bg-sand py-5">
          <div classNameName="container text-center text-lg-left">
            <div classNameName="d-lg-table w-100">
              <div classNameName="d-lg-none w-lg-40 align-middle text-center pb-4">
                <img
                  alt=""
                  src="/images/icon-find.png"
                  style={{ height: '270px' }}
                />
              </div>
              <div classNameName="d-lg-table-cell w-lg-60 pt-5 pt-lg-0 align-middle pl-lg-3">
                <h1>
                  Find your local medical
                  <br />
                  professionals &amp; facilities
                </h1>
                <p classNameName="pb-2">
                  Our provider directory eliminates the confusion created by
                  national databases by
                  <br classNameName="d-none d-md-inline" />
                  focusing on Miami&minus;Dade County. Find your local doctor,
                  dentist, medical facility, etc.
                </p>
                <div>
                  <Link
                    to="/patients"
                    classNameName="btn btn-pill btn-hero btn-violet pl-4 mb-1 mb-sm-0"
                  >
                    Find a provider
                    <i classNameName="fas fa-chevron-circle-right ml-2" />
                  </Link>
                  <Link
                    to="/providers"
                    classNameName="btn btn-pill btn-hero btn-outline-violet pl-4 ml-sm-2"
                  >
                    Get listed
                    <span classNameName="d-none d-lg-inline"> here</span>
                    <i classNameName="fas fa-chevron-circle-right ml-2" />
                  </Link>
                </div>
              </div>
              <div classNameName="d-none d-lg-table-cell w-lg-40 align-middle text-center">
                <img
                  alt=""
                  src="/images/icon-find.png"
                  style={{ height: '250px' }}
                />
              </div>
            </div>
          </div>
        </div>
        <div classNameName="bg-tan-dark-tint py-5">
          <div classNameName="container text-center text-lg-left py-1">
            <div classNameName="d-lg-table w-100">
              <div classNameName="d-lg-table-cell w-lg-40 align-middle text-center pb-4 pb-lg-0">
                <img
                  alt=""
                  src="/images/icon-calendar.png"
                  style={{ height: '250px' }}
                />
              </div>
              <div classNameName="d-lg-table-cell w-lg-60 align-middle">
                <h1>Get Connected</h1>
                <p>
                  Choice MD’s Event Calendar offers the most comprehensive list
                  of local health related events in Miami&minus;Dade County.
                  Make a difference in your community, and in your self by:
                </p>
                <div classNameName="d-md-table w-100 pb-md-2 pl-3 pl-md-0 text-left">
                  <div classNameName="d-md-table-cell w-md-50">
                    <i classNameName="fas fa-angle-double-right mr-2 text-mint" />
                    Joining a Support Group
                  </div>
                  <div classNameName="d-md-table-cell w-md-50">
                    <i classNameName="fas fa-angle-double-right mr-2 text-mint" />
                    Attending Seminars
                  </div>
                </div>
                <div classNameName="d-md-table w-100 pb-4 pl-3 pl-md-0 text-left">
                  <div classNameName="d-md-table-cell w-md-50">
                    <i classNameName="fas fa-angle-double-right mr-2 text-mint" />
                    Participating in Charity Events
                  </div>
                  <div classNameName="d-md-table-cell w-md-50">
                    <i classNameName="fas fa-angle-double-right mr-2 text-mint" />
                    Finding Volunteer Opportunities
                  </div>
                </div>
                <div>
                  <Link
                    to="/calendar"
                    classNameName="btn btn-pill btn-hero btn-violet pl-4"
                  >
                    Go to event calendar
                    <i classNameName="fas fa-chevron-circle-right ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div classNameName="bg-sand py-5">
          <div classNameName="container text-center text-lg-left py-1">
            <div classNameName="d-lg-table w-100">
              <div classNameName="d-lg-none w-lg-40 align-middle text-center pb-4">
                <img
                  alt=""
                  src="/images/icon-info.png"
                  style={{ height: '270px' }}
                />
              </div>
              <div classNameName="d-lg-table-cell w-lg-60 align-middle">
                <h1>Stay Informed</h1>
                <p>
                  Staying informed with the latest health topics is important
                  for managing your own health. We will soon provide the latest
                  health related articles and news curated from medical
                  journals, simply because knowledge is powerful medicine.
                  <br />
                  <br />
                  Sign up for our newsletter:
                </p>
                <div>
                  <div classNameName="input-group w-lg-60">
                    <input
                      type="text"
                      classNameName="form-control"
                      placeholder="Enter your email address"
                      value={this.state.newsletterEmail}
                      onChange={e =>
                        this.setState({ newsletterEmail: e.target.value })
                      }
                    />
                    <div classNameName="input-group-append">
                      <button
                        classNameName="btn btn-pill btn-hero btn-violet"
                        onClick={this.saveNewsletter}
                      >
                        Sign up
                        <i classNameName="fas fa-chevron-circle-right ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div classNameName="d-none d-lg-table-cell w-lg-40 align-middle text-center">
                <img
                  alt=""
                  src="/images/icon-info.png"
                  style={{ height: '270px' }}
                />
              </div>
            </div>
          </div>
        </div> */}
      </React.Fragment>
    );
  }
}

export default withGlobalContext(Home);

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { withGlobalContext } from '../../context/GlobalContext.js';
import { SpecialtyType } from '../../data/ProviderData.js';

class PatientsDentistSearch extends Component {
  constructor(self) {
    super(self);

    this.state = {
      distance: null,
      location: null,
      type: null,
      name: null
    };

    this.searchClick = this.searchClick.bind(this);
  }

  searchClick() {
    const {
      patientsSearchDistance,
      patientsSearchLocation,
      patientsSearchName,
      patientsSearchDentistType
    } = this.props.globalState;

    const searchParams = {};
    searchParams.id_provider_type = this.props.idProviderType;

    if (patientsSearchName != null) searchParams.name = patientsSearchName;

    if (patientsSearchDistance != null && patientsSearchDistance !== -1)
      searchParams.distance = patientsSearchDistance;

    if (patientsSearchLocation != null && patientsSearchLocation !== -1)
      searchParams.location = patientsSearchLocation;

    if (patientsSearchDentistType != null && patientsSearchDentistType !== -1)
      searchParams.id_specialty_type = patientsSearchDentistType;

    this.props.history.push(
      `/providerSearch?${queryString.stringify(searchParams)}`
    );
  }

  render() {
    return (
      <div
        className="tab-pane fade show active"
        id="tabDentist"
        role="tabpanel"
      >
        <p>
          Our Dentist directory will help you find the right dentist,
          orthodontist or dental specialist in your local area.
        </p>
        <form>
          <label className="form-label" htmlFor="dentistDistance">
            Where would you like to find a dentist?
          </label>
          <div className="form-row mb-4 pb-4 border-bottom">
            <div className="col-12 col-sm-6">
              <select
                className="custom-select mb-2 mb-sm-0"
                name="dentistDistance"
                value={this.props.globalState.patientsSearchDistance}
                onChange={e =>
                  this.props.setContext(
                    'patientsSearchDistance',
                    e.target.value
                  )
                }
              >
                <option placeholder="true" hidden>
                  Within a distance
                </option>
                <option value="-1">Doesn't matter</option>
                <option value="1">1 miles</option>
                <option value="5">5 miles</option>
                <option value="10">10 miles</option>
                <option value="15">15 miles</option>
                <option value="20">20 miles</option>
                <option value="25">25 miles</option>
                <option value="50">50 miles</option>
                <option value="100">100 miles</option>
              </select>
            </div>
            <div className="col-12 col-sm-6">
              <select
                className="custom-select"
                name="dentistCityOrZip"
                value={this.props.globalState.patientsSearchLocation}
                onChange={e =>
                  this.props.setContext(
                    'patientsSearchLocation',
                    parseInt(e.target.value, 10)
                  )
                }
              >
                <option placeholder="true" hidden>
                  of City or ZIP Code
                </option>
                <option value="-1">Doesn't matter</option>
                {this.props.locations.map(l => (
                  <option key={l.id_location} value={l.id_location}>
                    {l.zip_code} {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row mb-4 pb-4 border-bottom">
            <div className="col-12 col-sm-6 mb-3 mb-sm-0">
              <label className="form-label" htmlFor="dentistFullName">
                Do you know the dentist's name?
              </label>
              <input
                type="text"
                name="dentistFullName"
                className="form-control"
                placeholder="Dentist's full name"
                value={this.props.globalState.patientsSearchName}
                onChange={e =>
                  this.props.setContext('patientsSearchName', e.target.value)
                }
              />
            </div>
            <div className="col-12 col-sm-6">
              <label className="form-label" htmlFor="dentistSpecialty">
                What's the dentist's specialty?
              </label>
              <select
                className="custom-select"
                name="dentistSpecialty"
                value={this.props.globalState.patientsSearchDentistType}
                onChange={e =>
                  this.props.setContext(
                    'patientsSearchDentistType',
                    e.target.value
                  )
                }
              >
                <option placeholder="true" hidden>
                  Dentist's specialty (Optional)
                </option>
                <option value="-1">Doesn't matter</option>
                {SpecialtyType.filter(t => t.isDentist).map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={this.searchClick}
            className="btn btn-pill btn-hero btn-violet"
          >
            <i className="fas fa-search mr-2" />
            Search
          </button>
        </form>
      </div>
    );
  }
}

export default withGlobalContext(withRouter(PatientsDentistSearch));

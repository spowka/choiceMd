import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { withGlobalContext } from '../../context/GlobalContext.js';
import { FacilityType } from '../../data/ProviderData.js';

class PatientsFacilitySearch extends Component {
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
      patientsSearchFacilityType
    } = this.props.globalState;

    const searchParams = {};
    searchParams.id_provider_type = this.props.idProviderType;

    if (patientsSearchName != null) searchParams.name = patientsSearchName;

    if (patientsSearchDistance != null && patientsSearchDistance !== -1)
      searchParams.distance = patientsSearchDistance;

    if (patientsSearchLocation != null && patientsSearchLocation !== -1)
      searchParams.location = patientsSearchLocation;

    if (patientsSearchFacilityType != null && patientsSearchFacilityType !== -1)
      searchParams.id_facility_type = patientsSearchFacilityType;

    this.props.history.push(
      `/providerSearch?${queryString.stringify(searchParams)}`
    );
  }

  render() {
    return (
      <div
        className="tab-pane fade show active"
        id="tabMedicalFacility"
        role="tabpanel"
      >
        <p>
          This searchable database will assist you in finding hospitals,
          assisted living and urgent care facilities that are close to home and
          meet all your needs.
        </p>
        <form>
          <label className="form-label" htmlFor="medicalFacilityDistance">
            Where would you like to find a medical facility?
          </label>
          <div className="form-row mb-4 pb-4 border-bottom">
            <div className="col-12 col-sm-6 mb-2 mb-sm-0">
              <select
                className="custom-select"
                name="medicalFacilityDistance"
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
                name="medicalFacilityCityOrZip"
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
              <label className="form-label" htmlFor="medicalFacilityFullName">
                Do you know the facility's name?
              </label>
              <input
                type="text"
                name="medicalFacilityFullName"
                className="form-control"
                placeholder="Medical facility name"
                value={this.props.globalState.patientsSearchName}
                onChange={e =>
                  this.props.setContext('patientsSearchName', e.target.value)
                }
              />
            </div>
            <div className="col-12 col-sm-6">
              <label className="form-label" htmlFor="medicalFacilityTypeOf">
                What type of facility is it?
              </label>
              <select
                className="custom-select"
                name="medicalFacilityTypeOf"
                value={this.props.globalState.patientsSearchFacilityType}
                onChange={e =>
                  this.props.setContext(
                    'patientsSearchFacilityType',
                    e.target.value
                  )
                }
              >
                <option placeholder="true" hidden>
                  Facility type (Optional)
                </option>
                <option value="-1">Doesn't matter</option>
                {FacilityType.map(t => (
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

export default withGlobalContext(withRouter(PatientsFacilitySearch));

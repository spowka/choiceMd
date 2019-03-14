import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { withGlobalContext } from '../../context/GlobalContext.js';
import { OrganizationType } from '../../data/ProviderData.js';

class PatientsOrganizationSearch extends Component {
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
      patientsSearchName,
      patientsSearchOrganizationType
    } = this.props.globalState;

    const searchParams = {};
    searchParams.id_provider_type = this.props.idProviderType;

    if (patientsSearchName != null) searchParams.name = patientsSearchName;

    if (
      patientsSearchOrganizationType != null &&
      patientsSearchOrganizationType !== -1
    )
      searchParams.id_organization_type = patientsSearchOrganizationType;

    this.props.history.push(
      `/providerSearch?${queryString.stringify(searchParams)}`
    );
  }

  render() {
    return (
      <div
        className="tab-pane fade show active"
        id="tabNonProfit"
        role="tabpanel"
      >
        <p>
          Get connected to the charities in your neighborhood that will assist
          you with your health needs. Find the best local non-profit or charity
          for you.
        </p>
        <form>
          <div className="form-row mb-4 pb-4 border-bottom">
            <div className="col-12 col-sm-6 mb-3 mb-sm-0">
              <label className="form-label" htmlFor="nonProfitName">
                Do you know the organization's name?
              </label>
              <input
                type="text"
                name="nonProfit"
                className="form-control"
                placeholder="Name"
                value={this.props.globalState.patientsSearchName}
                onChange={e =>
                  this.props.setContext(
                    'patientsSearchName',
                    e.target.value
                  )
                }
              />
            </div>
            <div className="col-12 col-sm-6">
              <label className="form-label" htmlFor="organizationTypeOf">
                What type of organization is it?
              </label>
              <select
                className="custom-select"
                name="organizationTypeOf"
                value={this.props.globalState.patientsSearchOrganizationType}
                onChange={e =>
                  this.props.setContext(
                    'patientsSearchOrganizationType',
                    e.target.value
                  )
                }
              >
                <option placeholder="true" hidden>
                  Organization type (Optional)
                </option>
                <option value="-1">Doesn't matter</option>
                {OrganizationType.map(t => (
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

export default withGlobalContext(withRouter(PatientsOrganizationSearch));

import React, { Component } from 'react';
import { withGlobalContext } from '../../context/GlobalContext.js';
import { ProviderType } from '../../data/ProviderData.js';
import PatientsPhysicianSearch from './PatientsPhysicianSearch.js';
import PatientsDentistSearch from './PatientsDentistSearch.js';
import PatientsFacilitySearch from './PatientsFacilitySearch.js';
import PatientsOrganizationSearch from './PatientsOrganizationSearch.js';

class Patients extends Component {
  constructor(self) {
    super(self);

    this.renderTab = this.renderTab.bind(this);
  }

  componentDidMount() {    
    this.props.loadLocations();
  }

  renderTab(name, index) {
    return (
      <li className="nav-item">
        <button
          className={
            'nav-link ' + (this.props.globalState.patientsActiveTab === index ? 'active' : '')
          }
          onClick={() => this.props.setContext("patientsActiveTab", index)}
        >
          {name}
        </button>
      </li>
    );
  }

  render() {
    return (
      <React.Fragment>
        <div className="bg-mint">
          <div className="container pt-3">
            <ul className="nav nav-tabs nav-tabs-patients" role="tablist">
              {this.renderTab('Physician', 0)}
              {this.renderTab('Dentist', 1)}
              {this.renderTab('Medical Facility', 2)}
              {this.renderTab('Non-profit Organization', 3)}
            </ul>
          </div>
        </div>
        <div className="bg-sand">
          <div className="container py-4 px-3">
            <div className="tab-content">
              {this.props.globalState.patientsActiveTab === 0 && (
                <PatientsPhysicianSearch
                  locations={this.props.globalState.locations}
                  idProviderType={ProviderType.physician}
                />
              )}
              {this.props.globalState.patientsActiveTab === 1 && (
                <PatientsDentistSearch
                  locations={this.props.globalState.locations}
                  idProviderType={ProviderType.dentist}
                />
              )}
              {this.props.globalState.patientsActiveTab === 2 && (
                <PatientsFacilitySearch
                  locations={this.props.globalState.locations}
                  idProviderType={ProviderType.facility}
                />
              )}
              {this.props.globalState.patientsActiveTab === 3 && (
                <PatientsOrganizationSearch
                  idProviderType={ProviderType.organization}
                />
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withGlobalContext(Patients);

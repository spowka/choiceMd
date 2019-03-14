import React, { Component } from 'react';
import axios from 'axios';
import { withGlobalContext } from '../../context/GlobalContext.js';

class ProviderProfile extends Component {

  constructor(self) {
    super(self);

    this.state = {
      idProvider: self.match.params.id,
      provider: [],
    };
  }

  async componentDidMount() {
    axios
      .get(`/api/v1/providers/` + this.state.idProvider)
      .then(response => {
        this.setState({
          provider: response.data
        });
      });
  }

  render() {
    const provider = this.state.provider;
    return (
      <React.Fragment>
        <div className="premium-content">
          <div className="premium-slider">
            <div style={{ lineHeight: "480px", textAlign: "center" }}>Slider placeholder</div>
          </div>
          <div className="container mt-3">
            <h1 className="mb-0">
              {provider.doctor_name && (
                <React.Fragment>
                  Dr.{' '}
                  {provider.doctor_name}
                </React.Fragment>
              )}
              {!provider.doctor_name && (
                <React.Fragment>{provider.name}</React.Fragment>
              )}</h1>
            <strong className="d-block mb-5">{provider.specialty_type}</strong>
            <div className="row">
              <div className="col-md-4 order-2 order-md-1">
                <span className="premium-section-title">Languages</span>
                <span className="premium-section-desc">
                  {/* TODO */}
                  <ul>
                    <li>English</li>
                    <li>Español</li>
                  </ul>
                </span>
                <span className="premium-section-title">Education</span>
                <span className="premium-section-desc">
                  <ul>
                    <li>University of Alabama School of Medicine</li>
                    <li>University of South Alabama College of Medicine</li>
                  </ul>
                </span>
              </div>
              <div className="col-md-4 order-3 order-md-2">
                <span className="premium-section-title">Accepted insurance carriers</span>
                <span className="premium-section-desc">
                  <ul>
                    <li>Kansas City Life Insurance Company</li>
                    <li>Kentucky Farm Bureau</li>
                    <li>Knights of Columbus</li>
                    <li>Lemonade (insurance)</li>
                    <li>Liberty Mutual</li>
                  </ul>
                </span>
                <span className="premium-section-title">Hospital affiliations</span>
                <span className="premium-section-desc">
                  <ul>
                    <li>Baptist Hospital of Miami</li>
                    <li>Baptist Hospital</li>
                    <li>Medical Arts Surgery Center</li>
                  </ul>
                </span>
              </div>
              <div className="col-md-4 order-1 order-md-3">
                <div className="premium-sidebar py-4 px-3 px-lg-4">
                  <button className="btn btn-primary px-3 font-roboto"><i className="fas fa-phone fa-flip-horizontal mr-2"></i>+1 23 4567 890</button>
                  <span className="premium-section-title mt-4">Locations</span>
                  <span className="premium-section-desc">
                    <ul>
                      <li>17101 NE 19th Ave Suite 204</li>
                      <li>North Miami Beach, FL 33162</li>
                    </ul>
                    <a target="_blank"
                      rel="noopener noreferrer"
                      href={`http://maps.google.com/maps?saddr=Current+Location&daddr=${provider.lat},${provider.lng}&ie=UTF-8&view=map&t=m&z=16`}
                      className="btn btn-sm btn-primary font-roboto mt-2">
                      Get directions</a>
                    <ul className="mt-4">
                      <li>17101 NE 19th Ave Suite 204</li>
                      <li>North Miami Beach, FL 33162</li>
                    </ul>
                    <a target="_blank"
                      rel="noopener noreferrer"
                      href={`http://maps.google.com/maps?saddr=Current+Location&daddr=${provider.lat},${provider.lng}&ie=UTF-8&view=map&t=m&z=16`}
                      className="btn btn-sm btn-primary font-roboto mt-2">
                      Get directions</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default withGlobalContext(ProviderProfile);


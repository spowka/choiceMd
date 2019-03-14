import React from 'react';

const ProviderProfile = ({ provider }) => {
  console.log(provider);
  return (
    <React.Fragment>
      <div className="bg-sand">
        <div className="container py-3 px-3">
          <div className="py-3">
            <div className="row">
              <div className="col">
                <div className="px-3">
                  <h2>
                    {provider.doctor_name
                      ? provider.doctor_name
                      : provider.name}
                  </h2>
                  <div className="text-muted pb-3">
                    {provider.specialty_type}
                  </div>

                  <div className="pb-3 align-middle clearfix">
                    <button
                      type="submit"
                      className="btn btn-pill btn-violet px-3 float-left"
                      title="Like this provider"
                    >
                      <i className="fas fa-thumbs-up" />
                    </button>
                    <span className="d-inline-block ml-3 mt-2 float-left">
                      Be the first to like this profile
                    </span>
                  </div>

                  <div className="pb-3">
                    <div className="profile-section-title">Address</div>
                    <div className="row">
                      <div className="col-2" />
                      <div className="col-9 pl-0">
                        <strong>{provider.name}</strong>
                        <br />
                        {provider.address_street1}
                        <br />
                        {provider.address_street2 && (
                          <React.Fragment>
                            {provider.address_street2}
                            <br />
                          </React.Fragment>
                        )}
                        {provider.address_city}, {provider.address_state}{' '}
                        {provider.address_zipcode}
                        <br />
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`http://maps.google.com/maps?saddr=Current+Location&daddr=${provider.lat},${provider.lng}&ie=UTF-8&view=map&t=m&z=16`}
                          className="link-violet"
                        >
                          <i className="fas fa-map-marker-alt mr-2" />
                          Get directions
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="pb-3">
                    <div className="profile-section-title">Contact</div>
                    <div className="row">
                      <div className="col-2" />
                      <div className="col-9 pl-0 font-weight-bold">
                        {provider.phone_number}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-2" />
                      <div className="col-9 pl-0 font-weight-bold">
                        {provider.email}
                      </div>
                    </div>
                  </div>

                  <div className="pb-3">
                    <div className="profile-section-title">Other info</div>
                    <div className="row">
                      <div className="col-2" />
                      <div className="col-9 pl-0 font-weight-bold">Male</div>
                    </div>
                  </div>

                  <div className="profile-section-title">
                    Is this your profile?
                  </div>

                  <div className="pb-3">
                    We can automatically send you a special Edit Link that will
                    allow you to update it.
                  </div>

                  <button
                    type="submit"
                    className="btn btn-pill btn-violet px-3"
                  >
                    <i className="fas fa-pen mr-2" />
                    Edit your profile
                  </button>
                </div>
              </div>
              <div className="col">
                <div className="bg-tan-dark-tint rounded p-3">
                  <iframe title="map" width="100%" height="450px" frameBorder="0" style={{border: "0"}} src={`https://www.google.com/maps/embed/v1/place?q=${provider.lat},${provider.lng}&key=AIzaSyAV07GB3KmeQq5G04-XERnKmPyIQhMbU8w`} allowFullScreen></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProviderProfile;

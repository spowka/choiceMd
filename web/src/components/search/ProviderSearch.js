import React, { Component } from "react";
import { withGlobalContext } from "../../context/GlobalContext.js";
import axios from "axios";
import queryString from "query-string";
import ProviderSearchResult from "./ProviderSearchResult";
import {
  ProviderTypeName,
  FacilityType,
  OrganizationType,
  SpecialtyType
} from "../../data/ProviderData.js";

class ProviderSearch extends Component {
  constructor(self) {
    super(self);

    this.state = {
      results: null,
      total_count: null,
      total_pages: null,
      total_remaining: null,
      pages: [],
      errors: {},
      current_page: 1,
      idProviderType: -1,
      id_specialty_type: -1,
      id_facility_type: -1,
      id_organization_type: -1,
      name: "",
      lat: null,
      lng: null
    };

    this.profileClick = this.profileClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.renderDefault = this.renderDefault.bind(this);
    this.renderOrganizationTypes = this.renderOrganizationTypes.bind(this);
    this.renderFacilityTypes = this.renderFacilityTypes.bind(this);
    this.renderSpecialtyTypes = this.renderSpecialtyTypes.bind(this);
    this.handleShowMore = this.handleShowMore.bind(this);
    this.fetchData = this.fetchData.bind(this);

    this.getSearchQueryString = this.getSearchQueryString.bind(this);
    this.getLocation = this.getLocation.bind(this);

    this.likeClick = this.likeClick.bind(this);
  }

  async componentDidMount() {
    if (this.props.globalState.locations.length === 0) {
      await this.props.loadLocations();
    }

    if (
      (this.props.globalState.idProviderType &&
        this.props.globalState.idProviderType !== -1) ||
      this.getLocation() != null ||
      (this.props.globalState.name && this.props.globalState.name !== "")
    ) {
      this.handleSubmit();
    }
  }

  getSearchQueryString(pageIndex) {
    let location_lat = null;
    let location_lng = null;

    const location = this.getLocation();

    if (location) {
      location_lat = location.lat;
      location_lng = location.lng;
    }

    const searchParams = {};

    searchParams.id_provider_type =
      this.props.globalState.idProviderType !== -1
        ? this.props.globalState.idProviderType
        : undefined;

    searchParams.name =
      this.props.globalState.name !== ""
        ? this.props.globalState.name
        : undefined;

    searchParams.id_specialty_type =
      this.props.globalState.id_specialty_type !== -1 &&
      (searchParams.id_provider_type === 3 ||
        searchParams.id_provider_type === 4)
        ? this.props.globalState.id_specialty_type
        : undefined;

    searchParams.id_facility_type =
      this.props.globalState.id_facility_type !== -1 &&
      searchParams.id_provider_type === 2
        ? this.props.globalState.id_facility_type
        : undefined;

    searchParams.id_organization_type =
      this.props.globalState.id_organization_type !== -1 &&
      searchParams.id_provider_type === 1
        ? this.props.globalState.id_organization_type
        : undefined;

    searchParams.location_lat =
      location_lat !== null ? location_lat : undefined;

    searchParams.location_lng =
      location_lng !== null ? location_lng : undefined;

    searchParams.page = pageIndex;
    searchParams.page_size = 20;

    return queryString.stringify(searchParams);
  }

  getLocation() {
    if (
      this.props.globalState.patientsSearchLocation !== "null" &&
      !isNaN(this.props.globalState.patientsSearchLocation)
    ) {
      const location = this.props.globalState.locations.filter(
        l =>
          l.id_location ===
          parseInt(this.props.globalState.patientsSearchLocation, 10)
      )[0];

      return location;
    }

    return null;
  }

  handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    if (this.validateForm()) {
      // console.log(`http://choicemdtest-env.wmc9a7xx7u.us-east-2.elasticbeanstalk.com/api/v1/providers?${this.getSearchQueryString(1)}`);
      this.fetchData(1);
    }
  }

  fetchData(currentPage) {
    axios
      .get(`/api/v1/providers?${this.getSearchQueryString(currentPage)}`)
      .then(response => {
        let results = response.data.results;

        if (currentPage > 1) {
          results = [...this.state.results, ...response.data.results];
        }

        console.log(response.data);

        let totalRemaining =
          response.data.total_count -
          response.data.page_size * response.data.current_page;

        this.setState({
          results: results,
          total_count: response.data.total_count,
          total_pages: response.data.total_pages,
          providerType: ProviderTypeName[this.props.globalState.idProviderType],
          current_page: currentPage,
          isSearchFinished: true,
          total_remaining: totalRemaining
        });
      });
  }

  handleShowMore() {
    let currentPage = this.state.current_page + 1;
    //console.log(`http://choicemdtest-env.wmc9a7xx7u.us-east-2.elasticbeanstalk.com/api/v1/providers?${this.getSearchQueryString(currentPage)}`);
    if (
      this.state.total_pages == null ||
      currentPage <= this.state.total_pages
    ) {
      this.fetchData(currentPage);
    }
  }

  validateForm() {
    let errors = {};
    let formIsValid = false;

    if (
      !isNaN(this.props.globalState.patientsSearchLocation) &&
      this.props.globalState.patientsSearchLocation !== -1
    ) {
      formIsValid = true;
    }
    if (
      !isNaN(this.props.globalState.idProviderType) &&
      this.props.globalState.idProviderType !== -1
    ) {
      formIsValid = true;
    }
    if (this.props.globalState.name !== "") {
      formIsValid = true;
    }

    if (!formIsValid) {
      errors["custom"] = "Please select one of the search options";
    }

    this.setState({
      errors: errors
    });

    return formIsValid;
  }

  renderDefault() {
    return (
      <React.Fragment>
        <select className="custom-select mb-3 mb-sm-3">
          <option placeholder="true" hidden value={-1}>
            {" "}
            Choose Specialization
          </option>
        </select>
      </React.Fragment>
    );
  }

  renderOrganizationTypes() {
    return (
      <React.Fragment>
        <select
          className="custom-select mb-3 mb-sm-3"
          name="facilityType"
          value={this.props.globalState.id_organization_type}
          onChange={e =>
            this.props.setContext(
              "id_organization_type",
              parseInt(e.target.value, 10)
            )
          }
        >
          <option placeholder="true" value={-1}>
            {" "}
            Choose Category
          </option>
          {OrganizationType.map(ot => (
            <option key={ot.id} value={ot.id}>
              {ot.name}
            </option>
          ))}
        </select>
      </React.Fragment>
    );
  }

  renderFacilityTypes() {
    return (
      <React.Fragment>
        <select
          className="custom-select mb-3 mb-sm-3"
          name="facilityType"
          value={this.props.globalState.id_facility_type}
          onChange={e =>
            this.props.setContext(
              "id_facility_type",
              parseInt(e.target.value, 10)
            )
          }
        >
          <option placeholder="true" value={-1}>
            {" "}
            Choose Category
          </option>
          {FacilityType.map(ft => (
            <option key={ft.id} value={ft.id}>
              {ft.name}
            </option>
          ))}
        </select>
      </React.Fragment>
    );
  }

  renderSpecialtyTypes(isDentist) {
    return (
      <React.Fragment>
        <select
          className="custom-select mb-3 mb-sm-3"
          name="specialtyType"
          value={this.props.globalState.id_specialty_type}
          onChange={e =>
            this.props.setContext(
              "id_specialty_type",
              parseInt(e.target.value, 10)
            )
          }
        >
          <option placeholder="true" value={-1}>
            {" "}
            Choose Specialization
          </option>
          {SpecialtyType.filter(st => st.isDentist === isDentist).map(st => (
            <option key={st.id} value={st.id}>
              {st.name}
            </option>
          ))}
        </select>
      </React.Fragment>
    );
  }

  renderSpecialSchools() {
    return (
      <React.Fragment>
        <select
          className="custom-select mb-3 mb-sm-3"
          name="specialtyType"
          value=""
          onChange={() => {}}
          disabled={true}
        />
      </React.Fragment>
    );
  }

  profileClick(provider, event) {
    //remove all css class clicked
    var resultDiv = document.getElementsByClassName("result");
    var i;
    for (i = 0; i < resultDiv.length; i++) {
      resultDiv[i].classList.remove("clicked");
    }

    //add class click on selected element
    event.currentTarget.classList.add("clicked");

    this.setState({
      lat: provider.lat,
      lng: provider.lng
    });
  }

  async likeClick(provider) {
    // Gets the providers the user already liked
    const likedProviders = localStorage.getItem("likedProviders");
    const likedProvidersArr = likedProviders ? likedProviders.split(",") : [];

    // Make a post request to the server to add the like
    await axios.post(`/api/v1/providers/${provider.id_provider}/like`);

    console.log(
      likedProvidersArr
        ? [...likedProvidersArr, provider.id_provider]
        : [provider.id_provider]
    );

    // Add Provider to liked ones
    localStorage.setItem(
      "likedProviders",
      likedProvidersArr
        ? [...likedProvidersArr, provider.id_provider]
        : [provider.id_provider]
    );

    // Increments the provider's likes
    this.setState({
      results: this.state.results.map(listedProvider =>
        listedProvider.id_provider === provider.id_provider
          ? { ...listedProvider, likes: listedProvider.likes + 1 }
          : listedProvider
      )
    });
  }

  isLiked(provider) {
    // Gets the providers the user already liked
    const likedProviders = localStorage.getItem("likedProviders");
    const likedProvidersArr = likedProviders ? likedProviders.split(",") : [];

    return (
      likedProvidersArr && likedProvidersArr.includes("" + provider.id_provider)
    );
  }

  render() {
    const location = this.getLocation();
    return (
      <React.Fragment>
        {/* <!-- Filters --> */}
        <div className="patients-filters pb-3">
          <form onSubmit={this.handleSubmit}>
            <div className="container d-none d-lg-block" id="filters">
              <div className="row">
                <div className="col-12 col-lg">
                  <select
                    className="custom-select mb-3 mb-sm-3"
                    name="dentistCityOrZip"
                    value={this.props.globalState.patientsSearchLocation}
                    onChange={e =>
                      this.props.setContext(
                        "patientsSearchLocation",
                        parseInt(e.target.value, 10)
                      )
                    }
                  >
                    <option placeholder="true">Choose City</option>
                    {this.props.globalState.locations.map(l => (
                      <option key={l.id_location} value={l.id_location}>
                        {l.zip_code} {l.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-lg">
                  <select
                    className="custom-select mb-3 mb-sm-3"
                    name="idProviderType"
                    value={this.props.globalState.idProviderType}
                    onChange={e => {
                      this.props.setContext(
                        "idProviderType",
                        parseInt(e.target.value, 10)
                      );
                      this.props.setContext("id_specialty_type", -1);
                    }}
                  >
                    <option placeholder="true"> Choose Provider</option>
                    {Object.keys(ProviderTypeName).map(id => (
                      <option key={id} value={id}>
                        {ProviderTypeName[id].singular}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-lg">
                  {(this.props.globalState.idProviderType === -1 ||
                    isNaN(this.props.globalState.idProviderType)) &&
                    this.renderDefault()}
                  {this.props.globalState.idProviderType === 1 &&
                    this.renderOrganizationTypes()}
                  {this.props.globalState.idProviderType === 2 &&
                    this.renderFacilityTypes()}
                  {this.props.globalState.idProviderType === 3 &&
                    this.renderSpecialtyTypes(false)}
                  {this.props.globalState.idProviderType === 4 &&
                    this.renderSpecialtyTypes(true)}
                  {this.props.globalState.idProviderType === 5 &&
                    this.renderSpecialSchools(true)}
                </div>
                <div className="col-12 col-lg">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Name"
                    value={this.props.globalState.name}
                    onChange={e =>
                      this.props.setContext("name", e.target.value)
                    }
                  />
                </div>
                <div className="col-lg-2">
                  <button
                    type="submit"
                    className="btn btn-block px-0 text-center btn-primary mt-3 mt-lg-0"
                  >
                    <i className="fas fa-search mr-2" />
                    Search
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="text-danger">
                    {this.state.errors["custom"]}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* <!-- Map --> */}
        <div className="patients-map d-none d-lg-block">
          <iframe
            title="map"
            width="100%"
            height="450px"
            frameBorder="0"
            style={{ border: "0" }}
            src={
              this.state.lat
                ? `https://www.google.com/maps/embed/v1/place?q=${
                    this.state.lat
                  },${
                    this.state.lng
                  }&key=AIzaSyAV07GB3KmeQq5G04-XERnKmPyIQhMbU8w`
                : `https://www.google.com/maps/embed/v1/view?center=25.7623022,-80.1976508&zoom=12&key=AIzaSyAV07GB3KmeQq5G04-XERnKmPyIQhMbU8w`
            }
            allowFullScreen
          />
        </div>

        {/* <!-- Content --> */}
        <div className="patients-content">
          <div className="container">
            <div className="result-table">
              {!this.state.results && (
                <div className="text-center py-5">
                  Enter search terms to get a list of providers.
                </div>
              )}
              {this.state.results && this.state.results.length === 0 && (
                <div className="text-center py-5">
                  No providers found for your search terms.
                </div>
              )}
              {this.state.total_count > 0 && (
                <React.Fragment>
                  <div
                    className="mb-4"
                    style={{ textAlign: "center", color: "#666666" }}
                  >
                    <strong>{this.state.total_count} providers found</strong>
                  </div>
                </React.Fragment>
              )}
              {this.state.results &&
                this.state.results.map(r => (
                  <ProviderSearchResult
                    key={r.id_provider}
                    result={r}
                    onProfileClick={this.profileClick}
                    onLikeClick={() => this.likeClick(r)}
                    liked={() => this.isLiked(r)}
                    showDistance={location != null}
                  />
                ))}
            </div>
            {this.state.current_page < this.state.total_pages && (
              <div className="text-center py-4">
                <button
                  className="btn btn-primary font-roboto"
                  onClick={this.handleShowMore}
                >
                  Show more ({this.state.total_remaining} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withGlobalContext(ProviderSearch);

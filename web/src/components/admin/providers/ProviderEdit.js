import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import { withGlobalContext } from "../../../context/GlobalContext.js";
import {
  ProviderTypeName,
  FacilityType,
  OrganizationType,
  SpecialtyType
} from "../../../data/ProviderData.js";
import ModalAlert from "../../admin/layout/ModalAlert.js";

class ProviderEdit extends Component {
  constructor(self) {
    super(self);

    this.state = {
      user: null,
      users: [],
      idProvider: self.match.params.id,
      idProviderType: "1",
      name: "",
      adressStreet1: "",
      adressStreet2: "",
      adressZipcode: "",
      adressCity: "",
      adressState: "",
      lat: 0,
      lng: 0,
      contactName: "",
      email: "",
      website: "",
      phoneNumber: "",
      doctorFirstName: "",
      doctorLastName: "",
      doctorMiddleName: "",
      doctorGender: -1,
      errors: {},
      organizatonTypes: [],
      facilityTypes: [],
      specialtyTypes: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getUrl = this.getUrl.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.fetchUsers = this.fetchUsers.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.renderOrganizationTypes = this.renderOrganizationTypes.bind(this);
    this.renderFacilityTypes = this.renderFacilityTypes.bind(this);
    this.renderSpecialtyTypes = this.renderSpecialtyTypes.bind(this);
    this.handleOrganizationTypeChange = this.handleOrganizationTypeChange.bind(
      this
    );
    this.handleFacilityTypeChange = this.handleFacilityTypeChange.bind(this);
    this.handleSpecialtyTypeChange = this.handleSpecialtyTypeChange.bind(this);
  }

  async componentDidMount() {
    const user = this.props.user;
    if (!user) return;

    let users = null;

    if (user.id_user_role === 1) {
      users = await this.fetchUsers();
    } else {
      users = [user];
    }

    this.setState({ user, users });

    if (this.state.idProvider != null) this.fetchData();
  }

  getUrl() {
    let url = "/api/v1/providers";

    if (this.state.idProvider != null) url = url + "/" + this.state.idProvider;

    return url;
  }

  fetchData() {
    axios.get(`${this.getUrl()}`).then(response => {
      const provider = response.data;
      this.setState({
        idProviderType: provider.id_provider_type,
        idUser: provider.id_user,
        name: provider.name || "",
        adressStreet1: provider.address_street1 || "",
        adressStreet2: provider.address_street2 || "",
        adressZipcode: provider.address_zipcode || "",
        adressCity: provider.address_city || "",
        adressState: provider.address_state || "",
        lat: provider.lat,
        lng: provider.lng,
        contactName: provider.contact_name || "",
        email: provider.email || "",
        website: provider.website || "",
        phoneNumber: provider.phone_number,
        doctorFirstName: provider.doctor_firstname || "",
        doctorLastName: provider.doctor_lastname || "",
        doctorMiddleName: provider.doctor_middlename || "",
        doctorGender: provider.doctor_gender,
        organizatonTypes: provider.organization_types || [],
        facilityTypes: provider.facility_types || [],
        specialtyTypes: provider.specialty_types || []
      });
    });
  }

  async fetchUsers() {
    return await axios.get(`/api/v1/users?page_size=99999`).then(response => {
      return response.data.results;
    });
  }

  getAddressCoordinates() {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      const {
        adressStreet1,
        adressStreet2,
        adressCity,
        adressZipcode,
        adressState
      } = this.state;

      geocoder.geocode(
        {
          address: `${adressStreet1} ${adressStreet2} ${adressCity}, ${adressState} ${adressZipcode}`
        },
        (results, status) => {
          if (status === window.google.maps.GeocoderStatus.OK) {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            resolve({
              lat,
              lng
            });
          } else {
            reject("Address does not exist!");
          }
        }
      );
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    let organizatonTypes = [];
    let facilityTypes = [];
    let specialtyTypes = [];

    if (this.state.idProviderType === 1)
      organizatonTypes = this.state.organizatonTypes;
    if (this.state.idProviderType === 2)
      facilityTypes = this.state.facilityTypes;
    if (this.state.idProviderType === 3)
      specialtyTypes = this.state.specialtyTypes.filter(
        st => SpecialtyType[st].isDentist === false
      );
    if (this.state.idProviderType === 4)
      specialtyTypes = this.state.specialtyTypes.filter(
        st => SpecialtyType[st].isDentist === true
      );

    const { lat, lng } = await this.getAddressCoordinates();
    const data = {
      id_user: this.state.idUser === -1 ? null : this.state.idUser,
      ...(this.state.idProvider ? { id_provider: this.state.idProvider } : {}),
      id_provider_type: this.state.idProviderType,
      name: this.state.name,
      address_street1: this.state.adressStreet1,
      address_street2: this.state.adressStreet2,
      address_zipcode: this.state.adressZipcode,
      address_city: this.state.adressCity,
      address_state: this.state.adressState,
      lat,
      lng,
      contact_name: this.state.contactName,
      email: this.state.email,
      website: this.state.website,
      phone_number: this.state.phoneNumber,
      doctor_name: "",
      doctor_firstname: this.state.doctorFirstName,
      doctor_lastname: this.state.doctorLastName,
      doctor_middlename: this.state.doctorMiddleName,
      doctor_gender: this.state.doctorGender,
      organization_types: organizatonTypes,
      facility_types: facilityTypes,
      specialty_types: specialtyTypes
    };

    if (this.validateForm()) {
      if (this.state.idProvider != null) {
        axios
          .put(`${this.getUrl()}`, data)
          .then(response => {
            document.getElementById("btn-modal-alert").click();
            this.props.history.push("/admin/providers");
          })
          .catch(error => console.log(error));
      } else {
        axios
          .post(`${this.getUrl()}`, data)
          .then(response => {
            document.getElementById("btn-modal-alert").click();
            this.props.history.push("/admin/providers");
          })
          .catch(error => console.log(error));
      }
    }
  }

  validateForm() {
    let errors = {};
    let formIsValid = true;
    const {
      name,
      idProviderType,
      doctorFirstName,
      doctorMiddleName,
      doctorLastName,
      doctorGender,
      adressStreet1
    } = this.state;

    if (name === "") {
      formIsValid = false;
      errors["name"] = "*Please enter name";
    }
    if (idProviderType === null || idProviderType === "-1") {
      formIsValid = false;
      errors["idProviderType"] = "*Please enter provider type";
    }

    if (idProviderType === 3 || idProviderType === 4) {
      if (!doctorFirstName) {
        formIsValid = false;
        errors["doctorFirstName"] = "*Please enter first name";
      }

      if (!doctorMiddleName) {
        formIsValid = false;
        errors["doctorMiddleName"] = "*Please enter middle name";
      }

      if (!doctorLastName) {
        formIsValid = false;
        errors["doctorLastName"] = "*Please enter last name";
      }

      if (doctorGender === null || doctorGender === -1) {
        formIsValid = false;
        errors["doctorGender"] = "*Please enter gender";
      }
    }

    if (!adressStreet1) {
      formIsValid = false;
      errors["adressStreet1"] = "*Please enter street 1";
    }

    this.setState({
      errors: errors
    });

    return formIsValid;
  }

  handleOrganizationTypeChange(e) {
    const val = parseInt(e.target.value, 10);
    let newTypes = [...this.state.organizatonTypes];

    if (e.target.checked) {
      newTypes.push(val);
    } else {
      newTypes = newTypes.filter(t => t !== val);
    }

    this.setState({ organizatonTypes: newTypes });
  }

  handleFacilityTypeChange(e) {
    const val = parseInt(e.target.value, 10);
    let newTypes = [...this.state.facilityTypes];

    if (e.target.checked) {
      newTypes.push(val);
    } else {
      newTypes = newTypes.filter(t => t !== val);
    }

    this.setState({ facilityTypes: newTypes });
  }

  handleSpecialtyTypeChange(e) {
    const val = parseInt(e.target.value, 10);
    let newTypes = [...this.state.specialtyTypes];

    if (e.target.checked) {
      newTypes.push(val);
    } else {
      newTypes = newTypes.filter(t => t !== val);
    }

    this.setState({ specialtyTypes: newTypes });
  }

  getSpecialityName(id) {
    const providerType = ProviderTypeName[id].singular.toLowerCase();
    return providerType === "physician"
      ? "Doctor"
      : providerType === "dentist"
      ? "Dentist"
      : providerType === "facility"
      ? "Manager"
      : providerType === "support organization"
      ? "Manager"
      : providerType === "special school"
      ? "Teacher"
      : "Doctor";
  }

  renderOrganizationTypes() {
    return (
      <div className="m-3 w-100">
        <label className="form-label" htmlFor="contactName">
          Organization Type
        </label>
        <div className="admin-org-type-select">
          {OrganizationType.map(ot => (
            <React.Fragment>
              <input
                onChange={this.handleOrganizationTypeChange}
                type="checkbox"
                name="organizationType"
                value={ot.id}
                checked={
                  this.state.organizatonTypes.filter(o => o === ot.id).length >
                  0
                }
              />
              <span style={{ marginLeft: "10px" }}>{ot.name}</span>
              <br />
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  renderFacilityTypes() {
    return (
      <div className="m-3 w-100">
        <label className="form-label" htmlFor="contactName">
          Facility Type
        </label>
        <div
          style={{
            height: "200px",
            overflow: "scroll",
            boxShadow: "inset 2px 2px 12px lightgray"
          }}
          className="p-3"
        >
          {FacilityType.map(ft => (
            <React.Fragment>
              <input
                onChange={this.handleFacilityTypeChange}
                type="checkbox"
                name="facilityType"
                value={ft.id}
                checked={
                  this.state.facilityTypes.filter(f => f === ft.id).length > 0
                }
              />
              <span style={{ marginLeft: "10px" }}>{ft.name}</span>
              <br />
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  renderSpecialtyTypes(isDentist) {
    return (
      <div className="m-3 w-100">
        <label className="form-label" htmlFor="contactName">
          Specialty Type
        </label>
        <div className="admin-org-type-select">
          {SpecialtyType.filter(st => st.isDentist === isDentist).map(st => (
            <React.Fragment>
              <input
                onChange={this.handleSpecialtyTypeChange}
                type="checkbox"
                name="specialtyType"
                value={st.id}
                checked={
                  this.state.specialtyTypes.filter(s => s === st.id).length > 0
                }
              />
              <span style={{ marginLeft: "10px" }}>{st.name}</span>
              <br />
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        <div className="d-flex flex-column align-items-center">
          <div className="admin-edit-form-header">
            <h1>
              {this.state.idProvider != null ? "Edit provider" : "Add provider"}
            </h1>
          </div>

          <form
            onSubmit={this.handleSubmit}
            className="admin-edit-form form-bigger"
          >
            <div className="align-self-start ml-3 admin-form-field">
              <label className="form-label" htmlFor="contactName">
                User
              </label>
              <select
                className="custom-select"
                name="idUser"
                value={this.state.idUser}
                onChange={e =>
                  this.setState({ idUser: parseInt(e.target.value, 10) })
                }
              >
                <option value="-1">-- no user --</option>

                {this.state.users.map(t => (
                  <option key={t.id_user} value={t.id_user}>
                    {t.name}
                  </option>
                ))}
              </select>
              <div className="text-danger">{this.state.errors["idUser"]}</div>
            </div>

            <fieldset className="mt-4">
              <legend>Provider</legend>
              <div className="fieldset-inner-wrapper">
                <div className="mx-3 admin-form-field">
                  <label className="form-label" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={this.state.name}
                    className="form-control mb-3"
                    onChange={e => this.setState({ name: e.target.value })}
                  />
                  <div className="text-danger">{this.state.errors["name"]}</div>
                </div>

                <div className="mx-3 admin-form-field ">
                  <label className="form-label" htmlFor="contactName">
                    Provider Type
                  </label>
                  <select
                    className="custom-select mb-3"
                    name="idProviderType"
                    value={this.state.idProviderType}
                    onChange={e =>
                      this.setState({
                        idProviderType: parseInt(e.target.value, 10)
                      })
                    }
                  >
                    {Object.keys(ProviderTypeName).map(id => (
                      <option key={id} value={id}>
                        {ProviderTypeName[id].singular}
                      </option>
                    ))}
                  </select>
                  <div className="text-danger">
                    {this.state.errors["idProviderType"]}
                  </div>
                </div>

                {this.state.idProviderType === 1 &&
                  this.renderOrganizationTypes()}
                {this.state.idProviderType === 2 && this.renderFacilityTypes()}
                {this.state.idProviderType === 3 &&
                  this.renderSpecialtyTypes(false)}
                {this.state.idProviderType === 4 &&
                  this.renderSpecialtyTypes(true)}
              </div>
            </fieldset>

            <fieldset className="mt-4">
              <legend>
                {this.getSpecialityName(this.state.idProviderType)} Information
              </legend>
              <div className="fieldset-inner-wrapper">
                <div className="mx-3 admin-form-field">
                  <label className="form-label" htmlFor="doctorFirstName">
                    {this.getSpecialityName(this.state.idProviderType)} First
                    Name
                  </label>
                  <input
                    type="text"
                    name="doctorFirstName"
                    value={this.state.doctorFirstName}
                    className="form-control mb-3"
                    onChange={e =>
                      this.setState({ doctorFirstName: e.target.value })
                    }
                  />
                  <div className="text-danger">
                    {this.state.errors["doctorFirstName"]}
                  </div>
                </div>
                <div className="mx-3 admin-form-field">
                  <label className="form-label" htmlFor="doctorMiddleName">
                    {this.getSpecialityName(this.state.idProviderType)} Middle
                    Name
                  </label>
                  <input
                    type="text"
                    name="doctorMiddleName"
                    value={this.state.doctorMiddleName}
                    className="form-control mb-3"
                    onChange={e =>
                      this.setState({ doctorMiddleName: e.target.value })
                    }
                  />
                  <div className="text-danger">
                    {this.state.errors["doctorMiddleName"]}
                  </div>
                </div>
                <div className="mx-3 admin-form-field">
                  <label className="form-label" htmlFor="doctorLastName">
                    {this.getSpecialityName(this.state.idProviderType)} Last
                    Name
                  </label>
                  <input
                    type="text"
                    name="doctorLastName"
                    value={this.state.doctorLastName}
                    className="form-control mb-3"
                    onChange={e =>
                      this.setState({ doctorLastName: e.target.value })
                    }
                  />
                  <div className="text-danger">
                    {this.state.errors["doctorLastName"]}
                  </div>
                </div>

                <div className="mx-3 admin-form-field ">
                  <label className="form-label" htmlFor="doctorGender">
                    {this.getSpecialityName(this.state.idProviderType)} Gender
                  </label>
                  <select
                    className="custom-select"
                    name="doctorGender"
                    value={this.state.doctorGender}
                    onChange={e =>
                      this.setState({ doctorGender: e.target.value })
                    }
                  >
                    <option value="-1">-- not defined --</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                  </select>
                  <div className="text-danger">
                    {this.state.errors["doctorGender"]}
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset className="mt-4">
              <legend>Location</legend>
              <div className="fieldset-inner-wrapper">
                <div className="mx-3 admin-half-form-field">
                  <label className="form-label" htmlFor="adressStreet1">
                    Street 1
                  </label>
                  <input
                    type="text"
                    name="adressStreet1"
                    value={this.state.adressStreet1}
                    className="form-control mb-3"
                    onChange={e =>
                      this.setState({ adressStreet1: e.target.value })
                    }
                  />
                  <div className="text-danger">
                    {this.state.errors["adressStreet1"]}
                  </div>
                </div>
                <div className="mx-3 admin-half-form-field">
                  <label className="form-label" htmlFor="adressStreet2">
                    Street 2
                  </label>
                  <input
                    type="text"
                    name="adressStreet2"
                    value={this.state.adressStreet2}
                    className="form-control mb-3"
                    onChange={e =>
                      this.setState({ adressStreet2: e.target.value })
                    }
                  />
                  <div className="text-danger">
                    {this.state.errors["adressStreet2"]}
                  </div>
                </div>
                <div className="mx-3 admin-form-field">
                  <label className="form-label" htmlFor="adressCity">
                    City
                  </label>
                  <input
                    type="text"
                    name="adressCity"
                    value={this.state.adressCity}
                    className="form-control mb-3"
                    onChange={e =>
                      this.setState({ adressCity: e.target.value })
                    }
                  />
                </div>
                <div className="mx-3 admin-form-field">
                  <label className="form-label" htmlFor="adressState">
                    State
                  </label>
                  <input
                    type="text"
                    name="adressState"
                    value={this.state.adressState}
                    className="form-control mb-3"
                    onChange={e =>
                      this.setState({ adressState: e.target.value })
                    }
                  />
                </div>
                <div className="mx-3 admin-form-field">
                  <label className="form-label" htmlFor="adressZipcode">
                    Zip code
                  </label>
                  <input
                    type="text"
                    name="adressZipcode"
                    value={this.state.adressZipcode}
                    className="form-control mb-3"
                    onChange={e =>
                      this.setState({ adressZipcode: e.target.value })
                    }
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="mt-4">
              <legend>Contact Information</legend>
              <div className="fieldset-inner-wrapper">
                <div className="mx-3 admin-form-field">
                  <label className="form-label" htmlFor="contactName">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={this.state.contactName}
                    className="form-control mb-3"
                    onChange={e =>
                      this.setState({ contactName: e.target.value })
                    }
                  />
                </div>
                <div className="mx-3 admin-form-field">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={this.state.email}
                    className="form-control mb-3"
                    onChange={e => this.setState({ email: e.target.value })}
                  />
                </div>
                <div className="mx-3 admin-form-field">
                  <label className="form-label" htmlFor="phoneNumber">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={this.state.phoneNumber}
                    className="form-control mb-3"
                    onChange={e =>
                      this.setState({ phoneNumber: e.target.value })
                    }
                  />
                </div>

                <div className="mx-3 admin-form-field">
                  <label className="form-label" htmlFor="website">
                    Website
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={this.state.website}
                    className="form-control mb-3"
                    onChange={e => this.setState({ website: e.target.value })}
                  />
                </div>
              </div>
            </fieldset>

            <div className="mt-4 d-flex flex-wrap justify-content-center align-items-center">
              <input
                type="submit"
                value="Save"
                className="btn btn-pill btn-primary btn-violet admin-provider-btn mx-2 my-4"
              />
              <Link
                className="btn btn-pill btn-hero btn-violet admin-provider-btn mx-2"
                to="/admin/providers"
              >
                Back
              </Link>
            </div>
          </form>
        </div>
        <ModalAlert
          modalTitle="Well done!"
          modalText="Data Successfully Saved"
        />
        <button
          id="btn-modal-alert"
          className="btn btn-pill btn-hero btn-violet"
          data-toggle="modal"
          data-target="#modalAlert"
          style={{ display: "none" }}
        />
      </React.Fragment>
    );
  }
}

export default withGlobalContext(withRouter(ProviderEdit));

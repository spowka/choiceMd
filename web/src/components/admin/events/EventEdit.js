import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import { withGlobalContext } from "../../../context/GlobalContext.js";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import ModalAlert from "../../admin/layout/ModalAlert.js";

class EventEdit extends Component {
  constructor(self) {
    super(self);

    this.state = {
      user: null,
      idEvent: self.match.params.id,
      name: "",
      dateFrom: "",
      dateTo: "",
      link: "",
      categories: [],
      categoriesParent: [],
      categoriesChild: [],
      categoryParentId: "",
      categoryChildId: "",
      idEventCategory: "",
      isChildCategorySelectDisabled: true,
      errors: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getUrl = this.getUrl.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.categoryParentChange = this.categoryParentChange.bind(this);
    this.categoryChildChange = this.categoryChildChange.bind(this);
    this.changeFromDate = this.changeFromDate.bind(this);
  }

  async componentDidMount() {
    const user = this.props.user;
    if (!user) return;

    await axios.get("/api/v1/events/categories").then(result => {
      this.setState({
        categories: result.data,
        categoriesParent: result.data.filter(
          i => i.id_event_category_parent == null
        )
      });
    });

    this.setState({ user });

    if (this.state.idEvent != null) this.fetchData();
  }

  fetchData() {
    axios.get(`${this.getUrl()}`).then(response => {
      const event = response.data;
      const childCategories = this.state.categories.filter(
        c => c.id_event_category_parent === event.id_event_category_parent
      );

      this.setState({
        idEventCategory: event.id_event_category,
        idEventCategoryParent: event.id_event_category_parent,
        categoryChildId: event.id_event_category,
        categoryParentId: event.id_event_category_parent,
        name: event.name,
        dateFrom: event.date_from,
        dateTo: event.date_to,
        link: event.link,
        categoriesChild: childCategories,
        isChildCategorySelectDisabled: childCategories.length > 0 ? false : true
      });
    });
  }

  getUrl() {
    let url = "/api/v1/events";

    if (this.state.idEvent != null) url = url + "/" + this.state.idEvent;

    return url;
  }

  categoryParentChange(event) {
    let categoryParentId = parseInt(event.target.value, 10);
    let idEventCategory = null;
    let isChildCategorySelectDisabled = false;
    let categoriesChild = [];

    if (categoryParentId === -1) {
      idEventCategory = null;
      isChildCategorySelectDisabled = true;
    } else {
      idEventCategory = categoryParentId;

      categoriesChild = this.state.categories.filter(
        i => i.id_event_category_parent === categoryParentId
      );
      isChildCategorySelectDisabled =
        categoriesChild.length === 0 ? true : false;
    }

    this.setState({
      categoryParentId: categoryParentId,
      idEventCategory: idEventCategory,
      isChildCategorySelectDisabled: isChildCategorySelectDisabled,
      categoriesChild: categoriesChild
    });
  }

  categoryChildChange(event) {
    let categoryChildId = parseInt(event.target.value, 10);
    let idEventCategory = null;

    if (categoryChildId === -1) {
      idEventCategory = this.state.categoryParentId;
    } else {
      idEventCategory = categoryChildId;
    }

    this.setState({
      categoryChildId: categoryChildId,
      idEventCategory: idEventCategory
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const data = {
      id_user: this.state.user.id_user,
      ...(this.state.idEvent ? { id_event: this.state.idEvent } : {}),
      id_event_category: this.state.idEventCategory,
      name: this.state.name,
      date_from: this.state.dateFrom || null,
      date_to: this.state.dateTo || null,
      link: this.state.link
    };

    if (this.validateForm()) {
      if (this.state.idEvent != null) {
        axios
          .put(`${this.getUrl()}`, data)
          .then(response => {
            document.getElementById("btn-modal-alert").click();
            this.props.history.push("/admin/events");
          })
          .catch(error => console.log(error));
      } else {
        axios
          .post(`${this.getUrl()}`, data)
          .then(response => {
            document.getElementById("btn-modal-alert").click();
            this.props.history.push("/admin/events");
          })
          .catch(error => console.log(error));
      }
    }
  }

  validateForm() {
    let errors = {};
    let formIsValid = true;

    if (this.state.name === "") {
      formIsValid = false;
      errors["name"] = "*Please enter name";
    }
    if (this.state.categoryParentId === "") {
      formIsValid = false;
      errors["categoryParentId"] = "*Please enter category";
    }
    if (this.state.dateFrom === "") {
      formIsValid = false;
      errors["dateFrom"] = "*Please enter date from";
    }
    if (this.state.dateTo === "") {
      formIsValid = false;
      errors["dateTo"] = "*Please enter date to";
    }
    if (moment(this.state.dateTo).isBefore(moment(this.state.dateFrom))) {
      formIsValid = false;
      errors["dateFrom"] = "*invalid date range";
      errors["dateTo"] = "*invalid date range";
    }
    if (this.state.link === "") {
      formIsValid = false;
      errors["link"] = "*Please enter link";
    }

    this.setState({
      errors: errors
    });

    return formIsValid;
  }

  changeFromDate(event){
    if(Date.now()>event){
      console.log("old date");
    } else {
      this.setState({ dateFrom: event.format('YYYY-MM-DD') })
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="d-flex flex-column align-items-center">
          <div className="admin-edit-form-header">
            <h1>{this.state.idEvent != null ? "Edit event" : "Add event"}</h1>
          </div>

          <form onSubmit={this.handleSubmit} className="admin-edit-form">
            <div>
              <label className="form-label" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                name="name"
                className="form-control mb-1"
                value={this.state.name}
                onChange={e => this.setState({ name: e.target.value })}
              />
              <div className="text-danger">{this.state.errors["name"]}</div>
            </div>

            <div>
              <label className="form-label" htmlFor="name">
                Categories
              </label>
              <select
                className="custom-select mb-1"
                onChange={this.categoryParentChange}
                value={this.state.categoryParentId}
              >
                <option placeholder="true" hidden>
                  All Categories
                </option>
                <option value="-1">All Categories</option>
                {this.state.categoriesParent.map(option => (
                  <option
                    value={option.id_event_category}
                    key={option.id_event_category}
                  >
                    {option.name}
                  </option>
                ))}
              </select>
              <div className="text-danger">
                {this.state.errors["categoryParentId"]}
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="name">
                Subcategories
              </label>
              <select
                className="custom-select mb-1"
                onChange={this.categoryChildChange}
                value={this.state.categoryChildId}
                {...this.state.isChildCategorySelectDisabled === true && {
                  disabled: "disabled"
                }}
              >
                <option placeholder="true" hidden>
                  Subcategory
                </option>
                <option value="-1">Any</option>
                {this.state.categoriesChild.map(option => (
                  <option
                    value={option.id_event_category}
                    key={option.id_event_category}
                  >
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label" htmlFor="link">
                Link
              </label>
              <input
                type="text"
                name="link"
                className="form-control mb-1"
                value={this.state.link}
                onChange={e => this.setState({ link: e.target.value })}
              />
              <div className="text-danger">{this.state.errors["link"]}</div>
            </div>
            <div>
              <label className="form-label" htmlFor="dateFrom">
                Date From
              </label>
              <div>
                <DatePicker
                  value={this.state.dateFrom}
                  onChange={e =>
                    this.setState({ dateFrom: e.format("YYYY-MM-DD") })
                  }
                  dateFormat="LLL"
                  className="form-control mb-1"
                />
              </div>
              <div className="text-danger">{this.state.errors["dateFrom"]}</div>
            </div>

            <div>
              <label className="form-label" htmlFor="dateTo">
                Date To
              </label>
              <div>
                <DatePicker
                  value={this.state.dateTo}
                  onChange={e =>
                    this.setState({ dateTo: e.format("YYYY-MM-DD") })
                  }
                  dateFormat="LLL"
                  className="form-control mb-1"
                />
                <div className="text-danger">{this.state.errors["dateTo"]}</div>
              </div>
            </div>
            <input
              type="submit"
              value="Save"
              className="btn btn-pill btn-primary btn-violet mt-4"
            />
            <Link
              className="btn btn-pill btn-hero btn-violet mt-3"
              to="/admin/events"
            >
              Back
            </Link>
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

export default withGlobalContext(withRouter(EventEdit));

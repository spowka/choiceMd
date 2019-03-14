import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { withGlobalContext } from "../../../context/GlobalContext.js";
import queryString from "query-string";
import ModalDelete from "../../admin/layout/ModalDelete.js";
import SearchHeader from "../common/SearchHeader";

class Events extends Component {
  constructor(self) {
    super(self);
    this.state = {
      user: null,
      results: [],
      count: null,
      pages: [],
      truncatedPages: [],
      current_page: 1,
      name: ""
    };

    this.getTruncatedPages = this.getTruncatedPages.bind(this);
    this.getSearchQueryString = this.getSearchQueryString.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  async componentDidMount() {
    const user = this.props.user;
    if (!user) return;

    this.setState({ user });
    this.fetchData(1, user);
  }

  fetchData(pageNumber, user) {
    axios
      .get(`/api/v1/events?${this.getSearchQueryString(pageNumber, user)}`)
      .then(response => {
        this.setState({
          results: response.data.results,
          count: response.data.total_count,
          current_page: response.data.current_page,
          ...this.getTruncatedPages(response.data.total_pages, 1)
        });
      });
  }

  getSearchQueryString(pageIndex, user) {
    const searchParams = {};

    searchParams.id_user = user.id_user;
    searchParams.name = this.state.name;
    searchParams.page = pageIndex;
    searchParams.page_size = 5;

    return queryString.stringify(searchParams);
  }

  getTruncatedPages(pageCount, pageIndex) {
    const pages = new Array(pageCount).fill(null).map((page, key) => key + 1);

    const prevMaxRange =
      pages.length - pageIndex >= 4
        ? 4
        : pages.length - pageIndex - 4 > 0
        ? 4 + (pages.length - pageIndex - 4)
        : 4;

    const nextMaxRange =
      pageIndex <= 4
        ? 8 - pageIndex
        : pageIndex >= 4
        ? 4
        : pageIndex + 4 <= 3
        ? 4 + (pageIndex + 4)
        : 8;

    const truncatedPages = pages.reduce(
      (truncatedPages, page) =>
        (pageIndex - page <= prevMaxRange && pageIndex - page >= 0) ||
        (page - pageIndex <= nextMaxRange && page - pageIndex >= 0)
          ? [...truncatedPages, page]
          : truncatedPages,
      []
    );

    return { pages, truncatedPages };
  }

  onPageChange(newPage) {
    if (newPage > this.state.pages.length || newPage === 0) return;

    this.fetchData(newPage, this.state.user);
  }

  searchSubmit(event) {
    event.preventDefault();
    this.fetchData(1, this.state.user);
  }

  onDelete(id) {
    axios
      .delete("/api/v1/events/" + id)
      .then(() => this.fetchData(this.state.current_page, this.state.user))
      .catch(error => console.log(error));
  }

  render() {
    return (
      <React.Fragment>
        <div className="bg-sand">
          <SearchHeader
            name="Event"
            headerName="Events"
            onSubmit={this.searchSubmit}
            onChange={e => this.setState({ name: e.target.value })}
            addToLink="/admin/EVENT/add/"
          />

          <div className="pl-4 pr-4">
            <div className="admin-table-wrapper-outer">
              <div className="admin-table-wrapper-inner">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <td className="admin-table-name">Name</td>
                      <td>Category</td>
                      <td>Date From</td>
                      <td>Date To</td>
                      <td>Link</td>
                      <td className="admin-table-actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.results.map(e => (
                      <tr key={e.id_event}>
                        <td className="admin-table-name">{e.name}</td>
                        <td>{e.category}</td>
                        <td>{e.date_from}</td>
                        <td>{e.date_to}</td>
                        <td>
                          <a href={e.link}>{e.link}</a>
                        </td>
                        <td className="admin-table-actions">
                          <div className="btn-group">
                            <Link
                              to={"/admin/event/edit/" + e.id_event}
                              className="btn btn-pill btn-hero btn-violet"
                            >
                              <i className="fas fa-pencil-alt" />
                            </Link>
                            <ModalDelete
                              entity={e}
                              entityId={e.id_event}
                              deleteMethod={this.onDelete}
                              modalTitle="Delete Event"
                              modalText=" Are you sure you want to delete the event "
                              modalAlertText="? This action cannot be undone."
                              modalNote="Note: all items within this program will also be deleted."
                            />
                            <a
                              className="btn btn-pill btn-hero btn-violet"
                              data-toggle="modal"
                              data-target={`#deleteModal_${e.id_event}`}
                            >
                              <i className="fas fa-trash-alt" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <nav className="mt-2">
              <ul className="pagination">
                <li
                  onClick={() => this.onPageChange(this.state.current_page - 1)}
                  className={
                    "page-item" +
                    (this.state.current_page - 1 > 0 ? "" : " disabled")
                  }
                >
                  <a className="page-link">Previous</a>
                </li>
                {this.state.truncatedPages[0] !== 1 &&
                this.state.truncatedPages.length > 0 ? (
                  <Fragment>
                    <li
                      className="page-item"
                      onClick={() => this.onPageChange(1)}
                    >
                      <a className="page-link">1</a>
                    </li>
                    <li className="p-2 d-flex justify-content-center align-items-baseline">
                      ...
                    </li>
                  </Fragment>
                ) : null}
                {this.state.truncatedPages.length > 0 ? (
                  this.state.truncatedPages.map(page => (
                    <li
                      onClick={() => this.onPageChange(page)}
                      className={
                        "page-item" +
                        (this.state.current_page === page ? " active" : "")
                      }
                      key={page}
                    >
                      <a className="page-link">{page}</a>
                    </li>
                  ))
                ) : (
                  <li
                    onClick={() => this.onPageChange(1)}
                    className="page-item active"
                    key={1}
                  >
                    <a className="page-link">1</a>
                  </li>
                )}
                {this.state.truncatedPages[
                  this.state.truncatedPages.length - 1
                ] !== this.state.pages.length &&
                this.state.truncatedPages.length > 0 ? (
                  <Fragment>
                    <li className="p-2 d-flex justify-content-center align-items-baseline">
                      ...
                    </li>
                    <li
                      className="page-item"
                      onClick={() => this.onPageChange(this.state.pages.length)}
                    >
                      <a className="page-link">{this.state.pages.length}</a>
                    </li>
                  </Fragment>
                ) : null}
                <li
                  className={
                    "page-item" +
                    (this.state.current_page !== this.state.pages.length &&
                    this.state.pages.length !== 0
                      ? ""
                      : " disabled")
                  }
                  onClick={() => this.onPageChange(this.state.current_page + 1)}
                >
                  <a className="page-link">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withGlobalContext(Events);

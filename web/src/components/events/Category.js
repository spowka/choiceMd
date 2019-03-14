import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string';
import EventsCategoryResult from './EventsCategoryResult';
import * as moment from 'moment';

class Events extends Component {
  constructor(self) {
    super(self);

    this.state = {
      eventSearch: '',
      categoryName: '',
      events: [],
      total_count: null,
      total_pages: null,
      total_remaining: null,
      current_page: 1
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getSearchQueryString = this.getSearchQueryString.bind(this);
    this.handleShowMore = this.handleShowMore.bind(this);
  }

  async componentDidMount() {
    this.fetchData('', 1);
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchData('', 1);
    }
  }

  getSearchQueryString(dateFrom, dateTo, name, idEventCategory, pageIndex) {
    const searchParams = {};

    searchParams.page = pageIndex;
    searchParams.page_size = 9;
    searchParams.date_from = dateFrom;
    searchParams.date_to = dateTo !== '' ? dateTo : undefined;
    searchParams.name = name !== '' ? name : undefined;
    searchParams.id_event_category =
      idEventCategory !== '' ? idEventCategory : undefined;

    return queryString.stringify(searchParams);
  }

  fetchData(name, currentPage) {
    let dateFrom = moment().format('YYYY-MM-DD'); //curent day in this month
    axios
      .get(
        `/api/v1/events?${this.getSearchQueryString(
          dateFrom,
          '',
          name,
          this.props.match.params.id,
          currentPage
        )}`
      )
      .then(response => {
        let results = response.data.results;

        if (currentPage > 1) {
          results = [...this.state.events, ...response.data.results];
        }

        let totalRemaining =
          response.data.total_count -
          response.data.page_size * response.data.current_page;

        this.setState({
          categoryName: response.data.results[0].category,
          events: results,
          total_count: response.data.total_count,
          total_pages: response.data.total_pages,
          current_page: currentPage,
          isSearchFinished: true,
          total_remaining: totalRemaining
        });
      });
  }

  async handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    this.fetchData(this.state.eventSearch, 1);
  }

  handleShowMore() {
    let currentPage = this.state.current_page + 1;
    if (
      this.state.total_pages == null ||
      currentPage <= this.state.total_pages
    ) {
      this.fetchData(this.state.eventSearch, currentPage);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="events-hero">
          <div className="container h-100">
            <h1>Local Events</h1>
            <div className="row">
              <div className="col-md-6">
                <h2>
                  The most comprehensive list of local health related events in
                  Miami-Dade County.
                  <br />
                  Make a difference in your community and in your self.
                </h2>
              </div>
              <div className="col-md-5 offset-md-1">
                <form onSubmit={this.handleSubmit} className="events-hero-form">
                  <div className="input-group shadow mt-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search events"
                      name="eventSearch"
                      value={this.state.eventSearch}
                      onChange={e =>
                        this.setState({ eventSearch: e.target.value })
                      }
                    />
                    <div className="input-group-append">
                      <button className="btn btn-white" type="submit">
                        <i className="fas fa-search" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="events-content">
          <div className="container">
            <React.Fragment>
              <Link to="/events" className="go-back">
                Events
              </Link>
              <div className="category-header mt-2">
                <h1>{this.state.categoryName}</h1>
              </div>
              <div className="row">
                {this.state.events.map((event, index) => (
                  <React.Fragment key={index}>
                    <EventsCategoryResult event={event} />
                  </React.Fragment>
                ))}
              </div>
              {this.state.current_page < this.state.total_pages && (
                <div className="text-center py-4">
                  <a className="more-results" onClick={this.handleShowMore}>
                    SEE MORE EVENTS ({this.state.total_remaining} remaining)
                  </a>
                </div>
              )}
            </React.Fragment>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Events);

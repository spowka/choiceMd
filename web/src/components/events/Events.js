import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import queryString from "query-string";
import EventsResult from "./EventsResult";
import EventsSearchResult from "./EventsSearchResult";
import * as moment from "moment";

class Events extends Component {
  constructor(self) {
    super(self);

    this.state = {
      eventSearch: "",
      months: [
        {
          monthName: "",
          events: [],
          showAllEvents: false
        }
      ],
      searchResults: [],
      total_count: null,
      total_pages: null,
      total_remaining: null,
      current_page: 1,
      page_size: 9999,
      isSearchFinished: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShowMore = this.handleShowMore.bind(this);
    this.handleShowAll = this.handleShowAll.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.fetchSearchResults = this.fetchSearchResults.bind(this);
    this.getSearchQueryString = this.getSearchQueryString.bind(this);
    this.groupEventsByMonths = this.groupEventsByMonths.bind(this);
  }

  async componentDidMount() {
    this.fetchData("", this.state.current_page, this.state.page_size);
  }

  getSearchQueryString(dateFrom, dateTo, name, current_page, pageSize) {
    const searchParams = {};

    searchParams.page = current_page;
    searchParams.page_size = pageSize;
    searchParams.date_from = dateFrom;
    searchParams.date_to = dateTo !== "" ? dateTo : undefined;
    searchParams.name = name !== "" ? name : undefined;

    return queryString.stringify(searchParams);
  }

  fetchData(name, currentPage, pageSize) {
    let dateFrom = moment().format("YYYY-MM-DD"); //curent day in this month
    //console.log(`/api/v1/events?${this.getSearchQueryString(dateFrom, '', name, currentPage, pageSize)}`);
    axios
      .get(
        `/api/v1/events?${this.getSearchQueryString(
          dateFrom,
          "",
          name,
          currentPage,
          pageSize
        )}`
      )
      .then(response => {
        this.groupEventsByMonths(response.data.results);
      });
  }

  groupEventsByMonths(result) {
    let months = [];
    for (var i = 0; i < result.length; i++) {
      var event = result[i];
      let monthName = moment(event.date_from).format("MMMM");

      if (months.filter(e => e.monthName === monthName).length > 0) {
        let events = months.filter(e => e.monthName === monthName)[0].events;
        events.push(event);
      } else {
        months.push({
          monthName: monthName,
          events: [event],
          showAllEvents: false
        });
      }
    }

    this.setState({
      months: months,
      searchResults: []
    });
  }

  async handleSubmit(event) {
    let eventSearchRef = this.refs.eventSearch.value;

    if (event) {
      event.preventDefault();
    }

    if (eventSearchRef !== "") {
      let curentPage = 1;
      let pageSize = 9;
      this.setState({
        current_page: curentPage,
        page_size: pageSize,
        eventSearch: eventSearchRef
      });
      this.fetchSearchResults(eventSearchRef, curentPage, pageSize);
    } else {
      let curentPage = 1;
      let pageSize = 9999;
      this.setState({
        current_page: curentPage,
        page_size: pageSize,
        eventSearch: eventSearchRef
      });
      this.fetchData("", curentPage, pageSize);
    }
  }

  fetchSearchResults(eventSearch, currentPage, pageSize) {
    let dateFrom = moment().format("YYYY-MM-DD"); //curent day in this month

    //console.log(`/api/v1/events?${this.getSearchQueryString(dateFrom, '', this.state.eventSearch, currentPage, pageSize)}`);
    axios
      .get(
        `/api/v1/events?${this.getSearchQueryString(
          dateFrom,
          "",
          eventSearch,
          currentPage,
          pageSize
        )}`
      )
      .then(response => {
        let results = response.data.results;

        if (currentPage > 1) {
          results = [...this.state.searchResults, ...response.data.results];
        }

        let totalRemaining =
          response.data.total_count -
          response.data.page_size * response.data.current_page;

        this.setState({
          months: [],
          searchResults: results,
          total_count: response.data.total_count,
          total_pages: response.data.total_pages,
          current_page: currentPage,
          isSearchFinished: true,
          total_remaining: totalRemaining
        });
      });
  }

  handleShowMore() {
    let currentPage = this.state.current_page + 1;
    let pageSize = this.state.page_size;
    if (
      this.state.total_pages == null ||
      currentPage <= this.state.total_pages
    ) {
      this.fetchSearchResults(currentPage, pageSize);
    }
  }

  //toggle see more/less events
  handleShowAll(event) {
    let month = this.state.months.filter(
      e => e.monthName === event.target.name
    )[0];
    month.showAllEvents = !month.showAllEvents;

    this.setState({ months: [...this.state.months, ...month] });
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
                      ref="eventSearch"
                      // value={this.state.eventSearch}
                      // onChange={e => this.setState({ eventSearch: e.target.value })}
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
            {console.log(this.state.searchResults.length)}
            {this.state.searchResults.length > 0 && (
              <React.Fragment>
                <div className="category-header mt-0">
                  <h1>Search results for: “{this.state.eventSearch}”</h1>
                </div>
                <div className="row">
                  {this.state.searchResults.map((event, index) => (
                    <React.Fragment key={index}>
                      <EventsSearchResult event={event} />
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
            )}
            {this.state.searchResults.length === 0 &&
              this.state.months.length === 0 && (
                <span className="alert alert-info d-block text-center">
                  No Results Found
                </span>
              )}

            {this.state.months &&
              this.state.months.map((month, index) => (
                <React.Fragment key={index}>
                  <div className="category-header mt-0">
                    <h1>Featured Events in {month.monthName}</h1>
                    {month.events.length > 3 ? (
                      <a
                        className="see-more d-none d-md-inline-block"
                        name={month.monthName}
                        onClick={this.handleShowAll}
                      >
                        See {month.showAllEvents ? "less" : "more"} Events
                      </a>
                    ) : (
                      ""
                    )}
                  </div>
                  <EventsResult
                    result={month.events}
                    showAllEvents={month.showAllEvents}
                  />
                </React.Fragment>
              ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Events);

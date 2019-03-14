import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string';
import { withGlobalContext } from '../../context/GlobalContext.js';
import { ProviderTypeName } from '../../data/ProviderData.js';
import ProviderSearchResult from './ProviderSearchResult';
import ProviderProfile from '../providers/ProviderProfile';

class ProviderSearch extends Component {
  constructor(self) {
    super(self);

    this.state = {
      results: [],
      count: null,
      pages: [],
      truncatedPages: [],
      current_page: 1,
      selectedProvider: null,
      idProviderType: null,
      providerType: null,
      isSearchFinished: false
    };

    this.profileClick = this.profileClick.bind(this);
    this.getTruncatedPages = this.getTruncatedPages.bind(this);
    this.getSearchQueryString = this.getSearchQueryString.bind(this);
    this.getLocationFromUrl = this.getLocationFromUrl.bind(this);
    this.getDistanceFromUrl = this.getDistanceFromUrl.bind(this);
    this.getProviderTypeFromUrl = this.getProviderTypeFromUrl.bind(this);
  }

  async componentDidMount() {
    const urlParams = queryString.parse(this.props.location.search);
    const idProviderType = urlParams.id_provider_type;

    if (this.props.globalState.locations.length === 0) {
      await this.props.loadLocations();
    }

    axios
      .get(`/api/v1/providers?${this.getSearchQueryString(1)}`)
      .then(response => {
        this.setState({
          results: response.data.results,
          count: response.data.total_count,
          providerType: ProviderTypeName[idProviderType],
          current_page: 1,
          isSearchFinished: true,
          ...this.getTruncatedPages(response.data.total_pages, 1)
        });
      });
  }

  getLocationFromUrl() {
    const urlParams = queryString.parse(this.props.location.search);

    if (urlParams.location !== 'null' && !isNaN(urlParams.location)) {
      const location = this.props.globalState.locations.filter(
        l => l.id_location === parseInt(urlParams.location, 10)
      )[0];

      return location;
    }

    return null;
  }

  getDistanceFromUrl() {
    const urlParams = queryString.parse(this.props.location.search);

    return urlParams.distance !== 'null' ? urlParams.distance : null;
  }

  getProviderTypeFromUrl() {
    const urlParams = queryString.parse(this.props.location.search);

    return ProviderTypeName[urlParams.id_provider_type];
  }

  getSearchQueryString(pageIndex) {
    const urlParams = queryString.parse(this.props.location.search);

    const idProviderType = urlParams.id_provider_type;

    let location_lat = null;
    let location_lng = null;

    const location = this.getLocationFromUrl();

    if (location) {
      location_lat = location.lat;
      location_lng = location.lng;
    }

    const searchParams = {};
    searchParams.id_provider_type = idProviderType;
    searchParams.name = urlParams.name !== 'null' ? urlParams.name : undefined;
    searchParams.id_specialty_type =
      urlParams.id_specialty_type !== 'null'
        ? urlParams.id_specialty_type
        : undefined;
    searchParams.id_facility_type =
      urlParams.id_facility_type !== 'null'
        ? urlParams.id_facility_type
        : undefined;
    searchParams.id_organization_type =
      urlParams.id_organization_type !== 'null'
        ? urlParams.id_organization_type
        : undefined;
    searchParams.location_distance =
      urlParams.distance !== 'null' ? urlParams.distance : undefined;
    searchParams.location_lat =
      location_lat !== null ? location_lat : undefined;
    searchParams.location_lng =
      location_lng !== null ? location_lng : undefined;
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

    axios
      .get(`/api/v1/providers?${this.getSearchQueryString(newPage)}`)
      .then(response => {
        this.setState({
          ...this.getTruncatedPages(response.data.total_pages, newPage),
          current_page: newPage,
          results: response.data.results,
          count: response.data.total_count
        });
      });
  }

  profileClick(provider) {
    this.setState({ selectedProvider: provider });
  }

  render() {
    const location = this.getLocationFromUrl();
    const distance = this.getDistanceFromUrl();
    const providerType = this.getProviderTypeFromUrl();

    return (
      <React.Fragment>
        <div className="bg-mint">
          <div className="container py-3 px-3">
            <div className="px-3">
              <Link to="/patients" className="link-violet font-weight-bold">
                Find a provider
              </Link>
              <i className="fas fa-angle-right text-muted mx-2" />
              <Link to="/patients" className="link-violet font-weight-bold">
                {providerType ? providerType.singular : '???'}
              </Link>
              <i className="fas fa-angle-right text-muted mx-2" />
              <span className="link-violet">
                {this.state.selectedProvider
                  ? this.state.selectedProvider.name
                  : 'Results'}
              </span>
            </div>
          </div>
        </div>

        {this.state.isSearchFinished && (
          <div className="bg-mint-tan">
            <div className="container py-3 px-3 clearfix">
              <div className="float-left">
                <div className="font-weight-bold px-3">
                  We found{' '}
                  <strong className="text-violet">
                    {this.state.count}{' '}
                    {this.state.providerType.plural.toLowerCase()}
                  </strong>
                  {location != null && distance != null && (
                    <React.Fragment>
                      {' '}
                      within {distance} miles of {location.name}
                    </React.Fragment>
                  )}
                  &nbsp;matching your search criteria.
                </div>
                <div className="text-violet px-3">
                  <small>
                    <i className="fas fa-star star-gold" />
                    <i>
                      {' '}
                      &minus; Indicates that the provider has an upgraded
                      profile with more information available
                    </i>
                  </small>
                </div>
              </div>
              <div className="float-right mr-3">
                {!this.state.selectedProvider && (
                  <Link
                    to="/patients"
                    className="btn btn-pill btn-violet px-3 mt-1"
                  >
                    Modify Search
                    <i className="fas fa-search ml-2" />
                  </Link>
                )}
                {this.state.selectedProvider && (
                  <button
                    onClick={() => this.setState({ selectedProvider: null })}
                    className="btn btn-pill btn-violet px-3 mt-1"
                  >
                    See Other Results
                    <i className="fas fa-search ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {!this.state.selectedProvider && (
          <div className="bg-sand">
            <div className="container py-3 px-3">
              <div className="table-responsive">
                <table className="table table-striped table-hover mt-4">
                  <tbody>
                    {this.state.results.map(r => (
                      <ProviderSearchResult
                        key={r.id_provider}
                        result={r}
                        onProfileClick={this.profileClick}
                        showDistance={location != null && distance != null}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              <nav className="mt-2">
                <ul className="pagination">
                  <li
                    onClick={() =>
                      this.onPageChange(this.state.current_page - 1)
                    }
                    className={
                      'page-item' +
                      (this.state.current_page - 1 > 0 ? '' : ' disabled')
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
                      <li style={{ marginRight: 10 }}>...</li>
                    </Fragment>
                  ) : null}
                  {this.state.truncatedPages.length > 0 ? (
                    this.state.truncatedPages.map(page => (
                      <li
                        onClick={() => this.onPageChange(page)}
                        className={
                          'page-item' +
                          (this.state.current_page === page ? ' active' : '')
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
                      <li style={{ marginRight: 10 }}>...</li>
                      <li
                        className="page-item"
                        onClick={() =>
                          this.onPageChange(this.state.pages.length)
                        }
                      >
                        <a className="page-link">{this.state.pages.length}</a>
                      </li>
                    </Fragment>
                  ) : null}
                  <li
                    className={
                      'page-item' +
                      (this.state.current_page !== this.state.pages.length &&
                      this.state.pages.length !== 0
                        ? ''
                        : ' disabled')
                    }
                    onClick={() =>
                      this.onPageChange(this.state.current_page + 1)
                    }
                  >
                    <a className="page-link">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
        {this.state.selectedProvider && (
          <ProviderProfile provider={this.state.selectedProvider} />
        )}
      </React.Fragment>
    );
  }
}

export default withGlobalContext(ProviderSearch);

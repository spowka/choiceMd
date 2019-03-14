import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import Article from "./KnowledgeBaseCard";
import ArticleModal from "./ArticleModal";

class Events extends Component {
  constructor(self) {
    super(self);

    this.state = {
      articlesSearch: "",
      newsType: "",
      articles: [],
      total_count: null,
      total_pages: null,
      total_remaining: null,
      current_page: 1,
      selectedArticle: {},
      articleOpen: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleShowMore = this.handleShowMore.bind(this);
    this.selectArticle = this.selectArticle.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  async componentDidMount() {
    this.fetchData("", 1);
  }

  async componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.news_type !== this.props.match.params.news_type
    ) {
      this.fetchData("", 1);
    }
  }

  fetchData(name, currentPage) {
    axios
      .get(`/api/v1/newsfeed`, {
        params: {
          name,
          news_type: this.props.match.params.news_type,
          page_size: 9,
          page: currentPage
        }
      })
      .then(response => {
        const results =
          currentPage > 1
            ? [...this.state.articles, ...response.data.results]
            : response.data.results;

        let totalRemaining =
          response.data.total_count -
          response.data.page_size * response.data.current_page;

        this.setState({
          newsType: response.data.results[0].news_type,
          articles: results,
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

    this.fetchData(this.state.articlesSearch, 1);
  }

  handleShowMore() {
    let currentPage = this.state.current_page + 1;
    if (
      this.state.total_pages == null ||
      currentPage <= this.state.total_pages
    ) {
      this.fetchData(this.state.articlesSearch, currentPage);
    }
  }

  async handleSearchSubmit(e) {
    e.preventDefault();

    const articles = await axios.get("/api/v1/newsfeed", {
      params: {
        page: 1,
        page_size: 9,
        name: this.state.articleSearch
      }
    });

    this.setState({
      searchResult: articles.data.results ? articles.data.results : [],
      searchCompleted: this.state.articleSearch
    });
  }

  selectArticle(article) {
    this.setState(
      {
        selectedArticle: article,
        articleOpen: !this.state.articleOpen
      },
      () => {
        if (this.state.articleOpen) {
          document.querySelector("body").classList.add("no-scroll");
        } else {
          document.querySelector("body").classList.remove("no-scroll");
        }
      }
    );
  }

  render() {
    return (
      <React.Fragment>
        <div className="knowledgebase-hero">
          <div className="container h-100">
            <h1>Knowledge-base</h1>
            <div className="row">
              <div className="col-md-6">
                <h2>
                  The latest health news written from medical journals in terms
                  you’ll understand.
                </h2>
              </div>
              <div className="col-md-5 offset-md-1">
                <form
                  className="knowledgebase-hero-form"
                  onSubmit={this.handleSearchSubmit}
                >
                  <div className="input-group shadow mt-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search articles"
                      onChange={e =>
                        this.setState({
                          articleSearch: e.target.value,
                          searchCompleted: false,
                          searchResult: []
                        })
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
              <Link to="/knowledgebase" className="go-back">
                Articles
              </Link>
              <div className="category-header mt-2">
                <h1>{this.state.newsType}</h1>
              </div>
              <div className="row">
                {this.state.articles.map((article, index) => (
                  <Article
                    id={article.id_article}
                    title={article.headline}
                    category={article.news_type}
                    blurb={article.body}
                    key={article.id_article}
                    onClick={() => this.selectArticle(article)}
                  />
                ))}
              </div>
              {this.state.current_page < this.state.total_pages && (
                <div className="text-center py-4">
                  <div className="more-results" onClick={this.handleShowMore}>
                    SEE MORE ARTICLES ({this.state.total_remaining} remaining)
                  </div>
                </div>
              )}
            </React.Fragment>
          </div>
        </div>

        <ArticleModal
          open={this.state.articleOpen}
          article={this.state.selectedArticle}
          toggleModal={() => this.selectArticle(this.state.selectedArticle)}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(Events);

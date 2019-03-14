import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import KnowledgeBaseCard from "./KnowledgeBaseCard";
import ArticleModal from "./ArticleModal";
import { validateEmail } from "../../common/validation.js";

class KnowledgeBase extends Component {
  constructor(self) {
    super(self);

    this.state = {
      newsletterEmail: "",
      articleSearch: "",
      searchResult: [],
      searchCompleted: false,
      articles: {
        recent: [],
        featured: [],
        current_page: 1,
        total_pages: 1
      },
      selectedArticle: {},
      articleOpen: false
    };
    this.saveNewsletter = this.saveNewsletter.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.selectArticle = this.selectArticle.bind(this);

    this.fetchArticles();
  }

  async fetchArticles(page = 1, name) {
    if (page > this.state.articles.total_pages) return;
    const articles = await axios.get("/api/v1/newsfeed", {
      params: {
        page: page,
        page_size: 9,
        name
      }
    });

    this.setState({
      articles: {
        recent:
          page === 1
            ? articles.data.results.slice(0, 3)
            : this.state.articles.recent,
        featured:
          page === 1
            ? articles.data.results.slice(3)
            : [...this.state.articles.featured, ...articles.data.results],
        current_page: page,
        total_pages: articles.data.total_pages
      }
    });
  }

  saveNewsletter(event) {
    event.preventDefault();

    if (!validateEmail(this.state.newsletterEmail)) return;

    const data = { email: this.state.newsletterEmail };

    axios.post("/api/v1/newsletter", data);
  }

  async handleSubmit(e) {
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
        {/*  Hero  */}
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
                  onSubmit={this.handleSubmit}
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

        {/* Content  */}
        <div className="knowledgebase-content">
          <div className="container">
            {this.state.articleSearch &&
            (this.state.searchResult.length > 0 ||
              (this.state.searchResult.length === 0 &&
                this.state.searchCompleted)) ? (
              <Fragment>
                <div className="category-header mt-0">
                  <h1>Search Results for "{this.state.searchCompleted}"</h1>
                </div>

                <div className="row">
                  {this.state.searchResult.map(article => (
                    <KnowledgeBaseCard
                      id={article.id_article}
                      title={article.headline}
                      blurb={article.body}
                      category={article.news_type}
                      onClick={() => this.selectArticle(article)}
                      key={`search-${article.id_article}`}
                    />
                  ))}
                </div>
              </Fragment>
            ) : null}
            <div className="category-header mt-0">
              <h1>Recent Articles</h1>
            </div>

            <div className="row">
              {this.state.articles.recent.map(article => (
                <KnowledgeBaseCard
                  id={article.id_article}
                  title={article.headline}
                  blurb={article.body}
                  category={article.news_type}
                  onClick={() => this.selectArticle(article)}
                  key={article.id_article}
                />
              ))}
            </div>
            <div className="category-header">
              <h1>Featured Articles</h1>
              {this.state.articles.current_page <
              this.state.articles.total_pages ? (
                <div
                  className="see-more d-none d-md-inline-block"
                  onClick={e =>
                    this.fetchArticles(this.state.articles.current_page + 1)
                  }
                >
                  See more Articles
                </div>
              ) : null}
            </div>
            <div className="row">
              {this.state.articles.featured.map(article => (
                <KnowledgeBaseCard
                  id={article.id_article}
                  title={article.headline}
                  blurb={article.body}
                  category={article.news_type}
                  onClick={() => this.selectArticle(article)}
                  key={article.id_article}
                />
              ))}
            </div>
            {this.state.articles.current_page <
            this.state.articles.total_pages ? (
              <div
                className="more-results d-block"
                onClick={e =>
                  this.fetchArticles(this.state.articles.current_page + 1)
                }
              >
                See more articles
              </div>
            ) : null}
          </div>
        </div>
        {/* Newsletter */}
        <div className="newsletter">
          <div className="container py-4">
            <div className="row">
              <div className="col-md-6">
                <h3>Get monthly updates</h3>
                <h4 className="mb-0">Subscribe to our newsletter</h4>
              </div>
              <div className="col-md-6">
                <form className="mt-2" onSubmit={this.saveNewsletter}>
                  <div className="row">
                    <div className="col-8 col-sm-9 col-md-8">
                      <input
                        type="text"
                        className="form-control"
                        name="newsletterEmail"
                        placeholder="Email"
                        value={this.state.newsletterEmail}
                        onChange={e =>
                          this.setState({ newsletterEmail: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-4 col-sm-3 col-md-4">
                      <button
                        type="submit"
                        className="btn btn-primary px-0 btn-block"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
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

export default withRouter(KnowledgeBase);

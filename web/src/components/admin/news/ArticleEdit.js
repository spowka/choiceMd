import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import { withGlobalContext } from "../../../context/GlobalContext.js";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalAlert from "../../admin/layout/ModalAlert.js";

class ArticleEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      idArticle: props.match.params.id,
      archiveDate: moment().format("YYYY-MM-DD"),
      newsType: "",
      headline: "",
      blurb: "",
      byline: "",
      body: "",
      featureBlurb: "",
      featureImage: "",
      attribution: "",
      tagline: "",
      source: "",
      copyright: "",
      topic: "",
      specialty: "",
      errors: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const user = this.props.user;
    if (!user) return;

    this.setState({ user });

    if (this.state.idArticle !== null) this.fetchData();
  }

  fetchData() {
    axios.get(`/api/v1/newsfeed/${this.state.idArticle}`).then(response => {
      const article = response.data;
      console.log(article);

      this.setState({
        idArticle: article.id_article,
        postingDatetime: article.posting_datetime,
        archiveDate: article.archive_date,
        newsType: article.news_type,
        headline: article.headline,
        blurb: article.blurb,
        byline: article.byline,
        body: article.body,
        featureBlurb: article.feature_blurb,
        featureImage: article.feature_image,
        attribution: article.attribution,
        tagline: article.tagline,
        source: article.source,
        copyright: article.copyright,
        topic: article.topic,
        specialty: article.specialty
      });
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const {
      idArticle,
      postingDatetime,
      archiveDate,
      newsType,
      headline,
      blurb,
      byline,
      body,
      featureBlurb,
      featureImage,
      attribution,
      tagline,
      source,
      copyright,
      topic,
      specialty
    } = this.state;

    const data = {
      id_article: idArticle,
      posting_datetime: postingDatetime,
      archive_date: archiveDate,
      news_type: newsType,
      headline,
      blurb,
      byline,
      body,
      feature_blurb: featureBlurb,
      feature_image: featureImage,
      attribution,
      tagline,
      source,
      copyright,
      topic,
      specialty
    };

    if (this.validateForm()) {
      if (idArticle != null) {
        axios
          .put(`/api/v1/newsfeed/${idArticle}`, data)
          .then(response => {
            document.getElementById("btn-modal-alert").click();
            this.props.history.push("/admin/news");
          })
          .catch(error => console.log(error));
      } else {
        axios
          .post(`/api/v1/newsfeed`, data)
          .then(response => {
            document.getElementById("btn-modal-alert").click();
            this.props.history.push("/admin/news");
          })
          .catch(error => console.log(error));
      }
    }
  }

  validateForm() {
    let errors = {};
    let formIsValid = true;

    if (this.state.headline === "") {
      formIsValid = false;
      errors["headline"] = "*Please enter headline";
    }
    if (this.state.body === "") {
      formIsValid = false;
      errors["body"] = "*Please enter body";
    }
    if (this.state.blurb === "") {
      formIsValid = false;
      errors["blurb"] = "*Please enter blurb";
    }

    this.setState({
      errors: errors
    });

    return formIsValid;
  }

  render() {
    return (
      <React.Fragment>
        <div className="d-flex flex-column align-items-center">
          <div className="admin-edit-form-header">
            <h1>
              {this.state.idArticle != null ? "Edit article" : "Add article"}
            </h1>
          </div>

          <form onSubmit={this.handleSubmit} className="admin-edit-form">
            <div>
              <label className="form-label" htmlFor="name">
                Headline
              </label>
              <input
                type="text"
                name="headline"
                className="form-control mb-3"
                value={this.state.headline}
                onChange={e => this.setState({ headline: e.target.value })}
              />
              <div className="text-danger">{this.state.errors["headline"]}</div>
            </div>

            <div>
              <label className="form-label" htmlFor="name">
                News Type
              </label>
              <input
                type="text"
                name="newsType"
                className="form-control mb-3"
                value={this.state.newsType}
                onChange={e => this.setState({ newsType: e.target.value })}
              />
              <div className="text-danger">{this.state.errors["newsType"]}</div>
            </div>

            <div>
              <label className="form-label" htmlFor="name">
                Blurb
              </label>
              <input
                type="text"
                name="blurb"
                className="form-control mb-3"
                value={this.state.blurb}
                onChange={e => this.setState({ blurb: e.target.value })}
              />
              <div className="text-danger">{this.state.errors["blurb"]}</div>
            </div>

            <div>
              <label className="form-label" htmlFor="name">
                Byline
              </label>
              <input
                type="text"
                name="byline"
                className="form-control mb-3"
                value={this.state.byline}
                onChange={e => this.setState({ byline: e.target.value })}
              />
              <div className="text-danger">{this.state.errors["byline"]}</div>
            </div>

            <div>
              <label className="form-label" htmlFor="name">
                Body
              </label>
              <textarea
                type="text"
                name="body"
                className="form-control mb-3"
                value={this.state.body}
                rows={8}
                onChange={e => this.setState({ body: e.target.value })}
              />
              <div className="text-danger">{this.state.errors["body"]}</div>
            </div>

            <div>
              <label className="form-label" htmlFor="name">
                Feature Blurb
              </label>
              <textarea
                type="text"
                name="featureBlurb"
                className="form-control mb-3"
                value={this.state.featureBlurb}
                onChange={e => this.setState({ featureBlurb: e.target.value })}
              />
              <div className="text-danger">
                {this.state.errors["featureBlurb"]}
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="name">
                Feature Image
              </label>
              <textarea
                type="text"
                name="featureImage"
                className="form-control mb-3"
                value={this.state.featureImage}
                onChange={e => this.setState({ featureImage: e.target.value })}
              />
              <div className="text-danger">
                {this.state.errors["featureImage"]}
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="name">
                Attribution
              </label>
              <textarea
                type="text"
                name="attribution"
                className="form-control mb-3"
                value={this.state.attribution}
                onChange={e => this.setState({ attribution: e.target.value })}
              />
              <div className="text-danger">
                {this.state.errors["attribution"]}
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="name">
                Tagline
              </label>
              <textarea
                type="text"
                name="tagline"
                className="form-control mb-3"
                value={this.state.tagline}
                onChange={e => this.setState({ tagline: e.target.value })}
              />
              <div className="text-danger">{this.state.errors["tagline"]}</div>
            </div>

            <div>
              <label className="form-label" htmlFor="name">
                Source
              </label>
              <textarea
                type="text"
                name="source"
                className="form-control mb-3"
                value={this.state.source}
                onChange={e => this.setState({ source: e.target.value })}
              />
              <div className="text-danger">{this.state.errors["source"]}</div>
            </div>

            <div>
              <label className="form-label" htmlFor="name">
                Copyright
              </label>
              <textarea
                type="text"
                name="copyright"
                className="form-control mb-3"
                value={this.state.copyright}
                onChange={e => this.setState({ copyright: e.target.value })}
              />
              <div className="text-danger">
                {this.state.errors["copyright"]}
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="name">
                Topic
              </label>
              <textarea
                type="text"
                name="topic"
                className="form-control mb-3"
                value={this.state.topic}
                onChange={e => this.setState({ topic: e.target.value })}
              />
              <div className="text-danger">{this.state.errors["topic"]}</div>
            </div>

            <div>
              <label className="form-label" htmlFor="name">
                Specialty
              </label>
              <textarea
                type="text"
                name="specialty"
                className="form-control mb-3"
                value={this.state.specialty}
                onChange={e => this.setState({ specialty: e.target.value })}
              />
              <div className="text-danger">
                {this.state.errors["specialty"]}
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="dateFrom">
                Archive Date
              </label>
              <div>
                <DatePicker
                  value={this.state.archiveDate}
                  onChange={e =>
                    this.setState({ archiveDate: e.format("YYYY-MM-DD") })
                  }
                  dateFormat="LLL"
                  className="form-control mb-3"
                />
              </div>
              <div className="text-danger">
                {this.state.errors["archiveDate"]}
              </div>
            </div>

            <input
              type="submit"
              value="Save"
              className="btn btn-pill btn-primary btn-violet mt-4"
            />
            <Link
              className="btn btn-pill btn-hero btn-violet mt-3"
              to="/admin/news"
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

export default withGlobalContext(withRouter(ArticleEdit));

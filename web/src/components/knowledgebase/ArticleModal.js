import React, { Component } from "react";

class ArticleModal extends Component {
  render() {
    const { article, open, toggleModal } = this.props;
    return (
      <div
        className="article-modal-container"
        style={{
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden"
        }}
      >
        <div className="modal-overlay" onClick={toggleModal} />
        <div className="article-modal">
          {/* <div
            className="article-image"
            style={{
              width: "100%",
              height: 200,
              backgroundImage: `url(${article.feature_image})`
            }}
          /> */}
          <div className="close-btn" onClick={toggleModal}>
            <i className="fa fa-times" />
          </div>
          <h3>{article.headline}</h3>
          <p dangerouslySetInnerHTML={{ __html: article.byline }} />
          <div dangerouslySetInnerHTML={{ __html: article.body }} />
        </div>
      </div>
    );
  }
}

export default ArticleModal;

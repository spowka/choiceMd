import React, { Component } from "react";
import { Link } from "react-router-dom";

class KnowledgeBaseCard extends Component {
  render() {
    return (
      <div className="col-sm-4 mb-4">
        <div className="card bg-white shadow">
          <p className="card-title" onClick={this.props.onClick}>
            {this.props.title}
          </p>
          <Link
            to={`/knowledgebase/category/${this.props.category}`}
            className="card-subtitle"
          >
            {this.props.category}
          </Link>
          <p className="card-desc">
            {this.props.blurb.replace(/<[^>]*>/g, "\n\n").slice(0, 280)}...
          </p>
        </div>
      </div>
    );
  }
}

export default KnowledgeBaseCard;

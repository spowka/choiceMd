import React, { Component } from "react";
import PropTypes from 'prop-types';

class ModalDelete extends Component {

  constructor(self) {
    super(self);
    this.deleteClick = this.deleteClick.bind(this);
  }

  deleteClick() {
    document.getElementById(`deleteModalClose_${this.props.entityId}`).click();
     this.props.deleteMethod(this.props.entityId);
  }

  render() {
    return (
      <div className="modal fade" id={`deleteModal_${this.props.entityId}`} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title d-inline-block text-truncate pr-2">
                <i
                  className="fas fa-trash-alt mr-2"
               
                />{this.props.modalTitle} 
              </h5>
              <button
                id={`deleteModalClose_${this.props.entityId}`} 
                type="button"
                className="close"
                data-dismiss="modal"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p className="text-muted">
                {this.props.modalText} 
                <strong className="text-dark">
                  {this.props.entity.name}
                </strong>{this.props.modalAlertText}<br />
                <br />{this.props.modalNote} 
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-pill btn-hero btn-violet"
                onClick={this.deleteClick}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
}

ModalDelete.propTypes = {
  deleteMethod: PropTypes.func,
  modalTitle: PropTypes.string,
  modalText: PropTypes.string,
  modalAlertText: PropTypes.string,
  modalNote: PropTypes.string
};



export default (ModalDelete);

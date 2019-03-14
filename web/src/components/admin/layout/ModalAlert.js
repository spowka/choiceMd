import React, { Component } from "react";
import PropTypes from 'prop-types';

class ModalAlert extends Component {
    render() {
        return (
            <div className="modal fade" id="modalAlert" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title d-inline-block text-truncate pr-2">
                                <i className="fas fa-check mr-2"/>{this.props.modalTitle}
                            </h5>
                            <button
                                id="modalClose"
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
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                data-dismiss="modal"
                                className="btn btn-pill btn-hero btn-violet"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ModalAlert.propTypes = {
    modalTitle: PropTypes.string,
    modalText: PropTypes.string,
};



export default (ModalAlert);

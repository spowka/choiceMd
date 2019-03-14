import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="footer">
            <div className="container">
                <div className="footer-links">
                    <div className="row">
                        <div className="col-7 col-md-4 order-2 order-md-1">
                            <ul>
                                <li><Link to="/provider-search">Find a Provider</Link></li>
                                <li className="mt-3 mt-sm-3 mt-md-0"><Link to="/events">Find Local Events</Link></li>
                            </ul>
                        </div>
                        <div className="col-5 col-md-3 order-3 order-md-2">
                            <ul>
                                <li><Link to="/about">About Us</Link></li>
                                <li className="mt-3 mt-sm-3 mt-md-0"><Link to="/about">Contact Us</Link></li>
                            </ul>
                        </div>
                        <div className="col-12 col-md-5 text-center order-1 order-md-3">
                            <Link to="/providers" className="btn btn-outline-info mb-4 mb-sm-4 mb-md-0">Get Listed as a Provider</Link>
                        </div>
                    </div>
                </div>
                <div className="footer-social">
                    <ul>
                        <li><a href="https://www.facebook.com/ChoiceMD" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a></li>
                        <li><a href="https://twitter.com/ChoiceMD" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a></li>
                        <li><a href="https://www.pinterest.com/choicemdmiami" target="_blank" rel="noopener noreferrer"><i className="fab fa-pinterest"></i></a></li>                        
                        <li><a href="https://www.instagram.com/choicemd.miami/?hl=en" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a></li>                        
                    </ul>
                </div>
                <div className="footer-copyright">
                    &copy; Copyright 2018., Choice MD. All Rights Reserved.
            </div>
            </div>
        </div>
    );
};

export default Footer;
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import App from "./App";
import * as axios from "axios";

// set base url for API calls
if (process.env.REACT_APP_API_HOST)
  axios.defaults.baseURL = process.env.REACT_APP_API_HOST;
else
  axios.defaults.baseURL =
    "http://choicemdtest-env.wmc9a7xx7u.us-east-2.elasticbeanstalk.com";
//axios.defaults.baseURL = "http://localhost:5000";

const render = () => {
  ReactDOM.render(
    <IntlProvider locale="en">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </IntlProvider>,
    document.getElementById("root")
  );
};

render();

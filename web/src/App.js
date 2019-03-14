import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { GlobalProvider, GlobalConsumer } from "./context/GlobalContext.js";
import Header from "./components/layout/Header.js";
import Footer from "./components/layout/Footer.js";
import Home from "./components/home/Home.js";
import Patients from "./components/patients/Patients.js";
import ProviderSearch from "./components/search/ProviderSearch.js";
import ProviderProfile from "./components/providers/ProviderProfile.js";
import Calendar from "./components/calendar/Calendar.js";
import About from "./components/about/About.js";
import Contact from "./components/contact/Contact.js";
import Providers from "./components/providers/Providers.js";
import Login from "./components/admin/login/Login.js";
import ForgotPassword from "./components/admin/login/ForgotPassword.js";
import ResetPassword from "./components/admin/login/ResetPassword.js";
import AdminProviders from "./components/admin/providers/Providers.js";
import AdminProviderEdit from "./components/admin/providers/ProviderEdit.js";
import AdminEvents from "./components/admin/events/Events.js";
import AdminEventEdit from "./components/admin/events/EventEdit.js";
import AdminArticles from "./components/admin/news/Articles.js";
import AdminArticleEdit from "./components/admin/news/ArticleEdit.js";
import AdminUsers from "./components/admin/users/Users.js";
import AdminUserEdit from "./components/admin/users/UserEdit.js";
import AdminHeader from "./components/admin/layout/AdminHeader.js";
import Activation from "./components/admin/login/Activation.js";

import Events from "./components/events/Events.js";
import Category from "./components/events/Category.js";
import KnowledgeBase from "./components/knowledgebase/KnowledgeBase.js";
import KnowledgeBaseCategory from "./components/knowledgebase/KnowledgeBaseCategory.js";

class App extends Component {
  render() {
    return (
      <GlobalProvider>
        <Switch>
          <Route path="/admin" component={AdminHeader} />
          <Route path="/" component={Header} />
        </Switch>

        <GlobalConsumer>
          {({ user }) => (
            <Switch>
              <Route path="/patients" component={Patients} />
              <Route path="/provider-search" component={ProviderSearch} />
              <Route path="/provider-profile/:id" component={ProviderProfile} />
              <Route path="/calendar" component={Calendar} />
              <Route path="/about" component={About} />
              <Route path="/contact" component={Contact} />
              <Route path="/providers" component={Providers} />

              <Route path="/events" component={Events} />
              <Route path="/category/:id" component={Category} />
              <Route path="/knowledgebase" exact component={KnowledgeBase} />
              <Route
                path="/knowledgebase/category/:news_type"
                component={KnowledgeBaseCategory}
              />

              <Route path="/admin/forgot-password" component={ForgotPassword} />
              <Route path="/admin/reset-password" component={ResetPassword} />
              <Route
                path="/admin/providers"
                component={!user ? Login : AdminProviders}
              />
              <Route
                path="/admin/provider/add"
                component={!user ? Login : AdminProviderEdit}
              />
              <Route
                path="/admin/provider/edit/:id?"
                component={!user ? Login : AdminProviderEdit}
              />
              <Route
                exact
                path="/admin/news"
                component={!user ? Login : AdminArticles}
              />
              <Route
                path="/admin/news/add"
                component={!user ? Login : AdminArticleEdit}
              />
              <Route
                path="/admin/news/edit/:id?"
                component={!user ? Login : AdminArticleEdit}
              />
              <Route
                path="/admin/events"
                component={!user ? Login : AdminEvents}
              />
              <Route
                path="/admin/event/add"
                component={!user ? Login : AdminEventEdit}
              />
              <Route
                path="/admin/event/edit/:id?"
                component={!user ? Login : AdminEventEdit}
              />
              <Route
                path="/admin/users"
                component={!user ? Login : AdminUsers}
              />
              <Route
                path="/admin/user/add"
                component={!user ? Login : AdminUserEdit}
              />
              <Route
                path="/admin/user/edit/:id?"
                component={!user ? Login : AdminUserEdit}
              />
              <Route path="/admin/login" component={Login} />
              <Route path="/admin" component={Login} />
              <Route path="/activation" component={Activation} />
              <Route path="/" component={Home} />
            </Switch>
          )}
        </GlobalConsumer>
        {window.location.pathname.indexOf("admin") === -1 ? <Footer /> : null}
      </GlobalProvider>
    );
  }
}

export default App;

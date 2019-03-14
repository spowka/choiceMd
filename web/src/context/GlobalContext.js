import React, { Component } from 'react';
import axios from 'axios';

const GlobalContext = React.createContext();

export class GlobalProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      locations: [],
      patientsActiveTab: 0,
      patientsSearchDistance: undefined,
      patientsSearchLocation: undefined,
      patientsSearchName: '',
      patientsSearchPhysicianType: -1,
      patientsSearchDentistType: -1,
      patientsSearchOrganizationType: -1,
      patientsSearchFacilityType: -1,
      name: ''
    };

    this.setUser = this.setUser.bind(this);
    this.setContext = this.setContext.bind(this);
    this.loadLocations = this.loadLocations.bind(this);
  }

  setUser(user) {
    this.setState({ user });
  }

  setContext(key, value) {
    this.setState({ [key]: value });
  }

  async loadLocations() {
    if(this.state.locations.length > 0) return;

    await axios.get(`/api/v1/locations`).then(response => {
      this.setState({
        locations: response.data
      });
    });
  }

  render() {
    const { children } = this.props;

    return (
      <GlobalContext.Provider
        value={{
          user: this.state.user,
          setUser: this.setUser,
          loadLocations: this.loadLocations,
          setContext: this.setContext,
          globalState: this.state
        }}
      >
        {children}
      </GlobalContext.Provider>
    );
  }
}

export const GlobalConsumer = GlobalContext.Consumer;

export function withGlobalContext(WrappedComponent) {
  return class extends React.Component {
    render() {
      return (
        <GlobalConsumer>
          {({ user, setUser, setContext, globalState, loadLocations }) => (
            <WrappedComponent
              {...this.props}
              user={user}
              setUser={setUser}
              loadLocations={loadLocations}
              setContext={setContext}
              globalState={globalState}
            />
          )}
        </GlobalConsumer>
      );
    }
  };
}

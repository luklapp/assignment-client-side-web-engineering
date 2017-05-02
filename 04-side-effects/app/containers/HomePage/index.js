/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Types, Creators } from './actions';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  
  constructor(props) {
    super(props);
    this.props.init();
  }

  render() {
    return (
      <h1>
        <FormattedMessage {...messages.header} />
        <button onClick={this.props.fetchDrivers}>FETCH DRIVERS</button>
      </h1>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    init: () => {
        dispatch(Creators.fetchConstructors());
    },

    fetchDrivers: () => {
      console.log("ASDASD");
      dispatch(Creators.fetchDrivers());
    }
  };
}

export default connect(undefined, mapDispatchToProps)(HomePage);
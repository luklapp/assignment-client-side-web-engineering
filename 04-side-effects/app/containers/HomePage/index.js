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
import { createStructuredSelector } from 'reselect';

const Typeahead = require('react-typeahead').Typeahead;

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  
  constructor(props) {
    super(props);
    this.props.init();
  }

  render() {

    return (
      <h1>
        <FormattedMessage {...messages.header} />
        <Typeahead
            options={this.props.constructors}
            onOptionSelected={this.props.onOptionSelected}
            displayOption={this.props.displayOption}
            filterOption='constructorId'
            maxVisible={5}
        />
      </h1>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  constructors: (state) => {
    return state.getIn(['home', 'constructors']);
  }
});

function mapDispatchToProps(dispatch) {
  return {
    init: () => {
        dispatch(Creators.fetchConstructors());
    },
    onOptionSelected: (selection) => {
        dispatch(Creators.fetchDrivers(selection.constructorId))
    },
    displayOption: (option) => {
        return option.name;
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
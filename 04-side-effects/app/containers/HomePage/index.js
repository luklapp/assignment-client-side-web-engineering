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

import 'fixed-data-table/dist/fixed-data-table.min.css';
import 'kube/dist/css/kube.min.css';


const {Table, Column, Cell} = require('fixed-data-table');
const Typeahead = require('react-typeahead').Typeahead;

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  
  constructor(props) {
    super(props);
    this.props.init();
  }

  render() {

    const { constructors, onOptionSelected, displayOption, drivers } = this.props;

    return (
        <div>
            <h1>
                <FormattedMessage {...messages.header} />
            </h1>

            <Typeahead
                options={constructors}
                onOptionSelected={onOptionSelected}
                displayOption={displayOption}
                filterOption='constructorId'
                maxVisible={5}
                placeholder='Ferrari'
            />

            { drivers.length > 0 && 

                <Table
                    rowsCount={drivers.length}
                    rowHeight={50}
                    headerHeight={50}
                    width={1000}
                    height={500}>
                    <Column
                        header={<Cell>Name</Cell>}
                        cell={props => (
                            <Cell {...props}>
                                <a href={drivers[props.rowIndex].url}>
                                    {drivers[props.rowIndex].givenName} {drivers[props.rowIndex].familyName}
                                </a>
                            </Cell>
                        )}
                        width={500}
                    />
                    <Column
                        header={<Cell>Birthday</Cell>}
                        cell={props => (
                            <Cell {...props}>
                                {drivers[props.rowIndex].dateOfBirth}
                            </Cell>
                        )}
                        width={250}
                    />
                    <Column
                        header={<Cell>Nationality</Cell>}
                        cell={props => (
                            <Cell {...props}>
                                {drivers[props.rowIndex].nationality}
                            </Cell>
                        )}
                        width={250}
                    />
                </Table>
            }
      </div>

    );
  }
}

/*

                <div className=''>
                    { drivers.map((driver) => {
                      return <a href={driver.url}>{driver.givenName} {driver.familyName} ({driver.dateOfBirth}, {driver.nationality})</a>
                    }) }
                </div>

                */

const mapStateToProps = createStructuredSelector({
  constructors: (state) => {
    return state.getIn(['home', 'constructors']);
  },
  drivers: (state) => {
    return state.getIn(['home', 'drivers']);
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
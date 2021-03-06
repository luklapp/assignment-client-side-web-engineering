import { fromJS } from 'immutable';
import { createReducer } from 'reduxsauce';

import { Types, Creators } from './actions';

const initialState = fromJS({
    constructors: [],
    drivers: []
});

const fetchConstructorsSuccess = (state = initialState, action) => {
  const constructors = action.response.map((obj) => obj.constructorId);

  return state.set('constructors', action.response);
}

const fetchConstructorsError = (state = initialState, action) => {
  console.warn('FETCH CONSTRUCTORS ERROR');
}

const fetchDrivers = (state = initialState, action) => {
  return state.set('drivers', []);
}

const fetchDriversSuccess = (state = initialState, action) => {
  return state.set('drivers', action.response.MRData.DriverTable.Drivers);
}

const fetchDriversError = (state = initialState, action) => {
  console.warn('FETCH DRIVERS ERROR');
}

export const handlers = {
  [Types.FETCH_CONSTRUCTORS_SUCCESS]: fetchConstructorsSuccess,
  [Types.FETCH_CONSTRUCTORS_ERROR]: fetchConstructorsError,
  [Types.FETCH_DRIVERS]: fetchDrivers,
  [Types.FETCH_DRIVERS_SUCCESS]: fetchDriversSuccess,
  [Types.FETCH_DRIVERS_ERROR]: fetchDriversError
}

export default createReducer(initialState, handlers);
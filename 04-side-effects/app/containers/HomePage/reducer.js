import { fromJS } from 'immutable';
import { createReducer } from 'reduxsauce';

import { Types, Creators } from './actions';

const initialState = fromJS({
    constructors: [],
    drivers: []
});

const fetchConstructorsSuccess = (state = initialState, action) => {
  console.log("FETCH CONSTRUCTORS SUCCESS");
  return state.set('constructors', action.response);
}

const fetchConstructorsError = (state = initialState, action) => {
  console.warn('FETCH CONSTRUCTORS ERROR');
}

const fetchDriversSuccess = (state = initialState, action) => {
  console.log("FETCH DRIVERS SUCCESS");
  console.log(action);
  return state;
  //return state.set('user', action.response.data.user);
}

const fetchDriversError = (state = initialState, action) => {
  console.warn('FETCH DRIVERS ERROR');
}

export const handlers = {
  [Types.FETCH_CONSTRUCTORS_SUCCESS]: fetchConstructorsSuccess,
  [Types.FETCH_CONSTRUCTORS_ERROR]: fetchConstructorsError,
  [Types.FETCH_DRIVERS_SUCCESS]: fetchDriversSuccess,
  [Types.FETCH_DRIVERS_ERROR]: fetchDriversError
}

export default createReducer(initialState, handlers);
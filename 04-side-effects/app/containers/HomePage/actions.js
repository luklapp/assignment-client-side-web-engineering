import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions({
  fetchDrivers:             null,
  fetchDriversSuccess:      ['response'],
  fetchDriversError:        ['error'],

  fetchConstructors:        null,
  fetchConstructorsSuccess: ['response'],
  fetchConstructorsError:   ['error']
}, {});

export { Types, Creators };
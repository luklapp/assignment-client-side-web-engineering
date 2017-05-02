import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { Types, Creators } from './actions';
import request from 'utils/request';

export function* fetchConstructors(action) {
  try {
    const response = yield call(request, `http://ergast.com/api/f1/constructors.json`);
    const pageSize = 30;
    const total = response.MRData.total;

    let constructors = response.MRData.ConstructorTable.Constructors,
      promises = [],
      offset = 0;

    while(offset < total) {
      offset += pageSize;
      promises.push(fetch(`http://ergast.com/api/f1/constructors.json?offset=${offset}`));
    }

    yield Promise.all(promises).then(responses => {
      responses.forEach(response => {
        const promise = response.json();

        promise.then((data) => {
          constructors = constructors.concat(data.MRData.ConstructorTable.Constructors);
        });
      });
    });

    yield put(Creators.fetchConstructorsSuccess(constructors));
    
  } catch(err) {
    yield put(Creators.fetchConstructorsError(err));
  }
}

export function* fetchDrivers(action) {
  try {
    const url = `http://ergast.com/api/f1/constructors/${action.constructorId}/drivers.json?limit=1000`
    const response = yield call(request, url);
    yield put(Creators.fetchDriversSuccess(response));
  } catch (err) {
    yield put(Creators.fetchDriversError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* sagaManager() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  const watcher = yield [
    takeLatest(Types.FETCH_CONSTRUCTORS, fetchConstructors),
    takeLatest(Types.FETCH_DRIVERS, fetchDrivers)
  ];

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  sagaManager,
];

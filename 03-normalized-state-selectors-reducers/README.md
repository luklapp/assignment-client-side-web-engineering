# 03 Normalized state, reducers & selectors

Code can be found in the [spendenarena-frontend repository](https://github.com/luklapp/spendenarena-frontend)

## Reducers

```javascript
// app/models/user/reducers.js

const addEntities = (state = initialState, action) => {
  return state.merge(action.payload.entities.users);
}

// app/models/club/reducers.js

const addEntities = (state = initialState, action) => {
  return state.merge(action.payload.entities.clubs);
}

// Triggered by saga:
// app/containers/LoginPage/sagas.js

const normalizedData = normalize(response.data.user, userSchema);
yield put(addEntities(normalizedData));
```

## Selector

```javascript
// Get club name by ID
// app/models/club/selectors.js

const selectClubs = (state,) => state.get('clubs');

const selectClubName = (id) => createSelector(
  selectClubs,
  (clubState) => clubState.getIn([String(id), 'name'])
);
```

## Normalized state

Finally, the normalized state looks like this:

![Normalized state](images/state.png?raw=true)
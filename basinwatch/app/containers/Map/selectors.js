import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the map state domain
 */

const selectMapDomain = state => state.map || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Map
 */

const makeSelectMap = () =>
  createSelector(
    selectMapDomain,
    substate => substate,
  );

export default makeSelectMap;
export { selectMapDomain };

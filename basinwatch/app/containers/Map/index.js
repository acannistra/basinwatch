/**
 *
 * Map
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectMap from './selectors';
import reducer from './reducer';
import saga from './saga';

export function Map() {
  useInjectReducer({ key: 'map', reducer });
  useInjectSaga({ key: 'map', saga });

  return (
    <div>
      <Helmet>
        <title>Map</title>
        <meta name="description" content="Description of Map" />
      </Helmet>
    </div>
  );
}

Map.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  map: makeSelectMap(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(Map);

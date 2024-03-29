import React, { PropTypes } from 'react';
import {createClassFromLiteSpec} from 'react-vega-lite';

export defalt createClassFromLiteSpec('BoxChart', {
  "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
  "description": "A vertical 2D box plot",
  "mark": {
    "type": "boxplot",
    "extent": "min-max"
  },
  "encoding": {
    "x": {"field": "age","type": "ordinal"},
    "y": {
      "field": "people",
      "type": "quantitative",
      "axis": {"title": "population"}
      }
  }



});

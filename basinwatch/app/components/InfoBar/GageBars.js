import React, { PropTypes } from 'react';
import {createClassFromLiteSpec} from 'react-vega-lite';


const lightColor = '#fff';
const medColor = '#888';

export default createClassFromLiteSpec('GageBars', {
  "description": "A simple bar chart with embedded data.",
  "mark": {
    "type": 'bar',
    "clip": true
  },
  "theme": "dark",
  "width": 450,
  "config": {
    background: '#191A1A',

    title: { color: lightColor },

    style: {
      'guide-label': {
        fill: lightColor,
      },
      'guide-title': {
        fill: lightColor,
      },
    },

    axis: {
      domainColor: lightColor,
      gridColor: medColor,
      tickColor: lightColor,
    },
  },
  "transform": [{"calculate":"-20.0", "as":"ref1"}],
  "transform": [{"calculate":"20.0", "as":"ref2"}],

  "layer": [
    {
      "mark" : {
        'type' : 'bar',
        "clip" : true
      },
      "encoding": {
        "x": {
          "field": "anomaly",
          "type": "quantitative",
          "scale": {"domain": [-200,200]}
        },
        "y": {
          "field": "name",
          "type": "ordinal",
          "sort": {"op": "max", "field": "absanomaly", "order": "descending"}
       }
      }
    },
    {
      "mark": "rule",
      "encoding": {
        'x' : { "field" : "ref1"},
        "size": {"value": 2},
        "color": {"value": 'red'}
      }
    },
    {
      "mark": "rule",
      "encoding": {
        'x' : { "field" : "ref2 "},
        "size": {"value": 2},
        "color": {"value": 'red'}
      }
    }
  ]

});

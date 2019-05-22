const initialRadius = 5

name = "CO Basin"
https://api.mapbox.com/styles/v1/mapbox/dark-v9/wmts?access_token=pk.eyJ1IjoiYWNhbm5pc3RyYSIsImEiOiJLWVM2RWhJIn0.TputXxRYBUPh-vjDg6_TFA
glyphs =  "mapbox://fonts/mapbox/{fontstack}/{range}.pbf"

sources = {
  'wbd-Source' : {
      'type': 'geojson',
      'data': 'https://files.t11a.me/file/t11a-xyz/WBD_WBD-14-15_simple-1557886436.geojson',
      'generateId': true
  },

  'gages' : {
    'type' : 'geojson',
    'data' : 'https://files.t11a.me/file/t11a-xyz/gages_WBD14-15-1557885435.geojson',
    'generateId' : true
  },

  'nhd-flowlines' : {
    'type': 'vector',
    'url': 'mapbox://acannistra.6n7tacnh',
  },

}

layers = [
  {
    'id': 'flowlines',
    'type' : 'line',
    'source' : 'nhd-flowlines',
    'source-layer': 'dissolved',
    "paint" : {
      'line-color': '#1f78b4',
      'line-opacity' : 0.4
    }
  },
  {
    'id': 'wbds',
    'type': 'line',
    'source': 'wbd-Source',
    "layout": {},
    "paint": {
        "line-color" : 'red',
        "line-opacity": 0.6
    }
  },
  {
    'id': 'wbds-transparent',
    'type': 'fill',
    'source': 'wbd-Source',
    "layout": {},
    "paint": {
        "fill-color": 'white',
        "fill-opacity": 0.0
    }
  },
  {
    'id': 'wbd-fill',
    'type': 'fill',
    'source': 'wbd-Source',
    "layout": {},
    "paint": {
      "fill-color": '#a6cee3',
        "fill-opacity": [
          "step", ["zoom"],
          0,
          4, ["case",
                ["boolean", ["feature-state", "hover"], false],
                0.1,
                0],
          7, 0
        ],
      "fill-outline-color": 'red'

    }
  },
  {
    'id' : 'riverlabels',
    'source' : 'nhd-flowlines',
    'source-layer' : 'dissolved',
    'type' : 'symbol',
    'layout': {
      'text-field': ['get', 'GNIS_Name'],
      'text-size': [
        'interpolate',
        ['linear'],
        ['zoom'],
        3, 9,
        12, 16
      ],
    },
    'paint' : {
      'text-color': 'white',
      'text-halo-color' : 'black',
      'text-halo-width': 0.4,

    }
  },
  {
    "id": "point",
    "source": 'gages',
    "type": "circle",
    "paint": {
        "circle-radius": initialRadius,
        "circle-radius-transition": {duration: 0},
        "circle-opacity-transition": {duration: 0},
        "circle-color": [
          'interpolate',
          ['linear'],
          ['get', 'DRAIN_SQKM'],
          0, 'white',
          30000, 'blue'
        ]


    }
  },
  {
    "id": 'gage-labels',
    "source": "gages",
    "type": 'symbol',
    "layout": {
      'text-field': ['get', 'STANAME'],
      'text-size' : 10,
      'text-offset' : [0, 2.5]
    },
    'paint' : {
      'text-color': 'white',
      'text-halo-color' : '#A8A8A8',
      'text-halo-width': 0.4,
      "text-opacity": [
        "step", ["zoom"],
        0,
        4, 0,
        7.5, 0.4,
        10, 0.8
      ],
    },

  },
  {
      "id": "point1",
      "source": "gages",
      "type": "circle",
      "paint": {
          "circle-radius": initialRadius,
          "circle-color": [
            'interpolate',
            ['linear'],
            ['get', 'DRAIN_SQKM'],
            0, 'lightgreen',
            30000, 'darkgreen'
          ]
      }
  },
  {
    'id': 'wbd-label',
    'type': 'symbol',
    'source': 'wbd-Source',
    'layout': {
      'text-field': ['get', 'Name'],
      'text-size': [
        'interpolate',
        ['linear'],
        ['zoom'],
        3, 9,
        12, 16
      ],
    },
    'paint' : {
      'text-color': 'white',
      'text-halo-color' : '#A8A8A8',
      'text-halo-width': 0.4,

    }
  }
]

module.exports = {
  sources : sources,
  layers: layers,
  glyphs : glyphs
}

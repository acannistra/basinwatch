const initialRadius = 5

name = "CO Basin"
https://api.mapbox.com/styles/v1/mapbox/dark-v9/wmts?access_token=pk.eyJ1IjoiYWNhbm5pc3RyYSIsImEiOiJLWVM2RWhJIn0.TputXxRYBUPh-vjDg6_TFA
glyphs =  "mapbox://fonts/mapbox/{fontstack}/{range}.pbf"

const _date = new Date()
const YEAR = _date.getFullYear().toString()
const MONTH = ("0"+(_date.getMonth()+1)).slice(-2)
const DAY = ("0" + (_date.getDate())).slice(-2)

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
  "NOAA:StreamAnomalyTiles": {
    "type": "raster",
    "tiles": [
      "https://mapservice.nohrsc.noaa.gov/arcgis/rest/services/national_water_model/NWM_Stream_Analysis/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=3857&layers=show: 10,11&layerDefs=&imageSR=3857&format=png&transparent=true&dpi=96&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&rotation=&datumTransformations=&layerParameterValues=&mapRangeValues=&layerRangeValues=&f=image"
    ],
    "tileSize": 256
  },
  "NOAA:7DayPrecipTiles" :{
    "type": "raster",
    "tiles": [
      "https://water.weather.gov/ahps/gis.php/wmts/?shape_path="+YEAR+"/"+MONTH+"/"+DAY+"/nws_precip_last7days_observed_"+YEAR+MONTH+DAY+"&service=wmts&request=gettile&version=1.0.0&layer=precip&style=default&tilematrixset=esri-web-mercator&tilematrix={z}&tilerow={y}&tilecol={x}"
    ],
    "tileSize": 256
  },
  "NOAA:1DayPrecipTiles" :{
    "type": "raster",
    "tiles": [
      "https://water.weather.gov/ahps/gis.php/wmts/?shape_path="+YEAR+"/"+MONTH+"/"+DAY+"/nws_precip_1day_observed_"+YEAR+MONTH+DAY+"&service=wmts&request=gettile&version=1.0.0&layer=precip&style=default&tilematrixset=esri-web-mercator&tilematrix={z}&tilerow={y}&tilecol={x}"
    ],
    "tileSize": 256
  }

}

layers = [
  {
    "id": "L:NOAA:7DayPrecip",
    "source": "NOAA:7DayPrecipTiles",
    "type": "raster",
    'layout': {
      'visibility': 'none'
    },
    "paint": {
      "raster-opacity": [
        "interpolate", ["linear"], ["zoom"],
        4, 0.6,
        7, 0.15
      ]
    }
  },
  {
    "id": "L:NOAA:1DayPrecip",
    "source": "NOAA:1DayPrecipTiles",
    "type": "raster",
    'layout': {
      'visibility': 'none'
    },
    "paint": {
      "raster-opacity": [
        "interpolate", ["linear"], ["zoom"],
        4, 0.6,
        7, 0.15
      ]
    }
  },
  {
    "id": "L:NOAA:StreamAnomaly",
    "source": "NOAA:StreamAnomalyTiles",
    "type": "raster",
    'layout': {
      'visibility': 'none'
    }
  },
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
  // {
  //   "id": "gagecircles",
  //   "source": 'gages',
  //   "type": "circle",
  //   "paint": {
  //       "circle-radius": initialRadius,
  //       "circle-radius-transition": {duration: 0},
  //       "circle-opacity-transition": {duration: 0},
  //       "circle-color": [
  //         'interpolate',
  //         ['linear'],
  //         ['get', 'anomaly', ['object', ['get', 'anomaly']]],
  //         100, 'white',
  //         200, 'blue'
  //       ]
  //
  //
  //   }
  // },
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
            ['get', 'anomaly', ['object', ['get', 'anomaly']]],
            0, 'maroon',
            50, 'orangered',
            100, 'white',
            200, 'darkgreen'
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

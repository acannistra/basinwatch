/**
 *
 * Map
 *
 */

import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { sources, layers, glyphs}  from './BaseStyle'
import mapboxgl from 'mapbox-gl'
import {bbox, bboxPolygon} from '@turf/turf'
import LayerSelector from "./LayerSelector"


mapboxgl.accessToken = 'pk.eyJ1IjoiYWNhbm5pc3RyYSIsImEiOiJLWVM2RWhJIn0.TputXxRYBUPh-vjDg6_TFA';

const gageDataUrl = "https://files.t11a.me/file/t11a-xyz/gages_WBD14-15-1557885435.geojson"

const anomalies = "https://p282obduy0.execute-api.us-west-2.amazonaws.com/dev/anomalies"


const fullBounds = new mapboxgl.LngLatBounds([-115.75,29.69],[-103.5,43.39])

function getUnique(arr){
  let set = new Set();
  return arr.map((v, index) => {
     if(set.has(v.id)) {
         return false
     } else {
         set.add(v.id);
         console.log("added" + v.id)
         return index.toString();
     }
   }).filter(e=>e).map(e=>arr[parseInt(e)]);
}

class Map extends Component {
  watershedClickHandler;
  finishedLoading;




  constructor(props) {
    super(props);
    this.state = {
      activeBounds: fullBounds,
      updatedGages: null,
      gageDataSet: false
    };

    this.updateGageSource = this.updateGageSource.bind(this);
    this.toggleLayer = this.toggleLayer.bind(this);


  }

  componentDidUpdate(prevProps, prevState){
    if (this.state.gageDataSet){
      this.map.off('sourcedata', this.updateGageSource);
    }
    this.map.fitBounds(this.state.activeBounds)
  }

  componentWillUpdate(newProps){
    console.log(newProps)

    if(newProps.focalWatershed){
      var feats = this.map.querySourceFeatures('wbd-Source', {
        filter: ['==', 'HUC6', newProps.focalWatershed.HUC6]
      });
      // this.map.fitBounds(bbox(feats[0].geometry))
      // return(false)
    }
  }

  toggleLayer(layer, visible){
    console.log(this.map)
    if(visible){
      this.map.setLayoutProperty(layer, 'visibility', 'visible')
    } else {
      this.map.setLayoutProperty(layer, 'visibility', 'none')
    }
  }

  updateGageSource(){
   try {
     this.map.getSource('gages').setData(this.state.updatedGages);
     this.setState({
       gageDataSet: true
     });
     console.log('update success')
   }
   catch (error){
     console.log(error);
   };
 }





  componentDidMount(){

    const dotsize = 20;


    var gageData = null;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v9',
      minZoom: 5,
      bounds: this.state.activeBounds,
      attributionControl: true,
      customAttribution: ['USGS']
    });

    var scale = new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: 'imperial'
    });
    this.map.addControl(scale);

    scale.setUnit('imperial');



    var pulsingDot = {
      width: dotsize,
      height: dotsize,
      data: new Uint8Array(dotsize * dotsize * 4),

      onAdd: function() {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },

      render: function(map) {
        var duration = 1000;
        var t = (performance.now() % duration) / duration;

        var radius = dotsize / 2 * 0.3;
        var outerRadius = dotsize / 2 * 0.7 * t + radius;
        var context = this.context;

        // draw outer circle
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
        context.fill();

        // draw inner circle
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 100, 100, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // update this image's data with data from the canvas
        this.data = context.getImageData(0, 0, this.width, this.height).data;

        // keep the map repainting
        console.log(this)
        // this.map.triggerRepaint();

        // return `true` to let the map know that the image was updated
        return true;
      }
    };

    this.map.addImage('pulsingDot', pulsingDot);

    this.map.on("load", () => {

      for (var id of Object.keys(sources)) {
        this.map.addSource(id, sources[id])
      }
      for (var layer of layers) {
        this.map.addLayer(layer)
      }
      console.log("loaded!")
    });



    fetch(gageDataUrl)
      .then(res => res.json())
      .then(gages => {
        fetch(anomalies)
          .then(res => res.json())
          .then(anoms => {
            console.log(anoms)
            for (var gage of gages['features']){
              gage['properties']['anomaly'] = anoms[gage['properties']['STAID']]
            }
            gageData = gages
            this.setState({
              updatedGages : gageData
            })
          })
    })



    this.map.on('sourcedata', this.updateGageSource);



    var hoveredStateId = null;

    this.map.on("mousemove", 'wbds-transparent', (e) => {
      if (e.features.length > 0) {
        if (hoveredStateId) {
          this.map.setFeatureState({source: 'wbd-Source', id: hoveredStateId}, { hover: false});
        }
        hoveredStateId = e.features[0].id;
        this.map.setFeatureState({source: 'wbd-Source', id: hoveredStateId}, { hover: true});
      }
    });
    this.map.on('mouseleave', 'wbds-transparent', (e) => {
      if (hoveredStateId) {
        this.map.setFeatureState({source: 'wbd-Source', id: hoveredStateId}, { hover: false});
        }
        hoveredStateId =  null;
    })
    this.map.on('click', 'wbds-transparent', (e) => {
      console.log(e.features)
      var bounds = bbox(e.features[0])
      console.log(bboxPolygon(bounds))
      this.setState({
        activeBounds: new mapboxgl.LngLatBounds(
          [bounds[0], bounds[1]],
          [bounds[2], bounds[3]]
        )
      });

      console.log(e.features[0].properties.HUC6)

      var gages = this.map.querySourceFeatures('gages', {
      filter: ['==', 'HUC6', e.features[0].properties.HUC6]
      });
      gages = getUnique(gages)

      this.props.watershedClickHandler({
        watershed: e.features[0].properties,
        gages: gages
      })

    })

  }

  setBounds() {
    const bounds = this.state.activeBounds
    console.log('setting bounds')
    this.map.flyTo({
      center: [0, 0]
    })
  }


  render() {
    console.log('rendering...')

    return (
      <div>
        <LayerSelector toggleLayer={this.toggleLayer}>
        </LayerSelector>
        <div
         style={{
          "height" : "100vh"
        }} id = 'map'/>
      </div>
    );
  }
}

Map.propTypes = {};

export default Map;

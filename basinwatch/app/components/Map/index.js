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

mapboxgl.accessToken = 'pk.eyJ1IjoiYWNhbm5pc3RyYSIsImEiOiJLWVM2RWhJIn0.TputXxRYBUPh-vjDg6_TFA';

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
  reset;

  constructor(props) {
    super(props);
    this.state = {
      activeBounds:  new mapboxgl.LngLatBounds([-115.75,29.69],[-103.5,43.39])
    };
  }

  componentDidUpdate(){

  }

  componentDidMount(){

    this.map = new mapboxgl.Map({
      container: 'test',
      style: 'mapbox://styles/mapbox/dark-v9',
      minZoom: 5,
      bounds: this.state.activeBounds
    });



    this.map.on("load", () => {

      for (var id of Object.keys(sources)) {
        this.map.addSource(id, sources[id])
      }
      for (var layer of layers) {
        this.map.addLayer(layer)
      }
      console.log("loaded!")
    });


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
      <div  style={{
         position: 'absolute',
         top: 0,
         bottom: 0,
         left: '40%',
         width: '60%',
         height: '100%',
         }} id = 'test'>
      </div>
    );
  }
}

Map.propTypes = {};

export default Map;

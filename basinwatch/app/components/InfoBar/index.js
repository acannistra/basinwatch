/**
 *
 * InfoBar
 *
 */

import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100vh;
  max-width: 40%;
  top: 0;
  padding: 35px;
  overflow: scroll;
  background-color: #191A1A;

`;

function WatershedStats(props){
  console.log(props)
    if (props.watershed){
      return(
        <div>
          <h2>Watershed: {props.watershed.Name}</h2>
          <h2>Num Gages: {props.gages.length}</h2>
        </div>
      );
    }
    return(<h2>No Watershed Selected</h2>)
  }

class InfoBar extends Component {
  watershed;
  gages;


  render() {
    return(
      <Wrapper>
        <h1>BasinWatch</h1>
        <WatershedStats watershed = {this.props.watershed} gages = {this.props.gages}/>
      </Wrapper>
    );
  }

}

InfoBar.propTypes = {};

export default InfoBar;

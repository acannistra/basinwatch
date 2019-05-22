/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, {Component} from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Map  from 'components/Map';
import InfoBar from 'components/InfoBar'
import styled from 'styled-components';

const MainContainer = styled.div`
  max-height: 100%;
  min-width: 100%;
  margin: 0 auto;
  position: absolute;
  top: 0;
  left: 0;

`;

class HomePage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedWatershed: null,
      selectedGages: []
    }
    this.selectWatershed = this.selectWatershed.bind(this)
  }

  selectWatershed(update) {
    this.setState({
      selectedWatershed: update.watershed,
      selectedGages: update.gages
    })
  }

  render() {
    console.log("Rendering PARENT")
    console.log(this.state)
    return (
        <MainContainer>
        <InfoBar watershed = {this.state.selectedWatershed}
            gages = {this.state.selectedGages}>

        </InfoBar>
        <Map watershedClickHandler = {this.selectWatershed}></Map>
      </MainContainer>
    );
  };
}

export default HomePage;

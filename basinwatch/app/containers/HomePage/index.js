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
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';


const MainContainer = styled.div`
  max-height: 100%;
  min-width: 100%;
  margin: 0 auto;
  position: absolute;
  top: 0;
  left: 0;

`;

const styles = {
  root: {
    height: '100vh',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

class HomePage extends Component {


  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      selectedWatershed: null,
      selectedGages: []
    }
    this.selectWatershed = this.selectWatershed.bind(this)
    this.finishedLoading = this.finishedLoading.bind(this)
    this.zoomToWatershed = this.zoomToWatershed.bind(this)
  }

  finishedLoading(){
    this.setState({
      loading: false
    });
  }

  zoomToWatershed(){
    this.setState({
      zoomToWatershed: this.state.selectedWatershed
    })
  }

  selectWatershed(update) {
    this.setState({
      zoomToWatershed: null,
      selectedWatershed: update.watershed,
      selectedGages: update.gages,
      loading: false
    })
  }

  render() {

    console.log(this.state.zoomToWatershed)
    return (
      <Grid container component="main" classname={styles.root}>
        <CssBaseline/>
        <Grid xs={12}>
          <InfoBar watershed={this.state.selectedWatershed} gages={this.state.selectedGages} loading={this.state.loading} zoomToWatershedHandler={this.zoomToWatershed}/>
        </Grid>
        <Grid xs={12}>
          <Map watershedClickHandler={this.selectWatershed} finishedLoading={this.finishedLoading}
          focalWatershed={this.state.zoomToWatershed}/>
        </Grid>
      </Grid>

    );
  };
}

export default HomePage;

/**
 *
 * InfoBar
 *
 */

import React, {Component} from 'react';
import {createClassFromLiteSpec} from 'react-vega-lite';
import Table from '@material-ui/core/Table';
import { makeStyles } from '@material-ui/core/styles';

import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';



// import PropTypes from 'prop-types';
import styled from 'styled-components';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(9),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
}));

const Wrapper = styled.div`
  height: 100vh;
  max-width: 40%;
  top: 0;
  padding: 35px;
  overflow: scroll;
  background-color: #191A1A;

`;


function WatershedStats(props){
  const classes = useStyles();

  console.log(props)
    if (props.watershed){

      if(props.gages){
        var gagenames = props.gages.map((e) => {
          var an = JSON.parse(e.properties.anomaly)

          return (
            <TableRow key={e.properties.STANAME}>
              <TableCell>{e.properties.STANAME.toLowerCase()}</TableCell>
              <TableCell>{an.current} cfs</TableCell>
              <TableCell>{an.median} cfs</TableCell>
              <TableCell>{an.anomaly}%</TableCell>
            </TableRow>
          )
        })
      }

      return(
        <div>
          <h2>Watershed: {props.watershed.Name}</h2>
          <h2>Num Gages: {props.gages.length}</h2>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Station</TableCell>
                  <TableCell >Current Flow</TableCell>
                  <TableCell >Median</TableCell>
                  <TableCell >Anomaly</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gagenames}
              </TableBody>
            </Table>
          </Paper>
        </div>
      );
    }
    return(<h2>No Watershed Selected</h2>)
  }

class InfoBar extends Component {
  watershed;
  gages;
  loading;


  render() {
    return(
      <Wrapper>

        <WatershedStats watershed = {this.props.watershed} gages = {this.props.gages}/>
      </Wrapper>
    );
  }

}

InfoBar.propTypes = {};

export default InfoBar;

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
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import GaugeChart from 'react-gauge-chart';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';




// import PropTypes from 'prop-types';
import styled from 'styled-components';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(9),
    overflowX: 'auto',
  },
  cardGrid: {
    marginTop: theme.spacing(9)
  },
  table: {
    minWidth: 650,
  },
  button: {
    margin: theme.spacing(1),
    color: 'white'
  },
  card: {
    minWidth: 150,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
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
          <Grid container>
            <Grid sm={10}>
              <Typography variant="h2">
                {props.watershed.Name}
              </Typography>
            </Grid>
            <Grid sm={2} >
              <Button variant="contained" color="primary" classname={classes.button} onClick={props.zoomToWatershed}>
                zoom to watershed
              </Button>

            </Grid>
          </Grid>
          <Grid container spacing={5} direction="row" className={classes.cardGrid}>
            {[1,2,3].map( _ => (
              <Grid sm={4}>
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography variant='h1'>150%</Typography>
                    </CardContent>
                    <CardActions>
                      <Typography variant="button" display="block">Anomalous Gauges</Typography>
                    </CardActions>
                  </Card>
                </Grid>
              ))}

          </Grid>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Station</TableCell>
                  <TableCell>Current Flow</TableCell>
                  <TableCell>Median</TableCell>
                  <TableCell>Anomaly</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gagenames}
              </TableBody>
            </Table>
          </Paper>
        </div>
      )
    }
    return(null)
};

    // return(test)
// };

class InfoBar extends Component {
  watershed;
  gages;
  loading;
  zoomToWatershedHandler;


  render() {
    return(
      <Wrapper>
        <WatershedStats watershed = {this.props.watershed} gages = {this.props.gages} zoomToWatershed={this.props.zoomToWatershedHandler}/>
      </Wrapper>
    );
  }

}

InfoBar.propTypes = {};

export default InfoBar;

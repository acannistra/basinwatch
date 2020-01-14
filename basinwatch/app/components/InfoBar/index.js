/**
 *
 * InfoBar
 *
 */

import React, {Component} from 'react';
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
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { VictoryChart, VictoryBar} from 'victory';




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
    marginLeft: "2em",
    marginRight: "2em"
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

  var [activeTab, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function numAnomalous(threshold){
    return (props.gages.filter((g) => {
      var an = JSON.parse(g.properties.anomaly)
      return (
        parseFloat(an.anomaly) >= 100 + threshold ||
        parseFloat(an.anomaly) <= 100 - threshold
      )
    }).length);
  };

  function flyTo(e){
    console.log(e)
  }

  var chartData = props.gages.reduce(function(list, g) {
    var an = JSON.parse(g.properties.anomaly)
    if(an.anomaly == "-1") {return (list)}
    var obj = {}
    obj["name"] = g.properties.STANAME;
    obj["anomaly"] = parseFloat(an.anomaly) - 100.0
    obj['absanomaly'] = Math.abs(obj['anomaly'])
    return list.concat([obj]);
  }, []);

  console.log(chartData)

    if (props.watershed){
      // if(props.gages){
      //   var gagenames = props.gages.map((e) => {
      //     var an = JSON.parse(e.properties.anomaly)
      //
      //     return (
      //       <TableRow key={e.properties.STANAME}>
      //         <TableCell>{e.properties.STANAME.toLowerCase()}</TableCell>
      //         <TableCell>{an.current} cfs</TableCell>
      //         <TableCell>{an.median} cfs</TableCell>
      //         <TableCell>{an.anomaly}%</TableCell>
      //       </TableRow>
      //     )
      //   })
      // }

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
          <Grid container spacing={9} direction="row" className={classes.cardGrid}>
            {[["Number of Gages", props.gages.length],
              ["Number of Anomalous Gauges", numAnomalous(20)],
              ["Percent Anomalous Gauges", (numAnomalous(20) / props.gages.length).toPrecision(3) * 100]
            ].map( _ => (
              <Grid sm={4}>
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography variant='h1'>{_[1]}</Typography>
                    </CardContent>
                    <CardActions>
                      <Typography variant='button'>{_[0]}</Typography>
                    </CardActions>
                  </Card>
                </Grid>
              ))}

          </Grid>

          <Divider light />

          <Grid container className={classes.cardGrid}>
            <Grid sm={6}>
              
            </Grid>
          </Grid>
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

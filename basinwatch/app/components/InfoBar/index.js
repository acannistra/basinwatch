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
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';




// import PropTypes from 'prop-types';
import styled from 'styled-components';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3,2)
  },
  root: {
    width: '100%',
    marginTop: theme.spacing(9),
    overflowX: 'auto',
    display: 'flex',
    flexWrap: 'wrap'
  },
  cardGrid: {
    marginTop: theme.spacing(2)
  },
  table: {
    minWidth: 650,
  },
  button: {
    margin: theme.spacing(1),
    color: 'white'
  },
  card: {
    marginLeft: "0.5em",
    marginRight: "0.5em"
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: "95%",

  },
  input: {
    color: 'blue'
  }
}));

const Wrapper = styled.div`
  height: 100vh;
  padding: 35px;
  overflow: scroll;
  background-color: #191A1A;
`;


function WatershedStats(props){

  const classes = useStyles();

  var [activeTab, setTab] = React.useState(0);
  var [chosenGage, setGage] = React.useState(0);

  function handleChange(event, newValue) {
    setTab(newValue);
  }
  function handleSelect(event, newValue){
    setGage(newValue.props.value);
    console.log(newValue.props.value);
  }

  function numAnomalous(threshold){
    try {
      return (props.gages.filter((g) => {
        var an = JSON.parse(g.properties.anomaly)
        return (
          parseFloat(an.anomaly) >= 100 + threshold ||
          parseFloat(an.anomaly) <= 100 - threshold
        )
      }).length);
    } catch {
      return (0);
    }

  };

  try {
    var chartData = props.gages.reduce(function(list, g) {
      var an = JSON.parse(g.properties.anomaly)
      if(an.anomaly == "-1") {return (list)}
      var obj = {}
      obj["name"] = g.properties.STANAME;
      obj["anomaly"] = parseFloat(an.anomaly) - 100.0
      obj['absanomaly'] = Math.abs(obj['anomaly'])
      return list.concat([obj]);
    }, []);
  } catch {
    var chartData = [];
  }


  console.log(chartData)

    if (props.watershed){
      // if(props.gages){
        try {
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
        } catch {
          var gagenames = [];
        }


      return(
        <div  >
          <Typography variant='button'>watershed</Typography>
          <Grid container>
            <Grid sm={10}>
              <Typography variant="h4">
                {props.watershed.Name}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1} direction="row" className={classes.cardGrid}>
            {[["Gages in Basin", props.gages.length],
              ["# Anomalous", numAnomalous(20)],
              ["% Anomalous", (numAnomalous(20) / props.gages.length).toPrecision(2) * 100 + '%']
            ].map( _ => (
              <Grid sm={4}>
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography variant='h5'>{_[1]}</Typography>
                    </CardContent>
                    <CardActions>
                      <Typography variant='button'>{_[0]}</Typography>
                    </CardActions>
                  </Card>
                </Grid>
              ))}

          </Grid>

          <Paper className={classes.root}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel htmlFor="outlined-gage-simple">Gage</InputLabel>
              <Select
                value={chosenGage}
                onChange={handleSelect}
                input={<FilledInput name="Gage" id="outlined-gage-simple" />}
              >
                <option value="">
                  <em>None</em>
                </option>
                {chartData.map((g) => {
                    return(<option value={g.name}>
                      {g.name}
                    </option>)
                })}
              </Select>
            </FormControl>
          </Paper>


          <Grid container className={classes.cardGrid}>
            <Grid sm={6}>

            </Grid>
          </Grid>
        </div>
      )
    }
    return(null)
};

//
// <Paper className={classes.root}>
//  <Table className={classes.table}>
//    <TableHead>
//      <TableRow>
//        <TableCell>Station</TableCell>
//        <TableCell >Current Flow</TableCell>
//        <TableCell >Median</TableCell>
//        <TableCell >Anomaly</TableCell>
//      </TableRow>
//    </TableHead>
//    <TableBody>
//      {gagenames}
//    </TableBody>
//  </Table>
// </Paper>
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

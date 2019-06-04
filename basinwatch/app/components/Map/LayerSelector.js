import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';


const LAYERS = [
  {
    "name" : "NOAA 1-Day Precip",
    "id" : "L:NOAA:1DayPrecip"
  },
  {
    "name" : "NOAA 7-Day Precip",
    "id" : "L:NOAA:7DayPrecip"
  },
  {
    "name" : "NWM Streamflow Anomaly",
    "id" : "L:NOAA:StreamAnomaly"
  }
]

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    position: "absolute",
    "z-index": 10,
    top: 0,
    right: 0,
    background: "lightgray",
    "border-radius": "10px",
    margin: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(2),
  },
  checkbox: {
    'text-color': 'black'
  }
}));

function LayerSelector(props) {
  const classes = useStyles();
  const [state, setState] = React.useState(
    LAYERS.reduce((dict, i) => {
      dict[i['id']] = false // add "false" selection for each layer name
      return (dict)
    }, {})
  );

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
    props.toggleLayer(name, event.target.checked)
  };

  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup>
          {
            LAYERS.map((l) => {
              return (
                <FormControlLabel
                  control={<Checkbox color="default" className={classes.checkbox} checked={state[l.id]} onChange={handleChange(l.id)} value={l.id} />}
                  label={l.name}
                />
              )
            })
          }
        </FormGroup>
      </FormControl>
    </div>
  );
}

export default LayerSelector;

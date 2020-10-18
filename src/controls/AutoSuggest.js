import React, {useState} from 'react';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    root: {
      height: 250,
      flexGrow: 1
    },
    container: {
      position: 'relative'
    },
    suggestionsContainerOpen: {
      position: 'absolute',
      zIndex: 1,
      left: 0
    },
    suggestion: {
      display: 'block'
    }
}))


function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        inputlabelprops: {
          shrink: true
        }
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map(part => (
          <span key={part.text}>
            {part.text}
          </span>
        ))}
      </div>
    </MenuItem>
  );
}

const useSuggestions = (suggestions = []) => {
  const [filtered, setFiltered] = useState([]);

  function getSuggestions(value) {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;
  
    setFiltered(inputLength === 0
      ? []
      : suggestions.filter(suggestion => {
          const keep =
            count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;
          if (keep) {
            count += 1;
          }
          return keep;
        }));
  }

  function clearSuggestions() {
    setFiltered([]);
  }

  return [filtered, getSuggestions, clearSuggestions];

}


function IntegrationAutosuggest({onChange, value, label, name, options, ...props}) {
  const classes = useStyles();
  const [suggestions, getSuggestions, clearSuggestions] = useSuggestions(options);

  const handleSuggestions = ({ value }) => {
    getSuggestions(value);
  };

  const handleChange = name => (event, { newValue }) => {
    onChange({target: {name, value: newValue}});
  };

  const autosuggestProps = {
    renderInputComponent,
    suggestions: suggestions,
    onSuggestionsFetchRequested: handleSuggestions,
    onSuggestionsClearRequested: clearSuggestions,
    getSuggestionValue: (s) => s.label,
    renderSuggestion
  };


  return (
    <div className={classes.root}>
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          classes,
          label: label,
          value: value,
          onChange: handleChange(name),
          name,
          ...props          
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />     
    </div>
  );
}

export default IntegrationAutosuggest;
import React, { useState, useReducer, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import FilterIcon from "@material-ui/icons/FilterList";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

const filter = createFilterOptions();

const drawerWidth = 300;
const useStyles = makeStyles((theme) => ({
  drawer: {
    zIndex: 5,
  },
  content: {
    padding: "150px 24px 0 24px",
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));

const initialState = {
  owners: [],
  assignees: [],
};

const reducer = (state, action) => {
  const { value, type } = action;
  switch (type) {
    case "owners":
      return { ...state, owners: value };
    case "assignees":
      return { ...state, assignees: value };
    default:
      return state;
  }
};

const FilterOptions = ({
  defaultFilters = initialState,
  onFilterChange,
  open,
  onClose,
  locked,
  organizations,
}) => {
  const classes = useStyles();
  let orgTags = [];
  const [orgTagState, setOrgTagState] = useState(orgTags);
  useEffect(() => {
    if (organizations && organizations[0]) {
      orgTags = organizations[0].tags.map((orgTag) => {
        return { title: orgTag };
      });
      setOrgTagState(orgTags);
    }
  }, [organizations]);
  const [tagState, setTagState] = useState([]);
  const [{ owners, assignees }, dispatch] = useReducer(reducer, defaultFilters);

  useEffect(() => {
    onFilterChange({
      owners,
      assignees,
      tagState,
    });
  }, [owners, assignees, tagState]);

  return (
    <Drawer
      open={open || locked}
      elevation={0}
      anchor={"left"}
      variant={locked ? "permanent" : "temporary"}
      onClose={onClose}
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
    >
      <div className={classes.content}>
        <Typography
          variant="h5"
          style={{ lineHeight: "30px", height: 30, verticalAlign: "bottom" }}
        >
          Filters <FilterIcon />
        </Typography>

        <Autocomplete
          multiple
          filterSelectedOptions
          onChange={(event, newValue) => {
            let newTag;
            let newTags = newValue.map((tag) => {
              if (typeof tag === "string") return tag;
              if (tag && tag.inputValue) {
                newTag = tag.inputValue;
                if (!orgTagState.includes(tag)) {
                  let optionTags = orgTagState;
                  optionTags.push({ title: tag.inputValue });
                  setOrgTagState(optionTags);
                }
                return tag.inputValue;
              } else if (tag && tag.title) return tag.title;
            });
            setTagState(newTags);
            return;
          }}
          filterOptions={(options, params) => {
            let filtered = filter(options, params);
            tagState.map((defaultTag) => {
              filtered = filtered.filter((tags) => {
                if (defaultTag.title) return tags.title != defaultTag.title;
                else return tags.title != defaultTag;
              });
            });
            return filtered;
          }}
          filterSelectedOptions={true}
          id="tags-filled"
          options={orgTagState}
          defaultValue={
            tagState.length > 0
              ? tagState.map((tag) => {
                  return tag;
                })
              : []
          }
          getOptionLabel={(option) => {
            if (typeof option === "string") {
              return option;
            }
            if (option && option.inputValue) {
              return option.inputValue;
            }
            if (option != null) return option.title;
          }}
          renderOption={(option) => {
            if (option.title) return option.title;
            return option.inputValue;
          }}
          style={{ width: "100%" }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Tags"
              style={{ width: "252px" }}
              placeholder="Search Tags"
            />
          )}
        />
      </div>
    </Drawer>
  );
};

FilterOptions.propTypes = {
  defaultFilters: PropTypes.object,
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterOptions;

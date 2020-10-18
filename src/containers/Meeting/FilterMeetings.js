import React, { useState, useReducer, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FilterIcon from "@material-ui/icons/FilterList";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import CheckBox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import PropTypes from "prop-types";
import filterStates from "../filterStates";
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

const MyCheckBox = ({ checked, onChange, label }) => (
  <FormControlLabel
    control={<CheckBox checked={checked} onChange={onChange} value={label} />}
    label={label}
  />
);

const reducer = (state, action) => {
  const { value, type } = action;
  switch (type) {
    case "pending":
      return { ...state, pending: value };
    case "cancelled":
      return { ...state, cancelled: value };
    case "inProgress":
      return { ...state, inProgress: value };
    case "ended":
      return { ...state, ended: value };
    case "missed":
      return { ...state, missed: value };
    case "myMeetings":
      return { ...state, myMeetings: value };
    case "owners":
      return { ...state, owners: value };
    case "invitees":
      return { ...state, invitees: value };
    default:
      return state;
  }
};

const FilterOptions = ({
  defaultFilters = filterStates.Meetings.getFilterList(),
  onFilterChange,
  open,
  onClose,
  locked,
  meetings,
  organizations,
  account,
}) => {
  const classes = useStyles();
  let orgTags;
  const [orgTagState, setOrgTagState] = useState(orgTags);
  const [tagState, setTagState] = useState(defaultFilters.tagState);
  const [
    {
      myMeetings,
      ended,
      missed,
      pending,
      inProgress,
      owners,
      cancelled,
      invitees,
    },
    dispatch,
  ] = useReducer(reducer, defaultFilters);

  useEffect(() => {
    if (organizations[0])
      orgTags = organizations[0].tags.map((orgTag) => {
        return { title: orgTag };
      });
    setOrgTagState(orgTags);
  }, [organizations]);

  useEffect(() => {
    const filters = {
      myMeetings,
      ended,
      missed,
      pending,
      inProgress,
      cancelled,
      owners,
      invitees,
    };

    onFilterChange({
      myMeetings,
      ended,
      missed,
      pending,
      inProgress,
      cancelled,
      owners,
      invitees,
      tagState,
    });
    filterStates.Meetings.saveFilterList({
      myMeetings,
      ended,
      missed,
      pending,
      inProgress,
      cancelled,
      owners,
      invitees,
      tagState,
    });
  }, [
    myMeetings,
    ended,
    missed,
    pending,
    inProgress,
    cancelled,
    owners,
    invitees,
    tagState,
  ]);

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

        <MyCheckBox
          checked={myMeetings}
          label={"Only show my Meetings"}
          onChange={(e, value) => dispatch({ type: "myMeetings", value })}
        />
        <Divider />

        <MyCheckBox
          checked={ended}
          label={"Ended"}
          onChange={(e, value) => dispatch({ type: "ended", value })}
        />
        <br />
        <MyCheckBox
          checked={missed}
          label={" Missed"}
          onChange={(e, value) => dispatch({ type: "missed", value })}
        />
        <br />
        <MyCheckBox
          checked={pending}
          label={"Pending"}
          onChange={(e, value) => dispatch({ type: "pending", value })}
        />
        <br />

        <MyCheckBox
          checked={inProgress}
          label={"InProgress"}
          onChange={(e, value) => dispatch({ type: "inProgress", value })}
        />
        <br />

        <MyCheckBox
          checked={cancelled}
          label={"Cancelled"}
          onChange={(e, value) => dispatch({ type: "cancelled", value })}
        />

        <Typography
          variant="h6"
          style={{ lineHeight: "30px", height: 30, verticalAlign: "bottom" }}
        >
          Tags
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
          options={orgTagState || []}
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

import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { OrganizationHOC } from "../../context/OrganizationProvider";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

const filter = createFilterOptions();

const handleAddTag = async (tags, handleTags, newTag = false) => {
  await handleTags(tags, newTag ? newTag : false);
  return;
};

const AddTags = ({ handleTags, tags, orgTags, createNote, width }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [orgTagState, setOrgTagState] = useState(orgTags);
  const [tagState, setTagState] = useState([]);
  const [isLoading, setLoading] = React.useState(false);

  useEffect(() => {
    if (tags != null && tags != tagState && !createNote) {
      setLoading(true);
      setTagState(tags);
    }
  }, [tags]);

  useEffect(() => {
    if (tagState === tags) setLoading(false);
  }, [tagState]);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  return (
    <React.Fragment>
      {isLoading ? null : (
        <Autocomplete
          multiple
          onChange={(event, newValue) => {
            let newTag;
            let newTags = newValue.map((tag) => {
              if (typeof tag === "string") return tag;
              if (tag && tag.inputValue) {
                newTag = tag.inputValue.toLowerCase();
                if (!orgTagState.includes(tag)) {
                  let optionTags = orgTagState;
                  optionTags.push({ title: tag.inputValue.toLowerCase() });
                  setOrgTagState(optionTags);
                }
                return tag.inputValue.toLowerCase();
              } else if (tag && tag.title) return tag.title;
            });
            handleAddTag(newTags, handleTags, newTag ? newTag : false);
            setTagState(newTags);
            return;
          }}
          filterOptions={(options, params) => {
            let filtered = filter(options, params);
            let include = false;
            filtered.map((tag) => {
              if (tag.title.toLowerCase() === params.inputValue.toLowerCase())
                include = true;
            });
            if (!include)
              orgTagState.map((tag) => {
                if (tag.title.toLowerCase() === params.inputValue.toLowerCase())
                  include = true;
              });
            let includesInMeeting = false;
            tagState.map((defaultTag) => {
              let tag = defaultTag.title ? defaultTag.title : defaultTag;
              if (tag.toLowerCase() === params.inputValue.toLowerCase())
                includesInMeeting = true;
              filtered = filtered.filter((tags) => {
                if (defaultTag.title)
                  return (
                    tags.title.toLowerCase() != defaultTag.title.toLowerCase()
                  );
                else
                  return tags.title.toLowerCase() != defaultTag.toLowerCase();
              });
            });
            if (params && params.inputValue !== "" && !include) {
              const newTag = {
                inputValue: params.inputValue.toLowerCase(),
                title: `Add "${params.inputValue.toLowerCase()}"`,
              };
              filtered.push(newTag);
            }
            return filtered;
          }}
          filterSelectedOptions={true}
          id="tags-filled"
          options={orgTagState}
          defaultValue={
            tagState && tagState.length > 0
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
          style={{ width: width ? width : "50vw" }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Tags"
              placeholder="Add Tags"
            />
          )}
        />
      )}
    </React.Fragment>
  );
};

const Wrapper = OrganizationHOC(AddTags);
export default Wrapper;

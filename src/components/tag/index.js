import React, { useState, PureComponent, useReducer, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import getIconForStatus from "../../helpers/getIconForStatus";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";

const filter = createFilterOptions();

const useStyles = makeStyles((theme) => ({
  root1: {
    "& > * + *": {
      marginTop: theme.spacing(3),
    },
    cursor: "pointer",
    zIndex: 1500,
  },
}));

const handleAddTag = async (tags, mtngID, handleTagUpdate, newTag = false) => {
  await handleTagUpdate(tags, mtngID, newTag ? newTag : false);
  return;
};

const Tags = ({ id, tags, orgTags, handleTagUpdates, getTags, icon }) => {
  const classes = useStyles();
  const anchorRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [tagState, setTagState] = React.useState(tags);
  const [orgTagState, setOrgTagState] = React.useState(orgTags);
  const [isTagExist, setTagExist] = React.useState(false);
  const TagIcon = getIconForStatus(
    icon === "Add icon" ? "Add" : "TagFilled" ? "TagFilled" : "Tag"
  );

  useEffect(() => {
    getTags(tagState);
  });

  useEffect(() => {
    setTagState(tags);
  }, [tags]);

  const handleToggle = (e) => {
    setOpen((prevOpen) => !prevOpen);
    e.stopPropagation();
    getTags(tagState);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  return (
    <div className={classes.root1}>
      <TagIcon
        style={{
          fill: icon == "TagFilled" ? "#6E6E6E" : null,
          width: icon == "TagFilled" ? 14 : null,
        }}
        ref={anchorRef}
        onClick={(e) => handleToggle(e)}
      />
      <div onClick={(e) => e.stopPropagation()}>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                {isTagExist && (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#ff6f00",
                      fontStyle: "bold",
                      padding: 2,
                    }}
                  >
                    Tag already exist
                  </p>
                )}
                <ClickAwayListener onClickAway={handleClose}>
                  <div style={{ "max-width": "350px", zIndex: 1500 }}>
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
                              optionTags.push({
                                title: tag.inputValue.toLowerCase(),
                              });
                              setOrgTagState(optionTags);
                            }
                            return tag.inputValue.toLowerCase();
                          } else if (tag && tag.title) return tag.title;
                        });
                        handleAddTag(
                          newTags,
                          id,
                          handleTagUpdates,
                          newTag ? newTag : false
                        );
                        setTagState(newTags);
                        return;
                      }}
                      filterOptions={(options, params) => {
                        let filtered = filter(options, params);
                        let include = false;
                        filtered.map((tag) => {
                          if (
                            tag.title.toLowerCase() ===
                            params.inputValue.toLowerCase()
                          )
                            include = true;
                        });
                        if (!include)
                          orgTagState.map((tag) => {
                            if (
                              tag.title.toLowerCase() ===
                              params.inputValue.toLowerCase()
                            )
                              include = true;
                          });
                        let includesInMeeting = false;
                        tagState.map((defaultTag) => {
                          let tag = defaultTag.title
                            ? defaultTag.title
                            : defaultTag;
                          if (
                            tag.toLowerCase() ===
                            params.inputValue.toLowerCase()
                          )
                            includesInMeeting = true;
                          filtered = filtered.filter((tags) => {
                            if (defaultTag.title)
                              return (
                                tags.title.toLowerCase() !=
                                defaultTag.title.toLowerCase()
                              );
                            else
                              return (
                                tags.title.toLowerCase() !=
                                defaultTag.toLowerCase()
                              );
                          });
                        });
                        if (includesInMeeting) setTagExist(true);
                        else setTagExist(false);
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
                          variant="outlined"
                          label="Tags"
                          placeholder="Add Tags"
                        />
                      )}
                    />
                  </div>
                </ClickAwayListener>
                {isTagExist && (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#ff6f00",
                      padding: 5,
                    }}
                  >
                    Tag already exist
                  </p>
                )}
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
};

export default Tags;

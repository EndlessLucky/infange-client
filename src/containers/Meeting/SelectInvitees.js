import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function MultipleSelect({ names, handleInvitees, styles }) {
  return (
    <div>
      <Autocomplete
        disableCloseOnSelect
        multiple
        id="tags-standard"
        options={names}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="Add Invitees"
            style={styles || { width: "500px" }}
          />
        )}
        onChange={(event, newValue) => {
          handleInvitees(newValue);
        }}
      />
    </div>
  );
}

import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const ShareNotes = ({ users, sharedTo, sharedUsers }) => {
  const selectedUsers = (a) => {
    let selectedUsers = [];
    a.map((selected) => {
      selectedUsers.push(selected.value);
    });
    sharedTo(selectedUsers);
  };
  return (
    <Autocomplete
      multiple
      id="combo-box-demo"
      options={users}
      getOptionLabel={(option) => option.label}
      style={{ width: 300, marginTop: 30, marginBottom: 30 }}
      renderInput={(params) => (
        <TextField {...params} label="Share with" variant="outlined" />
      )}
      onChange={(event, newValue) => selectedUsers(newValue)}
    />
  );
};

export default ShareNotes;

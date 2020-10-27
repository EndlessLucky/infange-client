import React from "react";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ViewTable from "@material-ui/icons/GridOn";
import ViewStream from "@material-ui/icons/ViewStream";

export default ({ onChange, view }) => (
  <ToggleButtonGroup
    style={{ height: 32 }}
    display="flex"
    justify-content="flex-end"
    size="small"
    value={view}
    exclusive
    onChange={(e, v) => (v ? onChange(e, v) : null)}
  >
    <ToggleButton value="table">
      <ViewTable />
    </ToggleButton>
    <ToggleButton value="card">
      <ViewStream />
    </ToggleButton>
  </ToggleButtonGroup>
);

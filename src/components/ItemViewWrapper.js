import { makeStyles } from "@material-ui/core/styles";
import CardTableToggle from "./controls/CardTableToggle";
import IconButton from "@material-ui/core/IconButton";
import FilterIcon from "@material-ui/icons/FilterList";
import Grid from "@material-ui/core/Grid";
import React from "react";
import CheckBox from "@material-ui/core/Checkbox";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
  buttonview: {
    display: "flex",
    justifyContent: "space-between"
  },
  root: {},
  drawer: {
    zIndex: 5
  },
  content: {
    padding: "150px 24px 0 24px"
  },
  drawerPaper: {
    width: drawerWidth,
    zIndex: 5
  }
}));

export const FilterItem = ({ checked, onChange, label }) => (
  <FormControlLabel
    control={<CheckBox checked={checked} onChange={onChange} value={label} />}
    label={label}
  />
);

const ItemViewWrapper = ({
  onToggleView,
  view = "card",
  FilterComponent,
  open,
  locked,
  onCloseFilter,
  onOpenFilter,
  children
}) => {
  const classes = useStyles();

  if (view !== "card" && view !== "table") {
    throw new Error(`the view '${view}' does not exist`);
  }

  return (
    <div className={classes.root}>
      {FilterComponent && (
        <Drawer
          open={open || locked}
          elevation={0}
          anchor={"left"}
          variant={locked ? "permanent" : "temporary"}
          onClose={onCloseFilter}
          className={classes.drawer}
          classes={{ paper: classes.drawerPaper }}
        >
          <div className={classes.content}>
            <Typography
              variant="h5"
              style={{
                lineHeight: "30px",
                height: 30,
                verticalAlign: "bottom"
              }}
            >
              Filters <FilterIcon />
            </Typography>
            {FilterComponent}
          </div>
        </Drawer>
      )}
      <div className={classes.buttonview}>
        {FilterComponent ? (
          <IconButton onClick={onOpenFilter}>
            <FilterIcon />
          </IconButton>
        ) : (
          <div />
        )}

        <CardTableToggle
          onChange={(e, v) => {
            onToggleView(v);
          }}
          view={view}
        />
      </div>
      <Grid container spacing={25}>
        {children}
      </Grid>
    </div>
  );
};

export default ItemViewWrapper;

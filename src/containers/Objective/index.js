import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import Table from "react-table-component";
import { useOrganizations } from "../../context/OrganizationProvider";
import IconButton from "@material-ui/core/IconButton";
import OpenIcon from "@material-ui/icons/Launch";
import { makeStyles } from "@material-ui/core/styles";
import { history } from "../../store";
import CardTableToggle from "../../components/controls/CardTableToggle";
import CardView from "./CardView";
import FilterIcon from "@material-ui/icons/FilterList";
import FilterOptions from "./FilterObjectives";
import { useAccount } from "../../context/AccountProvider";
import Grid from "@material-ui/core/Grid";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import {
  updateObjTags,
  getObjectives,
  editObjective,
} from "../../actions/objective";
import MeetingsObjectivesSideBar from "../../components/MeetingsObjectivesSideBar";
import EditObjective from "./Edit";

const drawerWidth = 300;
const useStyles = makeStyles((theme) => ({
  description: {
    maxWidth: 200,
    display: "inline-block",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  view: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(3),
  },
  root: {
    [theme.breakpoints.up("md")]: {
      padding: `0 ${theme.spacing(4)}px`,
    },
    padding: `0 ${theme.spacing(1)}px`,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    paddingLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    // marginLeft: drawerWidth
  },
}));

const styles = {
  table: {
    marginLeft: "50px",
    marginRight: "50px",
  },
};

function dateCell(d) {
  return d ? moment(d).format("MM/DD/YYYY H:mm:ss A") : "";
}

const handleEditClick = (id) => () => {
  history.push(`/Objectives/Edit/${id}`);
};

function getHeaders(classes, url) {
  return [
    { key: "organization", title: "Organization", sortable: true },
    {
      key: "description",
      title: "Description",
      sortable: true,
      cell: (d) => <span className={classes.description}>{d}</span>,
    },
    { key: "status", title: "Status", sortable: true },
    { key: "createDate", title: "Create Date", sortable: true, cell: dateCell },
    { key: "dueDate", title: "Due Date", sortable: true, cell: dateCell },
    {
      key: "completedDate",
      title: "Completed Date",
      sortable: true,
      cell: dateCell,
    },
    {
      key: "_id",
      title: "",
      sortable: false,
      props: {
        style: { width: "1%", padding: "0 10px 0 0" },
      },
      cell: (id) => (
        <IconButton onClick={handleEditClick(id)}>
          <OpenIcon />
        </IconButton>
      ),
    },
  ];
}

const ObjTable = ({ data, tableHead }) => (
  <Table tableHead={tableHead} style={{ overflowX: "auto" }} data={data} />
);

function applyFilter(a, o, f, n) {
  let objectives = [...o];
  // if (f.myObjectives) {
  objectives = objectives.filter((x) =>
    Boolean(a.find((y) => y._id === x.assigneeID || y._id === x.assignedBy))
  );
  // }
  objectives = objectives.filter(
    (x) =>
      ((f.completed && x.status === "Completed") ||
        (f.inProgress &&
          (x.status === "InProgress" || x.status === "Pending")) ||
        (f.linked && n.list.find((n) => n.objectiveID == x._id))) &&
      (f.tagState.length === 0 ||
        f.tagState.every((tag) => x.tags.includes(tag)))
  );

  return objectives;
}

const Objectives = ({
  defaultView = "card",
  objectives,
  users,
  getObjectives,
  editObjective,
  location,
  notes,
}) => {
  const [view, setView] = useState(defaultView);
  const classes = useStyles();
  const [filters, setFilters] = useState({});
  const [objState, setObjState] = useState(objectives);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [account] = useAccount();
  const [filtered, setFiltered] = useState(objectives);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    if (location.state && location.state.selectedObj) {
      const s = objectives.find((obj) => obj._id == location.state.selectedObj);
      if (selectedObjective != s) setSelectedObjective(s);
    }
  }, [location.state]);

  useEffect(() => {
    let objs;
    if (objectives != objState) objs = objectives;
    else
      objs =
        filtered.length > 0 && filters.tagState && filters.tagState.length > 0
          ? filtered
          : objState.length > 0
          ? objState
          : objectives;
    const data = objs.map((x) => ({
      ...x,
      organization: organizations.data
        ? organizations.data.find((y) => y.id === x.organizationID).name
        : "",
    }));
    if (account.data) {
      setFiltered(applyFilter(account.data, data, filters, notes));
    }
  }, [filters, objectives, account.data]);
  let [organizations, getOrganizations] = useOrganizations();
  const [orgState, setOrgState] = useState(organizations);

  useEffect(() => {
    if (organizations != orgState) setOrgState(organizations);
  }, [organizations]);

  useEffect(() => {
    if (selectedObjective) {
      const selectedObj = objectives.find(
        (obj) => obj._id == selectedObjective._id
      );
      if (selectedObj != selectedObjective) setSelectedObjective(selectedObj);
    }
  }, [objectives]);

  const handleTagUpdate = async (tags, objID, newTag = false) => {
    await updateObjTags(tags, objID, newTag ? newTag : false).then(
      async (response) => {
        const index = filtered.findIndex((x) => x._id == response.data._id);
        let newFiltered = filtered;
        newFiltered[index] = response.data;
        setObjState(newFiltered);
        getObjectives();
        if (account.data)
          setFiltered(applyFilter(account.data, newFiltered, filters));
        if (newTag) {
          organizations = await getOrganizations();
          setOrgState(organizations);
        }
      }
    );
    return;
  };

  let onObjectiveSelect = (obj) => {
    setSelectedObjective(obj);
  };
  return (
    <div style={{ display: "flex", flexWrap: "no-wrap", width: "100%" }}>
      <div
        /*className={classes.root}*/ style={{ height: "100%", width: "100%" }}
      >
        <Grid
          container
          spacing={24}
          style={{ display: "flex", flexWrap: "nowrap" }}
        >
          <div style={{ display: "flex" }}>
            <MeetingsObjectivesSideBar
              objectives={filtered}
              selectedObj={selectedObjective}
              onSelect={(obj) => onObjectiveSelect(obj)}
              editObjective={editObjective}
              organizations={organizations}
              onFilterChange={setFilters}
            />
          </div>

          <div style={{ width: "100%" }}>
            {selectedObjective && (
              <EditObjective
                objective={selectedObjective}
                editObjective={editObjective}
                handleTagUpdates={(tags, objID, newTag) =>
                  handleTagUpdate(tags, objID, newTag ? newTag : false)
                }
              />
            )}
            {!selectedObjective && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  fontWeight: "bold",
                  color: "rgb(113, 105, 163)",
                }}
              >
                You have no objectives scheduled for this week
              </div>
            )}
          </div>
        </Grid>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    objectives: state.objectives.list,
    users: state.users,
    notes: state.notes,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getObjectives: (id) => dispatch(getObjectives(id)),
  editObjective: (obj) => dispatch(editObjective(obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Objectives);

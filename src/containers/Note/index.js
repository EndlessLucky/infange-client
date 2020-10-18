import React, { PureComponent, useState, useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { deleteNote, editNote, updateNoteTags } from "../../actions/note";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import { history } from "../../store";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";
import { OrganizationHOC } from "../../context/OrganizationProvider";
import { useOrganizations } from "../../context/OrganizationProvider";
import { AccountHOC } from "../../context/AccountProvider";
import TrashIcon from "@material-ui/icons/Delete";
import moment from "moment";
import Tags from "../../components/tag";
import FilterIcon from "@material-ui/icons/FilterList";
import FilterOptions from "./FilterNotes";
import Chip from "@material-ui/core/Chip";

const styles = {
  table: {
    marginLeft: "50px",
    marginRight: "50px",
  },
};

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 460,
    margin: theme.spacing(1),
    flex: "1 1 100%",
  },
  item: {
    lineHeight: "24px",
    verticalAlign: "top",
    marginLeft: theme.spacing(1),
    width: 200,
  },
  grid: {
    margin: "0 auto",
    maxWidth: "85vw",
    marginLeft: "70px",
  },
  cardDetail: {
    minWidth: 195,
  },
  pastDue: {
    color: "#d44",
  },
  almostDue: {
    color: "#da2",
  },
  gridSpacing: {
    marginLeft: theme.spacing(2),
    textOverflow: "ellipsis",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  view: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: "65px",
    marginBottom: theme.spacing(3),
  },
  root: {
    [theme.breakpoints.up("md")]: {
      padding: `0 ${theme.spacing(4)}px`,
    },
    padding: `0 ${theme.spacing(1)}px`,
    "overflow-x": "hidden",
  },
  img: {
    "& img": {
      "max-width": "70%",
    },
  },
}));

const GridItem = ({ className, ...props }) => {
  const classes = useStyles();
  return <Grid className={clsx(classes.gridSpacing, className)} {...props} />;
};

const handleEditClick = (_id) => () => {
  history.push(`/Notes/Edit/${_id}`);
};

const NoteView = ({
  title,
  text,
  id,
  notes,
  key,
  ownerID,
  organizationID,
  users,
  time,
  remove,
  tags,
  orgTags,
  handleTagUpdate,
}) => {
  const classes = useStyles();
  const [organizations] = useOrganizations();
  const [tagItems, setTagItems] = useState([]);
  const getTags = (a) => {
    setTagItems(a);
  };

  const onTrash = (event) => {
    event.stopPropagation();
    remove();
  };

  const getRandomColor = () => {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  return (
    <Card className={classes.card} onClick={handleEditClick(id)}>
      <CardHeader
        subheader={
          <Grid>
            <GridItem>
              <Typography color="Grey" variant="body2" component="p">
                {time}
              </Typography>
              <CardContent>
                <Typography color="secondary" variant="body2" component="p">
                  {title}
                </Typography>
                <Typography color="secondary" variant="body2" component="p">
                  <div
                    className={classes.img}
                    dangerouslySetInnerHTML={{ __html: text }}
                  ></div>
                </Typography>
              </CardContent>
            </GridItem>
          </Grid>
        }
        action={
          <div style={{ "text-align": "center" }}>
            <IconButton
              style={{ position: "inherit" }}
              onClick={onTrash}
              className={clsx(classes.expand)}
              aria-label="delete"
            >
              <TrashIcon />
            </IconButton>
          </div>
        }
      />
      {tagItems && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: 20,
            paddingTop: 0,
          }}
        >
          <div style={{ display: "flex", marginRight: 10, marginTop: 7 }}>
            {orgTags && (
              <div style={{ zIndex: 1 }}>
                {" "}
                <Tags
                  id={id}
                  tags={tags}
                  orgTags={orgTags}
                  handleTagUpdates={handleTagUpdate}
                  getTags={getTags}
                />
              </div>
            )}
          </div>
          {tagItems.map((t) => {
            return (
              <div>
                <Chip
                  label={t.title ? t.title : t}
                  backgroundColor={"#FFFFFF"}
                  // style={{ backgroundColor: getRandomColor() }}
                />
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

function applyFilter(notes, f) {
  let updatedNotes = [...notes];
  updatedNotes = updatedNotes.filter(
    (x) =>
      f.tagState.length === 0 || f.tagState.every((tag) => x.tags.includes(tag))
  );
  return updatedNotes;
}

const Notes = ({ notes, organizations, account, remove }) => {
  const classes = useStyles();
  const [orgs, setOrgs] = useState(organizations);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ tagState: [] });
  const [filtered, setFiltered] = useState(notes);
  const [notesState, setNotesState] = useState(notes);
  console.log(
    "orgsssss",
    orgs,
    filtered,
    filters.tagState,
    filtered.length > 0 && filters.tagState && filters.tagState.length > 0
  );
  useEffect(() => {
    let latestNotes =
      filtered.length > 0 && filters.tagState && filters.tagState.length > 0
        ? filtered
        : notesState.length > 0
        ? notesState
        : notes;
    setOrgs(organizations);
    if (notes && notes.length > 0)
      setFiltered(applyFilter(latestNotes, filters));
  }, [filters, notes, organizations]);
  let orgTags;
  if (orgs[0] && orgs[0].tags)
    orgTags = orgs[0].tags.map((tag) => {
      return { title: tag };
    });
  const cards = filtered.map((x) => {
    const tags = x.tags.map((tag) => {
      return { title: tag };
    });

    const handleTagUpdate = async (tags, noteID, newTag = false) => {
      await updateNoteTags(tags, noteID, newTag ? newTag : false).then(
        (response) => {
          const index = filtered.findIndex((x) => x._id == response.data._id);
          let newFiltered = filtered;
          newFiltered[index] = response.data;
          setNotesState(newFiltered);
          setFiltered(applyFilter(newFiltered, filters));
        }
      );
      return;
    };

    return (
      <NoteView
        key={x._id}
        id={x._id}
        ownerID={x.ownerID}
        account={x.account}
        text={x.text}
        title={x.title}
        time={moment.utc(x.createDate).local().format("MM/DD/YYYY hh:mm a")}
        users={x.users}
        organizationID={x.organizationID}
        remove={() => remove(x)}
        tags={tags}
        orgTags={orgTags}
        handleTagUpdate={(tags, noteID, newTag) =>
          handleTagUpdate(tags, noteID, newTag ? newTag : false)
        }
      />
    );
  });

  return (
    <div className={classes.root}>
      <div className={classes.view}>
        <div style={{ marginLeft: 35 }}>
          <IconButton onClick={() => setFilterOpen(!filterOpen)}>
            <FilterIcon />
          </IconButton>
        </div>
      </div>
      <Grid container spacing={10} className={classes.grid}>
        {orgs && orgs.length > 0 && (
          <FilterOptions
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            onFilterChange={setFilters}
            locked={false}
            organizations={orgs}
          />
        )}
        {cards}
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { notes: state.notes.list, users: state.users };
};

const mapDispatchToProps = (dispatch) => ({
  remove: (note) => dispatch(deleteNote(note)),
  update: (note) => dispatch(editNote(note)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(OrganizationHOC(AccountHOC(Notes))));

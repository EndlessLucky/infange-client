import React, { useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import { UserAvatar } from "../Avatar";
import { useDispatch } from "react-redux";
import BusinessIcon from "@material-ui/icons/Business";
import { history } from "../../store";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import TrashIcon from "@material-ui/icons/Delete";
import { useOrganizations } from "../../context/OrganizationProvider";
import getIconForStatus from "../../helpers/getIconForStatus";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import Tags from "../../components/tag";
import { OrganizationHOC } from "../../context/OrganizationProvider";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 275,
    margin: theme.spacing(1),
    flex: "1 1 100%",
  },
  item: {
    lineHeight: "24px",
    verticalAlign: "top",
    marginLeft: theme.spacing(1),
    width: 200,
  },
  root: {
    margin: "0 auto",
    maxWidth: 1100,
  },
  cardDetail: {
    minWidth: 195,
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
}));

const GridItem = ({ className, ...props }) => {
  const classes = useStyles();
  return <Grid className={clsx(classes.gridSpacing, className)} {...props} />;
};

const ObjCard = ({
  id,
  title,
  dueDate,

  status,
  assigneeID,
  organizationID,
  description,
  meetingID,
  onDelete,
  insideMeeting,
  handleTagUpdates,
  tags,
  orgTags,
  canEdit,
}) => {
  const classes = useStyles();
  const [organizations] = useOrganizations();
  const [pending, setPending] = React.useState(false);
  const [tagItems, setTagItems] = useState(orgTags);

  const globalDispatch = useDispatch();
  const organization =
    organizations.data &&
    organizations.data.find((x) => x.id === organizationID);
  let due = moment(dueDate).diff(moment(), "days");
  let dueClass = "";
  if (due < 0 && status !== "Completed") {
    dueClass = classes.pastDue;
  } else if (due < 2 && status !== "Completed") {
    dueClass = classes.almostDue;
  }
  const Icon = getIconForStatus(status);
  const getTags = (a) => {
    setTagItems(a);
  };
  const getRandomColor = () => {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleEditClick = (id) => () => {
    if (canEdit) history.push(`/Objectives/Edit/${id}`);
  };
  return (
    <Grid spacing={6} style={{ flex: "1 50%" }}>
      <Card className={classes.card} onClick={handleEditClick(id)}>
        <CardHeader
          title={title}
          subheader={
            <Grid>
              <GridItem className={classes.cardDetail}>
                <br></br>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <BusinessIcon />
                    <span className={classes.item}>
                      {organization && organization.name}
                    </span>
                  </div>
                  <div style={{ "text-align": "center" }}>
                    <Icon />
                    <Typography variant="body2" component="p">
                      {status}
                    </Typography>
                  </div>
                </div>
              </GridItem>

              <GridItem className={classes.cardDetail}>
                <AccessTimeIcon className={dueClass} />
                <span className={clsx(classes.item, dueClass)}>
                  {moment(dueDate).format("MM/DD/YYYY h:mm:ss A")}
                </span>
              </GridItem>
            </Grid>
          }
          avatar={
            <div onClick={(event) => event.stopPropagation()}>
              <UserAvatar userID={assigneeID} organizationID={organizationID} />
            </div>
          }
          action={<div style={{ "text-align": "center" }}></div>}
        />

        <CardContent>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Typography variant="body2" component="p" multiline>
                {description.length > 50
                  ? `${description.substring(0, 50)} ...`
                  : description}
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            ></div>
          </div>

          {tagItems && (
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: 10 }}>
              <div style={{ zIndex: 1, marginTop: 7, marginRight: 10 }}>
                <Tags
                  id={id}
                  tags={tags}
                  orgTags={orgTags}
                  handleTagUpdates={handleTagUpdates}
                  getTags={getTags}
                />
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
        </CardContent>
      </Card>
    </Grid>
  );
};

const CardGrid = ({
  objectives,
  insideMeeting,
  handleTagUpdates,
  organizations,
  users,
  canEdit,
}) => {
  const classes = useStyles();
  let orgTags = [];
  if (organizations[0])
    orgTags = organizations[0].tags.map((orgTag) => {
      return { title: orgTag };
    });
  const cards = objectives.map((x) => {
    const tags = x.tags.map((tag) => {
      return { title: tag };
    });
    return (
      <ObjCard
        title={x.title}
        id={x._id}
        key={x._id}
        description={x.description}
        dueDate={x.dueDate}
        status={x.status}
        organizationID={x.organizationID}
        assigneeID={x.assigneeID}
        meetingID={x.meetings[0]}
        insideMeeting={insideMeeting}
        handleTagUpdates={handleTagUpdates}
        tags={tags}
        orgTags={orgTags}
        canEdit={canEdit}
      />
    );
  });
  return (
    <Grid container spacing={10} className={classes.root}>
      {cards}
    </Grid>
  );
};

const Objectives = ({
  objectives,
  insideMeeting,
  organizations,
  handleTagUpdates,
  users,
  status,
}) => {
  return (
    <CardGrid
      objectives={objectives}
      insideMeeting={insideMeeting}
      organizations={organizations}
      handleTagUpdates={handleTagUpdates}
      users={users}
      canEdit={status != "Ended"}
    />
  );
};

const Wrapper = OrganizationHOC(Objectives);

const mapStateToProps = (state) => {
  return {
    users: state.users.byID,
  };
};

export default connect(mapStateToProps)(Wrapper);

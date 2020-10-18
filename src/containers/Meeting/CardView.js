import React, { useState, PureComponent, useReducer, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import { UserAvatar } from "../Avatar";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import OpenIcon from "@material-ui/icons/Launch";
import IconButton from "@material-ui/core/IconButton";
import BusinessIcon from "@material-ui/icons/Business";
import { history } from "../../store";
import clsx from "clsx";
import { AccountHOC } from "../../context/AccountProvider";
import Grid from "@material-ui/core/Grid";
import { OrganizationHOC } from "../../context/OrganizationProvider";
import { useOrganizations } from "../../context/OrganizationProvider";
import getIconForStatus from "../../helpers/getIconForStatus";
import Tags from "../../components/tag";
import Chip from "@material-ui/core/Chip";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";

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
  root: {
    margin: "0 auto",
    maxWidth: 1100,
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
}));

const GridItem = ({ className, ...props }) => {
  const classes = useStyles();
  return <Grid className={clsx(classes.gridSpacing, className)} {...props} />;
};

const handleEditClick = (id) => () => {
  history.push(`/Meetings/${id}`);
};

const MeetingCard = ({
  id,
  title,
  status,
  location,
  startDate,
  organizationID,
  endDate,
  ownerID,
  invitees,
  userId,
  inviteesObj,
  handleTagUpdates,
  tags,
  orgTags,
}) => {
  const classes = useStyles();
  const [tagItems, setTagItems] = useState(orgTags);
  const [organizations] = useOrganizations();
  let due = moment(startDate).diff(moment(), "days");
  const organization =
    organizations.data &&
    organizations.data.find((x) => x.id === organizationID);
  let dueClass = "";
  if (due < 0 && status !== "Ended") {
    dueClass = classes.pastDue;
  } else if (due < 2 && status !== "Ended") {
    dueClass = classes.almostDue;
  }
  const Icon = getIconForStatus(status);

  const isOwner = ownerID === userId;
  const isInvitee =
    inviteesObj && !!inviteesObj.find((invitee) => invitee.userID === userId);
  const isMember = isOwner || isInvitee;

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
  return (
    <Card
      className={classes.card}
      onClick={isMember ? handleEditClick(id) : null}
      style={{ cursor: isMember ? "pointer" : "initial" }}
    >
      <CardHeader
        // title={title}
        subheader={
          <Grid>
            <GridItem className={classes.cardDetail}>
              <br></br>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                {moment(startDate).format("MM/DD/YYYY h:mm:ss A")}
              </span>
            </GridItem>
          </Grid>
        }
        avatar={
          <div onClick={(event) => event.stopPropagation()}>
            <UserAvatar userID={ownerID} organizationID={organizationID} />
          </div>
        }
      />
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Typography variant="body2" component="p">
              Title : {title}
            </Typography>
            <Typography variant="body2" component="p">
              Location : {location}
            </Typography>
          </div>
        </div>
        {tagItems && (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <div style={{ marginTop: 7, marginRight: 10 }}>
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
      <CardActions></CardActions>
    </Card>
  );
};

const Meetings = ({ meetings, organizations, account, handleTagUpdates }) => {
  const classes = useStyles();
  let orgTags = [];
  if (organizations[0])
    orgTags = organizations[0].tags.map((orgTag) => {
      return { title: orgTag };
    });
  const cards = meetings.map((x) => {
    const tags = x.tags.map((tag) => {
      return { title: tag };
    });
    return (
      <MeetingCard
        title={x.title}
        key={x._id}
        id={x._id}
        organizationID={x.organizationID}
        location={x.location}
        status={x.status}
        startDate={x.startDate}
        invitees={x.invitees}
        inviteesObj={x.inviteesObj}
        endDate={x.endDate}
        ownerID={x.ownerID}
        account={x.account}
        userId={account[0]._id}
        handleTagUpdates={handleTagUpdates}
        tags={tags}
        orgTags={orgTags}
      />
    );
  });

  return (
    <Grid container spacing={10} className={classes.root}>
      {cards}
    </Grid>
  );
};

const Wrapper = OrganizationHOC(AccountHOC(Meetings));

export default Wrapper;

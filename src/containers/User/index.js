import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { IconButton } from "../../components/controls/Button";
import { Delete, Edit } from "@material-ui/icons";
import { deleteUser } from "../../actions/user";
import { withStyles } from "@material-ui/core/styles";
import { ListItem } from "../../components/controls/List";

const styles = (theme) => ({
  add: {
    position: "fixed",
    bottom: 20,
    right: 20,
  },
  listItemBlock: {
    display: "inline-block",
    marginRight: 20,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    fontSize: "1rem",
  },
  icon: {
    whiteSpace: "pre",
  },
  listItem1: {
    width: "20%",
    minWidth: 100,
  },
  listItem2: {
    width: "100%",
  },
});

const User = withStyles(styles)(
  ({ firstName, lastName, _id, onEditClick, onDeleteClick, classes }) => (
    <ListItem>
      <span className={[classes.listItemBlock, classes.listItem1]}>
        {firstName}
      </span>
      <span className={[classes.listItemBlock, classes.listItem2]}>
        {lastName}
      </span>
      <div className={classes.icon}>
        <IconButton onClick={onEditClick}>
          {" "}
          <Edit />{" "}
        </IconButton>
        <IconButton onClick={onDeleteClick}>
          {" "}
          <Delete />{" "}
        </IconButton>
      </div>
    </ListItem>
  )
);

class Users extends PureComponent {
  handleEditClick = (id) => () => {
    const {
      history,
      match: { url },
    } = this.props;
    history.push(`${url}/Edit/${id}`);
  };

  handleDeleteClick = (user) => () => {
    this.props.remove(user);
  };

  handleNewUser = () => {
    const {
      history,
      match: { url },
    } = this.props;
    history.push(`${url}/Add`);
  };

  render() {
    const users = this.props.allIDs
      .map((x) => this.props.byID[x])
      .map((x) => (
        <User
          key={x._id}
          {...x}
          onEditClick={this.handleEditClick(x._id)}
          onDeleteClick={this.handleDeleteClick(x)}
        />
      ));
    return (
      <div style={{ marginLeft: "20px", marginRight: "20px" }}>{users}</div>
    );
  }
}

const mapStateToProps = (state) => {
  return state.users;
};

const mapDispatchToProps = (dispatch) => ({
  remove: (user) => dispatch(deleteUser(user)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Users));

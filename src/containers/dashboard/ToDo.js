import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import moment from "moment";
import corkImg from "../../../src/cork.svg";
import ErrorIcon from "@material-ui/icons/Error";
import "../../common.css";
import CheckboxComponent from "@material-ui/core/Checkbox";
import { history } from "../../store";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import axios from "axios";
// const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  todo: {
    marginTop: 10,
    cursor: "pointer",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#e3e5e6",
    padding: "18px",
    marginBottom: "10px",
    borderRadius: "5px",
    position: "relative",
  },
  pastDue: {
    border: "1px solid red",
  },
}));

const ToDoItem = ({ onCheck, checked, id, text, dueDate }) => {
  const classes = useStyles();
  const history = useHistory();

  const isPastDue = moment(dueDate).startOf("day") < moment().startOf("day");

  return (
    <div style={{ position: "relative" }}>
      {isPastDue && (
        <div style={{ height: "0px" }}>
          <ErrorIcon
            style={{
              position: "absolute",
              top: "-13px",
              left: "-13px",
              color: "red",
              zIndex: 10,
            }}
          />
        </div>
      )}
      <div
        className={clsx("todo", classes.todo, isPastDue ? classes.pastDue : "")}
        onClick={(e) =>
          history.push({
            pathname: "/objectives",
            search: "",
            state: { selectedObj: id },
          })
        }
      >
        <CheckboxComponent
          id={id}
          style={{ marginRight: "1px" }}
          icon={
            <span
              style={{
                borderRadius: 3,
                width: 19,
                height: 19,
                backgroundColor: "white",
              }}
            />
          }
          onClick={(e) => e.stopPropagation()}
          color="primary"
          inputProps={{ "aria-label": "secondary checkbox" }}
          checked={checked}
          onChange={(e) => onCheck(id, e.target.checked)}
        />
        <p
          style={{
            margin: 0,
            flex: "1 1 auto",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </p>
        <span style={{ fontSize: "10px", flex: "0 0 auto" }}>
          Due {moment(dueDate).startOf().fromNow()}
        </span>
      </div>
    </div>
  );
};

class ToDo extends React.Component {
  state = {
    pageNo: 0,
    toDoData: null,
    isChecked: [],
  };
  componentDidMount = () => {
    this.getToDos(0);
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.objectives != this.props.objectives) this.getToDos(0);
  };

  getToDos = async (pageNumber) => {
    try {
      const response = await axios.get(
        `/api/objectives?todo=true&pageNo=${pageNumber}`
      );
      // console.log("res", response.data);
      // upcomingMeetingsData = response.data
      this.setState({
        toDoData: response.data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  handleCheck = async (id, e) => {
    try {
      let checked = [];
      checked[id] = true;
      this.setState({ isChecked: checked });
      const response = await axios.patch(
        `/api/objectives/${id}?todo=true&pageNo=0`,
        {
          status: "Completed",
        }
      );
      if (response.status === 200)
        this.setState({
          toDoData: response.data,
          isChecked: [],
        });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    // console.log("toDoData", this.state.toDoData);
    return (
      <div>
        <h1 style={{ textAlign: "left" }}>To Do</h1>
        <div style={{ marginTop: 40 }}>
          {this.state.toDoData &&
            this.state.toDoData.map((todo) => {
              return (
                <ToDoItem
                  id={todo._id}
                  checked={this.state.isChecked[todo._id]}
                  dueDate={todo.dueDate}
                  onCheck={this.handleCheck}
                  text={todo.description}
                />
              );
            })}
          {this.state.toDoData && this.state.toDoData.length <= 0 && (
            <div
              style={{
                backgroundColor: "#e3e5e6",
                padding: 20,
                textAlign: "center",
                width: "fit-content",
              }}
            >
              <img src={corkImg} width="40px" />
              <p style={{ fontWeight: "bolder" }}>Congratulations!</p>
              <p style={{ fontWeight: "bolder" }}>
                You've completed all your tasks for today
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    objectives: state.objectives.list,
  };
};

export default connect(mapStateToProps)(ToDo);

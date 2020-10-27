import React, { Component } from "react";
import moment from "moment";

class Time extends Component {
  state = {
    time: moment(),
  };

  startClock() {
    this.interval = setInterval(() => {
      this.setState({ time: moment() });
    }, 60 * 1000);
  }

  render() {
    return (
      <span {...this.props} style={{ color: "#525557", fontWeight: 545 }}>
        {this.state.time.format("h:mm A")}
      </span>
    );
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.setState({ time: moment() });
      this.startClock();
    }, (60 - moment().seconds()) * 1000);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}

class Date extends Component {
  state = {
    date: moment(),
  };

  render() {
    return (
      <span {...this.props} style={{ color: "#898b8c" }}>
        {this.state.date.format("dddd, MMMM DD")}
      </span>
    );
  }
}

export { Date, Time };

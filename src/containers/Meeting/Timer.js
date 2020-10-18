import React from "react";
import Timer from "react-compound-timer";

class MeetingTimer extends React.Component {
  state = {
    initialTime: this.props.initial,
    hours: this.props.initial > 3600000,
  };

  componentWillUpdate = (prevProps) => {
    if (
      this.state.initialTime != null &&
      prevProps.initial != this.state.initialTime
    )
      this.setState({ initialTime: null });
  };

  componentDidUpdate = () => {
    if (this.state.initialTime == null) {
      this.setState({ initialTime: this.props.initial });
      this.setState({ hours: this.props.initial >= 3600000 });
    }
  };

  render() {
    return (
      <div>
        {this.props.initial === 0
          ? "00:00"
          : this.state.initialTime && (
              <Timer
                initialTime={this.state.initialTime}
                startImmediately={this.props.startImmediately}
                checkpoints={[
                  {
                    time: 3600000,
                    callback: () => this.setState({ hours: true }),
                  },
                ]}
              >
                {({ stop = true }) => (
                  <React.Fragment>
                    <div style={{ display: "flex" }}>
                      {(this.state.hours || !this.props.startImmediately) && (
                        <div>
                          <Timer.Hours /> :{" "}
                        </div>
                      )}
                      <Timer.Minutes />
                      {(!this.state.hours || !this.props.startImmediately) && (
                        <div>
                          {" "}
                          : <Timer.Seconds />{" "}
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                )}
              </Timer>
            )}
      </div>
    );
  }
}

export default MeetingTimer;

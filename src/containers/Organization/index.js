import React, { Component } from "react";
import { connect } from "react-redux";
import { getOrganization } from "../../actions/organization";
import { Link } from "react-router-dom";

export const Organization = ({ name, ...props }) => <div>{name}</div>;

class Organizations extends Component {
  state = {
    txt: "",
  };

  handleTxtChange = (e) => {
    this.setState({ txt: e.target.value });
  };

  render() {
    const { organizations } = this.props;
    return (
      <div>
        {organizations
          ? organizations.allIDs.map((x) => (
              <div key={x}>
                <Link to={`/${x}`}>{organizations.byID[x].name}</Link>
              </div>
            ))
          : null}
      </div>
    );
  }

  componentDidMount() {
    this.props.getOrganizations();
  }
}

const mapDispatchToProps = (dispatch) => ({
  getOrganizations: () => dispatch(getOrganization()),
});

function mapStateToProps(state) {
  return { organizations: state.organizations };
}

export default connect(mapStateToProps, mapDispatchToProps)(Organizations);

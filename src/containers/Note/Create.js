import React, { Component } from "react";
import { connect } from "react-redux";
import NoteFields from "./Fields";
import { createNote } from "../../actions/note";
import { SaveButton } from "../../components/controls/Button";
import { history } from "../../store";
import { OrganizationHOC } from "../../context/OrganizationProvider";

class CreateNote extends Component {
  state = {
    text: "",
    loading: false,
    userList: [],
    update: false,
    title: "",
  };

  handleChange = (e) => {
    this.setState({ text: e });
  };
  handleTags = (a) => {
    this.setState({
      tags: a,
    });
  };

  newNoteFromState() {
    const s = this.state;
    return {
      text: s.text,
      title: this.state.title,
      tags: this.state.tags,
      folder: this.props.folderID || null,
    };
  }

  returnMain = () => {
    this.props.onComplete();
  };

  handleSave = async () => {
    try {
      this.setState({ loading: true, update: true });
      await this.props.create(this.newNoteFromState());
      this.setState({ update: false });
      this.returnMain();
    } catch (err) {
      this.setState({ loading: false });
    } finally {
      this.setState({ loading: false });
    }
  };

  getTitle = (a) => {
    this.setState({
      title: a,
    });
  };

  render() {
    const { loading } = this.state;
    return (
      <div style={{ minHeight: 400 }}>
        <NoteFields
          onChange={this.handleChange}
          {...this.state}
          orgTags={
            (this.props.organizations[0] &&
              this.props.organizations[0].tags &&
              this.props.organizations[0].tags.map((tag) => {
                return { title: tag };
              })) || [``]
          }
          getTitle={this.getTitle}
          handleTag={this.handleTags}
        >
          <SaveButton
            style={{ position: "absolute", right: 40 }}
            color="primary"
            onClick={this.handleSave}
            isLoading={loading}
          />
        </NoteFields>
      </div>
    );
  }

  componentDidMount() {
    this.setState({
      userList: Object.values(this.props.users.byID).map((x) => {
        return {
          label: `${x.firstName} ${x.lastName}`,
          value: x._id,
        };
      }),
    });
  }

  componentWillReceiveProps(p) {
    if (p.users && p.users.byID !== this.props.users.byID) {
      this.setState({
        userList: Object.values(p.users.byID).map((x) => {
          return {
            label: `${x.firstName} ${x.lastName}`,
            value: x._id,
          };
        }),
      });
    }
  }
}

const mapStateToProps = (state) => {
  return { users: state.users };
};

const mapDispatchToProps = (dispatch) => ({
  create: (note) => dispatch(createNote(note)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationHOC(CreateNote));

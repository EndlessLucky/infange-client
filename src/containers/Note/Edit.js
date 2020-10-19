import React, { PureComponent } from "react";
import { connect } from "react-redux";
import NoteFields from "./Fields";
import {
  editNote,
  getFolders as getFoldersApi,
  createFolder as createFolderApi,
} from "../../actions/note";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import EventIcon from "@material-ui/icons/Event";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import moment from "moment";
import "../../common.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  OrganizationHOC,
  getOrganizations,
} from "../../context/OrganizationProvider";
import { updateNoteTags } from "../../actions/note";
import Typography from "@material-ui/core/Typography";
import CardActionArea from "@material-ui/core/CardActionArea";
import ListIcon from "@material-ui/icons/List";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ExpandMoreSharpIcon from "@material-ui/icons/ExpandMoreSharp";
import ExpandLessSharpIcon from "@material-ui/icons/ExpandLessSharp";
import FolderIcon from "@material-ui/icons/Folder";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PinnedIconYellow from "../../push-pin-yellow.svg";
import FilterIcon from "@material-ui/icons/FilterList";
import HeightIcon from "@material-ui/icons/Height";
import { TextField, InputAdornment } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import AddNote from "./Create";
import ModalView from "../../components/controls/Modal";

const filter = createFilterOptions();

let note;
const day = new Date().getDay(),
  startDiff = new Date().getDate() - day,
  endDiff = new Date().getDate() + 6 - day;
class Edit extends PureComponent {
  state = {
    loading: false,
    pending: false,
    title: "",
    selectedNote: null,
    selectedNoteItem: null,
    openCalender: false,
    startDate: new Date(
      new Date(new Date().setDate(startDiff)).setHours(0, 0, 0, 0)
    ),
    endDate: new Date(
      new Date(new Date().setDate(endDiff)).setHours(23, 59, 59)
    ),
    orgs: this.props.organizations,
    type: "allNotes",
    pinExpand: true,
    folders: [],
    selectedCategory: "Pinned",
    newFolderOpen: false,
    isSorted: false,
    anchorRef: null,
    isNoteFilterOpen: false,
    noteFilterDate: null,
    dateRangeStart: null,
    dateRangeEnd: null,
    dateCreated: null,
    dateModified: null,
    orgTagState: [],
    tagState: [],
    isCreateNoteOpen: false,
    edittedNote: null,
  };

  componentWillMount = async () => {
    this.setState({ anchorRef: React.createRef() });
    const folders = await this.props.getFolders(localStorage.clientID);
    this.setState({
      folders: [
        ...folders.data,
        { name: "All notes" },
        { name: "Linked Notes" },
        { name: "Shared with me" },
      ],
    });
  };

  componentWillUpdate = (prevProps) => {
    if (
      this.props.organizations &&
      this.props.organizations[0] &&
      this.props.organizations != prevProps.organizations
    ) {
      const orgTags = this.props.organizations[0].tags.map((orgTag) => {
        return { title: orgTag };
      });
      this.setState({ orgTagState: orgTags });
    }
  };

  CustomizedTextField = (open) => (props) => {
    return (
      <TextField
        {...props}
        InputProps={{
          style: { fontSize: 10 },
          endAdornment: (
            <InputAdornment position="end" {...props}>
              {open ? (
                <ExpandMoreSharpIcon style={{ cursor: "pointer" }} {...props} />
              ) : (
                <ExpandLessSharpIcon style={{ cursor: "pointer" }} {...props} />
              )}
            </InputAdornment>
          ),
        }}
      />
    );
  };

  handleChange = (e, editor = false) => {
    let n = this.state.edittedNote
      ? this.state.edittedNote
      : this.state.selectedNoteItem;
    if (editor) this.setState({ edittedNote: { ...n, text: e } });
    else this.setState({ selectedNoteItem: { ...n, text: e } });
  };

  handleTitleChange = (e) => {
    let note = this.state.edittedNote
      ? this.state.edittedNote
      : this.state.selectedNoteItem;
    this.setState({ edittedNote: { ...note, title: e.target.value } });
  };

  returnMain = () => {
    const {
      history,
      match: { path },
    } = this.props;
    // history.push(path.split('/Edit')[0])
  };

  getFirstNote = (date, notes) => {
    const day = new Date(date).getDay(),
      startDiff = new Date(date).getDate() - day,
      endDiff = new Date(date).getDate() + 6 - day;
    const startD = new Date(new Date(date).setDate(startDiff));
    const endD = new Date(new Date(date).setDate(endDiff));

    return notes.find(
      (i) =>
        new Date(i.createDate).getTime() >=
          new Date(startD.setHours(0, 0, 0)).getTime() &&
        new Date(i.createDate).getTime() <
          new Date(endD.setHours(23, 59, 59)).getTime()
    );
  };

  getTitle = (a) => {
    this.setState({
      title: a,
    });
  };

  handleTags = async (tags, noteID, newTag = false) => {
    this.setState({
      tags,
    });
    await updateNoteTags(tags, noteID, newTag).then(async (response) => {
      if (newTag) {
        let updatedOrgs = await getOrganizations();
      }
    });
    return;
  };

  handleSave = async (pin, newPin) => {
    try {
      this.setState({ pending: true });
      if (newPin) {
        this.setState({
          selectedNoteItem: { ...this.state.selectedNoteItem, pinned: pin },
        });
        note = {
          ...this.state.selectedNoteItem,
          pinned: newPin ? pin : this.state.selectedNoteItem.pinned,
        };
      } else
        note = {
          ...this.state.edittedNote,
          pinned: newPin ? pin : this.state.selectedNoteItem.pinned,
        };
      delete note.loading;
      delete note.pending;
      const response = await this.props.update(note);
      this.setState({ selectedNoteItem: note });
      if (response) {
        this.setState({ pending: false });
        return true;
      }
    } catch (err) {
      this.setState({ pending: false });
    }
  };
  
  handleClickNote = async (event) => {
    // this.setState({selectedNote: event.target.id})
    this.props.list.map((list) => {
      if (list._id == event.target.id) {
        this.setState({
          selectedNoteItem: list,
          selectedNote: list._id,
        });
      }
    });
  };

  handleClickCategory = (name, noteID) => {
    if (!noteID) {
      this.setState({ selectedCategory: name });
    } else {
      this.setState({ selectedCategory: noteID });
    }
    const notes = this.filtered(
      noteID || name,
      this.props.list,
      this.state.isSorted
    );
    if (notes.length > 0)
      this.setState({ selectedNoteItem: notes[0], selectedNote: notes[0]._id });
    else this.setState({ selectedNoteItem: null, selectedNote: null });
  };

  onChange = (dates) => {
    const [start, end] = dates;
    const day = new Date(start).getDay(),
      startDiff = new Date(start).getDate() - day,
      endDiff = new Date(start).getDate() + 6 - day;
    const newNote = this.getFirstNote(start, this.props.list) || {};
    const startD = new Date(new Date(start).setDate(startDiff));
    const endD = new Date(new Date(start).setDate(endDiff));
    this.setState({
      startDate: new Date(startD.setHours(0, 0, 0, 0)),
      endDate: new Date(endD.setHours(23, 59, 59)),
      selectedNoteItem: newNote,
      selectedNote: newNote._id,
    });
  };

  ExampleCustomInput = ({ value, onClick }) => <EventIcon onClick={onClick} />;

  onTypeChange = (e) => {
    this.setState({ type: e.target.value });
  };

  getTextFromHtml = (html) => {
    let div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  filtered = (filter, notes, isSorted) => {
    let sortedNotes;
    if (isSorted) {
      sortedNotes = notes.sort((a, b) => {
        let x, y;
        x = a.title ? a.title : this.getTextFromHtml(a.text);
        y = b.title ? b.title : this.getTextFromHtml(b.text);
        if (x.toLowerCase() > y.toLowerCase())
          return isSorted == "atoz" ? 1 : -1;
        else if (x.toLowerCase() < y.toLowerCase())
          return isSorted == "atoz" ? -1 : 1;
        else return 0;
      });
    } else
      sortedNotes = notes.sort((a, b) => {
        if (new Date(a.createDate).getTime() > new Date(b.createDate).getTime())
          return -1;
        if (new Date(b.createDate).getTime() > new Date(a.createDate).getTime())
          return 1;
        return 0;
      });

    if (filter != "Pinned") {
      if (this.state.tagState)
        notes = notes.filter((note) =>
          this.state.tagState.every((tag) => note.tags.includes(tag))
        );
      if (this.state.dateRangeStart)
        notes = notes.filter(
          (note) =>
            new Date(note.createDate) >= new Date(this.state.dateRangeStart)
        );
      if (this.state.dateRangeEnd)
        notes = notes.filter(
          (note) =>
            new Date(note.createDate) <
            new Date(
              new Date(this.state.dateRangeEnd).setDate(
                new Date(this.state.dateRangeEnd).getDate() + 1
              )
            )
        );
      if (this.state.dateCreated)
        notes = notes.filter(
          (note) =>
            new Date(note.createDate).setHours(0, 0, 0, 0) ==
            new Date(this.state.dateCreated).setHours(0, 0, 0, 0)
        );
    }
    switch (filter) {
      case "Pinned":
        return notes.filter((nts) => nts.pinned == true);
      case "Linked Notes":
        return notes.filter((nts) => nts.objectiveID != null);
      case "Shared with me":
        return notes.filter((nts) =>
          nts.shared.includes(`${localStorage.clientID}`)
        );
      case "All notes":
        return notes;
      default:
        return notes.filter((nts) => nts.folder == filter);
    }
  };

  addFolder = async (name) => {
    const newFolder = await this.props.createFolder(
      localStorage.clientID,
      name
    );
    if (newFolder) this.setState({ folders: [this.state.folders, newFolder] });
    return newFolder;
  };

  sortIcon = () => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 7, marginBottom: -4 }}>
          {this.state.isSorted == "ztoa" ? "Z" : "A"}
        </div>
        <div style={{ fontSize: 7, marginTop: -4 }}>
          {this.state.isSorted == "ztoa" ? "A" : "Z"}
        </div>
      </div>
      <HeightIcon style={{ marginLeft: -4, marginTop: -2, fontSize: 18 }} />
    </div>
  );

  handleFilterToggle = () => {
    this.setState({ isNoteFilterOpen: !this.state.isNoteFilterOpen });
  };

  render() {
    const { loading, pending } = this.state;
    const Folder =
      this.state.folders &&
      this.state.folders.find(
        (f) =>
          f._id == this.state.selectedCategory ||
          f.name == this.state.selectedCategory
      );
    return loading ? null : (
      <div style={{ display: "flex" }}>
        <ModalView
          open={this.state.isCreateNoteOpen}
          onClose={() => this.setState({ isCreateNoteOpen: false })}
          title="Create Note"
          style={{
            height: "500px",
            width: "500px",
            position: "fixed",
            left: "50%",
            top: "50%",
            marginTop: "-250px",
            marginLeft: "-250px",
          }}
        >
          <div>
            <AddNote
              onComplete={() => this.setState({ isCreateNoteOpen: false })}
              folderID={this.state.selectedCategory}
            />
          </div>
        </ModalView>
        <div
          style={{
            width: "17vw",
            height: "calc(100vh - 64px)",
            overflow: "scroll",
            overflowX: "hidden",
            borderRight: "1px solid #EBEBEB",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div style={{ margin: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                marginBottom: 15,
              }}
              onClick={() =>
                this.setState({ newFolderOpen: !this.state.newFolderOpen })
              }
            >
              <AddCircleOutlineIcon
                style={{
                  fill: "#000000",
                  opacity: "35%",
                  width: 16,
                  paddingRight: 6,
                }}
              />
              <div style={{ color: "#000000", opacity: "35%", fontSize: 12 }}>
                New Folder
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() =>
                  this.setState({ pinExpand: !this.state.pinExpand })
                }
              >
                <div style={{ paddingRight: 6 }}>
                  <img
                    src={PinnedIconYellow}
                    style={{
                      fill: "#FFBB67",
                      transform: "rotate(300deg)",
                      width: 20,
                    }}
                  />
                </div>
                <div>Pinned</div>
                {this.state.pinExpand ? (
                  <ExpandMoreSharpIcon fontSize="small" />
                ) : (
                  <ExpandLessSharpIcon fontSize="small" />
                )}
              </div>
              <div>{this.filtered("Pinned", this.props.list).length}</div>
            </div>
            <div>
              {this.state.pinExpand &&
                this.filtered("Pinned", this.props.list).map((note) => {
                  return (
                    <Card
                      id={note._id}
                      variant="outlined"
                      style={{ marginBottom: 5 }}
                      onClick={this.handleClickNote}
                    >
                      <div
                        id={note._id}
                        style={{
                          background:
                            this.state.selectedNoteItem == note
                              ? "#807AA5"
                              : null,
                          color:
                            this.state.selectedNoteItem == note ? "#fff" : null,
                        }}
                      >
                        <CardActionArea>
                          <CardContent
                            id={note._id}
                            style={{ padding: "5px", paddingLeft: 10 }}
                          >
                            <div
                              id={note._id}
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {note.objectiveID && (
                                <ListIcon
                                  style={{ fontSize: 17, marginTop: -3 }}
                                />
                              )}
                              <Typography
                                id={note._id}
                                gutterBottom
                                style={{ fontSize: "10px" }}
                              >
                                {note.title
                                  ? note.title
                                  : this.getTextFromHtml(note.text) !=
                                    this.getTextFromHtml("<p>&nbsp;</p>")
                                  ? this.getTextFromHtml(note.text).length > 40
                                    ? `${this.getTextFromHtml(
                                        note.text
                                      ).substring(0, 40)}...`
                                    : this.getTextFromHtml(note.text).substring(
                                        0,
                                        40
                                      )
                                  : "Untitled Note"}
                              </Typography>
                            </div>
                          </CardContent>
                        </CardActionArea>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </div>
          <div>
            <List component="nav">
              {this.state.newFolderOpen && (
                <ListItem>
                  <TextField
                    id="newText"
                    placeholder="Type a Name"
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        const newFolders = await this.props.createFolder(
                          localStorage.clientID,
                          e.target.value
                        );
                        if (newFolders)
                          this.setState({
                            newFolderOpen: false,
                            folders: [
                              ...newFolders.data,
                              { name: "All notes" },
                              { name: "Linked Notes" },
                              { name: "Shared with me" },
                            ],
                          });
                        e.preventDefault();
                      }
                    }}
                  />
                </ListItem>
              )}
              {this.state.folders.map((fldr) => {
                return (
                  <ListItem
                    button
                    selected={
                      fldr.name == this.state.selectedCategory ||
                      (fldr._id && fldr._id == this.state.selectedCategory)
                    }
                    onClick={() =>
                      this.handleClickCategory(
                        fldr.name,
                        fldr._id ? fldr._id : null
                      )
                    }
                  >
                    {fldr._id && (
                      <ListItemIcon style={{ minWidth: 30 }}>
                        <FolderIcon style={{ width: 20, color: "#807AA5" }} />
                      </ListItemIcon>
                    )}
                    <ListItemText
                      primary={fldr.name}
                      style={{ fontSize: 13 }}
                    />
                    {
                      this.filtered(
                        fldr._id || fldr.name,
                        this.props.list,
                        this.state.isSorted
                      ).length
                    }
                  </ListItem>
                );
              })}
            </List>
          </div>
        </div>
        <div
          style={{
            borderRight: "1px solid #bdbdbd",
            width: "17vw",
            height: "calc(100vh - 64px)",
            backgroundColor: "#E8E7EF",
          }}
        >
          <div style={{ padding: 10, overflowY: "auto", height: "87vh" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <Button
                ref={this.state.anchorRef}
                aria-controls={
                  this.state.isNoteFilterOpen ? "menu-list-grow" : undefined
                }
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "left",
                }}
                onClick={this.handleFilterToggle}
              >
                <FilterIcon />
              </Button>
              <Button
                style={{
                  background: this.state.isSorted ? "#807AA5" : null,
                  color: this.state.isSorted ? "#fff" : null,
                }}
                onClick={() =>
                  this.setState({
                    isSorted:
                      this.state.isSorted == "atoz"
                        ? "ztoa"
                        : !this.state.isSorted
                        ? "atoz"
                        : false,
                  })
                }
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ fontSize: 12, marginRight: 5 }}>SORT</div>
                  <this.sortIcon />
                </div>
              </Button>
            </div>
            <div
              style={{
                display: "flex",
                marginBottom: 10,
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              <div style={{ marginRight: 5 }}>
                {(Folder && Folder.name) || this.state.selectedCategory}
              </div>
              <div>
                (
                {
                  this.filtered(
                    this.state.selectedCategory,
                    this.props.list,
                    this.state.isSorted
                  ).length
                }
                )
              </div>
            </div>
            {this.filtered(
              this.state.selectedCategory,
              this.props.list,
              this.state.isSorted
            ).map((i) => {
              return (
                <div>
                  {this.state.selectedNoteItem == i && (
                    <Card
                      id={i._id}
                      variant="outlined"
                      style={{ marginBottom: 5 }}
                    >
                      <div
                        id={i._id}
                        style={{ background: "#807AA5", color: "#fff" }}
                      >
                        <CardActionArea>
                          <CardContent
                            id={i._id}
                            style={{ padding: 7, fontSize: 9 }}
                          >
                            <div
                              id={i._id}
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {i.pinned && (
                                <img
                                  src={PinnedIconYellow}
                                  alt="pin"
                                  width="12"
                                  style={{ transform: "rotate(300deg)" }}
                                />
                              )}
                              {i.objectiveID && (
                                <ListIcon
                                  id={i._id}
                                  style={{ fontSize: 17, marginTop: -3 }}
                                />
                              )}
                              {(i.title !== "" || i.title != undefined) && (
                                <Typography
                                  id={i._id}
                                  gutterBottom
                                  style={{ fontSize: 10, fontWeight: "bold" }}
                                >
                                  {i.title.length > 30
                                    ? i.title.substring(0, 30) + "..."
                                    : i.title}
                                </Typography>
                              )}
                              {i.title === "" && (
                                <Typography
                                  id={i._id}
                                  gutterBottom
                                  style={{ fontSize: 10, fontWeight: "bold" }}
                                >
                                  <div
                                    id={i._id}
                                    dangerouslySetInnerHTML={{
                                      __html: `${i.text.substring(0, 18)}${
                                        i.text.length > 18 ? "..." : ""
                                      }`,
                                    }}
                                  />
                                </Typography>
                              )}
                            </div>
                            <div
                              id={i._id}
                              dangerouslySetInnerHTML={{
                                __html: `<style> #notes img{ width: 100%}</style> <div id="notes">${i.text.substring(
                                  0,
                                  80
                                )}${i.text.length > 80 ? "..." : ""}</div>`,
                              }}
                            />
                          </CardContent>
                        </CardActionArea>
                      </div>
                    </Card>
                  )}
                  {this.state.selectedNoteItem != i && (
                    <Card
                      id={i._id}
                      variant="outlined"
                      style={{ marginBottom: 5 }}
                      onClick={this.handleClickNote}
                    >
                      <CardActionArea>
                        <CardContent
                          id={i._id}
                          style={{ padding: 7, fontSize: 9 }}
                        >
                          <div
                            id={i._id}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {i.pinned && (
                              <img
                                src={PinnedIconYellow}
                                alt="pin"
                                width="12"
                                style={{ transform: "rotate(300deg)" }}
                              />
                            )}
                            {i.objectiveID && (
                              <ListIcon
                                id={i._id}
                                style={{ fontSize: 17, marginTop: -3 }}
                              />
                            )}
                            {(i.title !== "" || i.title != undefined) && (
                              <Typography
                                id={i._id}
                                gutterBottom
                                style={{ fontSize: 10, fontWeight: "bold" }}
                              >
                                {i.title.length > 30
                                  ? i.title.substring(0, 30) + "..."
                                  : i.title}
                              </Typography>
                            )}
                            {i.title === "" && (
                              <Typography
                                id={i._id}
                                gutterBottom
                                style={{ fontSize: 10, fontWeight: "bold" }}
                              >
                                <div
                                  id={i._id}
                                  dangerouslySetInnerHTML={{
                                    __html: `${i.text.substring(0, 18)}${
                                      i.text.length > 18 ? "..." : ""
                                    }`,
                                  }}
                                />
                              </Typography>
                            )}
                          </div>
                          <div
                            id={i._id}
                            onClick={() => {
                              this.handleClickNote({ target: { id: i._id } });
                            }}
                            dangerouslySetInnerHTML={{
                              __html: `<style> #notes img{ width: 100%}</style> <div id="notes">${i.text.substring(
                                0,
                                80
                              )}${i.text.length > 80 ? "..." : ""}</div>`,
                            }}
                          />
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  )}
                </div>
              );
            })}
            {![
              "Pinned",
              "Linked Notes",
              "Shared with me",
              "All notes",
            ].includes(this.state.selectedCategory) && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  marginBottom: 15,
                }}
                onClick={() => this.setState({ isCreateNoteOpen: true })}
              >
                <AddCircleOutlineIcon
                  style={{
                    fill: "#000000",
                    opacity: "35%",
                    width: 16,
                    paddingRight: 6,
                  }}
                />
                <div style={{ color: "#000000", opacity: "35%", fontSize: 12 }}>
                  New Note
                </div>
              </div>
            )}
          </div>
          <Popper
            open={this.state.isNoteFilterOpen}
            anchorEl={this.state.anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener>
                    <div style={{ padding: 10, width: 190 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <FilterIcon />
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: "bold",
                              marginLeft: 10,
                            }}
                          >
                            Filters
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "#FFA940",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            this.setState({
                              dateCreated: null,
                              dateModified: null,
                              dateRangeStart: null,
                              dateRangeEnd: null,
                            });
                          }}
                        >
                          CLEAR ALL
                        </div>
                      </div>
                      <div>
                        <table>
                          <tr>
                            <td
                              style={{ verticalAlign: "baseline", width: 80 }}
                            >
                              <div
                                style={{
                                  fontSize: 10,
                                  fontWeight: "bold",
                                  marginTop: 24,
                                }}
                              >
                                Date Range
                              </div>
                            </td>
                            <td style={{ width: 80 }}>
                              <tr>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                  <KeyboardDatePicker
                                    margin="normal"
                                    id="DateRangeStart"
                                    format="MM/dd/yyyy"
                                    style={{ fontSize: 10 }}
                                    value={this.state.dateRangeStart}
                                    KeyboardButtonProps={{
                                      "aria-label": "change date",
                                    }}
                                    onChange={(dateType, value) =>
                                      this.setState({ dateRangeStart: value })
                                    }
                                    open={
                                      this.state.noteFilterDate ==
                                      "DateRangeStart"
                                        ? true
                                        : false
                                    }
                                    onClick={(e) =>
                                      this.setState({
                                        noteFilterDate: e.target.id,
                                      })
                                    }
                                    onClose={(e) =>
                                      this.setState({ noteFilterDate: null })
                                    }
                                    TextFieldComponent={this.CustomizedTextField(
                                      true
                                    )}
                                  />
                                </MuiPickersUtilsProvider>
                              </tr>
                              <tr>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                  <KeyboardDatePicker
                                    margin="normal"
                                    id="DateRangeEnd"
                                    format="MM/dd/yyyy"
                                    KeyboardButtonProps={{
                                      "aria-label": "change date",
                                    }}
                                    style={{ fontSize: 10 }}
                                    value={this.state.dateRangeEnd}
                                    onChange={(dateType, value) =>
                                      this.setState({ dateRangeEnd: value })
                                    }
                                    open={
                                      this.state.noteFilterDate ==
                                      "DateRangeEnd"
                                        ? true
                                        : false
                                    }
                                    onClick={(e) =>
                                      this.setState({
                                        noteFilterDate: e.target.id,
                                      })
                                    }
                                    onClose={(e) =>
                                      this.setState({ noteFilterDate: null })
                                    }
                                    TextFieldComponent={this.CustomizedTextField(
                                      true
                                    )}
                                  />
                                </MuiPickersUtilsProvider>
                              </tr>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div style={{ fontSize: 10, fontWeight: "bold" }}>
                                Date Created
                              </div>
                            </td>
                            <td>
                              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                  margin="normal"
                                  id="DateCreated"
                                  format="MM/dd/yyyy"
                                  KeyboardButtonProps={{
                                    "aria-label": "change date",
                                  }}
                                  style={{ fontSize: 10 }}
                                  value={this.state.dateCreated}
                                  onChange={(dateType, value) =>
                                    this.setState({ dateCreated: value })
                                  }
                                  open={
                                    this.state.noteFilterDate == "DateCreated"
                                      ? true
                                      : false
                                  }
                                  onClick={(e) =>
                                    this.setState({
                                      noteFilterDate: e.target.id,
                                    })
                                  }
                                  onClose={(e) =>
                                    this.setState({ noteFilterDate: null })
                                  }
                                  TextFieldComponent={this.CustomizedTextField(
                                    true
                                  )}
                                  TextFieldComponent={this.CustomizedTextField(
                                    true
                                  )}
                                />
                              </MuiPickersUtilsProvider>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div style={{ fontSize: 10, fontWeight: "bold" }}>
                                Date Modified
                              </div>
                            </td>
                            <td>
                              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                  margin="normal"
                                  id="DateModified"
                                  format="MM/dd/yyyy"
                                  KeyboardButtonProps={{
                                    "aria-label": "change date",
                                  }}
                                  style={{ fontSize: 10 }}
                                  value={this.state.dateModified}
                                  onChange={(dateType, value) =>
                                    this.setState({ dateModified: value })
                                  }
                                  open={
                                    this.state.noteFilterDate == "DateModified"
                                      ? true
                                      : false
                                  }
                                  onClick={(e) =>
                                    this.setState({
                                      noteFilterDate: e.target.id,
                                    })
                                  }
                                  onClose={(e) =>
                                    this.setState({ noteFilterDate: null })
                                  }
                                  TextFieldComponent={this.CustomizedTextField(
                                    true
                                  )}
                                  TextFieldComponent={this.CustomizedTextField(
                                    true
                                  )}
                                />
                              </MuiPickersUtilsProvider>
                            </td>
                          </tr>
                        </table>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <FilterIcon />
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            marginLeft: 10,
                          }}
                        >
                          Tags
                        </div>
                      </div>
                      <div style={{ width: "100px" }}>
                        <Autocomplete
                          size="small"
                          multiple
                          filterSelectedOptions
                          onChange={(event, newValue) => {
                            let newTag;
                            let newTags = newValue.map((tag) => {
                              if (typeof tag === "string") return tag;
                              if (tag && tag.inputValue) {
                                newTag = tag.inputValue;
                                if (!this.state.orgTagState.includes(tag)) {
                                  let optionTags = this.state.orgTagState;
                                  optionTags.push({ title: tag.inputValue });
                                  this.setState({ orgTagState: optionTags });
                                }
                                return tag.inputValue;
                              } else if (tag && tag.title) return tag.title;
                            });
                            this.setState({ tagState: newTags });
                            return;
                          }}
                          filterOptions={(options, params) => {
                            let filtered = filter(options, params);
                            this.state.tagState.map((defaultTag) => {
                              filtered = filtered.filter((tags) => {
                                if (defaultTag.title)
                                  return tags.title != defaultTag.title;
                                else return tags.title != defaultTag;
                              });
                            });
                            return filtered;
                          }}
                          filterSelectedOptions={true}
                          id="tags-filled"
                          options={this.state.orgTagState}
                          defaultValue={
                            this.state.tagState.length > 0
                              ? this.state.tagState.map((tag) => {
                                  return tag;
                                })
                              : []
                          }
                          getOptionLabel={(option) => {
                            if (typeof option === "string") {
                              return option;
                            }
                            if (option && option.inputValue) {
                              return option.inputValue;
                            }
                            if (option != null) return option.title;
                          }}
                          renderOption={(option) => {
                            if (option.title) return option.title;
                            return option.inputValue;
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              label="Tags"
                              style={{ width: 190 }}
                              placeholder="Search Tags"
                            />
                          )}
                        />
                      </div>
                    </div>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
        <div style={{ width: "66%" }}>
          {this.state.selectedNote && (
            <NoteFields
              onChange={(e, bool) => this.handleChange(e, bool)}
              handleTitleChange={this.handleTitleChange}
              selectedNoteItem={this.state.selectedNoteItem}
              title={this.state.title}
              getTitle={this.getTitle}
              handleTag={this.handleTags}
              orgTags={
                (this.props.organizations[0] &&
                  this.props.organizations[0].tags &&
                  this.props.organizations[0].tags.map((tag) => {
                    return { title: tag };
                  })) ||
                []
              }
              fromEdit={true}
              pending={pending}
              handleSave={this.handleSave}
            ></NoteFields>
          )}
          {!this.state.selectedNote && (
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
              You have no Notes in this Folder
            </div>
          )}
        </div>
      </div>
    );
  }

  componentWillReceiveProps(p) {
    const {
      match: {
        params: { id },
      },
      byID,
    } = p;
    const note = { ...byID[id] };
    if (note._id && note._id !== this.state._id) {
      this.setState({ ...note, loading: false });
    }
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.list.length === 0 && this.props.list.length > 0) {
      const note = this.props.list.find((nt) => nt.pinned == true) || {};
      if (note._id) {
        this.setState({ ...note, loading: false });
      }
      this.setState({
        selectedNote: note._id,
        selectedNoteItem: note,
      });
    }
  };

  componentDidMount() {
    let {
      match: {
        params: { id },
      },
      byID,
      list,
    } = this.props;
    let note;
    if (this.props.location && this.props.location.state) {
      note = list.find((n) => n._id === this.props.location.state.selectedNote);
      if (note) this.onChange([note.createDate]);
    } else note = (list && list.find((nt) => nt.pinned == true)) || {};
    if (note && note._id) {
      this.setState({ ...note, loading: false });
    }
    if (list && list.length > 0)
      this.setState({
        selectedNote: note._id,
        selectedNoteItem: note,
      });
  }
}

const mapStateToProps = (state) => {
  return state.notes;
};

const mapDispatchToProps = (dispatch) => ({
  update: (note) => dispatch(editNote(note)),
  getFolders: (userID) => getFoldersApi(userID),
  createFolder: (userID, name) => createFolderApi(userID, name),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationHOC(Edit));

import AccessTimeIcon from "@material-ui/icons/AccessTime";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import CheckIcon from "@material-ui/icons/Check";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import ClearIcon from "@material-ui/icons/Clear";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
import AddIcon from "@material-ui/icons/Add";
import DoneIcon from "@material-ui/icons/Done";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";

const getIconForStatus = (status) =>
  ({
    Pending: AccessTimeIcon,
    Completed: CheckIcon,
    Ended: CheckIcon,
    InProgress: PlayArrowIcon,
    Cancelled: ClearIcon,
    Missed: PriorityHighIcon,
    Tag: LocalOfferOutlinedIcon,
    TagFilled: LocalOfferIcon,
    Add: AddIcon,
    Done: DoneIcon,
    Cancel: ClearIcon,
  }[status] || PriorityHighIcon);

export default getIconForStatus;

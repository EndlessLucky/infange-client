import React from "react";
import Typography from "@material-ui/core/Typography";

const Base = props => <Typography {...props} />;

const Title = props => <Base color="inherit" {...props} variant="h6" />;

export default Base;
export { Title };

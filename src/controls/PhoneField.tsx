import React, { Fragment, PureComponent } from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import InputMask, { MaskedInputProps } from "./Masked";
import PIcon from "@material-ui/icons/Phone";
import { withStyles } from "@material-ui/core/styles";
import { InputAdornment } from "@material-ui/core";

const PhoneMask: React.FC<MaskedInputProps> = (props) => (
  <InputMask
    mask={[
      "(",
      /[1-9]/,
      /\d/,
      /\d/,
      ")",
      " ",
      /\d/,
      /\d/,
      /\d/,
      "-",
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ]}
    guide={false}
    {...props}
  />
);

type Props = TextFieldProps & {
  icon?: boolean;
};

const PhoneField: React.FC<Props> = ({ icon = true, ...props }) => (
  <TextField
    {...props}
    InputProps={{
      inputComponent: PhoneMask,
      startAdornment: icon && (
        <InputAdornment position="start">
          <PIcon />
        </InputAdornment>
      ),
    }}
  />
);

export default PhoneField;

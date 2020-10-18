import React from "react";
import {
  Grid,
  TextFieldProps,
  TextField as MuiTextField,
} from "@material-ui/core";
import useStyles from "./useStyles";
import clsx from "clsx";
import { BaseInputProps } from "./types";
import { FormField } from "./Form";
import config from "./config";

type Props = TextFieldProps & BaseInputProps;

//<label style={{whiteSpace: 'nowrap', paddingRight: 4, paddingBottom: 20}}>{label}</label>

const TextField = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      full = false,
      errorMessage,
      error,
      label,
      helperText,
      className,
      inputProps,
      ...props
    },
    ref
  ) => {
    const classes = useStyles();
    return (
      <>
        <FormField full={full}>
          <label
            style={{ whiteSpace: "nowrap", paddingBottom: 4, display: "block" }}
          >
            {label}
          </label>
          <MuiTextField
            fullWidth
            {...props}
            className={clsx(className, classes.input)}
            variant={config.input.variant}
            placeholder={label?.toString()}
            error={error || Boolean(errorMessage)}
            inputProps={{ ref, ...inputProps }}
            helperText={errorMessage || helperText || " "}
          />
        </FormField>
      </>
    );
  }
);

export default TextField;

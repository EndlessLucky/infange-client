import React, {useState} from 'react';
import {
    Input,
    InputLabel,
    InputAdornment,
    FormControl,
    IconButton,
    FormHelperText,
    TextFieldProps, TextField as MuiTextField, InputProps
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {BaseInputProps} from "./types";
import useStyles from "./useStyles";
import {FormField} from "./Form";
import clsx from "clsx";

type Props = InputProps & BaseInputProps & {
    helperText: string,
    label: string
};

const Password = React.forwardRef<HTMLInputElement, Props>(({
                      full = false, errorMessage, error, label, name,
                      helperText, className, inputProps, id, ...props
                  }, ref) => {
    const classes = useStyles();
    const [show, setShow] = useState(false);
    return (
        <>
            <FormField full={full} style={{display: 'flex', alignItems: 'center'}}>
                <FormControl error={error || Boolean(errorMessage)} variant={'outlined'}>
                    <InputLabel htmlFor={id}>{label}</InputLabel>
                    <Input
                        id={id}
                        name={name ? name : id}
                        type={show ? 'text' : 'password'}
                        {...props}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={"Toggle password visibility"}
                                    onClick={() => setShow(!show)}
                                >
                                    {show ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <FormHelperText>{errorMessage || helperText || ' '}</FormHelperText>
                </FormControl>
            </FormField>

        </>
    )
});

export default Password;

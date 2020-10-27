import React, {useState} from 'react';
import {
    Input,
    InputLabel,
    InputAdornment,
    FormControl,
    FormHelperText,
    InputProps
} from '@material-ui/core';
import {BaseInputProps} from "./types";
import {FormField} from "./Form";
import EIcon from '@material-ui/icons/Email';
import InputMask from './Masked';
import {MaskedInputProps} from './Masked';
import emailMask from 'text-mask-addons/dist/emailMask';


type Props = InputProps & BaseInputProps & {
    helperText: string,
    label: string,
    icon?: boolean
};

const EmailMask: React.FC<MaskedInputProps> = (props) => (
    <InputMask mask={emailMask} {...props} />
)

const EmailField = React.forwardRef<HTMLInputElement, Props>(({
                                                                full = false, errorMessage, error, label, name,
                                                                helperText, className, inputProps, id,icon = true, ...props
                                                            }, ref) => {
    return (
        <>
            <FormField full={full} style={{display: 'flex', alignItems: 'center'}}>
                <FormControl error={error || Boolean(errorMessage)} variant={'outlined'}>
                    <InputLabel htmlFor={id}>{label}</InputLabel>
                    <Input
                        id={id}
                        name={name ? name : id}
                        {...props}
                        inputComponent={EmailMask}
                        startAdornment={
                            icon && <InputAdornment position="start"> <EIcon  /> </InputAdornment>
                        }
                    />
                    <FormHelperText>{errorMessage || helperText || ' '}</FormHelperText>
                </FormControl>
            </FormField>
        </>
    )
});

export default EmailField;

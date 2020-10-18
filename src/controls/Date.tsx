import React from 'react';
import {
    KeyboardDatePicker, KeyboardDatePickerProps,
} from '@material-ui/pickers';
import {makeStyles} from '@material-ui/core/styles';
import TextField, {TextFieldProps} from '@material-ui/core/TextField'
import {Moment} from "moment";
import {FormField} from "./Form";
import config from "./config";
import {BaseInputProps} from "./types";

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
type Override<T, U> = Omit<T, keyof U> & U

type Props = Omit<TextFieldProps, 'onChange'> & KeyboardDatePickerProps & BaseInputProps & {
    onChange: (date: Moment) => void
};

const BaseDatePicker: React.FC<Props> = function ({onChange, full = false, error,
                                                      errorMessage, label, helperText, ...props}) {
    return (
        <FormField full={full}>
            <label style={{whiteSpace: 'nowrap', paddingBottom: 4, display: 'block', height: 18}}>{label}</label>
            <KeyboardDatePicker
                disableToolbar
                autoOk
                fullWidth
                variant='inline'
                inputVariant={config.input.variant}
                format="MM/DD/YYYY"
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
                onChange={onChange}
                TextFieldComponent={TextField}
                error={error || Boolean(errorMessage)}
                helperText={errorMessage || helperText || ' '}
                style={{marginTop: 0}}
                {...props}
            />
        </FormField>
    );
}


export default BaseDatePicker;
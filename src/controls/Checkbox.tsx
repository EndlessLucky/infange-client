import React, {ReactNode} from 'react';
import {CheckboxProps as CBProps, FormControl, FormControlLabel, FormHelperText, Checkbox as MuiCheckbox} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

export type CheckboxProps = CBProps & {
    error?:boolean,
    helperText?: ReactNode,
    label?: ReactNode
}

const useStyles = makeStyles(theme => ({
    error: {
        background: 'rgba(200,40,40,0.08)',
        padding: 0
    },
    cbError: {
        color: 'rgba(170, 34, 34, 0.80)'
    }
}));

const Checkbox: React.FC<CheckboxProps> = ({error = false, helperText, label, ...cbProps}) => {
    const classes = useStyles();
    return (<FormControl error={error} style={{width: '100%'}}>
        <FormControlLabel
            className={error ? classes.error : ''}
            control={
                <MuiCheckbox
                    className={error ? classes.cbError : ''}
                    {...cbProps}
                />
            }
            label={label}

        />
        <FormHelperText>{helperText}</FormHelperText>
    </FormControl>);
}

export default Checkbox;
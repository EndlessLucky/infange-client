import React from 'react';
import TextField, {TextFieldProps} from '@material-ui/core/TextField'
import InputMask, {MaskedInputProps} from './Masked';

const SSNMask: React.FC<MaskedInputProps> = (props) => (
    <InputMask mask={[/\d/, /\d/, /\d/,'-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]} guide={false} {...props} />
)

export default (props: TextFieldProps) => (
    <TextField
        {...props}
        InputProps={{
            inputComponent: SSNMask as any,
        }}
       autoComplete="off"                                     
    />
)
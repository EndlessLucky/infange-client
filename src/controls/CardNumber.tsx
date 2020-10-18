import React from 'react';
import TextField, {TextFieldProps} from '@material-ui/core/TextField'
import InputMask, {MaskedInputProps} from './Masked';

const CardMask: React.FC<MaskedInputProps> = (props) => (
    <InputMask mask={[/\d/, /\d/, /\d/,/\d/,' ',/\d/, /\d/, /\d/,/\d/,' ',/\d/, /\d/, /\d/,/\d/,' ',/\d/, /\d/, /\d/,/\d/]} guide={false} {...props} />
)

export default (props: TextFieldProps) => (
    <TextField
        {...props}
        InputProps={{
            inputComponent: CardMask as any,
            ...props.InputProps
        }}
    />
)
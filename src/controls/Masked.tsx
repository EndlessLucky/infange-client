import React from 'react';
import MaskedInput, {maskArray,MaskedInputProps as MIP} from 'react-text-mask';

export type MaskedInputProps = MIP & {
    inputRef?: (ref: HTMLInputElement | null) => void;
};

const Mask:React.FC<MaskedInputProps> = ({mask, inputRef, placeholderChar = '\u2000', ...props}) => (
    <MaskedInput
        mask={mask}
        ref={(ref: any) => {
            inputRef && inputRef(ref ? ref.inputElement : null);
        }}
        placeholderChar={placeholderChar}
        {...props}
    />
)

export default Mask
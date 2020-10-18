import React, {ReactNode} from 'react'
import {
    FormControl,
    FormHelperText,
    InputLabel,
    Select,
    SelectProps,
    MenuItem,
} from "@material-ui/core";

export type KeyValuePair = {
    label: string
    value: string
    disabled?: boolean
}
export type DropDownProps = SelectProps & {
    error?: boolean
    options: KeyValuePair[]
    label: ReactNode
    helperText?: ReactNode
}

const Dropdown: React.FC<DropDownProps> = ({
                                               error,
                                               name,
                                               options,
                                               label,
                                               helperText,
                                               native,
                                               displayEmpty,
                                               className,
                                               ref,
                                               ...selectProps
                                           }) => {
    return (
        <FormControl error={error} className={className}>
            <InputLabel shrink={displayEmpty}>{label}</InputLabel>
            <Select {...selectProps} name={name} displayEmpty={displayEmpty} native={native} ref={ref}>
                {options.map((o, idx) => (
                    native
                        ? <option value={o.value} key={idx} disabled={o.disabled}>{o.value}</option>
                        : <MenuItem disabled={o.disabled} key={idx} value={o.value}>{o.label}</MenuItem>
                ))}
            </Select>
            <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
    )
}

export default Dropdown;
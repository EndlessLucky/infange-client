import {Variant} from "@material-ui/core/styles/createTypography";

type Config = {
    input: {
        variant?: 'standard' | 'outlined' | 'filled'
    }
}
export default {
    input: {
        variant: 'outlined'
    }
} as Config
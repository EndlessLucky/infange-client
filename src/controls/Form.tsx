import React, {ReactNode} from 'react';
import {Grid, GridItemsAlignment, GridProps} from "@material-ui/core";


type Props = {
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
    children?: ReactNode | ReactNode[]
}

type FormFieldProps = GridProps & {
    full?: boolean
    children?: ReactNode | ReactNode[]

}

export const FormField: React.FC<FormFieldProps> = ({full, children, ...props
}) => <Grid item xs={10} sm={full ? 11 : 5} {...props}>{children}</Grid>

const Form: React.FC<Props> = ({onSubmit, children}) => {

    return (
        <form onSubmit={onSubmit}>
            <Grid container justify={'space-around'} alignContent={'flex-start'} direction={'row'}>
                {children}
            </Grid>
        </form>
    )
}

export default Form;
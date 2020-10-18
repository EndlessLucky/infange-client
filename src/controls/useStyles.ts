import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles(theme => ({
    input: {
        width: '100%',
        //maxWidth: 400,
        margin: '0 auto'
    },
    item: {
        padding: theme.spacing(0, 1),
        display: 'flex'
    },
    section: {
        margin: theme.spacing(3, 0, 2, 0)
    },
    header: {
        textAlign: 'center',
        marginBottom: theme.spacing(3)
    },
}));

export default useStyles;
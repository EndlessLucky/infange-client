import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {DoneButton} from '../../components/controls/Button';
import { editObjective } from '../../actions/objective';
import Table from '../../components/controls/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { withStyles} from '@material-ui/core/styles';

const styles = {
    table: {
        marginLeft: '50px',
        marginRight: '50px',
        paddingTop: '10px',
        paddingBottom: '10px'
    }
}

const Header = () => (
    <TableHead>
        <TableRow>
            <TableCell> Description </TableCell>
            <TableCell> Status </TableCell>
            <TableCell> Create Date </TableCell>
            <TableCell> Due Date </TableCell>
            <TableCell> Completed Date </TableCell>
            <TableCell> Action </TableCell>
        </TableRow>
    </TableHead>
)

const Row = ({description, status, createDate, dueDate, completedDate, onClick}) => (
    <TableRow onClick={onClick}>
        <TableCell> {description} </TableCell>
        <TableCell> {status} </TableCell>
        <TableCell> {moment(createDate).format('MM/DD/YYYY h:mm A')} </TableCell>
        <TableCell> {moment(dueDate).format('MM/DD/YYYY h:mm A')} </TableCell>
        <TableCell> {moment(completedDate).format('MM/DD/YYYY h:mm A')} </TableCell>
        <TableCell> <DoneButton color="secondary" style={{width:'30%', minWidth: 80}} /> </TableCell>
    </TableRow>
)

class ObjectivesView extends PureComponent {

    render() {
        const { objectives, classes } = this.props;
        return (
            <div className={classes.table}>
                <Table>
                    <Header />
                    <TableBody>
                        {objectives.map(x => <Row
                        key={x._id}
                        description={x.description}
                        status={x.status}
                        createDate={x.createDate}
                        dueDate={x.dueDate}
                        completedDate={x.completedDate}
                        >
                        </Row>)}
                    </TableBody>
                </Table>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {objectives: state.objectives.list, users: state.users};
}

const mapDispatchToProps = dispatch => ({
    remove: objective => dispatch(editObjective(objective))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ObjectivesView));
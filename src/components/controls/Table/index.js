import React from "react";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import NewTable from "react-table-component";

const MyHeaderCell = ({ value }) => <TableCell>{value}</TableCell>;

function recursiveCloneChildren(children) {
  return React.Children.map(children, child => {
    var childProps = {};
    if (React.isValidElement(child)) {
      childProps = { someNew: "propToAdd" };
    }
    childProps.children = this.recursiveCloneChildren(child.props.children);
    return React.cloneElement(child, childProps);
  });
}

const MyTable = ({ children }) => {
  const newChildren = React.Children.map(children, child => {
    return child.type === TableHead ? null : child;
  });
  return (
    <Paper>
      <Table>{newChildren}</Table>
      {/* <NewTable /> */}
    </Paper>
  );
};

export default MyTable;

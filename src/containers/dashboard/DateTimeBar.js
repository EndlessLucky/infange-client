import React from "react";
import {Date, Time} from "../../components/Date";
import Flex from "../../components/controls/Flex";
import "../../common.css";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import BusinessIcon from "@material-ui/icons/Business";
import orgLogo from "../../org_logo.png";

const BootstrapInput = withStyles((theme) => ({
    root: {
        "label + &": {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        width: 200,
        borderRadius: 4,
        // position: 'relative',
        backgroundColor: "#e3e5e6",
        // border: '1px solid #ced4da',
        fontSize: 16,
        padding: "10px 26px 10px 5px",
        transition: theme.transitions.create(["border-color", "box-shadow"]),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
        "&:focus": {
            borderRadius: 4,
            borderColor: "#80bdff",
            boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
        },
    },
}))(InputBase);

let flexProps;

class DateTimeBar extends React.Component {
    state = {
        organizationName: "net pay advance",
    };

    render() {
        if (this.props.org)
            flexProps = {
                style: {justifyContent: "space-between"},
            };
        else flexProps = {};

        return (
            <>
                <div
                    style={{display: "flex", position: "fixed", left: 0, width: "100%"}}
                    className="date-time-bar"
                >
                    <Flex style={{flexWrap: "wrap"}} props={flexProps}>
                        <div style={{display: "flex", justifyContent: "flex-start"}}>
                            <div
                                style={{
                                    position: this.props.org ? null : "absolute",
                                    top: "0px",
                                    left: "0px",
                                }}
                            >
                                <FormControl>
                                    <Select
                                        value={this.state.organizationName}
                                        input={<BootstrapInput/>}
                                        // style={{}}
                                    >
                                        <MenuItem value="net pay advance">
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-evenly",
                                                }}
                                            >
                                                <BusinessIcon/>
                                                <p style={{margin: 0, marginTop: 5}}>Net Pay Advance</p>
                                            </div>
                                        </MenuItem>
                                        {/* <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem> */}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div style={{display: "flex"}}>
                            <div
                                style={{borderRight: "1px solid #000", paddingRight: "10px"}}
                            >
                                <Date/>
                            </div>
                            <div style={{paddingLeft: "10px"}}>
                                <Time/>
                            </div>
                        </div>
                        {this.props.org && (
                            <div style={{display: "flex", alignItems: "center"}}>
                                <p style={{margin: 0}}>My Organizations</p>
                                <div style={{borderRadius: "30px", marginLeft: 10}}>
                                    <img src={orgLogo} alt="org_logo" width="40px"/>
                                </div>
                            </div>
                        )}
                    </Flex>
                </div>
                <div style={{height: 45}}/>
            </>
        );
    }
}

export default DateTimeBar;

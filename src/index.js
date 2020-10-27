import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Router as ConnectedRouter } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { Provider } from "react-redux";
import store from "./store";
import { createBrowserHistory } from "history";
import { history } from "./store";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

const muiTheme = createMuiTheme({
    palette: {
        primary: {
            light: "#ffad33",
            main: "#ff9900",
            dark: "#b26b00",
            contrastText: "#fff"
        },
        secondary: {
            light: "#f44336",
            main: "#000000",
            dark: "#000000",
            contrastText: "#fff"
        }
    }
});

//testing changes
class Router extends Component {
    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider theme={muiTheme}>
                    <MuiPickersUtilsProvider
                        utils={MomentUtils}
                        moment={moment}
                        locale="en"
                    >
                        <ConnectedRouter history={history}>
                            <App />
                        </ConnectedRouter>
                    </MuiPickersUtilsProvider>
                </MuiThemeProvider>
            </Provider>
        );
    }
}

ReactDOM.render(<Router />, document.getElementById("root"));
//registerServiceWorker();

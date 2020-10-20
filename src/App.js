import React, { useEffect, Component } from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Login from "./views/Login";
import AuthRoutes from "./routes";
import OrganizationProvider from "./context/OrganizationProvider";
import AccountProvider from "./context/AccountProvider";
import { registerNotifications } from "./socket";
import { useHistory } from "react-router-dom";
import { NotificationContainer } from "react-notifications";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "../node_modules/react-notifications/dist/react-notifications.css";
import { register } from "./registerServiceWorker";

const useStyles = makeStyles(theme => ({
  root: {
  
    width: "100%",
    "--webkit-perspective": 1000
 
  }
}));

const ContextProviders = ({ children }) => (
  <OrganizationProvider>
    <AccountProvider>{children}</AccountProvider>
  </OrganizationProvider>
);

const App = () => {
  const history = useHistory();
  useEffect(() => {
    //  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    if (window.Notification) {
      Notification.requestPermission(function(result) {
        // console.log(result);
      });
    }
    registerNotifications(history);
  }, []);

  const classes = useStyles();
  return (
    <div className="App">
      <ReactNotification />
      <NotificationContainer />
      <div className={classes.root}>
        <Switch>
          {/*<Route path="/Account" component={TestControls}/>*/}
          <Route path="/Login" component={Login} />
          <Route path="/NewAccount" component={Login} />
          <Route path="/reset/:token" component={Login} />
          <ContextProviders>
            <Route path="*" render={props => <AuthRoutes {...props} />} />
          </ContextProviders>
        </Switch>
      </div>
    </div>
  );
};

export default App;

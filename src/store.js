import { createStore, applyMiddleware, compose } from "redux";
//import { routerMiddleware } from 'react-router-redux'
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import selectOrganization from "./reducers/middleware/selectOrganization";
import {createBrowserHistory} from "history";
//export const history = createHistory();

const initialState = {};
const enhancers = [];
const middleware = [
  thunk,
  selectOrganization
  //routerMiddleware(history)
];

export const history = createBrowserHistory();

if (process.env.NODE_ENV === "development") {
  // const devToolsExtension = window.devToolsExtension;
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;
  if (typeof devToolsExtension === "function") {
    //enwindowhancers.push(devToolsExtension())
    enhancers.push(
      devToolsExtension({
        name: "Android app",
        realtime: true,
        hostname: "localhost",
        port: 8000,
        maxAge: 30,
        actionsBlacklist: ["EFFECT_RESOLVED"],
        actionSanitizer: action =>
          action.type === "FILE_DOWNLOAD_SUCCESS" && action.data
            ? { ...action, data: "<<LONG_BLOB>>" }
            : action,
        stateSanitizer: state =>
          state.data ? { ...state, data: "<<LONG_BLOB>>" } : state
      })
    );
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

const store = createStore(rootReducer, initialState, composedEnhancers);

export default store;

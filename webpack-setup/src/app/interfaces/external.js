import * as Redux from "redux";
import Virtual from "./Virtual/Virtual.js";
import VirtualDom from "./Virtual/VirtualDom.js";
import VirtualCSSTransitionGroup from "./Virtual/VirtualCSSTransitionGroup.js";

import * as reduxPersist from 'redux-persist';
import localforage from "localforage";
// import _Perf from 'react-addons-perf'; // ES6
import page from "page";
import * as reduxPersistConstants from 'redux-persist/constants'
import * as reactRedux from "react-redux";
import { batchActions,enableBatching } from 'redux-batched-actions';

export const actionTypes = {
    reduxPersist: reduxPersistConstants
};

// export const Perf = process.env.NODE_ENV == "dev" ? _Perf : null;
export const Provider = reactRedux.Provider;
export const connect = reactRedux.connect;
export {
    page,
    Virtual,
    VirtualDom,
    reduxPersist,
    batchActions,
    localforage,
    Redux
}

export default {
    actionTypes,
    // Perf,
    Provider,
    connect,
    page,
    Virtual,
    VirtualDom,
    VirtualCSSTransitionGroup,
    reduxPersist,
    batchActions,
    enableBatching,
    localforage,
    Redux    
}

let { Redux, enableBatching, actionTypes, page } = window.interfaces;
let { combineReducers } = Redux;
let { REHYDRATE } = actionTypes.reduxPersist;
// import metaTagsReducer from "./metaTagsManager/reducer.js"

//import titleMap from "./navbar/routeTitleMap.js";
import { appVersion } from "../config.js";

import {
    ROUTE_CHANGE,
    ROUTE_UPDATE_TITLE,
    ROUTE_BEFORE_UNLOAD,
    SET_APP_VERSION,
    RESET_APP_PURGE,
    USER_LOGGEDIN,
    USER_LOGGEDOUT
} from "./actionTypes/actionTypes.js";

import { actionNameMap } from "./routeGenerator.js";

let titleMap = {};


const getTitle = (actionName, routeName) => {
    let key;
    if (actionName == actionNameMap.drawer) {
        key = routeName;
    } else {
        key = actionName || routeName;
    }
    return titleMap[key];
}


let isReload = null;
let getReloadStatus = () => {
    return isReload;
};

let routeDefault = {
    current: "",
    previous: "",
    previousName: "",
    routePath: "",
    routeName: "",
    actionName: "",
    query: {},
    back: false,
    title: "",
    subTitle: "",
    onBeforeUnload: null,
    //isReload: null
    getReloadStatus
};


const route = (state = routeDefault, action) => {
    let items = state.items;
    let title = "",
        subTitle = "",
        isSameRoute = false;

    switch (action.type) {
        case REHYDRATE:

            //To handle reload case
            if (isReload == null) {
                isReload = true;
                modulePrefetchStatus = {}; // reset object if reload
            } else if (isReload == true) {
                isReload = false
            }

            //routename and actionName are set to empty at reload to prevent asyn route rendering before load modules
            //Reload is detected by comparing state with default state, on reload both are same
            return {
                ...state,
                ...action.payload.route,
                routeName: state==routeDefault?"":action.payload.route.routeName,
                actionName: state==routeDefault?"":action.payload.route.actionName,
                back: false,
                query: {...action.payload.query,
                    navicon: "true"
                },
                getReloadStatus,
            };
        case ROUTE_CHANGE:
            //Check is previos and current route are same
            // let isPreviousPage = state.current == action.route.path;
            let actionName = action.route.actionName;
            let previousActionName = action.route.previousActionName;
            let routeName = action.route.routeName;
            isSameRoute = (state.current == action.route.path) || (actionName == actionNameMap.drawer);

            title = getTitle(actionName, routeName);

            if (actionName == actionNameMap.refine && state.title) {
                subTitle = `${state.title.substring(0,10)}...`;
            }

            let modulePrefetchStatus = state.modulePrefetchStatus || {};





            /**
             * WARNING : Following check diverts from standards
             * Standard : document.referral and document.location path can be same.
             * Ours : previous and current route path cannot be same.
             */
            if (!isSameRoute) {
                return {...state,
                    title,
                    subTitle,
                    previous: state.current,
                    previousName: state.routeName,
                    current: action.route.path,
                    routePath: action.route.path,
                    routeName,
                    actionName,
                    previousActionName,
                    back: action.route.direction == "backward",
                    onBeforeUnload: null,
                    /** 
                     * DEPRECATED
                     * Most of the time not all query paramaters are available in URL.                
                     * reducers are expected to handle ROUTE_CHANGE and keep there state updated if required.
                     */
                    query: {...state.query, ...action.route.query, exceptiontype: action.route.query.exceptiontype || null },
                    modulePrefetchStatus
                }
            }

            return {
                ...state,
                routeName,
                actionName,
                previousActionName,
                back: action.route.direction == "backward",
                //title,//For same route we need not reset it on route change
                //subTitle,//For same route we need not reset it on route change
                //onBeforeUnload: null,//For same route we need not reset it on route change
                /** 
                 * DEPRECATED
                 * Most of the time not all query paramaters are available in URL.                
                 * reducers are expected to handle ROUTE_CHANGE and keep there state updated if required.
                 */
                query: {...state.query, ...action.route.query, exceptiontype: action.route.query.exceptiontype || null },
                modulePrefetchStatus
            };
        case ROUTE_UPDATE_TITLE:
            return {
                ...state,
                title: action.payload.title
            };
        case ROUTE_BEFORE_UNLOAD:
            return {...state, onBeforeUnload: action.payload.onBeforeUnload };
        // case 'SET_UNREGAPPLY_URL':
        //     return {...state, ...action.payload };
        // case SET_CUSTOM_LOGIN_TITLE:
        //     return {...state, ...action.payload };
        // case USER_LOGGEDIN:
        //     return {...state, ... { customLoginTitle: '' } };
        default:
            return state;
    }
};


// const toast = (state = {}, action) => {
//     switch (action.type) {
//         case SHOW_TOAST:
//             return {...state, type: "error", autoHide: true, ...action.payload, status: true, tId: `toast-${Math.random()}` };
//         case REHYDRATE:
//         case HIDE_TOAST:
//             return {...state, status: false };
//         default:
//             return state;
//     }
// }


//loadTimeStamp is kept out to ensure it is calculated on load
let loadTimeStamp = (new Date()).getTime();
const app = (state = {
    purge: false,
    version: appVersion,
    TTL: loadTimeStamp,
    online: true
}, action) => {
    let oneDayMilliseconds = 86400000;
    let sixtyMilliseconds = 60000;
    let halfMinuteMilliseconds = 1800000;
    switch (action.type) {
        // case APP_ONLINE:
        //     if (!state.online) {
        //         return {...state, online: true };
        //     }
        //     return state;
        // case APP_OFFLINE:
        //     if (state.online) {
        //         return {...state, online: false };
        //     }
        //     return state;
        case SET_APP_VERSION:
            return {...state, version: action.payload.version };
        case RESET_APP_PURGE:
            return {...state, purge: false };
        case REHYDRATE:
            if (action.payload.app && (loadTimeStamp - action.payload.app.TTL >= oneDayMilliseconds)) {
                return {...state,
                    ...action.payload.app,
                    purge: true,
                    TTL: loadTimeStamp
                };
            }
            return {...state, ...action.payload.app };
        default:
            return state;
    }
}

/*const userDetail = (state = { isLoggedIn: false }, action) => {
    switch (action.type) {
        case USER_LOGGEDIN:
            return {...state, ...action.payload, isLoggedIn: true };
        case USER_LOGGEDOUT:
            return { isLoggedIn: false };
        default:
            return state;
    }
}*/

/*export let createReducer = (asyncReducers) => {
    return enableBatching(combineReducers({
        route,
        app,
        //userDetail,
        // toast,
        // metaTags: metaTagsReducer,
        ...asyncReducers
    }));
}*/

export {
    route,
    app
}

// export default {
//     route,
//     app
// }
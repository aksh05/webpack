webpackJsonp([5],{

/***/ 10:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return SET_APP_VERSION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return RESET_APP_PURGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return FETCH_REQUEST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return FETCH_FAILURE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return FETCH_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FETCH_COMPLETE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return REQUEST_ABORT_ALL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return REQUEST_ADD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return REQUEST_REMOVE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return ROUTE_CHANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return ROUTE_CHANGE_END; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return ROUTE_BEFORE_UNLOAD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return ROUTE_UPDATE_TITLE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return SHOW_TOAST; });
/* unused harmony export HIDE_TOAST */
/* unused harmony export USER_LOGGEDIN */
/* unused harmony export USER_LOGGEDOUT */
// APP
var SET_APP_VERSION = "SET_APP_VERSION";
var RESET_APP_PURGE = "RESET_APP_PURGE";

// AJAX
var FETCH_REQUEST = "FETCH_REQUEST";
var FETCH_FAILURE = "FETCH_FAILURE";
var FETCH_SUCCESS = "FETCH_SUCCESS";
var FETCH_COMPLETE = "FETCH_COMPLETE";
var REQUEST_ABORT_ALL = "REQUEST_ABORT_ALL";
var REQUEST_ADD = "REQUEST_ADD";
var REQUEST_REMOVE = "REQUEST_REMOVE";

// ROUTE
var ROUTE_CHANGE = "ROUTE_CHANGE";
var ROUTE_CHANGE_END = "ROUTE_CHANGE_END";
var ROUTE_BEFORE_UNLOAD = "ROUTE_BEFORE_UNLOAD";
var ROUTE_UPDATE_TITLE = "ROUTE_UPDATE_TITLE";

// TOAST
var SHOW_TOAST = "SHOW_TOAST";
var HIDE_TOAST = "HIDE_TOAST";

// AUTH
var USER_LOGGEDIN = "USER_LOGGEDIN";
var USER_LOGGEDOUT = "USER_LOGGEDOUT";

/***/ }),

/***/ 124:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__root_RootComponent_js__ = __webpack_require__(125);
var _window$interfaces = window.interfaces,
    VirtualDom = _window$interfaces.VirtualDom,
    Virtual = _window$interfaces.Virtual;


// import './../../webpack/webfont.font.js';

VirtualDom.render(Virtual.createElement(__WEBPACK_IMPORTED_MODULE_0__root_RootComponent_js__["a" /* default */], null), document.getElementById("root"));

/***/ }),

/***/ 125:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store_js__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actionCreators_js__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__routeConfig_js__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ajaxConfig_index_js__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__routeConfig_routeSanitizer_js__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__routeDependencies_js__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_CircularLoader__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__route_index_js__ = __webpack_require__(136);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _window$interfaces = window.interfaces,
    Virtual = _window$interfaces.Virtual,
    Redux = _window$interfaces.Redux,
    Provider = _window$interfaces.Provider,
    page = _window$interfaces.page;
var bindActionCreators = Redux.bindActionCreators;
var LazilyLoadWithLoader = window.interfaces.routeUtil.LazilyLoadWithLoader;
var UpdateStoreAndStyles = window.interfaces.storeUtil.UpdateStoreAndStyles;






// detecting flex
// import { detectFlexSupport } from "../../../../100/src/app/shims/flex.js";






var RootComponent = function (_Virtual$PureComponen) {
    _inherits(RootComponent, _Virtual$PureComponen);

    function RootComponent() {
        _classCallCheck(this, RootComponent);

        // this.state = undefined;
        var _this = _possibleConstructorReturn(this, (RootComponent.__proto__ || Object.getPrototypeOf(RootComponent)).apply(this, arguments));

        _this.store = null;
        Object(__WEBPACK_IMPORTED_MODULE_0__store_js__["a" /* configureStore */])(_this.state, function (store) {
            _this.store = store;

            __webpack_require__.e/* import() */(0).then(__webpack_require__.bind(null, 39)).then(function (resp) {
                resp.newMonk.init(_this.store);
            }).catch(function () {
                return 'An error occurred while loading the component';
            });

            // metagTagsManager.initanager.init(this.store);
            _this.store.subscribe(function () {
                _this.setState(_this.store.getState());
                // setPushData(this.store.getState().pushData);
            });
            window.globalActionCreators = _this.boundedActionCreators = bindActionCreators(__WEBPACK_IMPORTED_MODULE_1__actionCreators_js__, _this.store.dispatch);
            // routeConfig(this.boundedActionCreators, this.store);
            Object(__WEBPACK_IMPORTED_MODULE_3__ajaxConfig_index_js__["a" /* default */])(_this.store);
            // userPrompt(this.boundedActionCreators, this.store);
            page({
                popstate: true,
                dispatch: false // Prevent default initalPathname handling
            });

            var initalPath = Object(__WEBPACK_IMPORTED_MODULE_4__routeConfig_routeSanitizer_js__["a" /* removeDrawerAction */])("" + document.location.pathname + document.location.search);
            var showNavIcon = document.location.search.indexOf("navicon=false") === -1;
            var shouldAddRootPage = true && showNavIcon;

            /**
             *   Code to add root page in history if internal page is loaded initially
             */
            if (shouldAddRootPage) {
                // let state = this.store.getState();
                var _false = false,
                    isLoggedIn = _false.isLoggedIn;

                var rootPathList = ["/"];
                var initalPathname = document.location.pathname;
                var isNotRootPathname = rootPathList.indexOf(initalPathname) === -1;
                var rootCustomHandling = false;
                rootCustomHandling = isNotRootPathname ? true : false;

                // Get root page to be added to history
                var rootPathname = "";
                if (isLoggedIn) {
                    rootPathname = rootPathList[1];
                } else {
                    rootPathname = rootPathList[0];
                }

                // Conditional route handler for root page
                page(rootPathname, function (ctx, next) {
                    if (rootCustomHandling) {
                        rootCustomHandling = false;
                        setTimeout(function () {
                            page(initalPath);
                        }, 0);
                    } else {
                        next(ctx);
                    }
                });

                // All Route handlers
                Object(__WEBPACK_IMPORTED_MODULE_2__routeConfig_js__["a" /* default */])(_this.boundedActionCreators, _this.store);

                // Redirect to root if not root page else default behavior
                if (rootCustomHandling) {
                    page.redirect(rootPathname);
                } else {
                    page.redirect(initalPath);
                }
            } else {
                // All Route handlers
                Object(__WEBPACK_IMPORTED_MODULE_2__routeConfig_js__["a" /* default */])(_this.boundedActionCreators, _this.store);
                page.redirect(initalPath);
            }
        });
        return _this;
    }

    _createClass(RootComponent, [{
        key: "attachedCallback",
        value: function attachedCallback() {
            // detectFlexSupport();
        }
    }, {
        key: "renderLazyFlow",
        value: function renderLazyFlow(_ref) {
            var flow = _ref.flow;
            var _flow$default = flow.default,
                reducer = _flow$default.reducer,
                FlowContainer = _flow$default.FlowContainer;

            return Virtual.createElement(
                UpdateStoreAndStyles,
                { reducer: reducer },
                function () {
                    if (FlowContainer) {
                        return Virtual.createElement(FlowContainer, null);
                    }
                    return null;
                }
            );
        }
    }, {
        key: "renderRoute",
        value: function renderRoute() {
            return Virtual.createElement(
                "div",
                null,
                Virtual.createElement(__WEBPACK_IMPORTED_MODULE_7__route_index_js__["a" /* default */], { path: "/startPage", component: 'FlowContainer', modules: __WEBPACK_IMPORTED_MODULE_5__routeDependencies_js__["a" /* lazyFlowName */] }),
                Virtual.createElement(__WEBPACK_IMPORTED_MODULE_7__route_index_js__["a" /* default */], { path: "/home", component: 'HomeContainer', modules: __WEBPACK_IMPORTED_MODULE_5__routeDependencies_js__["c" /* lazyFlow_Home */] }),
                Virtual.createElement(__WEBPACK_IMPORTED_MODULE_7__route_index_js__["a" /* default */], { path: "/about", component: 'AboutContainer', modules: __WEBPACK_IMPORTED_MODULE_5__routeDependencies_js__["b" /* lazyFlow_About */] })
            );
        }
    }, {
        key: "render",
        value: function render() {
            if (this.store) {
                var loader = Virtual.createElement(__WEBPACK_IMPORTED_MODULE_6_CircularLoader__["a" /* default */], { size: "small" });
                return Virtual.createElement(
                    Provider,
                    { store: this.store },
                    Virtual.createElement(
                        "div",
                        { className: "root" },
                        Virtual.createElement(
                            "h5",
                            null,
                            "Route based view"
                        ),
                        this.renderRoute(),
                        Virtual.createElement(
                            "h5",
                            null,
                            "Lazy loaded view"
                        ),
                        Virtual.createElement(
                            LazilyLoadWithLoader,
                            { style: { width: "300px" }, loader: loader, modules: __WEBPACK_IMPORTED_MODULE_5__routeDependencies_js__["a" /* lazyFlowName */] },
                            this.renderLazyFlow
                        )
                    )
                );
            }
            return null;
        }
    }]);

    return RootComponent;
}(Virtual.PureComponent);

/* harmony default export */ __webpack_exports__["a"] = (RootComponent);

/***/ }),

/***/ 126:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = configureStore;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__reducer_js__ = __webpack_require__(127);


// import * as initialReducers from "./reducer.js";
var _window$interfaces = window.interfaces,
    storeUtil = _window$interfaces.storeUtil,
    reduxPersist = _window$interfaces.reduxPersist;


function configureStore() {
    var intialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    var rehydrationCallback = arguments[1];

    var store = storeUtil.configureStore(__WEBPACK_IMPORTED_MODULE_1__reducer_js__, intialState, [reduxPersist.autoRehydrate()]);

    if (window.isCrawler) {
        rehydrationCallback(store);
    } else {
        var whiteListedKeys = ["app"];
        storeUtil.hydrateStore({
            persistConfig: __WEBPACK_IMPORTED_MODULE_0__config_js__["c" /* persistConfig */],
            appVersion: __WEBPACK_IMPORTED_MODULE_0__config_js__["a" /* appVersion */],
            whiteListedKeys: whiteListedKeys,
            storageConfig: __WEBPACK_IMPORTED_MODULE_0__config_js__["d" /* storageConfig */]
        }, rehydrationCallback);
    }
}

/***/ }),

/***/ 127:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "route", function() { return route; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "app", function() { return app; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actionTypes_actionTypes_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__routeGenerator_js__ = __webpack_require__(36);
var _window$interfaces = window.interfaces,
    Redux = _window$interfaces.Redux,
    enableBatching = _window$interfaces.enableBatching,
    actionTypes = _window$interfaces.actionTypes,
    page = _window$interfaces.page;
var combineReducers = Redux.combineReducers;
var REHYDRATE = actionTypes.reduxPersist.REHYDRATE;
// import metaTagsReducer from "./metaTagsManager/reducer.js"

//import titleMap from "./navbar/routeTitleMap.js";







var titleMap = {};

var getTitle = function getTitle(actionName, routeName) {
    var key = void 0;
    if (actionName == __WEBPACK_IMPORTED_MODULE_2__routeGenerator_js__["a" /* actionNameMap */].drawer) {
        key = routeName;
    } else {
        key = actionName || routeName;
    }
    return titleMap[key];
};

var isReload = null;
var getReloadStatus = function getReloadStatus() {
    return isReload;
};

var routeDefault = {
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
    getReloadStatus: getReloadStatus
};

var route = function route() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : routeDefault;
    var action = arguments[1];

    var items = state.items;
    var title = "",
        subTitle = "",
        isSameRoute = false;

    switch (action.type) {
        case REHYDRATE:

            //To handle reload case
            if (isReload == null) {
                isReload = true;
                modulePrefetchStatus = {}; // reset object if reload
            } else if (isReload == true) {
                isReload = false;
            }

            //routename and actionName are set to empty at reload to prevent asyn route rendering before load modules
            //Reload is detected by comparing state with default state, on reload both are same
            return Object.assign({}, state, action.payload.route, {
                routeName: state == routeDefault ? "" : action.payload.route.routeName,
                actionName: state == routeDefault ? "" : action.payload.route.actionName,
                back: false,
                query: Object.assign({}, action.payload.query, {
                    navicon: "true"
                }),
                getReloadStatus: getReloadStatus
            });
        case __WEBPACK_IMPORTED_MODULE_1__actionTypes_actionTypes_js__["j" /* ROUTE_CHANGE */]:
            //Check is previos and current route are same
            // let isPreviousPage = state.current == action.route.path;
            var actionName = action.route.actionName;
            var previousActionName = action.route.previousActionName;
            var routeName = action.route.routeName;
            isSameRoute = state.current == action.route.path || actionName == __WEBPACK_IMPORTED_MODULE_2__routeGenerator_js__["a" /* actionNameMap */].drawer;

            title = getTitle(actionName, routeName);

            if (actionName == __WEBPACK_IMPORTED_MODULE_2__routeGenerator_js__["a" /* actionNameMap */].refine && state.title) {
                subTitle = state.title.substring(0, 10) + "...";
            }

            var modulePrefetchStatus = state.modulePrefetchStatus || {};

            /**
             * WARNING : Following check diverts from standards
             * Standard : document.referral and document.location path can be same.
             * Ours : previous and current route path cannot be same.
             */
            if (!isSameRoute) {
                return Object.assign({}, state, {
                    title: title,
                    subTitle: subTitle,
                    previous: state.current,
                    previousName: state.routeName,
                    current: action.route.path,
                    routePath: action.route.path,
                    routeName: routeName,
                    actionName: actionName,
                    previousActionName: previousActionName,
                    back: action.route.direction == "backward",
                    onBeforeUnload: null,
                    /** 
                     * DEPRECATED
                     * Most of the time not all query paramaters are available in URL.                
                     * reducers are expected to handle ROUTE_CHANGE and keep there state updated if required.
                     */
                    query: Object.assign({}, state.query, action.route.query, { exceptiontype: action.route.query.exceptiontype || null }),
                    modulePrefetchStatus: modulePrefetchStatus
                });
            }

            return Object.assign({}, state, {
                routeName: routeName,
                actionName: actionName,
                previousActionName: previousActionName,
                back: action.route.direction == "backward",
                //title,//For same route we need not reset it on route change
                //subTitle,//For same route we need not reset it on route change
                //onBeforeUnload: null,//For same route we need not reset it on route change
                /** 
                 * DEPRECATED
                 * Most of the time not all query paramaters are available in URL.                
                 * reducers are expected to handle ROUTE_CHANGE and keep there state updated if required.
                 */
                query: Object.assign({}, state.query, action.route.query, { exceptiontype: action.route.query.exceptiontype || null }),
                modulePrefetchStatus: modulePrefetchStatus
            });
        case __WEBPACK_IMPORTED_MODULE_1__actionTypes_actionTypes_js__["l" /* ROUTE_UPDATE_TITLE */]:
            return Object.assign({}, state, {
                title: action.payload.title
            });
        case __WEBPACK_IMPORTED_MODULE_1__actionTypes_actionTypes_js__["i" /* ROUTE_BEFORE_UNLOAD */]:
            return Object.assign({}, state, { onBeforeUnload: action.payload.onBeforeUnload });
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
var loadTimeStamp = new Date().getTime();
var app = function app() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        purge: false,
        version: __WEBPACK_IMPORTED_MODULE_0__config_js__["a" /* appVersion */],
        TTL: loadTimeStamp,
        online: true
    };
    var action = arguments[1];

    var oneDayMilliseconds = 86400000;
    var sixtyMilliseconds = 60000;
    var halfMinuteMilliseconds = 1800000;
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
        case __WEBPACK_IMPORTED_MODULE_1__actionTypes_actionTypes_js__["m" /* SET_APP_VERSION */]:
            return Object.assign({}, state, { version: action.payload.version });
        case __WEBPACK_IMPORTED_MODULE_1__actionTypes_actionTypes_js__["h" /* RESET_APP_PURGE */]:
            return Object.assign({}, state, { purge: false });
        case REHYDRATE:
            if (action.payload.app && loadTimeStamp - action.payload.app.TTL >= oneDayMilliseconds) {
                return Object.assign({}, state, action.payload.app, {
                    purge: true,
                    TTL: loadTimeStamp
                });
            }
            return Object.assign({}, state, action.payload.app);
        default:
            return state;
    }
};

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



// export default {
//     route,
//     app
// }

/***/ }),

/***/ 128:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* unused harmony export defineNamedModule */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__expressRoutes_js__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__expressRoutes_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__expressRoutes_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__routeGenerator_js__ = __webpack_require__(36);
/**
 * Author : Ankit Anand
 * Open Issue 
    * In offline case, attempts to load module n times, causes initialSuccessCallback also to fire n times.Issue is with requirejs internal. 
    Impact Calls route change action n times
 * 
 */

var page = window.interfaces.page;



var injectAsyncReducer = window.interfaces.storeUtil.injectAsyncReducer;



/**
 * @param  {[Object]}
 * @return {[type]}
 */
var requireErrorCallback = function requireErrorCallback(err) {
    //Undefine failed module id
    err.requireModules.map(function (failedId) {
        requirejs.undef(failedId);
    });
};

/**
 * Inject styleString in <head>
 * @param  {[String]}
 * @return {[type]}
 */
var injectAsyncStyles = function injectAsyncStyles(styleString) {
    $("head").append("<style>" + styleString + "</style>");
};

/**
 * Define module by the name <moduleId> and value <response>. Allow to statically require module using moduleId:
 * Example : let searchFlow = require("searchFlow"); 
 * @param  {[String]}
 * @param  {[Object]}
 * @return {[Promise]}
 */
var defineNamedModule = function defineNamedModule(moduleId, response) {
    //Define named module
    define(moduleId, response);
    return new Promise(function (resolve, reject) {
        requirejs([moduleId], resolve, reject);
    });
};

var loadModuleSuccess = function loadModuleSuccess(action) {};

var loadModuleError = function loadModuleError(action) {
    //To set url back to previousily loaded page
    window.history.back();
};
var parseQuery = function parseQuery(ctx, next) {

    __webpack_require__.e/* import() */(0).then(__webpack_require__.bind(null, 39)).then(function (resp) {
        return resp.logAppLaunch(ctx.querystring);
    }).catch(function (error) {
        return 'An error occurred while loading the component';
    });

    var query = {};
    var querystring = ctx.querystring;
    if (querystring) {
        var splittedQuery = querystring.split("&");

        for (var i = 0, len = splittedQuery.length; i < len; i++) {
            if (splittedQuery[i]) {
                var nameValuePair = splittedQuery[i].split("=");
                var name = nameValuePair[0];
                var value = nameValuePair[1];
                var arrayName = name.match(/(.*)\[\]$/);
                if (arrayName) {
                    var _name = arrayName[1];
                    if (!query[_name]) {
                        query[_name] = [];
                        query[_name].push(value);
                    }
                } else {
                    query[name] = value;
                }
            }
        }
    }
    ctx.params = Object.assign({}, ctx.params, query);
    next();
};

/* harmony default export */ __webpack_exports__["a"] = (function (actions, store) {
    var slideCount = -1;
    var onPageChange = function onPageChange(ctx, routeName) {
        var externalQuery = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var state = store.getState();
        var direction = void 0;
        var actionName = "";

        if (ctx.state.slideCount != undefined) {
            direction = slideCount < ctx.state.slideCount ? "forward" : "backward";
            slideCount = ctx.state.slideCount;
        } else {
            direction = "forward";
            setTimeout(function () {
                ctx.state.slideCount = ++slideCount;
                ctx.save();
            }, 0);
        }

        var query = Object.assign({}, externalQuery, ctx.params);

        if (query.action) {
            actionName = query.action;
        }

        var previousRoute = store.getState().route;
        var drawerAction = __WEBPACK_IMPORTED_MODULE_1__routeGenerator_js__["a" /* actionNameMap */].drawer;
        /** Following check is not required anymore */
        if (previousRoute.actionName == drawerAction || actionName == drawerAction) {
            //In case of routing of drawer we don't want scroll to 0
        } else {
            window.requestAnimationFrame(function () {
                $(window).scrollTop(0);
            });
        }

        actions.routeChange({
            path: ctx.path,
            routeName: routeName,
            actionName: actionName,
            direction: direction,
            query: query,
            previousName: state.route.routeName,
            previousActionName: state.route.actionName,
            getReloadStatus: state.route.getReloadStatus
        });
    };

    //Add query paramas to ctx.params
    page("*", parseQuery);

    page(__WEBPACK_IMPORTED_MODULE_0__expressRoutes_js___default.a.startPage, function (ctx, next) {
        onPageChange(ctx, "startPage");
    }, function (ctx, next) {
        next();
    });

    page(__WEBPACK_IMPORTED_MODULE_0__expressRoutes_js___default.a.about, function (ctx, next) {
        onPageChange(ctx, "about");
    }, function (ctx, next) {
        next();
    });

    page(__WEBPACK_IMPORTED_MODULE_0__expressRoutes_js___default.a.home, function (ctx, next) {
        onPageChange(ctx, "home");
    }, function (ctx, next) {
        next();
    });

    /**************ROUTE AUTHENTICATION START*****************/
    page('*', function (ctx, next) {
        onPageChange(ctx, "exception");
    }, function (ctx, next) {
        next();
    });
    /**************ROUTE AUTHENTICATION END*****************/

    page.exit('*', function (ctx, next) {
        if (store.getState().sidebar) {
            actions.toggleSidebar();
        }
        next(ctx);
    });
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(1)))

/***/ }),

/***/ 129:
/***/ (function(module, exports) {


var expressRoutes = {
    "startPage": "/",
    "about": "/about",
    "home": "/home"
    // Define your app routing here e.g.,
    // "routeName": "/route"
};

module.exports = expressRoutes;

/***/ }),

/***/ 130:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actionCreator_js__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actionCreators_js__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pendingRequestManager_js__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__actionTypes_actionTypes_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__config_js__ = __webpack_require__(9);


// import { appOnline, appOffline } from "../actionCreators.js";


// import { USER_LOGGEDOUT } from "../../loginFlow/actionTypes.js";
// import loginFlowActions from "../../loginFlow/actionCreator.js";


var _window$interfaces = window.interfaces,
    page = _window$interfaces.page,
    Redux = _window$interfaces.Redux,
    batchActions = _window$interfaces.batchActions;
var bindActionCreators = Redux.bindActionCreators;

var authId = void 0;
var route = "";
var pendingReqMgr = null;
var bindedActions = void 0,
    bindedRootActions = void 0,
    bindedLoginActions = void 0;
var routeObj = {};

/*let forcedLogout = ({ dispatch, customLoginTitle }) => {
    window.forcedLogoutCount = (window.forcedLogoutCount) ? (window.forcedLogoutCount + 1) : 1;
    dispatch({
        type: USER_LOGGEDOUT
    });
    // if (customLoginTitle) {
    //     dispatch({
    //         type: SET_CUSTOM_LOGIN_TITLE,
    //         payload: {
    //             customLoginTitle: customLoginTitle // will be unset after login
    //         }
    //     });
    // }
    // page("/mnj/logout?errorMsg=Please login to proceed");
};*/

var isApiAuthDependent = function isApiAuthDependent(url) {
    var matches = url.match(__WEBPACK_IMPORTED_MODULE_4__config_js__["b" /* authDependentApiRegexp */]);
    return matches && matches.length ? true : false;
};

// const refreshAccessTokens = ({ params, dispatch, resolve, reject, failedXhr, resolveType }) => {
//     return $.ajax({
//             url: config.loginUrl,
//             method: "GET"
//         })
//         .then((data) => {
//             if (data && data.access_token) { // successfully refreshed

//                 $.ajax(params).then((data, textStatus, jqXHR) => { //success of prev ajax
//                     // resolve(data, textStatus, jqXHR);
//                     (resolveType === 'obj') ? resolve({ data, textStatus, jqXHR }): resolve(data, textStatus, jqXHR);
//                 }, (jqXHR, textStatus, errorThrown) => { // failure of prev ajax
//                     // reject(jqXHR, textStatus, errorThrown);
//                     (resolveType === 'obj') ? reject({ jqXHR, textStatus, errorThrown }): reject(jqXHR, textStatus, errorThrown);
//                 });

//             } else { // failed
//                 // if (isApiAuthDependent(params.url)) {
//                 //     forcedLogout({ dispatch });
//                 // } else {
//                     (resolveType === 'obj') ? reject({ failedXhr }): reject(failedXhr);
//                 // }
//             }

//         }, (d) => { // failed
//             if (isApiAuthDependent(params.url)) {
//                 forcedLogout({ dispatch });
//             } else {
//                 (resolveType === 'obj') ? reject({ failedXhr }): reject(failedXhr);
//             }
//         });
// };

var reLoginCallback = function reLoginCallback(_ref) {
    var reAttemptOnReLogin = _ref.reAttemptOnReLogin,
        params = _ref.params,
        dispatch = _ref.dispatch,
        resolve = _ref.resolve,
        reject = _ref.reject,
        path = _ref.path,
        resolveType = _ref.resolveType;


    // After reLogin, always redirect to last path
    // But reAttempt only if required

    path = path.indexOf('/mnj/login') >= 0 ? '/mnj/dashboard' : path;
    page.redirect(path);

    if (reAttemptOnReLogin) {
        $.ajax(params).then(function (data, textStatus, jqXHR) {
            //success of prev ajax
            resolveType === 'obj' ? resolve({ data: data, textStatus: textStatus, jqXHR: jqXHR }) : resolve(data, textStatus, jqXHR);
        }, function (jqXHR, textStatus, errorThrown) {
            // failure of prev ajax
            resolveType === 'obj' ? reject({ jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown }) : reject(jqXHR, textStatus, errorThrown);
        });
    }
};

var errorHandler = function errorHandler(jqXHR, textStatus, errorThrown, dispatch) {
    console.log(jqXHR, textStatus, errorThrown);
    if (jqXHR.status == 0) {
        //Move in pending request manager
        /*dispatch(appOffline());*/
    } else if (jqXHR.status == 500) {
        dispatch({
            type: __WEBPACK_IMPORTED_MODULE_3__actionTypes_actionTypes_js__["n" /* SHOW_TOAST */],
            payload: {
                message: "Oops! something went wrong",
                type: "error"
            }
        });
    } else if ( /*jqXHR.status == 0 || */textStatus == "timeout") {
        dispatch({
            type: __WEBPACK_IMPORTED_MODULE_3__actionTypes_actionTypes_js__["n" /* SHOW_TOAST */],
            payload: {
                message: "Please check your internet connection and refresh",
                type: "error"
            }
        });
    } else {
        if (true) {
            var errObj = jqXHR.responseJSON && jqXHR.responseJSON.error;
            var errDetails = errObj && errObj.validationErrorDetails && errObj.validationErrorDetails[0];
            var msg = errDetails && errDetails['qm,qx'] && ', ' + errDetails['qm,qx'].message || '';
            dispatch({
                type: __WEBPACK_IMPORTED_MODULE_3__actionTypes_actionTypes_js__["n" /* SHOW_TOAST */],
                payload: {
                    message: jqXHR.statusText + msg,
                    type: "error"
                }
            });
        }
    }
    dispatch({
        type: __WEBPACK_IMPORTED_MODULE_3__actionTypes_actionTypes_js__["b" /* FETCH_FAILURE */]
    });
};

var successHandler = function successHandler(_ref2) {
    var data = _ref2.data,
        textStatus = _ref2.textStatus,
        jqXHR = _ref2.jqXHR,
        url = _ref2.url,
        dispatch = _ref2.dispatch;

    var actionList = [];
    //Moved it to pending request manager
    /*actionList.push(appOnline());*/
    if (data) {
        //Specifically for JD
        var seo = data.seo || data.job && data.job.seo /*|| { htmlTags: { name: "abcd" } }*/;
        if (seo) {
            var metaTags = seo.htmlTags;
            //bindedRootActions.addMetaTags(metaTags);
            //actionList.push(rootActions.addMetaTags(metaTags));
        }
    }
    dispatch(batchActions(actionList));
};

var overrideAjax = function overrideAjax(dispatch) {
    var orignalAJax = $.ajax;

    //Override orignal AJAX
    $.ajax = function (params) {
        var promise = new Promise(function (resolve, reject) {
            params.method = params.method ? params.method : "GET";
            orignalAJax(params).then(function (data, textStatus, jqXHR) {
                if (data && data.error) {
                    var modifiedjqXHR = Object.assign({}, jqXHR, { status: data.error.status });
                    reject(modifiedjqXHR);
                } else {
                    resolve(data, textStatus, jqXHR, params.method);
                }
            }, function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 401 && isApiAuthDependent(params.url)) {

                    var path = window.location.pathname;
                    var customLoginTitle = params.customLoginTitle || '';
                    // if (params.reAttemptOnReLogin) {}
                    bindedLoginActions.loginCallbacksSet({
                        success: function success() {
                            reLoginCallback({ reAttemptOnReLogin: params.reAttemptOnReLogin, params: params, dispatch: dispatch, resolve: resolve, reject: reject, path: path, resolveType: '' });
                        }
                    });
                    //forcedLogout({ dispatch, customLoginTitle });
                } else if (jqXHR.status == 403) {
                    // refreshAccessTokens({ params, dispatch, resolve, reject, failedXhr: jqXHR, resolveType: '' }); // dont reject, and try to re-authenticate and resend this ajax
                } else if (jqXHR.status == 201) {
                    //Custom handling for save job api in old codebase
                    resolve("", textStatus, jqXHR, params.method);
                } else {
                    reject(jqXHR, textStatus, errorThrown, params.method);
                }
            });
        });
        promise.then(function (data, textStatus, jqXHR) {
            successHandler({
                data: data,
                textStatus: textStatus,
                jqXHR: jqXHR,
                url: params.url,
                dispatch: dispatch
            });
        }, function (jqXHR, textStatus, errorThrown) {
            errorHandler(jqXHR, textStatus, errorThrown, dispatch);
        });
        return promise;
    };

    $.ajaxPromise = function (params) {
        var promise = new Promise(function (resolve, reject) {
            orignalAJax(params).then(function (data, textStatus, jqXHR) {
                if (data && data.error) {
                    var modifiedjqXHR = Object.assign({}, jqXHR, { status: data.error.status });
                    reject(modifiedjqXHR);
                } else {
                    resolve({ data: data, textStatus: textStatus, jqXHR: jqXHR });
                }
            }, function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 401 && isApiAuthDependent(params.url)) {
                    var path = window.location.pathname;
                    var customLoginTitle = params.customLoginTitle || '';
                    bindedLoginActions.loginCallbacksSet({
                        success: function success() {
                            reLoginCallback({ reAttemptOnReLogin: params.reAttemptOnReLogin, params: params, dispatch: dispatch, resolve: resolve, reject: reject, path: path, resolveType: 'obj' });
                        }
                    });
                    //forcedLogout({ dispatch, customLoginTitle });
                }
                if (jqXHR.status == 403) {
                    // refreshAccessTokens({ params, dispatch, resolve, reject, failedXhr: jqXHR, resolveType: 'obj' }); // dont reject, and try to re-authenticate and resend this ajax
                } else if (jqXHR.status == 201) {
                    //Custom handling for save job api in old codebase
                    resolve({ data: "", textStatus: textStatus, jqXHR: jqXHR });
                } else {
                    reject({ jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown });
                }
            });
        });
        promise.then(function (_ref3) {
            var data = _ref3.data,
                textStatus = _ref3.textStatus,
                jqXHR = _ref3.jqXHR;

            successHandler({
                data: data,
                textStatus: textStatus,
                jqXHR: jqXHR,
                url: params.url,
                dispatch: dispatch
            });
        }, function (_ref4) {
            var jqXHR = _ref4.jqXHR,
                textStatus = _ref4.textStatus,
                errorThrown = _ref4.errorThrown;

            errorHandler(jqXHR, textStatus, errorThrown, dispatch);
        });
        return promise;
    };
};

var addAjaxPrefilters = function addAjaxPrefilters() {
    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        //options.timeout = 10000;
        //options.dataType = "json";
        //Handlign DELETE request
        if (options.method == "DELETE") {
            options.method = "POST";
            options.type = "POST";
            options.headers = Object.assign({}, options.headers, { "X-HTTP-Method-Override": "DELETE" });
        }

        // Setting tracking header for all except ncuploader apis

        // Other exceptions can be added here too
        if (!options.url.match(/(\/saveFile.php|\/saveUrlFile.php|\/nLogger\/)/gi)) {
            options.headers = Object.assign({}, options.headers, { "clientId": "m0b5" });
        }

        //Add Authorization header if exist 
        if (authId && "dev" == "dev") {
            options.headers = Object.assign({}, options.headers, {
                authorization: "NAUKRIAUTH id=" + authId
            });
        }

        //Add Os header
        // if (!options.crossDomain) {
        //     options.headers = {...options.headers,
        //         "os": window.os.toLowerCase()
        //     };
        // }

        // if (authId && process.env.NODE_ENV != "dev") {
        //     options.headers = {...options.headers,
        //         'Access-Control-Allow-Credentials': true
        //     }
        // }
        if (options.abortOnRouteChange && !options.crossDomain) {
            //Log request with pendingReqMgr
            pendingReqMgr.add(jqXHR, options.method || "GET"); // if method is not available then we assume it is a kind of GET request
        }
    });
};

var addAjaxSetup = function addAjaxSetup() {
    $.ajaxSetup({
        abortOnRouteChange: true,
        timeout: 10000,
        dataType: "json",
        reAttemptOnReLogin: false,
        xhrFields: {
            withCredentials: true
        }
    });
};

/* harmony default export */ __webpack_exports__["a"] = (function (store) {
    overrideAjax(store.dispatch);
    addAjaxSetup();
    addAjaxPrefilters();
    bindedRootActions = bindActionCreators(Object.assign({}, __WEBPACK_IMPORTED_MODULE_1__actionCreators_js__), store.dispatch);
    bindedActions = bindActionCreators(__WEBPACK_IMPORTED_MODULE_0__actionCreator_js__, store.dispatch);
    // bindedLoginActions = bindActionCreators(loginFlowActions, store.dispatch);
    pendingReqMgr = new __WEBPACK_IMPORTED_MODULE_2__pendingRequestManager_js__["a" /* default */](bindedActions, bindedRootActions, store.getState());

    store.subscribe(function () {
        var state = store.getState();
        routeObj = state.route;
        /*if (authId != state.userDetail.authId) {
            authId = state.userDetail.authId;
        }*/
        pendingReqMgr.onStoreUpdate(state, bindedRootActions);
    });
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(1)))

/***/ }),

/***/ 131:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addRequest", function() { return addRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeRequest", function() { return removeRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "abortAllRequest", function() { return abortAllRequest; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actionTypes_actionTypes_js__ = __webpack_require__(10);


var addRequest = function addRequest(_ref) {
    var request = _ref.request,
        method = _ref.method;

    return {
        type: __WEBPACK_IMPORTED_MODULE_0__actionTypes_actionTypes_js__["f" /* REQUEST_ADD */],
        payload: { request: request, method: method }
    };
};

var removeRequest = function removeRequest(_ref2) {
    var request = _ref2.request,
        method = _ref2.method;

    return {
        type: __WEBPACK_IMPORTED_MODULE_0__actionTypes_actionTypes_js__["g" /* REQUEST_REMOVE */],
        payload: { request: request, method: method }
    };
};

var abortAllRequest = function abortAllRequest(request) {
    return {
        type: __WEBPACK_IMPORTED_MODULE_0__actionTypes_actionTypes_js__["e" /* REQUEST_ABORT_ALL */]
    };
};

/***/ }),

/***/ 132:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Offline_js__ = __webpack_require__(133);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var _class = function () {
    function _class(ajaxStoreActions, rootActions, globalState) {
        _classCallCheck(this, _class);

        //Array of pending requests
        this.success = this.success.bind(this);
        this.error = this.error.bind(this);
        this.ajaxStoreActions = ajaxStoreActions;
        this.rootActions = rootActions;
        //Start checking offline status in intervals
        //this.offlineInstance = new Offline(rootActions, globalState);
    }

    _createClass(_class, [{
        key: "onStoreUpdate",
        value: function onStoreUpdate(state, actions) {
            //this.offlineInstance.onStateChange(state);
        }
    }, {
        key: "success",
        value: function success(data, textStatus, jqXHR, method) {
            //this.offlineInstance.onRequestSuccess();
            this.remove({ request: jqXHR, method: method });
        }
    }, {
        key: "error",
        value: function error(jqXHR, textStatus, errorThrown, method) {
            if (jqXHR.status == 0) {
                //this.offlineInstance.onRequestFailure();
            }
            this.remove({ request: jqXHR, method: method });
        }

        /**
         * [add Add to pending request list and clear it once completed ]
         * @param {[type]} jqXHR [description]
         */

    }, {
        key: "add",
        value: function add(jqXHR, method) {
            var _this = this;

            setTimeout(function () {
                _this.ajaxStoreActions.addRequest({ request: jqXHR, method: method });
            }, 0);
            // jqXHR.then(this.success, this.error);
            jqXHR.then(function (data, textStatus, jqXHR) {
                _this.success(data, textStatus, jqXHR, method);
            }, function (data, textStatus, jqXHR) {
                _this.error(data, textStatus, jqXHR, method);
            });
        }

        /**
         * [remove Remove from pending request list]
         * @param  {[type]} jqXHR [description]
         * @return {[type]}       [description]
         */

    }, {
        key: "remove",
        value: function remove(obj) {
            var _this2 = this;

            setTimeout(function () {
                _this2.ajaxStoreActions.removeRequest(obj);
            }, 0);
        }
    }]);

    return _class;
}();

/* harmony default export */ __webpack_exports__["a"] = (_class);

/***/ }),

/***/ 133:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Offline = function () {
    function Offline(rootActions, globalState) {
        _classCallCheck(this, Offline);

        this.rootActions = rootActions;
        this.interval = null;
        this.checkInInterval();
        this.globalState = globalState;
        this.render();
    }

    _createClass(Offline, [{
        key: "onStateChange",
        value: function onStateChange(state) {
            this.globalState = state;
        }
    }, {
        key: "onRequestSuccess",
        value: function onRequestSuccess() {
            if (!this.globalState.app.online) {
                this.rootActions.appOnline();
                this.render();
            }
            //this.resetInterval();
        }
    }, {
        key: "onRequestFailure",
        value: function onRequestFailure() {
            if (this.globalState.app.online) {
                this.rootActions.appOffline();
                this.render();
            }
            //this.resetInterval();
        }
    }, {
        key: "checkThroughPixel",
        value: function checkThroughPixel() {
            var _this = this;

            $.ajaxPromise({
                "url": "./favicon.icon"
            }).then(function () {
                _this.onRequestSuccess();
            }, function () {
                _this.onRequestFailure();
            });
        }
    }, {
        key: "checkInInterval",
        value: function checkInInterval() {
            var _this2 = this;

            this.interval = setInterval(function () {
                _this2.checkThroughPixel();
            }, 3000);
        }
    }, {
        key: "resetInterval",
        value: function resetInterval() {
            clearInterval(this.interval);
            this.checkInInterval();
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            requestAnimationFrame(function () {
                document.body.style.filter = "grayScale(" + (_this3.globalState.app.online ? 0 : 1) + ")";
            });
        }
    }]);

    return Offline;
}();

/* unused harmony default export */ var _unused_webpack_default_export = (Offline);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(1)))

/***/ }),

/***/ 134:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return removeDrawerAction; });

var removeDrawerAction = function removeDrawerAction(route) {
    return route.replace(/[&?]action=drawerOpen/g, "");
};

/***/ }),

/***/ 135:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return lazyFlowName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return lazyFlow_Home; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return lazyFlow_About; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config_js__ = __webpack_require__(9);
var loadModulePromise = window.interfaces.routeUtil.loadModulePromise;



var lazyFlowName = {
    flow: function flow() {
        return __webpack_require__.e/* import() */(2).then(__webpack_require__.bind(null, 138));
    }
    // styles: () => import (/* webpackChunkName: "flowCSS" */"flowNameCSS"),
};

var lazyFlow_Home = {
    flow: function flow() {
        return __webpack_require__.e/* import() */(1).then(__webpack_require__.bind(null, 139));
    }
    // styles: () => import (/* webpackChunkName: "homeCSS" */"homeNameCSS"),
};

var lazyFlow_About = {
    flow: function flow() {
        return __webpack_require__.e/* import() */(3).then(__webpack_require__.bind(null, 140));
    }
    // styles: () => import (/* webpackChunkName: "aboutCSS" */"aboutNameCSS"),
};

/***/ }),

/***/ 136:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Route_js__ = __webpack_require__(137);
// Your first container...
var connect = window.interfaces.connect;



var mapStateToProps = function mapStateToProps(state) {
    return {
        routeName: state.route.routeName
    };
};

/* const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
}*/

/* harmony default export */ __webpack_exports__["a"] = (connect(mapStateToProps, null)(__WEBPACK_IMPORTED_MODULE_0__Route_js__["a" /* default */]));

/***/ }),

/***/ 137:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_CircularLoader__ = __webpack_require__(38);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Virtual = window.interfaces.Virtual;
var LazilyLoadWithLoader = window.interfaces.routeUtil.LazilyLoadWithLoader;
var UpdateStoreAndStyles = window.interfaces.storeUtil.UpdateStoreAndStyles;




var Route = function (_Virtual$PureComponen) {
    _inherits(Route, _Virtual$PureComponen);

    function Route() {
        _classCallCheck(this, Route);

        return _possibleConstructorReturn(this, (Route.__proto__ || Object.getPrototypeOf(Route)).apply(this, arguments));
    }

    _createClass(Route, [{
        key: "renderLazyFlow",
        value: function renderLazyFlow(_ref) {
            var flow = _ref.flow;
            var component = this.props.component;

            var FlowContainer = null;
            FlowContainer = flow.default[component];
            if (FlowContainer) {
                var reducer = flow.default.reducer;

                return Virtual.createElement(
                    UpdateStoreAndStyles,
                    { reducer: reducer },
                    function () {
                        if (FlowContainer) {
                            return Virtual.createElement(FlowContainer, null);
                        }
                        return null;
                    }
                );
            }
            throw Error("Component[" + component + "] doesn't contain module name[" + Object.keys(flow.default)[0] + "] specified in Route component");
        }
    }, {
        key: "render",
        value: function render() {
            var _props = this.props,
                path = _props.path,
                routeName = _props.routeName;

            if (routeName === path.replace(/^\//, '')) {
                var loader = Virtual.createElement(__WEBPACK_IMPORTED_MODULE_0_CircularLoader__["a" /* default */], { size: "small" });
                return Virtual.createElement(
                    LazilyLoadWithLoader,
                    { style: { width: "300px" }, loader: loader, modules: this.props.modules },
                    this.renderLazyFlow.bind(this)
                );
            }
            return null;
        }
    }]);

    return Route;
}(Virtual.PureComponent);

/* harmony default export */ __webpack_exports__["a"] = (Route);

/***/ }),

/***/ 36:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return actionNameMap; });
/* unused harmony export drawerAction */
//import searchResultRouteGen from "./routeConfig/searchResultRouteGenerator.js";
/**
 * Following are set of routes 
 */

var actionNameMap = {
    drawer: "drawerOpen"
};

var action = function action(currentRoute, actionName) {
    var url = void 0;
    if (currentRoute.indexOf('?') != -1) {
        url = currentRoute + "&action=" + actionName;
    } else {
        url = currentRoute + "?action=" + actionName;
    }
    return url;
};

var drawerAction = function drawerAction() {
    return action("" + document.location.pathname + document.location.search, actionNameMap.drawer);
};

/***/ }),

/***/ 37:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routeChange", function() { return routeChange; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routeChangeEnd", function() { return routeChangeEnd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchRequest", function() { return fetchRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchComplete", function() { return fetchComplete; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchSuccess", function() { return fetchSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchFailure", function() { return fetchFailure; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actionTypes_actionTypes_js__ = __webpack_require__(10);
// let { batchActions } = window.interfaces;
// import routeSanitizer from "./routeConfig/routeSanitizer.js";



var routeChange = function routeChange(routeDetail) {
    // let sanitizer = routeSanitizer[routeDetail.routeName];
    var query = routeDetail.query;
    // if (sanitizer) {
    //     query = sanitizer.urlToStore(query);
    // }   
    return {
        type: __WEBPACK_IMPORTED_MODULE_0__actionTypes_actionTypes_js__["j" /* ROUTE_CHANGE */],
        route: Object.assign({}, routeDetail, {
            query: query
        })
    };
};

var routeChangeEnd = function routeChangeEnd(path, routeName, actionName) {
    return {
        type: __WEBPACK_IMPORTED_MODULE_0__actionTypes_actionTypes_js__["k" /* ROUTE_CHANGE_END */],
        route: {
            path: path,
            routeName: routeName,
            actionName: actionName
        }
    };
};

var fetchRequest = function fetchRequest(payload) {
    return {
        type: __WEBPACK_IMPORTED_MODULE_0__actionTypes_actionTypes_js__["c" /* FETCH_REQUEST */],
        payload: payload
    };
};

var fetchComplete = function fetchComplete(payload) {
    return {
        type: __WEBPACK_IMPORTED_MODULE_0__actionTypes_actionTypes_js__["a" /* FETCH_COMPLETE */],
        payload: payload
    };
};
var fetchSuccess = function fetchSuccess(payload) {
    return {
        type: __WEBPACK_IMPORTED_MODULE_0__actionTypes_actionTypes_js__["d" /* FETCH_SUCCESS */],
        payload: payload
    };
};
var fetchFailure = function fetchFailure(payload) {
    return {
        type: __WEBPACK_IMPORTED_MODULE_0__actionTypes_actionTypes_js__["b" /* FETCH_FAILURE */],
        payload: payload
    };
};

/***/ }),

/***/ 38:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var Virtual = window.interfaces.Virtual;


var CircularLoader = function CircularLoader(props) {
			return Virtual.createElement(
						"div",
						{ className: "preloader-wrapper " + props.size + " active" },
						Virtual.createElement(
									"div",
									{ className: "spinner-layer spinner-blue-only" },
									Virtual.createElement(
												"div",
												{ className: "circle-clipper left" },
												Virtual.createElement("div", { className: "circle" })
									),
									Virtual.createElement(
												"div",
												{ className: "gap-patch" },
												Virtual.createElement("div", { className: "circle" })
									),
									Virtual.createElement(
												"div",
												{ className: "circle-clipper right" },
												Virtual.createElement("div", { className: "circle" })
									)
						)
			);
};

CircularLoader.propTypes = { size: Virtual.PropTypes.string };
CircularLoader.defaultProps = { size: "" };

/* harmony default export */ __webpack_exports__["a"] = (CircularLoader);

/***/ }),

/***/ 9:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return storageConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return persistConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return appVersion; });
/* unused harmony export minifiedExtenstion */
/* unused harmony export staticFilesBasePath */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return authDependentApiRegexp; });
var localforage = window.interfaces.localforage;
//Storage configration

var storageConfig = {
    //driver: localforage.WEBSQL;
    name: 'flowName',
    version: 1,
    //size: 4980736;
    storeName: 'flowNameStore',
    description: 'flow description'
};
var persistConfig = {
    storage: localforage,
    blacklist: [],
    keyPrefix: "reduxPersist_"
};
var authDependentApiRegexp;
var appVersion = "1";
var minifiedExtenstion = void 0;
console.log("dev");

if (true) {
    minifiedExtenstion = "";
    var staticFilesBasePath = "";
}

/* Define your environment specific config here e.g.
if (process.env.NODE_ENV == "stag") {
    var minifiedExtenstion = ".min";
    var staticFilesBasePath = "";
}
*/



/***/ })

},[124]);
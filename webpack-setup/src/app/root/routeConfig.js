/**
 * Author : Ankit Anand
 * Open Issue 
    * In offline case, attempts to load module n times, causes initialSuccessCallback also to fire n times.Issue is with requirejs internal. 
    Impact Calls route change action n times
 * 
 */

let { page} = window.interfaces;
import routes from "../../../expressRoutes.js";

let { injectAsyncReducer } = window.interfaces.storeUtil;
import * as routeGen from "./routeGenerator.js";


/**
 * @param  {[Object]}
 * @return {[type]}
 */
const requireErrorCallback = (err) => {
    //Undefine failed module id
    err.requireModules.map((failedId) => {
        requirejs.undef(failedId);
    });
}

/**
 * Inject styleString in <head>
 * @param  {[String]}
 * @return {[type]}
 */
const injectAsyncStyles = (styleString) => {
    $("head").append(`<style>${styleString}</style>`);
}

/**
 * Define module by the name <moduleId> and value <response>. Allow to statically require module using moduleId:
 * Example : let searchFlow = require("searchFlow"); 
 * @param  {[String]}
 * @param  {[Object]}
 * @return {[Promise]}
 */
export const defineNamedModule = (moduleId, response) => {
    //Define named module
    define(moduleId, response);
    return new Promise((resolve, reject) => {
        requirejs([moduleId], resolve, reject)
    });
}

let loadModuleSuccess = (action) => {}

let loadModuleError = (action) => {
    //To set url back to previousily loaded page
    window.history.back();
}
let parseQuery = (ctx, next) => {

    import( /* webpackChunkName: "tracking" */ 'trackingJS').then(resp => {
        return resp.logAppLaunch(ctx.querystring);
    }).catch(error => 'An error occurred while loading the component');

    let query = {};
    let querystring = ctx.querystring;
    if (querystring) {
        let splittedQuery = querystring.split("&");

        for (var i = 0, len = splittedQuery.length; i < len; i++) {
            if (splittedQuery[i]) {
                let nameValuePair = splittedQuery[i].split("=");
                let name = nameValuePair[0];
                let value = nameValuePair[1];
                let arrayName = name.match(/(.*)\[\]$/);
                if (arrayName) {
                    let name = arrayName[1];
                    if (!query[name]) {
                        query[name] = [];
                        query[name].push(value);
                    }
                } else {
                    query[name] = value;
                }
            }
        }
    }
    ctx.params = { ...ctx.params, ...query };
    next();
}

export default (actions, store) => {
    let slideCount = -1;
    let onPageChange = (ctx, routeName, externalQuery = {}) => {
        let state = store.getState();
        let direction;
        let actionName = "";

        if (ctx.state.slideCount != undefined) {
            direction = slideCount < ctx.state.slideCount ? "forward" : "backward";
            slideCount = ctx.state.slideCount;
        } else {
            direction = "forward";
            setTimeout(() => {
                ctx.state.slideCount = ++slideCount;
                ctx.save();
            }, 0)
        }

        let query = { ...externalQuery, ...ctx.params };

        if (query.action) {
            actionName = query.action;
        }

        let previousRoute = store.getState().route;
        let drawerAction = routeGen.actionNameMap.drawer;
        /** Following check is not required anymore */
        if (previousRoute.actionName == drawerAction || actionName == drawerAction) {
            //In case of routing of drawer we don't want scroll to 0
        } else {
            window.requestAnimationFrame(() => {
                $(window).scrollTop(0);
            });
        }


        actions.routeChange({
            path: ctx.path,
            routeName,
            actionName,
            direction,
            query,
            previousName: state.route.routeName,
            previousActionName: state.route.actionName,
            getReloadStatus: state.route.getReloadStatus
        });
    }

    //Add query paramas to ctx.params
    page("*", parseQuery);

    page(routes.startPage,(ctx,next)=>{
        onPageChange(ctx, "startPage");
    }, (ctx, next) => {
        next()
    });

    page(routes.about,(ctx,next)=>{
        onPageChange(ctx, "about");
    }, (ctx, next) => {
        next()
    });

    page(routes.home,(ctx,next)=>{
        onPageChange(ctx, "home");
    }, (ctx, next) => {
        next()
    });

    

    /**************ROUTE AUTHENTICATION START*****************/
    page('*', (ctx, next) => {
        onPageChange(ctx, "exception")
    }, (ctx, next) => {
        next();
    });
    /**************ROUTE AUTHENTICATION END*****************/

    page.exit('*', (ctx, next) => {
        if (store.getState().sidebar) {
            actions.toggleSidebar();
        }
        next(ctx);
    });
}
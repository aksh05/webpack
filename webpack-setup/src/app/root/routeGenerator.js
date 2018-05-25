//import searchResultRouteGen from "./routeConfig/searchResultRouteGenerator.js";
/**
 * Following are set of routes 
 */

export let actionNameMap = {
    drawer: "drawerOpen"
}

let action = (currentRoute, actionName) => {
    let url;
    if (currentRoute.indexOf('?') != -1) {
        url = `${currentRoute}&action=${actionName}`;
    } else {
        url = `${currentRoute}?action=${actionName}`;
    }
    return url;
}

export let drawerAction = () => {
    return action(`${document.location.pathname}${document.location.search}`, actionNameMap.drawer)
}

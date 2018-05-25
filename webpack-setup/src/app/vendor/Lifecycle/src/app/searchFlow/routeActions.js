import * as staticRoutes from "./routeStatic.js";

let actions = {
    "searchForm": () => {
        return {
            type: "CHANGE_ROUTE",
            route: staticRoutes.ROUTE_SEARCHFORM
        }
    },
    "searchResult": (id) => {
        return {
            type: "CHANGE_ROUTE",
            route: staticRoutes.ROUTE_SEARCHRESULT
        }
    },
    "notFound": () => {
        return {
            type: "CHANGE_ROUTE",
            route: staticRoutes.ROUTE_NOTFOUND
        }
    }
}

export default actions;

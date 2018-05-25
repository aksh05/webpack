let { page } = window.interfaces;
import * as staticRoutes from "./routeStatic.js";
import config from "../config.js";

export default (boundedActions) => {
    //Configuration
    page.start({
        popstate: true
    });

    page.base(config.base);

    page('/', () => {
        page.redirect(staticRoutes.ROUTE_SEARCHFORM)
    });
    page(staticRoutes.ROUTE_SEARCHFORM, () => {
        boundedActions.searchForm();
    })
    page(staticRoutes.ROUTE_SEARCHRESULT, () => {
        boundedActions.searchResult();
    })

    page('*', () => {
        boundedActions.notFound();
    });

}

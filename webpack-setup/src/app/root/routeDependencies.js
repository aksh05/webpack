let { loadModulePromise } = window.interfaces.routeUtil;
import { minifiedExtenstion, staticFilesBasePath } from "../config.js";

export const lazyFlowName = {
    flow: () => import (/* webpackChunkName: "flowName" */ "flowNameJS"),
    // styles: () => import (/* webpackChunkName: "flowCSS" */"flowNameCSS"),
};

export const lazyFlow_Home = {
    flow: () => import (/* webpackChunkName: "homeName" */ "homeNameJS"),
    // styles: () => import (/* webpackChunkName: "homeCSS" */"homeNameCSS"),
};


export const lazyFlow_About = {
    flow: () => import (/* webpackChunkName: "aboutName" */ "aboutNameJS"),
    // styles: () => import (/* webpackChunkName: "aboutCSS" */"aboutNameCSS"),
};

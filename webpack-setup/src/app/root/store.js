import {
    persistConfig,
    storageConfig,
    appVersion
} from "../config.js";
import * as initialReducers from "./reducer.js";
// import * as initialReducers from "./reducer.js";
let {
    storeUtil,    
    reduxPersist
} = window.interfaces;

export function configureStore(intialState = undefined, rehydrationCallback) {
    let store = storeUtil.configureStore(initialReducers, intialState,[reduxPersist.autoRehydrate()]);

    if (window.isCrawler) {
        rehydrationCallback(store);
    } else {
        let whiteListedKeys = ["app"];
        storeUtil.hydrateStore({
            persistConfig,
            appVersion,
            whiteListedKeys,
            storageConfig
        }, rehydrationCallback);
    }
}


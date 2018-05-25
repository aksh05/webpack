import { batchActions, enableBatching } from 'redux-batched-actions';
import localforage from "localforage";
import reduxThunk from "redux-thunk";
import * as Redux from "redux";
import * as reduxPersist from 'redux-persist';

// const { batchActions, enableBatching } = require('redux-batched-actions');
// const localforage = require('localforage');
// const reduxThunk = require('redux-thunk').default;
// const Redux = require('redux');
// const reduxPersist = require('redux-persist');

import logger from "../redux/middleware/logger.js";
import connect_UpdateStoreAndStyles from "./UpdateStoreAndStyles.js";
let {
    createStore,
    combineReducers,
    applyMiddleware,
    compose
} = Redux;

let {
    persistStore,
    createTransform,
    getStoredState,
    createPersistor
} = reduxPersist;

/*import { SET_APP_VERSION, RESET_APP_PURGE } from "./actionTypes.js";*/
let store = null;
let restoredState = null;
const createReducer = (initialReducers, asyncReducers) => {
    return enableBatching(combineReducers({
        ...initialReducers,
        ...asyncReducers
    }));
}

let storeRehydrate = function(store, state) {
    try {
        store.persistor.rehydrate(state);
    } catch (e) {
        console.log(e)
    }
}

export function configureStore(initialReducers, intialState = undefined, enhancer = []) {
    store = createStore(createReducer(initialReducers), intialState, compose(...enhancer, applyMiddleware(logger, reduxThunk)));
    store.initialReducers = initialReducers;
    store.asyncReducers = {};
    return store;
}

export function hydrateStore({
    persistConfig,
    appVersion,
    whiteListedKeys,
    storageConfig
}, rehydrationCallback) {
    getStoredState(persistConfig, (err, _restoredState) => {
        restoredState = _restoredState;
        localforage.config(storageConfig);
        store.persistor = createPersistor(store, persistConfig);
        let shouldPurge = restoredState.app && ((restoredState.app.version < appVersion) || restoredState.app.purge);
        if (shouldPurge) {
            store.persistor.purge().then(() => {
                let payload = {};
                whiteListedKeys.forEach((key) => {
                    payload[key] = restoredState[key]
                });
                storeRehydrate(store, payload);
                store.dispatch(batchActions([{
                    type: "SET_APP_VERSION",
                    payload: { version: appVersion }
                }, {
                    type: "RESET_APP_PURGE"
                }]));
                rehydrationCallback(store);

            });
        } else {
            storeRehydrate(store, restoredState);
            rehydrationCallback(store);
        }
    });
}

export function rehydrateStore(rehydrationCallback) {
    if (store.persistor) {
        //getStoredState(persistConfig, (err, restoredState) => {            
        storeRehydrate(store, restoredState);
        rehydrationCallback();
        //});
    }
}

function _injectAsyncReducer(store, asyncReducers) {
    //Avoided db query by extended initial stored state with current store state
    if (store.persistor) {
        restoredState = {...restoredState, ...store.getState() };
    }
    store.asyncReducers = {...store.asyncReducers, ...asyncReducers };
    store.replaceReducer(createReducer(store.initialReducers, store.asyncReducers));

}

/*export function injectAsyncReducerInSingleStore(asyncReducers, rehydrationCallback) {
    injectAsyncReducer(store, ...arguments);
}*/

export function areReducerNewToStore(asyncReducers) {
    let state = store.getState();
    let keys = Object.keys(asyncReducers);
    let keysNotInState = keys.filter(key => !(key in state));
    return keysNotInState.length == keys.length;
}


export function injectAsyncReducer(store, asyncReducers, rehydrationCallback) {
    if (areReducerNewToStore(asyncReducers)) {
        _injectAsyncReducer(store, asyncReducers);
        if (window.isCrawler) {
            rehydrationCallback();
        } else {
            rehydrateStore(rehydrationCallback);
        }
    } else {
        rehydrationCallback();
    }
}

export function injectAsyncReducerInSingleStore(asyncReducers, rehydrationCallback) {
    if (areReducerNewToStore(asyncReducers)) {
        _injectAsyncReducer(store, asyncReducers);
        if (window.isCrawler) {
            rehydrationCallback();
        } else if(store.persistor) {
            rehydrateStore(rehydrationCallback);
        }
    } else {
        rehydrationCallback();
    }
}
export let UpdateStoreAndStyles = connect_UpdateStoreAndStyles(injectAsyncReducerInSingleStore);
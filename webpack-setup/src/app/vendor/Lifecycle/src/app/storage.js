import config from "./config.js";
let {localforage} = window.interfaces;


export const hydrate = () => {
    localforage.config(config.database);
    /**
     * [Function hydrate
     * Get initialState from DB
     * Create store
     * Subscribe store for replication 
     * ]
     * @return {[Promise]} [Read DB]
     */
    return localforage.getItem("newState").then((initialState) => {
        return initialState || {};
    });
}
export const replicate = (state) => {
    /**
     * [Function replicate
     * Replicate state to DB
     * ]
     * @param  {[type]} state [Store state]
     * @return {[Promise]}       [Write DB]
     */
    if (state.route == "/notFound") {
        state.route == "/";
    }
    return localforage.setItem("newState", state);
}

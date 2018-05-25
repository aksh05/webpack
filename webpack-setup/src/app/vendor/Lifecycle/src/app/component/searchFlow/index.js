import config from "./appConfig.js";
import localforage from "localforage";

import Virtual from "../../../jass/react/Virtual.js";
import ReactDom from "react-dom";
import SearchFlow from "./component/SearchFlow.js";


let store = null;


class Main {
    constructor() {
        localforage.config(config.database);
        this.hydrate().then((initialState) => {
            let newElement = document.createElement("div");
            document.body.appendChild(newElement);
            ReactDom.render(<SearchFlow initialState={initialState} replicate={this.replicate} />, newElement);
        });
    }
    hydrate() {
        /**
         * [Function hydrate
         * Get initialState from DB
         * Create store
         * Subscribe store for replication 
         * ]
         * @return {[Promise]} [Read DB]
         */
        return localforage.getItem("newState").then((initialState) => {
            if (!initialState) {
                initialState = {
                    route: "/",
                    searchForm: {
                        keywords: "",
                        location: "",
                        experience: ""
                    },
                    searchResult: {
                        tuples: []
                    }
                }
            }
            return initialState;
        });
    }
    replicate(state) {
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

}
export default new Main();

//document.registerElement('search-flow', SearchFlow);

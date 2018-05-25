let { Virtual, page, Redux, VirtualCSSTransitionGroup } = window.interfaces;
let { bindActionCreators, applyMiddleware } = Redux;

import logger from "../../../src/jass/redux/middleware/logger.js"
import reduxThunk from 'redux-thunk';


import SearchForm from "../searchForm/SearchForm.js";
import SearchResult from "../searchResult/SearchResult.js";

import searchFormAction from "../searchForm/searchFormAction.js";
import searchResultAction from "../searchResult/SearchResultAction.js";

import reducer from "./reducer.js";
import * as staticRoutes from "./routeStatic.js";
import routeActions from "./routeActions.js";
import routesConfig from "./routeConfig.js";

import { hydrate, replicate } from "../storage.js";


/**
 * Virtual Component
 * Defines route
 * Defines route handler
 * Initial Render 
 * Subcribe store for render
 */
class SearchFlow extends Virtual.Component {
    constructor() {
        super(...arguments);

        //Hydrate store
        hydrate().then((initialState) => {

            //Creating flux store for the state        
            this.store = Redux.createStore(reducer, initialState, applyMiddleware(logger, reduxThunk));
            //Configuring Routes
            routesConfig(bindActionCreators(routeActions, this.store.dispatch));



            //Subscribe store for render
            this.store.subscribe(() => {
                this.setState(this.store.getState());
            });

            //Subscribe store for replication
            this.store.subscribe(() => {
                replicate(this.store.getState());
            });


            this.boundedActionCreator = {
                "searchForm": bindActionCreators(searchFormAction, this.store.dispatch),
                "searchResult": bindActionCreators(searchResultAction, this.store.dispatch),
            };

            var path = document.location.pathname.match(/.*\/pwa(.*)/);
            page(path[path.length - 1]);
        });
    }
    render() {
        let page = null;
        if (this.state) {
            let { route, searchForm, searchResult } = this.state;

            if (route == staticRoutes.ROUTE_SEARCHFORM) {
                page = <SearchForm key="searchForm" {...searchForm} {...this.boundedActionCreator.searchForm} ></SearchForm>;
            }
            if (route == staticRoutes.ROUTE_SEARCHRESULT) {
                page = <SearchResult key="searchResult" state={searchResult} {...searchForm} {...this.boundedActionCreator.searchResult} ></SearchResult>;
            }
            if (route == staticRoutes.ROUTE_NOTFOUND) {
                page = <div key="notFound">"Not found"</div>;
            }

            return <div>
                    <header className="mnj oh">
                        <div className="hbIcCont fl">
                            <a className="hbIc posR" id="dataIcon"></a>
                        </div>
                        <div className="mnjHd">
                            <a className="logoIc" href="http://www.naukri.com" alt="Naukri.com, India's No.1 Job Site"></a>
                        </div>
                    </header>
                    <VirtualCSSTransitionGroup transitionName="route" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                    {page}
                    </VirtualCSSTransitionGroup>
                </div>
        }
        return page;
    }
}
export default SearchFlow;

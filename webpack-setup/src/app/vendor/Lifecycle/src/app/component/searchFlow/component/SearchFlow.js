import config from "../appConfig.js";

import Virtual from "../../../../jass/react/Virtual.js";
import SearchForm from "../component/SearchForm.js";
import SearchResult from "../component/SearchResult.js";
import action_SearchForm from "../actions/searchForm.js";
import action_SearchResult from "../actions/searchResult.js";
import { bindActionCreators } from "redux";
import reducer from "../reducers/index.js";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import page from "page";

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
        this.setUpRoutes();
        this.boundedActionCreator = {
            "searchForm": bindActionCreators(action_SearchForm, this.store.dispatch),
            "searchResult": bindActionCreators(action_SearchResult, this.store.dispatch),
        }
        this.store.subscribe(() => {
            this.props.replicate(this.store.getState());
        });
    }
    get initialState() {
        return this.props.initialState;
    }
    reducer() {
        return reducer(...arguments);
    }
    render() {

        let { route, searchForm, searchResult } = this.state;

        let page = null;

        if (route == "/searchForm") {
            page = <SearchForm key="searchForm" {...searchForm} {...this.boundedActionCreator.searchForm} ></SearchForm>;
        }
        if (route == "/searchResult") {
            page = <SearchResult key="searchResult" state={searchResult} {...searchForm} {...this.boundedActionCreator.searchResult} ></SearchResult>;
        }
        if (route == "/notFound") {
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
                    <ReactCSSTransitionGroup transitionName="route" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                    {page}
                    </ReactCSSTransitionGroup>
                </div>
    }
    attachedCallback() {
        page.redirect(this.state.route);
    }
    setUpRoutes() {
        //Configuration
        page.start({
            popstate: true
        });

        page.base(config.base);

        page('/', () => {
            page.redirect('/searchForm')
        });
        page('/searchForm', () => {
            this.store.dispatch({
                type: "CHANGE_ROUTE",
                route: "/searchForm"
            });
        })
        page('/searchResult', () => {
            this.store.dispatch({
                type: "CHANGE_ROUTE",
                route: "/searchResult"
            });
        })

        page('*', () => {
            this.store.dispatch({
                type: "CHANGE_ROUTE",
                route: "/notFound"
            });

        });

    }
}
export default SearchFlow;

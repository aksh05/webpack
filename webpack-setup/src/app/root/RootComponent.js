let { Virtual, Redux, Provider, page } = window.interfaces;
let { bindActionCreators } = Redux;

let { LazilyLoadWithLoader } = window.interfaces.routeUtil;
let { UpdateStoreAndStyles } = window.interfaces.storeUtil;

import { configureStore } from "./store.js";
import * as actionCreators from "./actionCreators.js";
import routeConfig from "./routeConfig.js";
import ajaxConfig from "./ajaxConfig/index.js";
// detecting flex
// import { detectFlexSupport } from "../../../../100/src/app/shims/flex.js";
import { removeDrawerAction } from "./routeConfig/routeSanitizer.js";
import * as dependecies from './routeDependencies.js';
import CircularLoader from "CircularLoader";

import Route from './../route/index.js';

class RootComponent extends Virtual.PureComponent {
    constructor() {
        super(...arguments);
        // this.state = undefined;
        this.store = null;
        configureStore(this.state, (store) => {
            this.store = store;

            import(/* webpackChunkName: "tracking" */ 'trackingJS').then(resp => {
                resp.newMonk.init(this.store);
            }).catch(() => 'An error occurred while loading the component');

            // metagTagsManager.initanager.init(this.store);
            this.store.subscribe(() => {
                this.setState(this.store.getState());
                // setPushData(this.store.getState().pushData);
            });
            window.globalActionCreators = this.boundedActionCreators = bindActionCreators(actionCreators, this.store.dispatch);
            // routeConfig(this.boundedActionCreators, this.store);
            ajaxConfig(this.store);
            // userPrompt(this.boundedActionCreators, this.store);
            page({
                popstate: true,
                dispatch: false // Prevent default initalPathname handling
            });

            let initalPath = removeDrawerAction(`${document.location.pathname}${document.location.search}`);
            let showNavIcon = document.location.search.indexOf("navicon=false") === -1;
            let shouldAddRootPage = true && showNavIcon;

            /**
             *   Code to add root page in history if internal page is loaded initially
             */
            if (shouldAddRootPage) {
                // let state = this.store.getState();
                let { isLoggedIn } = false;
                let rootPathList = ["/"];
                let initalPathname = document.location.pathname;
                let isNotRootPathname = rootPathList.indexOf(initalPathname) === -1;
                let rootCustomHandling = false;
                rootCustomHandling = isNotRootPathname ? true : false;

                // Get root page to be added to history
                let rootPathname = "";
                if (isLoggedIn) {
                    rootPathname = rootPathList[1];
                } else {
                    rootPathname = rootPathList[0];
                }

                // Conditional route handler for root page
                page(rootPathname, (ctx, next) => {
                    if (rootCustomHandling) {
                        rootCustomHandling = false;
                        setTimeout(() => {
                            page(initalPath);
                        }, 0);
                    } else {
                        next(ctx);
                    }
                });

                // All Route handlers
                routeConfig(this.boundedActionCreators, this.store);

                // Redirect to root if not root page else default behavior
                if (rootCustomHandling) {
                    page.redirect(rootPathname);
                } else {
                    page.redirect(initalPath);
                }
            } else {
                // All Route handlers
                routeConfig(this.boundedActionCreators, this.store);
                page.redirect(initalPath);
            }
        });
    }

    attachedCallback() {
        // detectFlexSupport();
    }

    renderLazyFlow({ flow }) {
        let { reducer, FlowContainer } = flow.default;
        return <UpdateStoreAndStyles reducer={reducer}>{() => {
            if (FlowContainer) {
                return <FlowContainer />;
            }
            return null;
        }}</UpdateStoreAndStyles>;
    }

    renderRoute() {
        return <div>
            <Route path="/startPage" component={'FlowContainer'} modules={dependecies["lazyFlowName"]}/>
            <Route path="/home" component={'HomeContainer'} modules={dependecies["lazyFlow_Home"]}/>
            <Route path="/about" component={'AboutContainer'} modules={dependecies["lazyFlow_About"]}/>
        </div>;
    }

    render() {
        if (this.store) {
            let loader = <CircularLoader size="small"/>;
            return <Provider store={this.store}>
                <div className="root">
                    <h5>Route based view</h5>
                    {this.renderRoute()}
                    <h5>Lazy loaded view</h5>
                    <LazilyLoadWithLoader style={{ width: "300px" }} loader={loader} modules={dependecies["lazyFlowName"]}>
                        {this.renderLazyFlow}
                    </LazilyLoadWithLoader>
                </div>
            </Provider>;
        }
        return null;
    }
}

export default RootComponent;

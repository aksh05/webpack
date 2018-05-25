let { Virtual } = window.interfaces;
let { LazilyLoadWithLoader } = window.interfaces.routeUtil;
let { UpdateStoreAndStyles } = window.interfaces.storeUtil;

import CircularLoader from "CircularLoader";

export default class Route extends Virtual.PureComponent {
    constructor() {
        super(...arguments);
    }

    renderLazyFlow({ flow }) {
        let { component } = this.props;
        let FlowContainer = null;
        FlowContainer = flow.default[component];
        if (FlowContainer) {
            let { reducer } = flow.default;
            return <UpdateStoreAndStyles reducer={reducer}>{()=>{
                if (FlowContainer) {
                    return <FlowContainer />;
                }
                return null;
            }}</UpdateStoreAndStyles>;
        }
        throw Error(`Component[${component}] doesn't contain module name[${Object.keys(flow.default)[0]}] specified in Route component`);
    }

    render() {
        let { path, routeName } = this.props;
        if (routeName === path.replace(/^\//, '')) {
            let loader = <CircularLoader size="small"/>;
            return <LazilyLoadWithLoader style={{ width: "300px" }} loader={loader} modules={this.props.modules}>
                {::this.renderLazyFlow}
            </LazilyLoadWithLoader>;
        }
        return null;
    }
}

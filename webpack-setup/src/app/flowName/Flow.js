// Your first component...
let { Virtual } = window.interfaces;
import "./../../../src/sass/flowName.scss";
// import { TRACKING } from "../root/require/constants.js";

class Flow extends Virtual.PureComponent {
    constructor() {
        super(...arguments);
    }

    attachedCallback() {
        try {
            // tracking with newMonk & GA
            import ( /* webpackChunkName: "tracking" */ 'trackingJS').then(resp => {
                resp.trackNewMonkAndGA(this.props.route);
            }).catch(error => 'An error occurred while loading the component');

            // requirejs(TRACKING, ({ trackNewMonkAndGA }) => {
            //     trackNewMonkAndGA(this.props.route);
            // });

        } catch (e) {
            console.warn(e);
        }
    }

    detachedCallback() {}

    render() {
        return <div>
            <h4>Dynamically imported using webpack import</h4>
            <p>Write your first component here...</p>
        </div>
    }


}

export default Flow;
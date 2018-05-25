/**
 * this.node will hold instance of newly create dom element
 */


import {Component,PureComponent} from "react";

class Classname  extends Component {
    constructor(args) {
        super(...arguments);
    }

    // methods
}

// class _Component extends Component {
//     constructor(props) {
//         super(...arguments);
//     }
//     // createdCallback() {}
//     // attachedCallback() {}
//     // detachedCallback() {}
//     // attributeChangedCallback() {}
//     // componentWillReceiveProps() { this.attributeChangedCallback(...arguments); }
//     // componentWillMount() { this.createdCallback(...arguments) };
//     // componentDidMount() { this.attachedCallback(...arguments) };
//     // componentWillUnmount() { this.detachedCallback(...arguments) };

// }


// class _PureComponent extends PureComponent {
//     constructor(props) {
//         super(...arguments);        
//     }
//     createdCallback() {}
//     attachedCallback() {}
//     detachedCallback() {}
//     attributeChangedCallback() {}
//     componentWillReceiveProps() { this.attributeChangedCallback(...arguments); }
//     componentWillMount() { this.createdCallback(...arguments) };
//     componentDidMount() { this.attachedCallback(...arguments) };
//     componentWillUnmount() { this.detachedCallback(...arguments) };

// }



// export default {Component:_Component,PureComponent:_PureComponent};
export default {Component,PureComponent};

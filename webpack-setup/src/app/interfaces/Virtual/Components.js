/**
 * this.node will hold instance of newly create dom element
 */

const {Component,PureComponent} = require('react');
// import {Component,PureComponent} from "react";

class _Component extends Component {
    constructor(props) {
        super(...arguments);
    }
    createdCallback() {}
    attachedCallback() {}
    detachedCallback() {}
    attributeChangedCallback() {}
    componentWillReceiveProps() { this.attributeChangedCallback(...arguments); }
    componentWillMount() { this.createdCallback(...arguments) };
    componentDidMount() { this.attachedCallback(...arguments) };
    componentWillUnmount() { this.detachedCallback(...arguments) };

}


class _PureComponent extends PureComponent {
    constructor(props) {
        super(...arguments);        
    }
    createdCallback() {}
    attachedCallback() {}
    detachedCallback() {}
    attributeChangedCallback() {}
    componentWillReceiveProps() { this.attributeChangedCallback(...arguments); }
    componentWillMount() { this.createdCallback(...arguments) };
    componentDidMount() { this.attachedCallback(...arguments) };
    componentWillUnmount() { this.detachedCallback(...arguments) };

}



export default {Component:_Component,PureComponent:_PureComponent};

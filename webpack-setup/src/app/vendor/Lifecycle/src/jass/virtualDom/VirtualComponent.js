/**
 * this.node will hold instance of newly create dom element
 */

import logger from "../redux/middleware/logger.js"
import * as Redux from "redux";
import patch from 'virtual-dom-transition/patch';
import createElement from 'virtual-dom/create-element';
import diff from 'virtual-dom/diff';
import fastDom from 'fastDom';
import LifecycleHook from "./LifecycleHook.js";

class Lifecycle {
    createdCallback() {}
    attachedCallback() {}
    detachedCallback() {}
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }
    componentDidUpdate() {}
    unhook() {
        this.thunk = null;
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}


class API extends Lifecycle {
    setState(newState) {
        if (this.shouldComponentUpdate(this.props, newState)) {
            this.state = newState;
            this.renderSubTree().then(() => {
                this.componentDidUpdate();
            });
        }
    }
    createStore() {
        let store = Redux.createStore(this.reducer, this.state, Redux.applyMiddleware(logger));
        return store;
    }

}

class Specs extends API {
    reducer(state = {}, action) {
        throw "Define reducer for the store";
    }
    getName() {
        throw "Define getName function which returns string";
    }
    render() {
        throw "Define render function which returns VNode";
    }
    getInitialState() {
        return null;
    }
}

class VirtualComponent extends Specs {
    constructor() {
        super(...arguments);
        this.node = null;

        this.props = {
            hook: new LifecycleHook(this)
        };


        this.state = this.getInitialState();
        if (this.state) {
            this.store = this.createStore();
            this.unsubscribe = this.store.subscribe(() => {
                this.setState(this.store.getState())
            });
        } else {
            this.store = null;
        }
    }
    renderSubTree() {
        return new Promise((resolve, reject) => {
            fastDom.mutate(() => {
                let subTree = this.render();
                let patches = diff(this.vnode.children[0], subTree);
                patch(this.node.firstChild, patches);
                this.vnode.children[0] = subTree;
                resolve();
            });
        });
    }
}

export default VirtualComponent;

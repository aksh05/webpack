import LifecycleHook from "./LifecycleHook.js";
import patch from 'virtual-dom-transition/patch';
import createElement from 'virtual-dom/create-element';
import diff from 'virtual-dom/diff';
import fastDom from 'fastDom';


class GenericThunk {
    constructor(tagName, renderFn, props) {
        this.tagName = tagName;
        this.component = null;
        this.renderFn = renderFn;
        this.props = props || {};
        this.type = "Thunk";     
        this.transition = this.props.transition;
    }

    render(previous) {
        var previousProps;
        // The first time the Thunk renders, there will be no previous Thunk        
        // The next time the Thunk renders, it might get replace with Thunk with differnt tag name
        // One more check needs to be added, of thunks with similar tagname but different id
        if (!previous || (previous.tagName != this.tagName)) {
            previousProps = null;
            this.component = new this.tagName(this);
            this.props.hook = new LifecycleHook(this.component);
        } else {
            previousProps = previous.props;
            this.component = previous.component;
            //Thunk reference inside component updated
            this.component.thunk = this;
            this.props.hook = previous.props.hook;
        }

        if (!previousProps || this.component.shouldComponentUpdate(this.props, this.component.state)) {
            this.component.props = {...this.component.props, ...this.props };
            return this.renderFn(previous, this)
        } else {
            return previous.vnode
        }
    }
    renderSubTree() {
        return new Promise((resolve, reject) => {
            fastDom.mutate(() => {
                let subTree = this.component.render();
                let patches = diff(this.vnode.children[0], subTree);
                patch(this.component.node.firstChild, patches);
                this.vnode.children[0] = subTree;
                resolve();
            });
        });
    }
}

export default GenericThunk;

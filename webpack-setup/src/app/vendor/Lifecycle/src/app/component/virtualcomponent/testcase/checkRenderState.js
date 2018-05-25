import h from "../../../../jass/virtualDom/h.js";
import VirtualComponent from "../../../../jass/virtualDom/VirtualComponent.js";
import batch from "../../../../jass/virtualDom/batch.js";

let batcher;
let previousSubtree = null;

class Counter extends VirtualComponent {
    getName() {
        return "counter";
    }
    getInitialState() {
        return {
            count: 0
        }
    }
    shouldComponentUpdate(newProps, newState) {
        if (this.state != newState) {
            return true;
        }

        QUnit.test("Should not render with same state", (assert) => {
            assert.ok(this.vnode.children[0] == previousSubtree);
            assert.equal(this.node.innerHTML, "<div>1</div>");
        });

        return false;
    }
    reducer(state, action) {
        switch (action.type) {
            case "UPDATE":
                if (state.count != action.count) {
                    return {...state, "count": action.count }
                }
            default:
                return state;
        }
    }
    render() {
        return <div>{this.state.count}</div>;
    }
    createdCallback() {

    }
    attachedCallback() {

        //Test for initial state
        QUnit.test("Should render state", (assert) => {
            assert.equal(this.node.innerHTML, "<div>0</div>");
        });

        previousSubtree = this.vnode.children[0];

        this.store.dispatch({
            type: "UPDATE",
            count: 1
        });

    }
    componentDidUpdate() {

        QUnit.test("Should render updated state", (assert) => {
            assert.ok(this.vnode.children[0] != previousSubtree);
            assert.equal(this.node.innerHTML, "<div>1</div>");
        });

        previousSubtree = this.vnode.children[0];
        this.store.dispatch({
            type: "UPDATE",
            count: 1
        });

    }
}

class Main {
    render() {
            return <Counter></ Counter>
    }
    constructor() {
        let body = document.body;
        batcher = batch({}, this.render);
        body.appendChild(batcher.rootNode);        
    }
}

export default () => {
    new Main();
}

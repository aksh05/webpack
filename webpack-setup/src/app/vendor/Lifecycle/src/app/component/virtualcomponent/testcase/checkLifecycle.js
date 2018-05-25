import h from "../../../../jass/virtualDom/h.js";
import VirtualComponent from "../../../../jass/virtualDom/VirtualComponent.js";
import batch from "../../../../jass/virtualDom/batch.js";

let batcher;
class Counter extends VirtualComponent {
    getName() {
        return "counter";
    }
    shouldComponentUpdate(newProps, newState) {
        if (this.props.count != newProps.count) {
            return true;
        }
        return false;
    }

    render({ count }) {
        return <div>{count}</div>;
    }
    createdCallback() {
        QUnit.test("Node should be created in createdCallback", (assert) => {
            assert.equal(this.node.nodeType, 1);
        });
    }
    attachedCallback() {
        QUnit.test("Node should be attached in attachedCallback", (assert) => {
            assert.ok(document.body.contains(this.node));
            //Test detached callback
            batcher.update({ showCounter: false });
        });

    }
    detachedCallback() {
        QUnit.test("Node should be removed from DOM in detachedCallback", (assert) => {
            assert.ok(!document.body.contains(this.node));
        });
    }
}

class Main {
    render({ showCounter, count }) {
            let counter = showCounter ? <Counter count={count}></ Counter>:"";
        return <div>{counter}</div>;
    }
    getInitialState() {
        return {
            count: 0,
            showCounter: true
        }
    }
    constructor() {
        let body = document.body;
        batcher = batch(this.getInitialState(), this.render);
        body.appendChild(batcher.rootNode);

    }
}

export default () => {
    new Main();
}

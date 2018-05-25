import VirtualDom from "../../../../jass/react/VirtualDom.js";
import Virtual from "../../../../jass/react/Virtual.js";

let thunk;
let dummy;

class Dummy extends Virtual.Component {
    render() {
        return null;
    }
    createdCallback() {
        QUnit.test("Member variable should be set with default values", (assert)=> {
            assert.ok(this.props, "props is empty object");
            assert.equal(this.state, null, "state is null");
            assert.equal(this.node, null, "node is null");
            assert.equal(this.store, null, "store is null");
        });


        QUnit.test("API and Spec methods should be available", function(assert) {
            assert.ok(dummy.setState);
            assert.ok(dummy.createStore);
            assert.ok(!dummy.unsubscribe);
            assert.ok(dummy.render);
            assert.ok(dummy.getName);
            assert.ok(dummy.reducer);

        });

        QUnit.test("Spec methods should return default value", function(assert) {
            try {
                dummy.render()
            } catch (msg) {
                assert.ok(msg, "Render throws error if not implemented in childClass");
            }
            try {
                dummy.getName()
            } catch (msg) {
                assert.ok(msg, "getName throws error if not implemented in childClass");
            }
            try {
                dummy.reducer()
            } catch (msg) {
                assert.ok(msg, "reducer throws error if not implemented in childClass");
            }
            assert.equal(dummy.shouldComponentUpdate(), true, "shouldComponentUpdate returns true by default");
            assert.equal(dummy.getInitialState(), null, "getInitialState return null by default");

        });

        QUnit.test("Lifecycle callbacks should be available", function(assert) {
            assert.ok(dummy.createdCallback, "createdCallback is available");
            assert.ok(dummy.attachedCallback, "attachedCallback is available");
            assert.ok(dummy.detachedCallback, "detachedCallback is available");
        });
    }

}

export default () => {
    QUnit.module("Interface");
    let newElement = document.createElement("div");
    document.body.appendChild(newElement);
    VirtualDom.render(Virtual.createElement(Dummy), newElement);
}

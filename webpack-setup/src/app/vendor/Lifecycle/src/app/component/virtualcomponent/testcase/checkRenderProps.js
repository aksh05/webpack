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

    }
    attachedCallback() {

        //Test for initial props
        QUnit.test("Should render props", (assert) => {
            assert.equal(this.node.innerHTML, "<div>0</div>");
        });

        QUnit.test("Should render updated props", (assert) => {
            var done = assert.async();

            let previousVnode = this.vnode.children[0];

            //Test for new props
            batcher.update({ count: 1 }).then(() => {
                assert.ok(this.vnode.children[0] != previousVnode);
                assert.equal(this.node.innerHTML, "<div>1</div>");
                done();

                //Test for same props
                let previousVnode = this.vnode.children[0];
                QUnit.test("Should not render with same props", (assert) => {
                    var done = assert.async();
                    batcher.update({ count: 1 }).then(() => {
                        assert.ok(this.vnode.children[0] == previousVnode);
                        assert.equal(this.node.innerHTML, "<div>1</div>");
                        done();
                    });
                });
            });
        });



    }
}

class Main {
    render({ count }) {
            return <Counter count={count}></ Counter>
    }
    getInitialState() {
        return {
            count: 0
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

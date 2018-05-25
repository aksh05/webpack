import fastDom from 'fastDom';

class LifecycleHook {
    constructor(component) {
        this.component = component;
    }
    /**
     * [hook When vnode is converted to HTMLElement]
     * @param  {[type]} node          [HTMLElement]
     * @param  {[type]} propertyName  [name of property set as hook]
     * @param  {[type]} previousValue [description]
     * @return {[type]}               [void]
     */
    hook(node, propertyName, previousValue) {
        console.log("created",node);
        this.component.node = node;
        this.component.createdCallback();
        /*node.classList.add('ng-enter');*/
        setTimeout(() => {
            fastDom.mutate(() => {
                /*node.classList.remove('ng-enter');                          */
                this.component.attachedCallback()
            })
        }, 0);
    }
    /**
     * [unhook When a node is removed from dom]
     * @return {[type]} [description]
     */
    unhook(node) {
        console.log("removed",node);
        this.component.detachedCallback();
        this.component.unhook();

    }
}

export default LifecycleHook;

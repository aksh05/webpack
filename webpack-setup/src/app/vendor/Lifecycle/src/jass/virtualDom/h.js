import h from "virtual-dom/h";
import Thunk from "./thunk_v1.js";


/*let renderFn = function(previous, current) {   
    
    var item = h(current.component.getName(), current.component.props, current.component.render(current.component.props));

    return item;
}
*/

/**
 * [renderFn Called only when props have changes or previous thunk not available]
 * @param  {[type]} previous [description]
 * @param  {[type]} current  [description]
 * @return {[type]}          [description]
 */
const renderFn = (previous, current) => {
    let component;

    if (!previous) {
        component = current.component = new current.componentClass(current.args);        
    } else {
        component = current.component;        
    }
    component.props = {...component.props, ...current.args};

    component.vnode = h(component.getName(), component.props, component.render(component.props));
    component.vnode.transition = component.props.transition || null;
    return component.vnode;
}


function hyperScript(tagName, properties, children) {
    var tree, element, children;
    if (arguments.length >= 3) {
        children = Array.prototype.slice.call(arguments, 2);
    }

    if (typeof tagName != "string" ) {
        //return new Thunk(tagName, renderFn, properties);
        return new Thunk(tagName, renderFn, properties);
    }
    return h(tagName, properties, children);
}

export default hyperScript;

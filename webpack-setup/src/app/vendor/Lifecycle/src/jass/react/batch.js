/**
 * Author : Ankit Anand
 * Description : Inspired from https://github.com/Raynos/main-loop/ 
 * Uses https://github.com/wilsonpage/fastdom to schedule its job at raf
 * Assumption
 *  Single store for a root node
 */

import ReactDom from "react-dom";
import fastDom from 'fastDom';

class Batch {

    /**
     * [constructor Creates an object for batch process]
     * @param  {[type]} initialState [Initial state to render]
     * @param  {[type]} render       [Render function]
     * @param  {[type]} initialTree  [Optional, A Vtree to do diff with]
     * @param  {[type]} rootNode     [Optional, A node to batch changes into]
     * @return {[type]}              [description,]
     */
    constructor(render, node) {
        this.render = render;
        this.node = node;
    }

    /**
     * [update Queue rendering with new state]
     * @param  {[type]} newState [New state to render]
     * @param  {Function} callback [Callback to run after dom patch]
     * @return {[type]}          [description]
     * 
     */

    update(props) {

        return new Promise((resolve, reject) => {
            fastDom.mutate(() => {
                ReactDom.render(this.render(props), this.node);
                resolve();
            });
        });

    }

}



export default function() {
    return new Batch(...arguments);
}

/**
 * Author : Ankit Anand
 * Description : Inspired from https://github.com/Raynos/main-loop/ 
 * Uses https://github.com/wilsonpage/fastdom to schedule its job at raf
 * Assumption
 *  Single store for a root node
 */

import patch from 'virtual-dom-transition/patch';
import createElement from 'virtual-dom/create-element';
import diff from 'virtual-dom/diff';
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
    constructor(initialState, render) {
        this.render = render;
        this.tree = this.render(initialState);
        this.rootNode = createElement(this.tree);
    }

    /**
     * [update Queue rendering with new state]
     * @param  {[type]} newState [New state to render]
     * @param  {Function} callback [Callback to run after dom patch]
     * @return {[type]}          [description]
     * 
     */

    update(newState) {

        return new Promise((resolve, reject) => {
            var newTree = this.render(newState);
            var patches = diff(this.tree, newTree);

            fastDom.mutate(() => {
                this.rootNode = patch(this.rootNode, patches);
                this.tree = newTree;
                resolve();
            });
        });

    }

}



export default function() {
    return new Batch(...arguments);
}

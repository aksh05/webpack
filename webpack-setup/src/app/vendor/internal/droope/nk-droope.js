//Start of Droope web-component
import { droope } from "./customDropdown_v10.0.0.js";
import { objectPath, checkIsAttribute, constructAttributeObject } from "../helper_methods/globalScope.js";


// pushDownCont class extends HTMLElement class to inherit property of it. 
// [droopeWC: droope webcomponent]

export class droopeWC extends HTMLElement {
    createdCallback(){}
    /**
     * [createdCallback: an instance of the element is createdCallback]
     */
    createdCallbackCode() {
        var _t = this;
        // var relAttribute = "";
        // var id = _t.getAttribute('id');
        // var rel = _t.getAttribute('rel');
        // var maxlength  = _t.getAttribute('maxlength');
        // var altrel = _t.getAttribute('altrel');
        // var placeholder = _t.getAttribute('placeholder');
        // var readonly = _t.getAttribute('readonly');
        // var readOnly = readonly ? `readonly="${readonly}"`:"";
        /*

        if (rel) {
            relAttribute = `rel="${rel}"`;
        } else if (altrel) {
            relAttribute = `altrel="${altrel}"`;
        }
        
        _t.removeAttribute('id');
        _t.removeAttribute('rel');
        _t.removeAttribute('placeholder');*/
        
        console.log('inside droope WC createdCallback_customFn...')

        /**
         * [innerHTML set innerHTML of push-down element]
         * @type {[HTML String]}
         */
        _t.innerHTML = '<div></div>';
        // _t.innerHTML = `<div class="ddwn" id="${id}">
        //                     <div class="DDwrap">
        //                         <div class="DDsearch">
        //                             <i class="arrowIcon">DownArrow</i>
        //                             <input class="srchTxt" autocomplete="off" type="text" 
        //                                 id="${id+'For'}"
        //                                 maxlength="${maxlength}"
        //                                 placeholder="${placeholder}" 
        //                                 ${readOnly}
        //                                 ${relAttribute} 
        //                             />
        //                         </div>
        //                         <span class="smArw"></span>
        //                     </div>
        //                 </div>`;
    }

    // on Change handler 
    onChangeCust() {
        if (this.onchange) this.onchange(...arguments);
    }



    /**
     * [attachedCallback: an instance was inserted into the document]
     */
    attachedCallback() {
        try {

            var _t = this;
            var id = _t.getAttribute('id');
            _t.createdCallbackCode();
            

            // console.log('inside droope WC attachedCallback...', id)

            if (this.data) {

                var iteratableAttributes = [];
                for (var i = 0; i < _t.attributes.length; i++) {
                    iteratableAttributes.push(_t.attributes[i]);
                }

                var newObj = $.extend(constructAttributeObject(iteratableAttributes, true), { onChange: ::this.onChangeCust }, {data:this.data});            
                $('#'+id).data('instance', droope(newObj));
            }
        } catch (e) {
            console.warn(e)
        }
    }

    // attributeChangedCallback(){
    //     console.log(...arguments)
    //     //this.attachedCallback();
    // }
}

/**
 *  Registering new elements: push-down 
 */
document.registerElement('nk-droope', droopeWC);

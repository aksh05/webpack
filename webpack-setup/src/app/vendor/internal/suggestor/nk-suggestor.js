//Start of suggestor web-component
import "./suggestor_v8.0.0.js";
//import * as config from "../../../config.js";

let config = {suggestorDomain : "//suggest.naukri.com"};

import { objectPath, checkIsAttribute, constructAttributeObject, toBoolean } from "../helper_methods/globalScope.js"

// pushDownCont class extends HTMLElement class to inherit property of it.
export class suggestor extends HTMLElement {
    /**
     * [createdCallback: an instance of the element is createdCallback]
     */
    createdCallbackCode() {
        var _t = this;
        var relAttribute='';

        if (_t.getAttribute('rel')) {
            relAttribute = `rel="${_t.getAttribute("rel")}"`;
        } else if (_t.getAttribute('altrel')) {
            relAttribute = `altrel="${_t.getAttribute("altrel")}"`;
        }
        let name = _t.getAttribute('name') ? _t.getAttribute('name') : "suggestor",
            value = _t.getAttribute('value')? _t.getAttribute('value'):"",
            valueHolder = value && toBoolean(_t.getAttribute('singleSelect')) && `value="${value}"`;

        let placeholder = _t.getAttribute('placeholder') ? _t.getAttribute('placeholder') : "";
        let maxLength = checkIsAttribute(_t.getAttribute('maxlength'));
        /**
         * [innerHTML set innerHTML of suggestor element]
         * @type {[HTML String]}
         */
        _t.innerHTML = `<label class="active">${placeholder}</label>
                        <div class="suggest">
                          <div class="sWrap">
                              <div class="inpWrap">
                                  <input 
                                    type="text"
                                    class="sugInp"
                                    name="${name}"
                                    ${valueHolder}
                                    
                                    id="${_t.getAttribute('id')}"
                                    ${maxLength}
                                    ${relAttribute}' 
                                  />
                              </div>            
                          </div>
                      </div>`;
    }

    sendTrackingData(){
        if(this.getAttribute('trackUserInteraction') == "true") this.instance.setTrackingObject()
    }

    // On Select handler attribute
    onSelectCust() {
        if (this.onselectOption) this.onselectOption(...arguments);
    }

    // // on Change handler 
    // onChangeCust() {
    //     this.onchange();
    // }

    getRC() {
        if (this.getRelatedConcepts) this.getRelatedConcepts(...arguments);
    }

    /**
     * [attachedCallback: an instance was inserted into the document]
     */
    attachedCallback() {

        try {
            var _t = this;

            this.createdCallbackCode();

            var iteratableAttributes = [];
            for (var i = 0; i < _t.attributes.length; i++) {
                iteratableAttributes.push(_t.attributes[i]);
            }

            let temp = constructAttributeObject(iteratableAttributes, false, "category", "relatedconceptcategory");

            var newObj = $.extend({ domain: config.suggestorDomain }, temp, { onSelect: ::this.onSelectCust, getRelatedConcepts: ::this.getRC });

            //Depricated custom placeholder support in suggestor
            delete newObj.placeholder;
            
            this.removeAttribute('id');
            this.removeAttribute('rel');

            // let sugNode = $(_t).children();
            this.instance = $(_t).children('.suggest').suggestor(newObj);

        } catch (e) {
            console.warn(e)
        }
    }

}

/**
 *  Registering new elements: push-down 
 */
document.registerElement('nk-suggestor', suggestor);

import Offline from "./Offline.js";
export default class {
    constructor(ajaxStoreActions, rootActions, globalState) {
        //Array of pending requests
        this.success = this.success.bind(this);
        this.error = this.error.bind(this);
        this.ajaxStoreActions = ajaxStoreActions;
        this.rootActions = rootActions;
        //Start checking offline status in intervals
        //this.offlineInstance = new Offline(rootActions, globalState);
    }
    onStoreUpdate(state, actions) {
        //this.offlineInstance.onStateChange(state);
    }
    success(data, textStatus, jqXHR, method) {
        //this.offlineInstance.onRequestSuccess();
        this.remove({ request: jqXHR, method });
    }

    error(jqXHR, textStatus, errorThrown, method) {
        if (jqXHR.status == 0) {
            //this.offlineInstance.onRequestFailure();
        }
        this.remove({ request: jqXHR, method });
    }

    /**
     * [add Add to pending request list and clear it once completed ]
     * @param {[type]} jqXHR [description]
     */
    add(jqXHR, method) {
        setTimeout(() => { this.ajaxStoreActions.addRequest({ request: jqXHR, method }); }, 0);
        // jqXHR.then(this.success, this.error);
        jqXHR.then((data, textStatus, jqXHR) => {
            this.success(data, textStatus, jqXHR, method);
        }, (data, textStatus, jqXHR) => {
            this.error(data, textStatus, jqXHR, method);
        });

    }

    /**
     * [remove Remove from pending request list]
     * @param  {[type]} jqXHR [description]
     * @return {[type]}       [description]
     */
    remove(obj) {
        setTimeout(() => { this.ajaxStoreActions.removeRequest(obj) }, 0);

    }

}

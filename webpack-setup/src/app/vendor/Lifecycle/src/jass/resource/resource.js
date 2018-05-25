/**
 * Author : Ankit Anand
 * Version : Base
 * Desc : Angular like resource factory class
 */
var resource = (function(errorResource) {
    //var commonLoader = $('body').gLoader();

    $.ajaxSettings.timeout = 5000;

    /*var online = false;
    network.onTypeChange(function(type) {
        if (type) {
            online = true;
        } else {
            online = false;
        }
    });*/

    function successHandler(data, textStatus, jqXHR) {
        //commonLoader.unblock();        
    }

    function errorHandler(jqXHR, textStatus, errorThrown) {
        if (jqXHR.status == 401) {
            document.location.href = appConta
        } else {
            errorResource.show("There was an unexpected system error. Please try later.");
        }
        //commonLoader.unblock();
    }

    var prototype = {
        get: function() {
            //commonLoader.block();
            if (window.online) {
                var promise = jQuery.ajax({
                    type: "GET",
                    url: this.url,
                    dataType: "json",
                    success: successHandler,
                    error: errorHandler
                });
                return promise
            } else {
                var dfd = jQuery.Deferred();
                window.setTimeout(function() { dfd.resolve({ "tuples": [] }) }, 0);
                return $.when(dfd);
            }

        },
        save: function(data) {
            //commonLoader.block();
            return jQuery.ajax({
                type: "POST",
                url: this.url,
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: "json",
                success: successHandler,
                error: errorHandler
            });
        },
        remove: function(data) {
            //commonLoader.block();
            return jQuery.ajax({
                type: "POST",
                url: this.url,
                data: JSON.stringify(data),
                contentType: "application/json",
                headers: {
                    'X-HTTP-Method-Override': 'DELETE'
                },
                dataType: "json",
                success: successHandler,
                error: errorHandler
            });
        }
    };

    var constructor = function(url) {
        this.url = url;
    }

    constructor.prototype = prototype;

    return {
        getResource: function(url) {
            return new constructor(url);
        }
    }
}(errorResource));

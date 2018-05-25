// add parameter: preventAddFileKeyInStack 
// reason: since in single upload while on delete file form server, it push previous file version history in stack

/**
changes for, delete file automatically when max file size is 1(one)
 no delete file call needed from outside **/
export function ncUploader(params) {

    var uploader;
    var uploadsLeft;
    var fileKeys = [];

    var construct = function(me) {
        me.params = params;
        uploadsLeft = params.maxNumOfFiles || 0;
        fileKeys = params.fileKeys;
        if (canUseAdvanceUploader()) {
            ncAdvancedUploder.prototype = me; // change the parent of the instance to be created to 'this'
            uploader = new ncAdvancedUploder();
        } else {
            uploadsLeft = me.params.maxNumOfFiles = 1;
            ncBasicUploader.prototype = me; // change the parent of the instance to be created to 'this'
            uploader = new ncBasicUploader();
        }

        $('#' + me.params.fileId).on('change', uploader.upload);

        if ($.isEmptyObject(me.params.plugins) === false) {
            pluginCreater(params, uploader.pluginCallback, uploader.isUploadAllowed, uploader.getFileKey);
        }
        return uploader;
    };

    var canUseAdvanceUploader = function() {
        return (params.forceBasicUploader !== true && typeof File != "undefined" && typeof FileList != "undefined");
    };


    var pluginCreater = function(params, pluginCallback, isUploadAllowed, getFileKey) {
        for (var pluginName in params.plugins) {
            // pluginHandler(pluginName, params, pluginCallback, isUploadAllowed, getFileKey);
            pluginHandler.call(window, pluginName, params, pluginCallback, isUploadAllowed, getFileKey)
        }
    };

    var deleteFileFromServer = function(fileKey, fileName) {
        var delData = {
            'appId': params.appId,
            'formKey': params.formKey,
            'fileKey': fileKey
        };
        var url = params.targets.deleteUrl;
        var result;

        $.post(url, delData, function() {}, "json")
            .done(
                function(data, textStatus, xhr) {
                    if (typeof data[fileKey].ERROR !== "undefined") {
                        callbackArguments = {
                            ERROR: {}
                        };

                        callbackArguments.ERROR[fileKey] = {
                            name: fileName,
                            error: "DELETE_ERROR " + data[fileKey].ERROR
                        }
                        params.callback.call(window, callbackArguments);
                    }
                });
    }

    this.pluginCallback = function(type, args) {


        var callbackArguments = {};
        if (type === "success") {

            updateCount("dec");
            var SUCCESS = [];

            callbackArguments = {
                SUCCESS: []
            };
            if (args) {
                callbackArguments.SUCCESS = args;
                params.callback.call(window, callbackArguments);
            }

        } else if (type === "error") {

            callbackArguments = {
                ERROR: []
            };
            if (args) {
                callbackArguments.ERROR = args;
                params.callback.call(window, callbackArguments);
            }

        } else if (type === "limitExceed") {
            callbackArguments = {
                ERROR: "MAX LIMIT REACHED"
            };
            params.callback.call(window, callbackArguments);

        } else if (type === "selectionExceeded") {
            callbackArguments = {
                ERROR: "SELECTION EXCEEDED"
            };
            params.callback.call(window, callbackArguments);

        } else if (type === "remove") {
            this.deleteFile(args.fileKey, args.name);
        }
    };

    this.deleteFile = function(fileKey, name, shouldFileInputBeKeptHidden) {
        updateCount("inc", shouldFileInputBeKeptHidden);
        if(!params.preventAddFileKeyInStack){
            fileKeys.push(fileKey);
        }
        deleteFileFromServer(fileKey, name);
    }	


    var updateCount = function(action, shouldFileInputBeKeptHidden) {
        shouldFileInputBeKeptHidden = shouldFileInputBeKeptHidden || false;
        if (action == "inc") {
            uploadsLeft++;
            if (uploadsLeft === 1 && !shouldFileInputBeKeptHidden) {
                for (var pluginName in params.plugins) {
                    $('#' + params.plugins[pluginName].buttonId).show();
                    // $('#' + params.plugins[pluginName].buttonId).attr("disabled", "none");
                }
                //$('#' + params.dropAreaParams.id).show();
                $('#' + params.fileId).show();
            }
            if (uploadsLeft === params.maxNumOfFiles) {
                $("#" + params.outputHolder.id).hide();
            }

        }

        if (action == "dec") {
		   if(params.maxNumOfFiles > 1){uploadsLeft--;}
            /*uploadsLeft--;*/
            if (uploadsLeft === 0) {
                if (document.ajaxq) document.ajaxq.q["uploadqueue"] = [];
                for (var pluginName in params.plugins) {
                    $('#' + params.plugins[pluginName].buttonId).hide();
                    // $('#' + params.plugins[pluginName].buttonId).attr("disabled", "disabled");
                }
                $('#' + params.dropAreaParams.id).hide();
                $('#' + params.fileId).hide();
            }
        }
    };

    this.isUploadAllowed = function() {
        if (uploadsLeft <= 0)
            return false;
    };

    this.getFileKey = function() {
		var _fk = params.maxNumOfFiles >1 ? fileKeys.pop() : fileKeys;
        return _fk;
    }
	
    return construct(this); // THIS SHOULD ALWAYS BE PLACED AT THE END OF THIS CLASS.
};

var ncUploaderUtil = {
    getRandomString: function() {
        return (new Date().getTime()) + "_" + ((Math.random() + "").replace(".", "_"));
    },
    cancel: function() {
        if (document.ajaxq.r) {
            document.ajaxq.r.abort();
        }
    }
};

var ncBasicUploader = function() {
    var construct = function(me2) {
        me = me2;
        file = getCurrentFile();
        $('#' + me.params.containerId).show();
        return me;
    };

    var getCurrentFile = function() {
        return $('#' + me.params.fileId)[0];
    };

    this.upload = function() {
        file = getCurrentFile();
        if (!file.value) {
            return;
        }
        var validationDetails = validateBeforeUpload();
        if (!validationDetails.isValid) {
            me.params.callback.call(window, validationDetails.callbackArguments);
            return;
        }
        showProgressBar();
        var uploadFormId = createUploadForm();
        var uploadIframeName = createUploadIframe();
        submitUploadIframe(uploadFormId, uploadIframeName);
//        me.pluginCallback("success"); // to hide buttons of plugins
    };

    var validateBeforeUpload = function() {
        var isValid = true;
        var callbackArguments = {};
        callbackArguments = {
            ERROR: []
        };

        var isExtensionValid = false;
        var extension = file.value.slice(file.value.lastIndexOf(".") + 1).toLowerCase();
        if (extension != file.value) {
            for (var i = 0; i < me.params.extensions.length; ++i) {
                if (extension == me.params.extensions[i]) {
                    isExtensionValid = true;
                    break;
                }
            }
        }
        if (!isExtensionValid) {
            isValid = false;
            callbackArguments.ERROR = {
                dummyFileKey: {
                    error: "INVALID_EXTENSION"
                }
            }

        }

        return {
            isValid: isValid,
            callbackArguments: callbackArguments
        };
    };

    var showProgressBar = function() {
        $('#' + me.params.basicProgressBarId).show();
    };

    var createUploadFormCallbackUrl = function() {
        return $("<input>").attr({
            type: "hidden",
            name: "uploadCallbackUrl",
            value: (location.origin || location.protocol + "//" + location.host) + me.params.callbackUrl
        })[0];
    };

    var createUploadFormCallback = function() {
        var callbackName = "uploadCallback_" + ncUploaderUtil.getRandomString();
        (function(me2) {
            window[callbackName] = function() {
				document.getElementById(me2.params.basicProgressBarId).style.display = "none";
				if (typeof me2.params.callback != "undefined") {
					me2.params.callback.apply(window, arguments);
				}
			};
        })(me);
        return $("<input>").attr({
            type: "hidden",
            name: "uploadCallback",
            value: callbackName
        })[0];

    };

    var createUploadForm = function() {
        var formId = "form_" + ncUploaderUtil.getRandomString();
        var form = $("<form>").attr({
            id: formId,
            method: "POST",
            enctype: "multipart/form-data",
            action: me.params.targets.saveFileUrl
        });

        var fileObj = $('#' + me.params.fileId);
        $(fileObj.clone(true)).insertBefore(fileObj.next());
        fileObj.off('change'); // BUG FIX FOR 
        // THIS LINE HAS TO BE KEPT JUST BEFORE file.style.display = "none" - since IE 7 @ Win XP fires a fake onchange event when file is hidden
        fileObj.hide();

        var appIdEle = $("<input>").attr({
            type: "hidden",
            name: "appId",
            value: me.params.appId
        });


        (form.append(fileObj)
            .append(appIdEle)
            .append(createUploadFormCallbackUrl())
            .append(createUploadFormCallback())

        ).appendTo('body');
        return formId;
    };

    var createUploadIframe = function() {
        var iframeName = "iframe_" + ncUploaderUtil.getRandomString();
        $("<iframe name=\""+iframeName+"\">").attr({
            style: "position: absolute; top: -1000px; left: -1000px"
        }).appendTo('body');
        return iframeName;
    };

    var submitUploadIframe = function(formId, iframeName) {

        $('#' + formId).attr("target", iframeName).submit();
    };

    var me, file;
    return construct(this); // THIS SHOULD ALWAYS BE THE LAST LINE OF THIS CLASS
};

var ncAdvancedUploder = function() {
    var me, files;

    var construct = function(me2) {
        me = me2;
        $('#' + me.params.containerId).show();

        if (me.params.dropAreaParams && me.params.dropAreaParams.id)
            holderInit($('#' + me.params.dropAreaParams.id));
        return me;
    };

    var holderInit = function(holder) {

        holder.on('drop', function(e) {
            e.preventDefault();
            me.params.files = e.originalEvent.dataTransfer.files;
            me.upload();

        });

        holder.on('dragover', function() {
            holder.addClass(me.params.dropAreaParams.onHoverCssClass);
            return false;
        });
        holder.on('dragleave', function() {
            holder.removeClass(me.params.dropAreaParams.onHoverCssClass);
            return false;
        });

        holder.show();
    }

    var progressHandlerCreator = function progressHandlerCreator(element) {
        var pHandler;
        var isMaterializeLoader = element.hasClass('materialize');

        if (isMaterializeLoader) {
            pHandler = function pHandler(e) {
                if (e.lengthComputable) {
                    var perc = e.loaded / e.total * 100;
                    element.find('.determinate').width(perc + '%');
                }
            };
        }
        else {
            pHandler = function pHandler(e) {
                if (e.lengthComputable) {
                    element.attr({
                        value: e.loaded,
                        max: e.total
                    });
                }
            };
        }
        return pHandler;
    };


    this.upload = function() {

        if (me.isUploadAllowed() == false) {
            me.pluginCallback("limitExceed");
            return;
        }

        if (typeof me.params.files == "undefined") {
            files = $('#' + me.params.fileId)[0].files;

        } else {
            files = me.params.files;
        }

        if (!files.length) {
            return;
        } else if (files.length > me.params.maxNumOfFiles) {
            me.pluginCallback("selectionExceeded");
            return;
        }

        var data = {
            appId: me.params.appId,
            uploadCallback: me.params.callback
        }


        for (var i = 0; i < files.length; ++i) {
            var validationDetails = validateBeforeUpload(files[i]);
            if (!validationDetails.isValid) {
                me.params.callback.call(window, validationDetails.callbackArguments);
            } else {
                $("#" + me.params.outputHolder.id).show();
                sendFile(data, files[i]);
                // sendFile(files[i]);
            }
        }
    };

    var validateBeforeUpload = function(file) {
        var isValid = true;
        var isExtensionValid = false;
        var callbackArguments = {};
        callbackArguments = {};

        var extensions = me.params.extensions;
        var extension = file['name'].slice(file['name'].lastIndexOf(".") + 1).toLowerCase();

        if (extension != file.value) {
            for (var i = 0; i < extensions.length; ++i) {
                if (extension == extensions[i]) {
                    isExtensionValid = true;
                    break;
                }
            }
        }


        if (!isExtensionValid) {
            isValid = false;
            callbackArguments.ERROR = {

                dummyFileKey: {
                    name: file['name'],
                    error: "INVALID_EXTENSION"
                }
            };
        }
        if (file.size > me.params.maxSize) {
            isValid = false;
            callbackArguments.ERROR = {
                dummyFileKey: {
                    name: file['name'],
                    error: "FILE SIZE LIMIT EXCEEDED"
                }
            };
        }

        return {
            isValid: isValid,
            callbackArguments: callbackArguments
        };
    };


    var sendFile = function(data, file) {
        var formData = new FormData();
        var fK;
        var rno = ncUploaderUtil.getRandomString();
        for (name in data) {
            formData.append(name, data[name]);
        }

        $.ajaxq("uploadqueue", {

            type: 'POST',
            method: 'POST',
            url: me.params.targets.saveFileUrl,
            enctype: 'multipart/form-data',
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            xhrFields: {
                withCredentials: false
            },
            beforeSend: function() {
                if (typeof me.params.beforeSendCallback === 'function') {
                    me.params.beforeSendCallback();
                }
                var $progress = $('<progress class="progress">');
                if (me.params.materializeLoader) {
                    $progress = $('<span class="progress materialize"><span class="determinate"></span></span>');
                }
                var res = $('<li>').attr({
                    id: rno
                }).html('<div>' + file['name'] + '</div>').append($progress).append(
                    $('<button>').on('click', function() {
                        ncUploaderUtil.cancel();
                        $('#' + rno).remove();
                    })
                );
                if (me.params.outputHolder) $("#" + me.params.outputHolder.id).append(res);

                fK = me.getFileKey();
                formData.append(me.params.formKey + "[" + fK + "]", file);
            },

            error: function(jqXHR, textStatus, errorThrown) {

                me.pluginCallback("error", {
                    dummyFileKey: {
                        name: file['name'],
                        error: errorThrown
                    }
                });
            },

            success: function(reponseData, textStatus, errorThrown) {
                var args = {};
                for (var fileKey in reponseData) {
                    if (typeof reponseData[fileKey].ERROR !== "undefined") {

                        args[fileKey] = {
                            name: file['name'],
                            error: reponseData[fileKey].ERROR
                        };
                        me.pluginCallback("error", args);
                        $('#' + rno).remove();
                    } else {

                        args[fileKey] = {
                            name: file['name'],
                            URL: reponseData[fileKey].URL
                        }
                        me.pluginCallback("success", args);

                        $('#' + rno + '>button')
                            .unbind("click")
                            .bind("click", function() {
                                me.pluginCallback("remove", {
                                    fileKey: fileKey,
                                    name: file['name']
                                });
                                $('#' + rno).remove();
								me.params.onDelete?me.params.onDelete():'';
                            });
                    }
                }

            },

            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', progressHandlerCreator($('#' + rno + '>.progress')), false);

                }
                return myXhr;
            },

            complete: function() {
                var $prg = $('#' + rno + '>.progress');
                if ($prg.hasClass('materialize')) {
                    $('#' + rno).remove();
                }
                else {
                    $prg.hide();
                }
            }


        });
    }

    return construct(this); // THIS SHOULD ALWAYS BE THE LAST LINE OF THIS CLASS
};


var pluginHandler = function(pluginName, params, callback, isUploadAllowed, getFileKey) {
    var constructor = function(me) {
        me.params = params;
        me.isUploadAllowed = isUploadAllowed;
        var pluginObj = window[pluginName](params.plugins[pluginName]);
        return me;
    }

    this.serverHit = function(fileInfo) {

        var rno = ncUploaderUtil.getRandomString();
        var fK;
        if (!fileInfo.fileLink)
            return;
        var data1 = {
            "appId": params.appId,
            "uploadCallback": params.callback.toString(),
            "formKey": params.formKey,
            "filename": fileInfo.fileName,
            "url": fileInfo.fileLink
        };

        $("#" + params.outputHolder.id).show();
        // var urlFiledata = new FormData();
        // for (var name in data1) {
        //     urlFiledata.append(name, data1[name]);
        // }

        if (!(typeof fileInfo.fileToken === "undefined"))
            data1["access_token"] = fileInfo.fileToken;
        // urlFiledata.append("access_token", fileInfo.fileToken);

        $.ajaxq("uploadqueue", {

            type: 'POST',
            method: 'POST',
            url: params.targets.saveCloudUrl,
            data: data1,
            dataType: "json",
            xhrFields: {
                withCredentials: false
            },
            beforeSend: function(jqXhr, obj) {
                var res = $('<li>').attr({
                    id: rno
                }).html('<div>' + fileInfo.fileName + '</div>').append($('#' + params.basicProgressBarId).clone().show()).append(
                    $('<button>').on('click', function() {
                        ncUploaderUtil.cancel();
                        // .html("X")
                        $('#' + rno).remove();
                    })
                );
                if (params.outputHolder) $("#" + params.outputHolder.id).append(res);
                fK = getFileKey();
                obj.data = obj.data + "&fileKey=" + fK;
            },

            success: function(reponseData, textStatus, errorThrown) {

                var args = {};
                for (var fileKey in reponseData) {
                    if (typeof reponseData[fileKey].ERROR !== "undefined") {

                        args[fileKey] = {
                            name: fileInfo.fileName,
                            error: reponseData[fileKey].ERROR
                        };
                        callback("error", args);
                        $('#' + rno).remove();
                    } else {

                        args[fileKey] = {
                            name: fileInfo.fileName,
                            URL: reponseData[fileKey].URL
                        }
                        callback("success", args);

                        $('#' + rno + '>button')
                            .unbind("click")
                            .bind("click", function() {
                                callback("remove", {
                                    fileKey: fileKey,
                                    name: fileInfo.fileName
                                });
                                $('#' + rno).remove();
								me.params.onDelete?me.params.onDelete():'';
                            });
                    }
                }
            },

            error: function(jqXHR, textStatus, errorThrown) {

                callback("error", {
                    dummyFileKey: {
                        name: fileInfo.fileName,
                        error: errorThrown
                    }
                });
            },
            complete: function() {
                $('#' + rno + '>img').hide();
            }
        });
    }

    this.validateBeforeUpload = function(file, fileSize) {

        var isValid = true;
        var isExtensionValid = false;
        var callbackArguments = {};
        callbackArguments = {};

        var extensions = params.extensions;
        var extension = file.slice(file.lastIndexOf(".") + 1).toLowerCase();

        for (var i = 0; i < extensions.length; ++i) {
            if (extension == extensions[i]) {

                isExtensionValid = true;
                break;
            }
        }
        if (!isExtensionValid) {
            isValid = false;
            callbackArguments.ERROR = {
                dummyFileKey: {
                    name: file,
                    error: "INVALID_EXTENSION"
                }
            }
        }
        if (typeof fileSize != "undefined")
            if (fileSize > params.maxSize) {
                isValid = false;
                callbackArguments.ERROR = {
                    dummyFileKey: {
                        name: file,
                        error: "FILE SIZE LIMIT EXCEEDED"
                    }
                }
            }

        return {
            isValid: isValid,
            callbackArguments: callbackArguments
        };
    };

    return constructor(this);

}


//////////////////////////
/*
 * jQuery AjaxQ - AJAX request queueing for jQuery
 *
 * Version: 0.0.1
 * Date: July 22, 2008
 *
 * Copyright (c) 2008 Oleg Podolsky (oleg.podolsky@gmail.com)
 * Licensed under the MIT (MIT-LICENSE.txt) license.
 *
 * http://plugins.jquery.com/project/ajaxq
 * http://code.google.com/p/jquery-ajaxq/
 */

jQuery.ajaxq = function(queue, options) {
    // Initialize storage for request queues if it's not initialized yet
    if (typeof document.ajaxq == "undefined") document.ajaxq = {
        q: {},
        r: null
    };


    // Initialize current queue if it's not initialized yet
    if (typeof document.ajaxq.q[queue] == "undefined") document.ajaxq.q[queue] = [];

    if (typeof options != "undefined") // Request settings are given, enqueue the new request
    {
        // Copy the original options, because options.complete is going to be overridden


        var optionsCopy = {};
        for (var o in options) optionsCopy[o] = options[o];
        options = optionsCopy;

        // Override the original callback

        var originalCompleteCallback = options.complete;

        options.complete = function(request, status) {
            // Dequeue the current request
            // if (document.ajaxq.q[queue] !== null) //added by @shubhamsethi
            document.ajaxq.q[queue].shift();
            document.ajaxq.r = null;

            // Run the original callback
            if (originalCompleteCallback) originalCompleteCallback(request, status);

            // Run the next request from the queue
            // if (document.ajaxq.q[queue] !== null) { //added by @shubhamsethi
            if (document.ajaxq.q[queue].length > 0) document.ajaxq.r = jQuery.ajax(document.ajaxq.q[queue][0]);
            // }
        };
        // Enqueue the request
        // if (document.ajaxq.q[queue] !== null) //added by @shubhamsethi
        document.ajaxq.q[queue].push(options);

        // Also, if no request is currently running, start it
        // if (document.ajaxq.q[queue] !== null) //added by @shubhamsethi
        if (document.ajaxq.q[queue].length == 1) document.ajaxq.r = jQuery.ajax(options);

    } else // No request settings are given, stop current request and clear the queue
    {
        if (document.ajaxq.r) {
            document.ajaxq.r.abort();
            document.ajaxq.r = null;
        }

        document.ajaxq.q[queue] = [];
    }
};

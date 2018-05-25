/**
 * Author : Ankit Anand
 * Version : Base
 * ncUploader class for photo upload
 */

if(!window.editPhotoModule){
    editPhotoModule = {};
}

window.editPhotoModule.uploader = (function(appConstant) {

    var promise;

    var params = {
        appId: 104,
        containerId: "uploadContainer1",
        forceBasicUploader: false,
        maxSize: '',
        maxNumOfFiles: 1,
        dropAreaParams: {
            id: "outputHolder",
            onHoverCssClass: "hover"
        },
        outputHolder: {
            id: "results",
            cssClass: "outputCss"
        },
        basicProgressBarId: "basicProgressBar1",
        extensions: '',
        /*plugins: {
            "DropBox": {
                buttonId: "DropBoxButton",
                dataAppKey: "ty1q0w99psfn6bp"
            },
            "GoogleDrive": {
                buttonId: "GoogleDriveButton",
                apiKey: "AIzaSyDVrVXVWyn4M24uf34gRQUK7TIHUCOUWZs",
                mimeType: "application/vnd.google-apps.document",
                exportLink: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                appendExtension: ".docx"
            }
        },*/
        //fileId: "ncFileUpload",
        fileKeys: [],
        targets: {
            "saveFileUrl": appConstant.ncUploader.saveFileUrl,
            /*"saveCloudUrl": layerParam.file_url,
            "deleteUrl": layerParam.delete_url*/
        },
        formKey: '',
        callback: myUploadCallback
    };



    /**
     * [myUploadCallback Function called by ncUploader as uplaod callback]
     * @return {[type]} [description]
     */
    function myUploadCallback() {
        
        try {
            $n("#resErr").html("");
        } catch (e) {

        }
        //var res = $("<span style=\"color:red; font-size:11px\" id=\"resErr\" >" + '</span><br>');
        var error_fileFormat = "Please ensure that you are uploading a supported file format of max size 3MB";
        var error_server = "There were some errors uploading your file. Please try later.";
        
        if (typeof arguments[0].ERROR !== "undefined") {
            if (arguments[0].ERROR == "MAX LIMIT REACHED") {
                //res.insertAfter('#fileInput');
                msg = error_fileFormat;
            } else if (arguments[0].ERROR == "SELECTION EXCEEDED") {
                //res.insertAfter('#fileInput');
                msg = error_fileFormat;
            } else {
                for (var fileKey in arguments[0].ERROR) {

                    if (arguments[0].ERROR[fileKey].name) {
                        msg = error_fileFormat;
                    }
                    if (arguments[0].ERROR[fileKey].error == "Internal Server Error") {
                        msg = error_server;
                    } else {
                        msg = error_fileFormat;
                    }
                    
                    promise.reject({ "msg": msg });
                };
            }
        } else if (typeof arguments[0].SUCCESS !== "undefined") {

            for (var fileKey in arguments[0].SUCCESS) {

                if (arguments[0].SUCCESS[fileKey].success === "DELETE_SUCCESS") {

                } else {

                }
            };
            promise.resolve({ "fileKey": fileKey });

        } else if (typeof arguments[0][dynamic.fileKeys[0]].ERROR !== "undefined") { //ERROR case of basic
            msg = error_fileFormat;
            promise.reject({ "msg": msg });
        } else {
            //SUCCESS case of basic            
            promise.resolve({ "fileKey": fileKey });
        }
        //$('#fileInput').val('');

    }

    /**
     * [init Initialize nc uploader on the input type=file and return promise resolved or rejected in myuploadcallback]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    function init(fileUploadId, photoConstant) {
        params.maxSize = (photoConstant.maxSize * 1024 * 1024);
        params.extensions = photoConstant.extensions;
        params.formKey = photoConstant.formKey;
        var fileKey = 'U' + randomString(13);
        promise = $.Deferred();

        if ((navigator.userAgent.match(/iPad/i) != null) || (navigator.userAgent.match(/iPhone/i) != null) || (navigator.userAgent.match(/iPod/i) != null)) {
            $('#sdCard').hide();
        } else {
            $('#sdCard').show();
        }
        params.fileId = fileUploadId;
        params.fileKeys = [fileKey];
        var uploader1 = new ncUploader(params);
        return {
            instance: uploader1,
            $promise: promise
        };

    }

    /**
     * [randomString Generate file key]
     * @param  {[type]} length [description]
     * @return {[type]}        [description]
     */
    function randomString(length) {
        var result = '',
            chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }


    return {
        init: init

    }

}(appConstant));

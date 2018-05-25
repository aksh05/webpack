/**
 * Author : Ankit Anand
 * Version : Base
 * Description : Set state and events on photo upload page
 */
// import config from "../../../config.js";

var actionState = window.editPhotoModule.actionState = (function(appConstant, errorResource, resource, uploader, animate) {
    var photoResource = resource.getResource(appConstant.photoCropper.baseUrl);
    var commonLoader = $('body').gLoader();
    var $state = $('.state');
    var $userImg = $("#userImg");

    //Cropper Nodes
    var cropperInstance;
    var animaterInstance;
    var $cropContainer = $('.cropContainer');
    var $parentCropper = $('.parentCropper');
    var $preview = $parentCropper.find('img');
    var $clone_parentCropper = $parentCropper.clone();

    //Cropper yes not button
    var $cropSaveYes = $('.cropSave .yes')
    var $cropSaveNo = $('.cropSave .no')


    //Action group node
    var $action = $('.action');

    //File Upload
    var $uploadContainer = $action.find('.uploadContainer');
    var $fileUpload = $action.find('.fileUpload');
    var $clone_fileUpload = $action.find('.fileUpload').clone();

    //Action button
    var $dummyUploadButton = $action.find(".add .btn");
    var $removeButton = $action.find('.remove .btn');
    var $confirmYesButton = $action.find('.confirm .btn.yes');
    var $confirmNoButton = $action.find('.confirm .btn.no');

    // validation param fill by init method
    var validParam = {
        maxSize: '',
        extensions: '',
        msg: ''
    };

    /**
     * [toggleState_add_change Toggle state between add and change based on photo availability]
     * @param  {[type]} config [description]
     * @return {[type]}        [description]
     */
    function toggleState_add_change(config) {
        if (config.photoAvailable) {
            $state.removeClass("addPhoto");
            $state.addClass("changePhoto");
            $dummyUploadButton.val("Change photo");
            $userImg.attr("src", config.userImg);

        } else {
            $state.removeClass("changePhoto");
            $state.addClass("addPhoto");
            $dummyUploadButton.val("Upload photo");
            //To prevent showing black border
            $userImg.hide();
        }
    }


    /**
     * [resetUploder Function to reset uploader]
     * @return {[type]} [description]
     */
    function resetUploder() {
        //File upload button is recreated due to internal function of ncuploader
        $fileUpload.remove();
        $fileUpload = $clone_fileUpload;
        $clone_fileUpload = $fileUpload.clone();
        $uploadContainer.append($fileUpload);
        $fileUpload.on('change', onFileChange)

        //State is set to Change Photo
        //$state.removeClass('cropPhoto');
        //$dummyUploadButton.val("Change Photo");
        //$state.addClass('changePhoto');
    }

    /**
     * [previewFile Set file selected as image src of preview]
     * @return {[type]} [description]
     */
    function previewFile(preview, fileNode) {
        var preview, file = fileNode.files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function() {
            preview.src = reader.result;
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }

        return reader;
    }

    /**
     * [openCropper Opens cropper on screen with preview of selected image]
     * @return {[type]} [description]
     */
    function openCropper(file) {
        $parentCropper.remove();
        $parentCropper = $clone_parentCropper;
        $cropContainer.prepend($parentCropper);
        $preview = $parentCropper.find('img');
        $clone_parentCropper = $parentCropper.clone();

        //Preview file
        previewFile($preview[0], file)
            .addEventListener("load", function() {
                //Open cropper
                animaterInstance.enter();
                /*$state.removeClass('leave');
                $state.addClass('enter-active');*/
                //$state.removeClass('addPhoto changePhoto');
                $state.addClass('cropPhoto');
                //Create new cropper instance
                cropperInstance = new imageCropper();
            }, false);

        if (window.editPhotoModule && window.editPhotoModule.config && window.editPhotoModule.config.callbacks && window.editPhotoModule.config.callbacks.cropperOpen) {
            window.editPhotoModule.config.callbacks.cropperOpen();
        }

    }

    /**
     * [closeCropper Close cropper]
     * @return {[type]} [description]
     */
    function closeCropper() {
        resetUploder();
        animaterInstance.leave();
        /*$state.removeClass('enter');
        $state.addClass('leave');
        */$state.removeClass('cropPhoto');
        //$state.addClass('addPhoto');
        if (window.editPhotoModule && window.editPhotoModule.config && window.editPhotoModule.config.callbacks && window.editPhotoModule.config.callbacks.cropperClose) {
            window.editPhotoModule.config.callbacks.cropperClose();
        }
    }

    function callValidationCb(msg) {
        if (window.editPhotoModule && window.editPhotoModule.config && window.editPhotoModule.config.callbacks && window.editPhotoModule.config.callbacks.validationCallback) {
            window.editPhotoModule.config.callbacks.validationCallback(msg);
        }
    }

    /**
     * [isValidFile is checking a valid file type]
     * @param  {[type]} file [file object]
     * @return {[type]} [description]
     */
    function isValidFile(file) {
        var ext = file.name.split('.').pop();
        if (file.size > validParam.maxSize) {
            callValidationCb(validParam.msg.maxLimit);
            return false;
        }
        if (validParam.extensions.indexOf(ext.toLowerCase()) < 0) {
            callValidationCb(validParam.msg.invalidFormat);
            return false;
        }
        return true;
    }

    /**
     * [onFileChange Cropper is opened on change of input]
     * @return {[type]} [description]
     */
    function onFileChange() {
        var file = this.files[0];
        if (!isValidFile(file)) {
            return;
        }
        openCropper(this);

        $preview.on("load", function() {
            cropperInstance.init({
                id: '.parentCropper img'
            });
        });
    }
    /**
     * [init Initialize state and event of page]
     * @param  {[type]} redirectUrl [Url for redirection no phot upload succes]
     * @return {[type]}             [description]
     */
    function init(redirectUrl, config) {
        if (window.editPhotoModule) {
            window.editPhotoModule.config = config;
        }

        validParam.maxSize = (config.photoConstant.maxSize * 1024 * 1024);
        validParam.extensions = config.photoConstant.extensions;
        validParam.msg = config.photoConstant.msg;

        $fileUpload.on('change', onFileChange)
        $removeButton.on('click', function() {
            $state.addClass('confirmPhoto');
        });
        $confirmYesButton.on('click', function() {
            photoResource.remove({
                "userType": "fresher"
            }).then(function() {
                //Api Success
                $state.removeClass('confirmPhoto');
                toggleState_add_change({ "photoAvailable": false });
            });

        });
        $confirmNoButton.on('click', function() {
            $state.removeClass('confirmPhoto');
        });

        $cropSaveYes.on('click', function() {
            var selectedImage = $fileUpload.val();
            var uploaderInstance = uploader.init("fileUpload", config.photoConstant);
            // commonLoader.block();

            if (config.callbacks && config.callbacks.beforeNcUpload) {
                config.callbacks.beforeNcUpload();
            }

            uploaderInstance.instance.upload();

            uploaderInstance.$promise.then(function(data) {
                closeCropper();
                if (config.callbacks && config.callbacks.afterNcUpload) {
                    config.callbacks.afterNcUpload('success', {
                        "fileKey": data.fileKey,
                        "formKey": appConstant.photoCropper.formKey,
                        "coordinates": cropperInstance.coordinates //{ "x1": "50", "x2": "400", "y1": "50", "y2": "400" }
                    });
                }
                /*photoResource.save({
                    "userType": "fresher",
                    "photo": {
                        "fileKey": data.fileKey,
                        "formKey": appConstant.photoCropper.formKey,
                        "coordinates": cropperInstance.coordinates //{ "x1": "50", "x2": "400", "y1": "50", "y2": "400" }
                    }
                }).then(function() {
                    document.location.href = redirectUrl;
                }, function() {
                    closeCropper();
                });*/
            }, function(error) {
                closeCropper();
                if (config.callbacks && config.callbacks.afterNcUpload) {
                    config.callbacks.afterNcUpload('error', error);
                }
                // errorResource.show(error.msg);
                // closeCropper();
            });
        });
        $cropSaveNo.on('click', function() {
            closeCropper();
        });

        toggleState_add_change(config);

        animaterInstance = animate.init($state);
    }

    return {
        init: init
    }

}(appConstant, errorResource, resource, window.editPhotoModule.uploader, window.editPhotoModule.animate));

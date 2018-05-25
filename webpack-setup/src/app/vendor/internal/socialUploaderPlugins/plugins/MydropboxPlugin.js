   // DropBox.prototype = pluginHandler;

   function DropBox(config) {

       var allowMultiSelect;
       var allowedExtensions;
       var me;

       var construct = function(me2) {
           //load dp js
           me = me2;

           //$("<script type=\"text/javascript\" src=\"https://www.dropbox.com/static/api/2/dropins.js\" id=\"dropboxjs\" data-app-key=\"" + config.dataAppKey + "\"></script>").insertAfter('body');
       $("<script>").attr({
          type : "text/javascript",
        id: "dropboxjs",
        src: "https://www.dropbox.com/static/api/2/dropins.js",
        "data-app-key" :  config.dataAppKey
      }).appendTo('body');

           $("#" + config.buttonId).on('click', me.uploadcall);
           $("#" + config.buttonId).show();

           allowMultiSelect = false;
           if (me.params.maxNumOfFiles > 1) {
               allowMultiSelect = true;
           }

           formatExtensions();
           return me2;

       };

       // changing ["txt"] => [".txt"]
       var formatExtensions = function() {
           allowedExtensions = me.params.extensions.toString().split(',');
           for (var i = 0; i < allowedExtensions.length; i++) {
               allowedExtensions[i] = "." + allowedExtensions[i];
           }

       }


       var dropBoxCallback = function(file) {
           var fileInfo = {};
           var validationDetails = me.validateBeforeUpload(file.name, file.bytes);
           if (!validationDetails.isValid) {
               me.params.callback.call(window, validationDetails.callbackArguments);
           } else {

               fileInfo.fileName = file.name;
               if (!(file.link === null || file.link === '')) {
                   fileInfo.fileLink = file.link;
               }
               me.serverHit(fileInfo);
           }
       };

       var dropboxUploader = function() {

           var options = {
               multiselect: allowMultiSelect, // false or true
               linkType: 'direct', // "preview"or "direct"
               extensions: allowedExtensions,
               success: function(files) {
                   for (var i = 0; i < files.length; i++) {
                       dropBoxCallback(files[i]);
                   }
               },
               cancel: function() {}
           };
           Dropbox.choose(options);
       };

       this.uploadcall = function() {

           if (me.isUploadAllowed() == false) {
               return;
           }
           dropboxUploader();
       };

       return construct(this);
   };

    // $("<script type=\"text/javascript\" src=\"https://www.dropbox.com/static/api/2/dropins.js\" id=\"dropboxjs\" data-app-key=\"uz0vnoh76ljehkf\"></script>").insertAfter('body');

  // GoogleDrive.prototype = pluginHandler;

  function GoogleDrive(config, isUploadAllowed) {

      var CLIENT_ID = '902537026943-j85kqr6a68adtpjlm79qf22j4aogjtsa.apps.googleusercontent.com';
      var SCOPES = 'https://www.googleapis.com/auth/drive';
      var authDone;
      var clicked = false;
      var me;

      var construct = function(me2) {

          me = me2;

          var script = document.createElement('script');
          script.src = "https://www.google.com/jsapi?key=" + config.apiKey;
          document.getElementsByTagName("head")[0].appendChild(script);
          var script = document.createElement('script');
          script.src = "https://apis.google.com/js/client.js?onload=handleClientLoad";
          document.getElementsByTagName("head")[0].appendChild(script);


          //          $("<script src=\"https://www.google.com/jsapi?key=" + config.apiKey + "\"></script>").insertAfter('body');
          //          $("<script src=\"https://apis.google.com/js/client.js?onload=handleClientLoad\" type=\"text/javascript\"></script>").insertAfter('body');

          return me2;
      };

      var loadPickerApi = function() {
          google.load('picker', '1', {
              "callback": function(e) {
                  $('#' + config.buttonId).on('click', me.uploadcall);
                  $('#' + config.buttonId).show();
              }
          });
      };

      // Called when the client library is loaded to start the auth flow.
      window.handleClientLoad = function() {
          window.setTimeout(checkAuth, 1);
          loadPickerApi();
      };

      // Check if the current user has authorized the application.
      var checkAuth = function() {
              gapi.auth.authorize({
                      'client_id': CLIENT_ID,
                      'scope': SCOPES,
                      'immediate': true
                  },
                  handleAuthResult);
          }
          /**
           * Called when authorization server replies.
           *
           * @param {Object} authResult Authorization result.
           */
      var handleAuthResult = function(authResult) {
          if (authResult && !authResult.error) {
              authDone = true;
          }

          if (clicked === true) {
              createPicker();
              clicked = false;
          }
      }

      this.uploadcall = function() {

          if (me.isUploadAllowed() == false) {
              return;
          }

          clicked = true;
          if (authDone !== true) {
              gapi.auth.authorize({
                      'client_id': CLIENT_ID,
                      'scope': SCOPES,
                      'immediate': false
                  },
                  handleAuthResult);

          } else {
              createPicker();
              clicked = false;
          }
      };

      var createPicker = function() {
          var accessToken = gapi.auth.getToken().access_token; //IMP
          var view = new google.picker.ViewGroup(google.picker.ViewId.DOCS).addView(google.picker.ViewId.PDFS);

          var picker = new google.picker.PickerBuilder()
              .enableFeature(google.picker.Feature.NAV_HIDDEN)
              .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
              .setAppId('626687530140-hqokibi4b8siob3cims0nca6efhdbk6d')
              .setOAuthToken(accessToken)
              .addViewGroup(view)
              .setCallback(pickerCallback)
              .build();

          // if (me.params.maxNumOfFiles > 1) {
          //     picker.picker.PickerBuilder().enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
          // }

          picker.setVisible(true);
      }

      var fileIds = []; //contains ids of files selected from picker

      var pickerCallback = function(data) {
          if (data.action == google.picker.Action.PICKED) {
              // console.log(data.docs);
              for (var i = 0; i < data.docs.length && i < me.params.maxNumOfFiles; i++) {
                  fileIds[i] = data.docs[i].id;
              }
              downloadFile(0);
          }
      }

      var downloadFile = function(i) {

          var request;
          gapi.client.load('drive', 'v2', function() {

              request = gapi.client.drive.files.get({
                  'fileId': fileIds[i]
              });

              request.execute(
                  function(resp) {
                      var isWeirdGoogleDriveFileType = (resp.title.indexOf('.') == -1 || resp.exportLinks) && resp.mimeType == config.mimeType;
                      // BUG FIX checking just title of file fails if there exist a native Google file with name ending in valid extension (eg. xyzfile.doc)
                      var filename = resp.title;
                      if (isWeirdGoogleDriveFileType) filename += config.appendExtension;

                      var validationDetails = me.validateBeforeUpload(filename, resp.fileSize);
                      if (!validationDetails.isValid) {
                          me.params.callback.call(window, validationDetails.callbackArguments);
                      } else {
                          var fileInfo = {};
                          fileInfo.fileName = filename;

                          if (!(resp.downloadUrl === null || resp.downloadUrl === '')) {
                              fileInfo.fileLink = resp.downloadUrl;
                          }
                          if (isWeirdGoogleDriveFileType) {
                              fileInfo.fileLink = resp.exportLinks[config.exportLink];
                          }
                          fileInfo.fileToken = gapi.auth.getToken().access_token;
                          me.serverHit(fileInfo);
                      }
                      if (fileIds.length == i + 1) {
                          return;
                      } else {
                          downloadFile(i + 1);
                      }

                  });

          });
      };

      return construct(this);
  }

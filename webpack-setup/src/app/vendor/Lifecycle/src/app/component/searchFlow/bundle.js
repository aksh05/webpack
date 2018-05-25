(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var something = (function () {
           'use strict';

           var config = {
                      database: {
                                 //driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver()
                                 name: 'naukriDB1',
                                 version: 1.0,
                                 //size: 4980736, // Size of database, in bytes. WebSQL-only for now.
                                 storeName: 'naukriStore1', // Should be alphanumeric, with underscores.
                                 description: 'Some description'
                      }
           };

           var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

           function createCommonjsModule(fn, module) {
           	return module = { exports: {} }, fn(module, module.exports), module.exports;
           }

           var localforage = createCommonjsModule(function (module, exports) {
           /*!
               localForage -- Offline Storage, Improved
               Version 1.4.2
               https://mozilla.github.io/localForage
               (c) 2013-2015 Mozilla, Apache License 2.0
           */
           (function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof commonjsGlobal!=="undefined"){g=commonjsGlobal}else if(typeof self!=="undefined"){g=self}else{g=this}g.localforage = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a='function'=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i='function'=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
           'use strict';
           var immediate = _dereq_(2);

           /* istanbul ignore next */
           function INTERNAL() {}

           var handlers = {};

           var REJECTED = ['REJECTED'];
           var FULFILLED = ['FULFILLED'];
           var PENDING = ['PENDING'];

           module.exports = exports = Promise;

           function Promise(resolver) {
             if (typeof resolver !== 'function') {
               throw new TypeError('resolver must be a function');
             }
             this.state = PENDING;
             this.queue = [];
             this.outcome = void 0;
             if (resolver !== INTERNAL) {
               safelyResolveThenable(this, resolver);
             }
           }

           Promise.prototype["catch"] = function (onRejected) {
             return this.then(null, onRejected);
           };
           Promise.prototype.then = function (onFulfilled, onRejected) {
             if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
               typeof onRejected !== 'function' && this.state === REJECTED) {
               return this;
             }
             var promise = new this.constructor(INTERNAL);
             if (this.state !== PENDING) {
               var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
               unwrap(promise, resolver, this.outcome);
             } else {
               this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
             }

             return promise;
           };
           function QueueItem(promise, onFulfilled, onRejected) {
             this.promise = promise;
             if (typeof onFulfilled === 'function') {
               this.onFulfilled = onFulfilled;
               this.callFulfilled = this.otherCallFulfilled;
             }
             if (typeof onRejected === 'function') {
               this.onRejected = onRejected;
               this.callRejected = this.otherCallRejected;
             }
           }
           QueueItem.prototype.callFulfilled = function (value) {
             handlers.resolve(this.promise, value);
           };
           QueueItem.prototype.otherCallFulfilled = function (value) {
             unwrap(this.promise, this.onFulfilled, value);
           };
           QueueItem.prototype.callRejected = function (value) {
             handlers.reject(this.promise, value);
           };
           QueueItem.prototype.otherCallRejected = function (value) {
             unwrap(this.promise, this.onRejected, value);
           };

           function unwrap(promise, func, value) {
             immediate(function () {
               var returnValue;
               try {
                 returnValue = func(value);
               } catch (e) {
                 return handlers.reject(promise, e);
               }
               if (returnValue === promise) {
                 handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
               } else {
                 handlers.resolve(promise, returnValue);
               }
             });
           }

           handlers.resolve = function (self, value) {
             var result = tryCatch(getThen, value);
             if (result.status === 'error') {
               return handlers.reject(self, result.value);
             }
             var thenable = result.value;

             if (thenable) {
               safelyResolveThenable(self, thenable);
             } else {
               self.state = FULFILLED;
               self.outcome = value;
               var i = -1;
               var len = self.queue.length;
               while (++i < len) {
                 self.queue[i].callFulfilled(value);
               }
             }
             return self;
           };
           handlers.reject = function (self, error) {
             self.state = REJECTED;
             self.outcome = error;
             var i = -1;
             var len = self.queue.length;
             while (++i < len) {
               self.queue[i].callRejected(error);
             }
             return self;
           };

           function getThen(obj) {
             // Make sure we only access the accessor once as required by the spec
             var then = obj && obj.then;
             if (obj && typeof obj === 'object' && typeof then === 'function') {
               return function appyThen() {
                 then.apply(obj, arguments);
               };
             }
           }

           function safelyResolveThenable(self, thenable) {
             // Either fulfill, reject or reject with error
             var called = false;
             function onError(value) {
               if (called) {
                 return;
               }
               called = true;
               handlers.reject(self, value);
             }

             function onSuccess(value) {
               if (called) {
                 return;
               }
               called = true;
               handlers.resolve(self, value);
             }

             function tryToUnwrap() {
               thenable(onSuccess, onError);
             }

             var result = tryCatch(tryToUnwrap);
             if (result.status === 'error') {
               onError(result.value);
             }
           }

           function tryCatch(func, value) {
             var out = {};
             try {
               out.value = func(value);
               out.status = 'success';
             } catch (e) {
               out.status = 'error';
               out.value = e;
             }
             return out;
           }

           exports.resolve = resolve;
           function resolve(value) {
             if (value instanceof this) {
               return value;
             }
             return handlers.resolve(new this(INTERNAL), value);
           }

           exports.reject = reject;
           function reject(reason) {
             var promise = new this(INTERNAL);
             return handlers.reject(promise, reason);
           }

           exports.all = all;
           function all(iterable) {
             var self = this;
             if (Object.prototype.toString.call(iterable) !== '[object Array]') {
               return this.reject(new TypeError('must be an array'));
             }

             var len = iterable.length;
             var called = false;
             if (!len) {
               return this.resolve([]);
             }

             var values = new Array(len);
             var resolved = 0;
             var i = -1;
             var promise = new this(INTERNAL);

             while (++i < len) {
               allResolver(iterable[i], i);
             }
             return promise;
             function allResolver(value, i) {
               self.resolve(value).then(resolveFromAll, function (error) {
                 if (!called) {
                   called = true;
                   handlers.reject(promise, error);
                 }
               });
               function resolveFromAll(outValue) {
                 values[i] = outValue;
                 if (++resolved === len && !called) {
                   called = true;
                   handlers.resolve(promise, values);
                 }
               }
             }
           }

           exports.race = race;
           function race(iterable) {
             var self = this;
             if (Object.prototype.toString.call(iterable) !== '[object Array]') {
               return this.reject(new TypeError('must be an array'));
             }

             var len = iterable.length;
             var called = false;
             if (!len) {
               return this.resolve([]);
             }

             var i = -1;
             var promise = new this(INTERNAL);

             while (++i < len) {
               resolver(iterable[i]);
             }
             return promise;
             function resolver(value) {
               self.resolve(value).then(function (response) {
                 if (!called) {
                   called = true;
                   handlers.resolve(promise, response);
                 }
               }, function (error) {
                 if (!called) {
                   called = true;
                   handlers.reject(promise, error);
                 }
               });
             }
           }

           },{"2":2}],2:[function(_dereq_,module,exports){
           (function (global){
           'use strict';
           var Mutation = global.MutationObserver || global.WebKitMutationObserver;

           var scheduleDrain;

           {
             if (Mutation) {
               var called = 0;
               var observer = new Mutation(nextTick);
               var element = global.document.createTextNode('');
               observer.observe(element, {
                 characterData: true
               });
               scheduleDrain = function () {
                 element.data = (called = ++called % 2);
               };
             } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
               var channel = new global.MessageChannel();
               channel.port1.onmessage = nextTick;
               scheduleDrain = function () {
                 channel.port2.postMessage(0);
               };
             } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
               scheduleDrain = function () {

                 // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
                 // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
                 var scriptEl = global.document.createElement('script');
                 scriptEl.onreadystatechange = function () {
                   nextTick();

                   scriptEl.onreadystatechange = null;
                   scriptEl.parentNode.removeChild(scriptEl);
                   scriptEl = null;
                 };
                 global.document.documentElement.appendChild(scriptEl);
               };
             } else {
               scheduleDrain = function () {
                 setTimeout(nextTick, 0);
               };
             }
           }

           var draining;
           var queue = [];
           //named nextTick for less confusing stack traces
           function nextTick() {
             draining = true;
             var i, oldQueue;
             var len = queue.length;
             while (len) {
               oldQueue = queue;
               queue = [];
               i = -1;
               while (++i < len) {
                 oldQueue[i]();
               }
               len = queue.length;
             }
             draining = false;
           }

           module.exports = immediate;
           function immediate(task) {
             if (queue.push(task) === 1 && !draining) {
               scheduleDrain();
             }
           }

           }).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
           },{}],3:[function(_dereq_,module,exports){
           (function (global){
           'use strict';
           if (typeof global.Promise !== 'function') {
             global.Promise = _dereq_(1);
           }

           }).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
           },{"1":1}],4:[function(_dereq_,module,exports){
           'use strict';

           var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

           function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

           function getIDB() {
               /* global indexedDB,webkitIndexedDB,mozIndexedDB,OIndexedDB,msIndexedDB */
               if (typeof indexedDB !== 'undefined') {
                   return indexedDB;
               }
               if (typeof webkitIndexedDB !== 'undefined') {
                   return webkitIndexedDB;
               }
               if (typeof mozIndexedDB !== 'undefined') {
                   return mozIndexedDB;
               }
               if (typeof OIndexedDB !== 'undefined') {
                   return OIndexedDB;
               }
               if (typeof msIndexedDB !== 'undefined') {
                   return msIndexedDB;
               }
           }

           var idb = getIDB();

           function isIndexedDBValid() {
               try {
                   // Initialize IndexedDB; fall back to vendor-prefixed versions
                   // if needed.
                   if (!idb) {
                       return false;
                   }
                   // We mimic PouchDB here; just UA test for Safari (which, as of
                   // iOS 8/Yosemite, doesn't properly support IndexedDB).
                   // IndexedDB support is broken and different from Blink's.
                   // This is faster than the test case (and it's sync), so we just
                   // do this. *SIGH*
                   // http://bl.ocks.org/nolanlawson/raw/c83e9039edf2278047e9/
                   //
                   // We test for openDatabase because IE Mobile identifies itself
                   // as Safari. Oh the lulz...
                   if (typeof openDatabase !== 'undefined' && typeof navigator !== 'undefined' && navigator.userAgent && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
                       return false;
                   }

                   return idb && typeof idb.open === 'function' &&
                   // Some Samsung/HTC Android 4.0-4.3 devices
                   // have older IndexedDB specs; if this isn't available
                   // their IndexedDB is too old for us to use.
                   // (Replaces the onupgradeneeded test.)
                   typeof IDBKeyRange !== 'undefined';
               } catch (e) {
                   return false;
               }
           }

           function isWebSQLValid() {
               return typeof openDatabase === 'function';
           }

           function isLocalStorageValid() {
               try {
                   return typeof localStorage !== 'undefined' && 'setItem' in localStorage && localStorage.setItem;
               } catch (e) {
                   return false;
               }
           }

           // Abstracts constructing a Blob object, so it also works in older
           // browsers that don't support the native Blob constructor. (i.e.
           // old QtWebKit versions, at least).
           // Abstracts constructing a Blob object, so it also works in older
           // browsers that don't support the native Blob constructor. (i.e.
           // old QtWebKit versions, at least).
           function createBlob(parts, properties) {
               /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
               parts = parts || [];
               properties = properties || {};
               try {
                   return new Blob(parts, properties);
               } catch (e) {
                   if (e.name !== 'TypeError') {
                       throw e;
                   }
                   var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder : typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : WebKitBlobBuilder;
                   var builder = new Builder();
                   for (var i = 0; i < parts.length; i += 1) {
                       builder.append(parts[i]);
                   }
                   return builder.getBlob(properties.type);
               }
           }

           // This is CommonJS because lie is an external dependency, so Rollup
           // can just ignore it.
           if (typeof Promise === 'undefined' && typeof _dereq_ !== 'undefined') {
               _dereq_(3);
           }
           var Promise$1 = Promise;

           function executeCallback(promise, callback) {
               if (callback) {
                   promise.then(function (result) {
                       callback(null, result);
                   }, function (error) {
                       callback(error);
                   });
               }
           }

           // Some code originally from async_storage.js in
           // [Gaia](https://github.com/mozilla-b2g/gaia).

           var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
           var supportsBlobs;
           var dbContexts;

           // Transform a binary string to an array buffer, because otherwise
           // weird stuff happens when you try to work with the binary string directly.
           // It is known.
           // From http://stackoverflow.com/questions/14967647/ (continues on next line)
           // encode-decode-image-with-base64-breaks-image (2013-04-21)
           function _binStringToArrayBuffer(bin) {
               var length = bin.length;
               var buf = new ArrayBuffer(length);
               var arr = new Uint8Array(buf);
               for (var i = 0; i < length; i++) {
                   arr[i] = bin.charCodeAt(i);
               }
               return buf;
           }

           //
           // Blobs are not supported in all versions of IndexedDB, notably
           // Chrome <37 and Android <5. In those versions, storing a blob will throw.
           //
           // Various other blob bugs exist in Chrome v37-42 (inclusive).
           // Detecting them is expensive and confusing to users, and Chrome 37-42
           // is at very low usage worldwide, so we do a hacky userAgent check instead.
           //
           // content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
           // 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
           // FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
           //
           // Code borrowed from PouchDB. See:
           // https://github.com/pouchdb/pouchdb/blob/9c25a23/src/adapters/idb/blobSupport.js
           //
           function _checkBlobSupportWithoutCaching(txn) {
               return new Promise$1(function (resolve) {
                   var blob = createBlob(['']);
                   txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');

                   txn.onabort = function (e) {
                       // If the transaction aborts now its due to not being able to
                       // write to the database, likely due to the disk being full
                       e.preventDefault();
                       e.stopPropagation();
                       resolve(false);
                   };

                   txn.oncomplete = function () {
                       var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
                       var matchedEdge = navigator.userAgent.match(/Edge\//);
                       // MS Edge pretends to be Chrome 42:
                       // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
                       resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
                   };
               })["catch"](function () {
                   return false; // error, so assume unsupported
               });
           }

           function _checkBlobSupport(idb) {
               if (typeof supportsBlobs === 'boolean') {
                   return Promise$1.resolve(supportsBlobs);
               }
               return _checkBlobSupportWithoutCaching(idb).then(function (value) {
                   supportsBlobs = value;
                   return supportsBlobs;
               });
           }

           function _deferReadiness(dbInfo) {
               var dbContext = dbContexts[dbInfo.name];

               // Create a deferred object representing the current database operation.
               var deferredOperation = {};

               deferredOperation.promise = new Promise$1(function (resolve) {
                   deferredOperation.resolve = resolve;
               });

               // Enqueue the deferred operation.
               dbContext.deferredOperations.push(deferredOperation);

               // Chain its promise to the database readiness.
               if (!dbContext.dbReady) {
                   dbContext.dbReady = deferredOperation.promise;
               } else {
                   dbContext.dbReady = dbContext.dbReady.then(function () {
                       return deferredOperation.promise;
                   });
               }
           }

           function _advanceReadiness(dbInfo) {
               var dbContext = dbContexts[dbInfo.name];

               // Dequeue a deferred operation.
               var deferredOperation = dbContext.deferredOperations.pop();

               // Resolve its promise (which is part of the database readiness
               // chain of promises).
               if (deferredOperation) {
                   deferredOperation.resolve();
               }
           }

           function _getConnection(dbInfo, upgradeNeeded) {
               return new Promise$1(function (resolve, reject) {

                   if (dbInfo.db) {
                       if (upgradeNeeded) {
                           _deferReadiness(dbInfo);
                           dbInfo.db.close();
                       } else {
                           return resolve(dbInfo.db);
                       }
                   }

                   var dbArgs = [dbInfo.name];

                   if (upgradeNeeded) {
                       dbArgs.push(dbInfo.version);
                   }

                   var openreq = idb.open.apply(idb, dbArgs);

                   if (upgradeNeeded) {
                       openreq.onupgradeneeded = function (e) {
                           var db = openreq.result;
                           try {
                               db.createObjectStore(dbInfo.storeName);
                               if (e.oldVersion <= 1) {
                                   // Added when support for blob shims was added
                                   db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                               }
                           } catch (ex) {
                               if (ex.name === 'ConstraintError') {
                                   console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + e.oldVersion + ' to version ' + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                               } else {
                                   throw ex;
                               }
                           }
                       };
                   }

                   openreq.onerror = function () {
                       reject(openreq.error);
                   };

                   openreq.onsuccess = function () {
                       resolve(openreq.result);
                       _advanceReadiness(dbInfo);
                   };
               });
           }

           function _getOriginalConnection(dbInfo) {
               return _getConnection(dbInfo, false);
           }

           function _getUpgradedConnection(dbInfo) {
               return _getConnection(dbInfo, true);
           }

           function _isUpgradeNeeded(dbInfo, defaultVersion) {
               if (!dbInfo.db) {
                   return true;
               }

               var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
               var isDowngrade = dbInfo.version < dbInfo.db.version;
               var isUpgrade = dbInfo.version > dbInfo.db.version;

               if (isDowngrade) {
                   // If the version is not the default one
                   // then warn for impossible downgrade.
                   if (dbInfo.version !== defaultVersion) {
                       console.warn('The database "' + dbInfo.name + '"' + ' can\'t be downgraded from version ' + dbInfo.db.version + ' to version ' + dbInfo.version + '.');
                   }
                   // Align the versions to prevent errors.
                   dbInfo.version = dbInfo.db.version;
               }

               if (isUpgrade || isNewStore) {
                   // If the store is new then increment the version (if needed).
                   // This will trigger an "upgradeneeded" event which is required
                   // for creating a store.
                   if (isNewStore) {
                       var incVersion = dbInfo.db.version + 1;
                       if (incVersion > dbInfo.version) {
                           dbInfo.version = incVersion;
                       }
                   }

                   return true;
               }

               return false;
           }

           // encode a blob for indexeddb engines that don't support blobs
           function _encodeBlob(blob) {
               return new Promise$1(function (resolve, reject) {
                   var reader = new FileReader();
                   reader.onerror = reject;
                   reader.onloadend = function (e) {
                       var base64 = btoa(e.target.result || '');
                       resolve({
                           __local_forage_encoded_blob: true,
                           data: base64,
                           type: blob.type
                       });
                   };
                   reader.readAsBinaryString(blob);
               });
           }

           // decode an encoded blob
           function _decodeBlob(encodedBlob) {
               var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
               return createBlob([arrayBuff], { type: encodedBlob.type });
           }

           // is this one of our fancy encoded blobs?
           function _isEncodedBlob(value) {
               return value && value.__local_forage_encoded_blob;
           }

           // Specialize the default `ready()` function by making it dependent
           // on the current database operations. Thus, the driver will be actually
           // ready when it's been initialized (default) *and* there are no pending
           // operations on the database (initiated by some other instances).
           function _fullyReady(callback) {
               var self = this;

               var promise = self._initReady().then(function () {
                   var dbContext = dbContexts[self._dbInfo.name];

                   if (dbContext && dbContext.dbReady) {
                       return dbContext.dbReady;
                   }
               });

               promise.then(callback, callback);
               return promise;
           }

           // Open the IndexedDB database (automatically creates one if one didn't
           // previously exist), using any options set in the config.
           function _initStorage(options) {
               var self = this;
               var dbInfo = {
                   db: null
               };

               if (options) {
                   for (var i in options) {
                       dbInfo[i] = options[i];
                   }
               }

               // Initialize a singleton container for all running localForages.
               if (!dbContexts) {
                   dbContexts = {};
               }

               // Get the current context of the database;
               var dbContext = dbContexts[dbInfo.name];

               // ...or create a new context.
               if (!dbContext) {
                   dbContext = {
                       // Running localForages sharing a database.
                       forages: [],
                       // Shared database.
                       db: null,
                       // Database readiness (promise).
                       dbReady: null,
                       // Deferred operations on the database.
                       deferredOperations: []
                   };
                   // Register the new context in the global container.
                   dbContexts[dbInfo.name] = dbContext;
               }

               // Register itself as a running localForage in the current context.
               dbContext.forages.push(self);

               // Replace the default `ready()` function with the specialized one.
               if (!self._initReady) {
                   self._initReady = self.ready;
                   self.ready = _fullyReady;
               }

               // Create an array of initialization states of the related localForages.
               var initPromises = [];

               function ignoreErrors() {
                   // Don't handle errors here,
                   // just makes sure related localForages aren't pending.
                   return Promise$1.resolve();
               }

               for (var j = 0; j < dbContext.forages.length; j++) {
                   var forage = dbContext.forages[j];
                   if (forage !== self) {
                       // Don't wait for itself...
                       initPromises.push(forage._initReady()["catch"](ignoreErrors));
                   }
               }

               // Take a snapshot of the related localForages.
               var forages = dbContext.forages.slice(0);

               // Initialize the connection process only when
               // all the related localForages aren't pending.
               return Promise$1.all(initPromises).then(function () {
                   dbInfo.db = dbContext.db;
                   // Get the connection or open a new one without upgrade.
                   return _getOriginalConnection(dbInfo);
               }).then(function (db) {
                   dbInfo.db = db;
                   if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
                       // Reopen the database for upgrading.
                       return _getUpgradedConnection(dbInfo);
                   }
                   return db;
               }).then(function (db) {
                   dbInfo.db = dbContext.db = db;
                   self._dbInfo = dbInfo;
                   // Share the final connection amongst related localForages.
                   for (var k = 0; k < forages.length; k++) {
                       var forage = forages[k];
                       if (forage !== self) {
                           // Self is already up-to-date.
                           forage._dbInfo.db = dbInfo.db;
                           forage._dbInfo.version = dbInfo.version;
                       }
                   }
               });
           }

           function getItem(key, callback) {
               var self = this;

               // Cast the key to a string, as that's all we can set as a key.
               if (typeof key !== 'string') {
                   console.warn(key + ' used as a key, but it is not a string.');
                   key = String(key);
               }

               var promise = new Promise$1(function (resolve, reject) {
                   self.ready().then(function () {
                       var dbInfo = self._dbInfo;
                       var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
                       var req = store.get(key);

                       req.onsuccess = function () {
                           var value = req.result;
                           if (value === undefined) {
                               value = null;
                           }
                           if (_isEncodedBlob(value)) {
                               value = _decodeBlob(value);
                           }
                           resolve(value);
                       };

                       req.onerror = function () {
                           reject(req.error);
                       };
                   })["catch"](reject);
               });

               executeCallback(promise, callback);
               return promise;
           }

           // Iterate over all items stored in database.
           function iterate(iterator, callback) {
               var self = this;

               var promise = new Promise$1(function (resolve, reject) {
                   self.ready().then(function () {
                       var dbInfo = self._dbInfo;
                       var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);

                       var req = store.openCursor();
                       var iterationNumber = 1;

                       req.onsuccess = function () {
                           var cursor = req.result;

                           if (cursor) {
                               var value = cursor.value;
                               if (_isEncodedBlob(value)) {
                                   value = _decodeBlob(value);
                               }
                               var result = iterator(value, cursor.key, iterationNumber++);

                               if (result !== void 0) {
                                   resolve(result);
                               } else {
                                   cursor["continue"]();
                               }
                           } else {
                               resolve();
                           }
                       };

                       req.onerror = function () {
                           reject(req.error);
                       };
                   })["catch"](reject);
               });

               executeCallback(promise, callback);

               return promise;
           }

           function setItem(key, value, callback) {
               var self = this;

               // Cast the key to a string, as that's all we can set as a key.
               if (typeof key !== 'string') {
                   console.warn(key + ' used as a key, but it is not a string.');
                   key = String(key);
               }

               var promise = new Promise$1(function (resolve, reject) {
                   var dbInfo;
                   self.ready().then(function () {
                       dbInfo = self._dbInfo;
                       if (value instanceof Blob) {
                           return _checkBlobSupport(dbInfo.db).then(function (blobSupport) {
                               if (blobSupport) {
                                   return value;
                               }
                               return _encodeBlob(value);
                           });
                       }
                       return value;
                   }).then(function (value) {
                       var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
                       var store = transaction.objectStore(dbInfo.storeName);

                       // The reason we don't _save_ null is because IE 10 does
                       // not support saving the `null` type in IndexedDB. How
                       // ironic, given the bug below!
                       // See: https://github.com/mozilla/localForage/issues/161
                       if (value === null) {
                           value = undefined;
                       }

                       transaction.oncomplete = function () {
                           // Cast to undefined so the value passed to
                           // callback/promise is the same as what one would get out
                           // of `getItem()` later. This leads to some weirdness
                           // (setItem('foo', undefined) will return `null`), but
                           // it's not my fault localStorage is our baseline and that
                           // it's weird.
                           if (value === undefined) {
                               value = null;
                           }

                           resolve(value);
                       };
                       transaction.onabort = transaction.onerror = function () {
                           var err = req.error ? req.error : req.transaction.error;
                           reject(err);
                       };

                       var req = store.put(value, key);
                   })["catch"](reject);
               });

               executeCallback(promise, callback);
               return promise;
           }

           function removeItem(key, callback) {
               var self = this;

               // Cast the key to a string, as that's all we can set as a key.
               if (typeof key !== 'string') {
                   console.warn(key + ' used as a key, but it is not a string.');
                   key = String(key);
               }

               var promise = new Promise$1(function (resolve, reject) {
                   self.ready().then(function () {
                       var dbInfo = self._dbInfo;
                       var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
                       var store = transaction.objectStore(dbInfo.storeName);

                       // We use a Grunt task to make this safe for IE and some
                       // versions of Android (including those used by Cordova).
                       // Normally IE won't like `.delete()` and will insist on
                       // using `['delete']()`, but we have a build step that
                       // fixes this for us now.
                       var req = store["delete"](key);
                       transaction.oncomplete = function () {
                           resolve();
                       };

                       transaction.onerror = function () {
                           reject(req.error);
                       };

                       // The request will be also be aborted if we've exceeded our storage
                       // space.
                       transaction.onabort = function () {
                           var err = req.error ? req.error : req.transaction.error;
                           reject(err);
                       };
                   })["catch"](reject);
               });

               executeCallback(promise, callback);
               return promise;
           }

           function clear(callback) {
               var self = this;

               var promise = new Promise$1(function (resolve, reject) {
                   self.ready().then(function () {
                       var dbInfo = self._dbInfo;
                       var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
                       var store = transaction.objectStore(dbInfo.storeName);
                       var req = store.clear();

                       transaction.oncomplete = function () {
                           resolve();
                       };

                       transaction.onabort = transaction.onerror = function () {
                           var err = req.error ? req.error : req.transaction.error;
                           reject(err);
                       };
                   })["catch"](reject);
               });

               executeCallback(promise, callback);
               return promise;
           }

           function length(callback) {
               var self = this;

               var promise = new Promise$1(function (resolve, reject) {
                   self.ready().then(function () {
                       var dbInfo = self._dbInfo;
                       var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
                       var req = store.count();

                       req.onsuccess = function () {
                           resolve(req.result);
                       };

                       req.onerror = function () {
                           reject(req.error);
                       };
                   })["catch"](reject);
               });

               executeCallback(promise, callback);
               return promise;
           }

           function key(n, callback) {
               var self = this;

               var promise = new Promise$1(function (resolve, reject) {
                   if (n < 0) {
                       resolve(null);

                       return;
                   }

                   self.ready().then(function () {
                       var dbInfo = self._dbInfo;
                       var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);

                       var advanced = false;
                       var req = store.openCursor();
                       req.onsuccess = function () {
                           var cursor = req.result;
                           if (!cursor) {
                               // this means there weren't enough keys
                               resolve(null);

                               return;
                           }

                           if (n === 0) {
                               // We have the first key, return it if that's what they
                               // wanted.
                               resolve(cursor.key);
                           } else {
                               if (!advanced) {
                                   // Otherwise, ask the cursor to skip ahead n
                                   // records.
                                   advanced = true;
                                   cursor.advance(n);
                               } else {
                                   // When we get here, we've got the nth key.
                                   resolve(cursor.key);
                               }
                           }
                       };

                       req.onerror = function () {
                           reject(req.error);
                       };
                   })["catch"](reject);
               });

               executeCallback(promise, callback);
               return promise;
           }

           function keys(callback) {
               var self = this;

               var promise = new Promise$1(function (resolve, reject) {
                   self.ready().then(function () {
                       var dbInfo = self._dbInfo;
                       var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);

                       var req = store.openCursor();
                       var keys = [];

                       req.onsuccess = function () {
                           var cursor = req.result;

                           if (!cursor) {
                               resolve(keys);
                               return;
                           }

                           keys.push(cursor.key);
                           cursor["continue"]();
                       };

                       req.onerror = function () {
                           reject(req.error);
                       };
                   })["catch"](reject);
               });

               executeCallback(promise, callback);
               return promise;
           }

           var asyncStorage = {
               _driver: 'asyncStorage',
               _initStorage: _initStorage,
               iterate: iterate,
               getItem: getItem,
               setItem: setItem,
               removeItem: removeItem,
               clear: clear,
               length: length,
               key: key,
               keys: keys
           };

           // Sadly, the best way to save binary data in WebSQL/localStorage is serializing
           // it to Base64, so this is how we store it to prevent very strange errors with less
           // verbose ways of binary <-> string data storage.
           var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

           var BLOB_TYPE_PREFIX = '~~local_forage_type~';
           var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;

           var SERIALIZED_MARKER = '__lfsc__:';
           var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;

           // OMG the serializations!
           var TYPE_ARRAYBUFFER = 'arbf';
           var TYPE_BLOB = 'blob';
           var TYPE_INT8ARRAY = 'si08';
           var TYPE_UINT8ARRAY = 'ui08';
           var TYPE_UINT8CLAMPEDARRAY = 'uic8';
           var TYPE_INT16ARRAY = 'si16';
           var TYPE_INT32ARRAY = 'si32';
           var TYPE_UINT16ARRAY = 'ur16';
           var TYPE_UINT32ARRAY = 'ui32';
           var TYPE_FLOAT32ARRAY = 'fl32';
           var TYPE_FLOAT64ARRAY = 'fl64';
           var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;

           function stringToBuffer(serializedString) {
               // Fill the string into a ArrayBuffer.
               var bufferLength = serializedString.length * 0.75;
               var len = serializedString.length;
               var i;
               var p = 0;
               var encoded1, encoded2, encoded3, encoded4;

               if (serializedString[serializedString.length - 1] === '=') {
                   bufferLength--;
                   if (serializedString[serializedString.length - 2] === '=') {
                       bufferLength--;
                   }
               }

               var buffer = new ArrayBuffer(bufferLength);
               var bytes = new Uint8Array(buffer);

               for (i = 0; i < len; i += 4) {
                   encoded1 = BASE_CHARS.indexOf(serializedString[i]);
                   encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
                   encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
                   encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);

                   /*jslint bitwise: true */
                   bytes[p++] = encoded1 << 2 | encoded2 >> 4;
                   bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
                   bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
               }
               return buffer;
           }

           // Converts a buffer to a string to store, serialized, in the backend
           // storage library.
           function bufferToString(buffer) {
               // base64-arraybuffer
               var bytes = new Uint8Array(buffer);
               var base64String = '';
               var i;

               for (i = 0; i < bytes.length; i += 3) {
                   /*jslint bitwise: true */
                   base64String += BASE_CHARS[bytes[i] >> 2];
                   base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
                   base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
                   base64String += BASE_CHARS[bytes[i + 2] & 63];
               }

               if (bytes.length % 3 === 2) {
                   base64String = base64String.substring(0, base64String.length - 1) + '=';
               } else if (bytes.length % 3 === 1) {
                   base64String = base64String.substring(0, base64String.length - 2) + '==';
               }

               return base64String;
           }

           // Serialize a value, afterwards executing a callback (which usually
           // instructs the `setItem()` callback/promise to be executed). This is how
           // we store binary data with localStorage.
           function serialize(value, callback) {
               var valueString = '';
               if (value) {
                   valueString = value.toString();
               }

               // Cannot use `value instanceof ArrayBuffer` or such here, as these
               // checks fail when running the tests using casper.js...
               //
               // TODO: See why those tests fail and use a better solution.
               if (value && (value.toString() === '[object ArrayBuffer]' || value.buffer && value.buffer.toString() === '[object ArrayBuffer]')) {
                   // Convert binary arrays to a string and prefix the string with
                   // a special marker.
                   var buffer;
                   var marker = SERIALIZED_MARKER;

                   if (value instanceof ArrayBuffer) {
                       buffer = value;
                       marker += TYPE_ARRAYBUFFER;
                   } else {
                       buffer = value.buffer;

                       if (valueString === '[object Int8Array]') {
                           marker += TYPE_INT8ARRAY;
                       } else if (valueString === '[object Uint8Array]') {
                           marker += TYPE_UINT8ARRAY;
                       } else if (valueString === '[object Uint8ClampedArray]') {
                           marker += TYPE_UINT8CLAMPEDARRAY;
                       } else if (valueString === '[object Int16Array]') {
                           marker += TYPE_INT16ARRAY;
                       } else if (valueString === '[object Uint16Array]') {
                           marker += TYPE_UINT16ARRAY;
                       } else if (valueString === '[object Int32Array]') {
                           marker += TYPE_INT32ARRAY;
                       } else if (valueString === '[object Uint32Array]') {
                           marker += TYPE_UINT32ARRAY;
                       } else if (valueString === '[object Float32Array]') {
                           marker += TYPE_FLOAT32ARRAY;
                       } else if (valueString === '[object Float64Array]') {
                           marker += TYPE_FLOAT64ARRAY;
                       } else {
                           callback(new Error('Failed to get type for BinaryArray'));
                       }
                   }

                   callback(marker + bufferToString(buffer));
               } else if (valueString === '[object Blob]') {
                   // Conver the blob to a binaryArray and then to a string.
                   var fileReader = new FileReader();

                   fileReader.onload = function () {
                       // Backwards-compatible prefix for the blob type.
                       var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);

                       callback(SERIALIZED_MARKER + TYPE_BLOB + str);
                   };

                   fileReader.readAsArrayBuffer(value);
               } else {
                   try {
                       callback(JSON.stringify(value));
                   } catch (e) {
                       console.error("Couldn't convert value into a JSON string: ", value);

                       callback(null, e);
                   }
               }
           }

           // Deserialize data we've inserted into a value column/field. We place
           // special markers into our strings to mark them as encoded; this isn't
           // as nice as a meta field, but it's the only sane thing we can do whilst
           // keeping localStorage support intact.
           //
           // Oftentimes this will just deserialize JSON content, but if we have a
           // special marker (SERIALIZED_MARKER, defined above), we will extract
           // some kind of arraybuffer/binary data/typed array out of the string.
           function deserialize(value) {
               // If we haven't marked this string as being specially serialized (i.e.
               // something other than serialized JSON), we can just return it and be
               // done with it.
               if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
                   return JSON.parse(value);
               }

               // The following code deals with deserializing some kind of Blob or
               // TypedArray. First we separate out the type of data we're dealing
               // with from the data itself.
               var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
               var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);

               var blobType;
               // Backwards-compatible blob type serialization strategy.
               // DBs created with older versions of localForage will simply not have the blob type.
               if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
                   var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
                   blobType = matcher[1];
                   serializedString = serializedString.substring(matcher[0].length);
               }
               var buffer = stringToBuffer(serializedString);

               // Return the right type based on the code/type set during
               // serialization.
               switch (type) {
                   case TYPE_ARRAYBUFFER:
                       return buffer;
                   case TYPE_BLOB:
                       return createBlob([buffer], { type: blobType });
                   case TYPE_INT8ARRAY:
                       return new Int8Array(buffer);
                   case TYPE_UINT8ARRAY:
                       return new Uint8Array(buffer);
                   case TYPE_UINT8CLAMPEDARRAY:
                       return new Uint8ClampedArray(buffer);
                   case TYPE_INT16ARRAY:
                       return new Int16Array(buffer);
                   case TYPE_UINT16ARRAY:
                       return new Uint16Array(buffer);
                   case TYPE_INT32ARRAY:
                       return new Int32Array(buffer);
                   case TYPE_UINT32ARRAY:
                       return new Uint32Array(buffer);
                   case TYPE_FLOAT32ARRAY:
                       return new Float32Array(buffer);
                   case TYPE_FLOAT64ARRAY:
                       return new Float64Array(buffer);
                   default:
                       throw new Error('Unkown type: ' + type);
               }
           }

           var localforageSerializer = {
               serialize: serialize,
               deserialize: deserialize,
               stringToBuffer: stringToBuffer,
               bufferToString: bufferToString
           };

           /*
            * Includes code from:
            *
            * base64-arraybuffer
            * https://github.com/niklasvh/base64-arraybuffer
            *
            * Copyright (c) 2012 Niklas von Hertzen
            * Licensed under the MIT license.
            */
           // Open the WebSQL database (automatically creates one if one didn't
           // previously exist), using any options set in the config.
           function _initStorage$1(options) {
               var self = this;
               var dbInfo = {
                   db: null
               };

               if (options) {
                   for (var i in options) {
                       dbInfo[i] = typeof options[i] !== 'string' ? options[i].toString() : options[i];
                   }
               }

               var dbInfoPromise = new Promise$1(function (resolve, reject) {
                   // Open the database; the openDatabase API will automatically
                   // create it for us if it doesn't exist.
                   try {
                       dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
                   } catch (e) {
                       return reject(e);
                   }

                   // Create our key/value table if it doesn't exist.
                   dbInfo.db.transaction(function (t) {
                       t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' (id INTEGER PRIMARY KEY, key unique, value)', [], function () {
                           self._dbInfo = dbInfo;
                           resolve();
                       }, function (t, error) {
                           reject(error);
                       });
                   });
               });

               dbInfo.serializer = localforageSerializer;
               return dbInfoPromise;
           }

           function getItem$1(key, callback) {
               var self = this;

               // Cast the key to a string, as that's all we can set as a key.
               if (typeof key !== 'string') {
                   console.warn(key + ' used as a key, but it is not a string.');
                   key = String(key);
               }

               var promise = new Promise$1(function (resolve, reject) {
                   self.ready().then(function () {
                       var dbInfo = self._dbInfo;
                       dbInfo.db.transaction(function (t) {
                           t.executeSql('SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function (t, results) {
                               var result = results.rows.length ? results.rows.item(0).value : null;

                               // Check to see if this is serialized content we need to
                               // unpack.
                               if (result) {
                                   result = dbInfo.serializer.deserialize(result);
                               }

                               resolve(result);
                           }, function (t, error) {

                               reject(error);
                           });
                       });
                   })["catch"](reject);
               });

               executeCallback(promise, callback);
               return promise;
           }

           function iterate$1(iterator, callback) {
               var self = this;

               var promise = new Promise$1(function (resolve, reject) {
                   self.ready().then(function () {
                       var dbInfo = self._dbInfo;

                       dbInfo.db.transaction(function (t) {
                           t.executeSql('SELECT * FROM ' + dbInfo.storeName, [], function (t, results) {
                               var rows = results.rows;
                               var length = rows.length;

                               for (var i = 0; i < length; i++) {
                                   var item = rows.item(i);
                                   var result = item.value;

                                   // Check to see if this is serialized content
                                   // we need to unpack.
                                   if (result) {
                                       result = dbInfo.serializer.deserialize(result);
                                   }

                                   result = iterator(result, item.key, i + 1);

                                   // void(0) prevents problems with redefinition
                                   // of `undefined`.
                                   if (result !== void 0) {
                                       resolve(result);
                                       return;
                                   }
                               }

                               resolve();
                           }, function (t, error) {
                               reject(error);
                           });
                       });
                   })["catch"](reject);
               });

               executeCallback(promise, callback);
               return promise;
           }

           function setItem$1(key, value, callback) {
               var self = this;

               // Cast the key to a string, as that's all we can set as a key.
               if (typeof key !== 'string') {
                   console.warn(key + ' used as a key, but it is not a string.');
                   key = String(key);
               }

               var promise = new Promise$1(function (resolve, reject) {
                   self.ready().then(function () {
                       // The localStorage API doesn't return undefined values in an
                       // "expected" way, so undefined is always cast to null in all
                       // drivers. See: https://github.com/mozilla/localForage/pull/42
                       if (value === undefined) {
                           value = null;
                       }

                       // Save the original value to pass to the callback.
                       var originalValue = value;

                       var dbInfo = self._dbInfo;
                       dbInfo.serializer.serialize(value, function (value, error) {
                           if (error) {
                               reject(error);
                           } else {
                               dbInfo.db.transaction(function (t) {
                                   t.executeSql('INSERT OR REPLACE INTO ' + dbInfo.storeName + ' (key, value) VALUES (?, ?)', [key, value], function () {
                                       resolve(originalValue);
                                   }, function (t, error) {
                                       reject(error);
                                   });
                               }, function (sqlError) {
                                   // The transaction failed; check
                                   // to see if it's a quota error.
                                   if (sqlError.code === sqlError.QUOTA_ERR) {
                                       // We reject the callback outright for now, but
                                       // it's worth trying to re-run the transaction.
                                       // Even if the user accepts the prompt to use
                                       // more storage on Safari, this error will
                                       // be called.
                                       //
                                       // TODO: Try to re-run the transaction.
                                       reject(sqlError);
                                   }
                               });
                           }
                       });
                   })["catch"](reject);
               });

               executeCallback(promise, callback);
               return promise;
           }

           function removeItem$1(key, callback) {
               var self = this;

               // Cast the key to a string, as that's all we can set as a key.
               if (typeof key !== 'string') {
                   console.warn(key + ' used as a key, but it is not a string.');
                   key = String(key);
               }

               var promise = new Promise$1(function (resolve, reject) {
                   self.ready().then(function () {
                       var dbInfo = self._dbInfo;
                       dbInfo.db.transaction(function (t) {
                           t.executeSql('DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function () {
                               resolve();
                           }, function (t, error) {

                               reject(error);
                           });
                       });
                   })["catch"](reject);
               });

               executeCallback(promise, callback);
               return promise;
           }

           // Deletes every item in the table.
           // TODO: Find out if this resets the AUTO_INCREMENT number.
           function clear$1(callback) {
               var self = this;

               var promise = new Promise$1(function (resolve, reject) {
                   self.ready().then(function () {
                       var dbInfo = self._dbInfo;
                       dbInfo.db.transaction(function (t) {
                           t.executeSql('DELETE FROM ' + dbInfo.storeName, [], function () {
                               resolve();
                           }, function (t, error) {
                               reject(error);
                           });
                       });
                   })["catch"](reject);
               });

               executeCallback(promise, callback);
               return promise;
           }

           // Does a simple `COUNT(key)` to get the number of items stored in
           // localForage.
           function length$1(callback) {
               var self = this;

               var promise = new Promise$1(function (resolve, reject) {
                   self.ready().then(function () {
                       var dbInfo = self._dbInfo;
                       dbInfo.db.transaction(function (t) {
                           // Ahhh, SQL makes this one soooooo easy.
                           t.executeSql('SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function (t, results) {
                               var result = results.rows.item(0).c;

                               resolve(result);
                           }, function (t, error) {

                               reject(error);
                           });
                       });
                   })["catch"](reject);
               });

               executeCallback(promise, callback);
               return promise;
           }

           // Return the key located at key index X; essentially gets the key from a
           // `WHERE id = ?`. This is the most efficient way I can think to implement
           // this rarely-used (in my experience) part of the API, but it can seem
           // inconsistent, because we do `INSERT OR REPLACE INTO` on `setItem()`, so
           // the ID of each key will change every time it's updated. Perhaps a stored
           // procedure for the `setItem()` SQL would solve this problem?
           // TODO: Don't change ID on `setItem()`.
           function key$1(n, callback) {
               var self = this;

               var promise = new Promise$1(function (resolve, reject) {
                   self.ready().then(function () {
                       var dbInfo = self._dbInfo;
                       dbInfo.db.transaction(function (t) {
                           t.executeSql('SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function (t, results) {
                               var result = results.rows.length ? results.rows.item(0).key : null;
                               resolve(result);
                           }, function (t, error) {
                               reject(error);
                           });
                       });
                   })["catch"](reject);
               });

               executeCallback(promise, callback);
               return promise;
           }

           function keys$1(callback) {
               var self = this;

               var promise = new Promise$1(function (resolve, reject) {
                   self.ready().then(function () {
                       var dbInfo = self._dbInfo;
                       dbInfo.db.transaction(function (t) {
                           t.executeSql('SELECT key FROM ' + dbInfo.storeName, [], function (t, results) {
                               var keys = [];

                               for (var i = 0; i < results.rows.length; i++) {
                                   keys.push(results.rows.item(i).key);
                               }

                               resolve(keys);
                           }, function (t, error) {

                               reject(error);
                           });
                       });
                   })["catch"](reject);
               });

               executeCallback(promise, callback);
               return promise;
           }

           var webSQLStorage = {
               _driver: 'webSQLStorage',
               _initStorage: _initStorage$1,
               iterate: iterate$1,
               getItem: getItem$1,
               setItem: setItem$1,
               removeItem: removeItem$1,
               clear: clear$1,
               length: length$1,
               key: key$1,
               keys: keys$1
           };

           // Config the localStorage backend, using options set in the config.
           function _initStorage$2(options) {
               var self = this;
               var dbInfo = {};
               if (options) {
                   for (var i in options) {
                       dbInfo[i] = options[i];
                   }
               }

               dbInfo.keyPrefix = dbInfo.name + '/';

               if (dbInfo.storeName !== self._defaultConfig.storeName) {
                   dbInfo.keyPrefix += dbInfo.storeName + '/';
               }

               self._dbInfo = dbInfo;
               dbInfo.serializer = localforageSerializer;

               return Promise$1.resolve();
           }

           // Remove all keys from the datastore, effectively destroying all data in
           // the app's key/value store!
           function clear$2(callback) {
               var self = this;
               var promise = self.ready().then(function () {
                   var keyPrefix = self._dbInfo.keyPrefix;

                   for (var i = localStorage.length - 1; i >= 0; i--) {
                       var key = localStorage.key(i);

                       if (key.indexOf(keyPrefix) === 0) {
                           localStorage.removeItem(key);
                       }
                   }
               });

               executeCallback(promise, callback);
               return promise;
           }

           // Retrieve an item from the store. Unlike the original async_storage
           // library in Gaia, we don't modify return values at all. If a key's value
           // is `undefined`, we pass that value to the callback function.
           function getItem$2(key, callback) {
               var self = this;

               // Cast the key to a string, as that's all we can set as a key.
               if (typeof key !== 'string') {
                   console.warn(key + ' used as a key, but it is not a string.');
                   key = String(key);
               }

               var promise = self.ready().then(function () {
                   var dbInfo = self._dbInfo;
                   var result = localStorage.getItem(dbInfo.keyPrefix + key);

                   // If a result was found, parse it from the serialized
                   // string into a JS object. If result isn't truthy, the key
                   // is likely undefined and we'll pass it straight to the
                   // callback.
                   if (result) {
                       result = dbInfo.serializer.deserialize(result);
                   }

                   return result;
               });

               executeCallback(promise, callback);
               return promise;
           }

           // Iterate over all items in the store.
           function iterate$2(iterator, callback) {
               var self = this;

               var promise = self.ready().then(function () {
                   var dbInfo = self._dbInfo;
                   var keyPrefix = dbInfo.keyPrefix;
                   var keyPrefixLength = keyPrefix.length;
                   var length = localStorage.length;

                   // We use a dedicated iterator instead of the `i` variable below
                   // so other keys we fetch in localStorage aren't counted in
                   // the `iterationNumber` argument passed to the `iterate()`
                   // callback.
                   //
                   // See: github.com/mozilla/localForage/pull/435#discussion_r38061530
                   var iterationNumber = 1;

                   for (var i = 0; i < length; i++) {
                       var key = localStorage.key(i);
                       if (key.indexOf(keyPrefix) !== 0) {
                           continue;
                       }
                       var value = localStorage.getItem(key);

                       // If a result was found, parse it from the serialized
                       // string into a JS object. If result isn't truthy, the
                       // key is likely undefined and we'll pass it straight
                       // to the iterator.
                       if (value) {
                           value = dbInfo.serializer.deserialize(value);
                       }

                       value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);

                       if (value !== void 0) {
                           return value;
                       }
                   }
               });

               executeCallback(promise, callback);
               return promise;
           }

           // Same as localStorage's key() method, except takes a callback.
           function key$2(n, callback) {
               var self = this;
               var promise = self.ready().then(function () {
                   var dbInfo = self._dbInfo;
                   var result;
                   try {
                       result = localStorage.key(n);
                   } catch (error) {
                       result = null;
                   }

                   // Remove the prefix from the key, if a key is found.
                   if (result) {
                       result = result.substring(dbInfo.keyPrefix.length);
                   }

                   return result;
               });

               executeCallback(promise, callback);
               return promise;
           }

           function keys$2(callback) {
               var self = this;
               var promise = self.ready().then(function () {
                   var dbInfo = self._dbInfo;
                   var length = localStorage.length;
                   var keys = [];

                   for (var i = 0; i < length; i++) {
                       if (localStorage.key(i).indexOf(dbInfo.keyPrefix) === 0) {
                           keys.push(localStorage.key(i).substring(dbInfo.keyPrefix.length));
                       }
                   }

                   return keys;
               });

               executeCallback(promise, callback);
               return promise;
           }

           // Supply the number of keys in the datastore to the callback function.
           function length$2(callback) {
               var self = this;
               var promise = self.keys().then(function (keys) {
                   return keys.length;
               });

               executeCallback(promise, callback);
               return promise;
           }

           // Remove an item from the store, nice and simple.
           function removeItem$2(key, callback) {
               var self = this;

               // Cast the key to a string, as that's all we can set as a key.
               if (typeof key !== 'string') {
                   console.warn(key + ' used as a key, but it is not a string.');
                   key = String(key);
               }

               var promise = self.ready().then(function () {
                   var dbInfo = self._dbInfo;
                   localStorage.removeItem(dbInfo.keyPrefix + key);
               });

               executeCallback(promise, callback);
               return promise;
           }

           // Set a key's value and run an optional callback once the value is set.
           // Unlike Gaia's implementation, the callback function is passed the value,
           // in case you want to operate on that value only after you're sure it
           // saved, or something like that.
           function setItem$2(key, value, callback) {
               var self = this;

               // Cast the key to a string, as that's all we can set as a key.
               if (typeof key !== 'string') {
                   console.warn(key + ' used as a key, but it is not a string.');
                   key = String(key);
               }

               var promise = self.ready().then(function () {
                   // Convert undefined values to null.
                   // https://github.com/mozilla/localForage/pull/42
                   if (value === undefined) {
                       value = null;
                   }

                   // Save the original value to pass to the callback.
                   var originalValue = value;

                   return new Promise$1(function (resolve, reject) {
                       var dbInfo = self._dbInfo;
                       dbInfo.serializer.serialize(value, function (value, error) {
                           if (error) {
                               reject(error);
                           } else {
                               try {
                                   localStorage.setItem(dbInfo.keyPrefix + key, value);
                                   resolve(originalValue);
                               } catch (e) {
                                   // localStorage capacity exceeded.
                                   // TODO: Make this a specific error/event.
                                   if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                                       reject(e);
                                   }
                                   reject(e);
                               }
                           }
                       });
                   });
               });

               executeCallback(promise, callback);
               return promise;
           }

           var localStorageWrapper = {
               _driver: 'localStorageWrapper',
               _initStorage: _initStorage$2,
               // Default API, from Gaia/localStorage.
               iterate: iterate$2,
               getItem: getItem$2,
               setItem: setItem$2,
               removeItem: removeItem$2,
               clear: clear$2,
               length: length$2,
               key: key$2,
               keys: keys$2
           };

           function executeTwoCallbacks(promise, callback, errorCallback) {
               if (typeof callback === 'function') {
                   promise.then(callback);
               }

               if (typeof errorCallback === 'function') {
                   promise["catch"](errorCallback);
               }
           }

           // Custom drivers are stored here when `defineDriver()` is called.
           // They are shared across all instances of localForage.
           var CustomDrivers = {};

           var DriverType = {
               INDEXEDDB: 'asyncStorage',
               LOCALSTORAGE: 'localStorageWrapper',
               WEBSQL: 'webSQLStorage'
           };

           var DefaultDriverOrder = [DriverType.INDEXEDDB, DriverType.WEBSQL, DriverType.LOCALSTORAGE];

           var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'];

           var DefaultConfig = {
               description: '',
               driver: DefaultDriverOrder.slice(),
               name: 'localforage',
               // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
               // we can use without a prompt.
               size: 4980736,
               storeName: 'keyvaluepairs',
               version: 1.0
           };

           var driverSupport = {};
           // Check to see if IndexedDB is available and if it is the latest
           // implementation; it's our preferred backend library. We use "_spec_test"
           // as the name of the database because it's not the one we'll operate on,
           // but it's useful to make sure its using the right spec.
           // See: https://github.com/mozilla/localForage/issues/128
           driverSupport[DriverType.INDEXEDDB] = isIndexedDBValid();

           driverSupport[DriverType.WEBSQL] = isWebSQLValid();

           driverSupport[DriverType.LOCALSTORAGE] = isLocalStorageValid();

           var isArray = Array.isArray || function (arg) {
               return Object.prototype.toString.call(arg) === '[object Array]';
           };

           function callWhenReady(localForageInstance, libraryMethod) {
               localForageInstance[libraryMethod] = function () {
                   var _args = arguments;
                   return localForageInstance.ready().then(function () {
                       return localForageInstance[libraryMethod].apply(localForageInstance, _args);
                   });
               };
           }

           function extend() {
               for (var i = 1; i < arguments.length; i++) {
                   var arg = arguments[i];

                   if (arg) {
                       for (var key in arg) {
                           if (arg.hasOwnProperty(key)) {
                               if (isArray(arg[key])) {
                                   arguments[0][key] = arg[key].slice();
                               } else {
                                   arguments[0][key] = arg[key];
                               }
                           }
                       }
                   }
               }

               return arguments[0];
           }

           function isLibraryDriver(driverName) {
               for (var driver in DriverType) {
                   if (DriverType.hasOwnProperty(driver) && DriverType[driver] === driverName) {
                       return true;
                   }
               }

               return false;
           }

           var LocalForage = function () {
               function LocalForage(options) {
                   _classCallCheck(this, LocalForage);

                   this.INDEXEDDB = DriverType.INDEXEDDB;
                   this.LOCALSTORAGE = DriverType.LOCALSTORAGE;
                   this.WEBSQL = DriverType.WEBSQL;

                   this._defaultConfig = extend({}, DefaultConfig);
                   this._config = extend({}, this._defaultConfig, options);
                   this._driverSet = null;
                   this._initDriver = null;
                   this._ready = false;
                   this._dbInfo = null;

                   this._wrapLibraryMethodsWithReady();
                   this.setDriver(this._config.driver);
               }

               // Set any config values for localForage; can be called anytime before
               // the first API call (e.g. `getItem`, `setItem`).
               // We loop through options so we don't overwrite existing config
               // values.


               LocalForage.prototype.config = function config(options) {
                   // If the options argument is an object, we use it to set values.
                   // Otherwise, we return either a specified config value or all
                   // config values.
                   if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
                       // If localforage is ready and fully initialized, we can't set
                       // any new configuration values. Instead, we return an error.
                       if (this._ready) {
                           return new Error("Can't call config() after localforage " + 'has been used.');
                       }

                       for (var i in options) {
                           if (i === 'storeName') {
                               options[i] = options[i].replace(/\W/g, '_');
                           }

                           this._config[i] = options[i];
                       }

                       // after all config options are set and
                       // the driver option is used, try setting it
                       if ('driver' in options && options.driver) {
                           this.setDriver(this._config.driver);
                       }

                       return true;
                   } else if (typeof options === 'string') {
                       return this._config[options];
                   } else {
                       return this._config;
                   }
               };

               // Used to define a custom driver, shared across all instances of
               // localForage.


               LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
                   var promise = new Promise$1(function (resolve, reject) {
                       try {
                           var driverName = driverObject._driver;
                           var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');
                           var namingError = new Error('Custom driver name already in use: ' + driverObject._driver);

                           // A driver name should be defined and not overlap with the
                           // library-defined, default drivers.
                           if (!driverObject._driver) {
                               reject(complianceError);
                               return;
                           }
                           if (isLibraryDriver(driverObject._driver)) {
                               reject(namingError);
                               return;
                           }

                           var customDriverMethods = LibraryMethods.concat('_initStorage');
                           for (var i = 0; i < customDriverMethods.length; i++) {
                               var customDriverMethod = customDriverMethods[i];
                               if (!customDriverMethod || !driverObject[customDriverMethod] || typeof driverObject[customDriverMethod] !== 'function') {
                                   reject(complianceError);
                                   return;
                               }
                           }

                           var supportPromise = Promise$1.resolve(true);
                           if ('_support' in driverObject) {
                               if (driverObject._support && typeof driverObject._support === 'function') {
                                   supportPromise = driverObject._support();
                               } else {
                                   supportPromise = Promise$1.resolve(!!driverObject._support);
                               }
                           }

                           supportPromise.then(function (supportResult) {
                               driverSupport[driverName] = supportResult;
                               CustomDrivers[driverName] = driverObject;
                               resolve();
                           }, reject);
                       } catch (e) {
                           reject(e);
                       }
                   });

                   executeTwoCallbacks(promise, callback, errorCallback);
                   return promise;
               };

               LocalForage.prototype.driver = function driver() {
                   return this._driver || null;
               };

               LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
                   var self = this;
                   var getDriverPromise = Promise$1.resolve().then(function () {
                       if (isLibraryDriver(driverName)) {
                           switch (driverName) {
                               case self.INDEXEDDB:
                                   return asyncStorage;
                               case self.LOCALSTORAGE:
                                   return localStorageWrapper;
                               case self.WEBSQL:
                                   return webSQLStorage;
                           }
                       } else if (CustomDrivers[driverName]) {
                           return CustomDrivers[driverName];
                       } else {
                           throw new Error('Driver not found.');
                       }
                   });
                   executeTwoCallbacks(getDriverPromise, callback, errorCallback);
                   return getDriverPromise;
               };

               LocalForage.prototype.getSerializer = function getSerializer(callback) {
                   var serializerPromise = Promise$1.resolve(localforageSerializer);
                   executeTwoCallbacks(serializerPromise, callback);
                   return serializerPromise;
               };

               LocalForage.prototype.ready = function ready(callback) {
                   var self = this;

                   var promise = self._driverSet.then(function () {
                       if (self._ready === null) {
                           self._ready = self._initDriver();
                       }

                       return self._ready;
                   });

                   executeTwoCallbacks(promise, callback, callback);
                   return promise;
               };

               LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
                   var self = this;

                   if (!isArray(drivers)) {
                       drivers = [drivers];
                   }

                   var supportedDrivers = this._getSupportedDrivers(drivers);

                   function setDriverToConfig() {
                       self._config.driver = self.driver();
                   }

                   function initDriver(supportedDrivers) {
                       return function () {
                           var currentDriverIndex = 0;

                           function driverPromiseLoop() {
                               while (currentDriverIndex < supportedDrivers.length) {
                                   var driverName = supportedDrivers[currentDriverIndex];
                                   currentDriverIndex++;

                                   self._dbInfo = null;
                                   self._ready = null;

                                   return self.getDriver(driverName).then(function (driver) {
                                       self._extend(driver);
                                       setDriverToConfig();

                                       self._ready = self._initStorage(self._config);
                                       return self._ready;
                                   })["catch"](driverPromiseLoop);
                               }

                               setDriverToConfig();
                               var error = new Error('No available storage method found.');
                               self._driverSet = Promise$1.reject(error);
                               return self._driverSet;
                           }

                           return driverPromiseLoop();
                       };
                   }

                   // There might be a driver initialization in progress
                   // so wait for it to finish in order to avoid a possible
                   // race condition to set _dbInfo
                   var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function () {
                       return Promise$1.resolve();
                   }) : Promise$1.resolve();

                   this._driverSet = oldDriverSetDone.then(function () {
                       var driverName = supportedDrivers[0];
                       self._dbInfo = null;
                       self._ready = null;

                       return self.getDriver(driverName).then(function (driver) {
                           self._driver = driver._driver;
                           setDriverToConfig();
                           self._wrapLibraryMethodsWithReady();
                           self._initDriver = initDriver(supportedDrivers);
                       });
                   })["catch"](function () {
                       setDriverToConfig();
                       var error = new Error('No available storage method found.');
                       self._driverSet = Promise$1.reject(error);
                       return self._driverSet;
                   });

                   executeTwoCallbacks(this._driverSet, callback, errorCallback);
                   return this._driverSet;
               };

               LocalForage.prototype.supports = function supports(driverName) {
                   return !!driverSupport[driverName];
               };

               LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
                   extend(this, libraryMethodsAndProperties);
               };

               LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
                   var supportedDrivers = [];
                   for (var i = 0, len = drivers.length; i < len; i++) {
                       var driverName = drivers[i];
                       if (this.supports(driverName)) {
                           supportedDrivers.push(driverName);
                       }
                   }
                   return supportedDrivers;
               };

               LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
                   // Add a stub for each driver API method that delays the call to the
                   // corresponding driver method until localForage is ready. These stubs
                   // will be replaced by the driver methods as soon as the driver is
                   // loaded, so there is no performance impact.
                   for (var i = 0; i < LibraryMethods.length; i++) {
                       callWhenReady(this, LibraryMethods[i]);
                   }
               };

               LocalForage.prototype.createInstance = function createInstance(options) {
                   return new LocalForage(options);
               };

               return LocalForage;
           }();

           // The actual localForage object that we expose as a module or via a
           // global. It's extended by pulling in one of our other libraries.


           var localforage_js = new LocalForage();

           module.exports = localforage_js;

           },{"3":3}]},{},[4])(4)
           });
           });

           /**
            * Creates a unary function that invokes `func` with its argument transformed.
            *
            * @private
            * @param {Function} func The function to wrap.
            * @param {Function} transform The argument transform.
            * @returns {Function} Returns the new function.
            */
           function overArg(func, transform) {
             return function(arg) {
               return func(transform(arg));
             };
           }

           /** Built-in value references. */
           var getPrototype = overArg(Object.getPrototypeOf, Object);

           /**
            * Checks if `value` is a host object in IE < 9.
            *
            * @private
            * @param {*} value The value to check.
            * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
            */
           function isHostObject(value) {
             // Many host objects are `Object` objects that can coerce to strings
             // despite having improperly defined `toString` methods.
             var result = false;
             if (value != null && typeof value.toString != 'function') {
               try {
                 result = !!(value + '');
               } catch (e) {}
             }
             return result;
           }

           /**
            * Checks if `value` is object-like. A value is object-like if it's not `null`
            * and has a `typeof` result of "object".
            *
            * @static
            * @memberOf _
            * @since 4.0.0
            * @category Lang
            * @param {*} value The value to check.
            * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
            * @example
            *
            * _.isObjectLike({});
            * // => true
            *
            * _.isObjectLike([1, 2, 3]);
            * // => true
            *
            * _.isObjectLike(_.noop);
            * // => false
            *
            * _.isObjectLike(null);
            * // => false
            */
           function isObjectLike(value) {
             return !!value && typeof value == 'object';
           }

           /** `Object#toString` result references. */
           var objectTag = '[object Object]';

           /** Used for built-in method references. */
           var funcProto = Function.prototype;
           var objectProto = Object.prototype;
           /** Used to resolve the decompiled source of functions. */
           var funcToString = funcProto.toString;

           /** Used to check objects for own properties. */
           var hasOwnProperty = objectProto.hasOwnProperty;

           /** Used to infer the `Object` constructor. */
           var objectCtorString = funcToString.call(Object);

           /**
            * Used to resolve the
            * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
            * of values.
            */
           var objectToString = objectProto.toString;

           /**
            * Checks if `value` is a plain object, that is, an object created by the
            * `Object` constructor or one with a `[[Prototype]]` of `null`.
            *
            * @static
            * @memberOf _
            * @since 0.8.0
            * @category Lang
            * @param {*} value The value to check.
            * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
            * @example
            *
            * function Foo() {
            *   this.a = 1;
            * }
            *
            * _.isPlainObject(new Foo);
            * // => false
            *
            * _.isPlainObject([1, 2, 3]);
            * // => false
            *
            * _.isPlainObject({ 'x': 0, 'y': 0 });
            * // => true
            *
            * _.isPlainObject(Object.create(null));
            * // => true
            */
           function isPlainObject(value) {
             if (!isObjectLike(value) ||
                 objectToString.call(value) != objectTag || isHostObject(value)) {
               return false;
             }
             var proto = getPrototype(value);
             if (proto === null) {
               return true;
             }
             var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
             return (typeof Ctor == 'function' &&
               Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
           }

           function symbolObservablePonyfill(root) {
           	var result;
           	var Symbol = root.Symbol;

           	if (typeof Symbol === 'function') {
           		if (Symbol.observable) {
           			result = Symbol.observable;
           		} else {
           			result = Symbol('observable');
           			Symbol.observable = result;
           		}
           	} else {
           		result = '@@observable';
           	}

           	return result;
           };

           var root = undefined;
           if (typeof global !== 'undefined') {
           	root = global;
           } else if (typeof window !== 'undefined') {
           	root = window;
           }

           var result = symbolObservablePonyfill(root);

           /**
            * These are private action types reserved by Redux.
            * For any unknown actions, you must return the current state.
            * If the current state is undefined, you must return the initial state.
            * Do not reference these action types directly in your code.
            */
           var ActionTypes = {
             INIT: '@@redux/INIT'
           };

           /**
            * Creates a Redux store that holds the state tree.
            * The only way to change the data in the store is to call `dispatch()` on it.
            *
            * There should only be a single store in your app. To specify how different
            * parts of the state tree respond to actions, you may combine several reducers
            * into a single reducer function by using `combineReducers`.
            *
            * @param {Function} reducer A function that returns the next state tree, given
            * the current state tree and the action to handle.
            *
            * @param {any} [preloadedState] The initial state. You may optionally specify it
            * to hydrate the state from the server in universal apps, or to restore a
            * previously serialized user session.
            * If you use `combineReducers` to produce the root reducer function, this must be
            * an object with the same shape as `combineReducers` keys.
            *
            * @param {Function} enhancer The store enhancer. You may optionally specify it
            * to enhance the store with third-party capabilities such as middleware,
            * time travel, persistence, etc. The only store enhancer that ships with Redux
            * is `applyMiddleware()`.
            *
            * @returns {Store} A Redux store that lets you read the state, dispatch actions
            * and subscribe to changes.
            */
           function createStore(reducer, preloadedState, enhancer) {
             var _ref2;

             if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
               enhancer = preloadedState;
               preloadedState = undefined;
             }

             if (typeof enhancer !== 'undefined') {
               if (typeof enhancer !== 'function') {
                 throw new Error('Expected the enhancer to be a function.');
               }

               return enhancer(createStore)(reducer, preloadedState);
             }

             if (typeof reducer !== 'function') {
               throw new Error('Expected the reducer to be a function.');
             }

             var currentReducer = reducer;
             var currentState = preloadedState;
             var currentListeners = [];
             var nextListeners = currentListeners;
             var isDispatching = false;

             function ensureCanMutateNextListeners() {
               if (nextListeners === currentListeners) {
                 nextListeners = currentListeners.slice();
               }
             }

             /**
              * Reads the state tree managed by the store.
              *
              * @returns {any} The current state tree of your application.
              */
             function getState() {
               return currentState;
             }

             /**
              * Adds a change listener. It will be called any time an action is dispatched,
              * and some part of the state tree may potentially have changed. You may then
              * call `getState()` to read the current state tree inside the callback.
              *
              * You may call `dispatch()` from a change listener, with the following
              * caveats:
              *
              * 1. The subscriptions are snapshotted just before every `dispatch()` call.
              * If you subscribe or unsubscribe while the listeners are being invoked, this
              * will not have any effect on the `dispatch()` that is currently in progress.
              * However, the next `dispatch()` call, whether nested or not, will use a more
              * recent snapshot of the subscription list.
              *
              * 2. The listener should not expect to see all state changes, as the state
              * might have been updated multiple times during a nested `dispatch()` before
              * the listener is called. It is, however, guaranteed that all subscribers
              * registered before the `dispatch()` started will be called with the latest
              * state by the time it exits.
              *
              * @param {Function} listener A callback to be invoked on every dispatch.
              * @returns {Function} A function to remove this change listener.
              */
             function subscribe(listener) {
               if (typeof listener !== 'function') {
                 throw new Error('Expected listener to be a function.');
               }

               var isSubscribed = true;

               ensureCanMutateNextListeners();
               nextListeners.push(listener);

               return function unsubscribe() {
                 if (!isSubscribed) {
                   return;
                 }

                 isSubscribed = false;

                 ensureCanMutateNextListeners();
                 var index = nextListeners.indexOf(listener);
                 nextListeners.splice(index, 1);
               };
             }

             /**
              * Dispatches an action. It is the only way to trigger a state change.
              *
              * The `reducer` function, used to create the store, will be called with the
              * current state tree and the given `action`. Its return value will
              * be considered the **next** state of the tree, and the change listeners
              * will be notified.
              *
              * The base implementation only supports plain object actions. If you want to
              * dispatch a Promise, an Observable, a thunk, or something else, you need to
              * wrap your store creating function into the corresponding middleware. For
              * example, see the documentation for the `redux-thunk` package. Even the
              * middleware will eventually dispatch plain object actions using this method.
              *
              * @param {Object} action A plain object representing “what changed”. It is
              * a good idea to keep actions serializable so you can record and replay user
              * sessions, or use the time travelling `redux-devtools`. An action must have
              * a `type` property which may not be `undefined`. It is a good idea to use
              * string constants for action types.
              *
              * @returns {Object} For convenience, the same action object you dispatched.
              *
              * Note that, if you use a custom middleware, it may wrap `dispatch()` to
              * return something else (for example, a Promise you can await).
              */
             function dispatch(action) {
               if (!isPlainObject(action)) {
                 throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
               }

               if (typeof action.type === 'undefined') {
                 throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
               }

               if (isDispatching) {
                 throw new Error('Reducers may not dispatch actions.');
               }

               try {
                 isDispatching = true;
                 currentState = currentReducer(currentState, action);
               } finally {
                 isDispatching = false;
               }

               var listeners = currentListeners = nextListeners;
               for (var i = 0; i < listeners.length; i++) {
                 listeners[i]();
               }

               return action;
             }

             /**
              * Replaces the reducer currently used by the store to calculate the state.
              *
              * You might need this if your app implements code splitting and you want to
              * load some of the reducers dynamically. You might also need this if you
              * implement a hot reloading mechanism for Redux.
              *
              * @param {Function} nextReducer The reducer for the store to use instead.
              * @returns {void}
              */
             function replaceReducer(nextReducer) {
               if (typeof nextReducer !== 'function') {
                 throw new Error('Expected the nextReducer to be a function.');
               }

               currentReducer = nextReducer;
               dispatch({ type: ActionTypes.INIT });
             }

             /**
              * Interoperability point for observable/reactive libraries.
              * @returns {observable} A minimal observable of state changes.
              * For more information, see the observable proposal:
              * https://github.com/zenparsing/es-observable
              */
             function observable() {
               var _ref;

               var outerSubscribe = subscribe;
               return _ref = {
                 /**
                  * The minimal observable subscription method.
                  * @param {Object} observer Any object that can be used as an observer.
                  * The observer object should have a `next` method.
                  * @returns {subscription} An object with an `unsubscribe` method that can
                  * be used to unsubscribe the observable from the store, and prevent further
                  * emission of values from the observable.
                  */
                 subscribe: function subscribe(observer) {
                   if (typeof observer !== 'object') {
                     throw new TypeError('Expected the observer to be an object.');
                   }

                   function observeState() {
                     if (observer.next) {
                       observer.next(getState());
                     }
                   }

                   observeState();
                   var unsubscribe = outerSubscribe(observeState);
                   return { unsubscribe: unsubscribe };
                 }
               }, _ref[result] = function () {
                 return this;
               }, _ref;
             }

             // When a store is created, an "INIT" action is dispatched so that every
             // reducer returns their initial state. This effectively populates
             // the initial state tree.
             dispatch({ type: ActionTypes.INIT });

             return _ref2 = {
               dispatch: dispatch,
               subscribe: subscribe,
               getState: getState,
               replaceReducer: replaceReducer
             }, _ref2[result] = observable, _ref2;
           }

           /**
            * Prints a warning in the console if it exists.
            *
            * @param {String} message The warning message.
            * @returns {void}
            */
           function warning(message) {
             /* eslint-disable no-console */
             if (typeof console !== 'undefined' && typeof console.error === 'function') {
               console.error(message);
             }
             /* eslint-enable no-console */
             try {
               // This error was thrown as a convenience so that if you enable
               // "break on all exceptions" in your console,
               // it would pause the execution at this line.
               throw new Error(message);
               /* eslint-disable no-empty */
             } catch (e) {}
             /* eslint-enable no-empty */
           }

           function getUndefinedStateErrorMessage(key, action) {
             var actionType = action && action.type;
             var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

             return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
           }

           function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
             var reducerKeys = Object.keys(reducers);
             var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

             if (reducerKeys.length === 0) {
               return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
             }

             if (!isPlainObject(inputState)) {
               return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
             }

             var unexpectedKeys = Object.keys(inputState).filter(function (key) {
               return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
             });

             unexpectedKeys.forEach(function (key) {
               unexpectedKeyCache[key] = true;
             });

             if (unexpectedKeys.length > 0) {
               return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
             }
           }

           function assertReducerSanity(reducers) {
             Object.keys(reducers).forEach(function (key) {
               var reducer = reducers[key];
               var initialState = reducer(undefined, { type: ActionTypes.INIT });

               if (typeof initialState === 'undefined') {
                 throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
               }

               var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
               if (typeof reducer(undefined, { type: type }) === 'undefined') {
                 throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
               }
             });
           }

           /**
            * Turns an object whose values are different reducer functions, into a single
            * reducer function. It will call every child reducer, and gather their results
            * into a single state object, whose keys correspond to the keys of the passed
            * reducer functions.
            *
            * @param {Object} reducers An object whose values correspond to different
            * reducer functions that need to be combined into one. One handy way to obtain
            * it is to use ES6 `import * as reducers` syntax. The reducers may never return
            * undefined for any action. Instead, they should return their initial state
            * if the state passed to them was undefined, and the current state for any
            * unrecognized action.
            *
            * @returns {Function} A reducer function that invokes every reducer inside the
            * passed object, and builds a state object with the same shape.
            */
           function combineReducers(reducers) {
             var reducerKeys = Object.keys(reducers);
             var finalReducers = {};
             for (var i = 0; i < reducerKeys.length; i++) {
               var key = reducerKeys[i];

               if ("development" !== 'production') {
                 if (typeof reducers[key] === 'undefined') {
                   warning('No reducer provided for key "' + key + '"');
                 }
               }

               if (typeof reducers[key] === 'function') {
                 finalReducers[key] = reducers[key];
               }
             }
             var finalReducerKeys = Object.keys(finalReducers);

             if ("development" !== 'production') {
               var unexpectedKeyCache = {};
             }

             var sanityError;
             try {
               assertReducerSanity(finalReducers);
             } catch (e) {
               sanityError = e;
             }

             return function combination() {
               var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
               var action = arguments[1];

               if (sanityError) {
                 throw sanityError;
               }

               if ("development" !== 'production') {
                 var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
                 if (warningMessage) {
                   warning(warningMessage);
                 }
               }

               var hasChanged = false;
               var nextState = {};
               for (var i = 0; i < finalReducerKeys.length; i++) {
                 var key = finalReducerKeys[i];
                 var reducer = finalReducers[key];
                 var previousStateForKey = state[key];
                 var nextStateForKey = reducer(previousStateForKey, action);
                 if (typeof nextStateForKey === 'undefined') {
                   var errorMessage = getUndefinedStateErrorMessage(key, action);
                   throw new Error(errorMessage);
                 }
                 nextState[key] = nextStateForKey;
                 hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
               }
               return hasChanged ? nextState : state;
             };
           }

           function bindActionCreator(actionCreator, dispatch) {
             return function () {
               return dispatch(actionCreator.apply(undefined, arguments));
             };
           }

           /**
            * Turns an object whose values are action creators, into an object with the
            * same keys, but with every function wrapped into a `dispatch` call so they
            * may be invoked directly. This is just a convenience method, as you can call
            * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
            *
            * For convenience, you can also pass a single function as the first argument,
            * and get a function in return.
            *
            * @param {Function|Object} actionCreators An object whose values are action
            * creator functions. One handy way to obtain it is to use ES6 `import * as`
            * syntax. You may also pass a single function.
            *
            * @param {Function} dispatch The `dispatch` function available on your Redux
            * store.
            *
            * @returns {Function|Object} The object mimicking the original object, but with
            * every action creator wrapped into the `dispatch` call. If you passed a
            * function as `actionCreators`, the return value will also be a single
            * function.
            */
           function bindActionCreators(actionCreators, dispatch) {
             if (typeof actionCreators === 'function') {
               return bindActionCreator(actionCreators, dispatch);
             }

             if (typeof actionCreators !== 'object' || actionCreators === null) {
               throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
             }

             var keys = Object.keys(actionCreators);
             var boundActionCreators = {};
             for (var i = 0; i < keys.length; i++) {
               var key = keys[i];
               var actionCreator = actionCreators[key];
               if (typeof actionCreator === 'function') {
                 boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
               }
             }
             return boundActionCreators;
           }

           /**
            * Composes single-argument functions from right to left. The rightmost
            * function can take multiple arguments as it provides the signature for
            * the resulting composite function.
            *
            * @param {...Function} funcs The functions to compose.
            * @returns {Function} A function obtained by composing the argument functions
            * from right to left. For example, compose(f, g, h) is identical to doing
            * (...args) => f(g(h(...args))).
            */

           function compose() {
             for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
               funcs[_key] = arguments[_key];
             }

             if (funcs.length === 0) {
               return function (arg) {
                 return arg;
               };
             }

             if (funcs.length === 1) {
               return funcs[0];
             }

             var last = funcs[funcs.length - 1];
             var rest = funcs.slice(0, -1);
             return function () {
               return rest.reduceRight(function (composed, f) {
                 return f(composed);
               }, last.apply(undefined, arguments));
             };
           }

           var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

           /**
            * Creates a store enhancer that applies middleware to the dispatch method
            * of the Redux store. This is handy for a variety of tasks, such as expressing
            * asynchronous actions in a concise manner, or logging every action payload.
            *
            * See `redux-thunk` package as an example of the Redux middleware.
            *
            * Because middleware is potentially asynchronous, this should be the first
            * store enhancer in the composition chain.
            *
            * Note that each middleware will be given the `dispatch` and `getState` functions
            * as named arguments.
            *
            * @param {...Function} middlewares The middleware chain to be applied.
            * @returns {Function} A store enhancer applying the middleware.
            */
           function applyMiddleware() {
             for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
               middlewares[_key] = arguments[_key];
             }

             return function (createStore) {
               return function (reducer, preloadedState, enhancer) {
                 var store = createStore(reducer, preloadedState, enhancer);
                 var _dispatch = store.dispatch;
                 var chain = [];

                 var middlewareAPI = {
                   getState: store.getState,
                   dispatch: function dispatch(action) {
                     return _dispatch(action);
                   }
                 };
                 chain = middlewares.map(function (middleware) {
                   return middleware(middlewareAPI);
                 });
                 _dispatch = compose.apply(undefined, chain)(store.dispatch);

                 return _extends({}, store, {
                   dispatch: _dispatch
                 });
               };
             };
           }

           /*
           * This is a dummy function to check if the function name has been altered by minification.
           * If the function has been minified and NODE_ENV !== 'production', warn the user.
           */
           function isCrushed() {}

           if ("development" !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
             warning('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
           }

           function createThunkMiddleware(extraArgument) {
             return function (_ref) {
               var dispatch = _ref.dispatch;
               var getState = _ref.getState;
               return function (next) {
                 return function (action) {
                   if (typeof action === 'function') {
                     return action(dispatch, getState, extraArgument);
                   }

                   return next(action);
                 };
               };
             };
           }

           var thunk = createThunkMiddleware();
           thunk.withExtraArgument = createThunkMiddleware;

           var classCallCheck = function (instance, Constructor) {
             if (!(instance instanceof Constructor)) {
               throw new TypeError("Cannot call a class as a function");
             }
           };

           var _extends$1 = Object.assign || function (target) {
             for (var i = 1; i < arguments.length; i++) {
               var source = arguments[i];

               for (var key in source) {
                 if (Object.prototype.hasOwnProperty.call(source, key)) {
                   target[key] = source[key];
                 }
               }
             }

             return target;
           };

           var inherits = function (subClass, superClass) {
             if (typeof superClass !== "function" && superClass !== null) {
               throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
             }

             subClass.prototype = Object.create(superClass && superClass.prototype, {
               constructor: {
                 value: subClass,
                 enumerable: false,
                 writable: true,
                 configurable: true
               }
             });
             if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
           };

           var possibleConstructorReturn = function (self, call) {
             if (!self) {
               throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
             }

             return call && (typeof call === "object" || typeof call === "function") ? call : self;
           };

           var searchForm = function (state, action) {
               switch (action.type) {
                   case "CHANGE_DATA":
                       var _searchForm = {};
                       _searchForm[action.data.name] = action.data.value;
                       return _extends$1({}, state, _searchForm);
               }
           };

           var reducer$1 = function () {
               var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
               var action = arguments[1];

               switch (action.type) {
                   case "CHANGE_DATA":
                       return searchForm(state, action);
                   default:
                       return state;
               }
           };

           var searchResult = function (state, action) {
               switch (action.type) {
                   case "ADD_TUPLES":
                       return state.tuples.concat(action.tuples);
                   case "REPLACE_TUPLES":
                       return action.tuples;
                   case "SAVE_TUPLE":
                       return state.tuples.map(function (tuple, index) {
                           if (index != action.id) {
                               return tuple;
                           }
                           return _extends$1({}, tuple, { isSaved: !tuple.isSaved });
                       });
               }
           };

           var reducer$2 = function () {
               var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
               var action = arguments[1];

               switch (action.type) {
                   case "ADD_TUPLES":
                   case "REPLACE_TUPLES":
                   case "SAVE_TUPLE":
                       return _extends$1({}, state, { "tuples": searchResult(state, action) });
                   default:
                       return state;
               }
           };

           var reducer$3 = function () {
               var state = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
               var action = arguments[1];

               var currentRoute = undefined;
               switch (action.type) {
                   case "CHANGE_ROUTE_START":
                       var previousRoute = _extends$1({}, state[0], { "attr": { class: "ng-leave" } });
                       currentRoute = {
                           route: action.route
                       };
                       return [previousRoute, currentRoute];
                   case "CHANGE_ROUTE_END":
                       currentRoute = state[1];
                       return [currentRoute];
                   case "CHANGE_ROUTE":
                       return [{
                           route: action.route
                       }];
                   default:
                       return state;
               }
           };

           var reducer = combineReducers({
               route: reducer$3,
               searchForm: reducer$1,
               searchResult: reducer$2

           });

           /**
            * Logs all actions and states after they are dispatched.
            */

           //For IE<=10 support
           console.group = console.group || console.log;
           console.groupEnd = console.groupEnd || console.log;

           var logger = function (store) {
               return function (next) {
                   return function (action) {
                       console.group(action.type || action.name);
                       console.info('dispatching', action);
                       var result = next(action);
                       console.log('next state', store.getState());
                       console.groupEnd(action.type);
                       return result;
                   };
               };
           };

           var nativeIsArray = Array.isArray
           var toString = Object.prototype.toString

           var __moduleExports$1 = nativeIsArray || isArray$1

           function isArray$1(obj) {
               return toString.call(obj) === "[object Array]"
           }

           var __moduleExports$3 = "2"

           var version$1 = __moduleExports$3

           var __moduleExports$4 = isVirtualNode

           function isVirtualNode(x) {
               return x && x.type === "VirtualNode" && x.version === version$1
           }

           var __moduleExports$5 = isWidget$2

           function isWidget$2(w) {
               return w && w.type === "Widget"
           }

           var __moduleExports$6 = isThunk$1

           function isThunk$1(t) {
               return t && t.type === "Thunk"
           }

           var __moduleExports$7 = isHook$1

           function isHook$1(hook) {
               return hook &&
                 (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
                  typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
           }

           var version = __moduleExports$3
           var isVNode$1 = __moduleExports$4
           var isWidget$1 = __moduleExports$5
           var isThunk = __moduleExports$6
           var isVHook = __moduleExports$7

           var __moduleExports$2 = VirtualNode

           var noProperties = {}
           var noChildren = []

           function VirtualNode(tagName, properties, children, key, namespace) {
               this.tagName = tagName
               this.properties = properties || noProperties
               this.children = children || noChildren
               this.key = key != null ? String(key) : undefined
               this.namespace = (typeof namespace === "string") ? namespace : null

               var count = (children && children.length) || 0
               var descendants = 0
               var hasWidgets = false
               var hasThunks = false
               var descendantHooks = false
               var hooks

               for (var propName in properties) {
                   if (properties.hasOwnProperty(propName)) {
                       var property = properties[propName]
                       if (isVHook(property) && property.unhook) {
                           if (!hooks) {
                               hooks = {}
                           }

                           hooks[propName] = property
                       }
                   }
               }

               for (var i = 0; i < count; i++) {
                   var child = children[i]
                   if (isVNode$1(child)) {
                       descendants += child.count || 0

                       if (!hasWidgets && child.hasWidgets) {
                           hasWidgets = true
                       }

                       if (!hasThunks && child.hasThunks) {
                           hasThunks = true
                       }

                       if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                           descendantHooks = true
                       }
                   } else if (!hasWidgets && isWidget$1(child)) {
                       if (typeof child.destroy === "function") {
                           hasWidgets = true
                       }
                   } else if (!hasThunks && isThunk(child)) {
                       hasThunks = true;
                   }
               }

               this.count = count + descendants
               this.hasWidgets = hasWidgets
               this.hasThunks = hasThunks
               this.hooks = hooks
               this.descendantHooks = descendantHooks
           }

           VirtualNode.prototype.version = version
           VirtualNode.prototype.type = "VirtualNode"

           var version$2 = __moduleExports$3

           var __moduleExports$8 = VirtualText

           function VirtualText(text) {
               this.text = String(text)
           }

           VirtualText.prototype.version = version$2
           VirtualText.prototype.type = "VirtualText"

           var version$3 = __moduleExports$3

           var __moduleExports$9 = isVirtualText

           function isVirtualText(x) {
               return x && x.type === "VirtualText" && x.version === version$3
           }

           /*!
            * Cross-Browser Split 1.1.1
            * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
            * Available under the MIT License
            * ECMAScript compliant, uniform cross-browser split method
            */

           /**
            * Splits a string into an array of strings using a regex or string separator. Matches of the
            * separator are not included in the result array. However, if `separator` is a regex that contains
            * capturing groups, backreferences are spliced into the result each time `separator` is matched.
            * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
            * cross-browser.
            * @param {String} str String to split.
            * @param {RegExp|String} separator Regex or string to use for separating the string.
            * @param {Number} [limit] Maximum number of items to include in the result array.
            * @returns {Array} Array of substrings.
            * @example
            *
            * // Basic use
            * split('a b c d', ' ');
            * // -> ['a', 'b', 'c', 'd']
            *
            * // With limit
            * split('a b c d', ' ', 2);
            * // -> ['a', 'b']
            *
            * // Backreferences in result array
            * split('..word1 word2..', /([a-z]+)(\d+)/i);
            * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
            */
           var __moduleExports$11 = (function split(undef) {

             var nativeSplit = String.prototype.split,
               compliantExecNpcg = /()??/.exec("")[1] === undef,
               // NPCG: nonparticipating capturing group
               self;

             self = function(str, separator, limit) {
               // If `separator` is not a regex, use `nativeSplit`
               if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
                 return nativeSplit.call(str, separator, limit);
               }
               var output = [],
                 flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
                 (separator.sticky ? "y" : ""),
                 // Firefox 3+
                 lastLastIndex = 0,
                 // Make `global` and avoid `lastIndex` issues by working with a copy
                 separator = new RegExp(separator.source, flags + "g"),
                 separator2, match, lastIndex, lastLength;
               str += ""; // Type-convert
               if (!compliantExecNpcg) {
                 // Doesn't need flags gy, but they don't hurt
                 separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
               }
               /* Values for `limit`, per the spec:
                * If undefined: 4294967295 // Math.pow(2, 32) - 1
                * If 0, Infinity, or NaN: 0
                * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
                * If negative number: 4294967296 - Math.floor(Math.abs(limit))
                * If other: Type-convert, then use the above rules
                */
               limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
               limit >>> 0; // ToUint32(limit)
               while (match = separator.exec(str)) {
                 // `separator.lastIndex` is not reliable cross-browser
                 lastIndex = match.index + match[0].length;
                 if (lastIndex > lastLastIndex) {
                   output.push(str.slice(lastLastIndex, match.index));
                   // Fix browsers whose `exec` methods don't consistently return `undefined` for
                   // nonparticipating capturing groups
                   if (!compliantExecNpcg && match.length > 1) {
                     match[0].replace(separator2, function() {
                       for (var i = 1; i < arguments.length - 2; i++) {
                         if (arguments[i] === undef) {
                           match[i] = undef;
                         }
                       }
                     });
                   }
                   if (match.length > 1 && match.index < str.length) {
                     Array.prototype.push.apply(output, match.slice(1));
                   }
                   lastLength = match[0].length;
                   lastLastIndex = lastIndex;
                   if (output.length >= limit) {
                     break;
                   }
                 }
                 if (separator.lastIndex === match.index) {
                   separator.lastIndex++; // Avoid an infinite loop
                 }
               }
               if (lastLastIndex === str.length) {
                 if (lastLength || !separator.test("")) {
                   output.push("");
                 }
               } else {
                 output.push(str.slice(lastLastIndex));
               }
               return output.length > limit ? output.slice(0, limit) : output;
             };

             return self;
           })();

           var split = __moduleExports$11;

           var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
           var notClassId = /^\.|#/;

           var __moduleExports$10 = parseTag$1;

           function parseTag$1(tag, props) {
               if (!tag) {
                   return 'DIV';
               }

               var noId = !(props.hasOwnProperty('id'));

               var tagParts = split(tag, classIdSplit);
               var tagName = null;

               if (notClassId.test(tagParts[1])) {
                   tagName = 'DIV';
               }

               var classes, part, type, i;

               for (i = 0; i < tagParts.length; i++) {
                   part = tagParts[i];

                   if (!part) {
                       continue;
                   }

                   type = part.charAt(0);

                   if (!tagName) {
                       tagName = part;
                   } else if (type === '.') {
                       classes = classes || [];
                       classes.push(part.substring(1, part.length));
                   } else if (type === '#' && noId) {
                       props.id = part.substring(1, part.length);
                   }
               }

               if (classes) {
                   if (props.className) {
                       classes.push(props.className);
                   }

                   props.className = classes.join(' ');
               }

               return props.namespace ? tagName : tagName.toUpperCase();
           }

           var __moduleExports$12 = SoftSetHook;

           function SoftSetHook(value) {
               if (!(this instanceof SoftSetHook)) {
                   return new SoftSetHook(value);
               }

               this.value = value;
           }

           SoftSetHook.prototype.hook = function (node, propertyName) {
               if (node[propertyName] !== this.value) {
                   node[propertyName] = this.value;
               }
           };

           /*global window, global*/

           var root$1 = typeof window !== 'undefined' ?
               window : typeof commonjsGlobal !== 'undefined' ?
               commonjsGlobal : {};

           var __moduleExports$16 = Individual$1;

           function Individual$1(key, value) {
               if (key in root$1) {
                   return root$1[key];
               }

               root$1[key] = value;

               return value;
           }

           var Individual = __moduleExports$16;

           var __moduleExports$15 = OneVersion;

           function OneVersion(moduleName, version, defaultValue) {
               var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
               var enforceKey = key + '_ENFORCE_SINGLETON';

               var versionValue = Individual(enforceKey, version);

               if (versionValue !== version) {
                   throw new Error('Can only have one copy of ' +
                       moduleName + '.\n' +
                       'You already have version ' + versionValue +
                       ' installed.\n' +
                       'This means you cannot install version ' + version);
               }

               return Individual(key, defaultValue);
           }

           var OneVersionConstraint = __moduleExports$15;

           var MY_VERSION = '7';
           OneVersionConstraint('ev-store', MY_VERSION);

           var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

           var __moduleExports$14 = EvStore$1;

           function EvStore$1(elem) {
               var hash = elem[hashKey];

               if (!hash) {
                   hash = elem[hashKey] = {};
               }

               return hash;
           }

           var EvStore = __moduleExports$14;

           var __moduleExports$13 = EvHook;

           function EvHook(value) {
               if (!(this instanceof EvHook)) {
                   return new EvHook(value);
               }

               this.value = value;
           }

           EvHook.prototype.hook = function (node, propertyName) {
               var es = EvStore(node);
               var propName = propertyName.substr(3);

               es[propName] = this.value;
           };

           EvHook.prototype.unhook = function(node, propertyName) {
               var es = EvStore(node);
               var propName = propertyName.substr(3);

               es[propName] = undefined;
           };

           var isArray = __moduleExports$1;

           var VNode = __moduleExports$2;
           var VText = __moduleExports$8;
           var isVNode = __moduleExports$4;
           var isVText = __moduleExports$9;
           var isWidget = __moduleExports$5;
           var isHook = __moduleExports$7;
           var isVThunk = __moduleExports$6;

           var parseTag = __moduleExports$10;
           var softSetHook = __moduleExports$12;
           var evHook = __moduleExports$13;

           var __moduleExports = h$1;

           function h$1(tagName, properties, children) {
               var childNodes = [];
               var tag, props, key, namespace;

               if (!children && isChildren(properties)) {
                   children = properties;
                   props = {};
               }

               props = props || properties || {};
               tag = parseTag(tagName, props);

               // support keys
               if (props.hasOwnProperty('key')) {
                   key = props.key;
                   props.key = undefined;
               }

               // support namespace
               if (props.hasOwnProperty('namespace')) {
                   namespace = props.namespace;
                   props.namespace = undefined;
               }

               // fix cursor bug
               if (tag === 'INPUT' &&
                   !namespace &&
                   props.hasOwnProperty('value') &&
                   props.value !== undefined &&
                   !isHook(props.value)
               ) {
                   if (props.value !== null && typeof props.value !== 'string') {
                       throw UnsupportedValueType({
                           expected: 'String',
                           received: typeof props.value,
                           Vnode: {
                               tagName: tag,
                               properties: props
                           }
                       });
                   }
                   props.value = softSetHook(props.value);
               }

               transformProperties(props);

               if (children !== undefined && children !== null) {
                   addChild(children, childNodes, tag, props);
               }


               return new VNode(tag, props, childNodes, key, namespace);
           }

           function addChild(c, childNodes, tag, props) {
               if (typeof c === 'string') {
                   childNodes.push(new VText(c));
               } else if (typeof c === 'number') {
                   childNodes.push(new VText(String(c)));
               } else if (isChild(c)) {
                   childNodes.push(c);
               } else if (isArray(c)) {
                   for (var i = 0; i < c.length; i++) {
                       addChild(c[i], childNodes, tag, props);
                   }
               } else if (c === null || c === undefined) {
                   return;
               } else {
                   throw UnexpectedVirtualElement({
                       foreignObject: c,
                       parentVnode: {
                           tagName: tag,
                           properties: props
                       }
                   });
               }
           }

           function transformProperties(props) {
               for (var propName in props) {
                   if (props.hasOwnProperty(propName)) {
                       var value = props[propName];

                       if (isHook(value)) {
                           continue;
                       }

                       if (propName.substr(0, 3) === 'ev-') {
                           // add ev-foo support
                           props[propName] = evHook(value);
                       }
                   }
               }
           }

           function isChild(x) {
               return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
           }

           function isChildren(x) {
               return typeof x === 'string' || isArray(x) || isChild(x);
           }

           function UnexpectedVirtualElement(data) {
               var err = new Error();

               err.type = 'virtual-hyperscript.unexpected.virtual-element';
               err.message = 'Unexpected virtual child passed to h().\n' +
                   'Expected a VNode / Vthunk / VWidget / string but:\n' +
                   'got:\n' +
                   errorString(data.foreignObject) +
                   '.\n' +
                   'The parent vnode is:\n' +
                   errorString(data.parentVnode)
                   '\n' +
                   'Suggested fix: change your `h(..., [ ... ])` callsite.';
               err.foreignObject = data.foreignObject;
               err.parentVnode = data.parentVnode;

               return err;
           }

           function UnsupportedValueType(data) {
               var err = new Error();

               err.type = 'virtual-hyperscript.unsupported.value-type';
               err.message = 'Unexpected value type for input passed to h().\n' +
                   'Expected a ' +
                   errorString(data.expected) +
                   ' but got:\n' +
                   errorString(data.received) +
                   '.\n' +
                   'The vnode is:\n' +
                   errorString(data.Vnode)
                   '\n' +
                   'Suggested fix: Cast the value passed to h() to a string using String(value).';
               err.Vnode = data.Vnode;

               return err;
           }

           function errorString(obj) {
               try {
                   return JSON.stringify(obj, null, '    ');
               } catch (e) {
                   return String(obj);
               }
           }

           var h = __moduleExports

           var h_1 = h

           function Thunk(fn, args, key, eqArgs) {
               this.fn = fn;
               this.args = args;
               this.key = key;
               this.eqArgs = eqArgs;
           }

           Thunk.prototype.type = 'Thunk';
           Thunk.prototype.render = render;
           var immutableThunk = Thunk;

           function shouldUpdate(current, previous) {
               if (!current || !previous || current.fn !== previous.fn) {
                   return true;
               }

               var cargs = current.args;
               var pargs = previous.args;

               return !current.eqArgs(cargs, pargs);
           }

           function render(previous) {

               if (shouldUpdate(this, previous)) {
                   //return this.fn.apply(null, this.args);               
                   return this.fn.apply(null, [previous, this]);
               } else {
                   return previous.vnode;
               }
           }

           //Shallow comparator of args
           var eqFn = function (cargs, pargs) {
               for (var key in cargs) {
                   if (cargs[key] != pargs[key]) {
                       return false;
                   }
               }
               return true;
           };

           var GenericThunk = function (_immutableThunk) {
               inherits(GenericThunk, _immutableThunk);

               function GenericThunk(componentClass, fn, args) {
                   classCallCheck(this, GenericThunk);

                   var key = undefined;
                   if (args) {
                       key = args.key || null;
                   }

                   var _this = possibleConstructorReturn(this, _immutableThunk.call(this, fn, args, key, eqFn));

                   _this.componentClass = componentClass;
                   if (args) {
                       _this.transition = args.transition || null;
                   }

                   return _this;
               }

               GenericThunk.prototype.render = function render(previous) {
                   if (previous) {
                       this.component = previous.component;
                   }
                   return _immutableThunk.prototype.render.call(this, previous);
               };

               return GenericThunk;
           }(immutableThunk);

           /*let renderFn = function(previous, current) {   
               
               var item = h(current.component.getName(), current.component.props, current.component.render(current.component.props));

               return item;
           }
           */

           /**
            * [renderFn Called only when props have changes or previous thunk not available]
            * @param  {[type]} previous [description]
            * @param  {[type]} current  [description]
            * @return {[type]}          [description]
            */
           var renderFn = function (previous, current) {
               var component = undefined;

               if (!previous) {
                   component = current.component = new current.componentClass(current.args);
               } else {
                   component = current.component;
               }
               component.props = _extends$1({}, component.props, current.args);

               component.vnode = h_1(component.getName(), component.props, component.render(component.props));
               component.vnode.transition = component.props.transition || null;
               return component.vnode;
           };

           function hyperScript(tagName, properties, children) {
               var tree, element, children;
               if (arguments.length >= 3) {
                   children = Array.prototype.slice.call(arguments, 2);
               }

               if (typeof tagName != "string") {
                   //return new Thunk(tagName, renderFn, properties);
                   return new GenericThunk(tagName, renderFn, properties);
               }
               return h_1(tagName, properties, children);
           }

           var slice = Array.prototype.slice

           var __moduleExports$21 = iterativelyWalk

           function iterativelyWalk(nodes, cb) {
               if (!('length' in nodes)) {
                   nodes = [nodes]
               }
               
               nodes = slice.call(nodes)

               while(nodes.length) {
                   var node = nodes.shift(),
                       ret = cb(node)

                   if (ret) {
                       return ret
                   }

                   if (node.childNodes && node.childNodes.length) {
                       nodes = slice.call(node.childNodes).concat(nodes)
                   }
               }
           }

           var __moduleExports$22 = Comment$1

           function Comment$1(data, owner) {
               if (!(this instanceof Comment$1)) {
                   return new Comment$1(data, owner)
               }

               this.data = data
               this.nodeValue = data
               this.length = data.length
               this.ownerDocument = owner || null
           }

           Comment$1.prototype.nodeType = 8
           Comment$1.prototype.nodeName = "#comment"

           Comment$1.prototype.toString = function _Comment_toString() {
               return "[object Comment]"
           }

           var __moduleExports$23 = DOMText$1

           function DOMText$1(value, owner) {
               if (!(this instanceof DOMText$1)) {
                   return new DOMText$1(value)
               }

               this.data = value || ""
               this.length = this.data.length
               this.ownerDocument = owner || null
           }

           DOMText$1.prototype.type = "DOMTextNode"
           DOMText$1.prototype.nodeType = 3
           DOMText$1.prototype.nodeName = "#text"

           DOMText$1.prototype.toString = function _Text_toString() {
               return this.data
           }

           DOMText$1.prototype.replaceData = function replaceData(index, length, value) {
               var current = this.data
               var left = current.substring(0, index)
               var right = current.substring(index + length, current.length)
               this.data = left + value + right
               this.length = this.data.length
           }

           var __moduleExports$25 = dispatchEvent$2

           function dispatchEvent$2(ev) {
               var elem = this
               var type = ev.type

               if (!ev.target) {
                   ev.target = elem
               }

               if (!elem.listeners) {
                   elem.listeners = {}
               }

               var listeners = elem.listeners[type]

               if (listeners) {
                   return listeners.forEach(function (listener) {
                       ev.currentTarget = elem
                       if (typeof listener === 'function') {
                           listener(ev)
                       } else {
                           listener.handleEvent(ev)
                       }
                   })
               }

               if (elem.parentNode) {
                   elem.parentNode.dispatchEvent(ev)
               }
           }

           var __moduleExports$26 = addEventListener$2

           function addEventListener$2(type, listener) {
               var elem = this

               if (!elem.listeners) {
                   elem.listeners = {}
               }

               if (!elem.listeners[type]) {
                   elem.listeners[type] = []
               }

               if (elem.listeners[type].indexOf(listener) === -1) {
                   elem.listeners[type].push(listener)
               }
           }

           var __moduleExports$27 = removeEventListener$2

           function removeEventListener$2(type, listener) {
               var elem = this

               if (!elem.listeners) {
                   return
               }

               if (!elem.listeners[type]) {
                   return
               }

               var list = elem.listeners[type]
               var index = list.indexOf(listener)
               if (index !== -1) {
                   list.splice(index, 1)
               }
           }

           var __moduleExports$28 = serializeNode$1

           var voidElements = ["area","base","br","col","embed","hr","img","input","keygen","link","menuitem","meta","param","source","track","wbr"];

           function serializeNode$1(node) {
               switch (node.nodeType) {
                   case 3:
                       return escapeText(node.data)
                   case 8:
                       return "<!--" + node.data + "-->"
                   default:
                       return serializeElement(node)
               }
           }

           function serializeElement(elem) {
               var strings = []

               var tagname = elem.tagName

               if (elem.namespaceURI === "http://www.w3.org/1999/xhtml") {
                   tagname = tagname.toLowerCase()
               }

               strings.push("<" + tagname + properties(elem) + datasetify(elem))

               if (voidElements.indexOf(tagname) > -1) {
                   strings.push(" />")
               } else {
                   strings.push(">")

                   if (elem.childNodes.length) {
                       strings.push.apply(strings, elem.childNodes.map(serializeNode$1))
                   } else if (elem.textContent || elem.innerText) {
                       strings.push(escapeText(elem.textContent || elem.innerText))
                   } else if (elem.innerHTML) {
                       strings.push(elem.innerHTML)
                   }

                   strings.push("</" + tagname + ">")
               }

               return strings.join("")
           }

           function isProperty(elem, key) {
               var type = typeof elem[key]

               if (key === "style" && Object.keys(elem.style).length > 0) {
                 return true
               }

               return elem.hasOwnProperty(key) &&
                   (type === "string" || type === "boolean" || type === "number") &&
                   key !== "nodeName" && key !== "className" && key !== "tagName" &&
                   key !== "textContent" && key !== "innerText" && key !== "namespaceURI" &&  key !== "innerHTML"
           }

           function stylify(styles) {
               if (typeof styles === 'string') return styles
               var attr = ""
               Object.keys(styles).forEach(function (key) {
                   var value = styles[key]
                   key = key.replace(/[A-Z]/g, function(c) {
                       return "-" + c.toLowerCase();
                   })
                   attr += key + ":" + value + ";"
               })
               return attr
           }

           function datasetify(elem) {
               var ds = elem.dataset
               var props = []

               for (var key in ds) {
                   props.push({ name: "data-" + key, value: ds[key] })
               }

               return props.length ? stringify(props) : ""
           }

           function stringify(list) {
               var attributes = []
               list.forEach(function (tuple) {
                   var name = tuple.name
                   var value = tuple.value

                   if (name === "style") {
                       value = stylify(value)
                   }

                   attributes.push(name + "=" + "\"" + escapeAttributeValue(value) + "\"")
               })

               return attributes.length ? " " + attributes.join(" ") : ""
           }

           function properties(elem) {
               var props = []
               for (var key in elem) {
                   if (isProperty(elem, key)) {
                       props.push({ name: key, value: elem[key] })
                   }
               }

               for (var ns in elem._attributes) {
                 for (var attribute in elem._attributes[ns]) {
                   var prop = elem._attributes[ns][attribute]
                   var name = (prop.prefix ? prop.prefix + ":" : "") + attribute
                   props.push({ name: name, value: prop.value })
                 }
               }

               if (elem.className) {
                   props.push({ name: "class", value: elem.className })
               }

               return props.length ? stringify(props) : ""
           }

           function escapeText(s) {
               var str = '';

               if (typeof(s) === 'string') { 
                   str = s; 
               } else if (s) {
                   str = s.toString();
               }

               return str
                   .replace(/&/g, "&amp;")
                   .replace(/</g, "&lt;")
                   .replace(/>/g, "&gt;")
           }

           function escapeAttributeValue(str) {
               return escapeText(str).replace(/"/g, "&quot;")
           }

           var domWalk$1 = __moduleExports$21
           var dispatchEvent$1 = __moduleExports$25
           var addEventListener$1 = __moduleExports$26
           var removeEventListener$1 = __moduleExports$27
           var serializeNode = __moduleExports$28

           var htmlns = "http://www.w3.org/1999/xhtml"

           var __moduleExports$24 = DOMElement$1

           function DOMElement$1(tagName, owner, namespace) {
               if (!(this instanceof DOMElement$1)) {
                   return new DOMElement$1(tagName)
               }

               var ns = namespace === undefined ? htmlns : (namespace || null)

               this.tagName = ns === htmlns ? String(tagName).toUpperCase() : tagName
               this.nodeName = this.tagName
               this.className = ""
               this.dataset = {}
               this.childNodes = []
               this.parentNode = null
               this.style = {}
               this.ownerDocument = owner || null
               this.namespaceURI = ns
               this._attributes = {}

               if (this.tagName === 'INPUT') {
                 this.type = 'text'
               }
           }

           DOMElement$1.prototype.type = "DOMElement"
           DOMElement$1.prototype.nodeType = 1

           DOMElement$1.prototype.appendChild = function _Element_appendChild(child) {
               if (child.parentNode) {
                   child.parentNode.removeChild(child)
               }

               this.childNodes.push(child)
               child.parentNode = this

               return child
           }

           DOMElement$1.prototype.replaceChild =
               function _Element_replaceChild(elem, needle) {
                   // TODO: Throw NotFoundError if needle.parentNode !== this

                   if (elem.parentNode) {
                       elem.parentNode.removeChild(elem)
                   }

                   var index = this.childNodes.indexOf(needle)

                   needle.parentNode = null
                   this.childNodes[index] = elem
                   elem.parentNode = this

                   return needle
               }

           DOMElement$1.prototype.removeChild = function _Element_removeChild(elem) {
               // TODO: Throw NotFoundError if elem.parentNode !== this

               var index = this.childNodes.indexOf(elem)
               this.childNodes.splice(index, 1)

               elem.parentNode = null
               return elem
           }

           DOMElement$1.prototype.insertBefore =
               function _Element_insertBefore(elem, needle) {
                   // TODO: Throw NotFoundError if referenceElement is a dom node
                   // and parentNode !== this

                   if (elem.parentNode) {
                       elem.parentNode.removeChild(elem)
                   }

                   var index = needle === null || needle === undefined ?
                       -1 :
                       this.childNodes.indexOf(needle)

                   if (index > -1) {
                       this.childNodes.splice(index, 0, elem)
                   } else {
                       this.childNodes.push(elem)
                   }

                   elem.parentNode = this
                   return elem
               }

           DOMElement$1.prototype.setAttributeNS =
               function _Element_setAttributeNS(namespace, name, value) {
                   var prefix = null
                   var localName = name
                   var colonPosition = name.indexOf(":")
                   if (colonPosition > -1) {
                       prefix = name.substr(0, colonPosition)
                       localName = name.substr(colonPosition + 1)
                   }
                   if (this.tagName === 'INPUT' && name === 'type') {
                     this.type = value;
                   }
                   else {
                     var attributes = this._attributes[namespace] || (this._attributes[namespace] = {})
                     attributes[localName] = {value: value, prefix: prefix}
                   }
               }

           DOMElement$1.prototype.getAttributeNS =
               function _Element_getAttributeNS(namespace, name) {
                   var attributes = this._attributes[namespace];
                   var value = attributes && attributes[name] && attributes[name].value
                   if (this.tagName === 'INPUT' && name === 'type') {
                     return this.type;
                   }
                   if (typeof value !== "string") {
                       return null
                   }
                   return value
               }

           DOMElement$1.prototype.removeAttributeNS =
               function _Element_removeAttributeNS(namespace, name) {
                   var attributes = this._attributes[namespace];
                   if (attributes) {
                       delete attributes[name]
                   }
               }

           DOMElement$1.prototype.hasAttributeNS =
               function _Element_hasAttributeNS(namespace, name) {
                   var attributes = this._attributes[namespace]
                   return !!attributes && name in attributes;
               }

           DOMElement$1.prototype.setAttribute = function _Element_setAttribute(name, value) {
               return this.setAttributeNS(null, name, value)
           }

           DOMElement$1.prototype.getAttribute = function _Element_getAttribute(name) {
               return this.getAttributeNS(null, name)
           }

           DOMElement$1.prototype.removeAttribute = function _Element_removeAttribute(name) {
               return this.removeAttributeNS(null, name)
           }

           DOMElement$1.prototype.hasAttribute = function _Element_hasAttribute(name) {
               return this.hasAttributeNS(null, name)
           }

           DOMElement$1.prototype.removeEventListener = removeEventListener$1
           DOMElement$1.prototype.addEventListener = addEventListener$1
           DOMElement$1.prototype.dispatchEvent = dispatchEvent$1

           // Un-implemented
           DOMElement$1.prototype.focus = function _Element_focus() {
               return void 0
           }

           DOMElement$1.prototype.toString = function _Element_toString() {
               return serializeNode(this)
           }

           DOMElement$1.prototype.getElementsByClassName = function _Element_getElementsByClassName(classNames) {
               var classes = classNames.split(" ");
               var elems = []

               domWalk$1(this, function (node) {
                   if (node.nodeType === 1) {
                       var nodeClassName = node.className || ""
                       var nodeClasses = nodeClassName.split(" ")

                       if (classes.every(function (item) {
                           return nodeClasses.indexOf(item) !== -1
                       })) {
                           elems.push(node)
                       }
                   }
               })

               return elems
           }

           DOMElement$1.prototype.getElementsByTagName = function _Element_getElementsByTagName(tagName) {
               tagName = tagName.toLowerCase()
               var elems = []

               domWalk$1(this.childNodes, function (node) {
                   if (node.nodeType === 1 && (tagName === '*' || node.tagName.toLowerCase() === tagName)) {
                       elems.push(node)
                   }
               })

               return elems
           }

           DOMElement$1.prototype.contains = function _Element_contains(element) {
               return domWalk$1(this, function (node) {
                   return element === node
               }) || false
           }

           var DOMElement$2 = __moduleExports$24

           var __moduleExports$29 = DocumentFragment$1

           function DocumentFragment$1(owner) {
               if (!(this instanceof DocumentFragment$1)) {
                   return new DocumentFragment$1()
               }

               this.childNodes = []
               this.parentNode = null
               this.ownerDocument = owner || null
           }

           DocumentFragment$1.prototype.type = "DocumentFragment"
           DocumentFragment$1.prototype.nodeType = 11
           DocumentFragment$1.prototype.nodeName = "#document-fragment"

           DocumentFragment$1.prototype.appendChild  = DOMElement$2.prototype.appendChild
           DocumentFragment$1.prototype.replaceChild = DOMElement$2.prototype.replaceChild
           DocumentFragment$1.prototype.removeChild  = DOMElement$2.prototype.removeChild

           DocumentFragment$1.prototype.toString =
               function _DocumentFragment_toString() {
                   return this.childNodes.map(function (node) {
                       return String(node)
                   }).join("")
               }

           var __moduleExports$30 = Event$1

           function Event$1(family) {}

           Event$1.prototype.initEvent = function _Event_initEvent(type, bubbles, cancelable) {
               this.type = type
               this.bubbles = bubbles
               this.cancelable = cancelable
           }

           Event$1.prototype.preventDefault = function _Event_preventDefault() {
               
           }

           var domWalk = __moduleExports$21

           var Comment = __moduleExports$22
           var DOMText = __moduleExports$23
           var DOMElement = __moduleExports$24
           var DocumentFragment = __moduleExports$29
           var Event = __moduleExports$30
           var dispatchEvent = __moduleExports$25
           var addEventListener = __moduleExports$26
           var removeEventListener = __moduleExports$27

           var __moduleExports$20 = Document$1;

           function Document$1() {
               if (!(this instanceof Document$1)) {
                   return new Document$1();
               }

               this.head = this.createElement("head")
               this.body = this.createElement("body")
               this.documentElement = this.createElement("html")
               this.documentElement.appendChild(this.head)
               this.documentElement.appendChild(this.body)
               this.childNodes = [this.documentElement]
               this.nodeType = 9
           }

           var proto = Document$1.prototype;
           proto.createTextNode = function createTextNode(value) {
               return new DOMText(value, this)
           }

           proto.createElementNS = function createElementNS(namespace, tagName) {
               var ns = namespace === null ? null : String(namespace)
               return new DOMElement(tagName, this, ns)
           }

           proto.createElement = function createElement(tagName) {
               return new DOMElement(tagName, this)
           }

           proto.createDocumentFragment = function createDocumentFragment() {
               return new DocumentFragment(this)
           }

           proto.createEvent = function createEvent(family) {
               return new Event(family)
           }

           proto.createComment = function createComment(data) {
               return new Comment(data, this)
           }

           proto.getElementById = function getElementById(id) {
               id = String(id)

               var result = domWalk(this.childNodes, function (node) {
                   if (String(node.id) === id) {
                       return node
                   }
               })

               return result || null
           }

           proto.getElementsByClassName = DOMElement.prototype.getElementsByClassName
           proto.getElementsByTagName = DOMElement.prototype.getElementsByTagName
           proto.contains = DOMElement.prototype.contains

           proto.removeEventListener = removeEventListener
           proto.addEventListener = addEventListener
           proto.dispatchEvent = dispatchEvent

           var Document = __moduleExports$20;

           var __moduleExports$19 = new Document();

           var __moduleExports$18 = createCommonjsModule(function (module) {
           var topLevel = typeof commonjsGlobal !== 'undefined' ? commonjsGlobal :
               typeof window !== 'undefined' ? window : {}
           var minDoc = __moduleExports$19;

           if (typeof __moduleExports$18 !== 'undefined') {
               module.exports = __moduleExports$18;
           } else {
               var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

               if (!doccy) {
                   doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
               }

               module.exports = doccy;
           }
           });

           var nativeIsArray$1 = Array.isArray
           var toString$1 = Object.prototype.toString

           var __moduleExports$31 = nativeIsArray$1 || isArray$3

           function isArray$3(obj) {
               return toString$1.call(obj) === "[object Array]"
           }

           var slice$1 = Array.prototype.slice

           var __moduleExports$36 = iterativelyWalk$1

           function iterativelyWalk$1(nodes, cb) {
               if (!('length' in nodes)) {
                   nodes = [nodes]
               }
               
               nodes = slice$1.call(nodes)

               while(nodes.length) {
                   var node = nodes.shift(),
                       ret = cb(node)

                   if (ret) {
                       return ret
                   }

                   if (node.childNodes && node.childNodes.length) {
                       nodes = slice$1.call(node.childNodes).concat(nodes)
                   }
               }
           }

           var __moduleExports$37 = Comment$3

           function Comment$3(data, owner) {
               if (!(this instanceof Comment$3)) {
                   return new Comment$3(data, owner)
               }

               this.data = data
               this.nodeValue = data
               this.length = data.length
               this.ownerDocument = owner || null
           }

           Comment$3.prototype.nodeType = 8
           Comment$3.prototype.nodeName = "#comment"

           Comment$3.prototype.toString = function _Comment_toString() {
               return "[object Comment]"
           }

           var __moduleExports$38 = DOMText$3

           function DOMText$3(value, owner) {
               if (!(this instanceof DOMText$3)) {
                   return new DOMText$3(value)
               }

               this.data = value || ""
               this.length = this.data.length
               this.ownerDocument = owner || null
           }

           DOMText$3.prototype.type = "DOMTextNode"
           DOMText$3.prototype.nodeType = 3
           DOMText$3.prototype.nodeName = "#text"

           DOMText$3.prototype.toString = function _Text_toString() {
               return this.data
           }

           DOMText$3.prototype.replaceData = function replaceData(index, length, value) {
               var current = this.data
               var left = current.substring(0, index)
               var right = current.substring(index + length, current.length)
               this.data = left + value + right
               this.length = this.data.length
           }

           var __moduleExports$40 = dispatchEvent$5

           function dispatchEvent$5(ev) {
               var elem = this
               var type = ev.type

               if (!ev.target) {
                   ev.target = elem
               }

               if (!elem.listeners) {
                   elem.listeners = {}
               }

               var listeners = elem.listeners[type]

               if (listeners) {
                   return listeners.forEach(function (listener) {
                       ev.currentTarget = elem
                       if (typeof listener === 'function') {
                           listener(ev)
                       } else {
                           listener.handleEvent(ev)
                       }
                   })
               }

               if (elem.parentNode) {
                   elem.parentNode.dispatchEvent(ev)
               }
           }

           var __moduleExports$41 = addEventListener$5

           function addEventListener$5(type, listener) {
               var elem = this

               if (!elem.listeners) {
                   elem.listeners = {}
               }

               if (!elem.listeners[type]) {
                   elem.listeners[type] = []
               }

               if (elem.listeners[type].indexOf(listener) === -1) {
                   elem.listeners[type].push(listener)
               }
           }

           var __moduleExports$42 = removeEventListener$5

           function removeEventListener$5(type, listener) {
               var elem = this

               if (!elem.listeners) {
                   return
               }

               if (!elem.listeners[type]) {
                   return
               }

               var list = elem.listeners[type]
               var index = list.indexOf(listener)
               if (index !== -1) {
                   list.splice(index, 1)
               }
           }

           var __moduleExports$43 = serializeNode$3

           var voidElements$1 = ["area","base","br","col","embed","hr","img","input","keygen","link","menuitem","meta","param","source","track","wbr"];

           function serializeNode$3(node) {
               switch (node.nodeType) {
                   case 3:
                       return escapeText$1(node.data)
                   case 8:
                       return "<!--" + node.data + "-->"
                   default:
                       return serializeElement$1(node)
               }
           }

           function serializeElement$1(elem) {
               var strings = []

               var tagname = elem.tagName

               if (elem.namespaceURI === "http://www.w3.org/1999/xhtml") {
                   tagname = tagname.toLowerCase()
               }

               strings.push("<" + tagname + properties$1(elem) + datasetify$1(elem))

               if (voidElements$1.indexOf(tagname) > -1) {
                   strings.push(" />")
               } else {
                   strings.push(">")

                   if (elem.childNodes.length) {
                       strings.push.apply(strings, elem.childNodes.map(serializeNode$3))
                   } else if (elem.textContent || elem.innerText) {
                       strings.push(escapeText$1(elem.textContent || elem.innerText))
                   } else if (elem.innerHTML) {
                       strings.push(elem.innerHTML)
                   }

                   strings.push("</" + tagname + ">")
               }

               return strings.join("")
           }

           function isProperty$1(elem, key) {
               var type = typeof elem[key]

               if (key === "style" && Object.keys(elem.style).length > 0) {
                 return true
               }

               return elem.hasOwnProperty(key) &&
                   (type === "string" || type === "boolean" || type === "number") &&
                   key !== "nodeName" && key !== "className" && key !== "tagName" &&
                   key !== "textContent" && key !== "innerText" && key !== "namespaceURI" &&  key !== "innerHTML"
           }

           function stylify$1(styles) {
               if (typeof styles === 'string') return styles
               var attr = ""
               Object.keys(styles).forEach(function (key) {
                   var value = styles[key]
                   key = key.replace(/[A-Z]/g, function(c) {
                       return "-" + c.toLowerCase();
                   })
                   attr += key + ":" + value + ";"
               })
               return attr
           }

           function datasetify$1(elem) {
               var ds = elem.dataset
               var props = []

               for (var key in ds) {
                   props.push({ name: "data-" + key, value: ds[key] })
               }

               return props.length ? stringify$1(props) : ""
           }

           function stringify$1(list) {
               var attributes = []
               list.forEach(function (tuple) {
                   var name = tuple.name
                   var value = tuple.value

                   if (name === "style") {
                       value = stylify$1(value)
                   }

                   attributes.push(name + "=" + "\"" + escapeAttributeValue$1(value) + "\"")
               })

               return attributes.length ? " " + attributes.join(" ") : ""
           }

           function properties$1(elem) {
               var props = []
               for (var key in elem) {
                   if (isProperty$1(elem, key)) {
                       props.push({ name: key, value: elem[key] })
                   }
               }

               for (var ns in elem._attributes) {
                 for (var attribute in elem._attributes[ns]) {
                   var prop = elem._attributes[ns][attribute]
                   var name = (prop.prefix ? prop.prefix + ":" : "") + attribute
                   props.push({ name: name, value: prop.value })
                 }
               }

               if (elem.className) {
                   props.push({ name: "class", value: elem.className })
               }

               return props.length ? stringify$1(props) : ""
           }

           function escapeText$1(s) {
               var str = '';

               if (typeof(s) === 'string') { 
                   str = s; 
               } else if (s) {
                   str = s.toString();
               }

               return str
                   .replace(/&/g, "&amp;")
                   .replace(/</g, "&lt;")
                   .replace(/>/g, "&gt;")
           }

           function escapeAttributeValue$1(str) {
               return escapeText$1(str).replace(/"/g, "&quot;")
           }

           var domWalk$3 = __moduleExports$36
           var dispatchEvent$4 = __moduleExports$40
           var addEventListener$4 = __moduleExports$41
           var removeEventListener$4 = __moduleExports$42
           var serializeNode$2 = __moduleExports$43

           var htmlns$1 = "http://www.w3.org/1999/xhtml"

           var __moduleExports$39 = DOMElement$4

           function DOMElement$4(tagName, owner, namespace) {
               if (!(this instanceof DOMElement$4)) {
                   return new DOMElement$4(tagName)
               }

               var ns = namespace === undefined ? htmlns$1 : (namespace || null)

               this.tagName = ns === htmlns$1 ? String(tagName).toUpperCase() : tagName
               this.nodeName = this.tagName
               this.className = ""
               this.dataset = {}
               this.childNodes = []
               this.parentNode = null
               this.style = {}
               this.ownerDocument = owner || null
               this.namespaceURI = ns
               this._attributes = {}

               if (this.tagName === 'INPUT') {
                 this.type = 'text'
               }
           }

           DOMElement$4.prototype.type = "DOMElement"
           DOMElement$4.prototype.nodeType = 1

           DOMElement$4.prototype.appendChild = function _Element_appendChild(child) {
               if (child.parentNode) {
                   child.parentNode.removeChild(child)
               }

               this.childNodes.push(child)
               child.parentNode = this

               return child
           }

           DOMElement$4.prototype.replaceChild =
               function _Element_replaceChild(elem, needle) {
                   // TODO: Throw NotFoundError if needle.parentNode !== this

                   if (elem.parentNode) {
                       elem.parentNode.removeChild(elem)
                   }

                   var index = this.childNodes.indexOf(needle)

                   needle.parentNode = null
                   this.childNodes[index] = elem
                   elem.parentNode = this

                   return needle
               }

           DOMElement$4.prototype.removeChild = function _Element_removeChild(elem) {
               // TODO: Throw NotFoundError if elem.parentNode !== this

               var index = this.childNodes.indexOf(elem)
               this.childNodes.splice(index, 1)

               elem.parentNode = null
               return elem
           }

           DOMElement$4.prototype.insertBefore =
               function _Element_insertBefore(elem, needle) {
                   // TODO: Throw NotFoundError if referenceElement is a dom node
                   // and parentNode !== this

                   if (elem.parentNode) {
                       elem.parentNode.removeChild(elem)
                   }

                   var index = needle === null || needle === undefined ?
                       -1 :
                       this.childNodes.indexOf(needle)

                   if (index > -1) {
                       this.childNodes.splice(index, 0, elem)
                   } else {
                       this.childNodes.push(elem)
                   }

                   elem.parentNode = this
                   return elem
               }

           DOMElement$4.prototype.setAttributeNS =
               function _Element_setAttributeNS(namespace, name, value) {
                   var prefix = null
                   var localName = name
                   var colonPosition = name.indexOf(":")
                   if (colonPosition > -1) {
                       prefix = name.substr(0, colonPosition)
                       localName = name.substr(colonPosition + 1)
                   }
                   if (this.tagName === 'INPUT' && name === 'type') {
                     this.type = value;
                   }
                   else {
                     var attributes = this._attributes[namespace] || (this._attributes[namespace] = {})
                     attributes[localName] = {value: value, prefix: prefix}
                   }
               }

           DOMElement$4.prototype.getAttributeNS =
               function _Element_getAttributeNS(namespace, name) {
                   var attributes = this._attributes[namespace];
                   var value = attributes && attributes[name] && attributes[name].value
                   if (this.tagName === 'INPUT' && name === 'type') {
                     return this.type;
                   }
                   if (typeof value !== "string") {
                       return null
                   }
                   return value
               }

           DOMElement$4.prototype.removeAttributeNS =
               function _Element_removeAttributeNS(namespace, name) {
                   var attributes = this._attributes[namespace];
                   if (attributes) {
                       delete attributes[name]
                   }
               }

           DOMElement$4.prototype.hasAttributeNS =
               function _Element_hasAttributeNS(namespace, name) {
                   var attributes = this._attributes[namespace]
                   return !!attributes && name in attributes;
               }

           DOMElement$4.prototype.setAttribute = function _Element_setAttribute(name, value) {
               return this.setAttributeNS(null, name, value)
           }

           DOMElement$4.prototype.getAttribute = function _Element_getAttribute(name) {
               return this.getAttributeNS(null, name)
           }

           DOMElement$4.prototype.removeAttribute = function _Element_removeAttribute(name) {
               return this.removeAttributeNS(null, name)
           }

           DOMElement$4.prototype.hasAttribute = function _Element_hasAttribute(name) {
               return this.hasAttributeNS(null, name)
           }

           DOMElement$4.prototype.removeEventListener = removeEventListener$4
           DOMElement$4.prototype.addEventListener = addEventListener$4
           DOMElement$4.prototype.dispatchEvent = dispatchEvent$4

           // Un-implemented
           DOMElement$4.prototype.focus = function _Element_focus() {
               return void 0
           }

           DOMElement$4.prototype.toString = function _Element_toString() {
               return serializeNode$2(this)
           }

           DOMElement$4.prototype.getElementsByClassName = function _Element_getElementsByClassName(classNames) {
               var classes = classNames.split(" ");
               var elems = []

               domWalk$3(this, function (node) {
                   if (node.nodeType === 1) {
                       var nodeClassName = node.className || ""
                       var nodeClasses = nodeClassName.split(" ")

                       if (classes.every(function (item) {
                           return nodeClasses.indexOf(item) !== -1
                       })) {
                           elems.push(node)
                       }
                   }
               })

               return elems
           }

           DOMElement$4.prototype.getElementsByTagName = function _Element_getElementsByTagName(tagName) {
               tagName = tagName.toLowerCase()
               var elems = []

               domWalk$3(this.childNodes, function (node) {
                   if (node.nodeType === 1 && (tagName === '*' || node.tagName.toLowerCase() === tagName)) {
                       elems.push(node)
                   }
               })

               return elems
           }

           DOMElement$4.prototype.contains = function _Element_contains(element) {
               return domWalk$3(this, function (node) {
                   return element === node
               }) || false
           }

           var DOMElement$5 = __moduleExports$39

           var __moduleExports$44 = DocumentFragment$3

           function DocumentFragment$3(owner) {
               if (!(this instanceof DocumentFragment$3)) {
                   return new DocumentFragment$3()
               }

               this.childNodes = []
               this.parentNode = null
               this.ownerDocument = owner || null
           }

           DocumentFragment$3.prototype.type = "DocumentFragment"
           DocumentFragment$3.prototype.nodeType = 11
           DocumentFragment$3.prototype.nodeName = "#document-fragment"

           DocumentFragment$3.prototype.appendChild  = DOMElement$5.prototype.appendChild
           DocumentFragment$3.prototype.replaceChild = DOMElement$5.prototype.replaceChild
           DocumentFragment$3.prototype.removeChild  = DOMElement$5.prototype.removeChild

           DocumentFragment$3.prototype.toString =
               function _DocumentFragment_toString() {
                   return this.childNodes.map(function (node) {
                       return String(node)
                   }).join("")
               }

           var __moduleExports$45 = Event$3

           function Event$3(family) {}

           Event$3.prototype.initEvent = function _Event_initEvent(type, bubbles, cancelable) {
               this.type = type
               this.bubbles = bubbles
               this.cancelable = cancelable
           }

           Event$3.prototype.preventDefault = function _Event_preventDefault() {
               
           }

           var domWalk$2 = __moduleExports$36

           var Comment$2 = __moduleExports$37
           var DOMText$2 = __moduleExports$38
           var DOMElement$3 = __moduleExports$39
           var DocumentFragment$2 = __moduleExports$44
           var Event$2 = __moduleExports$45
           var dispatchEvent$3 = __moduleExports$40
           var addEventListener$3 = __moduleExports$41
           var removeEventListener$3 = __moduleExports$42

           var __moduleExports$35 = Document$3;

           function Document$3() {
               if (!(this instanceof Document$3)) {
                   return new Document$3();
               }

               this.head = this.createElement("head")
               this.body = this.createElement("body")
               this.documentElement = this.createElement("html")
               this.documentElement.appendChild(this.head)
               this.documentElement.appendChild(this.body)
               this.childNodes = [this.documentElement]
               this.nodeType = 9
           }

           var proto$1 = Document$3.prototype;
           proto$1.createTextNode = function createTextNode(value) {
               return new DOMText$2(value, this)
           }

           proto$1.createElementNS = function createElementNS(namespace, tagName) {
               var ns = namespace === null ? null : String(namespace)
               return new DOMElement$3(tagName, this, ns)
           }

           proto$1.createElement = function createElement(tagName) {
               return new DOMElement$3(tagName, this)
           }

           proto$1.createDocumentFragment = function createDocumentFragment() {
               return new DocumentFragment$2(this)
           }

           proto$1.createEvent = function createEvent(family) {
               return new Event$2(family)
           }

           proto$1.createComment = function createComment(data) {
               return new Comment$2(data, this)
           }

           proto$1.getElementById = function getElementById(id) {
               id = String(id)

               var result = domWalk$2(this.childNodes, function (node) {
                   if (String(node.id) === id) {
                       return node
                   }
               })

               return result || null
           }

           proto$1.getElementsByClassName = DOMElement$3.prototype.getElementsByClassName
           proto$1.getElementsByTagName = DOMElement$3.prototype.getElementsByTagName
           proto$1.contains = DOMElement$3.prototype.contains

           proto$1.removeEventListener = removeEventListener$3
           proto$1.addEventListener = addEventListener$3
           proto$1.dispatchEvent = dispatchEvent$3

           var Document$2 = __moduleExports$35;

           var __moduleExports$34 = new Document$2();

           var __moduleExports$33 = createCommonjsModule(function (module) {
           var topLevel = typeof commonjsGlobal !== 'undefined' ? commonjsGlobal :
               typeof window !== 'undefined' ? window : {}
           var minDoc = __moduleExports$34;

           if (typeof __moduleExports$33 !== 'undefined') {
               module.exports = __moduleExports$33;
           } else {
               var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

               if (!doccy) {
                   doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
               }

               module.exports = doccy;
           }
           });

           var __moduleExports$47 = function isObject(x) {
           	return typeof x === "object" && x !== null;
           };

           var isObject = __moduleExports$47
           var isHook$2 = __moduleExports$7

           var __moduleExports$46 = applyProperties$1

           function applyProperties$1(node, props, previous) {
               for (var propName in props) {
                   var propValue = props[propName]

                   if (propValue === undefined) {
                       removeProperty(node, propName, propValue, previous);
                   } else if (isHook$2(propValue)) {
                       removeProperty(node, propName, propValue, previous)
                       if (propValue.hook) {
                           propValue.hook(node,
                               propName,
                               previous ? previous[propName] : undefined)
                       }
                   } else {
                       if (isObject(propValue)) {
                           patchObject(node, props, previous, propName, propValue);
                       } else {
                           node[propName] = propValue
                       }
                   }
               }
           }

           function removeProperty(node, propName, propValue, previous) {
               if (previous) {
                   var previousValue = previous[propName]

                   if (!isHook$2(previousValue)) {
                       if (propName === "attributes") {
                           for (var attrName in previousValue) {
                               node.removeAttribute(attrName)
                           }
                       } else if (propName === "style") {
                           for (var i in previousValue) {
                               node.style[i] = ""
                           }
                       } else if (typeof previousValue === "string") {
                           node[propName] = ""
                       } else {
                           node[propName] = null
                       }
                   } else if (previousValue.unhook) {
                       previousValue.unhook(node, propName, propValue)
                   }
               }
           }

           function patchObject(node, props, previous, propName, propValue) {
               var previousValue = previous ? previous[propName] : undefined

               // Set attributes
               if (propName === "attributes") {
                   for (var attrName in propValue) {
                       var attrValue = propValue[attrName]

                       if (attrValue === undefined) {
                           node.removeAttribute(attrName)
                       } else {
                           node.setAttribute(attrName, attrValue)
                       }
                   }

                   return
               }

               if(previousValue && isObject(previousValue) &&
                   getPrototype$1(previousValue) !== getPrototype$1(propValue)) {
                   node[propName] = propValue
                   return
               }

               if (!isObject(node[propName])) {
                   node[propName] = {}
               }

               var replacer = propName === "style" ? "" : undefined

               for (var k in propValue) {
                   var value = propValue[k]
                   node[propName][k] = (value === undefined) ? replacer : value
               }
           }

           function getPrototype$1(value) {
               if (Object.getPrototypeOf) {
                   return Object.getPrototypeOf(value)
               } else if (value.__proto__) {
                   return value.__proto__
               } else if (value.constructor) {
                   return value.constructor.prototype
               }
           }

           var isVNode$3 = __moduleExports$4
           var isVText$2 = __moduleExports$9
           var isWidget$4 = __moduleExports$5
           var isThunk$2 = __moduleExports$6

           var __moduleExports$48 = handleThunk$1

           function handleThunk$1(a, b) {
               var renderedA = a
               var renderedB = b

               if (isThunk$2(b)) {
                   renderedB = renderThunk(b, a)
               }

               if (isThunk$2(a)) {
                   renderedA = renderThunk(a, null)
               }

               return {
                   a: renderedA,
                   b: renderedB
               }
           }

           function renderThunk(thunk, previous) {
               var renderedThunk = thunk.vnode

               if (!renderedThunk) {
                   renderedThunk = thunk.vnode = thunk.render(previous)
               }

               if (!(isVNode$3(renderedThunk) ||
                       isVText$2(renderedThunk) ||
                       isWidget$4(renderedThunk))) {
                   throw new Error("thunk did not return a valid node");
               }

               return renderedThunk
           }

           var document$2 = __moduleExports$33

           var applyProperties = __moduleExports$46

           var isVNode$2 = __moduleExports$4
           var isVText$1 = __moduleExports$9
           var isWidget$3 = __moduleExports$5
           var handleThunk = __moduleExports$48

           var __moduleExports$32 = createElement

           function createElement(vnode, opts) {
               var doc = opts ? opts.document || document$2 : document$2
               var warn = opts ? opts.warn : null

               vnode = handleThunk(vnode).a

               if (isWidget$3(vnode)) {
                   return vnode.init()
               } else if (isVText$1(vnode)) {
                   return doc.createTextNode(vnode.text)
               } else if (!isVNode$2(vnode)) {
                   if (warn) {
                       warn("Item is not a valid virtual dom node", vnode)
                   }
                   return null
               }

               var node = (vnode.namespace === null) ?
                   doc.createElement(vnode.tagName) :
                   doc.createElementNS(vnode.namespace, vnode.tagName)

               var props = vnode.properties
               applyProperties(node, props)

               var children = vnode.children

               for (var i = 0; i < children.length; i++) {
                   var childNode = createElement(children[i], opts)
                   if (childNode) {
                       node.appendChild(childNode)
                   }
               }

               return node
           }

           // Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
           // We don't want to read all of the DOM nodes in the tree so we use
           // the in-order tree indexing to eliminate recursion down certain branches.
           // We only recurse into a DOM node if we know that it contains a child of
           // interest.

           var noChild = {}

           var __moduleExports$49 = domIndex$1

           function domIndex$1(rootNode, tree, indices, nodes) {
               if (!indices || indices.length === 0) {
                   return {}
               } else {
                   indices.sort(ascending)
                   return recurse(rootNode, tree, indices, nodes, 0)
               }
           }

           function recurse(rootNode, tree, indices, nodes, rootIndex) {
               nodes = nodes || {}


               if (rootNode) {
                   if (indexInRange(indices, rootIndex, rootIndex)) {
                       nodes[rootIndex] = rootNode
                   }

                   var vChildren = tree.children

                   if (vChildren) {

                       var childNodes = rootNode.childNodes

                       for (var i = 0, j = 0; i < tree.children.length; i++, j++) {
                           rootIndex += 1

                           var vChild = vChildren[i] || noChild
                           var nextIndex = rootIndex + (vChild.count || 0)

                           // skip recursion down the tree if there are no nodes down here
                           if (indexInRange(indices, rootIndex, nextIndex)) {
                               // skip dom nodes with delayed removal
                               while(childNodes[j] && childNodes[j].isLeaving) j++
                               recurse(childNodes[j], vChild, indices, nodes, rootIndex)
                           }

                           rootIndex = nextIndex
                       }
                   }
               }

               return nodes
           }

           // Binary search for an index in the interval [left, right]
           function indexInRange(indices, left, right) {
               if (indices.length === 0) {
                   return false
               }

               var minIndex = 0
               var maxIndex = indices.length - 1
               var currentIndex
               var currentItem

               while (minIndex <= maxIndex) {
                   currentIndex = ((maxIndex + minIndex) / 2) >> 0
                   currentItem = indices[currentIndex]

                   if (minIndex === maxIndex) {
                       return currentItem >= left && currentItem <= right
                   } else if (currentItem < left) {
                       minIndex = currentIndex + 1
                   } else  if (currentItem > right) {
                       maxIndex = currentIndex - 1
                   } else {
                       return true
                   }
               }

               return false;
           }

           function ascending(a, b) {
               return a > b ? 1 : -1
           }

           var version$4 = __moduleExports$3

           VirtualPatch.NONE = 0
           VirtualPatch.VTEXT = 1
           VirtualPatch.VNODE = 2
           VirtualPatch.WIDGET = 3
           VirtualPatch.PROPS = 4
           VirtualPatch.ORDER = 5
           VirtualPatch.INSERT = 6
           VirtualPatch.REMOVE = 7
           VirtualPatch.THUNK = 8

           var __moduleExports$51 = VirtualPatch

           function VirtualPatch(type, vNode, patch) {
               this.type = Number(type)
               this.vNode = vNode
               this.patch = patch
           }

           VirtualPatch.prototype.version = version$4
           VirtualPatch.prototype.type = "VirtualPatch"

           var isWidget$6 = __moduleExports$5

           var __moduleExports$52 = updateWidget$1

           function updateWidget$1(a, b) {
               if (isWidget$6(a) && isWidget$6(b)) {
                   if ("name" in a && "name" in b) {
                       return a.id === b.id
                   } else {
                       return a.init === b.init
                   }
               }

               return false
           }

           var applyProperties$2 = __moduleExports$46

           var isWidget$5 = __moduleExports$5
           var VPatch = __moduleExports$51

           var updateWidget = __moduleExports$52

           var __moduleExports$50 = applyPatch$1

           function applyPatch$1(vpatch, domNode, renderOptions) {
               var type = vpatch.type
               var vNode = vpatch.vNode
               var patch = vpatch.patch

               switch (type) {
                   case VPatch.REMOVE:
                       return removeNode(domNode, vNode)
                   case VPatch.INSERT:
                       return insertNode(domNode, patch, renderOptions)
                   case VPatch.VTEXT:
                       return stringPatch(domNode, vNode, patch, renderOptions)
                   case VPatch.WIDGET:
                       return widgetPatch(domNode, vNode, patch, renderOptions)
                   case VPatch.VNODE:
                       return vNodePatch(domNode, vNode, patch, renderOptions)
                   case VPatch.ORDER:
                       reorderChildren(domNode, patch)
                       return domNode
                   case VPatch.PROPS:
                       applyProperties$2(domNode, patch, vNode.properties)
                       return domNode
                   case VPatch.THUNK:
                       return replaceRoot(domNode,
                           renderOptions.patch(domNode, patch, renderOptions))
                   default:
                       return domNode
               }
           }

           function removeNode(domNode, vNode) {
               var parentNode = domNode.parentNode

               if (parentNode) {
                   if (vNode.transition) {
                       // extend dom for performance reasons :/
                       domNode.isLeaving = true
                       domNode.classList.add(vNode.transition.leaveClass || "leave")
                       setTimeout(function () {
                           parentNode.removeChild(domNode)
                       }, typeof vNode.transition !== "object" ? vNode.transition : vNode.transition.duration || 1000)
                   } else {
                       parentNode.removeChild(domNode)
                   }
               }

               destroyWidget(domNode, vNode);

               return null
           }

           function insertNode(parentNode, vNode, renderOptions) {
               var newNode = renderOptions.render(vNode, renderOptions)

               if (parentNode) {
                   if (vNode.transition) {
                       newNode.classList.add(vNode.enterClass || "enter")
                       // TODO: could we use `nextTick` instead
                       setTimeout(function () {
                           newNode.classList.remove(vNode.enterClass || "enter")
                       }, 10)
                   }
                   parentNode.appendChild(newNode)  
               }

               return parentNode
           }

           function stringPatch(domNode, leftVNode, vText, renderOptions) {
               var newNode

               if (domNode.nodeType === 3) {
                   domNode.replaceData(0, domNode.length, vText.text)
                   newNode = domNode
               } else {
                   var parentNode = domNode.parentNode
                   newNode = renderOptions.render(vText, renderOptions)

                   if (parentNode && newNode !== domNode) {
                       parentNode.replaceChild(newNode, domNode)
                   }
               }

               return newNode
           }

           function widgetPatch(domNode, leftVNode, widget, renderOptions) {
               var updating = updateWidget(leftVNode, widget)
               var newNode

               if (updating) {
                   newNode = widget.update(leftVNode, domNode) || domNode
               } else {
                   newNode = renderOptions.render(widget, renderOptions)
               }

               var parentNode = domNode.parentNode

               if (parentNode && newNode !== domNode) {
                   parentNode.replaceChild(newNode, domNode)
               }

               if (!updating) {
                   destroyWidget(domNode, leftVNode)
               }

               return newNode
           }

           function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
               var parentNode = domNode.parentNode
               var newNode = renderOptions.render(vNode, renderOptions)

               if (parentNode && newNode !== domNode) {
                   parentNode.replaceChild(newNode, domNode)
               }

               return newNode
           }

           function destroyWidget(domNode, w) {
               if (typeof w.destroy === "function" && isWidget$5(w)) {
                   w.destroy(domNode)
               }
           }

           function reorderChildren(domNode, moves) {
               var childNodes = domNode.childNodes
               var keyMap = {}
               var node
               var remove
               var insert

               for (var i = 0; i < moves.removes.length; i++) {
                   remove = moves.removes[i]
                   node = childNodes[remove.from]
                   if (remove.key) {
                       keyMap[remove.key] = node
                   }
                   domNode.removeChild(node)
               }

               var length = childNodes.length
               for (var j = 0; j < moves.inserts.length; j++) {
                   insert = moves.inserts[j]
                   node = keyMap[insert.key]
                   // this is the weirdest bug i"ve ever seen in webkit
                   domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
               }
           }

           function replaceRoot(oldRoot, newRoot) {
               if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
                   oldRoot.parentNode.replaceChild(newRoot, oldRoot)
               }

               return newRoot;
           }

           var document$1 = __moduleExports$18
           var isArray$2 = __moduleExports$31

           var render$1 = __moduleExports$32
           var domIndex = __moduleExports$49
           var patchOp = __moduleExports$50
           var __moduleExports$17 = patch$1

           function patch$1(rootNode, patches, renderOptions) {
               renderOptions = renderOptions || {}
               renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch$1
                   ? renderOptions.patch
                   : patchRecursive
               renderOptions.render = renderOptions.render || render$1

               return renderOptions.patch(rootNode, patches, renderOptions)
           }

           function patchRecursive(rootNode, patches, renderOptions) {
               var indices = patchIndices(patches)

               if (indices.length === 0) {
                   return rootNode
               }

               var index = domIndex(rootNode, patches.a, indices)
               var ownerDocument = rootNode.ownerDocument

               if (!renderOptions.document && ownerDocument !== document$1) {
                   renderOptions.document = ownerDocument
               }

               for (var i = 0; i < indices.length; i++) {
                   var nodeIndex = indices[i]
                   rootNode = applyPatch(rootNode,
                       index[nodeIndex],
                       patches[nodeIndex],
                       renderOptions)
               }

               return rootNode
           }

           function applyPatch(rootNode, domNode, patchList, renderOptions) {
               if (!domNode) {
                   return rootNode
               }

               var newNode

               if (isArray$2(patchList)) {
                   for (var i = 0; i < patchList.length; i++) {
                       newNode = patchOp(patchList[i], domNode, renderOptions)

                       if (domNode === rootNode) {
                           rootNode = newNode
                       }
                   }
               } else {
                   newNode = patchOp(patchList, domNode, renderOptions)

                   if (domNode === rootNode) {
                       rootNode = newNode
                   }
               }

               return rootNode
           }

           function patchIndices(patches) {
               var indices = []

               for (var key in patches) {
                   if (key !== "a") {
                       indices.push(Number(key))
                   }
               }

               return indices
           }

           var patch = __moduleExports$17

           var createElement$1 = __moduleExports$32

           var createElement_1 = createElement$1

           var isObject$1 = __moduleExports$47
           var isHook$3 = __moduleExports$7

           var __moduleExports$54 = diffProps$1

           function diffProps$1(a, b) {
               var diff

               for (var aKey in a) {
                   if (!(aKey in b)) {
                       diff = diff || {}
                       diff[aKey] = undefined
                   }

                   var aValue = a[aKey]
                   var bValue = b[aKey]

                   if (aValue === bValue) {
                       continue
                   } else if (isObject$1(aValue) && isObject$1(bValue)) {
                       if (getPrototype$2(bValue) !== getPrototype$2(aValue)) {
                           diff = diff || {}
                           diff[aKey] = bValue
                       } else if (isHook$3(bValue)) {
                            diff = diff || {}
                            diff[aKey] = bValue
                       } else {
                           var objectDiff = diffProps$1(aValue, bValue)
                           if (objectDiff) {
                               diff = diff || {}
                               diff[aKey] = objectDiff
                           }
                       }
                   } else {
                       diff = diff || {}
                       diff[aKey] = bValue
                   }
               }

               for (var bKey in b) {
                   if (!(bKey in a)) {
                       diff = diff || {}
                       diff[bKey] = b[bKey]
                   }
               }

               return diff
           }

           function getPrototype$2(value) {
             if (Object.getPrototypeOf) {
               return Object.getPrototypeOf(value)
             } else if (value.__proto__) {
               return value.__proto__
             } else if (value.constructor) {
               return value.constructor.prototype
             }
           }

           var isArray$4 = __moduleExports$1

           var VPatch$1 = __moduleExports$51
           var isVNode$4 = __moduleExports$4
           var isVText$3 = __moduleExports$9
           var isWidget$7 = __moduleExports$5
           var isThunk$3 = __moduleExports$6
           var handleThunk$2 = __moduleExports$48

           var diffProps = __moduleExports$54

           var __moduleExports$53 = diff$1

           function diff$1(a, b) {
               var patch = { a: a }
               walk(a, b, patch, 0)
               return patch
           }

           function walk(a, b, patch, index) {
               if (a === b) {
                   return
               }

               var apply = patch[index]
               var applyClear = false

               if (isThunk$3(a) || isThunk$3(b)) {
                   thunks(a, b, patch, index)
               } else if (b == null) {

                   // If a is a widget we will add a remove patch for it
                   // Otherwise any child widgets/hooks must be destroyed.
                   // This prevents adding two remove patches for a widget.
                   if (!isWidget$7(a)) {
                       clearState(a, patch, index)
                       apply = patch[index]
                   }

                   apply = appendPatch(apply, new VPatch$1(VPatch$1.REMOVE, a, b))
               } else if (isVNode$4(b)) {
                   if (isVNode$4(a)) {
                       if (a.tagName === b.tagName &&
                           a.namespace === b.namespace &&
                           a.key === b.key) {
                           var propsPatch = diffProps(a.properties, b.properties)
                           if (propsPatch) {
                               apply = appendPatch(apply,
                                   new VPatch$1(VPatch$1.PROPS, a, propsPatch))
                           }
                           apply = diffChildren(a, b, patch, apply, index)
                       } else {
                           apply = appendPatch(apply, new VPatch$1(VPatch$1.VNODE, a, b))
                           applyClear = true
                       }
                   } else {
                       apply = appendPatch(apply, new VPatch$1(VPatch$1.VNODE, a, b))
                       applyClear = true
                   }
               } else if (isVText$3(b)) {
                   if (!isVText$3(a)) {
                       apply = appendPatch(apply, new VPatch$1(VPatch$1.VTEXT, a, b))
                       applyClear = true
                   } else if (a.text !== b.text) {
                       apply = appendPatch(apply, new VPatch$1(VPatch$1.VTEXT, a, b))
                   }
               } else if (isWidget$7(b)) {
                   if (!isWidget$7(a)) {
                       applyClear = true
                   }

                   apply = appendPatch(apply, new VPatch$1(VPatch$1.WIDGET, a, b))
               }

               if (apply) {
                   patch[index] = apply
               }

               if (applyClear) {
                   clearState(a, patch, index)
               }
           }

           function diffChildren(a, b, patch, apply, index) {
               var aChildren = a.children
               var orderedSet = reorder(aChildren, b.children)
               var bChildren = orderedSet.children

               var aLen = aChildren.length
               var bLen = bChildren.length
               var len = aLen > bLen ? aLen : bLen

               for (var i = 0; i < len; i++) {
                   var leftNode = aChildren[i]
                   var rightNode = bChildren[i]
                   index += 1

                   if (!leftNode) {
                       if (rightNode) {
                           // Excess nodes in b need to be added
                           apply = appendPatch(apply,
                               new VPatch$1(VPatch$1.INSERT, null, rightNode))
                       }
                   } else {
                       walk(leftNode, rightNode, patch, index)
                   }

                   if (isVNode$4(leftNode) && leftNode.count) {
                       index += leftNode.count
                   }
               }

               if (orderedSet.moves) {
                   // Reorder nodes last
                   apply = appendPatch(apply, new VPatch$1(
                       VPatch$1.ORDER,
                       a,
                       orderedSet.moves
                   ))
               }

               return apply
           }

           function clearState(vNode, patch, index) {
               // TODO: Make this a single walk, not two
               unhook(vNode, patch, index)
               destroyWidgets(vNode, patch, index)
           }

           // Patch records for all destroyed widgets must be added because we need
           // a DOM node reference for the destroy function
           function destroyWidgets(vNode, patch, index) {
               if (isWidget$7(vNode)) {
                   if (typeof vNode.destroy === "function") {
                       patch[index] = appendPatch(
                           patch[index],
                           new VPatch$1(VPatch$1.REMOVE, vNode, null)
                       )
                   }
               } else if (isVNode$4(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
                   var children = vNode.children
                   var len = children.length
                   for (var i = 0; i < len; i++) {
                       var child = children[i]
                       index += 1

                       destroyWidgets(child, patch, index)

                       if (isVNode$4(child) && child.count) {
                           index += child.count
                       }
                   }
               } else if (isThunk$3(vNode)) {
                   thunks(vNode, null, patch, index)
               }
           }

           // Create a sub-patch for thunks
           function thunks(a, b, patch, index) {
               var nodes = handleThunk$2(a, b)
               var thunkPatch = diff$1(nodes.a, nodes.b)
               if (hasPatches(thunkPatch)) {
                   patch[index] = new VPatch$1(VPatch$1.THUNK, null, thunkPatch)
               }
           }

           function hasPatches(patch) {
               for (var index in patch) {
                   if (index !== "a") {
                       return true
                   }
               }

               return false
           }

           // Execute hooks when two nodes are identical
           function unhook(vNode, patch, index) {
               if (isVNode$4(vNode)) {
                   if (vNode.hooks) {
                       patch[index] = appendPatch(
                           patch[index],
                           new VPatch$1(
                               VPatch$1.PROPS,
                               vNode,
                               undefinedKeys(vNode.hooks)
                           )
                       )
                   }

                   if (vNode.descendantHooks || vNode.hasThunks) {
                       var children = vNode.children
                       var len = children.length
                       for (var i = 0; i < len; i++) {
                           var child = children[i]
                           index += 1

                           unhook(child, patch, index)

                           if (isVNode$4(child) && child.count) {
                               index += child.count
                           }
                       }
                   }
               } else if (isThunk$3(vNode)) {
                   thunks(vNode, null, patch, index)
               }
           }

           function undefinedKeys(obj) {
               var result = {}

               for (var key in obj) {
                   result[key] = undefined
               }

               return result
           }

           // List diff, naive left to right reordering
           function reorder(aChildren, bChildren) {
               // O(M) time, O(M) memory
               var bChildIndex = keyIndex(bChildren)
               var bKeys = bChildIndex.keys
               var bFree = bChildIndex.free

               if (bFree.length === bChildren.length) {
                   return {
                       children: bChildren,
                       moves: null
                   }
               }

               // O(N) time, O(N) memory
               var aChildIndex = keyIndex(aChildren)
               var aKeys = aChildIndex.keys
               var aFree = aChildIndex.free

               if (aFree.length === aChildren.length) {
                   return {
                       children: bChildren,
                       moves: null
                   }
               }

               // O(MAX(N, M)) memory
               var newChildren = []

               var freeIndex = 0
               var freeCount = bFree.length
               var deletedItems = 0

               // Iterate through a and match a node in b
               // O(N) time,
               for (var i = 0 ; i < aChildren.length; i++) {
                   var aItem = aChildren[i]
                   var itemIndex

                   if (aItem.key) {
                       if (bKeys.hasOwnProperty(aItem.key)) {
                           // Match up the old keys
                           itemIndex = bKeys[aItem.key]
                           newChildren.push(bChildren[itemIndex])

                       } else {
                           // Remove old keyed items
                           itemIndex = i - deletedItems++
                           newChildren.push(null)
                       }
                   } else {
                       // Match the item in a with the next free item in b
                       if (freeIndex < freeCount) {
                           itemIndex = bFree[freeIndex++]
                           newChildren.push(bChildren[itemIndex])
                       } else {
                           // There are no free items in b to match with
                           // the free items in a, so the extra free nodes
                           // are deleted.
                           itemIndex = i - deletedItems++
                           newChildren.push(null)
                       }
                   }
               }

               var lastFreeIndex = freeIndex >= bFree.length ?
                   bChildren.length :
                   bFree[freeIndex]

               // Iterate through b and append any new keys
               // O(M) time
               for (var j = 0; j < bChildren.length; j++) {
                   var newItem = bChildren[j]

                   if (newItem.key) {
                       if (!aKeys.hasOwnProperty(newItem.key)) {
                           // Add any new keyed items
                           // We are adding new items to the end and then sorting them
                           // in place. In future we should insert new items in place.
                           newChildren.push(newItem)
                       }
                   } else if (j >= lastFreeIndex) {
                       // Add any leftover non-keyed items
                       newChildren.push(newItem)
                   }
               }

               var simulate = newChildren.slice()
               var simulateIndex = 0
               var removes = []
               var inserts = []
               var simulateItem

               for (var k = 0; k < bChildren.length;) {
                   var wantedItem = bChildren[k]
                   simulateItem = simulate[simulateIndex]

                   // remove items
                   while (simulateItem === null && simulate.length) {
                       removes.push(remove(simulate, simulateIndex, null))
                       simulateItem = simulate[simulateIndex]
                   }

                   if (!simulateItem || simulateItem.key !== wantedItem.key) {
                       // if we need a key in this position...
                       if (wantedItem.key) {
                           if (simulateItem && simulateItem.key) {
                               // if an insert doesn't put this key in place, it needs to move
                               if (bKeys[simulateItem.key] !== k + 1) {
                                   removes.push(remove(simulate, simulateIndex, simulateItem.key))
                                   simulateItem = simulate[simulateIndex]
                                   // if the remove didn't put the wanted item in place, we need to insert it
                                   if (!simulateItem || simulateItem.key !== wantedItem.key) {
                                       inserts.push({key: wantedItem.key, to: k})
                                   }
                                   // items are matching, so skip ahead
                                   else {
                                       simulateIndex++
                                   }
                               }
                               else {
                                   inserts.push({key: wantedItem.key, to: k})
                               }
                           }
                           else {
                               inserts.push({key: wantedItem.key, to: k})
                           }
                           k++
                       }
                       // a key in simulate has no matching wanted key, remove it
                       else if (simulateItem && simulateItem.key) {
                           removes.push(remove(simulate, simulateIndex, simulateItem.key))
                       }
                   }
                   else {
                       simulateIndex++
                       k++
                   }
               }

               // remove all the remaining nodes from simulate
               while(simulateIndex < simulate.length) {
                   simulateItem = simulate[simulateIndex]
                   removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
               }

               // If the only moves we have are deletes then we can just
               // let the delete patch remove these items.
               if (removes.length === deletedItems && !inserts.length) {
                   return {
                       children: newChildren,
                       moves: null
                   }
               }

               return {
                   children: newChildren,
                   moves: {
                       removes: removes,
                       inserts: inserts
                   }
               }
           }

           function remove(arr, index, key) {
               arr.splice(index, 1)

               return {
                   from: index,
                   key: key
               }
           }

           function keyIndex(children) {
               var keys = {}
               var free = []
               var length = children.length

               for (var i = 0; i < length; i++) {
                   var child = children[i]

                   if (child.key) {
                       keys[child.key] = i
                   } else {
                       free.push(i)
                   }
               }

               return {
                   keys: keys,     // A hash of key name to index
                   free: free      // An array of unkeyed item indices
               }
           }

           function appendPatch(apply, patch) {
               if (apply) {
                   if (isArray$4(apply)) {
                       apply.push(patch)
                   } else {
                       apply = [apply, patch]
                   }

                   return apply
               } else {
                   return patch
               }
           }

           var diff = __moduleExports$53

           var diff_1 = diff

           var fastdom = createCommonjsModule(function (module) {
           !(function(win) {

           /**
            * FastDom
            *
            * Eliminates layout thrashing
            * by batching DOM read/write
            * interactions.
            *
            * @author Wilson Page <wilsonpage@me.com>
            * @author Kornel Lesinski <kornel.lesinski@ft.com>
            */

           'use strict';

           /**
            * Mini logger
            *
            * @return {Function}
            */
           var debug = function() {};

           /**
            * Normalized rAF
            *
            * @type {Function}
            */
           var raf = win.requestAnimationFrame
             || win.webkitRequestAnimationFrame
             || win.mozRequestAnimationFrame
             || win.msRequestAnimationFrame
             || function(cb) { return setTimeout(cb, 16); };

           /**
            * Initialize a `FastDom`.
            *
            * @constructor
            */
           function FastDom() {
             var self = this;
             self.reads = [];
             self.writes = [];
             self.raf = raf.bind(win); // test hook
             debug('initialized', self);
           }

           FastDom.prototype = {
             constructor: FastDom,

             /**
              * Adds a job to the read batch and
              * schedules a new frame if need be.
              *
              * @param  {Function} fn
              * @public
              */
             measure: function(fn, ctx) {
               debug('measure');
               var task = !ctx ? fn : fn.bind(ctx);
               this.reads.push(task);
               scheduleFlush(this);
               return task;
             },

             /**
              * Adds a job to the
              * write batch and schedules
              * a new frame if need be.
              *
              * @param  {Function} fn
              * @public
              */
             mutate: function(fn, ctx) {
               debug('mutate');
               var task = !ctx ? fn : fn.bind(ctx);
               this.writes.push(task);
               scheduleFlush(this);
               return task;
             },

             /**
              * Clears a scheduled 'read' or 'write' task.
              *
              * @param {Object} task
              * @return {Boolean} success
              * @public
              */
             clear: function(task) {
               debug('clear', task);
               return remove(this.reads, task) || remove(this.writes, task);
             },

             /**
              * Extend this FastDom with some
              * custom functionality.
              *
              * Because fastdom must *always* be a
              * singleton, we're actually extending
              * the fastdom instance. This means tasks
              * scheduled by an extension still enter
              * fastdom's global task queue.
              *
              * The 'super' instance can be accessed
              * from `this.fastdom`.
              *
              * @example
              *
              * var myFastdom = fastdom.extend({
              *   initialize: function() {
              *     // runs on creation
              *   },
              *
              *   // override a method
              *   measure: function(fn) {
              *     // do extra stuff ...
              *
              *     // then call the original
              *     return this.fastdom.measure(fn);
              *   },
              *
              *   ...
              * });
              *
              * @param  {Object} props  properties to mixin
              * @return {FastDom}
              */
             extend: function(props) {
               debug('extend', props);
               if (typeof props != 'object') throw new Error('expected object');

               var child = Object.create(this);
               mixin(child, props);
               child.fastdom = this;

               // run optional creation hook
               if (child.initialize) child.initialize();

               return child;
             },

             // override this with a function
             // to prevent Errors in console
             // when tasks throw
             catch: null
           };

           /**
            * Schedules a new read/write
            * batch if one isn't pending.
            *
            * @private
            */
           function scheduleFlush(fastdom) {
             if (!fastdom.scheduled) {
               fastdom.scheduled = true;
               fastdom.raf(flush.bind(null, fastdom));
               debug('flush scheduled');
             }
           }

           /**
            * Runs queued `read` and `write` tasks.
            *
            * Errors are caught and thrown by default.
            * If a `.catch` function has been defined
            * it is called instead.
            *
            * @private
            */
           function flush(fastdom) {
             debug('flush');

             var writes = fastdom.writes;
             var reads = fastdom.reads;
             var error;

             try {
               debug('flushing reads', reads.length);
               runTasks(reads);
               debug('flushing writes', writes.length);
               runTasks(writes);
             } catch (e) { error = e; }

             fastdom.scheduled = false;

             // If the batch errored we may still have tasks queued
             if (reads.length || writes.length) scheduleFlush(fastdom);

             if (error) {
               debug('task errored', error.message);
               if (fastdom.catch) fastdom.catch(error);
               else throw error;
             }
           }

           /**
            * We run this inside a try catch
            * so that if any jobs error, we
            * are able to recover and continue
            * to flush the batch until it's empty.
            *
            * @private
            */
           function runTasks(tasks) {
             debug('run tasks');
             var task; while (task = tasks.shift()) task();
           }

           /**
            * Remove an item from an Array.
            *
            * @param  {Array} array
            * @param  {*} item
            * @return {Boolean}
            */
           function remove(array, item) {
             var index = array.indexOf(item);
             return !!~index && !!array.splice(index, 1);
           }

           /**
            * Mixin own properties of source
            * object into the target.
            *
            * @param  {Object} target
            * @param  {Object} source
            */
           function mixin(target, source) {
             for (var key in source) {
               if (source.hasOwnProperty(key)) target[key] = source[key];
             }
           }

           // There should never be more than
           // one instance of `FastDom` in an app
           var exports = win.fastdom = (win.fastdom || new FastDom()); // jshint ignore:line

           // Expose to CJS & AMD
           if ((typeof define)[0] == 'f') define(function() { return exports; });
           else if ((typeof module)[0] == 'o') module.exports = exports;

           })(commonjsGlobal);
           });

           var _Promise = typeof Promise === 'undefined' ? require('es6-promise').Promise : Promise;

           var Batch = function () {

               /**
                * [constructor Creates an object for batch process]
                * @param  {[type]} initialState [Initial state to render]
                * @param  {[type]} render       [Render function]
                * @param  {[type]} initialTree  [Optional, A Vtree to do diff with]
                * @param  {[type]} rootNode     [Optional, A node to batch changes into]
                * @return {[type]}              [description,]
                */

               function Batch(initialState, render) {
                   classCallCheck(this, Batch);

                   this.render = render;
                   this.tree = this.render(initialState);
                   this.rootNode = createElement_1(this.tree);
               }

               /**
                * [update Queue rendering with new state]
                * @param  {[type]} newState [New state to render]
                * @param  {Function} callback [Callback to run after dom patch]
                * @return {[type]}          [description]
                * 
                */

               Batch.prototype.update = function update(newState) {
                   var _this = this;

                   return new _Promise(function (resolve, reject) {
                       var newTree = _this.render(newState);
                       var patches = diff_1(_this.tree, newTree);

                       fastdom.mutate(function () {
                           _this.rootNode = patch(_this.rootNode, patches);
                           _this.tree = newTree;
                           resolve();
                       });
                   });
               };

               return Batch;
           }();

           function batch () {
               return new (Function.prototype.bind.apply(Batch, [null].concat(Array.prototype.slice.call(arguments))))();
           }

           var LifecycleHook = function () {
               function LifecycleHook(component) {
                   classCallCheck(this, LifecycleHook);

                   this.component = component;
               }
               /**
                * [hook When vnode is converted to HTMLElement]
                * @param  {[type]} node          [HTMLElement]
                * @param  {[type]} propertyName  [name of property set as hook]
                * @param  {[type]} previousValue [description]
                * @return {[type]}               [void]
                */


               LifecycleHook.prototype.hook = function hook(node, propertyName, previousValue) {
                   var _this = this;

                   console.log("created", node);
                   this.component.node = node;
                   this.component.createdCallback();
                   /*node.classList.add('ng-enter');*/
                   setTimeout(function () {
                       fastdom.mutate(function () {
                           /*node.classList.remove('ng-enter');                          */
                           _this.component.attachedCallback();
                       });
                   }, 0);
               };
               /**
                * [unhook When a node is removed from dom]
                * @return {[type]} [description]
                */


               LifecycleHook.prototype.unhook = function unhook(node) {
                   console.log("removed", node);
                   this.component.detachedCallback();
                   this.component.unhook();
               };

               return LifecycleHook;
           }();

           var _Promise$1 = typeof Promise === 'undefined' ? require('es6-promise').Promise : Promise;

           var Lifecycle = function () {
               function Lifecycle() {
                   classCallCheck(this, Lifecycle);
               }

               Lifecycle.prototype.createdCallback = function createdCallback() {};

               Lifecycle.prototype.attachedCallback = function attachedCallback() {};

               Lifecycle.prototype.detachedCallback = function detachedCallback() {};

               Lifecycle.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
                   return true;
               };

               Lifecycle.prototype.componentDidUpdate = function componentDidUpdate() {};

               Lifecycle.prototype.unhook = function unhook() {
                   this.thunk = null;
                   if (this.unsubscribe) {
                       this.unsubscribe();
                   }
               };

               return Lifecycle;
           }();

           var API = function (_Lifecycle) {
               inherits(API, _Lifecycle);

               function API() {
                   classCallCheck(this, API);
                   return possibleConstructorReturn(this, _Lifecycle.apply(this, arguments));
               }

               API.prototype.setState = function setState(newState) {
                   var _this2 = this;

                   if (this.shouldComponentUpdate(this.props, newState)) {
                       this.state = newState;
                       this.renderSubTree().then(function () {
                           _this2.componentDidUpdate();
                       });
                   }
               };

               API.prototype.createStore = function createStore$$() {
                   var store = createStore(this.reducer, this.state, applyMiddleware(logger));
                   return store;
               };

               return API;
           }(Lifecycle);

           var Specs = function (_API) {
               inherits(Specs, _API);

               function Specs() {
                   classCallCheck(this, Specs);
                   return possibleConstructorReturn(this, _API.apply(this, arguments));
               }

               Specs.prototype.reducer = function reducer() {
                   var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                   var action = arguments[1];

                   throw "Define reducer for the store";
               };

               Specs.prototype.getName = function getName() {
                   throw "Define getName function which returns string";
               };

               Specs.prototype.render = function render() {
                   throw "Define render function which returns VNode";
               };

               Specs.prototype.getInitialState = function getInitialState() {
                   return null;
               };

               return Specs;
           }(API);

           var VirtualComponent = function (_Specs) {
               inherits(VirtualComponent, _Specs);

               function VirtualComponent() {
                   classCallCheck(this, VirtualComponent);

                   var _this4 = possibleConstructorReturn(this, _Specs.apply(this, arguments));

                   _this4.node = null;

                   _this4.props = {
                       hook: new LifecycleHook(_this4)
                   };

                   _this4.state = _this4.getInitialState();
                   if (_this4.state) {
                       _this4.store = _this4.createStore();
                       _this4.unsubscribe = _this4.store.subscribe(function () {
                           _this4.setState(_this4.store.getState());
                       });
                   } else {
                       _this4.store = null;
                   }
                   return _this4;
               }

               VirtualComponent.prototype.renderSubTree = function renderSubTree() {
                   var _this5 = this;

                   return new _Promise$1(function (resolve, reject) {
                       fastdom.mutate(function () {
                           var subTree = _this5.render();
                           var patches = diff_1(_this5.vnode.children[0], subTree);
                           patch(_this5.node.firstChild, patches);
                           _this5.vnode.children[0] = subTree;
                           resolve();
                       });
                   });
               };

               return VirtualComponent;
           }(Specs);

           var bindActionCreators$1 = bindActionCreators;

           var connect = (function () {
               var mapStateToProps = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
               var actionCreator = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

               return function (componentClass) {
                   return function (_componentClass) {
                       inherits(_class, _componentClass);

                       function _class(args) {
                           classCallCheck(this, _class);

                           var _this = possibleConstructorReturn(this, _componentClass.apply(this, arguments));

                           _this.props = _extends$1({}, _this.props, bindActionCreators$1(actionCreator, args.store.dispatch));
                           return _this;
                       }

                       return _class;
                   }(componentClass);
               };
           })

           var action = {
               onSubmitSearchForm: function (form) {
                   return function (dispatch) {
                       return $.ajax("./tuples.php", { dataType: "json" }).then(function (data) {
                           dispatch({
                               type: "REPLACE_TUPLES",
                               tuples: data.tuples
                           });
                       });
                   };
               },
               onChangeData: function (name, value) {
                   return {
                       type: "CHANGE_DATA",
                       data: { name: name, value: value }
                   };
               }
           };

           var SearchFrom = function (_VirtualComponent) {
               inherits(SearchFrom, _VirtualComponent);

               function SearchFrom() {
                   classCallCheck(this, SearchFrom);
                   return possibleConstructorReturn(this, _VirtualComponent.apply(this, arguments));
               }

               SearchFrom.prototype.getName = function getName() {
                   return "search-form";
               };

               SearchFrom.prototype.render = function render(_ref) {
                   var state = _ref.state;
                   var onChangeData = _ref.onChangeData;
                   var onSubmitSearchForm = _ref.onSubmitSearchForm;

                   //Search Form
                   return hyperScript(
                       "section",
                       { className: "pageC" },
                       hyperScript(
                           "form",
                           { id: "searchForm" },
                           hyperScript(
                               "label",
                               { "for": "kwd", className: "label" },
                               "Keywords"
                           ),
                           hyperScript(
                               "div",
                               { className: "suggest", id: "kwdsugg" },
                               hyperScript(
                                   "div",
                                   { className: "sWrap" },
                                   hyperScript(
                                       "div",
                                       { className: "iconWrap" },
                                       hyperScript("a", { className: "sCross" }),
                                       hyperScript("a", { className: "nLoder", style: { "display": "none" } })
                                   ),
                                   hyperScript(
                                       "div",
                                       { className: "inpWrap" },
                                       hyperScript("input", { name: "keywords", type: "search", id: "Sug_kwdsugg", sourceId: "5000", maxlength: "250", autocomplete: "off", className: "sugInp", value: state.keywords, maxl: "20", rel: "custom:4001", placeholder: "Enter Skills, Designation, Role" }),
                                       " "
                                   ),
                                   " ",
                                   hyperScript("i", { className: "erLbl", id: "kwd_err" }),
                                   " "
                               )
                           ),
                           hyperScript(
                               "label",
                               { "for": "location", className: "label" },
                               "Location"
                           ),
                           hyperScript(
                               "div",
                               { className: "suggest", id: "locsugg" },
                               hyperScript(
                                   "div",
                                   { className: "sWrap" },
                                   hyperScript(
                                       "div",
                                       { className: "iconWrap" },
                                       hyperScript("a", { className: "sCross" }),
                                       hyperScript("a", { className: "nLoder", style: { "display": "none" } })
                                   ),
                                   hyperScript(
                                       "div",
                                       { className: "inpWrap" },
                                       hyperScript("input", { name: "location", type: "text", className: "sugInp", maxlength: "250", autocomplete: "off", value: state.location, id: "Sug_locsugg", placeholder: "Enter the cities you want to work in", rel: "custom:4001,custom:4008" }),
                                       " "
                                   ),
                                   " ",
                                   hyperScript("i", { className: "erLbl", id: "Sug_locsugg_err", value: "" }),
                                   " "
                               )
                           ),
                           hyperScript("input", { id: "sbt", type: "submit", className: "btn btnSpc", value: "Search Jobs" })
                       )
                   );
               };

               SearchFrom.prototype.createdCallback = function createdCallback() {};

               SearchFrom.prototype.attachedCallback = function attachedCallback() {
                   var _this2 = this;

                   $(this.node).find("form").on('submit', function (event) {
                       event.preventDefault();
                       _this2.props.onSubmitSearchForm().then(function () {
                           page("/searchResult");
                       });
                   });

                   /*$(this.node).on("webkitTransitionEnd transitionend", (event) => {
                       console.log(event);
                       if (event.target.className == "ng-leave") {
                           this.props.store.dispatch({
                               type: "CHANGE_ROUTE_END"
                           })
                       }
                   });
                   */
                   $(this.node).find('input').on('change', function (event) {
                       _this2.props.onChangeData(event.target.name, event.target.value);
                   });
               };

               return SearchFrom;
           }(VirtualComponent);

           var SearchForm = connect(null, action)(SearchFrom);

           var action$1 = {
               onSaveJob: function (id) {
                   return {
                       type: "SAVE_TUPLE",
                       id: id
                   };
               },
               onLoadMore: function () {
                   return function (dispatch) {
                       return $.ajax("./tuples.php", { dataType: "json" }).then(function (data) {
                           dispatch({
                               type: "ADD_TUPLES",
                               tuples: data.tuples
                           });
                       });
                   };
               }
           };

           var JobTuple = function (_VirtualComponent) {
           				inherits(JobTuple, _VirtualComponent);

           				function JobTuple() {
           								classCallCheck(this, JobTuple);
           								return possibleConstructorReturn(this, _VirtualComponent.apply(this, arguments));
           				}

           				JobTuple.prototype.getName = function getName() {
           								return "job-tuple";
           				};

           				JobTuple.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
           								return this.props.state != nextProps.state;
           				};

           				JobTuple.prototype.render = function render(_ref) {
           								var state = _ref.state;
           								var onSaveJob = _ref.onSaveJob;
           								var index = _ref.index;

           								//Map tuples to HTML
           								var savedStatusClassName = state.isSaved ? "starIc fr bookmarkIcSel" : "starIc fr bookmarkIc";
           								var onClickSaveJob = function (event) {
           												onSaveJob(index);
           								};

           								return hyperScript(
           												"article",
           												null,
           												hyperScript("span", { className: "appHistIcPos" }),
           												hyperScript("a", { className: savedStatusClassName, href: "javascript:void(0);", onclick: onClickSaveJob }),
           												hyperScript(
           																"a",
           																{ href: "javascript:void(0);" },
           																hyperScript("em", { className: "nflIc" }),
           																hyperScript(
           																				"span",
           																				{ className: "title" },
           																				state.title
           																),
           																hyperScript(
           																				"span",
           																				{ className: "cName" },
           																				state.desc
           																),
           																hyperScript(
           																				"span",
           																				null,
           																				hyperScript("em", { className: "expIc fl" }),
           																				hyperScript(
           																								"b",
           																								null,
           																								state.experience,
           																								" Years"
           																				)
           																),
           																hyperScript(
           																				"span",
           																				null,
           																				hyperScript("em", { className: "locIc fl" }),
           																				hyperScript(
           																								"b",
           																								null,
           																								state.location
           																				)
           																),
           																hyperScript(
           																				"span",
           																				null,
           																				hyperScript("em", { className: "ksIc fl" }),
           																				hyperScript(
           																								"b",
           																								{ className: "ellipsis" },
           																								state.keySkills
           																				)
           																)
           												)
           								);
           				};

           				JobTuple.prototype.attachedCallback = function attachedCallback() {};

           				return JobTuple;
           }(VirtualComponent);

           var transition$1 = {
               duration: 400,
               enterClass: 'ng-enter',
               leaveClass: 'ng-leave'
           };

           var SearchResult$1 = function (_VirtualComponent) {
               inherits(SearchResult, _VirtualComponent);

               function SearchResult() {
                   classCallCheck(this, SearchResult);
                   return possibleConstructorReturn(this, _VirtualComponent.apply(this, arguments));
               }

               SearchResult.prototype.getName = function getName() {
                   return "search-result";
               };

               SearchResult.prototype.render = function render(_ref) {
                   var state = _ref.state;
                   var keywords = _ref.keywords;
                   var onSaveJob = _ref.onSaveJob;

                   //Map tuples to HTML
                   var tuplesTemplate = state.tuples.map(function (tuple, index) {
                       var state = tuple;
                       return hyperScript(JobTuple, { state: tuple, index: index, onSaveJob: onSaveJob, transition: transition$1 });
                       /*return <article> 
                               <span className="appHistIcPos"></span>
                               <a className="starIc fr bookmarkIc" href="javascript:void(0);" ></a>
                               <a href="javascript:void(0);"> 
                                       <em className="nflIc"></em> 
                                       <span className="title">
                                           {state.title}
                                       </span> 
                                       <span className="cName">{state.desc}</span> 
                                       <span>
                                           <em className="expIc fl"></em>
                                           <b>{state.experience} Years</b>
                                       </span> 
                                       <span>
                                           <em className="locIc fl"></em>
                                           <b>{state.location}</b>
                                       </span> 
                                       <span>
                                           <em className="ksIc fl"></em>
                                           <b className="ellipsis">{state.keySkills}</b>
                                       </span> 
                               </a>
                           </article>*/
                   });

                   //SRP head and Tuple container
                   return hyperScript(
                       "div",
                       null,
                       hyperScript(
                           "section",
                           { className: "srchHead" },
                           hyperScript(
                               "a",
                               { href: "javascript:void(0);", id: "modifyBtn", className: "btn inlineBtn fr greyBtn" },
                               "Modify"
                           ),
                           hyperScript(
                               "span",
                               { id: "showTxt" },
                               hyperScript(
                                   "h1",
                                   null,
                                   keywords
                               )
                           ),
                           hyperScript("div", { className: "cl" })
                       ),
                       hyperScript(
                           "section",
                           { id: "srchTpls", className: "listMenu linkList" },
                           tuplesTemplate,
                           hyperScript(
                               "a",
                               { id: "nextPage", key: "nextPage", href: "javascript:void(0);", className: "loadC oh loadFull" },
                               hyperScript("em", { "class": "loadIc" }),
                               "Load More Jobs"
                           )
                       )
                   );
               };

               SearchResult.prototype.createdCallback = function createdCallback() {};

               SearchResult.prototype.attachedCallback = function attachedCallback() {
                   var _this2 = this;

                   document.getElementById("nextPage").onclick = function () {
                       _this2.props.onLoadMore();
                   };
                   document.getElementById("modifyBtn").onclick = function (event) {
                       page("/searchForm");
                   };
                   /*        $(this.node).on("webkitTransitionEnd transitionend", (event)=>{
                               console.log(event);
                               if(event.target.className == "ng-leave"){
                                   this.props.store.dispatch({
                                       type : "CHANGE_ROUTE_END"
                                   })
                               }
                           });*/
               };

               return SearchResult;
           }(VirtualComponent);

           var SearchResult = connect(null, action$1)(SearchResult$1);

           var transition = {
               duration: 400,
               enterClass: 'ng-enter',
               leaveClass: 'ng-leave'
           };
           /**
            * Virtual Component
            * Defines route
            * Defines route handler
            * Initial Render 
            * Subcribe store for render
            */

           var SearchFlow = function (_VirtualComponent) {
               inherits(SearchFlow, _VirtualComponent);

               function SearchFlow() {
                   classCallCheck(this, SearchFlow);
                   return possibleConstructorReturn(this, _VirtualComponent.apply(this, arguments));
               }

               SearchFlow.prototype.getName = function getName() {
                   return "search-flow";
               };

               SearchFlow.prototype.render = function render(_ref) {
                   var route = _ref.route;
                   var searchForm = _ref.searchForm;
                   var searchResult = _ref.searchResult;
                   var store = _ref.store;

                   var page = route.map(function (value, index) {

                       if (value.route == "/searchForm") {
                           return hyperScript(SearchForm, { key: "1", state: searchForm, store: store, transition: transition });
                       }
                       if (value.route == "/searchResult") {
                           return hyperScript(SearchResult, _extends$1({ key: "2", state: searchResult }, searchForm, { store: store, transition: transition }));
                       }
                   });

                   return hyperScript(
                       "div",
                       null,
                       hyperScript(
                           "header",
                           { className: "mnj oh" },
                           hyperScript(
                               "div",
                               { className: "hbIcCont fl" },
                               hyperScript("a", { className: "hbIc posR", id: "dataIcon" })
                           ),
                           hyperScript(
                               "div",
                               { className: "mnjHd" },
                               hyperScript("a", { className: "logoIc", href: "http://www.naukri.com", alt: "Naukri.com, India's No.1 Job Site" })
                           )
                       ),
                       page
                   );
               };

               SearchFlow.prototype.createdCallback = function createdCallback() {};

               SearchFlow.prototype.detachCallback = function detachCallback() {
                   //store.unsubscribe();
               };

               return SearchFlow;
           }(VirtualComponent);

           var store = null;

           var Main = function () {
               /**
                * [Function hydrate
                * Get initialState from DB
                * Create store
                * Subscribe store for replication 
                * ]
                * @return {[Promise]} [Read DB]
                */

               Main.prototype.hydrate = function hydrate() {
                   var _this = this;

                   return localforage.getItem("newState").then(function (initialState) {
                       if (!initialState) {
                           initialState = {
                               route: [{
                                   route: "/searchForm"
                               }],
                               searchForm: {
                                   keywords: "",
                                   location: "",
                                   experience: ""
                               },
                               searchResult: {
                                   tuples: []
                               }
                           };
                       }
                       store = createStore(reducer, initialState, applyMiddleware(thunk, logger));
                       store.subscribe(function () {
                           _this.replicate(store.getState());
                       });
                   });
               };

               /**
                * [Function replicate
                * Replicate state to DB
                * ]
                * @param  {[type]} state [Store state]
                * @return {[Promise]}       [Write DB]
                */


               Main.prototype.replicate = function replicate(state) {
                   return localforage.setItem("newState", state);
               };

               Main.prototype.render = function render(state) {
                   return hyperScript(SearchFlow, _extends$1({}, state, { store: store }));
               };

               function Main() {
                   var _this2 = this;

                   classCallCheck(this, Main);

                   localforage.config(config.database);
                   this.hydrate().then(function () {

                       var batcher = batch(store.getState(), _this2.render);
                       document.body.appendChild(batcher.rootNode);

                       _this2.unsubscribe = store.subscribe(function () {
                           batcher.update(store.getState());
                       });

                       var routeHandler = function (path) {
                           if (path) {
                               /*store.dispatch({
                                   type: "CHANGE_ROUTE_START",
                                   route: path.match(/\/[^/]*$/)[0]
                               });                    */

                               store.dispatch({
                                   type: "CHANGE_ROUTE",
                                   route: path.match(/\/[^/]*$/)[0]
                               });
                           }
                       };
                       window.onpopstate = function (e) {
                           if (e.state) {
                               routeHandler(e.state.path);
                           }
                       };
                       page('*', function (e) {
                           routeHandler(e.path);
                       });
                   });
               }

               return Main;
           }();

           var index = new Main();

           return index;

}());
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"es6-promise":2}],2:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   3.3.1
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  return typeof x === 'function' || typeof x === 'object' && x !== null;
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (!Array.isArray) {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
} else {
  _isArray = Array.isArray;
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  return function () {
    vertxNext(flush);
  };
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = require;
    var vertx = r('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  _resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
  try {
    then.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        _resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      _reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      _reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    _reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return _resolve(promise, value);
    }, function (reason) {
      return _reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$) {
  if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$ === GET_THEN_ERROR) {
      _reject(promise, GET_THEN_ERROR.error);
    } else if (then$$ === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$)) {
      handleForeignThenable(promise, maybeThenable, then$$);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function _resolve(promise, value) {
  if (promise === value) {
    _reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function _reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      _reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      _resolve(promise, value);
    }, function rejectPromise(reason) {
      _reject(promise, reason);
    });
  } catch (e) {
    _reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this._input = input;
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate();
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    _reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
};

Enumerator.prototype._enumerate = function () {
  var length = this.length;
  var _input = this._input;

  for (var i = 0; this._state === PENDING && i < length; i++) {
    this._eachEntry(_input[i], i);
  }
};

Enumerator.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$ = c.resolve;

  if (resolve$$ === resolve) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$) {
        return resolve$$(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$(entry), i);
  }
};

Enumerator.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      _reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  _reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
  }
}

Promise.all = all;
Promise.race = race;
Promise.resolve = resolve;
Promise.reject = reject;
Promise._setScheduler = setScheduler;
Promise._setAsap = setAsap;
Promise._asap = asap;

Promise.prototype = {
  constructor: Promise,

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn't find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

function polyfill() {
    var local = undefined;

    if (typeof global !== 'undefined') {
        local = global;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise;
}

polyfill();
// Strange compat..
Promise.polyfill = polyfill;
Promise.Promise = Promise;

return Promise;

})));

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1]);

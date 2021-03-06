let { /*browserCookies,*/ localforage } = window.interfaces;
//Storage configration
var storageConfig = {
    //driver: localforage.WEBSQL;
    name: 'flowName',
    version: 1,
    //size: 4980736;
    storeName: 'flowNameStore',
    description: 'flow description'
};
let persistConfig = {
    storage: localforage,
    blacklist: [],
    keyPrefix: "reduxPersist_"
};
var authDependentApiRegexp;
var appVersion = "1";
let minifiedExtenstion;
console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV == "dev") {
    minifiedExtenstion = "";
    var staticFilesBasePath = "";
}

/* Define your environment specific config here e.g.
if (process.env.NODE_ENV == "stag") {
    var minifiedExtenstion = ".min";
    var staticFilesBasePath = "";
}
*/

export {
    storageConfig,
    persistConfig,
    appVersion,
    minifiedExtenstion,
    staticFilesBasePath,
    authDependentApiRegexp
};

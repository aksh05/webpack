var base;

if (process.env.NODE_ENV == "dev") {
    base = "//"+document.location.host+"/pwa";
} 


var config = {
    base,
    database: {
        //driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver()
        name: 'naukriDB1',
        version: 1.0,
        //size: 4980736, // Size of database, in bytes. WebSQL-only for now.
        storeName: 'naukriStore1', // Should be alphanumeric, with underscores.
        description: 'Some description'
    }
}


export default config;

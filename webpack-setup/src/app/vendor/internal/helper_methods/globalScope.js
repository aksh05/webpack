export function objectPath(path, obj) {
    if (path) {
        var obj = obj || window;
        return new Function('_', 'return _.' + path)(obj);
    }
}

export function checkIsAttribute(val) {
    return (val && val !== "undefined") ? val : "";
}

/**
 * [extraceObjectfromString -> This function check if value containing "dot" then split out and extract data form it by using ObjectPath function]
 * @param  {[type]} value [HTML nodeAttribute value]
 * @return {[type]}       [String]
 */
function extraceObjectfromString(value){
    return (value.split('.').length > 1) ? objectPath(value) : value;
}

/**
 * [constructAttributeObject description]
 * @param  {[type]}    obj                        [HTML node attribute Object]
 * @param  {Boolean}   isDataExtractionFromString [This flag true means that ObjectExtraction required form string e.g Object.key1.key2.key3]
 * @param  {...[type]} parseObjects               [list of node attributes having values typeof object ]
 * @return {[type]}                               [Object]
 */
export function constructAttributeObject(obj, isDataExtractionFromString, ...parseObjects) {
    var newObj = {};
    for (var x in obj) {
        obj[x].value = obj[x].value.replace(/^[.\s]+|[.\s]+$/g,'');
        if(parseObjects.indexOf(obj[x].name) !== -1){
            newObj[obj[x].name] =  JSON.parse(obj[x].value);
        }else{
            newObj[obj[x].name] = isDataExtractionFromString ? extraceObjectfromString(obj[x].value) : obj[x].value;
            //(obj[x].value.split('.').length > 1) ? objectPath(obj[x].value) : obj[x].value;
        }
    }
    return newObj;
}

export function toBoolean(str) {
    return (/^true$/gi).test(str) || ((/^false$/gi).test(str) ? false : str);
}

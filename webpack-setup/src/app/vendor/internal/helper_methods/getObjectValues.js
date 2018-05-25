export function getObjectValues(obj) {
    var newObj = [];
    for (let x in obj) {
        newObj.push(obj[x]);
    }
    return newObj;
}

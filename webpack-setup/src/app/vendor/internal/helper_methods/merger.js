function toBoolen(str) {
    return (/^true$/gi).test(str) || ((/^false$/gi).test(str) ? false : str);
}

export var merger = function(defaultParams, userDefinedParams) {
    for (var x in defaultParams) {
        let t = false;
        let lowerCase = x.toLowerCase();
        if (userDefinedParams[lowerCase]) {
            t = lowerCase;
        } else if (userDefinedParams[x] !== undefined && userDefinedParams[x] !== null) {
            t = x;
        }
        if (t) defaultParams[x] = toBoolen(userDefinedParams[t]);
    }
    return defaultParams;
};

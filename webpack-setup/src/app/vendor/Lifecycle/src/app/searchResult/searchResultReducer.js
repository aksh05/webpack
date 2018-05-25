const searchResult = (state, action) => {
    switch (action.type) {
        case "ADD_TUPLES":
            return state.tuples.concat(action.tuples);
        case "REPLACE_TUPLES":
            return action.tuples;
        case "SAVE_TUPLE":
            return state.tuples.map(function(tuple, index) {
                if (index != action.id) {
                    return tuple;
                }
                return {...tuple, isSaved: !tuple.isSaved }
            })
    }
}

const reducer = (state = {
    tuples: []
}, action) => {
    switch (action.type) {
        case "ADD_TUPLES":
        case "REPLACE_TUPLES":
        case "SAVE_TUPLE":
            return {...state, "tuples": searchResult(state, action) };
        default:
            return state;
    }
}

export default reducer;

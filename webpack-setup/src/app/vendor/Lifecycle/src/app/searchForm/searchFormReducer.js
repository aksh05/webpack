const searchForm = (state, action) => {
    switch (action.type) {
        case "CHANGE_DATA":
            let searchForm = {};
            searchForm[action.data.name] = action.data.value;
            return {...state, ...searchForm };
    }
}



const reducer = (state = {
    keywords: "",
    location: "",
    experience: ""
}, action) => {
    switch (action.type) {
        case "CHANGE_DATA":
            return searchForm(state, action);
        default:
            return state;
    }
}

export default reducer;

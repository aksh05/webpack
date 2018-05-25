import * as redux from "redux";
import searchForm from "./searchForm.js";
import searchResult from "./searchResult.js";
import route from "./route.js";
const reducer = redux.combineReducers({
    route,
    searchForm,
    searchResult

});
export default reducer;

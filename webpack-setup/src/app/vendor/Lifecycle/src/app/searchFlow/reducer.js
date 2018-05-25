import {combineReducers} from "redux";
import searchForm from "../searchForm/searchFormReducer.js";
import searchResult from "../searchResult/searchResultReducer.js";
import route from "./routeReducer.js";

const reducer = combineReducers({
    route,
    searchForm,
    searchResult
});
export default reducer;

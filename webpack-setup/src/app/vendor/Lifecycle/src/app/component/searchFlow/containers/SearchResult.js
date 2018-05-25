import connect from "../../../../jass/redux/connect.js"
import actionCreator from "../actions/searchResult.js";
import Component from "../component/SearchResult.js";

export default connect(null,actionCreator)(Component)
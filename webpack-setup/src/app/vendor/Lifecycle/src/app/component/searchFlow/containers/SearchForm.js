import connect from "../../../../jass/redux/connect.js"
import actionCreator from "../actions/searchForm.js";
import Component from "../component/SearchForm.js";

export default connect(null,actionCreator)(Component)


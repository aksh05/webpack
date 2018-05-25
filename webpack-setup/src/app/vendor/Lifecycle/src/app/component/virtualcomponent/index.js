import Virtual from "../../../jass/react/Virtual.js";
import ReactDom from "react-dom";
import TupleList from "./TupleList.js"

let newElement = document.createElement("div");
document.body.appendChild(newElement);
ReactDom.render(<TupleList />, newElement);

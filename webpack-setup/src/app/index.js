let { VirtualDom ,  Virtual} = window.interfaces;
import RootComponent from "./root/RootComponent.js";
// import './../../webpack/webfont.font.js';

VirtualDom.render(<RootComponent/>, document.getElementById("root"));

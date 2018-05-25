import "./material/index.js";
import Waves from "./material/custom/waves.js";
import Lifecycle from "./../../interfaces/external.js";

$(document).ready(function() {
    Waves.init();
});

window.interfaces = Lifecycle;

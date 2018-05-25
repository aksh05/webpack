webpackJsonp([2],{

/***/ 138:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__FlowContainer_js__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__reducer_js__ = __webpack_require__(148);



/* harmony default export */ __webpack_exports__["default"] = ({ FlowContainer: __WEBPACK_IMPORTED_MODULE_0__FlowContainer_js__["a" /* default */], reducer: __WEBPACK_IMPORTED_MODULE_1__reducer_js__ });
// let { Virtual ,page} = window.interfaces;

// class About extends Virtual.PureComponent {
//     constructor() {
//         super(...arguments);
//     }

//     onClick() {
//         page('/contact');
//     }

//     render() {
//         return <div>
//             <p>this is an about page</p>
//             <a href="javascript:;" onClick={::this.onClick}>Move to contact page</a>
//         </div>
//     }
// }

// class Contact extends Virtual.PureComponent {
//     constructor() {
//         super(...arguments);
//     }

//     onClick() {
//         page('/about');
//     }

//     render() {
//         return <div>
//             <p>this is an contact page</p>
//             <a href="javascript:;" onClick={::this.onClick}>Move to about page</a>
//         </div>
//     }
// }


// export { FlowContainer, reducer, About, Contact };

/***/ }),

/***/ 145:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Flow_js__ = __webpack_require__(146);
// Your first container...
var connect = window.interfaces.connect;



var mapStateToProps = function mapStateToProps(state, ownProps) {
    return {
        route: state.route
    };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
    return {};
};

/* harmony default export */ __webpack_exports__["a"] = (connect(mapStateToProps, mapDispatchToProps)(__WEBPACK_IMPORTED_MODULE_0__Flow_js__["a" /* default */]));

/***/ }),

/***/ 146:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_sass_flowName_scss__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_sass_flowName_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__src_sass_flowName_scss__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Your first component...
var Virtual = window.interfaces.Virtual;


// import { TRACKING } from "../root/require/constants.js";

var Flow = function (_Virtual$PureComponen) {
    _inherits(Flow, _Virtual$PureComponen);

    function Flow() {
        _classCallCheck(this, Flow);

        return _possibleConstructorReturn(this, (Flow.__proto__ || Object.getPrototypeOf(Flow)).apply(this, arguments));
    }

    _createClass(Flow, [{
        key: 'attachedCallback',
        value: function attachedCallback() {
            var _this2 = this;

            try {
                // tracking with newMonk & GA
                __webpack_require__.e/* import() */(0).then(__webpack_require__.bind(null, 39)).then(function (resp) {
                    resp.trackNewMonkAndGA(_this2.props.route);
                }).catch(function (error) {
                    return 'An error occurred while loading the component';
                });

                // requirejs(TRACKING, ({ trackNewMonkAndGA }) => {
                //     trackNewMonkAndGA(this.props.route);
                // });
            } catch (e) {
                console.warn(e);
            }
        }
    }, {
        key: 'detachedCallback',
        value: function detachedCallback() {}
    }, {
        key: 'render',
        value: function render() {
            return Virtual.createElement(
                'div',
                null,
                Virtual.createElement(
                    'h4',
                    null,
                    'Dynamically imported using webpack import'
                ),
                Virtual.createElement(
                    'p',
                    null,
                    'Write your first component here...'
                )
            );
        }
    }]);

    return Flow;
}(Virtual.PureComponent);

/* harmony default export */ __webpack_exports__["a"] = (Flow);

/***/ }),

/***/ 147:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 148:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stateName", function() { return stateName; });
// Define your app reducer here...

var stateName = function stateName() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    switch (action.type) {
        default:
            return state;
    }
};



/***/ })

});
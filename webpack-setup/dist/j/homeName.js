webpackJsonp([1],{

/***/ 139:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HomeContainer_js__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__reducer_js__ = __webpack_require__(152);



/* harmony default export */ __webpack_exports__["default"] = ({ HomeContainer: __WEBPACK_IMPORTED_MODULE_0__HomeContainer_js__["a" /* default */], reducer: __WEBPACK_IMPORTED_MODULE_1__reducer_js__ });

/***/ }),

/***/ 149:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Home_js__ = __webpack_require__(150);
// Your first container...
var connect = window.interfaces.connect;



var mapStateToProps = function mapStateToProps(state, ownProps) {
    return {
        route: state.route
    };
};
/*
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
          
    }
}*/

/* harmony default export */ __webpack_exports__["a"] = (connect(mapStateToProps, null)(__WEBPACK_IMPORTED_MODULE_0__Home_js__["a" /* default */]));

/***/ }),

/***/ 150:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sass_Home_scss__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sass_Home_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__sass_Home_scss__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Your first component...
var Virtual = window.interfaces.Virtual;



var Home = function (_Virtual$PureComponen) {
    _inherits(Home, _Virtual$PureComponen);

    function Home() {
        _classCallCheck(this, Home);

        return _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).apply(this, arguments));
    }

    _createClass(Home, [{
        key: 'render',
        value: function render() {
            return Virtual.createElement(
                'div',
                null,
                Virtual.createElement(
                    'p',
                    null,
                    'This is Home component'
                )
            );
        }
    }]);

    return Home;
}(Virtual.PureComponent);

/* harmony default export */ __webpack_exports__["a"] = (Home);

/***/ }),

/***/ 151:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 152:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Home", function() { return Home; });
// Define your app reducer here...

var Home = function Home() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    switch (action.type) {
        default:
            return state;
    }
};



/***/ })

});
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
(function () {
	'use strict';

	/**
	 * Logs all actions and states after they are dispatched.
	 */

	//For IE<=10 support
	console.group = console.group || console.log;
	console.groupEnd = console.groupEnd || console.log;

	var logger = function (store) {
	    return function (next) {
	        return function (action) {
	            console.group(action.type);
	            console.info('dispatching', action);
	            var result = next(action);
	            console.log('next state', store.getState());
	            console.groupEnd(action.type);
	            return result;
	        };
	    };
	};

	function createThunkMiddleware(extraArgument) {
	  return function (_ref) {
	    var dispatch = _ref.dispatch;
	    var getState = _ref.getState;
	    return function (next) {
	      return function (action) {
	        if (typeof action === 'function') {
	          return action(dispatch, getState, extraArgument);
	        }

	        return next(action);
	      };
	    };
	  };
	}

	var thunk = createThunkMiddleware();
	thunk.withExtraArgument = createThunkMiddleware;

	var ROUTE_SEARCHFORM = "/searchForm";
	var ROUTE_SEARCHRESULT = "/searchResult";
	var ROUTE_NOTFOUND = "/notFound";

	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

	var inherits = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};

	var possibleConstructorReturn = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && (typeof call === "object" || typeof call === "function") ? call : self;
	};

	var _window$interfaces$1 = window.interfaces;
	var Virtual$2 = _window$interfaces$1.Virtual;
	var page$1 = _window$interfaces$1.page;

	var SearchForm = function (_Virtual$Component) {
	    inherits(SearchForm, _Virtual$Component);

	    function SearchForm() {
	        classCallCheck(this, SearchForm);

	        var _this = possibleConstructorReturn(this, _Virtual$Component.apply(this, arguments));

	        _this.onChange = _this.onChange.bind(_this);
	        return _this;
	    }

	    SearchForm.prototype.render = function render() {
	        var _props = this.props;
	        var keywords = _props.keywords;
	        var location = _props.location;
	        var onChangeData = _props.onChangeData;
	        var onSubmitSearchForm = _props.onSubmitSearchForm;
	        //Search Form

	        return Virtual$2.createElement(
	            "section",
	            { className: "pageC" },
	            Virtual$2.createElement(
	                "form",
	                { id: "searchForm", ref: "searchForm" },
	                Virtual$2.createElement(
	                    "label",
	                    { htmlFor: "kwd", className: "label" },
	                    "Keywords"
	                ),
	                Virtual$2.createElement(
	                    "div",
	                    { className: "suggest", id: "kwdsugg" },
	                    Virtual$2.createElement(
	                        "div",
	                        { className: "sWrap" },
	                        Virtual$2.createElement(
	                            "div",
	                            { className: "iconWrap" },
	                            Virtual$2.createElement("a", { className: "sCross" }),
	                            Virtual$2.createElement("a", { className: "nLoder", style: { "display": "none" } })
	                        ),
	                        Virtual$2.createElement(
	                            "div",
	                            { className: "inpWrap" },
	                            Virtual$2.createElement("input", { value: keywords, onChange: this.onChange, name: "keywords", type: "search", id: "Sug_kwdsugg", ref: "keywords", maxLength: "250", autoComplete: "off", className: "sugInp", rel: "custom:4001", placeholder: "Enter Skills, Designation, Role" }),
	                            " "
	                        ),
	                        " ",
	                        Virtual$2.createElement("i", { className: "erLbl", id: "kwd_err" }),
	                        " "
	                    )
	                ),
	                Virtual$2.createElement(
	                    "label",
	                    { htmlFor: "location", className: "label" },
	                    "Location"
	                ),
	                Virtual$2.createElement(
	                    "div",
	                    { className: "suggest", id: "locsugg" },
	                    Virtual$2.createElement(
	                        "div",
	                        { className: "sWrap" },
	                        Virtual$2.createElement(
	                            "div",
	                            { className: "iconWrap" },
	                            Virtual$2.createElement("a", { className: "sCross" }),
	                            Virtual$2.createElement("a", { className: "nLoder", style: { "display": "none" } })
	                        ),
	                        Virtual$2.createElement(
	                            "div",
	                            { className: "inpWrap" },
	                            Virtual$2.createElement("input", { value: location, onChange: this.onChange, name: "location", type: "text", className: "sugInp", ref: "location", maxLength: "250", autoComplete: "off", id: "Sug_locsugg", placeholder: "Enter the cities you want to work in", rel: "custom:4001,custom:4008" }),
	                            " "
	                        ),
	                        " ",
	                        Virtual$2.createElement("i", { className: "erLbl", id: "Sug_locsugg_err", value: "" }),
	                        " "
	                    )
	                ),
	                Virtual$2.createElement("input", { id: "sbt", type: "submit", className: "btn btnSpc", value: "Search Jobs" })
	            )
	        );
	    };

	    SearchForm.prototype.onChange = function onChange(event) {
	        this.props.onChangeData(event.target.name, event.target.value);
	    };

	    SearchForm.prototype.createdCallback = function createdCallback() {};

	    SearchForm.prototype.attachedCallback = function attachedCallback() {
	        var _this2 = this;

	        $(this.refs.searchForm).on('submit', function (event) {
	            event.preventDefault();
	            _this2.props.onSubmitSearchForm();
	            page$1(ROUTE_SEARCHRESULT);
	        });
	    };

	    return SearchForm;
	}(Virtual$2.Component);

	var Virtual$4 = window.interfaces.Virtual;

	var JobTuple = function (_Virtual$Component) {
					inherits(JobTuple, _Virtual$Component);

					function JobTuple() {
									classCallCheck(this, JobTuple);
									return possibleConstructorReturn(this, _Virtual$Component.apply(this, arguments));
					}

					JobTuple.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
									return this.props.state != nextProps.state;
					};

					JobTuple.prototype.render = function render() {
									var _props = this.props;
									var state = _props.state;
									var onSaveJob = _props.onSaveJob;
									var index = _props.index;
									//Map tuples to HTML

									var savedStatusClassName = state.isSaved ? "starIc fr bookmarkIcSel" : "starIc fr bookmarkIc";
									var onClickSaveJob = function (event) {
													onSaveJob(index);
									};

									return Virtual$4.createElement(
													"article",
													null,
													Virtual$4.createElement("span", { className: "appHistIcPos" }),
													Virtual$4.createElement("a", { className: savedStatusClassName, href: "javascript:void(0);", onClick: onClickSaveJob }),
													Virtual$4.createElement(
																	"a",
																	{ href: "javascript:void(0);" },
																	Virtual$4.createElement("em", { className: "nflIc" }),
																	Virtual$4.createElement(
																					"span",
																					{ className: "title" },
																					state.title
																	),
																	Virtual$4.createElement(
																					"span",
																					{ className: "cName" },
																					state.desc
																	),
																	Virtual$4.createElement(
																					"span",
																					null,
																					Virtual$4.createElement("em", { className: "expIc fl" }),
																					Virtual$4.createElement(
																									"b",
																									null,
																									state.experience,
																									" Years"
																					)
																	),
																	Virtual$4.createElement(
																					"span",
																					null,
																					Virtual$4.createElement("em", { className: "locIc fl" }),
																					Virtual$4.createElement(
																									"b",
																									null,
																									state.location
																					)
																	),
																	Virtual$4.createElement(
																					"span",
																					null,
																					Virtual$4.createElement("em", { className: "ksIc fl" }),
																					Virtual$4.createElement(
																									"b",
																									{ className: "ellipsis" },
																									state.keySkills
																					)
																	)
													)
									);
					};

					return JobTuple;
	}(Virtual$4.Component);

	var _window$interfaces$2 = window.interfaces;
	var Virtual$3 = _window$interfaces$2.Virtual;
	var page$2 = _window$interfaces$2.page;

	var SearchResult = function (_Virtual$Component) {
	    inherits(SearchResult, _Virtual$Component);

	    function SearchResult(props) {
	        classCallCheck(this, SearchResult);
	        return possibleConstructorReturn(this, _Virtual$Component.call(this, props));
	    }

	    SearchResult.prototype.render = function render() {
	        var _props = this.props;
	        var state = _props.state;
	        var keywords = _props.keywords;
	        var onSaveJob = _props.onSaveJob;
	        //Map tuples to HTML

	        var tuplesTemplate = state.tuples.map(function (tuple, index) {
	            var state = tuple;
	            return Virtual$3.createElement(JobTuple, { key: index, state: tuple, index: index, onSaveJob: onSaveJob });
	        });

	        //SRP head and Tuple container
	        return Virtual$3.createElement(
	            "div",
	            null,
	            Virtual$3.createElement(
	                "section",
	                { className: "srchHead" },
	                Virtual$3.createElement(
	                    "a",
	                    { href: "javascript:void(0);", id: "modifyBtn", className: "btn inlineBtn fr greyBtn" },
	                    "Modify"
	                ),
	                Virtual$3.createElement(
	                    "span",
	                    { id: "showTxt" },
	                    Virtual$3.createElement(
	                        "h1",
	                        null,
	                        keywords
	                    )
	                ),
	                Virtual$3.createElement("div", { className: "cl" })
	            ),
	            Virtual$3.createElement(
	                "section",
	                { id: "srchTpls", className: "listMenu linkList" },
	                tuplesTemplate,
	                Virtual$3.createElement(
	                    "a",
	                    { id: "nextPage", key: "nextPage", href: "javascript:void(0);", className: "loadC oh loadFull" },
	                    Virtual$3.createElement("em", { className: "loadIc" }),
	                    "Load More Jobs"
	                )
	            )
	        );
	    };

	    SearchResult.prototype.attachedCallback = function attachedCallback() {
	        var _this2 = this;

	        document.getElementById("nextPage").onclick = function () {
	            _this2.props.onLoadMore();
	        };
	        document.getElementById("modifyBtn").onclick = function (event) {
	            page$2(ROUTE_SEARCHFORM);
	        };
	    };

	    return SearchResult;
	}(Virtual$3.Component);

	var getTuples = (function () {
	    return $.ajax("../app/tuples.json", { dataType: "json" });
	})

	var action = {
	    onSubmitSearchForm: function (form) {
	        return function (dispatch) {
	            return getTuples().then(function (data) {
	                dispatch({
	                    type: "REPLACE_TUPLES",
	                    tuples: data.tuples
	                });
	            });
	        };
	    },
	    onChangeData: function (name, value) {
	        return {
	            type: "CHANGE_DATA",
	            data: { name: name, value: value }
	        };
	    }
	};

	var action$1 = {
	    onSaveJob: function (id) {
	        return {
	            type: "SAVE_TUPLE",
	            id: id
	        };
	    },
	    onLoadMore: function () {
	        return function (dispatch) {
	            return getTuples().then(function (data) {
	                dispatch({
	                    type: "ADD_TUPLES",
	                    tuples: data.tuples
	                });
	            });
	        };
	    }
	};

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function (arg) {
	    return func(transform(arg));
	  };
	}

	/** Built-in value references. */
	var getPrototype = overArg(Object.getPrototypeOf, Object);

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for built-in method references. */
	var funcProto = Function.prototype;
	var objectProto = Object.prototype;
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
	}

	function symbolObservablePonyfill(root) {
		var result;
		var Symbol = root.Symbol;

		if (typeof Symbol === 'function') {
			if (Symbol.observable) {
				result = Symbol.observable;
			} else {
				result = Symbol('observable');
				Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}

		return result;
	};

	var root = undefined;
	if (typeof global !== 'undefined') {
		root = global;
	} else if (typeof window !== 'undefined') {
		root = window;
	}

	var result = symbolObservablePonyfill(root);

	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = {
	  INIT: '@@redux/INIT'
	};

	/**
	 * Prints a warning in the console if it exists.
	 *
	 * @param {String} message The warning message.
	 * @returns {void}
	 */
	function warning(message) {
	  /* eslint-disable no-console */
	  if (typeof console !== 'undefined' && typeof console.error === 'function') {
	    console.error(message);
	  }
	  /* eslint-enable no-console */
	  try {
	    // This error was thrown as a convenience so that if you enable
	    // "break on all exceptions" in your console,
	    // it would pause the execution at this line.
	    throw new Error(message);
	    /* eslint-disable no-empty */
	  } catch (e) {}
	  /* eslint-enable no-empty */
	}

	function getUndefinedStateErrorMessage(key, action) {
	  var actionType = action && action.type;
	  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

	  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
	}

	function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
	  var reducerKeys = Object.keys(reducers);
	  var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

	  if (reducerKeys.length === 0) {
	    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
	  }

	  if (!isPlainObject(inputState)) {
	    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
	  }

	  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
	    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
	  });

	  unexpectedKeys.forEach(function (key) {
	    unexpectedKeyCache[key] = true;
	  });

	  if (unexpectedKeys.length > 0) {
	    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
	  }
	}

	function assertReducerSanity(reducers) {
	  Object.keys(reducers).forEach(function (key) {
	    var reducer = reducers[key];
	    var initialState = reducer(undefined, { type: ActionTypes.INIT });

	    if (typeof initialState === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
	    }

	    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
	    if (typeof reducer(undefined, { type: type }) === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
	    }
	  });
	}

	/**
	 * Turns an object whose values are different reducer functions, into a single
	 * reducer function. It will call every child reducer, and gather their results
	 * into a single state object, whose keys correspond to the keys of the passed
	 * reducer functions.
	 *
	 * @param {Object} reducers An object whose values correspond to different
	 * reducer functions that need to be combined into one. One handy way to obtain
	 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
	 * undefined for any action. Instead, they should return their initial state
	 * if the state passed to them was undefined, and the current state for any
	 * unrecognized action.
	 *
	 * @returns {Function} A reducer function that invokes every reducer inside the
	 * passed object, and builds a state object with the same shape.
	 */
	function combineReducers(reducers) {
	  var reducerKeys = Object.keys(reducers);
	  var finalReducers = {};
	  for (var i = 0; i < reducerKeys.length; i++) {
	    var key = reducerKeys[i];

	    if ("dev" !== 'production') {
	      if (typeof reducers[key] === 'undefined') {
	        warning('No reducer provided for key "' + key + '"');
	      }
	    }

	    if (typeof reducers[key] === 'function') {
	      finalReducers[key] = reducers[key];
	    }
	  }
	  var finalReducerKeys = Object.keys(finalReducers);

	  if ("dev" !== 'production') {
	    var unexpectedKeyCache = {};
	  }

	  var sanityError;
	  try {
	    assertReducerSanity(finalReducers);
	  } catch (e) {
	    sanityError = e;
	  }

	  return function combination() {
	    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var action = arguments[1];

	    if (sanityError) {
	      throw sanityError;
	    }

	    if ("dev" !== 'production') {
	      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
	      if (warningMessage) {
	        warning(warningMessage);
	      }
	    }

	    var hasChanged = false;
	    var nextState = {};
	    for (var i = 0; i < finalReducerKeys.length; i++) {
	      var key = finalReducerKeys[i];
	      var reducer = finalReducers[key];
	      var previousStateForKey = state[key];
	      var nextStateForKey = reducer(previousStateForKey, action);
	      if (typeof nextStateForKey === 'undefined') {
	        var errorMessage = getUndefinedStateErrorMessage(key, action);
	        throw new Error(errorMessage);
	      }
	      nextState[key] = nextStateForKey;
	      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
	    }
	    return hasChanged ? nextState : state;
	  };
	}

	/*
	* This is a dummy function to check if the function name has been altered by minification.
	* If the function has been minified and NODE_ENV !== 'production', warn the user.
	*/
	function isCrushed() {}

	if ("dev" !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
	  warning('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
	}

	var searchForm = function (state, action) {
	    switch (action.type) {
	        case "CHANGE_DATA":
	            var _searchForm = {};
	            _searchForm[action.data.name] = action.data.value;
	            return _extends({}, state, _searchForm);
	    }
	};

	var reducer$1 = function () {
	    var state = arguments.length <= 0 || arguments[0] === undefined ? {
	        keywords: "",
	        location: "",
	        experience: ""
	    } : arguments[0];
	    var action = arguments[1];

	    switch (action.type) {
	        case "CHANGE_DATA":
	            return searchForm(state, action);
	        default:
	            return state;
	    }
	};

	var searchResult = function (state, action) {
	    switch (action.type) {
	        case "ADD_TUPLES":
	            return state.tuples.concat(action.tuples);
	        case "REPLACE_TUPLES":
	            return action.tuples;
	        case "SAVE_TUPLE":
	            return state.tuples.map(function (tuple, index) {
	                if (index != action.id) {
	                    return tuple;
	                }
	                return _extends({}, tuple, { isSaved: !tuple.isSaved });
	            });
	    }
	};

	var reducer$2 = function () {
	    var state = arguments.length <= 0 || arguments[0] === undefined ? {
	        tuples: []
	    } : arguments[0];
	    var action = arguments[1];

	    switch (action.type) {
	        case "ADD_TUPLES":
	        case "REPLACE_TUPLES":
	        case "SAVE_TUPLE":
	            return _extends({}, state, { "tuples": searchResult(state, action) });
	        default:
	            return state;
	    }
	};

	var reducer$3 = function () {
	    var state = arguments.length <= 0 || arguments[0] === undefined ? "/" : arguments[0];
	    var action = arguments[1];

	    var currentRoute = undefined;
	    switch (action.type) {
	        case "CHANGE_ROUTE":
	            return action.route;
	        default:
	            return state;
	    }
	};

	var reducer = combineReducers({
	    route: reducer$3,
	    searchForm: reducer$1,
	    searchResult: reducer$2
	});

	var actions = {
	    "searchForm": function () {
	        return {
	            type: "CHANGE_ROUTE",
	            route: ROUTE_SEARCHFORM
	        };
	    },
	    "searchResult": function (id) {
	        return {
	            type: "CHANGE_ROUTE",
	            route: ROUTE_SEARCHRESULT
	        };
	    },
	    "notFound": function () {
	        return {
	            type: "CHANGE_ROUTE",
	            route: ROUTE_NOTFOUND
	        };
	    }
	};

	var base;

	if ("dev" == "dev") {
	    base = "//" + document.location.host + "/pwa";
	}

	var config = {
	    base: base,
	    database: {
	        //driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver()
	        name: 'naukriDB1',
	        version: 1.0,
	        //size: 4980736, // Size of database, in bytes. WebSQL-only for now.
	        storeName: 'naukriStore1', // Should be alphanumeric, with underscores.
	        description: 'Some description'
	    }
	};

	var page$3 = window.interfaces.page;

	var routesConfig = (function (boundedActions) {
	    //Configuration
	    page$3.start({
	        popstate: true
	    });

	    page$3.base(config.base);

	    page$3('/', function () {
	        page$3.redirect(ROUTE_SEARCHFORM);
	    });
	    page$3(ROUTE_SEARCHFORM, function () {
	        boundedActions.searchForm();
	    });
	    page$3(ROUTE_SEARCHRESULT, function () {
	        boundedActions.searchResult();
	    });

	    page$3('*', function () {
	        boundedActions.notFound();
	    });
	})

	var localforage = window.interfaces.localforage;


	var hydrate = function () {
	    localforage.config(config.database);
	    /**
	     * [Function hydrate
	     * Get initialState from DB
	     * Create store
	     * Subscribe store for replication 
	     * ]
	     * @return {[Promise]} [Read DB]
	     */
	    return localforage.getItem("newState").then(function (initialState) {
	        return initialState || {};
	    });
	};
	var replicate = function (state) {
	    /**
	     * [Function replicate
	     * Replicate state to DB
	     * ]
	     * @param  {[type]} state [Store state]
	     * @return {[Promise]}       [Write DB]
	     */
	    if (state.route == "/notFound") {
	        state.route == "/";
	    }
	    return localforage.setItem("newState", state);
	};

	var _window$interfaces = window.interfaces;
	var Virtual$1 = _window$interfaces.Virtual;
	var page = _window$interfaces.page;
	var Redux = _window$interfaces.Redux;
	var VirtualCSSTransitionGroup = _window$interfaces.VirtualCSSTransitionGroup;
	var bindActionCreators = Redux.bindActionCreators;
	var applyMiddleware = Redux.applyMiddleware;


	/**
	 * Virtual Component
	 * Defines route
	 * Defines route handler
	 * Initial Render 
	 * Subcribe store for render
	 */

	var SearchFlow = function (_Virtual$Component) {
	    inherits(SearchFlow, _Virtual$Component);

	    function SearchFlow() {
	        classCallCheck(this, SearchFlow);


	        //Hydrate store

	        var _this = possibleConstructorReturn(this, _Virtual$Component.apply(this, arguments));

	        hydrate().then(function (initialState) {

	            //Creating flux store for the state       
	            _this.store = Redux.createStore(reducer, initialState, applyMiddleware(logger, thunk));
	            //Configuring Routes
	            routesConfig(bindActionCreators(actions, _this.store.dispatch));

	            //Subscribe store for render
	            _this.store.subscribe(function () {
	                _this.setState(_this.store.getState());
	            });

	            //Subscribe store for replication
	            _this.store.subscribe(function () {
	                replicate(_this.store.getState());
	            });

	            _this.boundedActionCreator = {
	                "searchForm": bindActionCreators(action, _this.store.dispatch),
	                "searchResult": bindActionCreators(action$1, _this.store.dispatch)
	            };

	            var path = document.location.pathname.match(/.*\/pwa(.*)/);
	            page(path[path.length - 1]);
	        });
	        return _this;
	    }

	    SearchFlow.prototype.render = function render() {
	        var page = null;
	        if (this.state) {
	            var _state = this.state;
	            var route = _state.route;
	            var searchForm = _state.searchForm;
	            var searchResult = _state.searchResult;


	            if (route == ROUTE_SEARCHFORM) {
	                page = Virtual$1.createElement(SearchForm, _extends({ key: "searchForm" }, searchForm, this.boundedActionCreator.searchForm));
	            }
	            if (route == ROUTE_SEARCHRESULT) {
	                page = Virtual$1.createElement(SearchResult, _extends({ key: "searchResult", state: searchResult }, searchForm, this.boundedActionCreator.searchResult));
	            }
	            if (route == ROUTE_NOTFOUND) {
	                page = Virtual$1.createElement(
	                    "div",
	                    { key: "notFound" },
	                    "\"Not found\""
	                );
	            }

	            return Virtual$1.createElement(
	                "div",
	                null,
	                Virtual$1.createElement(
	                    "header",
	                    { className: "mnj oh" },
	                    Virtual$1.createElement(
	                        "div",
	                        { className: "hbIcCont fl" },
	                        Virtual$1.createElement("a", { className: "hbIc posR", id: "dataIcon" })
	                    ),
	                    Virtual$1.createElement(
	                        "div",
	                        { className: "mnjHd" },
	                        Virtual$1.createElement("a", { className: "logoIc", href: "http://www.naukri.com", alt: "Naukri.com, India's No.1 Job Site" })
	                    )
	                ),
	                Virtual$1.createElement(
	                    VirtualCSSTransitionGroup,
	                    { transitionName: "route", transitionEnterTimeout: 500, transitionLeaveTimeout: 300 },
	                    page
	                )
	            );
	        }
	        return page;
	    };

	    return SearchFlow;
	}(Virtual$1.Component);

	var Virtual = window.interfaces.Virtual;

	var VirtualDom = window.interfaces.VirtualDom;

	VirtualDom.render(Virtual.createElement(SearchFlow, null), document.getElementById("root"));

}());
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);

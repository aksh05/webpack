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
	            console.group(action.type || action.name);
	            console.info('dispatching', action);
	            var result = next(action);
	            console.log('next state', store.getState());
	            console.groupEnd(action.type);
	            return result;
	        };
	    };
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
	  return function(arg) {
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
	  if (!isObjectLike(value) ||
	      objectToString.call(value) != objectTag || isHostObject(value)) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return (typeof Ctor == 'function' &&
	    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
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
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [preloadedState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @param {Function} enhancer The store enhancer. You may optionally specify it
	 * to enhance the store with third-party capabilities such as middleware,
	 * time travel, persistence, etc. The only store enhancer that ships with Redux
	 * is `applyMiddleware()`.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */
	function createStore(reducer, preloadedState, enhancer) {
	  var _ref2;

	  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
	    enhancer = preloadedState;
	    preloadedState = undefined;
	  }

	  if (typeof enhancer !== 'undefined') {
	    if (typeof enhancer !== 'function') {
	      throw new Error('Expected the enhancer to be a function.');
	    }

	    return enhancer(createStore)(reducer, preloadedState);
	  }

	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }

	  var currentReducer = reducer;
	  var currentState = preloadedState;
	  var currentListeners = [];
	  var nextListeners = currentListeners;
	  var isDispatching = false;

	  function ensureCanMutateNextListeners() {
	    if (nextListeners === currentListeners) {
	      nextListeners = currentListeners.slice();
	    }
	  }

	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */
	  function getState() {
	    return currentState;
	  }

	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * You may call `dispatch()` from a change listener, with the following
	   * caveats:
	   *
	   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
	   * If you subscribe or unsubscribe while the listeners are being invoked, this
	   * will not have any effect on the `dispatch()` that is currently in progress.
	   * However, the next `dispatch()` call, whether nested or not, will use a more
	   * recent snapshot of the subscription list.
	   *
	   * 2. The listener should not expect to see all state changes, as the state
	   * might have been updated multiple times during a nested `dispatch()` before
	   * the listener is called. It is, however, guaranteed that all subscribers
	   * registered before the `dispatch()` started will be called with the latest
	   * state by the time it exits.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('Expected listener to be a function.');
	    }

	    var isSubscribed = true;

	    ensureCanMutateNextListeners();
	    nextListeners.push(listener);

	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }

	      isSubscribed = false;

	      ensureCanMutateNextListeners();
	      var index = nextListeners.indexOf(listener);
	      nextListeners.splice(index, 1);
	    };
	  }

	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */
	  function dispatch(action) {
	    if (!isPlainObject(action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }

	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }

	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }

	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }

	    var listeners = currentListeners = nextListeners;
	    for (var i = 0; i < listeners.length; i++) {
	      listeners[i]();
	    }

	    return action;
	  }

	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */
	  function replaceReducer(nextReducer) {
	    if (typeof nextReducer !== 'function') {
	      throw new Error('Expected the nextReducer to be a function.');
	    }

	    currentReducer = nextReducer;
	    dispatch({ type: ActionTypes.INIT });
	  }

	  /**
	   * Interoperability point for observable/reactive libraries.
	   * @returns {observable} A minimal observable of state changes.
	   * For more information, see the observable proposal:
	   * https://github.com/zenparsing/es-observable
	   */
	  function observable() {
	    var _ref;

	    var outerSubscribe = subscribe;
	    return _ref = {
	      /**
	       * The minimal observable subscription method.
	       * @param {Object} observer Any object that can be used as an observer.
	       * The observer object should have a `next` method.
	       * @returns {subscription} An object with an `unsubscribe` method that can
	       * be used to unsubscribe the observable from the store, and prevent further
	       * emission of values from the observable.
	       */
	      subscribe: function subscribe(observer) {
	        if (typeof observer !== 'object') {
	          throw new TypeError('Expected the observer to be an object.');
	        }

	        function observeState() {
	          if (observer.next) {
	            observer.next(getState());
	          }
	        }

	        observeState();
	        var unsubscribe = outerSubscribe(observeState);
	        return { unsubscribe: unsubscribe };
	      }
	    }, _ref[result] = function () {
	      return this;
	    }, _ref;
	  }

	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });

	  return _ref2 = {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  }, _ref2[result] = observable, _ref2;
	}

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

	/**
	 * Composes single-argument functions from right to left. The rightmost
	 * function can take multiple arguments as it provides the signature for
	 * the resulting composite function.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing the argument functions
	 * from right to left. For example, compose(f, g, h) is identical to doing
	 * (...args) => f(g(h(...args))).
	 */

	function compose() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }

	  if (funcs.length === 0) {
	    return function (arg) {
	      return arg;
	    };
	  }

	  if (funcs.length === 1) {
	    return funcs[0];
	  }

	  var last = funcs[funcs.length - 1];
	  var rest = funcs.slice(0, -1);
	  return function () {
	    return rest.reduceRight(function (composed, f) {
	      return f(composed);
	    }, last.apply(undefined, arguments));
	  };
	}

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	/**
	 * Creates a store enhancer that applies middleware to the dispatch method
	 * of the Redux store. This is handy for a variety of tasks, such as expressing
	 * asynchronous actions in a concise manner, or logging every action payload.
	 *
	 * See `redux-thunk` package as an example of the Redux middleware.
	 *
	 * Because middleware is potentially asynchronous, this should be the first
	 * store enhancer in the composition chain.
	 *
	 * Note that each middleware will be given the `dispatch` and `getState` functions
	 * as named arguments.
	 *
	 * @param {...Function} middlewares The middleware chain to be applied.
	 * @returns {Function} A store enhancer applying the middleware.
	 */
	function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }

	  return function (createStore) {
	    return function (reducer, preloadedState, enhancer) {
	      var store = createStore(reducer, preloadedState, enhancer);
	      var _dispatch = store.dispatch;
	      var chain = [];

	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch(action) {
	          return _dispatch(action);
	        }
	      };
	      chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = compose.apply(undefined, chain)(store.dispatch);

	      return _extends({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}

	/*
	* This is a dummy function to check if the function name has been altered by minification.
	* If the function has been minified and NODE_ENV !== 'production', warn the user.
	*/
	function isCrushed() {}

	if ("development" !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
	  warning('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
	}

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var slice = Array.prototype.slice

	var __moduleExports$4 = iterativelyWalk

	function iterativelyWalk(nodes, cb) {
	    if (!('length' in nodes)) {
	        nodes = [nodes]
	    }
	    
	    nodes = slice.call(nodes)

	    while(nodes.length) {
	        var node = nodes.shift(),
	            ret = cb(node)

	        if (ret) {
	            return ret
	        }

	        if (node.childNodes && node.childNodes.length) {
	            nodes = slice.call(node.childNodes).concat(nodes)
	        }
	    }
	}

	var __moduleExports$5 = Comment$1

	function Comment$1(data, owner) {
	    if (!(this instanceof Comment$1)) {
	        return new Comment$1(data, owner)
	    }

	    this.data = data
	    this.nodeValue = data
	    this.length = data.length
	    this.ownerDocument = owner || null
	}

	Comment$1.prototype.nodeType = 8
	Comment$1.prototype.nodeName = "#comment"

	Comment$1.prototype.toString = function _Comment_toString() {
	    return "[object Comment]"
	}

	var __moduleExports$6 = DOMText$1

	function DOMText$1(value, owner) {
	    if (!(this instanceof DOMText$1)) {
	        return new DOMText$1(value)
	    }

	    this.data = value || ""
	    this.length = this.data.length
	    this.ownerDocument = owner || null
	}

	DOMText$1.prototype.type = "DOMTextNode"
	DOMText$1.prototype.nodeType = 3
	DOMText$1.prototype.nodeName = "#text"

	DOMText$1.prototype.toString = function _Text_toString() {
	    return this.data
	}

	DOMText$1.prototype.replaceData = function replaceData(index, length, value) {
	    var current = this.data
	    var left = current.substring(0, index)
	    var right = current.substring(index + length, current.length)
	    this.data = left + value + right
	    this.length = this.data.length
	}

	var __moduleExports$8 = dispatchEvent$2

	function dispatchEvent$2(ev) {
	    var elem = this
	    var type = ev.type

	    if (!ev.target) {
	        ev.target = elem
	    }

	    if (!elem.listeners) {
	        elem.listeners = {}
	    }

	    var listeners = elem.listeners[type]

	    if (listeners) {
	        return listeners.forEach(function (listener) {
	            ev.currentTarget = elem
	            if (typeof listener === 'function') {
	                listener(ev)
	            } else {
	                listener.handleEvent(ev)
	            }
	        })
	    }

	    if (elem.parentNode) {
	        elem.parentNode.dispatchEvent(ev)
	    }
	}

	var __moduleExports$9 = addEventListener$2

	function addEventListener$2(type, listener) {
	    var elem = this

	    if (!elem.listeners) {
	        elem.listeners = {}
	    }

	    if (!elem.listeners[type]) {
	        elem.listeners[type] = []
	    }

	    if (elem.listeners[type].indexOf(listener) === -1) {
	        elem.listeners[type].push(listener)
	    }
	}

	var __moduleExports$10 = removeEventListener$2

	function removeEventListener$2(type, listener) {
	    var elem = this

	    if (!elem.listeners) {
	        return
	    }

	    if (!elem.listeners[type]) {
	        return
	    }

	    var list = elem.listeners[type]
	    var index = list.indexOf(listener)
	    if (index !== -1) {
	        list.splice(index, 1)
	    }
	}

	var __moduleExports$11 = serializeNode$1

	var voidElements = ["area","base","br","col","embed","hr","img","input","keygen","link","menuitem","meta","param","source","track","wbr"];

	function serializeNode$1(node) {
	    switch (node.nodeType) {
	        case 3:
	            return escapeText(node.data)
	        case 8:
	            return "<!--" + node.data + "-->"
	        default:
	            return serializeElement(node)
	    }
	}

	function serializeElement(elem) {
	    var strings = []

	    var tagname = elem.tagName

	    if (elem.namespaceURI === "http://www.w3.org/1999/xhtml") {
	        tagname = tagname.toLowerCase()
	    }

	    strings.push("<" + tagname + properties(elem) + datasetify(elem))

	    if (voidElements.indexOf(tagname) > -1) {
	        strings.push(" />")
	    } else {
	        strings.push(">")

	        if (elem.childNodes.length) {
	            strings.push.apply(strings, elem.childNodes.map(serializeNode$1))
	        } else if (elem.textContent || elem.innerText) {
	            strings.push(escapeText(elem.textContent || elem.innerText))
	        } else if (elem.innerHTML) {
	            strings.push(elem.innerHTML)
	        }

	        strings.push("</" + tagname + ">")
	    }

	    return strings.join("")
	}

	function isProperty(elem, key) {
	    var type = typeof elem[key]

	    if (key === "style" && Object.keys(elem.style).length > 0) {
	      return true
	    }

	    return elem.hasOwnProperty(key) &&
	        (type === "string" || type === "boolean" || type === "number") &&
	        key !== "nodeName" && key !== "className" && key !== "tagName" &&
	        key !== "textContent" && key !== "innerText" && key !== "namespaceURI" &&  key !== "innerHTML"
	}

	function stylify(styles) {
	    if (typeof styles === 'string') return styles
	    var attr = ""
	    Object.keys(styles).forEach(function (key) {
	        var value = styles[key]
	        key = key.replace(/[A-Z]/g, function(c) {
	            return "-" + c.toLowerCase();
	        })
	        attr += key + ":" + value + ";"
	    })
	    return attr
	}

	function datasetify(elem) {
	    var ds = elem.dataset
	    var props = []

	    for (var key in ds) {
	        props.push({ name: "data-" + key, value: ds[key] })
	    }

	    return props.length ? stringify(props) : ""
	}

	function stringify(list) {
	    var attributes = []
	    list.forEach(function (tuple) {
	        var name = tuple.name
	        var value = tuple.value

	        if (name === "style") {
	            value = stylify(value)
	        }

	        attributes.push(name + "=" + "\"" + escapeAttributeValue(value) + "\"")
	    })

	    return attributes.length ? " " + attributes.join(" ") : ""
	}

	function properties(elem) {
	    var props = []
	    for (var key in elem) {
	        if (isProperty(elem, key)) {
	            props.push({ name: key, value: elem[key] })
	        }
	    }

	    for (var ns in elem._attributes) {
	      for (var attribute in elem._attributes[ns]) {
	        var prop = elem._attributes[ns][attribute]
	        var name = (prop.prefix ? prop.prefix + ":" : "") + attribute
	        props.push({ name: name, value: prop.value })
	      }
	    }

	    if (elem.className) {
	        props.push({ name: "class", value: elem.className })
	    }

	    return props.length ? stringify(props) : ""
	}

	function escapeText(s) {
	    var str = '';

	    if (typeof(s) === 'string') { 
	        str = s; 
	    } else if (s) {
	        str = s.toString();
	    }

	    return str
	        .replace(/&/g, "&amp;")
	        .replace(/</g, "&lt;")
	        .replace(/>/g, "&gt;")
	}

	function escapeAttributeValue(str) {
	    return escapeText(str).replace(/"/g, "&quot;")
	}

	var domWalk$1 = __moduleExports$4
	var dispatchEvent$1 = __moduleExports$8
	var addEventListener$1 = __moduleExports$9
	var removeEventListener$1 = __moduleExports$10
	var serializeNode = __moduleExports$11

	var htmlns = "http://www.w3.org/1999/xhtml"

	var __moduleExports$7 = DOMElement$1

	function DOMElement$1(tagName, owner, namespace) {
	    if (!(this instanceof DOMElement$1)) {
	        return new DOMElement$1(tagName)
	    }

	    var ns = namespace === undefined ? htmlns : (namespace || null)

	    this.tagName = ns === htmlns ? String(tagName).toUpperCase() : tagName
	    this.nodeName = this.tagName
	    this.className = ""
	    this.dataset = {}
	    this.childNodes = []
	    this.parentNode = null
	    this.style = {}
	    this.ownerDocument = owner || null
	    this.namespaceURI = ns
	    this._attributes = {}

	    if (this.tagName === 'INPUT') {
	      this.type = 'text'
	    }
	}

	DOMElement$1.prototype.type = "DOMElement"
	DOMElement$1.prototype.nodeType = 1

	DOMElement$1.prototype.appendChild = function _Element_appendChild(child) {
	    if (child.parentNode) {
	        child.parentNode.removeChild(child)
	    }

	    this.childNodes.push(child)
	    child.parentNode = this

	    return child
	}

	DOMElement$1.prototype.replaceChild =
	    function _Element_replaceChild(elem, needle) {
	        // TODO: Throw NotFoundError if needle.parentNode !== this

	        if (elem.parentNode) {
	            elem.parentNode.removeChild(elem)
	        }

	        var index = this.childNodes.indexOf(needle)

	        needle.parentNode = null
	        this.childNodes[index] = elem
	        elem.parentNode = this

	        return needle
	    }

	DOMElement$1.prototype.removeChild = function _Element_removeChild(elem) {
	    // TODO: Throw NotFoundError if elem.parentNode !== this

	    var index = this.childNodes.indexOf(elem)
	    this.childNodes.splice(index, 1)

	    elem.parentNode = null
	    return elem
	}

	DOMElement$1.prototype.insertBefore =
	    function _Element_insertBefore(elem, needle) {
	        // TODO: Throw NotFoundError if referenceElement is a dom node
	        // and parentNode !== this

	        if (elem.parentNode) {
	            elem.parentNode.removeChild(elem)
	        }

	        var index = needle === null || needle === undefined ?
	            -1 :
	            this.childNodes.indexOf(needle)

	        if (index > -1) {
	            this.childNodes.splice(index, 0, elem)
	        } else {
	            this.childNodes.push(elem)
	        }

	        elem.parentNode = this
	        return elem
	    }

	DOMElement$1.prototype.setAttributeNS =
	    function _Element_setAttributeNS(namespace, name, value) {
	        var prefix = null
	        var localName = name
	        var colonPosition = name.indexOf(":")
	        if (colonPosition > -1) {
	            prefix = name.substr(0, colonPosition)
	            localName = name.substr(colonPosition + 1)
	        }
	        if (this.tagName === 'INPUT' && name === 'type') {
	          this.type = value;
	        }
	        else {
	          var attributes = this._attributes[namespace] || (this._attributes[namespace] = {})
	          attributes[localName] = {value: value, prefix: prefix}
	        }
	    }

	DOMElement$1.prototype.getAttributeNS =
	    function _Element_getAttributeNS(namespace, name) {
	        var attributes = this._attributes[namespace];
	        var value = attributes && attributes[name] && attributes[name].value
	        if (this.tagName === 'INPUT' && name === 'type') {
	          return this.type;
	        }
	        if (typeof value !== "string") {
	            return null
	        }
	        return value
	    }

	DOMElement$1.prototype.removeAttributeNS =
	    function _Element_removeAttributeNS(namespace, name) {
	        var attributes = this._attributes[namespace];
	        if (attributes) {
	            delete attributes[name]
	        }
	    }

	DOMElement$1.prototype.hasAttributeNS =
	    function _Element_hasAttributeNS(namespace, name) {
	        var attributes = this._attributes[namespace]
	        return !!attributes && name in attributes;
	    }

	DOMElement$1.prototype.setAttribute = function _Element_setAttribute(name, value) {
	    return this.setAttributeNS(null, name, value)
	}

	DOMElement$1.prototype.getAttribute = function _Element_getAttribute(name) {
	    return this.getAttributeNS(null, name)
	}

	DOMElement$1.prototype.removeAttribute = function _Element_removeAttribute(name) {
	    return this.removeAttributeNS(null, name)
	}

	DOMElement$1.prototype.hasAttribute = function _Element_hasAttribute(name) {
	    return this.hasAttributeNS(null, name)
	}

	DOMElement$1.prototype.removeEventListener = removeEventListener$1
	DOMElement$1.prototype.addEventListener = addEventListener$1
	DOMElement$1.prototype.dispatchEvent = dispatchEvent$1

	// Un-implemented
	DOMElement$1.prototype.focus = function _Element_focus() {
	    return void 0
	}

	DOMElement$1.prototype.toString = function _Element_toString() {
	    return serializeNode(this)
	}

	DOMElement$1.prototype.getElementsByClassName = function _Element_getElementsByClassName(classNames) {
	    var classes = classNames.split(" ");
	    var elems = []

	    domWalk$1(this, function (node) {
	        if (node.nodeType === 1) {
	            var nodeClassName = node.className || ""
	            var nodeClasses = nodeClassName.split(" ")

	            if (classes.every(function (item) {
	                return nodeClasses.indexOf(item) !== -1
	            })) {
	                elems.push(node)
	            }
	        }
	    })

	    return elems
	}

	DOMElement$1.prototype.getElementsByTagName = function _Element_getElementsByTagName(tagName) {
	    tagName = tagName.toLowerCase()
	    var elems = []

	    domWalk$1(this.childNodes, function (node) {
	        if (node.nodeType === 1 && (tagName === '*' || node.tagName.toLowerCase() === tagName)) {
	            elems.push(node)
	        }
	    })

	    return elems
	}

	DOMElement$1.prototype.contains = function _Element_contains(element) {
	    return domWalk$1(this, function (node) {
	        return element === node
	    }) || false
	}

	var DOMElement$2 = __moduleExports$7

	var __moduleExports$12 = DocumentFragment$1

	function DocumentFragment$1(owner) {
	    if (!(this instanceof DocumentFragment$1)) {
	        return new DocumentFragment$1()
	    }

	    this.childNodes = []
	    this.parentNode = null
	    this.ownerDocument = owner || null
	}

	DocumentFragment$1.prototype.type = "DocumentFragment"
	DocumentFragment$1.prototype.nodeType = 11
	DocumentFragment$1.prototype.nodeName = "#document-fragment"

	DocumentFragment$1.prototype.appendChild  = DOMElement$2.prototype.appendChild
	DocumentFragment$1.prototype.replaceChild = DOMElement$2.prototype.replaceChild
	DocumentFragment$1.prototype.removeChild  = DOMElement$2.prototype.removeChild

	DocumentFragment$1.prototype.toString =
	    function _DocumentFragment_toString() {
	        return this.childNodes.map(function (node) {
	            return String(node)
	        }).join("")
	    }

	var __moduleExports$13 = Event$1

	function Event$1(family) {}

	Event$1.prototype.initEvent = function _Event_initEvent(type, bubbles, cancelable) {
	    this.type = type
	    this.bubbles = bubbles
	    this.cancelable = cancelable
	}

	Event$1.prototype.preventDefault = function _Event_preventDefault() {
	    
	}

	var domWalk = __moduleExports$4

	var Comment = __moduleExports$5
	var DOMText = __moduleExports$6
	var DOMElement = __moduleExports$7
	var DocumentFragment = __moduleExports$12
	var Event = __moduleExports$13
	var dispatchEvent = __moduleExports$8
	var addEventListener = __moduleExports$9
	var removeEventListener = __moduleExports$10

	var __moduleExports$3 = Document$1;

	function Document$1() {
	    if (!(this instanceof Document$1)) {
	        return new Document$1();
	    }

	    this.head = this.createElement("head")
	    this.body = this.createElement("body")
	    this.documentElement = this.createElement("html")
	    this.documentElement.appendChild(this.head)
	    this.documentElement.appendChild(this.body)
	    this.childNodes = [this.documentElement]
	    this.nodeType = 9
	}

	var proto = Document$1.prototype;
	proto.createTextNode = function createTextNode(value) {
	    return new DOMText(value, this)
	}

	proto.createElementNS = function createElementNS(namespace, tagName) {
	    var ns = namespace === null ? null : String(namespace)
	    return new DOMElement(tagName, this, ns)
	}

	proto.createElement = function createElement(tagName) {
	    return new DOMElement(tagName, this)
	}

	proto.createDocumentFragment = function createDocumentFragment() {
	    return new DocumentFragment(this)
	}

	proto.createEvent = function createEvent(family) {
	    return new Event(family)
	}

	proto.createComment = function createComment(data) {
	    return new Comment(data, this)
	}

	proto.getElementById = function getElementById(id) {
	    id = String(id)

	    var result = domWalk(this.childNodes, function (node) {
	        if (String(node.id) === id) {
	            return node
	        }
	    })

	    return result || null
	}

	proto.getElementsByClassName = DOMElement.prototype.getElementsByClassName
	proto.getElementsByTagName = DOMElement.prototype.getElementsByTagName
	proto.contains = DOMElement.prototype.contains

	proto.removeEventListener = removeEventListener
	proto.addEventListener = addEventListener
	proto.dispatchEvent = dispatchEvent

	var Document = __moduleExports$3;

	var __moduleExports$2 = new Document();

	var __moduleExports$1 = createCommonjsModule(function (module) {
	var topLevel = typeof commonjsGlobal !== 'undefined' ? commonjsGlobal :
	    typeof window !== 'undefined' ? window : {}
	var minDoc = __moduleExports$2;

	if (typeof __moduleExports$1 !== 'undefined') {
	    module.exports = __moduleExports$1;
	} else {
	    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

	    if (!doccy) {
	        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
	    }

	    module.exports = doccy;
	}
	});

	var nativeIsArray = Array.isArray
	var toString = Object.prototype.toString

	var __moduleExports$14 = nativeIsArray || isArray$1

	function isArray$1(obj) {
	    return toString.call(obj) === "[object Array]"
	}

	var slice$1 = Array.prototype.slice

	var __moduleExports$19 = iterativelyWalk$1

	function iterativelyWalk$1(nodes, cb) {
	    if (!('length' in nodes)) {
	        nodes = [nodes]
	    }
	    
	    nodes = slice$1.call(nodes)

	    while(nodes.length) {
	        var node = nodes.shift(),
	            ret = cb(node)

	        if (ret) {
	            return ret
	        }

	        if (node.childNodes && node.childNodes.length) {
	            nodes = slice$1.call(node.childNodes).concat(nodes)
	        }
	    }
	}

	var __moduleExports$20 = Comment$3

	function Comment$3(data, owner) {
	    if (!(this instanceof Comment$3)) {
	        return new Comment$3(data, owner)
	    }

	    this.data = data
	    this.nodeValue = data
	    this.length = data.length
	    this.ownerDocument = owner || null
	}

	Comment$3.prototype.nodeType = 8
	Comment$3.prototype.nodeName = "#comment"

	Comment$3.prototype.toString = function _Comment_toString() {
	    return "[object Comment]"
	}

	var __moduleExports$21 = DOMText$3

	function DOMText$3(value, owner) {
	    if (!(this instanceof DOMText$3)) {
	        return new DOMText$3(value)
	    }

	    this.data = value || ""
	    this.length = this.data.length
	    this.ownerDocument = owner || null
	}

	DOMText$3.prototype.type = "DOMTextNode"
	DOMText$3.prototype.nodeType = 3
	DOMText$3.prototype.nodeName = "#text"

	DOMText$3.prototype.toString = function _Text_toString() {
	    return this.data
	}

	DOMText$3.prototype.replaceData = function replaceData(index, length, value) {
	    var current = this.data
	    var left = current.substring(0, index)
	    var right = current.substring(index + length, current.length)
	    this.data = left + value + right
	    this.length = this.data.length
	}

	var __moduleExports$23 = dispatchEvent$5

	function dispatchEvent$5(ev) {
	    var elem = this
	    var type = ev.type

	    if (!ev.target) {
	        ev.target = elem
	    }

	    if (!elem.listeners) {
	        elem.listeners = {}
	    }

	    var listeners = elem.listeners[type]

	    if (listeners) {
	        return listeners.forEach(function (listener) {
	            ev.currentTarget = elem
	            if (typeof listener === 'function') {
	                listener(ev)
	            } else {
	                listener.handleEvent(ev)
	            }
	        })
	    }

	    if (elem.parentNode) {
	        elem.parentNode.dispatchEvent(ev)
	    }
	}

	var __moduleExports$24 = addEventListener$5

	function addEventListener$5(type, listener) {
	    var elem = this

	    if (!elem.listeners) {
	        elem.listeners = {}
	    }

	    if (!elem.listeners[type]) {
	        elem.listeners[type] = []
	    }

	    if (elem.listeners[type].indexOf(listener) === -1) {
	        elem.listeners[type].push(listener)
	    }
	}

	var __moduleExports$25 = removeEventListener$5

	function removeEventListener$5(type, listener) {
	    var elem = this

	    if (!elem.listeners) {
	        return
	    }

	    if (!elem.listeners[type]) {
	        return
	    }

	    var list = elem.listeners[type]
	    var index = list.indexOf(listener)
	    if (index !== -1) {
	        list.splice(index, 1)
	    }
	}

	var __moduleExports$26 = serializeNode$3

	var voidElements$1 = ["area","base","br","col","embed","hr","img","input","keygen","link","menuitem","meta","param","source","track","wbr"];

	function serializeNode$3(node) {
	    switch (node.nodeType) {
	        case 3:
	            return escapeText$1(node.data)
	        case 8:
	            return "<!--" + node.data + "-->"
	        default:
	            return serializeElement$1(node)
	    }
	}

	function serializeElement$1(elem) {
	    var strings = []

	    var tagname = elem.tagName

	    if (elem.namespaceURI === "http://www.w3.org/1999/xhtml") {
	        tagname = tagname.toLowerCase()
	    }

	    strings.push("<" + tagname + properties$1(elem) + datasetify$1(elem))

	    if (voidElements$1.indexOf(tagname) > -1) {
	        strings.push(" />")
	    } else {
	        strings.push(">")

	        if (elem.childNodes.length) {
	            strings.push.apply(strings, elem.childNodes.map(serializeNode$3))
	        } else if (elem.textContent || elem.innerText) {
	            strings.push(escapeText$1(elem.textContent || elem.innerText))
	        } else if (elem.innerHTML) {
	            strings.push(elem.innerHTML)
	        }

	        strings.push("</" + tagname + ">")
	    }

	    return strings.join("")
	}

	function isProperty$1(elem, key) {
	    var type = typeof elem[key]

	    if (key === "style" && Object.keys(elem.style).length > 0) {
	      return true
	    }

	    return elem.hasOwnProperty(key) &&
	        (type === "string" || type === "boolean" || type === "number") &&
	        key !== "nodeName" && key !== "className" && key !== "tagName" &&
	        key !== "textContent" && key !== "innerText" && key !== "namespaceURI" &&  key !== "innerHTML"
	}

	function stylify$1(styles) {
	    if (typeof styles === 'string') return styles
	    var attr = ""
	    Object.keys(styles).forEach(function (key) {
	        var value = styles[key]
	        key = key.replace(/[A-Z]/g, function(c) {
	            return "-" + c.toLowerCase();
	        })
	        attr += key + ":" + value + ";"
	    })
	    return attr
	}

	function datasetify$1(elem) {
	    var ds = elem.dataset
	    var props = []

	    for (var key in ds) {
	        props.push({ name: "data-" + key, value: ds[key] })
	    }

	    return props.length ? stringify$1(props) : ""
	}

	function stringify$1(list) {
	    var attributes = []
	    list.forEach(function (tuple) {
	        var name = tuple.name
	        var value = tuple.value

	        if (name === "style") {
	            value = stylify$1(value)
	        }

	        attributes.push(name + "=" + "\"" + escapeAttributeValue$1(value) + "\"")
	    })

	    return attributes.length ? " " + attributes.join(" ") : ""
	}

	function properties$1(elem) {
	    var props = []
	    for (var key in elem) {
	        if (isProperty$1(elem, key)) {
	            props.push({ name: key, value: elem[key] })
	        }
	    }

	    for (var ns in elem._attributes) {
	      for (var attribute in elem._attributes[ns]) {
	        var prop = elem._attributes[ns][attribute]
	        var name = (prop.prefix ? prop.prefix + ":" : "") + attribute
	        props.push({ name: name, value: prop.value })
	      }
	    }

	    if (elem.className) {
	        props.push({ name: "class", value: elem.className })
	    }

	    return props.length ? stringify$1(props) : ""
	}

	function escapeText$1(s) {
	    var str = '';

	    if (typeof(s) === 'string') { 
	        str = s; 
	    } else if (s) {
	        str = s.toString();
	    }

	    return str
	        .replace(/&/g, "&amp;")
	        .replace(/</g, "&lt;")
	        .replace(/>/g, "&gt;")
	}

	function escapeAttributeValue$1(str) {
	    return escapeText$1(str).replace(/"/g, "&quot;")
	}

	var domWalk$3 = __moduleExports$19
	var dispatchEvent$4 = __moduleExports$23
	var addEventListener$4 = __moduleExports$24
	var removeEventListener$4 = __moduleExports$25
	var serializeNode$2 = __moduleExports$26

	var htmlns$1 = "http://www.w3.org/1999/xhtml"

	var __moduleExports$22 = DOMElement$4

	function DOMElement$4(tagName, owner, namespace) {
	    if (!(this instanceof DOMElement$4)) {
	        return new DOMElement$4(tagName)
	    }

	    var ns = namespace === undefined ? htmlns$1 : (namespace || null)

	    this.tagName = ns === htmlns$1 ? String(tagName).toUpperCase() : tagName
	    this.nodeName = this.tagName
	    this.className = ""
	    this.dataset = {}
	    this.childNodes = []
	    this.parentNode = null
	    this.style = {}
	    this.ownerDocument = owner || null
	    this.namespaceURI = ns
	    this._attributes = {}

	    if (this.tagName === 'INPUT') {
	      this.type = 'text'
	    }
	}

	DOMElement$4.prototype.type = "DOMElement"
	DOMElement$4.prototype.nodeType = 1

	DOMElement$4.prototype.appendChild = function _Element_appendChild(child) {
	    if (child.parentNode) {
	        child.parentNode.removeChild(child)
	    }

	    this.childNodes.push(child)
	    child.parentNode = this

	    return child
	}

	DOMElement$4.prototype.replaceChild =
	    function _Element_replaceChild(elem, needle) {
	        // TODO: Throw NotFoundError if needle.parentNode !== this

	        if (elem.parentNode) {
	            elem.parentNode.removeChild(elem)
	        }

	        var index = this.childNodes.indexOf(needle)

	        needle.parentNode = null
	        this.childNodes[index] = elem
	        elem.parentNode = this

	        return needle
	    }

	DOMElement$4.prototype.removeChild = function _Element_removeChild(elem) {
	    // TODO: Throw NotFoundError if elem.parentNode !== this

	    var index = this.childNodes.indexOf(elem)
	    this.childNodes.splice(index, 1)

	    elem.parentNode = null
	    return elem
	}

	DOMElement$4.prototype.insertBefore =
	    function _Element_insertBefore(elem, needle) {
	        // TODO: Throw NotFoundError if referenceElement is a dom node
	        // and parentNode !== this

	        if (elem.parentNode) {
	            elem.parentNode.removeChild(elem)
	        }

	        var index = needle === null || needle === undefined ?
	            -1 :
	            this.childNodes.indexOf(needle)

	        if (index > -1) {
	            this.childNodes.splice(index, 0, elem)
	        } else {
	            this.childNodes.push(elem)
	        }

	        elem.parentNode = this
	        return elem
	    }

	DOMElement$4.prototype.setAttributeNS =
	    function _Element_setAttributeNS(namespace, name, value) {
	        var prefix = null
	        var localName = name
	        var colonPosition = name.indexOf(":")
	        if (colonPosition > -1) {
	            prefix = name.substr(0, colonPosition)
	            localName = name.substr(colonPosition + 1)
	        }
	        if (this.tagName === 'INPUT' && name === 'type') {
	          this.type = value;
	        }
	        else {
	          var attributes = this._attributes[namespace] || (this._attributes[namespace] = {})
	          attributes[localName] = {value: value, prefix: prefix}
	        }
	    }

	DOMElement$4.prototype.getAttributeNS =
	    function _Element_getAttributeNS(namespace, name) {
	        var attributes = this._attributes[namespace];
	        var value = attributes && attributes[name] && attributes[name].value
	        if (this.tagName === 'INPUT' && name === 'type') {
	          return this.type;
	        }
	        if (typeof value !== "string") {
	            return null
	        }
	        return value
	    }

	DOMElement$4.prototype.removeAttributeNS =
	    function _Element_removeAttributeNS(namespace, name) {
	        var attributes = this._attributes[namespace];
	        if (attributes) {
	            delete attributes[name]
	        }
	    }

	DOMElement$4.prototype.hasAttributeNS =
	    function _Element_hasAttributeNS(namespace, name) {
	        var attributes = this._attributes[namespace]
	        return !!attributes && name in attributes;
	    }

	DOMElement$4.prototype.setAttribute = function _Element_setAttribute(name, value) {
	    return this.setAttributeNS(null, name, value)
	}

	DOMElement$4.prototype.getAttribute = function _Element_getAttribute(name) {
	    return this.getAttributeNS(null, name)
	}

	DOMElement$4.prototype.removeAttribute = function _Element_removeAttribute(name) {
	    return this.removeAttributeNS(null, name)
	}

	DOMElement$4.prototype.hasAttribute = function _Element_hasAttribute(name) {
	    return this.hasAttributeNS(null, name)
	}

	DOMElement$4.prototype.removeEventListener = removeEventListener$4
	DOMElement$4.prototype.addEventListener = addEventListener$4
	DOMElement$4.prototype.dispatchEvent = dispatchEvent$4

	// Un-implemented
	DOMElement$4.prototype.focus = function _Element_focus() {
	    return void 0
	}

	DOMElement$4.prototype.toString = function _Element_toString() {
	    return serializeNode$2(this)
	}

	DOMElement$4.prototype.getElementsByClassName = function _Element_getElementsByClassName(classNames) {
	    var classes = classNames.split(" ");
	    var elems = []

	    domWalk$3(this, function (node) {
	        if (node.nodeType === 1) {
	            var nodeClassName = node.className || ""
	            var nodeClasses = nodeClassName.split(" ")

	            if (classes.every(function (item) {
	                return nodeClasses.indexOf(item) !== -1
	            })) {
	                elems.push(node)
	            }
	        }
	    })

	    return elems
	}

	DOMElement$4.prototype.getElementsByTagName = function _Element_getElementsByTagName(tagName) {
	    tagName = tagName.toLowerCase()
	    var elems = []

	    domWalk$3(this.childNodes, function (node) {
	        if (node.nodeType === 1 && (tagName === '*' || node.tagName.toLowerCase() === tagName)) {
	            elems.push(node)
	        }
	    })

	    return elems
	}

	DOMElement$4.prototype.contains = function _Element_contains(element) {
	    return domWalk$3(this, function (node) {
	        return element === node
	    }) || false
	}

	var DOMElement$5 = __moduleExports$22

	var __moduleExports$27 = DocumentFragment$3

	function DocumentFragment$3(owner) {
	    if (!(this instanceof DocumentFragment$3)) {
	        return new DocumentFragment$3()
	    }

	    this.childNodes = []
	    this.parentNode = null
	    this.ownerDocument = owner || null
	}

	DocumentFragment$3.prototype.type = "DocumentFragment"
	DocumentFragment$3.prototype.nodeType = 11
	DocumentFragment$3.prototype.nodeName = "#document-fragment"

	DocumentFragment$3.prototype.appendChild  = DOMElement$5.prototype.appendChild
	DocumentFragment$3.prototype.replaceChild = DOMElement$5.prototype.replaceChild
	DocumentFragment$3.prototype.removeChild  = DOMElement$5.prototype.removeChild

	DocumentFragment$3.prototype.toString =
	    function _DocumentFragment_toString() {
	        return this.childNodes.map(function (node) {
	            return String(node)
	        }).join("")
	    }

	var __moduleExports$28 = Event$3

	function Event$3(family) {}

	Event$3.prototype.initEvent = function _Event_initEvent(type, bubbles, cancelable) {
	    this.type = type
	    this.bubbles = bubbles
	    this.cancelable = cancelable
	}

	Event$3.prototype.preventDefault = function _Event_preventDefault() {
	    
	}

	var domWalk$2 = __moduleExports$19

	var Comment$2 = __moduleExports$20
	var DOMText$2 = __moduleExports$21
	var DOMElement$3 = __moduleExports$22
	var DocumentFragment$2 = __moduleExports$27
	var Event$2 = __moduleExports$28
	var dispatchEvent$3 = __moduleExports$23
	var addEventListener$3 = __moduleExports$24
	var removeEventListener$3 = __moduleExports$25

	var __moduleExports$18 = Document$3;

	function Document$3() {
	    if (!(this instanceof Document$3)) {
	        return new Document$3();
	    }

	    this.head = this.createElement("head")
	    this.body = this.createElement("body")
	    this.documentElement = this.createElement("html")
	    this.documentElement.appendChild(this.head)
	    this.documentElement.appendChild(this.body)
	    this.childNodes = [this.documentElement]
	    this.nodeType = 9
	}

	var proto$1 = Document$3.prototype;
	proto$1.createTextNode = function createTextNode(value) {
	    return new DOMText$2(value, this)
	}

	proto$1.createElementNS = function createElementNS(namespace, tagName) {
	    var ns = namespace === null ? null : String(namespace)
	    return new DOMElement$3(tagName, this, ns)
	}

	proto$1.createElement = function createElement(tagName) {
	    return new DOMElement$3(tagName, this)
	}

	proto$1.createDocumentFragment = function createDocumentFragment() {
	    return new DocumentFragment$2(this)
	}

	proto$1.createEvent = function createEvent(family) {
	    return new Event$2(family)
	}

	proto$1.createComment = function createComment(data) {
	    return new Comment$2(data, this)
	}

	proto$1.getElementById = function getElementById(id) {
	    id = String(id)

	    var result = domWalk$2(this.childNodes, function (node) {
	        if (String(node.id) === id) {
	            return node
	        }
	    })

	    return result || null
	}

	proto$1.getElementsByClassName = DOMElement$3.prototype.getElementsByClassName
	proto$1.getElementsByTagName = DOMElement$3.prototype.getElementsByTagName
	proto$1.contains = DOMElement$3.prototype.contains

	proto$1.removeEventListener = removeEventListener$3
	proto$1.addEventListener = addEventListener$3
	proto$1.dispatchEvent = dispatchEvent$3

	var Document$2 = __moduleExports$18;

	var __moduleExports$17 = new Document$2();

	var __moduleExports$16 = createCommonjsModule(function (module) {
	var topLevel = typeof commonjsGlobal !== 'undefined' ? commonjsGlobal :
	    typeof window !== 'undefined' ? window : {}
	var minDoc = __moduleExports$17;

	if (typeof __moduleExports$16 !== 'undefined') {
	    module.exports = __moduleExports$16;
	} else {
	    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

	    if (!doccy) {
	        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
	    }

	    module.exports = doccy;
	}
	});

	var __moduleExports$30 = function isObject(x) {
		return typeof x === "object" && x !== null;
	};

	var __moduleExports$31 = isHook$1

	function isHook$1(hook) {
	    return hook &&
	      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
	       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
	}

	var isObject = __moduleExports$30
	var isHook = __moduleExports$31

	var __moduleExports$29 = applyProperties$1

	function applyProperties$1(node, props, previous) {
	    for (var propName in props) {
	        var propValue = props[propName]

	        if (propValue === undefined) {
	            removeProperty(node, propName, propValue, previous);
	        } else if (isHook(propValue)) {
	            removeProperty(node, propName, propValue, previous)
	            if (propValue.hook) {
	                propValue.hook(node,
	                    propName,
	                    previous ? previous[propName] : undefined)
	            }
	        } else {
	            if (isObject(propValue)) {
	                patchObject(node, props, previous, propName, propValue);
	            } else {
	                node[propName] = propValue
	            }
	        }
	    }
	}

	function removeProperty(node, propName, propValue, previous) {
	    if (previous) {
	        var previousValue = previous[propName]

	        if (!isHook(previousValue)) {
	            if (propName === "attributes") {
	                for (var attrName in previousValue) {
	                    node.removeAttribute(attrName)
	                }
	            } else if (propName === "style") {
	                for (var i in previousValue) {
	                    node.style[i] = ""
	                }
	            } else if (typeof previousValue === "string") {
	                node[propName] = ""
	            } else {
	                node[propName] = null
	            }
	        } else if (previousValue.unhook) {
	            previousValue.unhook(node, propName, propValue)
	        }
	    }
	}

	function patchObject(node, props, previous, propName, propValue) {
	    var previousValue = previous ? previous[propName] : undefined

	    // Set attributes
	    if (propName === "attributes") {
	        for (var attrName in propValue) {
	            var attrValue = propValue[attrName]

	            if (attrValue === undefined) {
	                node.removeAttribute(attrName)
	            } else {
	                node.setAttribute(attrName, attrValue)
	            }
	        }

	        return
	    }

	    if(previousValue && isObject(previousValue) &&
	        getPrototype$1(previousValue) !== getPrototype$1(propValue)) {
	        node[propName] = propValue
	        return
	    }

	    if (!isObject(node[propName])) {
	        node[propName] = {}
	    }

	    var replacer = propName === "style" ? "" : undefined

	    for (var k in propValue) {
	        var value = propValue[k]
	        node[propName][k] = (value === undefined) ? replacer : value
	    }
	}

	function getPrototype$1(value) {
	    if (Object.getPrototypeOf) {
	        return Object.getPrototypeOf(value)
	    } else if (value.__proto__) {
	        return value.__proto__
	    } else if (value.constructor) {
	        return value.constructor.prototype
	    }
	}

	var __moduleExports$33 = "2"

	var version = __moduleExports$33

	var __moduleExports$32 = isVirtualNode

	function isVirtualNode(x) {
	    return x && x.type === "VirtualNode" && x.version === version
	}

	var version$1 = __moduleExports$33

	var __moduleExports$34 = isVirtualText

	function isVirtualText(x) {
	    return x && x.type === "VirtualText" && x.version === version$1
	}

	var __moduleExports$35 = isWidget$1

	function isWidget$1(w) {
	    return w && w.type === "Widget"
	}

	var __moduleExports$37 = isThunk$1

	function isThunk$1(t) {
	    return t && t.type === "Thunk"
	}

	var isVNode$1 = __moduleExports$32
	var isVText$1 = __moduleExports$34
	var isWidget$2 = __moduleExports$35
	var isThunk = __moduleExports$37

	var __moduleExports$36 = handleThunk$1

	function handleThunk$1(a, b) {
	    var renderedA = a
	    var renderedB = b

	    if (isThunk(b)) {
	        renderedB = renderThunk(b, a)
	    }

	    if (isThunk(a)) {
	        renderedA = renderThunk(a, null)
	    }

	    return {
	        a: renderedA,
	        b: renderedB
	    }
	}

	function renderThunk(thunk, previous) {
	    var renderedThunk = thunk.vnode

	    if (!renderedThunk) {
	        renderedThunk = thunk.vnode = thunk.render(previous)
	    }

	    if (!(isVNode$1(renderedThunk) ||
	            isVText$1(renderedThunk) ||
	            isWidget$2(renderedThunk))) {
	        throw new Error("thunk did not return a valid node");
	    }

	    return renderedThunk
	}

	var document$2 = __moduleExports$16

	var applyProperties = __moduleExports$29

	var isVNode = __moduleExports$32
	var isVText = __moduleExports$34
	var isWidget = __moduleExports$35
	var handleThunk = __moduleExports$36

	var __moduleExports$15 = createElement

	function createElement(vnode, opts) {
	    var doc = opts ? opts.document || document$2 : document$2
	    var warn = opts ? opts.warn : null

	    vnode = handleThunk(vnode).a

	    if (isWidget(vnode)) {
	        return vnode.init()
	    } else if (isVText(vnode)) {
	        return doc.createTextNode(vnode.text)
	    } else if (!isVNode(vnode)) {
	        if (warn) {
	            warn("Item is not a valid virtual dom node", vnode)
	        }
	        return null
	    }

	    var node = (vnode.namespace === null) ?
	        doc.createElement(vnode.tagName) :
	        doc.createElementNS(vnode.namespace, vnode.tagName)

	    var props = vnode.properties
	    applyProperties(node, props)

	    var children = vnode.children

	    for (var i = 0; i < children.length; i++) {
	        var childNode = createElement(children[i], opts)
	        if (childNode) {
	            node.appendChild(childNode)
	        }
	    }

	    return node
	}

	// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
	// We don't want to read all of the DOM nodes in the tree so we use
	// the in-order tree indexing to eliminate recursion down certain branches.
	// We only recurse into a DOM node if we know that it contains a child of
	// interest.

	var noChild = {}

	var __moduleExports$38 = domIndex$1

	function domIndex$1(rootNode, tree, indices, nodes) {
	    if (!indices || indices.length === 0) {
	        return {}
	    } else {
	        indices.sort(ascending)
	        return recurse(rootNode, tree, indices, nodes, 0)
	    }
	}

	function recurse(rootNode, tree, indices, nodes, rootIndex) {
	    nodes = nodes || {}


	    if (rootNode) {
	        if (indexInRange(indices, rootIndex, rootIndex)) {
	            nodes[rootIndex] = rootNode
	        }

	        var vChildren = tree.children

	        if (vChildren) {

	            var childNodes = rootNode.childNodes

	            for (var i = 0, j = 0; i < tree.children.length; i++, j++) {
	                rootIndex += 1

	                var vChild = vChildren[i] || noChild
	                var nextIndex = rootIndex + (vChild.count || 0)

	                // skip recursion down the tree if there are no nodes down here
	                if (indexInRange(indices, rootIndex, nextIndex)) {
	                    // skip dom nodes with delayed removal
	                    while(childNodes[j] && childNodes[j].isLeaving) j++
	                    recurse(childNodes[j], vChild, indices, nodes, rootIndex)
	                }

	                rootIndex = nextIndex
	            }
	        }
	    }

	    return nodes
	}

	// Binary search for an index in the interval [left, right]
	function indexInRange(indices, left, right) {
	    if (indices.length === 0) {
	        return false
	    }

	    var minIndex = 0
	    var maxIndex = indices.length - 1
	    var currentIndex
	    var currentItem

	    while (minIndex <= maxIndex) {
	        currentIndex = ((maxIndex + minIndex) / 2) >> 0
	        currentItem = indices[currentIndex]

	        if (minIndex === maxIndex) {
	            return currentItem >= left && currentItem <= right
	        } else if (currentItem < left) {
	            minIndex = currentIndex + 1
	        } else  if (currentItem > right) {
	            maxIndex = currentIndex - 1
	        } else {
	            return true
	        }
	    }

	    return false;
	}

	function ascending(a, b) {
	    return a > b ? 1 : -1
	}

	var version$2 = __moduleExports$33

	VirtualPatch.NONE = 0
	VirtualPatch.VTEXT = 1
	VirtualPatch.VNODE = 2
	VirtualPatch.WIDGET = 3
	VirtualPatch.PROPS = 4
	VirtualPatch.ORDER = 5
	VirtualPatch.INSERT = 6
	VirtualPatch.REMOVE = 7
	VirtualPatch.THUNK = 8

	var __moduleExports$40 = VirtualPatch

	function VirtualPatch(type, vNode, patch) {
	    this.type = Number(type)
	    this.vNode = vNode
	    this.patch = patch
	}

	VirtualPatch.prototype.version = version$2
	VirtualPatch.prototype.type = "VirtualPatch"

	var isWidget$4 = __moduleExports$35

	var __moduleExports$41 = updateWidget$1

	function updateWidget$1(a, b) {
	    if (isWidget$4(a) && isWidget$4(b)) {
	        if ("name" in a && "name" in b) {
	            return a.id === b.id
	        } else {
	            return a.init === b.init
	        }
	    }

	    return false
	}

	var applyProperties$2 = __moduleExports$29

	var isWidget$3 = __moduleExports$35
	var VPatch = __moduleExports$40

	var updateWidget = __moduleExports$41

	var __moduleExports$39 = applyPatch$1

	function applyPatch$1(vpatch, domNode, renderOptions) {
	    var type = vpatch.type
	    var vNode = vpatch.vNode
	    var patch = vpatch.patch

	    switch (type) {
	        case VPatch.REMOVE:
	            return removeNode(domNode, vNode)
	        case VPatch.INSERT:
	            return insertNode(domNode, patch, renderOptions)
	        case VPatch.VTEXT:
	            return stringPatch(domNode, vNode, patch, renderOptions)
	        case VPatch.WIDGET:
	            return widgetPatch(domNode, vNode, patch, renderOptions)
	        case VPatch.VNODE:
	            return vNodePatch(domNode, vNode, patch, renderOptions)
	        case VPatch.ORDER:
	            reorderChildren(domNode, patch)
	            return domNode
	        case VPatch.PROPS:
	            applyProperties$2(domNode, patch, vNode.properties)
	            return domNode
	        case VPatch.THUNK:
	            return replaceRoot(domNode,
	                renderOptions.patch(domNode, patch, renderOptions))
	        default:
	            return domNode
	    }
	}

	function removeNode(domNode, vNode) {
	    var parentNode = domNode.parentNode

	    if (parentNode) {
	        if (vNode.transition) {
	            // extend dom for performance reasons :/
	            domNode.isLeaving = true
	            domNode.classList.add(vNode.transition.leaveClass || "leave")
	            setTimeout(function () {
	                parentNode.removeChild(domNode)
	            }, typeof vNode.transition !== "object" ? vNode.transition : vNode.transition.duration || 1000)
	        } else {
	            parentNode.removeChild(domNode)
	        }
	    }

	    destroyWidget(domNode, vNode);

	    return null
	}

	function insertNode(parentNode, vNode, renderOptions) {
	    var newNode = renderOptions.render(vNode, renderOptions)

	    if (parentNode) {
	        if (vNode.transition) {
	            newNode.classList.add(vNode.enterClass || "enter")
	            // TODO: could we use `nextTick` instead
	            setTimeout(function () {
	                newNode.classList.remove(vNode.enterClass || "enter")
	            }, 10)
	        }
	        parentNode.appendChild(newNode)  
	    }

	    return parentNode
	}

	function stringPatch(domNode, leftVNode, vText, renderOptions) {
	    var newNode

	    if (domNode.nodeType === 3) {
	        domNode.replaceData(0, domNode.length, vText.text)
	        newNode = domNode
	    } else {
	        var parentNode = domNode.parentNode
	        newNode = renderOptions.render(vText, renderOptions)

	        if (parentNode && newNode !== domNode) {
	            parentNode.replaceChild(newNode, domNode)
	        }
	    }

	    return newNode
	}

	function widgetPatch(domNode, leftVNode, widget, renderOptions) {
	    var updating = updateWidget(leftVNode, widget)
	    var newNode

	    if (updating) {
	        newNode = widget.update(leftVNode, domNode) || domNode
	    } else {
	        newNode = renderOptions.render(widget, renderOptions)
	    }

	    var parentNode = domNode.parentNode

	    if (parentNode && newNode !== domNode) {
	        parentNode.replaceChild(newNode, domNode)
	    }

	    if (!updating) {
	        destroyWidget(domNode, leftVNode)
	    }

	    return newNode
	}

	function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
	    var parentNode = domNode.parentNode
	    var newNode = renderOptions.render(vNode, renderOptions)

	    if (parentNode && newNode !== domNode) {
	        parentNode.replaceChild(newNode, domNode)
	    }

	    return newNode
	}

	function destroyWidget(domNode, w) {
	    if (typeof w.destroy === "function" && isWidget$3(w)) {
	        w.destroy(domNode)
	    }
	}

	function reorderChildren(domNode, moves) {
	    var childNodes = domNode.childNodes
	    var keyMap = {}
	    var node
	    var remove
	    var insert

	    for (var i = 0; i < moves.removes.length; i++) {
	        remove = moves.removes[i]
	        node = childNodes[remove.from]
	        if (remove.key) {
	            keyMap[remove.key] = node
	        }
	        domNode.removeChild(node)
	    }

	    var length = childNodes.length
	    for (var j = 0; j < moves.inserts.length; j++) {
	        insert = moves.inserts[j]
	        node = keyMap[insert.key]
	        // this is the weirdest bug i"ve ever seen in webkit
	        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
	    }
	}

	function replaceRoot(oldRoot, newRoot) {
	    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
	        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
	    }

	    return newRoot;
	}

	var document$1 = __moduleExports$1
	var isArray = __moduleExports$14

	var render = __moduleExports$15
	var domIndex = __moduleExports$38
	var patchOp = __moduleExports$39
	var __moduleExports = patch$1

	function patch$1(rootNode, patches, renderOptions) {
	    renderOptions = renderOptions || {}
	    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch$1
	        ? renderOptions.patch
	        : patchRecursive
	    renderOptions.render = renderOptions.render || render

	    return renderOptions.patch(rootNode, patches, renderOptions)
	}

	function patchRecursive(rootNode, patches, renderOptions) {
	    var indices = patchIndices(patches)

	    if (indices.length === 0) {
	        return rootNode
	    }

	    var index = domIndex(rootNode, patches.a, indices)
	    var ownerDocument = rootNode.ownerDocument

	    if (!renderOptions.document && ownerDocument !== document$1) {
	        renderOptions.document = ownerDocument
	    }

	    for (var i = 0; i < indices.length; i++) {
	        var nodeIndex = indices[i]
	        rootNode = applyPatch(rootNode,
	            index[nodeIndex],
	            patches[nodeIndex],
	            renderOptions)
	    }

	    return rootNode
	}

	function applyPatch(rootNode, domNode, patchList, renderOptions) {
	    if (!domNode) {
	        return rootNode
	    }

	    var newNode

	    if (isArray(patchList)) {
	        for (var i = 0; i < patchList.length; i++) {
	            newNode = patchOp(patchList[i], domNode, renderOptions)

	            if (domNode === rootNode) {
	                rootNode = newNode
	            }
	        }
	    } else {
	        newNode = patchOp(patchList, domNode, renderOptions)

	        if (domNode === rootNode) {
	            rootNode = newNode
	        }
	    }

	    return rootNode
	}

	function patchIndices(patches) {
	    var indices = []

	    for (var key in patches) {
	        if (key !== "a") {
	            indices.push(Number(key))
	        }
	    }

	    return indices
	}

	var patch = __moduleExports

	var createElement$1 = __moduleExports$15

	var createElement_1 = createElement$1

	var nativeIsArray$1 = Array.isArray
	var toString$1 = Object.prototype.toString

	var __moduleExports$43 = nativeIsArray$1 || isArray$3

	function isArray$3(obj) {
	    return toString$1.call(obj) === "[object Array]"
	}

	var isObject$1 = __moduleExports$30
	var isHook$2 = __moduleExports$31

	var __moduleExports$44 = diffProps$1

	function diffProps$1(a, b) {
	    var diff

	    for (var aKey in a) {
	        if (!(aKey in b)) {
	            diff = diff || {}
	            diff[aKey] = undefined
	        }

	        var aValue = a[aKey]
	        var bValue = b[aKey]

	        if (aValue === bValue) {
	            continue
	        } else if (isObject$1(aValue) && isObject$1(bValue)) {
	            if (getPrototype$2(bValue) !== getPrototype$2(aValue)) {
	                diff = diff || {}
	                diff[aKey] = bValue
	            } else if (isHook$2(bValue)) {
	                 diff = diff || {}
	                 diff[aKey] = bValue
	            } else {
	                var objectDiff = diffProps$1(aValue, bValue)
	                if (objectDiff) {
	                    diff = diff || {}
	                    diff[aKey] = objectDiff
	                }
	            }
	        } else {
	            diff = diff || {}
	            diff[aKey] = bValue
	        }
	    }

	    for (var bKey in b) {
	        if (!(bKey in a)) {
	            diff = diff || {}
	            diff[bKey] = b[bKey]
	        }
	    }

	    return diff
	}

	function getPrototype$2(value) {
	  if (Object.getPrototypeOf) {
	    return Object.getPrototypeOf(value)
	  } else if (value.__proto__) {
	    return value.__proto__
	  } else if (value.constructor) {
	    return value.constructor.prototype
	  }
	}

	var isArray$2 = __moduleExports$43

	var VPatch$1 = __moduleExports$40
	var isVNode$2 = __moduleExports$32
	var isVText$2 = __moduleExports$34
	var isWidget$5 = __moduleExports$35
	var isThunk$2 = __moduleExports$37
	var handleThunk$2 = __moduleExports$36

	var diffProps = __moduleExports$44

	var __moduleExports$42 = diff$1

	function diff$1(a, b) {
	    var patch = { a: a }
	    walk(a, b, patch, 0)
	    return patch
	}

	function walk(a, b, patch, index) {
	    if (a === b) {
	        return
	    }

	    var apply = patch[index]
	    var applyClear = false

	    if (isThunk$2(a) || isThunk$2(b)) {
	        thunks(a, b, patch, index)
	    } else if (b == null) {

	        // If a is a widget we will add a remove patch for it
	        // Otherwise any child widgets/hooks must be destroyed.
	        // This prevents adding two remove patches for a widget.
	        if (!isWidget$5(a)) {
	            clearState(a, patch, index)
	            apply = patch[index]
	        }

	        apply = appendPatch(apply, new VPatch$1(VPatch$1.REMOVE, a, b))
	    } else if (isVNode$2(b)) {
	        if (isVNode$2(a)) {
	            if (a.tagName === b.tagName &&
	                a.namespace === b.namespace &&
	                a.key === b.key) {
	                var propsPatch = diffProps(a.properties, b.properties)
	                if (propsPatch) {
	                    apply = appendPatch(apply,
	                        new VPatch$1(VPatch$1.PROPS, a, propsPatch))
	                }
	                apply = diffChildren(a, b, patch, apply, index)
	            } else {
	                apply = appendPatch(apply, new VPatch$1(VPatch$1.VNODE, a, b))
	                applyClear = true
	            }
	        } else {
	            apply = appendPatch(apply, new VPatch$1(VPatch$1.VNODE, a, b))
	            applyClear = true
	        }
	    } else if (isVText$2(b)) {
	        if (!isVText$2(a)) {
	            apply = appendPatch(apply, new VPatch$1(VPatch$1.VTEXT, a, b))
	            applyClear = true
	        } else if (a.text !== b.text) {
	            apply = appendPatch(apply, new VPatch$1(VPatch$1.VTEXT, a, b))
	        }
	    } else if (isWidget$5(b)) {
	        if (!isWidget$5(a)) {
	            applyClear = true
	        }

	        apply = appendPatch(apply, new VPatch$1(VPatch$1.WIDGET, a, b))
	    }

	    if (apply) {
	        patch[index] = apply
	    }

	    if (applyClear) {
	        clearState(a, patch, index)
	    }
	}

	function diffChildren(a, b, patch, apply, index) {
	    var aChildren = a.children
	    var orderedSet = reorder(aChildren, b.children)
	    var bChildren = orderedSet.children

	    var aLen = aChildren.length
	    var bLen = bChildren.length
	    var len = aLen > bLen ? aLen : bLen

	    for (var i = 0; i < len; i++) {
	        var leftNode = aChildren[i]
	        var rightNode = bChildren[i]
	        index += 1

	        if (!leftNode) {
	            if (rightNode) {
	                // Excess nodes in b need to be added
	                apply = appendPatch(apply,
	                    new VPatch$1(VPatch$1.INSERT, null, rightNode))
	            }
	        } else {
	            walk(leftNode, rightNode, patch, index)
	        }

	        if (isVNode$2(leftNode) && leftNode.count) {
	            index += leftNode.count
	        }
	    }

	    if (orderedSet.moves) {
	        // Reorder nodes last
	        apply = appendPatch(apply, new VPatch$1(
	            VPatch$1.ORDER,
	            a,
	            orderedSet.moves
	        ))
	    }

	    return apply
	}

	function clearState(vNode, patch, index) {
	    // TODO: Make this a single walk, not two
	    unhook(vNode, patch, index)
	    destroyWidgets(vNode, patch, index)
	}

	// Patch records for all destroyed widgets must be added because we need
	// a DOM node reference for the destroy function
	function destroyWidgets(vNode, patch, index) {
	    if (isWidget$5(vNode)) {
	        if (typeof vNode.destroy === "function") {
	            patch[index] = appendPatch(
	                patch[index],
	                new VPatch$1(VPatch$1.REMOVE, vNode, null)
	            )
	        }
	    } else if (isVNode$2(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
	        var children = vNode.children
	        var len = children.length
	        for (var i = 0; i < len; i++) {
	            var child = children[i]
	            index += 1

	            destroyWidgets(child, patch, index)

	            if (isVNode$2(child) && child.count) {
	                index += child.count
	            }
	        }
	    } else if (isThunk$2(vNode)) {
	        thunks(vNode, null, patch, index)
	    }
	}

	// Create a sub-patch for thunks
	function thunks(a, b, patch, index) {
	    var nodes = handleThunk$2(a, b)
	    var thunkPatch = diff$1(nodes.a, nodes.b)
	    if (hasPatches(thunkPatch)) {
	        patch[index] = new VPatch$1(VPatch$1.THUNK, null, thunkPatch)
	    }
	}

	function hasPatches(patch) {
	    for (var index in patch) {
	        if (index !== "a") {
	            return true
	        }
	    }

	    return false
	}

	// Execute hooks when two nodes are identical
	function unhook(vNode, patch, index) {
	    if (isVNode$2(vNode)) {
	        if (vNode.hooks) {
	            patch[index] = appendPatch(
	                patch[index],
	                new VPatch$1(
	                    VPatch$1.PROPS,
	                    vNode,
	                    undefinedKeys(vNode.hooks)
	                )
	            )
	        }

	        if (vNode.descendantHooks || vNode.hasThunks) {
	            var children = vNode.children
	            var len = children.length
	            for (var i = 0; i < len; i++) {
	                var child = children[i]
	                index += 1

	                unhook(child, patch, index)

	                if (isVNode$2(child) && child.count) {
	                    index += child.count
	                }
	            }
	        }
	    } else if (isThunk$2(vNode)) {
	        thunks(vNode, null, patch, index)
	    }
	}

	function undefinedKeys(obj) {
	    var result = {}

	    for (var key in obj) {
	        result[key] = undefined
	    }

	    return result
	}

	// List diff, naive left to right reordering
	function reorder(aChildren, bChildren) {
	    // O(M) time, O(M) memory
	    var bChildIndex = keyIndex(bChildren)
	    var bKeys = bChildIndex.keys
	    var bFree = bChildIndex.free

	    if (bFree.length === bChildren.length) {
	        return {
	            children: bChildren,
	            moves: null
	        }
	    }

	    // O(N) time, O(N) memory
	    var aChildIndex = keyIndex(aChildren)
	    var aKeys = aChildIndex.keys
	    var aFree = aChildIndex.free

	    if (aFree.length === aChildren.length) {
	        return {
	            children: bChildren,
	            moves: null
	        }
	    }

	    // O(MAX(N, M)) memory
	    var newChildren = []

	    var freeIndex = 0
	    var freeCount = bFree.length
	    var deletedItems = 0

	    // Iterate through a and match a node in b
	    // O(N) time,
	    for (var i = 0 ; i < aChildren.length; i++) {
	        var aItem = aChildren[i]
	        var itemIndex

	        if (aItem.key) {
	            if (bKeys.hasOwnProperty(aItem.key)) {
	                // Match up the old keys
	                itemIndex = bKeys[aItem.key]
	                newChildren.push(bChildren[itemIndex])

	            } else {
	                // Remove old keyed items
	                itemIndex = i - deletedItems++
	                newChildren.push(null)
	            }
	        } else {
	            // Match the item in a with the next free item in b
	            if (freeIndex < freeCount) {
	                itemIndex = bFree[freeIndex++]
	                newChildren.push(bChildren[itemIndex])
	            } else {
	                // There are no free items in b to match with
	                // the free items in a, so the extra free nodes
	                // are deleted.
	                itemIndex = i - deletedItems++
	                newChildren.push(null)
	            }
	        }
	    }

	    var lastFreeIndex = freeIndex >= bFree.length ?
	        bChildren.length :
	        bFree[freeIndex]

	    // Iterate through b and append any new keys
	    // O(M) time
	    for (var j = 0; j < bChildren.length; j++) {
	        var newItem = bChildren[j]

	        if (newItem.key) {
	            if (!aKeys.hasOwnProperty(newItem.key)) {
	                // Add any new keyed items
	                // We are adding new items to the end and then sorting them
	                // in place. In future we should insert new items in place.
	                newChildren.push(newItem)
	            }
	        } else if (j >= lastFreeIndex) {
	            // Add any leftover non-keyed items
	            newChildren.push(newItem)
	        }
	    }

	    var simulate = newChildren.slice()
	    var simulateIndex = 0
	    var removes = []
	    var inserts = []
	    var simulateItem

	    for (var k = 0; k < bChildren.length;) {
	        var wantedItem = bChildren[k]
	        simulateItem = simulate[simulateIndex]

	        // remove items
	        while (simulateItem === null && simulate.length) {
	            removes.push(remove(simulate, simulateIndex, null))
	            simulateItem = simulate[simulateIndex]
	        }

	        if (!simulateItem || simulateItem.key !== wantedItem.key) {
	            // if we need a key in this position...
	            if (wantedItem.key) {
	                if (simulateItem && simulateItem.key) {
	                    // if an insert doesn't put this key in place, it needs to move
	                    if (bKeys[simulateItem.key] !== k + 1) {
	                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
	                        simulateItem = simulate[simulateIndex]
	                        // if the remove didn't put the wanted item in place, we need to insert it
	                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
	                            inserts.push({key: wantedItem.key, to: k})
	                        }
	                        // items are matching, so skip ahead
	                        else {
	                            simulateIndex++
	                        }
	                    }
	                    else {
	                        inserts.push({key: wantedItem.key, to: k})
	                    }
	                }
	                else {
	                    inserts.push({key: wantedItem.key, to: k})
	                }
	                k++
	            }
	            // a key in simulate has no matching wanted key, remove it
	            else if (simulateItem && simulateItem.key) {
	                removes.push(remove(simulate, simulateIndex, simulateItem.key))
	            }
	        }
	        else {
	            simulateIndex++
	            k++
	        }
	    }

	    // remove all the remaining nodes from simulate
	    while(simulateIndex < simulate.length) {
	        simulateItem = simulate[simulateIndex]
	        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
	    }

	    // If the only moves we have are deletes then we can just
	    // let the delete patch remove these items.
	    if (removes.length === deletedItems && !inserts.length) {
	        return {
	            children: newChildren,
	            moves: null
	        }
	    }

	    return {
	        children: newChildren,
	        moves: {
	            removes: removes,
	            inserts: inserts
	        }
	    }
	}

	function remove(arr, index, key) {
	    arr.splice(index, 1)

	    return {
	        from: index,
	        key: key
	    }
	}

	function keyIndex(children) {
	    var keys = {}
	    var free = []
	    var length = children.length

	    for (var i = 0; i < length; i++) {
	        var child = children[i]

	        if (child.key) {
	            keys[child.key] = i
	        } else {
	            free.push(i)
	        }
	    }

	    return {
	        keys: keys,     // A hash of key name to index
	        free: free      // An array of unkeyed item indices
	    }
	}

	function appendPatch(apply, patch) {
	    if (apply) {
	        if (isArray$2(apply)) {
	            apply.push(patch)
	        } else {
	            apply = [apply, patch]
	        }

	        return apply
	    } else {
	        return patch
	    }
	}

	var diff = __moduleExports$42

	var diff_1 = diff

	var fastdom = createCommonjsModule(function (module) {
	!(function(win) {

	/**
	 * FastDom
	 *
	 * Eliminates layout thrashing
	 * by batching DOM read/write
	 * interactions.
	 *
	 * @author Wilson Page <wilsonpage@me.com>
	 * @author Kornel Lesinski <kornel.lesinski@ft.com>
	 */

	'use strict';

	/**
	 * Mini logger
	 *
	 * @return {Function}
	 */
	var debug = function() {};

	/**
	 * Normalized rAF
	 *
	 * @type {Function}
	 */
	var raf = win.requestAnimationFrame
	  || win.webkitRequestAnimationFrame
	  || win.mozRequestAnimationFrame
	  || win.msRequestAnimationFrame
	  || function(cb) { return setTimeout(cb, 16); };

	/**
	 * Initialize a `FastDom`.
	 *
	 * @constructor
	 */
	function FastDom() {
	  var self = this;
	  self.reads = [];
	  self.writes = [];
	  self.raf = raf.bind(win); // test hook
	  debug('initialized', self);
	}

	FastDom.prototype = {
	  constructor: FastDom,

	  /**
	   * Adds a job to the read batch and
	   * schedules a new frame if need be.
	   *
	   * @param  {Function} fn
	   * @public
	   */
	  measure: function(fn, ctx) {
	    debug('measure');
	    var task = !ctx ? fn : fn.bind(ctx);
	    this.reads.push(task);
	    scheduleFlush(this);
	    return task;
	  },

	  /**
	   * Adds a job to the
	   * write batch and schedules
	   * a new frame if need be.
	   *
	   * @param  {Function} fn
	   * @public
	   */
	  mutate: function(fn, ctx) {
	    debug('mutate');
	    var task = !ctx ? fn : fn.bind(ctx);
	    this.writes.push(task);
	    scheduleFlush(this);
	    return task;
	  },

	  /**
	   * Clears a scheduled 'read' or 'write' task.
	   *
	   * @param {Object} task
	   * @return {Boolean} success
	   * @public
	   */
	  clear: function(task) {
	    debug('clear', task);
	    return remove(this.reads, task) || remove(this.writes, task);
	  },

	  /**
	   * Extend this FastDom with some
	   * custom functionality.
	   *
	   * Because fastdom must *always* be a
	   * singleton, we're actually extending
	   * the fastdom instance. This means tasks
	   * scheduled by an extension still enter
	   * fastdom's global task queue.
	   *
	   * The 'super' instance can be accessed
	   * from `this.fastdom`.
	   *
	   * @example
	   *
	   * var myFastdom = fastdom.extend({
	   *   initialize: function() {
	   *     // runs on creation
	   *   },
	   *
	   *   // override a method
	   *   measure: function(fn) {
	   *     // do extra stuff ...
	   *
	   *     // then call the original
	   *     return this.fastdom.measure(fn);
	   *   },
	   *
	   *   ...
	   * });
	   *
	   * @param  {Object} props  properties to mixin
	   * @return {FastDom}
	   */
	  extend: function(props) {
	    debug('extend', props);
	    if (typeof props != 'object') throw new Error('expected object');

	    var child = Object.create(this);
	    mixin(child, props);
	    child.fastdom = this;

	    // run optional creation hook
	    if (child.initialize) child.initialize();

	    return child;
	  },

	  // override this with a function
	  // to prevent Errors in console
	  // when tasks throw
	  catch: null
	};

	/**
	 * Schedules a new read/write
	 * batch if one isn't pending.
	 *
	 * @private
	 */
	function scheduleFlush(fastdom) {
	  if (!fastdom.scheduled) {
	    fastdom.scheduled = true;
	    fastdom.raf(flush.bind(null, fastdom));
	    debug('flush scheduled');
	  }
	}

	/**
	 * Runs queued `read` and `write` tasks.
	 *
	 * Errors are caught and thrown by default.
	 * If a `.catch` function has been defined
	 * it is called instead.
	 *
	 * @private
	 */
	function flush(fastdom) {
	  debug('flush');

	  var writes = fastdom.writes;
	  var reads = fastdom.reads;
	  var error;

	  try {
	    debug('flushing reads', reads.length);
	    runTasks(reads);
	    debug('flushing writes', writes.length);
	    runTasks(writes);
	  } catch (e) { error = e; }

	  fastdom.scheduled = false;

	  // If the batch errored we may still have tasks queued
	  if (reads.length || writes.length) scheduleFlush(fastdom);

	  if (error) {
	    debug('task errored', error.message);
	    if (fastdom.catch) fastdom.catch(error);
	    else throw error;
	  }
	}

	/**
	 * We run this inside a try catch
	 * so that if any jobs error, we
	 * are able to recover and continue
	 * to flush the batch until it's empty.
	 *
	 * @private
	 */
	function runTasks(tasks) {
	  debug('run tasks');
	  var task; while (task = tasks.shift()) task();
	}

	/**
	 * Remove an item from an Array.
	 *
	 * @param  {Array} array
	 * @param  {*} item
	 * @return {Boolean}
	 */
	function remove(array, item) {
	  var index = array.indexOf(item);
	  return !!~index && !!array.splice(index, 1);
	}

	/**
	 * Mixin own properties of source
	 * object into the target.
	 *
	 * @param  {Object} target
	 * @param  {Object} source
	 */
	function mixin(target, source) {
	  for (var key in source) {
	    if (source.hasOwnProperty(key)) target[key] = source[key];
	  }
	}

	// There should never be more than
	// one instance of `FastDom` in an app
	var exports = win.fastdom = (win.fastdom || new FastDom()); // jshint ignore:line

	// Expose to CJS & AMD
	if ((typeof define)[0] == 'f') define(function() { return exports; });
	else if ((typeof module)[0] == 'o') module.exports = exports;

	})(commonjsGlobal);
	});

	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	var _extends$1 = Object.assign || function (target) {
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

	var LifecycleHook = function () {
	    function LifecycleHook(component) {
	        classCallCheck(this, LifecycleHook);

	        this.component = component;
	    }
	    /**
	     * [hook When vnode is converted to HTMLElement]
	     * @param  {[type]} node          [HTMLElement]
	     * @param  {[type]} propertyName  [name of property set as hook]
	     * @param  {[type]} previousValue [description]
	     * @return {[type]}               [void]
	     */


	    LifecycleHook.prototype.hook = function hook(node, propertyName, previousValue) {
	        var _this = this;

	        console.log("created", node);
	        this.component.node = node;
	        this.component.createdCallback();
	        /*node.classList.add('ng-enter');*/
	        setTimeout(function () {
	            fastdom.mutate(function () {
	                /*node.classList.remove('ng-enter');                          */
	                _this.component.attachedCallback();
	            });
	        }, 0);
	    };
	    /**
	     * [unhook When a node is removed from dom]
	     * @return {[type]} [description]
	     */


	    LifecycleHook.prototype.unhook = function unhook(node) {
	        console.log("removed", node);
	        this.component.detachedCallback();
	        this.component.unhook();
	    };

	    return LifecycleHook;
	}();

	var _Promise = typeof Promise === 'undefined' ? require('es6-promise').Promise : Promise;

	var Lifecycle = function () {
	    function Lifecycle() {
	        classCallCheck(this, Lifecycle);
	    }

	    Lifecycle.prototype.createdCallback = function createdCallback() {};

	    Lifecycle.prototype.attachedCallback = function attachedCallback() {};

	    Lifecycle.prototype.detachedCallback = function detachedCallback() {};

	    Lifecycle.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
	        return true;
	    };

	    Lifecycle.prototype.componentDidUpdate = function componentDidUpdate() {};

	    Lifecycle.prototype.unhook = function unhook() {
	        this.thunk = null;
	        if (this.unsubscribe) {
	            this.unsubscribe();
	        }
	    };

	    return Lifecycle;
	}();

	var API = function (_Lifecycle) {
	    inherits(API, _Lifecycle);

	    function API() {
	        classCallCheck(this, API);
	        return possibleConstructorReturn(this, _Lifecycle.apply(this, arguments));
	    }

	    API.prototype.setState = function setState(newState) {
	        var _this2 = this;

	        if (this.shouldComponentUpdate(this.props, newState)) {
	            this.state = newState;
	            this.renderSubTree().then(function () {
	                _this2.componentDidUpdate();
	            });
	        }
	    };

	    API.prototype.createStore = function createStore$$() {
	        var store = createStore(this.reducer, this.state, applyMiddleware(logger));
	        return store;
	    };

	    return API;
	}(Lifecycle);

	var Specs = function (_API) {
	    inherits(Specs, _API);

	    function Specs() {
	        classCallCheck(this, Specs);
	        return possibleConstructorReturn(this, _API.apply(this, arguments));
	    }

	    Specs.prototype.reducer = function reducer() {
	        var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	        var action = arguments[1];

	        throw "Define reducer for the store";
	    };

	    Specs.prototype.getName = function getName() {
	        throw "Define getName function which returns string";
	    };

	    Specs.prototype.render = function render() {
	        throw "Define render function which returns VNode";
	    };

	    Specs.prototype.getInitialState = function getInitialState() {
	        return null;
	    };

	    return Specs;
	}(API);

	var VirtualComponent = function (_Specs) {
	    inherits(VirtualComponent, _Specs);

	    function VirtualComponent() {
	        classCallCheck(this, VirtualComponent);

	        var _this4 = possibleConstructorReturn(this, _Specs.apply(this, arguments));

	        _this4.node = null;

	        _this4.props = {
	            hook: new LifecycleHook(_this4)
	        };

	        _this4.state = _this4.getInitialState();
	        if (_this4.state) {
	            _this4.store = _this4.createStore();
	            _this4.unsubscribe = _this4.store.subscribe(function () {
	                _this4.setState(_this4.store.getState());
	            });
	        } else {
	            _this4.store = null;
	        }
	        return _this4;
	    }

	    VirtualComponent.prototype.renderSubTree = function renderSubTree() {
	        var _this5 = this;

	        return new _Promise(function (resolve, reject) {
	            fastdom.mutate(function () {
	                var subTree = _this5.render();
	                var patches = diff_1(_this5.vnode.children[0], subTree);
	                patch(_this5.node.firstChild, patches);
	                _this5.vnode.children[0] = subTree;
	                resolve();
	            });
	        });
	    };

	    return VirtualComponent;
	}(Specs);

	var thunk = undefined;
	var dummy = undefined;

	var Dummy = function (_VirtualComponent) {
	    inherits(Dummy, _VirtualComponent);

	    function Dummy() {
	        classCallCheck(this, Dummy);
	        return possibleConstructorReturn(this, _VirtualComponent.apply(this, arguments));
	    }

	    return Dummy;
	}(VirtualComponent);

	var checkInterface = (function () {
	    QUnit.module("Interface", {
	        beforeEach: function () {
	            thunk = {};
	            dummy = new Dummy(thunk);
	        }
	    });
	    QUnit.test("Member variable should be set with default values", function (assert) {
	        assert.ok(dummy.props, "props is empty object");
	        assert.equal(dummy.state, null, "state is null");
	        assert.equal(dummy.node, null, "node is null");
	        assert.equal(dummy.store, null, "store is null");
	    });

	    QUnit.test("API and Spec methods should be available", function (assert) {
	        assert.ok(dummy.setState);
	        assert.ok(dummy.createStore);
	        assert.ok(!dummy.unsubscribe);
	        assert.ok(dummy.render);
	        assert.ok(dummy.getName);
	        assert.ok(dummy.reducer);
	    });

	    QUnit.test("Spec methods should return default value", function (assert) {
	        try {
	            dummy.render();
	        } catch (msg) {
	            assert.ok(msg, "Render throws error if not implemented in childClass");
	        }
	        try {
	            dummy.getName();
	        } catch (msg) {
	            assert.ok(msg, "getName throws error if not implemented in childClass");
	        }
	        try {
	            dummy.reducer();
	        } catch (msg) {
	            assert.ok(msg, "reducer throws error if not implemented in childClass");
	        }
	        assert.equal(dummy.shouldComponentUpdate(), true, "shouldComponentUpdate returns true by default");
	        assert.equal(dummy.getInitialState(), null, "getInitialState return null by default");
	    });

	    QUnit.test("Lifecycle callbacks should be available", function (assert) {
	        assert.ok(dummy.createdCallback, "createdCallback is available");
	        assert.ok(dummy.attachedCallback, "attachedCallback is available");
	        assert.ok(dummy.detachedCallback, "detachedCallback is available");
	    });
	})

	var version$3 = __moduleExports$33
	var isVNode$4 = __moduleExports$32
	var isWidget$7 = __moduleExports$35
	var isThunk$3 = __moduleExports$37
	var isVHook = __moduleExports$31

	var __moduleExports$46 = VirtualNode

	var noProperties = {}
	var noChildren = []

	function VirtualNode(tagName, properties, children, key, namespace) {
	    this.tagName = tagName
	    this.properties = properties || noProperties
	    this.children = children || noChildren
	    this.key = key != null ? String(key) : undefined
	    this.namespace = (typeof namespace === "string") ? namespace : null

	    var count = (children && children.length) || 0
	    var descendants = 0
	    var hasWidgets = false
	    var hasThunks = false
	    var descendantHooks = false
	    var hooks

	    for (var propName in properties) {
	        if (properties.hasOwnProperty(propName)) {
	            var property = properties[propName]
	            if (isVHook(property) && property.unhook) {
	                if (!hooks) {
	                    hooks = {}
	                }

	                hooks[propName] = property
	            }
	        }
	    }

	    for (var i = 0; i < count; i++) {
	        var child = children[i]
	        if (isVNode$4(child)) {
	            descendants += child.count || 0

	            if (!hasWidgets && child.hasWidgets) {
	                hasWidgets = true
	            }

	            if (!hasThunks && child.hasThunks) {
	                hasThunks = true
	            }

	            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
	                descendantHooks = true
	            }
	        } else if (!hasWidgets && isWidget$7(child)) {
	            if (typeof child.destroy === "function") {
	                hasWidgets = true
	            }
	        } else if (!hasThunks && isThunk$3(child)) {
	            hasThunks = true;
	        }
	    }

	    this.count = count + descendants
	    this.hasWidgets = hasWidgets
	    this.hasThunks = hasThunks
	    this.hooks = hooks
	    this.descendantHooks = descendantHooks
	}

	VirtualNode.prototype.version = version$3
	VirtualNode.prototype.type = "VirtualNode"

	var version$4 = __moduleExports$33

	var __moduleExports$47 = VirtualText

	function VirtualText(text) {
	    this.text = String(text)
	}

	VirtualText.prototype.version = version$4
	VirtualText.prototype.type = "VirtualText"

	/*!
	 * Cross-Browser Split 1.1.1
	 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
	 * Available under the MIT License
	 * ECMAScript compliant, uniform cross-browser split method
	 */

	/**
	 * Splits a string into an array of strings using a regex or string separator. Matches of the
	 * separator are not included in the result array. However, if `separator` is a regex that contains
	 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
	 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
	 * cross-browser.
	 * @param {String} str String to split.
	 * @param {RegExp|String} separator Regex or string to use for separating the string.
	 * @param {Number} [limit] Maximum number of items to include in the result array.
	 * @returns {Array} Array of substrings.
	 * @example
	 *
	 * // Basic use
	 * split('a b c d', ' ');
	 * // -> ['a', 'b', 'c', 'd']
	 *
	 * // With limit
	 * split('a b c d', ' ', 2);
	 * // -> ['a', 'b']
	 *
	 * // Backreferences in result array
	 * split('..word1 word2..', /([a-z]+)(\d+)/i);
	 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
	 */
	var __moduleExports$49 = (function split(undef) {

	  var nativeSplit = String.prototype.split,
	    compliantExecNpcg = /()??/.exec("")[1] === undef,
	    // NPCG: nonparticipating capturing group
	    self;

	  self = function(str, separator, limit) {
	    // If `separator` is not a regex, use `nativeSplit`
	    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
	      return nativeSplit.call(str, separator, limit);
	    }
	    var output = [],
	      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
	      (separator.sticky ? "y" : ""),
	      // Firefox 3+
	      lastLastIndex = 0,
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      separator = new RegExp(separator.source, flags + "g"),
	      separator2, match, lastIndex, lastLength;
	    str += ""; // Type-convert
	    if (!compliantExecNpcg) {
	      // Doesn't need flags gy, but they don't hurt
	      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
	    }
	    /* Values for `limit`, per the spec:
	     * If undefined: 4294967295 // Math.pow(2, 32) - 1
	     * If 0, Infinity, or NaN: 0
	     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
	     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
	     * If other: Type-convert, then use the above rules
	     */
	    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
	    limit >>> 0; // ToUint32(limit)
	    while (match = separator.exec(str)) {
	      // `separator.lastIndex` is not reliable cross-browser
	      lastIndex = match.index + match[0].length;
	      if (lastIndex > lastLastIndex) {
	        output.push(str.slice(lastLastIndex, match.index));
	        // Fix browsers whose `exec` methods don't consistently return `undefined` for
	        // nonparticipating capturing groups
	        if (!compliantExecNpcg && match.length > 1) {
	          match[0].replace(separator2, function() {
	            for (var i = 1; i < arguments.length - 2; i++) {
	              if (arguments[i] === undef) {
	                match[i] = undef;
	              }
	            }
	          });
	        }
	        if (match.length > 1 && match.index < str.length) {
	          Array.prototype.push.apply(output, match.slice(1));
	        }
	        lastLength = match[0].length;
	        lastLastIndex = lastIndex;
	        if (output.length >= limit) {
	          break;
	        }
	      }
	      if (separator.lastIndex === match.index) {
	        separator.lastIndex++; // Avoid an infinite loop
	      }
	    }
	    if (lastLastIndex === str.length) {
	      if (lastLength || !separator.test("")) {
	        output.push("");
	      }
	    } else {
	      output.push(str.slice(lastLastIndex));
	    }
	    return output.length > limit ? output.slice(0, limit) : output;
	  };

	  return self;
	})();

	var split = __moduleExports$49;

	var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
	var notClassId = /^\.|#/;

	var __moduleExports$48 = parseTag$1;

	function parseTag$1(tag, props) {
	    if (!tag) {
	        return 'DIV';
	    }

	    var noId = !(props.hasOwnProperty('id'));

	    var tagParts = split(tag, classIdSplit);
	    var tagName = null;

	    if (notClassId.test(tagParts[1])) {
	        tagName = 'DIV';
	    }

	    var classes, part, type, i;

	    for (i = 0; i < tagParts.length; i++) {
	        part = tagParts[i];

	        if (!part) {
	            continue;
	        }

	        type = part.charAt(0);

	        if (!tagName) {
	            tagName = part;
	        } else if (type === '.') {
	            classes = classes || [];
	            classes.push(part.substring(1, part.length));
	        } else if (type === '#' && noId) {
	            props.id = part.substring(1, part.length);
	        }
	    }

	    if (classes) {
	        if (props.className) {
	            classes.push(props.className);
	        }

	        props.className = classes.join(' ');
	    }

	    return props.namespace ? tagName : tagName.toUpperCase();
	}

	var __moduleExports$50 = SoftSetHook;

	function SoftSetHook(value) {
	    if (!(this instanceof SoftSetHook)) {
	        return new SoftSetHook(value);
	    }

	    this.value = value;
	}

	SoftSetHook.prototype.hook = function (node, propertyName) {
	    if (node[propertyName] !== this.value) {
	        node[propertyName] = this.value;
	    }
	};

	/*global window, global*/

	var root$1 = typeof window !== 'undefined' ?
	    window : typeof commonjsGlobal !== 'undefined' ?
	    commonjsGlobal : {};

	var __moduleExports$54 = Individual$1;

	function Individual$1(key, value) {
	    if (key in root$1) {
	        return root$1[key];
	    }

	    root$1[key] = value;

	    return value;
	}

	var Individual = __moduleExports$54;

	var __moduleExports$53 = OneVersion;

	function OneVersion(moduleName, version, defaultValue) {
	    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
	    var enforceKey = key + '_ENFORCE_SINGLETON';

	    var versionValue = Individual(enforceKey, version);

	    if (versionValue !== version) {
	        throw new Error('Can only have one copy of ' +
	            moduleName + '.\n' +
	            'You already have version ' + versionValue +
	            ' installed.\n' +
	            'This means you cannot install version ' + version);
	    }

	    return Individual(key, defaultValue);
	}

	var OneVersionConstraint = __moduleExports$53;

	var MY_VERSION = '7';
	OneVersionConstraint('ev-store', MY_VERSION);

	var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

	var __moduleExports$52 = EvStore$1;

	function EvStore$1(elem) {
	    var hash = elem[hashKey];

	    if (!hash) {
	        hash = elem[hashKey] = {};
	    }

	    return hash;
	}

	var EvStore = __moduleExports$52;

	var __moduleExports$51 = EvHook;

	function EvHook(value) {
	    if (!(this instanceof EvHook)) {
	        return new EvHook(value);
	    }

	    this.value = value;
	}

	EvHook.prototype.hook = function (node, propertyName) {
	    var es = EvStore(node);
	    var propName = propertyName.substr(3);

	    es[propName] = this.value;
	};

	EvHook.prototype.unhook = function(node, propertyName) {
	    var es = EvStore(node);
	    var propName = propertyName.substr(3);

	    es[propName] = undefined;
	};

	var isArray$4 = __moduleExports$43;

	var VNode = __moduleExports$46;
	var VText = __moduleExports$47;
	var isVNode$3 = __moduleExports$32;
	var isVText$3 = __moduleExports$34;
	var isWidget$6 = __moduleExports$35;
	var isHook$3 = __moduleExports$31;
	var isVThunk = __moduleExports$37;

	var parseTag = __moduleExports$48;
	var softSetHook = __moduleExports$50;
	var evHook = __moduleExports$51;

	var __moduleExports$45 = h$1;

	function h$1(tagName, properties, children) {
	    var childNodes = [];
	    var tag, props, key, namespace;

	    if (!children && isChildren(properties)) {
	        children = properties;
	        props = {};
	    }

	    props = props || properties || {};
	    tag = parseTag(tagName, props);

	    // support keys
	    if (props.hasOwnProperty('key')) {
	        key = props.key;
	        props.key = undefined;
	    }

	    // support namespace
	    if (props.hasOwnProperty('namespace')) {
	        namespace = props.namespace;
	        props.namespace = undefined;
	    }

	    // fix cursor bug
	    if (tag === 'INPUT' &&
	        !namespace &&
	        props.hasOwnProperty('value') &&
	        props.value !== undefined &&
	        !isHook$3(props.value)
	    ) {
	        if (props.value !== null && typeof props.value !== 'string') {
	            throw UnsupportedValueType({
	                expected: 'String',
	                received: typeof props.value,
	                Vnode: {
	                    tagName: tag,
	                    properties: props
	                }
	            });
	        }
	        props.value = softSetHook(props.value);
	    }

	    transformProperties(props);

	    if (children !== undefined && children !== null) {
	        addChild(children, childNodes, tag, props);
	    }


	    return new VNode(tag, props, childNodes, key, namespace);
	}

	function addChild(c, childNodes, tag, props) {
	    if (typeof c === 'string') {
	        childNodes.push(new VText(c));
	    } else if (typeof c === 'number') {
	        childNodes.push(new VText(String(c)));
	    } else if (isChild(c)) {
	        childNodes.push(c);
	    } else if (isArray$4(c)) {
	        for (var i = 0; i < c.length; i++) {
	            addChild(c[i], childNodes, tag, props);
	        }
	    } else if (c === null || c === undefined) {
	        return;
	    } else {
	        throw UnexpectedVirtualElement({
	            foreignObject: c,
	            parentVnode: {
	                tagName: tag,
	                properties: props
	            }
	        });
	    }
	}

	function transformProperties(props) {
	    for (var propName in props) {
	        if (props.hasOwnProperty(propName)) {
	            var value = props[propName];

	            if (isHook$3(value)) {
	                continue;
	            }

	            if (propName.substr(0, 3) === 'ev-') {
	                // add ev-foo support
	                props[propName] = evHook(value);
	            }
	        }
	    }
	}

	function isChild(x) {
	    return isVNode$3(x) || isVText$3(x) || isWidget$6(x) || isVThunk(x);
	}

	function isChildren(x) {
	    return typeof x === 'string' || isArray$4(x) || isChild(x);
	}

	function UnexpectedVirtualElement(data) {
	    var err = new Error();

	    err.type = 'virtual-hyperscript.unexpected.virtual-element';
	    err.message = 'Unexpected virtual child passed to h().\n' +
	        'Expected a VNode / Vthunk / VWidget / string but:\n' +
	        'got:\n' +
	        errorString(data.foreignObject) +
	        '.\n' +
	        'The parent vnode is:\n' +
	        errorString(data.parentVnode)
	        '\n' +
	        'Suggested fix: change your `h(..., [ ... ])` callsite.';
	    err.foreignObject = data.foreignObject;
	    err.parentVnode = data.parentVnode;

	    return err;
	}

	function UnsupportedValueType(data) {
	    var err = new Error();

	    err.type = 'virtual-hyperscript.unsupported.value-type';
	    err.message = 'Unexpected value type for input passed to h().\n' +
	        'Expected a ' +
	        errorString(data.expected) +
	        ' but got:\n' +
	        errorString(data.received) +
	        '.\n' +
	        'The vnode is:\n' +
	        errorString(data.Vnode)
	        '\n' +
	        'Suggested fix: Cast the value passed to h() to a string using String(value).';
	    err.Vnode = data.Vnode;

	    return err;
	}

	function errorString(obj) {
	    try {
	        return JSON.stringify(obj, null, '    ');
	    } catch (e) {
	        return String(obj);
	    }
	}

	var h = __moduleExports$45

	var h_1 = h

	function Thunk(fn, args, key, eqArgs) {
	    this.fn = fn;
	    this.args = args;
	    this.key = key;
	    this.eqArgs = eqArgs;
	}

	Thunk.prototype.type = 'Thunk';
	Thunk.prototype.render = render$1;
	var immutableThunk = Thunk;

	function shouldUpdate(current, previous) {
	    if (!current || !previous || current.fn !== previous.fn) {
	        return true;
	    }

	    var cargs = current.args;
	    var pargs = previous.args;

	    return !current.eqArgs(cargs, pargs);
	}

	function render$1(previous) {

	    if (shouldUpdate(this, previous)) {
	        //return this.fn.apply(null, this.args);               
	        return this.fn.apply(null, [previous, this]);
	    } else {
	        return previous.vnode;
	    }
	}

	//Shallow comparator of args
	var eqFn = function (cargs, pargs) {
	    for (var key in cargs) {
	        if (cargs[key] != pargs[key]) {
	            return false;
	        }
	    }
	    return true;
	};

	var GenericThunk = function (_immutableThunk) {
	    inherits(GenericThunk, _immutableThunk);

	    function GenericThunk(componentClass, fn, args) {
	        classCallCheck(this, GenericThunk);

	        var key = undefined;
	        if (args) {
	            key = args.key || null;
	        }

	        var _this = possibleConstructorReturn(this, _immutableThunk.call(this, fn, args, key, eqFn));

	        _this.componentClass = componentClass;
	        if (args) {
	            _this.transition = args.transition || null;
	        }

	        return _this;
	    }

	    GenericThunk.prototype.render = function render(previous) {
	        if (previous) {
	            this.component = previous.component;
	        }
	        return _immutableThunk.prototype.render.call(this, previous);
	    };

	    return GenericThunk;
	}(immutableThunk);

	/*let renderFn = function(previous, current) {   
	    
	    var item = h(current.component.getName(), current.component.props, current.component.render(current.component.props));

	    return item;
	}
	*/

	/**
	 * [renderFn Called only when props have changes or previous thunk not available]
	 * @param  {[type]} previous [description]
	 * @param  {[type]} current  [description]
	 * @return {[type]}          [description]
	 */
	var renderFn = function (previous, current) {
	    var component = undefined;

	    if (!previous) {
	        component = current.component = new current.componentClass(current.args);
	    } else {
	        component = current.component;
	    }
	    component.props = _extends$1({}, component.props, current.args);

	    component.vnode = h_1(component.getName(), component.props, component.render(component.props));
	    component.vnode.transition = component.props.transition || null;
	    return component.vnode;
	};

	function hyperScript(tagName, properties, children) {
	    var tree, element, children;
	    if (arguments.length >= 3) {
	        children = Array.prototype.slice.call(arguments, 2);
	    }

	    if (typeof tagName != "string") {
	        //return new Thunk(tagName, renderFn, properties);
	        return new GenericThunk(tagName, renderFn, properties);
	    }
	    return h_1(tagName, properties, children);
	}

	var _Promise$1 = typeof Promise === 'undefined' ? require('es6-promise').Promise : Promise;

	var Batch = function () {

	    /**
	     * [constructor Creates an object for batch process]
	     * @param  {[type]} initialState [Initial state to render]
	     * @param  {[type]} render       [Render function]
	     * @param  {[type]} initialTree  [Optional, A Vtree to do diff with]
	     * @param  {[type]} rootNode     [Optional, A node to batch changes into]
	     * @return {[type]}              [description,]
	     */

	    function Batch(initialState, render) {
	        classCallCheck(this, Batch);

	        this.render = render;
	        this.tree = this.render(initialState);
	        this.rootNode = createElement_1(this.tree);
	    }

	    /**
	     * [update Queue rendering with new state]
	     * @param  {[type]} newState [New state to render]
	     * @param  {Function} callback [Callback to run after dom patch]
	     * @return {[type]}          [description]
	     * 
	     */

	    Batch.prototype.update = function update(newState) {
	        var _this = this;

	        return new _Promise$1(function (resolve, reject) {
	            var newTree = _this.render(newState);
	            var patches = diff_1(_this.tree, newTree);

	            fastdom.mutate(function () {
	                _this.rootNode = patch(_this.rootNode, patches);
	                _this.tree = newTree;
	                resolve();
	            });
	        });
	    };

	    return Batch;
	}();

	function batch () {
	    return new (Function.prototype.bind.apply(Batch, [null].concat(Array.prototype.slice.call(arguments))))();
	}

	var batcher = undefined;

	var Counter = function (_VirtualComponent) {
	    inherits(Counter, _VirtualComponent);

	    function Counter() {
	        classCallCheck(this, Counter);
	        return possibleConstructorReturn(this, _VirtualComponent.apply(this, arguments));
	    }

	    Counter.prototype.getName = function getName() {
	        return "counter";
	    };

	    Counter.prototype.shouldComponentUpdate = function shouldComponentUpdate(newProps, newState) {
	        if (this.props.count != newProps.count) {
	            return true;
	        }
	        return false;
	    };

	    Counter.prototype.render = function render(_ref) {
	        var count = _ref.count;

	        return hyperScript(
	            "div",
	            null,
	            count
	        );
	    };

	    Counter.prototype.createdCallback = function createdCallback() {
	        var _this2 = this;

	        QUnit.test("Node should be created in createdCallback", function (assert) {
	            assert.equal(_this2.node.nodeType, 1);
	        });
	    };

	    Counter.prototype.attachedCallback = function attachedCallback() {
	        var _this3 = this;

	        QUnit.test("Node should be attached in attachedCallback", function (assert) {
	            assert.ok(document.body.contains(_this3.node));
	            //Test detached callback
	            batcher.update({ showCounter: false });
	        });
	    };

	    Counter.prototype.detachedCallback = function detachedCallback() {
	        var _this4 = this;

	        QUnit.test("Node should be removed from DOM in detachedCallback", function (assert) {
	            assert.ok(!document.body.contains(_this4.node));
	        });
	    };

	    return Counter;
	}(VirtualComponent);

	var Main = function () {
	    Main.prototype.render = function render(_ref2) {
	        var showCounter = _ref2.showCounter;
	        var count = _ref2.count;

	        var counter = showCounter ? hyperScript(Counter, { count: count }) : "";
	        return hyperScript(
	            "div",
	            null,
	            counter
	        );
	    };

	    Main.prototype.getInitialState = function getInitialState() {
	        return {
	            count: 0,
	            showCounter: true
	        };
	    };

	    function Main() {
	        classCallCheck(this, Main);

	        var body = document.body;
	        batcher = batch(this.getInitialState(), this.render);
	        body.appendChild(batcher.rootNode);
	    }

	    return Main;
	}();

	var checkLifecycle = (function () {
	    new Main();
	})

	var batcher$1 = undefined;

	var Counter$1 = function (_VirtualComponent) {
	    inherits(Counter, _VirtualComponent);

	    function Counter() {
	        classCallCheck(this, Counter);
	        return possibleConstructorReturn(this, _VirtualComponent.apply(this, arguments));
	    }

	    Counter.prototype.getName = function getName() {
	        return "counter";
	    };

	    Counter.prototype.shouldComponentUpdate = function shouldComponentUpdate(newProps, newState) {
	        if (this.props.count != newProps.count) {
	            return true;
	        }
	        return false;
	    };

	    Counter.prototype.render = function render(_ref) {
	        var count = _ref.count;

	        return hyperScript(
	            "div",
	            null,
	            count
	        );
	    };

	    Counter.prototype.createdCallback = function createdCallback() {};

	    Counter.prototype.attachedCallback = function attachedCallback() {
	        var _this2 = this;

	        //Test for initial props
	        QUnit.test("Should render props", function (assert) {
	            assert.equal(_this2.node.innerHTML, "<div>0</div>");
	        });

	        QUnit.test("Should render updated props", function (assert) {
	            var done = assert.async();

	            var previousVnode = _this2.vnode.children[0];

	            //Test for new props
	            batcher$1.update({ count: 1 }).then(function () {
	                assert.ok(_this2.vnode.children[0] != previousVnode);
	                assert.equal(_this2.node.innerHTML, "<div>1</div>");
	                done();

	                //Test for same props
	                var previousVnode = _this2.vnode.children[0];
	                QUnit.test("Should not render with same props", function (assert) {
	                    var done = assert.async();
	                    batcher$1.update({ count: 1 }).then(function () {
	                        assert.ok(_this2.vnode.children[0] == previousVnode);
	                        assert.equal(_this2.node.innerHTML, "<div>1</div>");
	                        done();
	                    });
	                });
	            });
	        });
	    };

	    return Counter;
	}(VirtualComponent);

	var Main$1 = function () {
	    Main.prototype.render = function render(_ref2) {
	        var count = _ref2.count;

	        return hyperScript(Counter$1, { count: count });
	    };

	    Main.prototype.getInitialState = function getInitialState() {
	        return {
	            count: 0
	        };
	    };

	    function Main() {
	        classCallCheck(this, Main);

	        var body = document.body;
	        batcher$1 = batch(this.getInitialState(), this.render);
	        body.appendChild(batcher$1.rootNode);
	    }

	    return Main;
	}();

	var checkRenderProps = (function () {
	    new Main$1();
	})

	var batcher$2 = undefined;
	var previousSubtree = null;

	var Counter$2 = function (_VirtualComponent) {
	    inherits(Counter, _VirtualComponent);

	    function Counter() {
	        classCallCheck(this, Counter);
	        return possibleConstructorReturn(this, _VirtualComponent.apply(this, arguments));
	    }

	    Counter.prototype.getName = function getName() {
	        return "counter";
	    };

	    Counter.prototype.getInitialState = function getInitialState() {
	        return {
	            count: 0
	        };
	    };

	    Counter.prototype.shouldComponentUpdate = function shouldComponentUpdate(newProps, newState) {
	        var _this2 = this;

	        if (this.state != newState) {
	            return true;
	        }

	        QUnit.test("Should not render with same state", function (assert) {
	            assert.ok(_this2.vnode.children[0] == previousSubtree);
	            assert.equal(_this2.node.innerHTML, "<div>1</div>");
	        });

	        return false;
	    };

	    Counter.prototype.reducer = function reducer(state, action) {
	        switch (action.type) {
	            case "UPDATE":
	                if (state.count != action.count) {
	                    return _extends$1({}, state, { "count": action.count });
	                }
	            default:
	                return state;
	        }
	    };

	    Counter.prototype.render = function render() {
	        return hyperScript(
	            "div",
	            null,
	            this.state.count
	        );
	    };

	    Counter.prototype.createdCallback = function createdCallback() {};

	    Counter.prototype.attachedCallback = function attachedCallback() {
	        var _this3 = this;

	        //Test for initial state
	        QUnit.test("Should render state", function (assert) {
	            assert.equal(_this3.node.innerHTML, "<div>0</div>");
	        });

	        previousSubtree = this.vnode.children[0];

	        this.store.dispatch({
	            type: "UPDATE",
	            count: 1
	        });
	    };

	    Counter.prototype.componentDidUpdate = function componentDidUpdate() {
	        var _this4 = this;

	        QUnit.test("Should render updated state", function (assert) {
	            assert.ok(_this4.vnode.children[0] != previousSubtree);
	            assert.equal(_this4.node.innerHTML, "<div>1</div>");
	        });

	        previousSubtree = this.vnode.children[0];
	        this.store.dispatch({
	            type: "UPDATE",
	            count: 1
	        });
	    };

	    return Counter;
	}(VirtualComponent);

	var Main$2 = function () {
	    Main.prototype.render = function render() {
	        return hyperScript(Counter$2, null);
	    };

	    function Main() {
	        classCallCheck(this, Main);

	        var body = document.body;
	        batcher$2 = batch({}, this.render);
	        body.appendChild(batcher$2.rootNode);
	    }

	    return Main;
	}();

	var checkRenderState = (function () {
	    new Main$2();
	})

	checkInterface();

	QUnit.module("Lifecycle");
	checkLifecycle();

	setTimeout(function () {
	    QUnit.module("Rendering props");
	    checkRenderProps();

	    setTimeout(function () {
	        QUnit.module("Rendering State");
	        checkRenderState();
	    }, 1000);
	}, 1000);

}());
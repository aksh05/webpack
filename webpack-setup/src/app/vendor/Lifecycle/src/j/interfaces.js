(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global){
(function () {
    'use strict';

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
    var hasOwnProperty$1 = objectProto.hasOwnProperty;

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
      var Ctor = hasOwnProperty$1.call(proto, 'constructor') && proto.constructor;
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

    function getUndefinedStateErrorMessage(key, action) {
      var actionType = action && action.type;
      var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

      return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
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

        if ("production" !== 'production') {}

        if (typeof reducers[key] === 'function') {
          finalReducers[key] = reducers[key];
        }
      }
      var finalReducerKeys = Object.keys(finalReducers);

      if ("production" !== 'production') {}

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

        if ("production" !== 'production') {}

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

    function bindActionCreator(actionCreator, dispatch) {
      return function () {
        return dispatch(actionCreator.apply(undefined, arguments));
      };
    }

    /**
     * Turns an object whose values are action creators, into an object with the
     * same keys, but with every function wrapped into a `dispatch` call so they
     * may be invoked directly. This is just a convenience method, as you can call
     * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
     *
     * For convenience, you can also pass a single function as the first argument,
     * and get a function in return.
     *
     * @param {Function|Object} actionCreators An object whose values are action
     * creator functions. One handy way to obtain it is to use ES6 `import * as`
     * syntax. You may also pass a single function.
     *
     * @param {Function} dispatch The `dispatch` function available on your Redux
     * store.
     *
     * @returns {Function|Object} The object mimicking the original object, but with
     * every action creator wrapped into the `dispatch` call. If you passed a
     * function as `actionCreators`, the return value will also be a single
     * function.
     */
    function bindActionCreators(actionCreators, dispatch) {
      if (typeof actionCreators === 'function') {
        return bindActionCreator(actionCreators, dispatch);
      }

      if (typeof actionCreators !== 'object' || actionCreators === null) {
        throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
      }

      var keys = Object.keys(actionCreators);
      var boundActionCreators = {};
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var actionCreator = actionCreators[key];
        if (typeof actionCreator === 'function') {
          boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
        }
      }
      return boundActionCreators;
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



    var Redux = Object.freeze({
      createStore: createStore,
      combineReducers: combineReducers,
      bindActionCreators: bindActionCreators,
      applyMiddleware: applyMiddleware,
      compose: compose
    });

    /* eslint-disable no-unused-vars */
    var hasOwnProperty$2 = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;

    function toObject(val) {
    	if (val === null || val === undefined) {
    		throw new TypeError('Object.assign cannot be called with null or undefined');
    	}

    	return Object(val);
    }

    function shouldUseNative() {
    	try {
    		if (!Object.assign) {
    			return false;
    		}

    		// Detect buggy property enumeration order in older V8 versions.

    		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
    		var test1 = new String('abc');  // eslint-disable-line
    		test1[5] = 'de';
    		if (Object.getOwnPropertyNames(test1)[0] === '5') {
    			return false;
    		}

    		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
    		var test2 = {};
    		for (var i = 0; i < 10; i++) {
    			test2['_' + String.fromCharCode(i)] = i;
    		}
    		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
    			return test2[n];
    		});
    		if (order2.join('') !== '0123456789') {
    			return false;
    		}

    		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
    		var test3 = {};
    		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
    			test3[letter] = letter;
    		});
    		if (Object.keys(Object.assign({}, test3)).join('') !==
    				'abcdefghijklmnopqrst') {
    			return false;
    		}

    		return true;
    	} catch (e) {
    		// We don't expect any of the above to throw, but better to be safe.
    		return false;
    	}
    }

    var __moduleExports$1 = shouldUseNative() ? Object.assign : function (target, source) {
    	var from;
    	var to = toObject(target);
    	var symbols;

    	for (var s = 1; s < arguments.length; s++) {
    		from = Object(arguments[s]);

    		for (var key in from) {
    			if (hasOwnProperty$2.call(from, key)) {
    				to[key] = from[key];
    			}
    		}

    		if (Object.getOwnPropertySymbols) {
    			symbols = Object.getOwnPropertySymbols(from);
    			for (var i = 0; i < symbols.length; i++) {
    				if (propIsEnumerable.call(from, symbols[i])) {
    					to[symbols[i]] = from[symbols[i]];
    				}
    			}
    		}
    	}

    	return to;
    };

    /**
     * WARNING: DO NOT manually require this module.
     * This is a replacement for `invariant(...)` used by the error code system
     * and will _only_ be required by the corresponding babel pass.
     * It always throws.
     */

    function reactProdInvariant(code) {
      var argCount = arguments.length - 1;

      var message = 'Minified React error #' + code + '; visit ' + 'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

      for (var argIdx = 0; argIdx < argCount; argIdx++) {
        message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
      }

      message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';

      var error = new Error(message);
      error.name = 'Invariant Violation';
      error.framesToPop = 1; // we don't care about reactProdInvariant's own frame

      throw error;
    }

    var __moduleExports$4 = reactProdInvariant;

    /**
     * Use invariant() to assert state which your program assumes to be true.
     *
     * Provide sprintf-style format (only %s is supported) and arguments
     * to provide information about what broke and what you were
     * expecting.
     *
     * The invariant message will be stripped in production, but the invariant
     * will remain to ensure logic does not differ in production.
     */

    function invariant$1(condition, format, a, b, c, d, e, f) {
      if ("production" !== 'production') {}

      if (!condition) {
        var error;
        if (format === undefined) {
          error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
        } else {
          var args = [a, b, c, d, e, f];
          var argIndex = 0;
          error = new Error(format.replace(/%s/g, function () {
            return args[argIndex++];
          }));
          error.name = 'Invariant Violation';
        }

        error.framesToPop = 1; // we don't care about invariant's own frame
        throw error;
      }
    }

    var __moduleExports$5 = invariant$1;

    var _prodInvariant = __moduleExports$4;

    var invariant = __moduleExports$5;

    /**
     * Static poolers. Several custom versions for each potential number of
     * arguments. A completely generic pooler is easy to implement, but would
     * require accessing the `arguments` object. In each of these, `this` refers to
     * the Class itself, not an instance. If any others are needed, simply add them
     * here, or in their own files.
     */
    var oneArgumentPooler = function (copyFieldsFrom) {
      var Klass = this;
      if (Klass.instancePool.length) {
        var instance = Klass.instancePool.pop();
        Klass.call(instance, copyFieldsFrom);
        return instance;
      } else {
        return new Klass(copyFieldsFrom);
      }
    };

    var twoArgumentPooler$1 = function (a1, a2) {
      var Klass = this;
      if (Klass.instancePool.length) {
        var instance = Klass.instancePool.pop();
        Klass.call(instance, a1, a2);
        return instance;
      } else {
        return new Klass(a1, a2);
      }
    };

    var threeArgumentPooler = function (a1, a2, a3) {
      var Klass = this;
      if (Klass.instancePool.length) {
        var instance = Klass.instancePool.pop();
        Klass.call(instance, a1, a2, a3);
        return instance;
      } else {
        return new Klass(a1, a2, a3);
      }
    };

    var fourArgumentPooler$1 = function (a1, a2, a3, a4) {
      var Klass = this;
      if (Klass.instancePool.length) {
        var instance = Klass.instancePool.pop();
        Klass.call(instance, a1, a2, a3, a4);
        return instance;
      } else {
        return new Klass(a1, a2, a3, a4);
      }
    };

    var fiveArgumentPooler = function (a1, a2, a3, a4, a5) {
      var Klass = this;
      if (Klass.instancePool.length) {
        var instance = Klass.instancePool.pop();
        Klass.call(instance, a1, a2, a3, a4, a5);
        return instance;
      } else {
        return new Klass(a1, a2, a3, a4, a5);
      }
    };

    var standardReleaser = function (instance) {
      var Klass = this;
      !(instance instanceof Klass) ? _prodInvariant('25') : void 0;
      instance.destructor();
      if (Klass.instancePool.length < Klass.poolSize) {
        Klass.instancePool.push(instance);
      }
    };

    var DEFAULT_POOL_SIZE = 10;
    var DEFAULT_POOLER = oneArgumentPooler;

    /**
     * Augments `CopyConstructor` to be a poolable class, augmenting only the class
     * itself (statically) not adding any prototypical fields. Any CopyConstructor
     * you give this may have a `poolSize` property, and will look for a
     * prototypical `destructor` on instances.
     *
     * @param {Function} CopyConstructor Constructor that can be used to reset.
     * @param {Function} pooler Customizable pooler.
     */
    var addPoolingTo = function (CopyConstructor, pooler) {
      var NewKlass = CopyConstructor;
      NewKlass.instancePool = [];
      NewKlass.getPooled = pooler || DEFAULT_POOLER;
      if (!NewKlass.poolSize) {
        NewKlass.poolSize = DEFAULT_POOL_SIZE;
      }
      NewKlass.release = standardReleaser;
      return NewKlass;
    };

    var PooledClass$1 = {
      addPoolingTo: addPoolingTo,
      oneArgumentPooler: oneArgumentPooler,
      twoArgumentPooler: twoArgumentPooler$1,
      threeArgumentPooler: threeArgumentPooler,
      fourArgumentPooler: fourArgumentPooler$1,
      fiveArgumentPooler: fiveArgumentPooler
    };

    var __moduleExports$3 = PooledClass$1;

    /**
     * Keeps track of the current owner.
     *
     * The current owner is the component who should own any components that are
     * currently being constructed.
     */

    var ReactCurrentOwner$1 = {

      /**
       * @internal
       * @type {ReactComponent}
       */
      current: null

    };

    var __moduleExports$7 = ReactCurrentOwner$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * 
     */

    function makeEmptyFunction(arg) {
      return function () {
        return arg;
      };
    }

    /**
     * This function accepts and discards inputs; it has no side effects. This is
     * primarily useful idiomatically for overridable function endpoints which
     * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
     */
    var emptyFunction$2 = function emptyFunction() {};

    emptyFunction$2.thatReturns = makeEmptyFunction;
    emptyFunction$2.thatReturnsFalse = makeEmptyFunction(false);
    emptyFunction$2.thatReturnsTrue = makeEmptyFunction(true);
    emptyFunction$2.thatReturnsNull = makeEmptyFunction(null);
    emptyFunction$2.thatReturnsThis = function () {
      return this;
    };
    emptyFunction$2.thatReturnsArgument = function (arg) {
      return arg;
    };

    var __moduleExports$9 = emptyFunction$2;

    var emptyFunction$1 = __moduleExports$9;

    /**
     * Similar to invariant but only logs a warning if the condition is not met.
     * This can be used to log issues in development environments in critical
     * paths. Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
     */

    var warning$3 = emptyFunction$1;

    var __moduleExports$8 = warning$3;

    var _assign$1 = __moduleExports$1;

    var ReactCurrentOwner = __moduleExports$7;

    var hasOwnProperty$3 = Object.prototype.hasOwnProperty;

    // The Symbol used to tag the ReactElement type. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.
    var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

    var RESERVED_PROPS = {
      key: true,
      ref: true,
      __self: true,
      __source: true
    };

    function hasValidRef(config) {
      if ("production" !== 'production') {}
      return config.ref !== undefined;
    }

    function hasValidKey(config) {
      if ("production" !== 'production') {}
      return config.key !== undefined;
    }

    /**
     * Factory method to create a new React element. This no longer adheres to
     * the class pattern, so do not use new to call it. Also, no instanceof check
     * will work. Instead test $$typeof field against Symbol.for('react.element') to check
     * if something is a React Element.
     *
     * @param {*} type
     * @param {*} key
     * @param {string|object} ref
     * @param {*} self A *temporary* helper to detect places where `this` is
     * different from the `owner` when React.createElement is called, so that we
     * can warn. We want to get rid of owner and replace string `ref`s with arrow
     * functions, and as long as `this` and owner are the same, there will be no
     * change in behavior.
     * @param {*} source An annotation object (added by a transpiler or otherwise)
     * indicating filename, line number, and/or other information.
     * @param {*} owner
     * @param {*} props
     * @internal
     */
    var ReactElement$2 = function (type, key, ref, self, source, owner, props) {
      var element = {
        // This tag allow us to uniquely identify this as a React Element
        $$typeof: REACT_ELEMENT_TYPE,

        // Built-in properties that belong on the element
        type: type,
        key: key,
        ref: ref,
        props: props,

        // Record the component responsible for creating this element.
        _owner: owner
      };

      if ("production" !== 'production') {}

      return element;
    };

    /**
     * Create and return a new ReactElement of the given type.
     * See https://facebook.github.io/react/docs/top-level-api.html#react.createelement
     */
    ReactElement$2.createElement = function (type, config, children) {
      var propName;

      // Reserved names are extracted
      var props = {};

      var key = null;
      var ref = null;
      var self = null;
      var source = null;

      if (config != null) {
        if ("production" !== 'production') {}

        if (hasValidRef(config)) {
          ref = config.ref;
        }
        if (hasValidKey(config)) {
          key = '' + config.key;
        }

        self = config.__self === undefined ? null : config.__self;
        source = config.__source === undefined ? null : config.__source;
        // Remaining properties are added to a new props object
        for (propName in config) {
          if (hasOwnProperty$3.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
            props[propName] = config[propName];
          }
        }
      }

      // Children can be more than one argument, and those are transferred onto
      // the newly allocated props object.
      var childrenLength = arguments.length - 2;
      if (childrenLength === 1) {
        props.children = children;
      } else if (childrenLength > 1) {
        var childArray = Array(childrenLength);
        for (var i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2];
        }
        props.children = childArray;
      }

      // Resolve default props
      if (type && type.defaultProps) {
        var defaultProps = type.defaultProps;
        for (propName in defaultProps) {
          if (props[propName] === undefined) {
            props[propName] = defaultProps[propName];
          }
        }
      }
      if ("production" !== 'production') {}
      return ReactElement$2(type, key, ref, self, source, ReactCurrentOwner.current, props);
    };

    /**
     * Return a function that produces ReactElements of a given type.
     * See https://facebook.github.io/react/docs/top-level-api.html#react.createfactory
     */
    ReactElement$2.createFactory = function (type) {
      var factory = ReactElement$2.createElement.bind(null, type);
      // Expose the type on the factory and the prototype so that it can be
      // easily accessed on elements. E.g. `<Foo />.type === Foo`.
      // This should not be named `constructor` since this may not be the function
      // that created the element, and it may not even be a constructor.
      // Legacy hook TODO: Warn if this is accessed
      factory.type = type;
      return factory;
    };

    ReactElement$2.cloneAndReplaceKey = function (oldElement, newKey) {
      var newElement = ReactElement$2(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

      return newElement;
    };

    /**
     * Clone and return a new ReactElement using element as the starting point.
     * See https://facebook.github.io/react/docs/top-level-api.html#react.cloneelement
     */
    ReactElement$2.cloneElement = function (element, config, children) {
      var propName;

      // Original props are copied
      var props = _assign$1({}, element.props);

      // Reserved names are extracted
      var key = element.key;
      var ref = element.ref;
      // Self is preserved since the owner is preserved.
      var self = element._self;
      // Source is preserved since cloneElement is unlikely to be targeted by a
      // transpiler, and the original source is probably a better indicator of the
      // true owner.
      var source = element._source;

      // Owner will be preserved, unless ref is overridden
      var owner = element._owner;

      if (config != null) {
        if ("production" !== 'production') {}

        if (hasValidRef(config)) {
          // Silently steal the ref from the parent.
          ref = config.ref;
          owner = ReactCurrentOwner.current;
        }
        if (hasValidKey(config)) {
          key = '' + config.key;
        }

        // Remaining properties override existing props
        var defaultProps;
        if (element.type && element.type.defaultProps) {
          defaultProps = element.type.defaultProps;
        }
        for (propName in config) {
          if (hasOwnProperty$3.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
            if (config[propName] === undefined && defaultProps !== undefined) {
              // Resolve default props
              props[propName] = defaultProps[propName];
            } else {
              props[propName] = config[propName];
            }
          }
        }
      }

      // Children can be more than one argument, and those are transferred onto
      // the newly allocated props object.
      var childrenLength = arguments.length - 2;
      if (childrenLength === 1) {
        props.children = children;
      } else if (childrenLength > 1) {
        var childArray = Array(childrenLength);
        for (var i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2];
        }
        props.children = childArray;
      }

      return ReactElement$2(element.type, key, ref, self, source, owner, props);
    };

    /**
     * Verifies the object is a ReactElement.
     * See https://facebook.github.io/react/docs/top-level-api.html#react.isvalidelement
     * @param {?object} object
     * @return {boolean} True if `object` is a valid component.
     * @final
     */
    ReactElement$2.isValidElement = function (object) {
      return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
    };

    ReactElement$2.REACT_ELEMENT_TYPE = REACT_ELEMENT_TYPE;

    var __moduleExports$6 = ReactElement$2;

    /* global Symbol */

    var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
    var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

    /**
     * Returns the iterator method function contained on the iterable object.
     *
     * Be sure to invoke the function with the iterable as context:
     *
     *     var iteratorFn = getIteratorFn(myIterable);
     *     if (iteratorFn) {
     *       var iterator = iteratorFn.call(myIterable);
     *       ...
     *     }
     *
     * @param {?object} maybeIterable
     * @return {?function}
     */
    function getIteratorFn$1(maybeIterable) {
      var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
      if (typeof iteratorFn === 'function') {
        return iteratorFn;
      }
    }

    var __moduleExports$12 = getIteratorFn$1;

    /**
     * Escape and wrap key so it is safe to use as a reactid
     *
     * @param {string} key to be escaped.
     * @return {string} the escaped key.
     */

    function escape(key) {
      var escapeRegex = /[=:]/g;
      var escaperLookup = {
        '=': '=0',
        ':': '=2'
      };
      var escapedString = ('' + key).replace(escapeRegex, function (match) {
        return escaperLookup[match];
      });

      return '$' + escapedString;
    }

    /**
     * Unescape and unwrap key for human-readable display
     *
     * @param {string} key to unescape.
     * @return {string} the unescaped key.
     */
    function unescape(key) {
      var unescapeRegex = /(=0|=2)/g;
      var unescaperLookup = {
        '=0': '=',
        '=2': ':'
      };
      var keySubstring = key[0] === '.' && key[1] === '$' ? key.substring(2) : key.substring(1);

      return ('' + keySubstring).replace(unescapeRegex, function (match) {
        return unescaperLookup[match];
      });
    }

    var KeyEscapeUtils$1 = {
      escape: escape,
      unescape: unescape
    };

    var __moduleExports$13 = KeyEscapeUtils$1;

    var _prodInvariant$1 = __moduleExports$4;

    var ReactCurrentOwner$2 = __moduleExports$7;
    var ReactElement$3 = __moduleExports$6;

    var getIteratorFn = __moduleExports$12;
    var invariant$2 = __moduleExports$5;
    var KeyEscapeUtils = __moduleExports$13;
    var SEPARATOR = '.';
    var SUBSEPARATOR = ':';

    /**
     * Generate a key string that identifies a component within a set.
     *
     * @param {*} component A component that could contain a manual key.
     * @param {number} index Index that is used if a manual key is not provided.
     * @return {string}
     */
    function getComponentKey(component, index) {
      // Do some typechecking here since we call this blindly. We want to ensure
      // that we don't block potential future ES APIs.
      if (component && typeof component === 'object' && component.key != null) {
        // Explicit key
        return KeyEscapeUtils.escape(component.key);
      }
      // Implicit key determined by the index in the set
      return index.toString(36);
    }

    /**
     * @param {?*} children Children tree container.
     * @param {!string} nameSoFar Name of the key path so far.
     * @param {!function} callback Callback to invoke with each child found.
     * @param {?*} traverseContext Used to pass information throughout the traversal
     * process.
     * @return {!number} The number of children in this subtree.
     */
    function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
      var type = typeof children;

      if (type === 'undefined' || type === 'boolean') {
        // All of the above are perceived as null.
        children = null;
      }

      if (children === null || type === 'string' || type === 'number' || ReactElement$3.isValidElement(children)) {
        callback(traverseContext, children,
        // If it's the only child, treat the name as if it was wrapped in an array
        // so that it's consistent if the number of children grows.
        nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
        return 1;
      }

      var child;
      var nextName;
      var subtreeCount = 0; // Count of children found in the current subtree.
      var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

      if (Array.isArray(children)) {
        for (var i = 0; i < children.length; i++) {
          child = children[i];
          nextName = nextNamePrefix + getComponentKey(child, i);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else {
        var iteratorFn = getIteratorFn(children);
        if (iteratorFn) {
          var iterator = iteratorFn.call(children);
          var step;
          if (iteratorFn !== children.entries) {
            var ii = 0;
            while (!(step = iterator.next()).done) {
              child = step.value;
              nextName = nextNamePrefix + getComponentKey(child, ii++);
              subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
            }
          } else {
            if ("production" !== 'production') {}
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                child = entry[1];
                nextName = nextNamePrefix + KeyEscapeUtils.escape(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0);
                subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
              }
            }
          }
        } else if (type === 'object') {
          var addendum = '';
          if ("production" !== 'production') {}
          var childrenString = String(children);
          _prodInvariant$1('31', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
        }
      }

      return subtreeCount;
    }

    /**
     * Traverses children that are typically specified as `props.children`, but
     * might also be specified through attributes:
     *
     * - `traverseAllChildren(this.props.children, ...)`
     * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
     *
     * The `traverseContext` is an optional argument that is passed through the
     * entire traversal. It can be used to store accumulations or anything else that
     * the callback might find relevant.
     *
     * @param {?*} children Children tree object.
     * @param {!function} callback To invoke upon traversing each child.
     * @param {?*} traverseContext Context for traversal.
     * @return {!number} The number of children in this subtree.
     */
    function traverseAllChildren$1(children, callback, traverseContext) {
      if (children == null) {
        return 0;
      }

      return traverseAllChildrenImpl(children, '', callback, traverseContext);
    }

    var __moduleExports$11 = traverseAllChildren$1;

    var PooledClass = __moduleExports$3;
    var ReactElement$1 = __moduleExports$6;

    var emptyFunction = __moduleExports$9;
    var traverseAllChildren = __moduleExports$11;

    var twoArgumentPooler = PooledClass.twoArgumentPooler;
    var fourArgumentPooler = PooledClass.fourArgumentPooler;

    var userProvidedKeyEscapeRegex = /\/+/g;
    function escapeUserProvidedKey(text) {
      return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
    }

    /**
     * PooledClass representing the bookkeeping associated with performing a child
     * traversal. Allows avoiding binding callbacks.
     *
     * @constructor ForEachBookKeeping
     * @param {!function} forEachFunction Function to perform traversal with.
     * @param {?*} forEachContext Context to perform context with.
     */
    function ForEachBookKeeping(forEachFunction, forEachContext) {
      this.func = forEachFunction;
      this.context = forEachContext;
      this.count = 0;
    }
    ForEachBookKeeping.prototype.destructor = function () {
      this.func = null;
      this.context = null;
      this.count = 0;
    };
    PooledClass.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);

    function forEachSingleChild(bookKeeping, child, name) {
      var func = bookKeeping.func;
      var context = bookKeeping.context;

      func.call(context, child, bookKeeping.count++);
    }

    /**
     * Iterates through children that are typically specified as `props.children`.
     *
     * See https://facebook.github.io/react/docs/top-level-api.html#react.children.foreach
     *
     * The provided forEachFunc(child, index) will be called for each
     * leaf child.
     *
     * @param {?*} children Children tree container.
     * @param {function(*, int)} forEachFunc
     * @param {*} forEachContext Context for forEachContext.
     */
    function forEachChildren(children, forEachFunc, forEachContext) {
      if (children == null) {
        return children;
      }
      var traverseContext = ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
      traverseAllChildren(children, forEachSingleChild, traverseContext);
      ForEachBookKeeping.release(traverseContext);
    }

    /**
     * PooledClass representing the bookkeeping associated with performing a child
     * mapping. Allows avoiding binding callbacks.
     *
     * @constructor MapBookKeeping
     * @param {!*} mapResult Object containing the ordered map of results.
     * @param {!function} mapFunction Function to perform mapping with.
     * @param {?*} mapContext Context to perform mapping with.
     */
    function MapBookKeeping(mapResult, keyPrefix, mapFunction, mapContext) {
      this.result = mapResult;
      this.keyPrefix = keyPrefix;
      this.func = mapFunction;
      this.context = mapContext;
      this.count = 0;
    }
    MapBookKeeping.prototype.destructor = function () {
      this.result = null;
      this.keyPrefix = null;
      this.func = null;
      this.context = null;
      this.count = 0;
    };
    PooledClass.addPoolingTo(MapBookKeeping, fourArgumentPooler);

    function mapSingleChildIntoContext(bookKeeping, child, childKey) {
      var result = bookKeeping.result;
      var keyPrefix = bookKeeping.keyPrefix;
      var func = bookKeeping.func;
      var context = bookKeeping.context;


      var mappedChild = func.call(context, child, bookKeeping.count++);
      if (Array.isArray(mappedChild)) {
        mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
      } else if (mappedChild != null) {
        if (ReactElement$1.isValidElement(mappedChild)) {
          mappedChild = ReactElement$1.cloneAndReplaceKey(mappedChild,
          // Keep both the (mapped) and old keys if they differ, just as
          // traverseAllChildren used to do for objects as children
          keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
        }
        result.push(mappedChild);
      }
    }

    function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
      var escapedPrefix = '';
      if (prefix != null) {
        escapedPrefix = escapeUserProvidedKey(prefix) + '/';
      }
      var traverseContext = MapBookKeeping.getPooled(array, escapedPrefix, func, context);
      traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
      MapBookKeeping.release(traverseContext);
    }

    /**
     * Maps children that are typically specified as `props.children`.
     *
     * See https://facebook.github.io/react/docs/top-level-api.html#react.children.map
     *
     * The provided mapFunction(child, key, index) will be called for each
     * leaf child.
     *
     * @param {?*} children Children tree container.
     * @param {function(*, int)} func The map function.
     * @param {*} context Context for mapFunction.
     * @return {object} Object containing the ordered map of results.
     */
    function mapChildren(children, func, context) {
      if (children == null) {
        return children;
      }
      var result = [];
      mapIntoWithKeyPrefixInternal(children, result, null, func, context);
      return result;
    }

    function forEachSingleChildDummy(traverseContext, child, name) {
      return null;
    }

    /**
     * Count the number of children that are typically specified as
     * `props.children`.
     *
     * See https://facebook.github.io/react/docs/top-level-api.html#react.children.count
     *
     * @param {?*} children Children tree container.
     * @return {number} The number of children.
     */
    function countChildren(children, context) {
      return traverseAllChildren(children, forEachSingleChildDummy, null);
    }

    /**
     * Flatten a children object (typically specified as `props.children`) and
     * return an array with appropriately re-keyed children.
     *
     * See https://facebook.github.io/react/docs/top-level-api.html#react.children.toarray
     */
    function toArray(children) {
      var result = [];
      mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
      return result;
    }

    var ReactChildren$1 = {
      forEach: forEachChildren,
      map: mapChildren,
      mapIntoWithKeyPrefixInternal: mapIntoWithKeyPrefixInternal,
      count: countChildren,
      toArray: toArray
    };

    var __moduleExports$2 = ReactChildren$1;

    function warnNoop(publicInstance, callerName) {
      if ("production" !== 'production') {}
    }

    /**
     * This is the abstract API for an update queue.
     */
    var ReactNoopUpdateQueue$1 = {

      /**
       * Checks whether or not this composite component is mounted.
       * @param {ReactClass} publicInstance The instance we want to test.
       * @return {boolean} True if mounted, false otherwise.
       * @protected
       * @final
       */
      isMounted: function (publicInstance) {
        return false;
      },

      /**
       * Enqueue a callback that will be executed after all the pending updates
       * have processed.
       *
       * @param {ReactClass} publicInstance The instance to use as `this` context.
       * @param {?function} callback Called after state is updated.
       * @internal
       */
      enqueueCallback: function (publicInstance, callback) {},

      /**
       * Forces an update. This should only be invoked when it is known with
       * certainty that we are **not** in a DOM transaction.
       *
       * You may want to call this when you know that some deeper aspect of the
       * component's state has changed but `setState` was not called.
       *
       * This will not invoke `shouldComponentUpdate`, but it will invoke
       * `componentWillUpdate` and `componentDidUpdate`.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @internal
       */
      enqueueForceUpdate: function (publicInstance) {
        warnNoop(publicInstance, 'forceUpdate');
      },

      /**
       * Replaces all of the state. Always use this or `setState` to mutate state.
       * You should treat `this.state` as immutable.
       *
       * There is no guarantee that `this.state` will be immediately updated, so
       * accessing `this.state` after calling this method may return the old value.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object} completeState Next state.
       * @internal
       */
      enqueueReplaceState: function (publicInstance, completeState) {
        warnNoop(publicInstance, 'replaceState');
      },

      /**
       * Sets a subset of the state. This only exists because _pendingState is
       * internal. This provides a merging strategy that is not available to deep
       * properties which is confusing. TODO: Expose pendingState or don't use it
       * during the merge.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object} partialState Next partial state to be merged with state.
       * @internal
       */
      enqueueSetState: function (publicInstance, partialState) {
        warnNoop(publicInstance, 'setState');
      }
    };

    var __moduleExports$15 = ReactNoopUpdateQueue$1;

    var emptyObject$1 = {};

    var __moduleExports$16 = emptyObject$1;

    var _prodInvariant$2 = __moduleExports$4;

    var ReactNoopUpdateQueue = __moduleExports$15;

    var emptyObject = __moduleExports$16;
    var invariant$3 = __moduleExports$5;
    /**
     * Base class helpers for the updating state of a component.
     */
    function ReactComponent$1(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      // We initialize the default updater but the real one gets injected by the
      // renderer.
      this.updater = updater || ReactNoopUpdateQueue;
    }

    ReactComponent$1.prototype.isReactComponent = {};

    /**
     * Sets a subset of the state. Always use this to mutate
     * state. You should treat `this.state` as immutable.
     *
     * There is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     *
     * There is no guarantee that calls to `setState` will run synchronously,
     * as they may eventually be batched together.  You can provide an optional
     * callback that will be executed when the call to setState is actually
     * completed.
     *
     * When a function is provided to setState, it will be called at some point in
     * the future (not synchronously). It will be called with the up to date
     * component arguments (state, props, context). These values can be different
     * from this.* because your function may be called after receiveProps but before
     * shouldComponentUpdate, and this new state, props, and context will not yet be
     * assigned to this.
     *
     * @param {object|function} partialState Next partial state or function to
     *        produce next partial state to be merged with current state.
     * @param {?function} callback Called after state is updated.
     * @final
     * @protected
     */
    ReactComponent$1.prototype.setState = function (partialState, callback) {
      !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? _prodInvariant$2('85') : void 0;
      this.updater.enqueueSetState(this, partialState);
      if (callback) {
        this.updater.enqueueCallback(this, callback, 'setState');
      }
    };

    /**
     * Forces an update. This should only be invoked when it is known with
     * certainty that we are **not** in a DOM transaction.
     *
     * You may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setState` was not called.
     *
     * This will not invoke `shouldComponentUpdate`, but it will invoke
     * `componentWillUpdate` and `componentDidUpdate`.
     *
     * @param {?function} callback Called after update is complete.
     * @final
     * @protected
     */
    ReactComponent$1.prototype.forceUpdate = function (callback) {
      this.updater.enqueueForceUpdate(this);
      if (callback) {
        this.updater.enqueueCallback(this, callback, 'forceUpdate');
      }
    };

    var __moduleExports$14 = ReactComponent$1;

    var _assign$2 = __moduleExports$1;

    var ReactComponent$2 = __moduleExports$14;
    var ReactNoopUpdateQueue$2 = __moduleExports$15;

    var emptyObject$2 = __moduleExports$16;

    /**
     * Base class helpers for the updating state of a component.
     */
    function ReactPureComponent$1(props, context, updater) {
      // Duplicated from ReactComponent.
      this.props = props;
      this.context = context;
      this.refs = emptyObject$2;
      // We initialize the default updater but the real one gets injected by the
      // renderer.
      this.updater = updater || ReactNoopUpdateQueue$2;
    }

    function ComponentDummy() {}
    ComponentDummy.prototype = ReactComponent$2.prototype;
    ReactPureComponent$1.prototype = new ComponentDummy();
    ReactPureComponent$1.prototype.constructor = ReactPureComponent$1;
    // Avoid an extra prototype jump for these methods.
    _assign$2(ReactPureComponent$1.prototype, ReactComponent$2.prototype);
    ReactPureComponent$1.prototype.isPureReactComponent = true;

    var __moduleExports$17 = ReactPureComponent$1;

    var invariant$5 = __moduleExports$5;

    /**
     * Constructs an enumeration with keys equal to their value.
     *
     * For example:
     *
     *   var COLORS = keyMirror({blue: null, red: null});
     *   var myColor = COLORS.blue;
     *   var isColorValid = !!COLORS[myColor];
     *
     * The last line could not be performed if the values of the generated enum were
     * not equal to their keys.
     *
     *   Input:  {key1: val1, key2: val2}
     *   Output: {key1: key1, key2: key2}
     *
     * @param {object} obj
     * @return {object}
     */
    var keyMirror$2 = function keyMirror(obj) {
      var ret = {};
      var key;
      !(obj instanceof Object && !Array.isArray(obj)) ? invariant$5(false) : void 0;
      for (key in obj) {
        if (!obj.hasOwnProperty(key)) {
          continue;
        }
        ret[key] = key;
      }
      return ret;
    };

    var __moduleExports$20 = keyMirror$2;

    var keyMirror$1 = __moduleExports$20;

    var ReactPropTypeLocations$1 = keyMirror$1({
      prop: null,
      context: null,
      childContext: null
    });

    var __moduleExports$19 = ReactPropTypeLocations$1;

    var ReactPropTypeLocationNames$1 = {};

    var __moduleExports$21 = ReactPropTypeLocationNames$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    /**
     * Allows extraction of a minified key. Let's the build system minify keys
     * without losing the ability to dynamically use key strings as values
     * themselves. Pass in an object with a single key/val pair and it will return
     * you the string key of that single record. Suppose you want to grab the
     * value for a key 'className' inside of an object. Key/val minification may
     * have aliased that key to be 'xa12'. keyOf({className: null}) will return
     * 'xa12' in that case. Resolve keys you want to use once at startup time, then
     * reuse those resolutions.
     */
    var keyOf$1 = function keyOf(oneKeyObj) {
      var key;
      for (key in oneKeyObj) {
        if (!oneKeyObj.hasOwnProperty(key)) {
          continue;
        }
        return key;
      }
      return null;
    };

    var __moduleExports$22 = keyOf$1;

var     _prodInvariant$3 = __moduleExports$4;
var     _assign$3 = __moduleExports$1;
    var ReactComponent$3 = __moduleExports$14;
    var ReactElement$4 = __moduleExports$6;
    var ReactPropTypeLocations = __moduleExports$19;
    var ReactPropTypeLocationNames = __moduleExports$21;
    var ReactNoopUpdateQueue$3 = __moduleExports$15;

    var emptyObject$3 = __moduleExports$16;
    var invariant$4 = __moduleExports$5;
    var keyMirror = __moduleExports$20;
    var keyOf = __moduleExports$22;
    var MIXINS_KEY = keyOf({ mixins: null });

    /**
     * Policies that describe methods in `ReactClassInterface`.
     */
    var SpecPolicy = keyMirror({
      /**
       * These methods may be defined only once by the class specification or mixin.
       */
      DEFINE_ONCE: null,
      /**
       * These methods may be defined by both the class specification and mixins.
       * Subsequent definitions will be chained. These methods must return void.
       */
      DEFINE_MANY: null,
      /**
       * These methods are overriding the base class.
       */
      OVERRIDE_BASE: null,
      /**
       * These methods are similar to DEFINE_MANY, except we assume they return
       * objects. We try to merge the keys of the return values of all the mixed in
       * functions. If there is a key conflict we throw.
       */
      DEFINE_MANY_MERGED: null
    });

    var injectedMixins = [];

    /**
     * Composite components are higher-level components that compose other composite
     * or host components.
     *
     * To create a new type of `ReactClass`, pass a specification of
     * your new class to `React.createClass`. The only requirement of your class
     * specification is that you implement a `render` method.
     *
     *   var MyComponent = React.createClass({
     *     render: function() {
     *       return <div>Hello World</div>;
     *     }
     *   });
     *
     * The class specification supports a specific protocol of methods that have
     * special meaning (e.g. `render`). See `ReactClassInterface` for
     * more the comprehensive protocol. Any other properties and methods in the
     * class specification will be available on the prototype.
     *
     * @interface ReactClassInterface
     * @internal
     */
    var ReactClassInterface = {

      /**
       * An array of Mixin objects to include when defining your component.
       *
       * @type {array}
       * @optional
       */
      mixins: SpecPolicy.DEFINE_MANY,

      /**
       * An object containing properties and methods that should be defined on
       * the component's constructor instead of its prototype (static methods).
       *
       * @type {object}
       * @optional
       */
      statics: SpecPolicy.DEFINE_MANY,

      /**
       * Definition of prop types for this component.
       *
       * @type {object}
       * @optional
       */
      propTypes: SpecPolicy.DEFINE_MANY,

      /**
       * Definition of context types for this component.
       *
       * @type {object}
       * @optional
       */
      contextTypes: SpecPolicy.DEFINE_MANY,

      /**
       * Definition of context types this component sets for its children.
       *
       * @type {object}
       * @optional
       */
      childContextTypes: SpecPolicy.DEFINE_MANY,

      // ==== Definition methods ====

      /**
       * Invoked when the component is mounted. Values in the mapping will be set on
       * `this.props` if that prop is not specified (i.e. using an `in` check).
       *
       * This method is invoked before `getInitialState` and therefore cannot rely
       * on `this.state` or use `this.setState`.
       *
       * @return {object}
       * @optional
       */
      getDefaultProps: SpecPolicy.DEFINE_MANY_MERGED,

      /**
       * Invoked once before the component is mounted. The return value will be used
       * as the initial value of `this.state`.
       *
       *   getInitialState: function() {
       *     return {
       *       isOn: false,
       *       fooBaz: new BazFoo()
       *     }
       *   }
       *
       * @return {object}
       * @optional
       */
      getInitialState: SpecPolicy.DEFINE_MANY_MERGED,

      /**
       * @return {object}
       * @optional
       */
      getChildContext: SpecPolicy.DEFINE_MANY_MERGED,

      /**
       * Uses props from `this.props` and state from `this.state` to render the
       * structure of the component.
       *
       * No guarantees are made about when or how often this method is invoked, so
       * it must not have side effects.
       *
       *   render: function() {
       *     var name = this.props.name;
       *     return <div>Hello, {name}!</div>;
       *   }
       *
       * @return {ReactComponent}
       * @nosideeffects
       * @required
       */
      render: SpecPolicy.DEFINE_ONCE,

      // ==== Delegate methods ====

      /**
       * Invoked when the component is initially created and about to be mounted.
       * This may have side effects, but any external subscriptions or data created
       * by this method must be cleaned up in `componentWillUnmount`.
       *
       * @optional
       */
      componentWillMount: SpecPolicy.DEFINE_MANY,

      /**
       * Invoked when the component has been mounted and has a DOM representation.
       * However, there is no guarantee that the DOM node is in the document.
       *
       * Use this as an opportunity to operate on the DOM when the component has
       * been mounted (initialized and rendered) for the first time.
       *
       * @param {DOMElement} rootNode DOM element representing the component.
       * @optional
       */
      componentDidMount: SpecPolicy.DEFINE_MANY,

      /**
       * Invoked before the component receives new props.
       *
       * Use this as an opportunity to react to a prop transition by updating the
       * state using `this.setState`. Current props are accessed via `this.props`.
       *
       *   componentWillReceiveProps: function(nextProps, nextContext) {
       *     this.setState({
       *       likesIncreasing: nextProps.likeCount > this.props.likeCount
       *     });
       *   }
       *
       * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
       * transition may cause a state change, but the opposite is not true. If you
       * need it, you are probably looking for `componentWillUpdate`.
       *
       * @param {object} nextProps
       * @optional
       */
      componentWillReceiveProps: SpecPolicy.DEFINE_MANY,

      /**
       * Invoked while deciding if the component should be updated as a result of
       * receiving new props, state and/or context.
       *
       * Use this as an opportunity to `return false` when you're certain that the
       * transition to the new props/state/context will not require a component
       * update.
       *
       *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
       *     return !equal(nextProps, this.props) ||
       *       !equal(nextState, this.state) ||
       *       !equal(nextContext, this.context);
       *   }
       *
       * @param {object} nextProps
       * @param {?object} nextState
       * @param {?object} nextContext
       * @return {boolean} True if the component should update.
       * @optional
       */
      shouldComponentUpdate: SpecPolicy.DEFINE_ONCE,

      /**
       * Invoked when the component is about to update due to a transition from
       * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
       * and `nextContext`.
       *
       * Use this as an opportunity to perform preparation before an update occurs.
       *
       * NOTE: You **cannot** use `this.setState()` in this method.
       *
       * @param {object} nextProps
       * @param {?object} nextState
       * @param {?object} nextContext
       * @param {ReactReconcileTransaction} transaction
       * @optional
       */
      componentWillUpdate: SpecPolicy.DEFINE_MANY,

      /**
       * Invoked when the component's DOM representation has been updated.
       *
       * Use this as an opportunity to operate on the DOM when the component has
       * been updated.
       *
       * @param {object} prevProps
       * @param {?object} prevState
       * @param {?object} prevContext
       * @param {DOMElement} rootNode DOM element representing the component.
       * @optional
       */
      componentDidUpdate: SpecPolicy.DEFINE_MANY,

      /**
       * Invoked when the component is about to be removed from its parent and have
       * its DOM representation destroyed.
       *
       * Use this as an opportunity to deallocate any external resources.
       *
       * NOTE: There is no `componentDidUnmount` since your component will have been
       * destroyed by that point.
       *
       * @optional
       */
      componentWillUnmount: SpecPolicy.DEFINE_MANY,

      // ==== Advanced methods ====

      /**
       * Updates the component's currently mounted DOM representation.
       *
       * By default, this implements React's rendering and reconciliation algorithm.
       * Sophisticated clients may wish to override this.
       *
       * @param {ReactReconcileTransaction} transaction
       * @internal
       * @overridable
       */
      updateComponent: SpecPolicy.OVERRIDE_BASE

    };

    /**
     * Mapping from class specification keys to special processing functions.
     *
     * Although these are declared like instance properties in the specification
     * when defining classes using `React.createClass`, they are actually static
     * and are accessible on the constructor instead of the prototype. Despite
     * being static, they must be defined outside of the "statics" key under
     * which all other static methods are defined.
     */
    var RESERVED_SPEC_KEYS = {
      displayName: function (Constructor, displayName) {
        Constructor.displayName = displayName;
      },
      mixins: function (Constructor, mixins) {
        if (mixins) {
          for (var i = 0; i < mixins.length; i++) {
            mixSpecIntoComponent(Constructor, mixins[i]);
          }
        }
      },
      childContextTypes: function (Constructor, childContextTypes) {
        if ("production" !== 'production') {}
        Constructor.childContextTypes = _assign$3({}, Constructor.childContextTypes, childContextTypes);
      },
      contextTypes: function (Constructor, contextTypes) {
        if ("production" !== 'production') {}
        Constructor.contextTypes = _assign$3({}, Constructor.contextTypes, contextTypes);
      },
      /**
       * Special case getDefaultProps which should move into statics but requires
       * automatic merging.
       */
      getDefaultProps: function (Constructor, getDefaultProps) {
        if (Constructor.getDefaultProps) {
          Constructor.getDefaultProps = createMergedResultFunction(Constructor.getDefaultProps, getDefaultProps);
        } else {
          Constructor.getDefaultProps = getDefaultProps;
        }
      },
      propTypes: function (Constructor, propTypes) {
        if ("production" !== 'production') {}
        Constructor.propTypes = _assign$3({}, Constructor.propTypes, propTypes);
      },
      statics: function (Constructor, statics) {
        mixStaticSpecIntoComponent(Constructor, statics);
      },
      autobind: function () {} };

    function validateMethodOverride(isAlreadyDefined, name) {
      var specPolicy = ReactClassInterface.hasOwnProperty(name) ? ReactClassInterface[name] : null;

      // Disallow overriding of base class methods unless explicitly allowed.
      if (ReactClassMixin.hasOwnProperty(name)) {
        !(specPolicy === SpecPolicy.OVERRIDE_BASE) ? _prodInvariant$3('73', name) : void 0;
      }

      // Disallow defining methods more than once unless explicitly allowed.
      if (isAlreadyDefined) {
        !(specPolicy === SpecPolicy.DEFINE_MANY || specPolicy === SpecPolicy.DEFINE_MANY_MERGED) ? _prodInvariant$3('74', name) : void 0;
      }
    }

    /**
     * Mixin helper which handles policy validation and reserved
     * specification keys when building React classes.
     */
    function mixSpecIntoComponent(Constructor, spec) {
      if (!spec) {
        if ("production" !== 'production') {}

        return;
      }

      !(typeof spec !== 'function') ? _prodInvariant$3('75') : void 0;
      !!ReactElement$4.isValidElement(spec) ? _prodInvariant$3('76') : void 0;

      var proto = Constructor.prototype;
      var autoBindPairs = proto.__reactAutoBindPairs;

      // By handling mixins before any other properties, we ensure the same
      // chaining order is applied to methods with DEFINE_MANY policy, whether
      // mixins are listed before or after these methods in the spec.
      if (spec.hasOwnProperty(MIXINS_KEY)) {
        RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
      }

      for (var name in spec) {
        if (!spec.hasOwnProperty(name)) {
          continue;
        }

        if (name === MIXINS_KEY) {
          // We have already handled mixins in a special case above.
          continue;
        }

        var property = spec[name];
        var isAlreadyDefined = proto.hasOwnProperty(name);
        validateMethodOverride(isAlreadyDefined, name);

        if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
          RESERVED_SPEC_KEYS[name](Constructor, property);
        } else {
          // Setup methods on prototype:
          // The following member methods should not be automatically bound:
          // 1. Expected ReactClass methods (in the "interface").
          // 2. Overridden methods (that were mixed in).
          var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
          var isFunction = typeof property === 'function';
          var shouldAutoBind = isFunction && !isReactClassMethod && !isAlreadyDefined && spec.autobind !== false;

          if (shouldAutoBind) {
            autoBindPairs.push(name, property);
            proto[name] = property;
          } else {
            if (isAlreadyDefined) {
              var specPolicy = ReactClassInterface[name];

              // These cases should already be caught by validateMethodOverride.
              !(isReactClassMethod && (specPolicy === SpecPolicy.DEFINE_MANY_MERGED || specPolicy === SpecPolicy.DEFINE_MANY)) ? _prodInvariant$3('77', specPolicy, name) : void 0;

              // For methods which are defined more than once, call the existing
              // methods before calling the new property, merging if appropriate.
              if (specPolicy === SpecPolicy.DEFINE_MANY_MERGED) {
                proto[name] = createMergedResultFunction(proto[name], property);
              } else if (specPolicy === SpecPolicy.DEFINE_MANY) {
                proto[name] = createChainedFunction(proto[name], property);
              }
            } else {
              proto[name] = property;
              if ("production" !== 'production') {}
            }
          }
        }
      }
    }

    function mixStaticSpecIntoComponent(Constructor, statics) {
      if (!statics) {
        return;
      }
      for (var name in statics) {
        var property = statics[name];
        if (!statics.hasOwnProperty(name)) {
          continue;
        }

        var isReserved = name in RESERVED_SPEC_KEYS;
        !!isReserved ? _prodInvariant$3('78', name) : void 0;

        var isInherited = name in Constructor;
        !!isInherited ? _prodInvariant$3('79', name) : void 0;
        Constructor[name] = property;
      }
    }

    /**
     * Merge two objects, but throw if both contain the same key.
     *
     * @param {object} one The first object, which is mutated.
     * @param {object} two The second object
     * @return {object} one after it has been mutated to contain everything in two.
     */
    function mergeIntoWithNoDuplicateKeys(one, two) {
      !(one && two && typeof one === 'object' && typeof two === 'object') ? _prodInvariant$3('80') : void 0;

      for (var key in two) {
        if (two.hasOwnProperty(key)) {
          !(one[key] === undefined) ? _prodInvariant$3('81', key) : void 0;
          one[key] = two[key];
        }
      }
      return one;
    }

    /**
     * Creates a function that invokes two functions and merges their return values.
     *
     * @param {function} one Function to invoke first.
     * @param {function} two Function to invoke second.
     * @return {function} Function that invokes the two argument functions.
     * @private
     */
    function createMergedResultFunction(one, two) {
      return function mergedResult() {
        var a = one.apply(this, arguments);
        var b = two.apply(this, arguments);
        if (a == null) {
          return b;
        } else if (b == null) {
          return a;
        }
        var c = {};
        mergeIntoWithNoDuplicateKeys(c, a);
        mergeIntoWithNoDuplicateKeys(c, b);
        return c;
      };
    }

    /**
     * Creates a function that invokes two functions and ignores their return vales.
     *
     * @param {function} one Function to invoke first.
     * @param {function} two Function to invoke second.
     * @return {function} Function that invokes the two argument functions.
     * @private
     */
    function createChainedFunction(one, two) {
      return function chainedFunction() {
        one.apply(this, arguments);
        two.apply(this, arguments);
      };
    }

    /**
     * Binds a method to the component.
     *
     * @param {object} component Component whose method is going to be bound.
     * @param {function} method Method to be bound.
     * @return {function} The bound method.
     */
    function bindAutoBindMethod(component, method) {
      var boundMethod = method.bind(component);
      if ("production" !== 'production') {}
      return boundMethod;
    }

    /**
     * Binds all auto-bound methods in a component.
     *
     * @param {object} component Component whose method is going to be bound.
     */
    function bindAutoBindMethods(component) {
      var pairs = component.__reactAutoBindPairs;
      for (var i = 0; i < pairs.length; i += 2) {
        var autoBindKey = pairs[i];
        var method = pairs[i + 1];
        component[autoBindKey] = bindAutoBindMethod(component, method);
      }
    }

    /**
     * Add more to the ReactClass base class. These are all legacy features and
     * therefore not already part of the modern ReactComponent.
     */
    var ReactClassMixin = {

      /**
       * TODO: This will be deprecated because state should always keep a consistent
       * type signature and the only use case for this, is to avoid that.
       */
      replaceState: function (newState, callback) {
        this.updater.enqueueReplaceState(this, newState);
        if (callback) {
          this.updater.enqueueCallback(this, callback, 'replaceState');
        }
      },

      /**
       * Checks whether or not this composite component is mounted.
       * @return {boolean} True if mounted, false otherwise.
       * @protected
       * @final
       */
      isMounted: function () {
        return this.updater.isMounted(this);
      }
    };

    var ReactClassComponent = function () {};
    _assign$3(ReactClassComponent.prototype, ReactComponent$3.prototype, ReactClassMixin);

    /**
     * Module for creating composite components.
     *
     * @class ReactClass
     */
    var ReactClass$1 = {

      /**
       * Creates a composite component class given a class specification.
       * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
       *
       * @param {object} spec Class specification (which must define `render`).
       * @return {function} Component constructor function.
       * @public
       */
      createClass: function (spec) {
        var Constructor = function (props, context, updater) {
          // This constructor gets overridden by mocks. The argument is used
          // by mocks to assert on what gets mounted.

          if ("production" !== 'production') {}

          // Wire up auto-binding
          if (this.__reactAutoBindPairs.length) {
            bindAutoBindMethods(this);
          }

          this.props = props;
          this.context = context;
          this.refs = emptyObject$3;
          this.updater = updater || ReactNoopUpdateQueue$3;

          this.state = null;

          // ReactClasses doesn't have constructors. Instead, they use the
          // getInitialState and componentWillMount methods for initialization.

          var initialState = this.getInitialState ? this.getInitialState() : null;
          if ("production" !== 'production') {}
          !(typeof initialState === 'object' && !Array.isArray(initialState)) ? _prodInvariant$3('82', Constructor.displayName || 'ReactCompositeComponent') : void 0;

          this.state = initialState;
        };
        Constructor.prototype = new ReactClassComponent();
        Constructor.prototype.constructor = Constructor;
        Constructor.prototype.__reactAutoBindPairs = [];

        injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

        mixSpecIntoComponent(Constructor, spec);

        // Initialize the defaultProps property after all mixins have been merged.
        if (Constructor.getDefaultProps) {
          Constructor.defaultProps = Constructor.getDefaultProps();
        }

        if ("production" !== 'production') {}

        !Constructor.prototype.render ? _prodInvariant$3('83') : void 0;

        if ("production" !== 'production') {}

        // Reduce time spent doing lookups by setting these on the prototype.
        for (var methodName in ReactClassInterface) {
          if (!Constructor.prototype[methodName]) {
            Constructor.prototype[methodName] = null;
          }
        }

        return Constructor;
      },

      injection: {
        injectMixin: function (mixin) {
          injectedMixins.push(mixin);
        }
      }

    };

    var __moduleExports$18 = ReactClass$1;

    var _prodInvariant$4 = __moduleExports$4;

    var ReactCurrentOwner$4 = __moduleExports$7;

    var invariant$6 = __moduleExports$5;
    function isNative(fn) {
      // Based on isNative() from Lodash
      var funcToString = Function.prototype.toString;
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var reIsNative = RegExp('^' + funcToString
      // Take an example native function source for comparison
      .call(hasOwnProperty)
      // Strip regex characters so we can use it for regex
      .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
      // Remove hasOwnProperty from the template to make it generic
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
      try {
        var source = funcToString.call(fn);
        return reIsNative.test(source);
      } catch (err) {
        return false;
      }
    }

    var canUseCollections =
    // Array.from
    typeof Array.from === 'function' &&
    // Map
    typeof Map === 'function' && isNative(Map) &&
    // Map.prototype.keys
    Map.prototype != null && typeof Map.prototype.keys === 'function' && isNative(Map.prototype.keys) &&
    // Set
    typeof Set === 'function' && isNative(Set) &&
    // Set.prototype.keys
    Set.prototype != null && typeof Set.prototype.keys === 'function' && isNative(Set.prototype.keys);

    var itemMap;
    var rootIDSet;

    var itemByKey;
    var rootByKey;

    if (canUseCollections) {
      itemMap = new Map();
      rootIDSet = new Set();
    } else {
      itemByKey = {};
      rootByKey = {};
    }

    var unmountedIDs = [];

    // Use non-numeric keys to prevent V8 performance issues:
    // https://github.com/facebook/react/pull/7232
    function getKeyFromID(id) {
      return '.' + id;
    }
    function getIDFromKey(key) {
      return parseInt(key.substr(1), 10);
    }

    function get(id) {
      if (canUseCollections) {
        return itemMap.get(id);
      } else {
        var key = getKeyFromID(id);
        return itemByKey[key];
      }
    }

    function remove(id) {
      if (canUseCollections) {
        itemMap['delete'](id);
      } else {
        var key = getKeyFromID(id);
        delete itemByKey[key];
      }
    }

    function create(id, element, parentID) {
      var item = {
        element: element,
        parentID: parentID,
        text: null,
        childIDs: [],
        isMounted: false,
        updateCount: 0
      };

      if (canUseCollections) {
        itemMap.set(id, item);
      } else {
        var key = getKeyFromID(id);
        itemByKey[key] = item;
      }
    }

    function addRoot(id) {
      if (canUseCollections) {
        rootIDSet.add(id);
      } else {
        var key = getKeyFromID(id);
        rootByKey[key] = true;
      }
    }

    function removeRoot(id) {
      if (canUseCollections) {
        rootIDSet['delete'](id);
      } else {
        var key = getKeyFromID(id);
        delete rootByKey[key];
      }
    }

    function getRegisteredIDs() {
      if (canUseCollections) {
        return Array.from(itemMap.keys());
      } else {
        return Object.keys(itemByKey).map(getIDFromKey);
      }
    }

    function getRootIDs() {
      if (canUseCollections) {
        return Array.from(rootIDSet.keys());
      } else {
        return Object.keys(rootByKey).map(getIDFromKey);
      }
    }

    function purgeDeep(id) {
      var item = get(id);
      if (item) {
        var childIDs = item.childIDs;

        remove(id);
        childIDs.forEach(purgeDeep);
      }
    }

    function describeComponentFrame(name, source, ownerName) {
      return '\n    in ' + name + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
    }

    function getDisplayName(element) {
      if (element == null) {
        return '#empty';
      } else if (typeof element === 'string' || typeof element === 'number') {
        return '#text';
      } else if (typeof element.type === 'string') {
        return element.type;
      } else {
        return element.type.displayName || element.type.name || 'Unknown';
      }
    }

    function describeID(id) {
      var name = ReactComponentTreeHook$1.getDisplayName(id);
      var element = ReactComponentTreeHook$1.getElement(id);
      var ownerID = ReactComponentTreeHook$1.getOwnerID(id);
      var ownerName;
      if (ownerID) {
        ownerName = ReactComponentTreeHook$1.getDisplayName(ownerID);
      }
      void 0;
      return describeComponentFrame(name, element && element._source, ownerName);
    }

    var ReactComponentTreeHook$1 = {
      onSetChildren: function (id, nextChildIDs) {
        var item = get(id);
        item.childIDs = nextChildIDs;

        for (var i = 0; i < nextChildIDs.length; i++) {
          var nextChildID = nextChildIDs[i];
          var nextChild = get(nextChildID);
          !nextChild ? _prodInvariant$4('140') : void 0;
          !(nextChild.childIDs != null || typeof nextChild.element !== 'object' || nextChild.element == null) ? _prodInvariant$4('141') : void 0;
          !nextChild.isMounted ? _prodInvariant$4('71') : void 0;
          if (nextChild.parentID == null) {
            nextChild.parentID = id;
            // TODO: This shouldn't be necessary but mounting a new root during in
            // componentWillMount currently causes not-yet-mounted components to
            // be purged from our tree data so their parent ID is missing.
          }
          !(nextChild.parentID === id) ? _prodInvariant$4('142', nextChildID, nextChild.parentID, id) : void 0;
        }
      },
      onBeforeMountComponent: function (id, element, parentID) {
        create(id, element, parentID);
      },
      onBeforeUpdateComponent: function (id, element) {
        var item = get(id);
        if (!item || !item.isMounted) {
          // We may end up here as a result of setState() in componentWillUnmount().
          // In this case, ignore the element.
          return;
        }
        item.element = element;
      },
      onMountComponent: function (id) {
        var item = get(id);
        item.isMounted = true;
        var isRoot = item.parentID === 0;
        if (isRoot) {
          addRoot(id);
        }
      },
      onUpdateComponent: function (id) {
        var item = get(id);
        if (!item || !item.isMounted) {
          // We may end up here as a result of setState() in componentWillUnmount().
          // In this case, ignore the element.
          return;
        }
        item.updateCount++;
      },
      onUnmountComponent: function (id) {
        var item = get(id);
        if (item) {
          // We need to check if it exists.
          // `item` might not exist if it is inside an error boundary, and a sibling
          // error boundary child threw while mounting. Then this instance never
          // got a chance to mount, but it still gets an unmounting event during
          // the error boundary cleanup.
          item.isMounted = false;
          var isRoot = item.parentID === 0;
          if (isRoot) {
            removeRoot(id);
          }
        }
        unmountedIDs.push(id);
      },
      purgeUnmountedComponents: function () {
        if (ReactComponentTreeHook$1._preventPurging) {
          // Should only be used for testing.
          return;
        }

        for (var i = 0; i < unmountedIDs.length; i++) {
          var id = unmountedIDs[i];
          purgeDeep(id);
        }
        unmountedIDs.length = 0;
      },
      isMounted: function (id) {
        var item = get(id);
        return item ? item.isMounted : false;
      },
      getCurrentStackAddendum: function (topElement) {
        var info = '';
        if (topElement) {
          var type = topElement.type;
          var name = typeof type === 'function' ? type.displayName || type.name : type;
          var owner = topElement._owner;
          info += describeComponentFrame(name || 'Unknown', topElement._source, owner && owner.getName());
        }

        var currentOwner = ReactCurrentOwner$4.current;
        var id = currentOwner && currentOwner._debugID;

        info += ReactComponentTreeHook$1.getStackAddendumByID(id);
        return info;
      },
      getStackAddendumByID: function (id) {
        var info = '';
        while (id) {
          info += describeID(id);
          id = ReactComponentTreeHook$1.getParentID(id);
        }
        return info;
      },
      getChildIDs: function (id) {
        var item = get(id);
        return item ? item.childIDs : [];
      },
      getDisplayName: function (id) {
        var element = ReactComponentTreeHook$1.getElement(id);
        if (!element) {
          return null;
        }
        return getDisplayName(element);
      },
      getElement: function (id) {
        var item = get(id);
        return item ? item.element : null;
      },
      getOwnerID: function (id) {
        var element = ReactComponentTreeHook$1.getElement(id);
        if (!element || !element._owner) {
          return null;
        }
        return element._owner._debugID;
      },
      getParentID: function (id) {
        var item = get(id);
        return item ? item.parentID : null;
      },
      getSource: function (id) {
        var item = get(id);
        var element = item ? item.element : null;
        var source = element != null ? element._source : null;
        return source;
      },
      getText: function (id) {
        var element = ReactComponentTreeHook$1.getElement(id);
        if (typeof element === 'string') {
          return element;
        } else if (typeof element === 'number') {
          return '' + element;
        } else {
          return null;
        }
      },
      getUpdateCount: function (id) {
        var item = get(id);
        return item ? item.updateCount : 0;
      },


      getRegisteredIDs: getRegisteredIDs,

      getRootIDs: getRootIDs
    };

    var __moduleExports$25 = ReactComponentTreeHook$1;

    var ReactPropTypesSecret$1 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

    var __moduleExports$27 = ReactPropTypesSecret$1;

    var _prodInvariant$5 = __moduleExports$4;

    var ReactPropTypeLocationNames$2 = __moduleExports$21;
    var ReactPropTypesSecret = __moduleExports$27;

    var invariant$7 = __moduleExports$5;
    var loggedTypeFailures = {};

    /**
     * Assert that the values match with the type specs.
     * Error messages are memorized and will only be shown once.
     *
     * @param {object} typeSpecs Map of name to a ReactPropType
     * @param {object} values Runtime values that need to be type-checked
     * @param {string} location e.g. "prop", "context", "child context"
     * @param {string} componentName Name of the component for error messages.
     * @param {?object} element The React element that is being type-checked
     * @param {?number} debugID The React component instance that is being type-checked
     * @private
     */
    function checkReactTypeSpec$1(typeSpecs, values, location, componentName, element, debugID) {
      for (var typeSpecName in typeSpecs) {
        if (typeSpecs.hasOwnProperty(typeSpecName)) {
          var error;
          // Prop type validation may throw. In case they do, we don't want to
          // fail the render phase where it didn't fail before. So we log it.
          // After these have been cleaned up, we'll let them throw.
          try {
            // This is intentionally an invariant that gets caught. It's the same
            // behavior as without this statement except with a better message.
            !(typeof typeSpecs[typeSpecName] === 'function') ? _prodInvariant$5('84', componentName || 'React class', ReactPropTypeLocationNames$2[location], typeSpecName) : void 0;
            error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
          } catch (ex) {
            error = ex;
          }
          void 0;
          if (error instanceof Error && !(error.message in loggedTypeFailures)) {
            // Only monitor this failure once because there tends to be a lot of the
            // same error.
            loggedTypeFailures[error.message] = true;

            var componentStackInfo = '';

            if ("production" !== 'production') {}

            void 0;
          }
        }
      }
    }

    var __moduleExports$26 = checkReactTypeSpec$1;

    var ReactCurrentOwner$3 = __moduleExports$7;
    var ReactComponentTreeHook = __moduleExports$25;
    var ReactElement$6 = __moduleExports$6;
    var ReactPropTypeLocations$2 = __moduleExports$19;

    var checkReactTypeSpec = __moduleExports$26;

    var getIteratorFn$2 = __moduleExports$12;
    function getDeclarationErrorAddendum() {
      if (ReactCurrentOwner$3.current) {
        var name = ReactCurrentOwner$3.current.getName();
        if (name) {
          return ' Check the render method of `' + name + '`.';
        }
      }
      return '';
    }

    /**
     * Warn if there's no key explicitly set on dynamic arrays of children or
     * object keys are not valid. This allows us to keep track of children between
     * updates.
     */
    var ownerHasKeyUseWarning = {};

    function getCurrentComponentErrorInfo(parentType) {
      var info = getDeclarationErrorAddendum();

      if (!info) {
        var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
        if (parentName) {
          info = ' Check the top-level render call using <' + parentName + '>.';
        }
      }
      return info;
    }

    /**
     * Warn if the element doesn't have an explicit key assigned to it.
     * This element is in an array. The array could grow and shrink or be
     * reordered. All children that haven't already been validated are required to
     * have a "key" property assigned to it. Error statuses are cached so a warning
     * will only be shown once.
     *
     * @internal
     * @param {ReactElement} element Element that requires a key.
     * @param {*} parentType element's parent's type.
     */
    function validateExplicitKey(element, parentType) {
      if (!element._store || element._store.validated || element.key != null) {
        return;
      }
      element._store.validated = true;

      var memoizer = ownerHasKeyUseWarning.uniqueKey || (ownerHasKeyUseWarning.uniqueKey = {});

      var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
      if (memoizer[currentComponentErrorInfo]) {
        return;
      }
      memoizer[currentComponentErrorInfo] = true;

      // Usually the current owner is the offender, but if it accepts children as a
      // property, it may be the creator of the child that's responsible for
      // assigning it a key.
      var childOwner = '';
      if (element && element._owner && element._owner !== ReactCurrentOwner$3.current) {
        // Give the component that originally created this child.
        childOwner = ' It was passed a child from ' + element._owner.getName() + '.';
      }

      void 0;
    }

    /**
     * Ensure that every element either is passed in a static location, in an
     * array with an explicit keys property defined, or in an object literal
     * with valid key property.
     *
     * @internal
     * @param {ReactNode} node Statically passed child of any type.
     * @param {*} parentType node's parent's type.
     */
    function validateChildKeys(node, parentType) {
      if (typeof node !== 'object') {
        return;
      }
      if (Array.isArray(node)) {
        for (var i = 0; i < node.length; i++) {
          var child = node[i];
          if (ReactElement$6.isValidElement(child)) {
            validateExplicitKey(child, parentType);
          }
        }
      } else if (ReactElement$6.isValidElement(node)) {
        // This element was passed in a valid location.
        if (node._store) {
          node._store.validated = true;
        }
      } else if (node) {
        var iteratorFn = getIteratorFn$2(node);
        // Entry iterators provide implicit keys.
        if (iteratorFn) {
          if (iteratorFn !== node.entries) {
            var iterator = iteratorFn.call(node);
            var step;
            while (!(step = iterator.next()).done) {
              if (ReactElement$6.isValidElement(step.value)) {
                validateExplicitKey(step.value, parentType);
              }
            }
          }
        }
      }
    }

    /**
     * Given an element, validate that its props follow the propTypes definition,
     * provided by the type.
     *
     * @param {ReactElement} element
     */
    function validatePropTypes(element) {
      var componentClass = element.type;
      if (typeof componentClass !== 'function') {
        return;
      }
      var name = componentClass.displayName || componentClass.name;
      if (componentClass.propTypes) {
        checkReactTypeSpec(componentClass.propTypes, element.props, ReactPropTypeLocations$2.prop, name, element, null);
      }
      if (typeof componentClass.getDefaultProps === 'function') {
        void 0;
      }
    }

    var ReactElementValidator = {

      createElement: function (type, props, children) {
        var validType = typeof type === 'string' || typeof type === 'function';
        // We warn in this case but don't throw. We expect the element creation to
        // succeed and there will likely be errors in render.
        if (!validType) {
          void 0;
        }

        var element = ReactElement$6.createElement.apply(this, arguments);

        // The result can be nullish if a mock or a custom function is used.
        // TODO: Drop this when these are no longer allowed as the type argument.
        if (element == null) {
          return element;
        }

        // Skip key warning if the type isn't valid since our key validation logic
        // doesn't expect a non-string/function type and can throw confusing errors.
        // We don't want exception behavior to differ between dev and prod.
        // (Rendering will throw with a helpful message and as soon as the type is
        // fixed, the key warnings will appear.)
        if (validType) {
          for (var i = 2; i < arguments.length; i++) {
            validateChildKeys(arguments[i], type);
          }
        }

        validatePropTypes(element);

        return element;
      },

      createFactory: function (type) {
        var validatedFactory = ReactElementValidator.createElement.bind(null, type);
        // Legacy hook TODO: Warn if this is accessed
        validatedFactory.type = type;

        if ("production" !== 'production') {}

        return validatedFactory;
      },

      cloneElement: function (element, props, children) {
        var newElement = ReactElement$6.cloneElement.apply(this, arguments);
        for (var i = 2; i < arguments.length; i++) {
          validateChildKeys(arguments[i], newElement.type);
        }
        validatePropTypes(newElement);
        return newElement;
      }

    };

    var __moduleExports$24 = ReactElementValidator;

    var ReactElement$5 = __moduleExports$6;

    /**
     * Create a factory that creates HTML tag elements.
     *
     * @private
     */
    var createDOMFactory = ReactElement$5.createFactory;
    /**
     * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
     * This is also accessible via `React.DOM`.
     *
     * @public
     */
    var ReactDOMFactories$1 = {
      a: createDOMFactory('a'),
      abbr: createDOMFactory('abbr'),
      address: createDOMFactory('address'),
      area: createDOMFactory('area'),
      article: createDOMFactory('article'),
      aside: createDOMFactory('aside'),
      audio: createDOMFactory('audio'),
      b: createDOMFactory('b'),
      base: createDOMFactory('base'),
      bdi: createDOMFactory('bdi'),
      bdo: createDOMFactory('bdo'),
      big: createDOMFactory('big'),
      blockquote: createDOMFactory('blockquote'),
      body: createDOMFactory('body'),
      br: createDOMFactory('br'),
      button: createDOMFactory('button'),
      canvas: createDOMFactory('canvas'),
      caption: createDOMFactory('caption'),
      cite: createDOMFactory('cite'),
      code: createDOMFactory('code'),
      col: createDOMFactory('col'),
      colgroup: createDOMFactory('colgroup'),
      data: createDOMFactory('data'),
      datalist: createDOMFactory('datalist'),
      dd: createDOMFactory('dd'),
      del: createDOMFactory('del'),
      details: createDOMFactory('details'),
      dfn: createDOMFactory('dfn'),
      dialog: createDOMFactory('dialog'),
      div: createDOMFactory('div'),
      dl: createDOMFactory('dl'),
      dt: createDOMFactory('dt'),
      em: createDOMFactory('em'),
      embed: createDOMFactory('embed'),
      fieldset: createDOMFactory('fieldset'),
      figcaption: createDOMFactory('figcaption'),
      figure: createDOMFactory('figure'),
      footer: createDOMFactory('footer'),
      form: createDOMFactory('form'),
      h1: createDOMFactory('h1'),
      h2: createDOMFactory('h2'),
      h3: createDOMFactory('h3'),
      h4: createDOMFactory('h4'),
      h5: createDOMFactory('h5'),
      h6: createDOMFactory('h6'),
      head: createDOMFactory('head'),
      header: createDOMFactory('header'),
      hgroup: createDOMFactory('hgroup'),
      hr: createDOMFactory('hr'),
      html: createDOMFactory('html'),
      i: createDOMFactory('i'),
      iframe: createDOMFactory('iframe'),
      img: createDOMFactory('img'),
      input: createDOMFactory('input'),
      ins: createDOMFactory('ins'),
      kbd: createDOMFactory('kbd'),
      keygen: createDOMFactory('keygen'),
      label: createDOMFactory('label'),
      legend: createDOMFactory('legend'),
      li: createDOMFactory('li'),
      link: createDOMFactory('link'),
      main: createDOMFactory('main'),
      map: createDOMFactory('map'),
      mark: createDOMFactory('mark'),
      menu: createDOMFactory('menu'),
      menuitem: createDOMFactory('menuitem'),
      meta: createDOMFactory('meta'),
      meter: createDOMFactory('meter'),
      nav: createDOMFactory('nav'),
      noscript: createDOMFactory('noscript'),
      object: createDOMFactory('object'),
      ol: createDOMFactory('ol'),
      optgroup: createDOMFactory('optgroup'),
      option: createDOMFactory('option'),
      output: createDOMFactory('output'),
      p: createDOMFactory('p'),
      param: createDOMFactory('param'),
      picture: createDOMFactory('picture'),
      pre: createDOMFactory('pre'),
      progress: createDOMFactory('progress'),
      q: createDOMFactory('q'),
      rp: createDOMFactory('rp'),
      rt: createDOMFactory('rt'),
      ruby: createDOMFactory('ruby'),
      s: createDOMFactory('s'),
      samp: createDOMFactory('samp'),
      script: createDOMFactory('script'),
      section: createDOMFactory('section'),
      select: createDOMFactory('select'),
      small: createDOMFactory('small'),
      source: createDOMFactory('source'),
      span: createDOMFactory('span'),
      strong: createDOMFactory('strong'),
      style: createDOMFactory('style'),
      sub: createDOMFactory('sub'),
      summary: createDOMFactory('summary'),
      sup: createDOMFactory('sup'),
      table: createDOMFactory('table'),
      tbody: createDOMFactory('tbody'),
      td: createDOMFactory('td'),
      textarea: createDOMFactory('textarea'),
      tfoot: createDOMFactory('tfoot'),
      th: createDOMFactory('th'),
      thead: createDOMFactory('thead'),
      time: createDOMFactory('time'),
      title: createDOMFactory('title'),
      tr: createDOMFactory('tr'),
      track: createDOMFactory('track'),
      u: createDOMFactory('u'),
      ul: createDOMFactory('ul'),
      'var': createDOMFactory('var'),
      video: createDOMFactory('video'),
      wbr: createDOMFactory('wbr'),

      // SVG
      circle: createDOMFactory('circle'),
      clipPath: createDOMFactory('clipPath'),
      defs: createDOMFactory('defs'),
      ellipse: createDOMFactory('ellipse'),
      g: createDOMFactory('g'),
      image: createDOMFactory('image'),
      line: createDOMFactory('line'),
      linearGradient: createDOMFactory('linearGradient'),
      mask: createDOMFactory('mask'),
      path: createDOMFactory('path'),
      pattern: createDOMFactory('pattern'),
      polygon: createDOMFactory('polygon'),
      polyline: createDOMFactory('polyline'),
      radialGradient: createDOMFactory('radialGradient'),
      rect: createDOMFactory('rect'),
      stop: createDOMFactory('stop'),
      svg: createDOMFactory('svg'),
      text: createDOMFactory('text'),
      tspan: createDOMFactory('tspan')
    };

    var __moduleExports$23 = ReactDOMFactories$1;

    var ReactElement$7 = __moduleExports$6;
    var ReactPropTypeLocationNames$3 = __moduleExports$21;
    var ReactPropTypesSecret$2 = __moduleExports$27;

    var emptyFunction$3 = __moduleExports$9;
    var getIteratorFn$3 = __moduleExports$12;
    /**
     * Collection of methods that allow declaration and validation of props that are
     * supplied to React components. Example usage:
     *
     *   var Props = require('ReactPropTypes');
     *   var MyArticle = React.createClass({
     *     propTypes: {
     *       // An optional string prop named "description".
     *       description: Props.string,
     *
     *       // A required enum prop named "category".
     *       category: Props.oneOf(['News','Photos']).isRequired,
     *
     *       // A prop named "dialog" that requires an instance of Dialog.
     *       dialog: Props.instanceOf(Dialog).isRequired
     *     },
     *     render: function() { ... }
     *   });
     *
     * A more formal specification of how these methods are used:
     *
     *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
     *   decl := ReactPropTypes.{type}(.isRequired)?
     *
     * Each and every declaration produces a function with the same signature. This
     * allows the creation of custom validation functions. For example:
     *
     *  var MyLink = React.createClass({
     *    propTypes: {
     *      // An optional string or URI prop named "href".
     *      href: function(props, propName, componentName) {
     *        var propValue = props[propName];
     *        if (propValue != null && typeof propValue !== 'string' &&
     *            !(propValue instanceof URI)) {
     *          return new Error(
     *            'Expected a string or an URI for ' + propName + ' in ' +
     *            componentName
     *          );
     *        }
     *      }
     *    },
     *    render: function() {...}
     *  });
     *
     * @internal
     */

    var ANONYMOUS = '<<anonymous>>';

    var ReactPropTypes$1 = {
      array: createPrimitiveTypeChecker('array'),
      bool: createPrimitiveTypeChecker('boolean'),
      func: createPrimitiveTypeChecker('function'),
      number: createPrimitiveTypeChecker('number'),
      object: createPrimitiveTypeChecker('object'),
      string: createPrimitiveTypeChecker('string'),
      symbol: createPrimitiveTypeChecker('symbol'),

      any: createAnyTypeChecker(),
      arrayOf: createArrayOfTypeChecker,
      element: createElementTypeChecker(),
      instanceOf: createInstanceTypeChecker,
      node: createNodeChecker(),
      objectOf: createObjectOfTypeChecker,
      oneOf: createEnumTypeChecker,
      oneOfType: createUnionTypeChecker,
      shape: createShapeTypeChecker
    };

    /**
     * inlined Object.is polyfill to avoid requiring consumers ship their own
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
     */
    /*eslint-disable no-self-compare*/
    function is(x, y) {
      // SameValue algorithm
      if (x === y) {
        // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        return x !== 0 || 1 / x === 1 / y;
      } else {
        // Step 6.a: NaN == NaN
        return x !== x && y !== y;
      }
    }
    /*eslint-enable no-self-compare*/

    /**
     * We use an Error-like object for backward compatibility as people may call
     * PropTypes directly and inspect their output. However we don't use real
     * Errors anymore. We don't inspect their stack anyway, and creating them
     * is prohibitively expensive if they are created too often, such as what
     * happens in oneOfType() for any type before the one that matched.
     */
    function PropTypeError(message) {
      this.message = message;
      this.stack = '';
    }
    // Make `instanceof Error` still work for returned errors.
    PropTypeError.prototype = Error.prototype;

    function createChainableTypeChecker(validate) {
      if ("production" !== 'production') {}
      function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
        componentName = componentName || ANONYMOUS;
        propFullName = propFullName || propName;
        if ("production" !== 'production') {}
        if (props[propName] == null) {
          var locationName = ReactPropTypeLocationNames$3[location];
          if (isRequired) {
            return new PropTypeError('Required ' + locationName + ' `' + propFullName + '` was not specified in ' + ('`' + componentName + '`.'));
          }
          return null;
        } else {
          return validate(props, propName, componentName, location, propFullName);
        }
      }

      var chainedCheckType = checkType.bind(null, false);
      chainedCheckType.isRequired = checkType.bind(null, true);

      return chainedCheckType;
    }

    function createPrimitiveTypeChecker(expectedType) {
      function validate(props, propName, componentName, location, propFullName, secret) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== expectedType) {
          var locationName = ReactPropTypeLocationNames$3[location];
          // `propValue` being instance of, say, date/regexp, pass the 'object'
          // check, but we can offer a more precise error message here rather than
          // 'of type `object`'.
          var preciseType = getPreciseType(propValue);

          return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createAnyTypeChecker() {
      return createChainableTypeChecker(emptyFunction$3.thatReturns(null));
    }

    function createArrayOfTypeChecker(typeChecker) {
      function validate(props, propName, componentName, location, propFullName) {
        if (typeof typeChecker !== 'function') {
          return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
        }
        var propValue = props[propName];
        if (!Array.isArray(propValue)) {
          var locationName = ReactPropTypeLocationNames$3[location];
          var propType = getPropType(propValue);
          return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
        }
        for (var i = 0; i < propValue.length; i++) {
          var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret$2);
          if (error instanceof Error) {
            return error;
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createElementTypeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        if (!ReactElement$7.isValidElement(propValue)) {
          var locationName = ReactPropTypeLocationNames$3[location];
          var propType = getPropType(propValue);
          return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createInstanceTypeChecker(expectedClass) {
      function validate(props, propName, componentName, location, propFullName) {
        if (!(props[propName] instanceof expectedClass)) {
          var locationName = ReactPropTypeLocationNames$3[location];
          var expectedClassName = expectedClass.name || ANONYMOUS;
          var actualClassName = getClassName(props[propName]);
          return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createEnumTypeChecker(expectedValues) {
      if (!Array.isArray(expectedValues)) {
        void 0;
        return emptyFunction$3.thatReturnsNull;
      }

      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        for (var i = 0; i < expectedValues.length; i++) {
          if (is(propValue, expectedValues[i])) {
            return null;
          }
        }

        var locationName = ReactPropTypeLocationNames$3[location];
        var valuesString = JSON.stringify(expectedValues);
        return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
      }
      return createChainableTypeChecker(validate);
    }

    function createObjectOfTypeChecker(typeChecker) {
      function validate(props, propName, componentName, location, propFullName) {
        if (typeof typeChecker !== 'function') {
          return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
        }
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== 'object') {
          var locationName = ReactPropTypeLocationNames$3[location];
          return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
        }
        for (var key in propValue) {
          if (propValue.hasOwnProperty(key)) {
            var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret$2);
            if (error instanceof Error) {
              return error;
            }
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createUnionTypeChecker(arrayOfTypeCheckers) {
      if (!Array.isArray(arrayOfTypeCheckers)) {
        void 0;
        return emptyFunction$3.thatReturnsNull;
      }

      function validate(props, propName, componentName, location, propFullName) {
        for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
          var checker = arrayOfTypeCheckers[i];
          if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret$2) == null) {
            return null;
          }
        }

        var locationName = ReactPropTypeLocationNames$3[location];
        return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
      }
      return createChainableTypeChecker(validate);
    }

    function createNodeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        if (!isNode(props[propName])) {
          var locationName = ReactPropTypeLocationNames$3[location];
          return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createShapeTypeChecker(shapeTypes) {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== 'object') {
          var locationName = ReactPropTypeLocationNames$3[location];
          return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
        }
        for (var key in shapeTypes) {
          var checker = shapeTypes[key];
          if (!checker) {
            continue;
          }
          var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret$2);
          if (error) {
            return error;
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function isNode(propValue) {
      switch (typeof propValue) {
        case 'number':
        case 'string':
        case 'undefined':
          return true;
        case 'boolean':
          return !propValue;
        case 'object':
          if (Array.isArray(propValue)) {
            return propValue.every(isNode);
          }
          if (propValue === null || ReactElement$7.isValidElement(propValue)) {
            return true;
          }

          var iteratorFn = getIteratorFn$3(propValue);
          if (iteratorFn) {
            var iterator = iteratorFn.call(propValue);
            var step;
            if (iteratorFn !== propValue.entries) {
              while (!(step = iterator.next()).done) {
                if (!isNode(step.value)) {
                  return false;
                }
              }
            } else {
              // Iterator will provide entry [k,v] tuples rather than values.
              while (!(step = iterator.next()).done) {
                var entry = step.value;
                if (entry) {
                  if (!isNode(entry[1])) {
                    return false;
                  }
                }
              }
            }
          } else {
            return false;
          }

          return true;
        default:
          return false;
      }
    }

    function isSymbol(propType, propValue) {
      // Native Symbol.
      if (propType === 'symbol') {
        return true;
      }

      // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
      if (propValue['@@toStringTag'] === 'Symbol') {
        return true;
      }

      // Fallback for non-spec compliant Symbols which are polyfilled.
      if (typeof Symbol === 'function' && propValue instanceof Symbol) {
        return true;
      }

      return false;
    }

    // Equivalent of `typeof` but with special handling for array and regexp.
    function getPropType(propValue) {
      var propType = typeof propValue;
      if (Array.isArray(propValue)) {
        return 'array';
      }
      if (propValue instanceof RegExp) {
        // Old webkits (at least until Android 4.0) return 'function' rather than
        // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
        // passes PropTypes.object.
        return 'object';
      }
      if (isSymbol(propType, propValue)) {
        return 'symbol';
      }
      return propType;
    }

    // This handles more types than `getPropType`. Only used for error messages.
    // See `createPrimitiveTypeChecker`.
    function getPreciseType(propValue) {
      var propType = getPropType(propValue);
      if (propType === 'object') {
        if (propValue instanceof Date) {
          return 'date';
        } else if (propValue instanceof RegExp) {
          return 'regexp';
        }
      }
      return propType;
    }

    // Returns class name of the object, if any.
    function getClassName(propValue) {
      if (!propValue.constructor || !propValue.constructor.name) {
        return ANONYMOUS;
      }
      return propValue.constructor.name;
    }

    var __moduleExports$28 = ReactPropTypes$1;

    var __moduleExports$29 = '15.3.1';

    var _prodInvariant$6 = __moduleExports$4;

    var ReactElement$8 = __moduleExports$6;

    var invariant$8 = __moduleExports$5;

    /**
     * Returns the first child in a collection of children and verifies that there
     * is only one child in the collection.
     *
     * See https://facebook.github.io/react/docs/top-level-api.html#react.children.only
     *
     * The current implementation of this function assumes that a single child gets
     * passed without a wrapper, but the purpose of this helper function is to
     * abstract away the particular structure of children.
     *
     * @param {?object} children Child collection structure.
     * @return {ReactElement} The first and only `ReactElement` contained in the
     * structure.
     */
    function onlyChild$1(children) {
      !ReactElement$8.isValidElement(children) ? _prodInvariant$6('143') : void 0;
      return children;
    }

    var __moduleExports$30 = onlyChild$1;

    var _assign = __moduleExports$1;

    var ReactChildren = __moduleExports$2;
    var ReactComponent = __moduleExports$14;
    var ReactPureComponent = __moduleExports$17;
    var ReactClass = __moduleExports$18;
    var ReactDOMFactories = __moduleExports$23;
    var ReactElement = __moduleExports$6;
    var ReactPropTypes = __moduleExports$28;
    var ReactVersion = __moduleExports$29;

    var onlyChild = __moduleExports$30;
    var createElement = ReactElement.createElement;
    var createFactory = ReactElement.createFactory;
    var cloneElement = ReactElement.cloneElement;

    var __spread = _assign;

    var React = {

      // Modern

      Children: {
        map: ReactChildren.map,
        forEach: ReactChildren.forEach,
        count: ReactChildren.count,
        toArray: ReactChildren.toArray,
        only: onlyChild
      },

      Component: ReactComponent,
      PureComponent: ReactPureComponent,

      createElement: createElement,
      cloneElement: cloneElement,
      isValidElement: ReactElement.isValidElement,

      // Classic

      PropTypes: ReactPropTypes,
      createClass: ReactClass.createClass,
      createFactory: createFactory,
      createMixin: function (mixin) {
        // Currently a noop. Will be used to validate and trace mixins.
        return mixin;
      },

      // This looks DOM specific but these are actually isomorphic helpers
      // since they are just generating DOM strings.
      DOM: ReactDOMFactories,

      version: ReactVersion,

      // Deprecated hook for JSX spread, don't use this for anything.
      __spread: __spread
    };

    var __moduleExports = React;

    var react = __moduleExports;

    var classCallCheck = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };

    var createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

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

    var Lifecycle = function (_React$Component) {
        inherits(Lifecycle, _React$Component);

        function Lifecycle() {
            classCallCheck(this, Lifecycle);
            return possibleConstructorReturn(this, _React$Component.apply(this, arguments));
        }

        Lifecycle.prototype.createdCallback = function createdCallback() {};

        Lifecycle.prototype.attachedCallback = function attachedCallback() {};

        Lifecycle.prototype.detachedCallback = function detachedCallback() {};

        Lifecycle.prototype.componentWillMount = function componentWillMount() {
            this.createdCallback.apply(this, arguments);
        };

        Lifecycle.prototype.componentDidMount = function componentDidMount() {
            this.attachedCallback.apply(this, arguments);
        };

        Lifecycle.prototype.componentWillUnmount = function componentWillUnmount() {
            this.detachedCallback.apply(this, arguments);
        };

        return Lifecycle;
    }(react.Component);

    var Api = function (_Lifecycle) {
        inherits(Api, _Lifecycle);

        function Api() {
            classCallCheck(this, Api);
            return possibleConstructorReturn(this, _Lifecycle.apply(this, arguments));
        }

        Api.prototype.reducer = function reducer() {
            throw "Please define reducer";
        };

        Api.prototype.setState = function setState() {
            var _Lifecycle$prototype$;

            (_Lifecycle$prototype$ = _Lifecycle.prototype.setState).call.apply(_Lifecycle$prototype$, [this].concat(Array.prototype.slice.call(arguments)));
        };

        return Api;
    }(Lifecycle);

    var Spec = function (_Api) {
        inherits(Spec, _Api);

        function Spec() {
            classCallCheck(this, Spec);
            return possibleConstructorReturn(this, _Api.apply(this, arguments));
        }

        Spec.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
            return true;
        };

        Spec.prototype.render = function render() {
            return null;
        };

        createClass(Spec, [{
            key: "initialState",
            get: function () {
                return null;
            }
        }]);
        return Spec;
    }(Api);

    var Component = function (_Spec) {
        inherits(Component, _Spec);

        function Component(props) {
            classCallCheck(this, Component);
            return possibleConstructorReturn(this, _Spec.apply(this, arguments));
            //this.state = this.initialState;
        }

        return Component;
    }(Spec);

    var Virtual = { createElement: react.createElement, Component: Component };

    var _prodInvariant$8 = __moduleExports$4;

    var invariant$10 = __moduleExports$5;

    function checkMask(value, bitmask) {
      return (value & bitmask) === bitmask;
    }

    var DOMPropertyInjection = {
      /**
       * Mapping from normalized, camelcased property names to a configuration that
       * specifies how the associated DOM property should be accessed or rendered.
       */
      MUST_USE_PROPERTY: 0x1,
      HAS_BOOLEAN_VALUE: 0x4,
      HAS_NUMERIC_VALUE: 0x8,
      HAS_POSITIVE_NUMERIC_VALUE: 0x10 | 0x8,
      HAS_OVERLOADED_BOOLEAN_VALUE: 0x20,

      /**
       * Inject some specialized knowledge about the DOM. This takes a config object
       * with the following properties:
       *
       * isCustomAttribute: function that given an attribute name will return true
       * if it can be inserted into the DOM verbatim. Useful for data-* or aria-*
       * attributes where it's impossible to enumerate all of the possible
       * attribute names,
       *
       * Properties: object mapping DOM property name to one of the
       * DOMPropertyInjection constants or null. If your attribute isn't in here,
       * it won't get written to the DOM.
       *
       * DOMAttributeNames: object mapping React attribute name to the DOM
       * attribute name. Attribute names not specified use the **lowercase**
       * normalized name.
       *
       * DOMAttributeNamespaces: object mapping React attribute name to the DOM
       * attribute namespace URL. (Attribute names not specified use no namespace.)
       *
       * DOMPropertyNames: similar to DOMAttributeNames but for DOM properties.
       * Property names not specified use the normalized name.
       *
       * DOMMutationMethods: Properties that require special mutation methods. If
       * `value` is undefined, the mutation method should unset the property.
       *
       * @param {object} domPropertyConfig the config as described above.
       */
      injectDOMPropertyConfig: function (domPropertyConfig) {
        var Injection = DOMPropertyInjection;
        var Properties = domPropertyConfig.Properties || {};
        var DOMAttributeNamespaces = domPropertyConfig.DOMAttributeNamespaces || {};
        var DOMAttributeNames = domPropertyConfig.DOMAttributeNames || {};
        var DOMPropertyNames = domPropertyConfig.DOMPropertyNames || {};
        var DOMMutationMethods = domPropertyConfig.DOMMutationMethods || {};

        if (domPropertyConfig.isCustomAttribute) {
          DOMProperty$1._isCustomAttributeFunctions.push(domPropertyConfig.isCustomAttribute);
        }

        for (var propName in Properties) {
          !!DOMProperty$1.properties.hasOwnProperty(propName) ? _prodInvariant$8('48', propName) : void 0;

          var lowerCased = propName.toLowerCase();
          var propConfig = Properties[propName];

          var propertyInfo = {
            attributeName: lowerCased,
            attributeNamespace: null,
            propertyName: propName,
            mutationMethod: null,

            mustUseProperty: checkMask(propConfig, Injection.MUST_USE_PROPERTY),
            hasBooleanValue: checkMask(propConfig, Injection.HAS_BOOLEAN_VALUE),
            hasNumericValue: checkMask(propConfig, Injection.HAS_NUMERIC_VALUE),
            hasPositiveNumericValue: checkMask(propConfig, Injection.HAS_POSITIVE_NUMERIC_VALUE),
            hasOverloadedBooleanValue: checkMask(propConfig, Injection.HAS_OVERLOADED_BOOLEAN_VALUE)
          };
          !(propertyInfo.hasBooleanValue + propertyInfo.hasNumericValue + propertyInfo.hasOverloadedBooleanValue <= 1) ? _prodInvariant$8('50', propName) : void 0;

          if ("production" !== 'production') {}

          if (DOMAttributeNames.hasOwnProperty(propName)) {
            var attributeName = DOMAttributeNames[propName];
            propertyInfo.attributeName = attributeName;
            if ("production" !== 'production') {}
          }

          if (DOMAttributeNamespaces.hasOwnProperty(propName)) {
            propertyInfo.attributeNamespace = DOMAttributeNamespaces[propName];
          }

          if (DOMPropertyNames.hasOwnProperty(propName)) {
            propertyInfo.propertyName = DOMPropertyNames[propName];
          }

          if (DOMMutationMethods.hasOwnProperty(propName)) {
            propertyInfo.mutationMethod = DOMMutationMethods[propName];
          }

          DOMProperty$1.properties[propName] = propertyInfo;
        }
      }
    };

    /* eslint-disable max-len */
    var ATTRIBUTE_NAME_START_CHAR = ':A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
    /* eslint-enable max-len */

    /**
     * DOMProperty exports lookup objects that can be used like functions:
     *
     *   > DOMProperty.isValid['id']
     *   true
     *   > DOMProperty.isValid['foobar']
     *   undefined
     *
     * Although this may be confusing, it performs better in general.
     *
     * @see http://jsperf.com/key-exists
     * @see http://jsperf.com/key-missing
     */
    var DOMProperty$1 = {

      ID_ATTRIBUTE_NAME: 'data-reactid',
      ROOT_ATTRIBUTE_NAME: 'data-reactroot',

      ATTRIBUTE_NAME_START_CHAR: ATTRIBUTE_NAME_START_CHAR,
      ATTRIBUTE_NAME_CHAR: ATTRIBUTE_NAME_START_CHAR + '\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040',

      /**
       * Map from property "standard name" to an object with info about how to set
       * the property in the DOM. Each object contains:
       *
       * attributeName:
       *   Used when rendering markup or with `*Attribute()`.
       * attributeNamespace
       * propertyName:
       *   Used on DOM node instances. (This includes properties that mutate due to
       *   external factors.)
       * mutationMethod:
       *   If non-null, used instead of the property or `setAttribute()` after
       *   initial render.
       * mustUseProperty:
       *   Whether the property must be accessed and mutated as an object property.
       * hasBooleanValue:
       *   Whether the property should be removed when set to a falsey value.
       * hasNumericValue:
       *   Whether the property must be numeric or parse as a numeric and should be
       *   removed when set to a falsey value.
       * hasPositiveNumericValue:
       *   Whether the property must be positive numeric or parse as a positive
       *   numeric and should be removed when set to a falsey value.
       * hasOverloadedBooleanValue:
       *   Whether the property can be used as a flag as well as with a value.
       *   Removed when strictly equal to false; present without a value when
       *   strictly equal to true; present with a value otherwise.
       */
      properties: {},

      /**
       * Mapping from lowercase property names to the properly cased version, used
       * to warn in the case of missing properties. Available only in __DEV__.
       * @type {Object}
       */
      getPossibleStandardName: null,

      /**
       * All of the isCustomAttribute() functions that have been injected.
       */
      _isCustomAttributeFunctions: [],

      /**
       * Checks whether a property name is a custom attribute.
       * @method
       */
      isCustomAttribute: function (attributeName) {
        for (var i = 0; i < DOMProperty$1._isCustomAttributeFunctions.length; i++) {
          var isCustomAttributeFn = DOMProperty$1._isCustomAttributeFunctions[i];
          if (isCustomAttributeFn(attributeName)) {
            return true;
          }
        }
        return false;
      },

      injection: DOMPropertyInjection
    };

    var __moduleExports$33 = DOMProperty$1;

    var ReactDOMComponentFlags$1 = {
      hasCachedChildNodes: 1 << 0
    };

    var __moduleExports$34 = ReactDOMComponentFlags$1;

    var _prodInvariant$7 = __moduleExports$4;

    var DOMProperty = __moduleExports$33;
    var ReactDOMComponentFlags = __moduleExports$34;

    var invariant$9 = __moduleExports$5;

    var ATTR_NAME = DOMProperty.ID_ATTRIBUTE_NAME;
    var Flags = ReactDOMComponentFlags;

    var internalInstanceKey = '__reactInternalInstance$' + Math.random().toString(36).slice(2);

    /**
     * Drill down (through composites and empty components) until we get a host or
     * host text component.
     *
     * This is pretty polymorphic but unavoidable with the current structure we have
     * for `_renderedChildren`.
     */
    function getRenderedHostOrTextFromComponent(component) {
      var rendered;
      while (rendered = component._renderedComponent) {
        component = rendered;
      }
      return component;
    }

    /**
     * Populate `_hostNode` on the rendered host/text component with the given
     * DOM node. The passed `inst` can be a composite.
     */
    function precacheNode(inst, node) {
      var hostInst = getRenderedHostOrTextFromComponent(inst);
      hostInst._hostNode = node;
      node[internalInstanceKey] = hostInst;
    }

    function uncacheNode(inst) {
      var node = inst._hostNode;
      if (node) {
        delete node[internalInstanceKey];
        inst._hostNode = null;
      }
    }

    /**
     * Populate `_hostNode` on each child of `inst`, assuming that the children
     * match up with the DOM (element) children of `node`.
     *
     * We cache entire levels at once to avoid an n^2 problem where we access the
     * children of a node sequentially and have to walk from the start to our target
     * node every time.
     *
     * Since we update `_renderedChildren` and the actual DOM at (slightly)
     * different times, we could race here and see a newer `_renderedChildren` than
     * the DOM nodes we see. To avoid this, ReactMultiChild calls
     * `prepareToManageChildren` before we change `_renderedChildren`, at which
     * time the container's child nodes are always cached (until it unmounts).
     */
    function precacheChildNodes(inst, node) {
      if (inst._flags & Flags.hasCachedChildNodes) {
        return;
      }
      var children = inst._renderedChildren;
      var childNode = node.firstChild;
      outer: for (var name in children) {
        if (!children.hasOwnProperty(name)) {
          continue;
        }
        var childInst = children[name];
        var childID = getRenderedHostOrTextFromComponent(childInst)._domID;
        if (childID === 0) {
          // We're currently unmounting this child in ReactMultiChild; skip it.
          continue;
        }
        // We assume the child nodes are in the same order as the child instances.
        for (; childNode !== null; childNode = childNode.nextSibling) {
          if (childNode.nodeType === 1 && childNode.getAttribute(ATTR_NAME) === String(childID) || childNode.nodeType === 8 && childNode.nodeValue === ' react-text: ' + childID + ' ' || childNode.nodeType === 8 && childNode.nodeValue === ' react-empty: ' + childID + ' ') {
            precacheNode(childInst, childNode);
            continue outer;
          }
        }
        // We reached the end of the DOM children without finding an ID match.
        _prodInvariant$7('32', childID);
      }
      inst._flags |= Flags.hasCachedChildNodes;
    }

    /**
     * Given a DOM node, return the closest ReactDOMComponent or
     * ReactDOMTextComponent instance ancestor.
     */
    function getClosestInstanceFromNode(node) {
      if (node[internalInstanceKey]) {
        return node[internalInstanceKey];
      }

      // Walk up the tree until we find an ancestor whose instance we have cached.
      var parents = [];
      while (!node[internalInstanceKey]) {
        parents.push(node);
        if (node.parentNode) {
          node = node.parentNode;
        } else {
          // Top of the tree. This node must not be part of a React tree (or is
          // unmounted, potentially).
          return null;
        }
      }

      var closest;
      var inst;
      for (; node && (inst = node[internalInstanceKey]); node = parents.pop()) {
        closest = inst;
        if (parents.length) {
          precacheChildNodes(inst, node);
        }
      }

      return closest;
    }

    /**
     * Given a DOM node, return the ReactDOMComponent or ReactDOMTextComponent
     * instance, or null if the node was not rendered by this React.
     */
    function getInstanceFromNode(node) {
      var inst = getClosestInstanceFromNode(node);
      if (inst != null && inst._hostNode === node) {
        return inst;
      } else {
        return null;
      }
    }

    /**
     * Given a ReactDOMComponent or ReactDOMTextComponent, return the corresponding
     * DOM node.
     */
    function getNodeFromInstance(inst) {
      // Without this first invariant, passing a non-DOM-component triggers the next
      // invariant for a missing parent, which is super confusing.
      !(inst._hostNode !== undefined) ? _prodInvariant$7('33') : void 0;

      if (inst._hostNode) {
        return inst._hostNode;
      }

      // Walk up the tree until we find an ancestor whose DOM node we have cached.
      var parents = [];
      while (!inst._hostNode) {
        parents.push(inst);
        !inst._hostParent ? _prodInvariant$7('34') : void 0;
        inst = inst._hostParent;
      }

      // Now parents contains each ancestor that does *not* have a cached native
      // node, and `inst` is the deepest ancestor that does.
      for (; parents.length; inst = parents.pop()) {
        precacheChildNodes(inst, inst._hostNode);
      }

      return inst._hostNode;
    }

    var ReactDOMComponentTree$1 = {
      getClosestInstanceFromNode: getClosestInstanceFromNode,
      getInstanceFromNode: getInstanceFromNode,
      getNodeFromInstance: getNodeFromInstance,
      precacheChildNodes: precacheChildNodes,
      precacheNode: precacheNode,
      uncacheNode: uncacheNode
    };

    var __moduleExports$32 = ReactDOMComponentTree$1;

    var keyMirror$3 = __moduleExports$20;

    var PropagationPhases = keyMirror$3({ bubbled: null, captured: null });

    /**
     * Types of raw signals from the browser caught at the top level.
     */
    var topLevelTypes$1 = keyMirror$3({
      topAbort: null,
      topAnimationEnd: null,
      topAnimationIteration: null,
      topAnimationStart: null,
      topBlur: null,
      topCanPlay: null,
      topCanPlayThrough: null,
      topChange: null,
      topClick: null,
      topCompositionEnd: null,
      topCompositionStart: null,
      topCompositionUpdate: null,
      topContextMenu: null,
      topCopy: null,
      topCut: null,
      topDoubleClick: null,
      topDrag: null,
      topDragEnd: null,
      topDragEnter: null,
      topDragExit: null,
      topDragLeave: null,
      topDragOver: null,
      topDragStart: null,
      topDrop: null,
      topDurationChange: null,
      topEmptied: null,
      topEncrypted: null,
      topEnded: null,
      topError: null,
      topFocus: null,
      topInput: null,
      topInvalid: null,
      topKeyDown: null,
      topKeyPress: null,
      topKeyUp: null,
      topLoad: null,
      topLoadedData: null,
      topLoadedMetadata: null,
      topLoadStart: null,
      topMouseDown: null,
      topMouseMove: null,
      topMouseOut: null,
      topMouseOver: null,
      topMouseUp: null,
      topPaste: null,
      topPause: null,
      topPlay: null,
      topPlaying: null,
      topProgress: null,
      topRateChange: null,
      topReset: null,
      topScroll: null,
      topSeeked: null,
      topSeeking: null,
      topSelectionChange: null,
      topStalled: null,
      topSubmit: null,
      topSuspend: null,
      topTextInput: null,
      topTimeUpdate: null,
      topTouchCancel: null,
      topTouchEnd: null,
      topTouchMove: null,
      topTouchStart: null,
      topTransitionEnd: null,
      topVolumeChange: null,
      topWaiting: null,
      topWheel: null
    });

    var EventConstants$1 = {
      topLevelTypes: topLevelTypes$1,
      PropagationPhases: PropagationPhases
    };

    var __moduleExports$37 = EventConstants$1;

    var _prodInvariant$10 = __moduleExports$4;

    var invariant$12 = __moduleExports$5;

    /**
     * Injectable ordering of event plugins.
     */
    var EventPluginOrder = null;

    /**
     * Injectable mapping from names to event plugin modules.
     */
    var namesToPlugins = {};

    /**
     * Recomputes the plugin list using the injected plugins and plugin ordering.
     *
     * @private
     */
    function recomputePluginOrdering() {
      if (!EventPluginOrder) {
        // Wait until an `EventPluginOrder` is injected.
        return;
      }
      for (var pluginName in namesToPlugins) {
        var PluginModule = namesToPlugins[pluginName];
        var pluginIndex = EventPluginOrder.indexOf(pluginName);
        !(pluginIndex > -1) ? _prodInvariant$10('96', pluginName) : void 0;
        if (EventPluginRegistry$1.plugins[pluginIndex]) {
          continue;
        }
        !PluginModule.extractEvents ? _prodInvariant$10('97', pluginName) : void 0;
        EventPluginRegistry$1.plugins[pluginIndex] = PluginModule;
        var publishedEvents = PluginModule.eventTypes;
        for (var eventName in publishedEvents) {
          !publishEventForPlugin(publishedEvents[eventName], PluginModule, eventName) ? _prodInvariant$10('98', eventName, pluginName) : void 0;
        }
      }
    }

    /**
     * Publishes an event so that it can be dispatched by the supplied plugin.
     *
     * @param {object} dispatchConfig Dispatch configuration for the event.
     * @param {object} PluginModule Plugin publishing the event.
     * @return {boolean} True if the event was successfully published.
     * @private
     */
    function publishEventForPlugin(dispatchConfig, PluginModule, eventName) {
      !!EventPluginRegistry$1.eventNameDispatchConfigs.hasOwnProperty(eventName) ? _prodInvariant$10('99', eventName) : void 0;
      EventPluginRegistry$1.eventNameDispatchConfigs[eventName] = dispatchConfig;

      var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;
      if (phasedRegistrationNames) {
        for (var phaseName in phasedRegistrationNames) {
          if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
            var phasedRegistrationName = phasedRegistrationNames[phaseName];
            publishRegistrationName(phasedRegistrationName, PluginModule, eventName);
          }
        }
        return true;
      } else if (dispatchConfig.registrationName) {
        publishRegistrationName(dispatchConfig.registrationName, PluginModule, eventName);
        return true;
      }
      return false;
    }

    /**
     * Publishes a registration name that is used to identify dispatched events and
     * can be used with `EventPluginHub.putListener` to register listeners.
     *
     * @param {string} registrationName Registration name to add.
     * @param {object} PluginModule Plugin publishing the event.
     * @private
     */
    function publishRegistrationName(registrationName, PluginModule, eventName) {
      !!EventPluginRegistry$1.registrationNameModules[registrationName] ? _prodInvariant$10('100', registrationName) : void 0;
      EventPluginRegistry$1.registrationNameModules[registrationName] = PluginModule;
      EventPluginRegistry$1.registrationNameDependencies[registrationName] = PluginModule.eventTypes[eventName].dependencies;

      if ("production" !== 'production') {}
    }

    /**
     * Registers plugins so that they can extract and dispatch events.
     *
     * @see {EventPluginHub}
     */
    var EventPluginRegistry$1 = {

      /**
       * Ordered list of injected plugins.
       */
      plugins: [],

      /**
       * Mapping from event name to dispatch config
       */
      eventNameDispatchConfigs: {},

      /**
       * Mapping from registration name to plugin module
       */
      registrationNameModules: {},

      /**
       * Mapping from registration name to event name
       */
      registrationNameDependencies: {},

      /**
       * Mapping from lowercase registration names to the properly cased version,
       * used to warn in the case of missing event handlers. Available
       * only in __DEV__.
       * @type {Object}
       */
      possibleRegistrationNames: null,

      /**
       * Injects an ordering of plugins (by plugin name). This allows the ordering
       * to be decoupled from injection of the actual plugins so that ordering is
       * always deterministic regardless of packaging, on-the-fly injection, etc.
       *
       * @param {array} InjectedEventPluginOrder
       * @internal
       * @see {EventPluginHub.injection.injectEventPluginOrder}
       */
      injectEventPluginOrder: function (InjectedEventPluginOrder) {
        !!EventPluginOrder ? _prodInvariant$10('101') : void 0;
        // Clone the ordering so it cannot be dynamically mutated.
        EventPluginOrder = Array.prototype.slice.call(InjectedEventPluginOrder);
        recomputePluginOrdering();
      },

      /**
       * Injects plugins to be used by `EventPluginHub`. The plugin names must be
       * in the ordering injected by `injectEventPluginOrder`.
       *
       * Plugins can be injected as part of page initialization or on-the-fly.
       *
       * @param {object} injectedNamesToPlugins Map from names to plugin modules.
       * @internal
       * @see {EventPluginHub.injection.injectEventPluginsByName}
       */
      injectEventPluginsByName: function (injectedNamesToPlugins) {
        var isOrderingDirty = false;
        for (var pluginName in injectedNamesToPlugins) {
          if (!injectedNamesToPlugins.hasOwnProperty(pluginName)) {
            continue;
          }
          var PluginModule = injectedNamesToPlugins[pluginName];
          if (!namesToPlugins.hasOwnProperty(pluginName) || namesToPlugins[pluginName] !== PluginModule) {
            !!namesToPlugins[pluginName] ? _prodInvariant$10('102', pluginName) : void 0;
            namesToPlugins[pluginName] = PluginModule;
            isOrderingDirty = true;
          }
        }
        if (isOrderingDirty) {
          recomputePluginOrdering();
        }
      },

      /**
       * Looks up the plugin for the supplied event.
       *
       * @param {object} event A synthetic event.
       * @return {?object} The plugin that created the supplied event.
       * @internal
       */
      getPluginModuleForEvent: function (event) {
        var dispatchConfig = event.dispatchConfig;
        if (dispatchConfig.registrationName) {
          return EventPluginRegistry$1.registrationNameModules[dispatchConfig.registrationName] || null;
        }
        for (var phase in dispatchConfig.phasedRegistrationNames) {
          if (!dispatchConfig.phasedRegistrationNames.hasOwnProperty(phase)) {
            continue;
          }
          var PluginModule = EventPluginRegistry$1.registrationNameModules[dispatchConfig.phasedRegistrationNames[phase]];
          if (PluginModule) {
            return PluginModule;
          }
        }
        return null;
      },

      /**
       * Exposed for unit testing.
       * @private
       */
      _resetEventPlugins: function () {
        EventPluginOrder = null;
        for (var pluginName in namesToPlugins) {
          if (namesToPlugins.hasOwnProperty(pluginName)) {
            delete namesToPlugins[pluginName];
          }
        }
        EventPluginRegistry$1.plugins.length = 0;

        var eventNameDispatchConfigs = EventPluginRegistry$1.eventNameDispatchConfigs;
        for (var eventName in eventNameDispatchConfigs) {
          if (eventNameDispatchConfigs.hasOwnProperty(eventName)) {
            delete eventNameDispatchConfigs[eventName];
          }
        }

        var registrationNameModules = EventPluginRegistry$1.registrationNameModules;
        for (var registrationName in registrationNameModules) {
          if (registrationNameModules.hasOwnProperty(registrationName)) {
            delete registrationNameModules[registrationName];
          }
        }

        if ("production" !== 'production') {}
      }

    };

    var __moduleExports$40 = EventPluginRegistry$1;

    var caughtError = null;

    /**
     * Call a function while guarding against errors that happens within it.
     *
     * @param {?String} name of the guard to use for logging or debugging
     * @param {Function} func The function to invoke
     * @param {*} a First argument
     * @param {*} b Second argument
     */
    function invokeGuardedCallback(name, func, a, b) {
      try {
        return func(a, b);
      } catch (x) {
        if (caughtError === null) {
          caughtError = x;
        }
        return undefined;
      }
    }

    var ReactErrorUtils$2 = {
      invokeGuardedCallback: invokeGuardedCallback,

      /**
       * Invoked by ReactTestUtils.Simulate so that any errors thrown by the event
       * handler are sure to be rethrown by rethrowCaughtError.
       */
      invokeGuardedCallbackWithCatch: invokeGuardedCallback,

      /**
       * During execution of guarded functions we will capture the first error which
       * we will rethrow to be handled by the top level error handler.
       */
      rethrowCaughtError: function () {
        if (caughtError) {
          var error = caughtError;
          caughtError = null;
          throw error;
        }
      }
    };

    var __moduleExports$42 = ReactErrorUtils$2;

    var _prodInvariant$11 = __moduleExports$4;

    var EventConstants$3 = __moduleExports$37;
    var ReactErrorUtils$1 = __moduleExports$42;

    var invariant$13 = __moduleExports$5;
    /**
     * Injected dependencies:
     */

    /**
     * - `ComponentTree`: [required] Module that can convert between React instances
     *   and actual node references.
     */
    var ComponentTree;
    var TreeTraversal;
    var injection = {
      injectComponentTree: function (Injected) {
        ComponentTree = Injected;
        if ("production" !== 'production') {}
      },
      injectTreeTraversal: function (Injected) {
        TreeTraversal = Injected;
        if ("production" !== 'production') {}
      }
    };

    var topLevelTypes$2 = EventConstants$3.topLevelTypes;

    function isEndish(topLevelType) {
      return topLevelType === topLevelTypes$2.topMouseUp || topLevelType === topLevelTypes$2.topTouchEnd || topLevelType === topLevelTypes$2.topTouchCancel;
    }

    function isMoveish(topLevelType) {
      return topLevelType === topLevelTypes$2.topMouseMove || topLevelType === topLevelTypes$2.topTouchMove;
    }
    function isStartish(topLevelType) {
      return topLevelType === topLevelTypes$2.topMouseDown || topLevelType === topLevelTypes$2.topTouchStart;
    }

    /**
     * Dispatch the event to the listener.
     * @param {SyntheticEvent} event SyntheticEvent to handle
     * @param {boolean} simulated If the event is simulated (changes exn behavior)
     * @param {function} listener Application-level callback
     * @param {*} inst Internal component instance
     */
    function executeDispatch(event, simulated, listener, inst) {
      var type = event.type || 'unknown-event';
      event.currentTarget = EventPluginUtils$2.getNodeFromInstance(inst);
      if (simulated) {
        ReactErrorUtils$1.invokeGuardedCallbackWithCatch(type, listener, event);
      } else {
        ReactErrorUtils$1.invokeGuardedCallback(type, listener, event);
      }
      event.currentTarget = null;
    }

    /**
     * Standard/simple iteration through an event's collected dispatches.
     */
    function executeDispatchesInOrder(event, simulated) {
      var dispatchListeners = event._dispatchListeners;
      var dispatchInstances = event._dispatchInstances;
      if ("production" !== 'production') {}
      if (Array.isArray(dispatchListeners)) {
        for (var i = 0; i < dispatchListeners.length; i++) {
          if (event.isPropagationStopped()) {
            break;
          }
          // Listeners and Instances are two parallel arrays that are always in sync.
          executeDispatch(event, simulated, dispatchListeners[i], dispatchInstances[i]);
        }
      } else if (dispatchListeners) {
        executeDispatch(event, simulated, dispatchListeners, dispatchInstances);
      }
      event._dispatchListeners = null;
      event._dispatchInstances = null;
    }

    /**
     * Standard/simple iteration through an event's collected dispatches, but stops
     * at the first dispatch execution returning true, and returns that id.
     *
     * @return {?string} id of the first dispatch execution who's listener returns
     * true, or null if no listener returned true.
     */
    function executeDispatchesInOrderStopAtTrueImpl(event) {
      var dispatchListeners = event._dispatchListeners;
      var dispatchInstances = event._dispatchInstances;
      if ("production" !== 'production') {}
      if (Array.isArray(dispatchListeners)) {
        for (var i = 0; i < dispatchListeners.length; i++) {
          if (event.isPropagationStopped()) {
            break;
          }
          // Listeners and Instances are two parallel arrays that are always in sync.
          if (dispatchListeners[i](event, dispatchInstances[i])) {
            return dispatchInstances[i];
          }
        }
      } else if (dispatchListeners) {
        if (dispatchListeners(event, dispatchInstances)) {
          return dispatchInstances;
        }
      }
      return null;
    }

    /**
     * @see executeDispatchesInOrderStopAtTrueImpl
     */
    function executeDispatchesInOrderStopAtTrue(event) {
      var ret = executeDispatchesInOrderStopAtTrueImpl(event);
      event._dispatchInstances = null;
      event._dispatchListeners = null;
      return ret;
    }

    /**
     * Execution of a "direct" dispatch - there must be at most one dispatch
     * accumulated on the event or it is considered an error. It doesn't really make
     * sense for an event with multiple dispatches (bubbled) to keep track of the
     * return values at each dispatch execution, but it does tend to make sense when
     * dealing with "direct" dispatches.
     *
     * @return {*} The return value of executing the single dispatch.
     */
    function executeDirectDispatch(event) {
      if ("production" !== 'production') {}
      var dispatchListener = event._dispatchListeners;
      var dispatchInstance = event._dispatchInstances;
      !!Array.isArray(dispatchListener) ? _prodInvariant$11('103') : void 0;
      event.currentTarget = dispatchListener ? EventPluginUtils$2.getNodeFromInstance(dispatchInstance) : null;
      var res = dispatchListener ? dispatchListener(event) : null;
      event.currentTarget = null;
      event._dispatchListeners = null;
      event._dispatchInstances = null;
      return res;
    }

    /**
     * @param {SyntheticEvent} event
     * @return {boolean} True iff number of dispatches accumulated is greater than 0.
     */
    function hasDispatches(event) {
      return !!event._dispatchListeners;
    }

    /**
     * General utilities that are useful in creating custom Event Plugins.
     */
    var EventPluginUtils$2 = {
      isEndish: isEndish,
      isMoveish: isMoveish,
      isStartish: isStartish,

      executeDirectDispatch: executeDirectDispatch,
      executeDispatchesInOrder: executeDispatchesInOrder,
      executeDispatchesInOrderStopAtTrue: executeDispatchesInOrderStopAtTrue,
      hasDispatches: hasDispatches,

      getInstanceFromNode: function (node) {
        return ComponentTree.getInstanceFromNode(node);
      },
      getNodeFromInstance: function (node) {
        return ComponentTree.getNodeFromInstance(node);
      },
      isAncestor: function (a, b) {
        return TreeTraversal.isAncestor(a, b);
      },
      getLowestCommonAncestor: function (a, b) {
        return TreeTraversal.getLowestCommonAncestor(a, b);
      },
      getParentInstance: function (inst) {
        return TreeTraversal.getParentInstance(inst);
      },
      traverseTwoPhase: function (target, fn, arg) {
        return TreeTraversal.traverseTwoPhase(target, fn, arg);
      },
      traverseEnterLeave: function (from, to, fn, argFrom, argTo) {
        return TreeTraversal.traverseEnterLeave(from, to, fn, argFrom, argTo);
      },

      injection: injection
    };

    var __moduleExports$41 = EventPluginUtils$2;

    var _prodInvariant$12 = __moduleExports$4;

    var invariant$14 = __moduleExports$5;

    /**
     * Accumulates items that must not be null or undefined into the first one. This
     * is used to conserve memory by avoiding array allocations, and thus sacrifices
     * API cleanness. Since `current` can be null before being passed in and not
     * null after this function, make sure to assign it back to `current`:
     *
     * `a = accumulateInto(a, b);`
     *
     * This API should be sparingly used. Try `accumulate` for something cleaner.
     *
     * @return {*|array<*>} An accumulation of items.
     */

    function accumulateInto$2(current, next) {
      !(next != null) ? _prodInvariant$12('30') : void 0;

      if (current == null) {
        return next;
      }

      // Both are not empty. Warning: Never call x.concat(y) when you are not
      // certain that x is an Array (x could be a string with concat method).
      if (Array.isArray(current)) {
        if (Array.isArray(next)) {
          current.push.apply(current, next);
          return current;
        }
        current.push(next);
        return current;
      }

      if (Array.isArray(next)) {
        // A bit too dangerous to mutate `next`.
        return [current].concat(next);
      }

      return [current, next];
    }

    var __moduleExports$43 = accumulateInto$2;

    /**
     * @param {array} arr an "accumulation" of items which is either an Array or
     * a single item. Useful when paired with the `accumulate` module. This is a
     * simple utility that allows us to reason about a collection of items, but
     * handling the case when there is exactly one item (and we do not need to
     * allocate an array).
     */

    function forEachAccumulated$2(arr, cb, scope) {
      if (Array.isArray(arr)) {
        arr.forEach(cb, scope);
      } else if (arr) {
        cb.call(scope, arr);
      }
    }

    var __moduleExports$44 = forEachAccumulated$2;

    var _prodInvariant$9 = __moduleExports$4;

    var EventPluginRegistry = __moduleExports$40;
    var EventPluginUtils$1 = __moduleExports$41;
    var ReactErrorUtils = __moduleExports$42;

    var accumulateInto$1 = __moduleExports$43;
    var forEachAccumulated$1 = __moduleExports$44;
    var invariant$11 = __moduleExports$5;

    /**
     * Internal store for event listeners
     */
    var listenerBank = {};

    /**
     * Internal queue of events that have accumulated their dispatches and are
     * waiting to have their dispatches executed.
     */
    var eventQueue = null;

    /**
     * Dispatches an event and releases it back into the pool, unless persistent.
     *
     * @param {?object} event Synthetic event to be dispatched.
     * @param {boolean} simulated If the event is simulated (changes exn behavior)
     * @private
     */
    var executeDispatchesAndRelease = function (event, simulated) {
      if (event) {
        EventPluginUtils$1.executeDispatchesInOrder(event, simulated);

        if (!event.isPersistent()) {
          event.constructor.release(event);
        }
      }
    };
    var executeDispatchesAndReleaseSimulated = function (e) {
      return executeDispatchesAndRelease(e, true);
    };
    var executeDispatchesAndReleaseTopLevel = function (e) {
      return executeDispatchesAndRelease(e, false);
    };

    var getDictionaryKey = function (inst) {
      // Prevents V8 performance issue:
      // https://github.com/facebook/react/pull/7232
      return '.' + inst._rootNodeID;
    };

    /**
     * This is a unified interface for event plugins to be installed and configured.
     *
     * Event plugins can implement the following properties:
     *
     *   `extractEvents` {function(string, DOMEventTarget, string, object): *}
     *     Required. When a top-level event is fired, this method is expected to
     *     extract synthetic events that will in turn be queued and dispatched.
     *
     *   `eventTypes` {object}
     *     Optional, plugins that fire events must publish a mapping of registration
     *     names that are used to register listeners. Values of this mapping must
     *     be objects that contain `registrationName` or `phasedRegistrationNames`.
     *
     *   `executeDispatch` {function(object, function, string)}
     *     Optional, allows plugins to override how an event gets dispatched. By
     *     default, the listener is simply invoked.
     *
     * Each plugin that is injected into `EventsPluginHub` is immediately operable.
     *
     * @public
     */
    var EventPluginHub$1 = {

      /**
       * Methods for injecting dependencies.
       */
      injection: {

        /**
         * @param {array} InjectedEventPluginOrder
         * @public
         */
        injectEventPluginOrder: EventPluginRegistry.injectEventPluginOrder,

        /**
         * @param {object} injectedNamesToPlugins Map from names to plugin modules.
         */
        injectEventPluginsByName: EventPluginRegistry.injectEventPluginsByName

      },

      /**
       * Stores `listener` at `listenerBank[registrationName][key]`. Is idempotent.
       *
       * @param {object} inst The instance, which is the source of events.
       * @param {string} registrationName Name of listener (e.g. `onClick`).
       * @param {function} listener The callback to store.
       */
      putListener: function (inst, registrationName, listener) {
        !(typeof listener === 'function') ? _prodInvariant$9('94', registrationName, typeof listener) : void 0;

        var key = getDictionaryKey(inst);
        var bankForRegistrationName = listenerBank[registrationName] || (listenerBank[registrationName] = {});
        bankForRegistrationName[key] = listener;

        var PluginModule = EventPluginRegistry.registrationNameModules[registrationName];
        if (PluginModule && PluginModule.didPutListener) {
          PluginModule.didPutListener(inst, registrationName, listener);
        }
      },

      /**
       * @param {object} inst The instance, which is the source of events.
       * @param {string} registrationName Name of listener (e.g. `onClick`).
       * @return {?function} The stored callback.
       */
      getListener: function (inst, registrationName) {
        var bankForRegistrationName = listenerBank[registrationName];
        var key = getDictionaryKey(inst);
        return bankForRegistrationName && bankForRegistrationName[key];
      },

      /**
       * Deletes a listener from the registration bank.
       *
       * @param {object} inst The instance, which is the source of events.
       * @param {string} registrationName Name of listener (e.g. `onClick`).
       */
      deleteListener: function (inst, registrationName) {
        var PluginModule = EventPluginRegistry.registrationNameModules[registrationName];
        if (PluginModule && PluginModule.willDeleteListener) {
          PluginModule.willDeleteListener(inst, registrationName);
        }

        var bankForRegistrationName = listenerBank[registrationName];
        // TODO: This should never be null -- when is it?
        if (bankForRegistrationName) {
          var key = getDictionaryKey(inst);
          delete bankForRegistrationName[key];
        }
      },

      /**
       * Deletes all listeners for the DOM element with the supplied ID.
       *
       * @param {object} inst The instance, which is the source of events.
       */
      deleteAllListeners: function (inst) {
        var key = getDictionaryKey(inst);
        for (var registrationName in listenerBank) {
          if (!listenerBank.hasOwnProperty(registrationName)) {
            continue;
          }

          if (!listenerBank[registrationName][key]) {
            continue;
          }

          var PluginModule = EventPluginRegistry.registrationNameModules[registrationName];
          if (PluginModule && PluginModule.willDeleteListener) {
            PluginModule.willDeleteListener(inst, registrationName);
          }

          delete listenerBank[registrationName][key];
        }
      },

      /**
       * Allows registered plugins an opportunity to extract events from top-level
       * native browser events.
       *
       * @return {*} An accumulation of synthetic events.
       * @internal
       */
      extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var events;
        var plugins = EventPluginRegistry.plugins;
        for (var i = 0; i < plugins.length; i++) {
          // Not every plugin in the ordering may be loaded at runtime.
          var possiblePlugin = plugins[i];
          if (possiblePlugin) {
            var extractedEvents = possiblePlugin.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
            if (extractedEvents) {
              events = accumulateInto$1(events, extractedEvents);
            }
          }
        }
        return events;
      },

      /**
       * Enqueues a synthetic event that should be dispatched when
       * `processEventQueue` is invoked.
       *
       * @param {*} events An accumulation of synthetic events.
       * @internal
       */
      enqueueEvents: function (events) {
        if (events) {
          eventQueue = accumulateInto$1(eventQueue, events);
        }
      },

      /**
       * Dispatches all synthetic events on the event queue.
       *
       * @internal
       */
      processEventQueue: function (simulated) {
        // Set `eventQueue` to null before processing it so that we can tell if more
        // events get enqueued while processing.
        var processingEventQueue = eventQueue;
        eventQueue = null;
        if (simulated) {
          forEachAccumulated$1(processingEventQueue, executeDispatchesAndReleaseSimulated);
        } else {
          forEachAccumulated$1(processingEventQueue, executeDispatchesAndReleaseTopLevel);
        }
        !!eventQueue ? _prodInvariant$9('95') : void 0;
        // This would be a good time to rethrow if any of the event handlers threw.
        ReactErrorUtils.rethrowCaughtError();
      },

      /**
       * These are needed for tests only. Do not use!
       */
      __purge: function () {
        listenerBank = {};
      },

      __getListenerBank: function () {
        return listenerBank;
      }

    };

    var __moduleExports$39 = EventPluginHub$1;

    var EventConstants$2 = __moduleExports$37;
    var EventPluginHub = __moduleExports$39;
    var EventPluginUtils = __moduleExports$41;

    var accumulateInto = __moduleExports$43;
    var forEachAccumulated = __moduleExports$44;
    var PropagationPhases$1 = EventConstants$2.PropagationPhases;
    var getListener = EventPluginHub.getListener;

    /**
     * Some event types have a notion of different registration names for different
     * "phases" of propagation. This finds listeners by a given phase.
     */
    function listenerAtPhase(inst, event, propagationPhase) {
      var registrationName = event.dispatchConfig.phasedRegistrationNames[propagationPhase];
      return getListener(inst, registrationName);
    }

    /**
     * Tags a `SyntheticEvent` with dispatched listeners. Creating this function
     * here, allows us to not have to bind or create functions for each event.
     * Mutating the event's members allows us to not have to create a wrapping
     * "dispatch" object that pairs the event with the listener.
     */
    function accumulateDirectionalDispatches(inst, upwards, event) {
      if ("production" !== 'production') {}
      var phase = upwards ? PropagationPhases$1.bubbled : PropagationPhases$1.captured;
      var listener = listenerAtPhase(inst, event, phase);
      if (listener) {
        event._dispatchListeners = accumulateInto(event._dispatchListeners, listener);
        event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
      }
    }

    /**
     * Collect dispatches (must be entirely collected before dispatching - see unit
     * tests). Lazily allocate the array to conserve memory.  We must loop through
     * each event and perform the traversal for each one. We cannot perform a
     * single traversal for the entire collection of events because each event may
     * have a different target.
     */
    function accumulateTwoPhaseDispatchesSingle(event) {
      if (event && event.dispatchConfig.phasedRegistrationNames) {
        EventPluginUtils.traverseTwoPhase(event._targetInst, accumulateDirectionalDispatches, event);
      }
    }

    /**
     * Same as `accumulateTwoPhaseDispatchesSingle`, but skips over the targetID.
     */
    function accumulateTwoPhaseDispatchesSingleSkipTarget(event) {
      if (event && event.dispatchConfig.phasedRegistrationNames) {
        var targetInst = event._targetInst;
        var parentInst = targetInst ? EventPluginUtils.getParentInstance(targetInst) : null;
        EventPluginUtils.traverseTwoPhase(parentInst, accumulateDirectionalDispatches, event);
      }
    }

    /**
     * Accumulates without regard to direction, does not look for phased
     * registration names. Same as `accumulateDirectDispatchesSingle` but without
     * requiring that the `dispatchMarker` be the same as the dispatched ID.
     */
    function accumulateDispatches(inst, ignoredDirection, event) {
      if (event && event.dispatchConfig.registrationName) {
        var registrationName = event.dispatchConfig.registrationName;
        var listener = getListener(inst, registrationName);
        if (listener) {
          event._dispatchListeners = accumulateInto(event._dispatchListeners, listener);
          event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
        }
      }
    }

    /**
     * Accumulates dispatches on an `SyntheticEvent`, but only for the
     * `dispatchMarker`.
     * @param {SyntheticEvent} event
     */
    function accumulateDirectDispatchesSingle(event) {
      if (event && event.dispatchConfig.registrationName) {
        accumulateDispatches(event._targetInst, null, event);
      }
    }

    function accumulateTwoPhaseDispatches(events) {
      forEachAccumulated(events, accumulateTwoPhaseDispatchesSingle);
    }

    function accumulateTwoPhaseDispatchesSkipTarget(events) {
      forEachAccumulated(events, accumulateTwoPhaseDispatchesSingleSkipTarget);
    }

    function accumulateEnterLeaveDispatches(leave, enter, from, to) {
      EventPluginUtils.traverseEnterLeave(from, to, accumulateDispatches, leave, enter);
    }

    function accumulateDirectDispatches(events) {
      forEachAccumulated(events, accumulateDirectDispatchesSingle);
    }

    /**
     * A small set of propagation patterns, each of which will accept a small amount
     * of information, and generate a set of "dispatch ready event objects" - which
     * are sets of events that have already been annotated with a set of dispatched
     * listener functions/ids. The API is designed this way to discourage these
     * propagation strategies from actually executing the dispatches, since we
     * always want to collect the entire set of dispatches before executing event a
     * single one.
     *
     * @constructor EventPropagators
     */
    var EventPropagators$1 = {
      accumulateTwoPhaseDispatches: accumulateTwoPhaseDispatches,
      accumulateTwoPhaseDispatchesSkipTarget: accumulateTwoPhaseDispatchesSkipTarget,
      accumulateDirectDispatches: accumulateDirectDispatches,
      accumulateEnterLeaveDispatches: accumulateEnterLeaveDispatches
    };

    var __moduleExports$38 = EventPropagators$1;

    var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

    /**
     * Simple, lightweight module assisting with the detection and context of
     * Worker. Helps avoid circular dependencies and allows code to reason about
     * whether or not they are in a Worker, even if they never include the main
     * `ReactWorker` dependency.
     */
    var ExecutionEnvironment$1 = {

      canUseDOM: canUseDOM,

      canUseWorkers: typeof Worker !== 'undefined',

      canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),

      canUseViewport: canUseDOM && !!window.screen,

      isInWorker: !canUseDOM // For now, this is true - might change in the future.

    };

    var __moduleExports$45 = ExecutionEnvironment$1;

    var ExecutionEnvironment$2 = __moduleExports$45;

    var contentKey = null;

    /**
     * Gets the key used to access text content on a DOM node.
     *
     * @return {?string} Key used to access text content.
     * @internal
     */
    function getTextContentAccessor$1() {
      if (!contentKey && ExecutionEnvironment$2.canUseDOM) {
        // Prefer textContent to innerText because many browsers support both but
        // SVG <text> elements don't support innerText even when <div> does.
        contentKey = 'textContent' in document.documentElement ? 'textContent' : 'innerText';
      }
      return contentKey;
    }

    var __moduleExports$47 = getTextContentAccessor$1;

    var _assign$4 = __moduleExports$1;

    var PooledClass$2 = __moduleExports$3;

    var getTextContentAccessor = __moduleExports$47;

    /**
     * This helper class stores information about text content of a target node,
     * allowing comparison of content before and after a given event.
     *
     * Identify the node where selection currently begins, then observe
     * both its text content and its current position in the DOM. Since the
     * browser may natively replace the target node during composition, we can
     * use its position to find its replacement.
     *
     * @param {DOMEventTarget} root
     */
    function FallbackCompositionState$1(root) {
      this._root = root;
      this._startText = this.getText();
      this._fallbackText = null;
    }

    _assign$4(FallbackCompositionState$1.prototype, {
      destructor: function () {
        this._root = null;
        this._startText = null;
        this._fallbackText = null;
      },

      /**
       * Get current text of input.
       *
       * @return {string}
       */
      getText: function () {
        if ('value' in this._root) {
          return this._root.value;
        }
        return this._root[getTextContentAccessor()];
      },

      /**
       * Determine the differing substring between the initially stored
       * text content and the current content.
       *
       * @return {string}
       */
      getData: function () {
        if (this._fallbackText) {
          return this._fallbackText;
        }

        var start;
        var startValue = this._startText;
        var startLength = startValue.length;
        var end;
        var endValue = this.getText();
        var endLength = endValue.length;

        for (start = 0; start < startLength; start++) {
          if (startValue[start] !== endValue[start]) {
            break;
          }
        }

        var minEnd = startLength - start;
        for (end = 1; end <= minEnd; end++) {
          if (startValue[startLength - end] !== endValue[endLength - end]) {
            break;
          }
        }

        var sliceTail = end > 1 ? 1 - end : undefined;
        this._fallbackText = endValue.slice(start, sliceTail);
        return this._fallbackText;
      }
    });

    PooledClass$2.addPoolingTo(FallbackCompositionState$1);

    var __moduleExports$46 = FallbackCompositionState$1;

    var _assign$5 = __moduleExports$1;

    var PooledClass$3 = __moduleExports$3;

    var emptyFunction$4 = __moduleExports$9;
    var shouldBeReleasedProperties = ['dispatchConfig', '_targetInst', 'nativeEvent', 'isDefaultPrevented', 'isPropagationStopped', '_dispatchListeners', '_dispatchInstances'];

    /**
     * @interface Event
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
    var EventInterface = {
      type: null,
      target: null,
      // currentTarget is set when dispatching; no use in copying it here
      currentTarget: emptyFunction$4.thatReturnsNull,
      eventPhase: null,
      bubbles: null,
      cancelable: null,
      timeStamp: function (event) {
        return event.timeStamp || Date.now();
      },
      defaultPrevented: null,
      isTrusted: null
    };

    /**
     * Synthetic events are dispatched by event plugins, typically in response to a
     * top-level event delegation handler.
     *
     * These systems should generally use pooling to reduce the frequency of garbage
     * collection. The system should check `isPersistent` to determine whether the
     * event should be released into the pool after being dispatched. Users that
     * need a persisted event should invoke `persist`.
     *
     * Synthetic events (and subclasses) implement the DOM Level 3 Events API by
     * normalizing browser quirks. Subclasses do not necessarily have to implement a
     * DOM interface; custom application-specific events can also subclass this.
     *
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {*} targetInst Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @param {DOMEventTarget} nativeEventTarget Target node.
     */
    function SyntheticEvent$1(dispatchConfig, targetInst, nativeEvent, nativeEventTarget) {
      if ("production" !== 'production') {}

      this.dispatchConfig = dispatchConfig;
      this._targetInst = targetInst;
      this.nativeEvent = nativeEvent;

      var Interface = this.constructor.Interface;
      for (var propName in Interface) {
        if (!Interface.hasOwnProperty(propName)) {
          continue;
        }
        if ("production" !== 'production') {}
        var normalize = Interface[propName];
        if (normalize) {
          this[propName] = normalize(nativeEvent);
        } else {
          if (propName === 'target') {
            this.target = nativeEventTarget;
          } else {
            this[propName] = nativeEvent[propName];
          }
        }
      }

      var defaultPrevented = nativeEvent.defaultPrevented != null ? nativeEvent.defaultPrevented : nativeEvent.returnValue === false;
      if (defaultPrevented) {
        this.isDefaultPrevented = emptyFunction$4.thatReturnsTrue;
      } else {
        this.isDefaultPrevented = emptyFunction$4.thatReturnsFalse;
      }
      this.isPropagationStopped = emptyFunction$4.thatReturnsFalse;
      return this;
    }

    _assign$5(SyntheticEvent$1.prototype, {

      preventDefault: function () {
        this.defaultPrevented = true;
        var event = this.nativeEvent;
        if (!event) {
          return;
        }

        if (event.preventDefault) {
          event.preventDefault();
        } else {
          event.returnValue = false;
        }
        this.isDefaultPrevented = emptyFunction$4.thatReturnsTrue;
      },

      stopPropagation: function () {
        var event = this.nativeEvent;
        if (!event) {
          return;
        }

        if (event.stopPropagation) {
          event.stopPropagation();
        } else if (typeof event.cancelBubble !== 'unknown') {
          // eslint-disable-line valid-typeof
          // The ChangeEventPlugin registers a "propertychange" event for
          // IE. This event does not support bubbling or cancelling, and
          // any references to cancelBubble throw "Member not found".  A
          // typeof check of "unknown" circumvents this issue (and is also
          // IE specific).
          event.cancelBubble = true;
        }

        this.isPropagationStopped = emptyFunction$4.thatReturnsTrue;
      },

      /**
       * We release all dispatched `SyntheticEvent`s after each event loop, adding
       * them back into the pool. This allows a way to hold onto a reference that
       * won't be added back into the pool.
       */
      persist: function () {
        this.isPersistent = emptyFunction$4.thatReturnsTrue;
      },

      /**
       * Checks if this event should be released back into the pool.
       *
       * @return {boolean} True if this should not be released, false otherwise.
       */
      isPersistent: emptyFunction$4.thatReturnsFalse,

      /**
       * `PooledClass` looks for `destructor` on each instance it releases.
       */
      destructor: function () {
        var Interface = this.constructor.Interface;
        for (var propName in Interface) {
          if ("production" !== 'production') {} else {
            this[propName] = null;
          }
        }
        for (var i = 0; i < shouldBeReleasedProperties.length; i++) {
          this[shouldBeReleasedProperties[i]] = null;
        }
        if ("production" !== 'production') {}
      }

    });

    SyntheticEvent$1.Interface = EventInterface;

    /**
     * Helper to reduce boilerplate when creating subclasses.
     *
     * @param {function} Class
     * @param {?object} Interface
     */
    SyntheticEvent$1.augmentClass = function (Class, Interface) {
      var Super = this;

      var E = function () {};
      E.prototype = Super.prototype;
      var prototype = new E();

      _assign$5(prototype, Class.prototype);
      Class.prototype = prototype;
      Class.prototype.constructor = Class;

      Class.Interface = _assign$5({}, Super.Interface, Interface);
      Class.augmentClass = Super.augmentClass;

      PooledClass$3.addPoolingTo(Class, PooledClass$3.fourArgumentPooler);
    };

    PooledClass$3.addPoolingTo(SyntheticEvent$1, PooledClass$3.fourArgumentPooler);

    var __moduleExports$49 = SyntheticEvent$1;

    var SyntheticEvent = __moduleExports$49;

    /**
     * @interface Event
     * @see http://www.w3.org/TR/DOM-Level-3-Events/#events-compositionevents
     */
    var CompositionEventInterface = {
      data: null
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticUIEvent}
     */
    function SyntheticCompositionEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticEvent.augmentClass(SyntheticCompositionEvent$1, CompositionEventInterface);

    var __moduleExports$48 = SyntheticCompositionEvent$1;

    var SyntheticEvent$2 = __moduleExports$49;

    /**
     * @interface Event
     * @see http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105
     *      /#events-inputevents
     */
    var InputEventInterface = {
      data: null
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticUIEvent}
     */
    function SyntheticInputEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticEvent$2.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticEvent$2.augmentClass(SyntheticInputEvent$1, InputEventInterface);

    var __moduleExports$50 = SyntheticInputEvent$1;

    var EventConstants = __moduleExports$37;
    var EventPropagators = __moduleExports$38;
    var ExecutionEnvironment = __moduleExports$45;
    var FallbackCompositionState = __moduleExports$46;
    var SyntheticCompositionEvent = __moduleExports$48;
    var SyntheticInputEvent = __moduleExports$50;

    var keyOf$2 = __moduleExports$22;

    var END_KEYCODES = [9, 13, 27, 32]; // Tab, Return, Esc, Space
    var START_KEYCODE = 229;

    var canUseCompositionEvent = ExecutionEnvironment.canUseDOM && 'CompositionEvent' in window;

    var documentMode = null;
    if (ExecutionEnvironment.canUseDOM && 'documentMode' in document) {
      documentMode = document.documentMode;
    }

    // Webkit offers a very useful `textInput` event that can be used to
    // directly represent `beforeInput`. The IE `textinput` event is not as
    // useful, so we don't use it.
    var canUseTextInputEvent = ExecutionEnvironment.canUseDOM && 'TextEvent' in window && !documentMode && !isPresto();

    // In IE9+, we have access to composition events, but the data supplied
    // by the native compositionend event may be incorrect. Japanese ideographic
    // spaces, for instance (\u3000) are not recorded correctly.
    var useFallbackCompositionData = ExecutionEnvironment.canUseDOM && (!canUseCompositionEvent || documentMode && documentMode > 8 && documentMode <= 11);

    /**
     * Opera <= 12 includes TextEvent in window, but does not fire
     * text input events. Rely on keypress instead.
     */
    function isPresto() {
      var opera = window.opera;
      return typeof opera === 'object' && typeof opera.version === 'function' && parseInt(opera.version(), 10) <= 12;
    }

    var SPACEBAR_CODE = 32;
    var SPACEBAR_CHAR = String.fromCharCode(SPACEBAR_CODE);

    var topLevelTypes = EventConstants.topLevelTypes;

    // Events and their corresponding property names.
    var eventTypes = {
      beforeInput: {
        phasedRegistrationNames: {
          bubbled: keyOf$2({ onBeforeInput: null }),
          captured: keyOf$2({ onBeforeInputCapture: null })
        },
        dependencies: [topLevelTypes.topCompositionEnd, topLevelTypes.topKeyPress, topLevelTypes.topTextInput, topLevelTypes.topPaste]
      },
      compositionEnd: {
        phasedRegistrationNames: {
          bubbled: keyOf$2({ onCompositionEnd: null }),
          captured: keyOf$2({ onCompositionEndCapture: null })
        },
        dependencies: [topLevelTypes.topBlur, topLevelTypes.topCompositionEnd, topLevelTypes.topKeyDown, topLevelTypes.topKeyPress, topLevelTypes.topKeyUp, topLevelTypes.topMouseDown]
      },
      compositionStart: {
        phasedRegistrationNames: {
          bubbled: keyOf$2({ onCompositionStart: null }),
          captured: keyOf$2({ onCompositionStartCapture: null })
        },
        dependencies: [topLevelTypes.topBlur, topLevelTypes.topCompositionStart, topLevelTypes.topKeyDown, topLevelTypes.topKeyPress, topLevelTypes.topKeyUp, topLevelTypes.topMouseDown]
      },
      compositionUpdate: {
        phasedRegistrationNames: {
          bubbled: keyOf$2({ onCompositionUpdate: null }),
          captured: keyOf$2({ onCompositionUpdateCapture: null })
        },
        dependencies: [topLevelTypes.topBlur, topLevelTypes.topCompositionUpdate, topLevelTypes.topKeyDown, topLevelTypes.topKeyPress, topLevelTypes.topKeyUp, topLevelTypes.topMouseDown]
      }
    };

    // Track whether we've ever handled a keypress on the space key.
    var hasSpaceKeypress = false;

    /**
     * Return whether a native keypress event is assumed to be a command.
     * This is required because Firefox fires `keypress` events for key commands
     * (cut, copy, select-all, etc.) even though no character is inserted.
     */
    function isKeypressCommand(nativeEvent) {
      return (nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) &&
      // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(nativeEvent.ctrlKey && nativeEvent.altKey);
    }

    /**
     * Translate native top level events into event types.
     *
     * @param {string} topLevelType
     * @return {object}
     */
    function getCompositionEventType(topLevelType) {
      switch (topLevelType) {
        case topLevelTypes.topCompositionStart:
          return eventTypes.compositionStart;
        case topLevelTypes.topCompositionEnd:
          return eventTypes.compositionEnd;
        case topLevelTypes.topCompositionUpdate:
          return eventTypes.compositionUpdate;
      }
    }

    /**
     * Does our fallback best-guess model think this event signifies that
     * composition has begun?
     *
     * @param {string} topLevelType
     * @param {object} nativeEvent
     * @return {boolean}
     */
    function isFallbackCompositionStart(topLevelType, nativeEvent) {
      return topLevelType === topLevelTypes.topKeyDown && nativeEvent.keyCode === START_KEYCODE;
    }

    /**
     * Does our fallback mode think that this event is the end of composition?
     *
     * @param {string} topLevelType
     * @param {object} nativeEvent
     * @return {boolean}
     */
    function isFallbackCompositionEnd(topLevelType, nativeEvent) {
      switch (topLevelType) {
        case topLevelTypes.topKeyUp:
          // Command keys insert or clear IME input.
          return END_KEYCODES.indexOf(nativeEvent.keyCode) !== -1;
        case topLevelTypes.topKeyDown:
          // Expect IME keyCode on each keydown. If we get any other
          // code we must have exited earlier.
          return nativeEvent.keyCode !== START_KEYCODE;
        case topLevelTypes.topKeyPress:
        case topLevelTypes.topMouseDown:
        case topLevelTypes.topBlur:
          // Events are not possible without cancelling IME.
          return true;
        default:
          return false;
      }
    }

    /**
     * Google Input Tools provides composition data via a CustomEvent,
     * with the `data` property populated in the `detail` object. If this
     * is available on the event object, use it. If not, this is a plain
     * composition event and we have nothing special to extract.
     *
     * @param {object} nativeEvent
     * @return {?string}
     */
    function getDataFromCustomEvent(nativeEvent) {
      var detail = nativeEvent.detail;
      if (typeof detail === 'object' && 'data' in detail) {
        return detail.data;
      }
      return null;
    }

    // Track the current IME composition fallback object, if any.
    var currentComposition = null;

    /**
     * @return {?object} A SyntheticCompositionEvent.
     */
    function extractCompositionEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
      var eventType;
      var fallbackData;

      if (canUseCompositionEvent) {
        eventType = getCompositionEventType(topLevelType);
      } else if (!currentComposition) {
        if (isFallbackCompositionStart(topLevelType, nativeEvent)) {
          eventType = eventTypes.compositionStart;
        }
      } else if (isFallbackCompositionEnd(topLevelType, nativeEvent)) {
        eventType = eventTypes.compositionEnd;
      }

      if (!eventType) {
        return null;
      }

      if (useFallbackCompositionData) {
        // The current composition is stored statically and must not be
        // overwritten while composition continues.
        if (!currentComposition && eventType === eventTypes.compositionStart) {
          currentComposition = FallbackCompositionState.getPooled(nativeEventTarget);
        } else if (eventType === eventTypes.compositionEnd) {
          if (currentComposition) {
            fallbackData = currentComposition.getData();
          }
        }
      }

      var event = SyntheticCompositionEvent.getPooled(eventType, targetInst, nativeEvent, nativeEventTarget);

      if (fallbackData) {
        // Inject data generated from fallback path into the synthetic event.
        // This matches the property of native CompositionEventInterface.
        event.data = fallbackData;
      } else {
        var customData = getDataFromCustomEvent(nativeEvent);
        if (customData !== null) {
          event.data = customData;
        }
      }

      EventPropagators.accumulateTwoPhaseDispatches(event);
      return event;
    }

    /**
     * @param {string} topLevelType Record from `EventConstants`.
     * @param {object} nativeEvent Native browser event.
     * @return {?string} The string corresponding to this `beforeInput` event.
     */
    function getNativeBeforeInputChars(topLevelType, nativeEvent) {
      switch (topLevelType) {
        case topLevelTypes.topCompositionEnd:
          return getDataFromCustomEvent(nativeEvent);
        case topLevelTypes.topKeyPress:
          /**
           * If native `textInput` events are available, our goal is to make
           * use of them. However, there is a special case: the spacebar key.
           * In Webkit, preventing default on a spacebar `textInput` event
           * cancels character insertion, but it *also* causes the browser
           * to fall back to its default spacebar behavior of scrolling the
           * page.
           *
           * Tracking at:
           * https://code.google.com/p/chromium/issues/detail?id=355103
           *
           * To avoid this issue, use the keypress event as if no `textInput`
           * event is available.
           */
          var which = nativeEvent.which;
          if (which !== SPACEBAR_CODE) {
            return null;
          }

          hasSpaceKeypress = true;
          return SPACEBAR_CHAR;

        case topLevelTypes.topTextInput:
          // Record the characters to be added to the DOM.
          var chars = nativeEvent.data;

          // If it's a spacebar character, assume that we have already handled
          // it at the keypress level and bail immediately. Android Chrome
          // doesn't give us keycodes, so we need to blacklist it.
          if (chars === SPACEBAR_CHAR && hasSpaceKeypress) {
            return null;
          }

          return chars;

        default:
          // For other native event types, do nothing.
          return null;
      }
    }

    /**
     * For browsers that do not provide the `textInput` event, extract the
     * appropriate string to use for SyntheticInputEvent.
     *
     * @param {string} topLevelType Record from `EventConstants`.
     * @param {object} nativeEvent Native browser event.
     * @return {?string} The fallback string for this `beforeInput` event.
     */
    function getFallbackBeforeInputChars(topLevelType, nativeEvent) {
      // If we are currently composing (IME) and using a fallback to do so,
      // try to extract the composed characters from the fallback object.
      if (currentComposition) {
        if (topLevelType === topLevelTypes.topCompositionEnd || isFallbackCompositionEnd(topLevelType, nativeEvent)) {
          var chars = currentComposition.getData();
          FallbackCompositionState.release(currentComposition);
          currentComposition = null;
          return chars;
        }
        return null;
      }

      switch (topLevelType) {
        case topLevelTypes.topPaste:
          // If a paste event occurs after a keypress, throw out the input
          // chars. Paste events should not lead to BeforeInput events.
          return null;
        case topLevelTypes.topKeyPress:
          /**
           * As of v27, Firefox may fire keypress events even when no character
           * will be inserted. A few possibilities:
           *
           * - `which` is `0`. Arrow keys, Esc key, etc.
           *
           * - `which` is the pressed key code, but no char is available.
           *   Ex: 'AltGr + d` in Polish. There is no modified character for
           *   this key combination and no character is inserted into the
           *   document, but FF fires the keypress for char code `100` anyway.
           *   No `input` event will occur.
           *
           * - `which` is the pressed key code, but a command combination is
           *   being used. Ex: `Cmd+C`. No character is inserted, and no
           *   `input` event will occur.
           */
          if (nativeEvent.which && !isKeypressCommand(nativeEvent)) {
            return String.fromCharCode(nativeEvent.which);
          }
          return null;
        case topLevelTypes.topCompositionEnd:
          return useFallbackCompositionData ? null : nativeEvent.data;
        default:
          return null;
      }
    }

    /**
     * Extract a SyntheticInputEvent for `beforeInput`, based on either native
     * `textInput` or fallback behavior.
     *
     * @return {?object} A SyntheticInputEvent.
     */
    function extractBeforeInputEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
      var chars;

      if (canUseTextInputEvent) {
        chars = getNativeBeforeInputChars(topLevelType, nativeEvent);
      } else {
        chars = getFallbackBeforeInputChars(topLevelType, nativeEvent);
      }

      // If no characters are being inserted, no BeforeInput event should
      // be fired.
      if (!chars) {
        return null;
      }

      var event = SyntheticInputEvent.getPooled(eventTypes.beforeInput, targetInst, nativeEvent, nativeEventTarget);

      event.data = chars;
      EventPropagators.accumulateTwoPhaseDispatches(event);
      return event;
    }

    /**
     * Create an `onBeforeInput` event to match
     * http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105/#events-inputevents.
     *
     * This event plugin is based on the native `textInput` event
     * available in Chrome, Safari, Opera, and IE. This event fires after
     * `onKeyPress` and `onCompositionEnd`, but before `onInput`.
     *
     * `beforeInput` is spec'd but not implemented in any browsers, and
     * the `input` event does not provide any useful information about what has
     * actually been added, contrary to the spec. Thus, `textInput` is the best
     * available event to identify the characters that have actually been inserted
     * into the target node.
     *
     * This plugin is also responsible for emitting `composition` events, thus
     * allowing us to share composition fallback code for both `beforeInput` and
     * `composition` event types.
     */
    var BeforeInputEventPlugin$1 = {

      eventTypes: eventTypes,

      extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        return [extractCompositionEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget), extractBeforeInputEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget)];
      }
    };

    var __moduleExports$36 = BeforeInputEventPlugin$1;

var     _prodInvariant$14 = __moduleExports$4;
var     _assign$7 = __moduleExports$1;
    var PooledClass$5 = __moduleExports$3;

    var invariant$16 = __moduleExports$5;

    /**
     * A specialized pseudo-event module to help keep track of components waiting to
     * be notified when their DOM representations are available for use.
     *
     * This implements `PooledClass`, so you should never need to instantiate this.
     * Instead, use `CallbackQueue.getPooled()`.
     *
     * @class ReactMountReady
     * @implements PooledClass
     * @internal
     */
    function CallbackQueue$1() {
      this._callbacks = null;
      this._contexts = null;
    }

    _assign$7(CallbackQueue$1.prototype, {

      /**
       * Enqueues a callback to be invoked when `notifyAll` is invoked.
       *
       * @param {function} callback Invoked when `notifyAll` is invoked.
       * @param {?object} context Context to call `callback` with.
       * @internal
       */
      enqueue: function (callback, context) {
        this._callbacks = this._callbacks || [];
        this._contexts = this._contexts || [];
        this._callbacks.push(callback);
        this._contexts.push(context);
      },

      /**
       * Invokes all enqueued callbacks and clears the queue. This is invoked after
       * the DOM representation of a component has been created or updated.
       *
       * @internal
       */
      notifyAll: function () {
        var callbacks = this._callbacks;
        var contexts = this._contexts;
        if (callbacks) {
          !(callbacks.length === contexts.length) ? _prodInvariant$14('24') : void 0;
          this._callbacks = null;
          this._contexts = null;
          for (var i = 0; i < callbacks.length; i++) {
            callbacks[i].call(contexts[i]);
          }
          callbacks.length = 0;
          contexts.length = 0;
        }
      },

      checkpoint: function () {
        return this._callbacks ? this._callbacks.length : 0;
      },

      rollback: function (len) {
        if (this._callbacks) {
          this._callbacks.length = len;
          this._contexts.length = len;
        }
      },

      /**
       * Resets the internal queue.
       *
       * @internal
       */
      reset: function () {
        this._callbacks = null;
        this._contexts = null;
      },

      /**
       * `PooledClass` looks for this.
       */
      destructor: function () {
        this.reset();
      }

    });

    PooledClass$5.addPoolingTo(CallbackQueue$1);

    var __moduleExports$53 = CallbackQueue$1;

    var ReactFeatureFlags$1 = {
      // When true, call console.time() before and .timeEnd() after each top-level
      // render (both initial renders and updates). Useful when looking at prod-mode
      // timeline profiles in Chrome, for example.
      logTopLevelRenders: false
    };

    var __moduleExports$54 = ReactFeatureFlags$1;

    var _prodInvariant$15 = __moduleExports$4;

    var invariant$17 = __moduleExports$5;

    /**
     * ReactOwners are capable of storing references to owned components.
     *
     * All components are capable of //being// referenced by owner components, but
     * only ReactOwner components are capable of //referencing// owned components.
     * The named reference is known as a "ref".
     *
     * Refs are available when mounted and updated during reconciliation.
     *
     *   var MyComponent = React.createClass({
     *     render: function() {
     *       return (
     *         <div onClick={this.handleClick}>
     *           <CustomComponent ref="custom" />
     *         </div>
     *       );
     *     },
     *     handleClick: function() {
     *       this.refs.custom.handleClick();
     *     },
     *     componentDidMount: function() {
     *       this.refs.custom.initialize();
     *     }
     *   });
     *
     * Refs should rarely be used. When refs are used, they should only be done to
     * control data that is not handled by React's data flow.
     *
     * @class ReactOwner
     */
    var ReactOwner$1 = {

      /**
       * @param {?object} object
       * @return {boolean} True if `object` is a valid owner.
       * @final
       */
      isValidOwner: function (object) {
        return !!(object && typeof object.attachRef === 'function' && typeof object.detachRef === 'function');
      },

      /**
       * Adds a component by ref to an owner component.
       *
       * @param {ReactComponent} component Component to reference.
       * @param {string} ref Name by which to refer to the component.
       * @param {ReactOwner} owner Component on which to record the ref.
       * @final
       * @internal
       */
      addComponentAsRefTo: function (component, ref, owner) {
        !ReactOwner$1.isValidOwner(owner) ? _prodInvariant$15('119') : void 0;
        owner.attachRef(ref, component);
      },

      /**
       * Removes a component by ref from an owner component.
       *
       * @param {ReactComponent} component Component to dereference.
       * @param {string} ref Name of the ref to remove.
       * @param {ReactOwner} owner Component on which the ref is recorded.
       * @final
       * @internal
       */
      removeComponentAsRefFrom: function (component, ref, owner) {
        !ReactOwner$1.isValidOwner(owner) ? _prodInvariant$15('120') : void 0;
        var ownerPublicInstance = owner.getPublicInstance();
        // Check that `component`'s owner is still alive and that `component` is still the current ref
        // because we do not want to detach the ref if another component stole it.
        if (ownerPublicInstance && ownerPublicInstance.refs[ref] === component.getPublicInstance()) {
          owner.detachRef(ref);
        }
      }

    };

    var __moduleExports$57 = ReactOwner$1;

    var ReactOwner = __moduleExports$57;

    var ReactRef$1 = {};

    function attachRef(ref, component, owner) {
      if (typeof ref === 'function') {
        ref(component.getPublicInstance());
      } else {
        // Legacy ref
        ReactOwner.addComponentAsRefTo(component, ref, owner);
      }
    }

    function detachRef(ref, component, owner) {
      if (typeof ref === 'function') {
        ref(null);
      } else {
        // Legacy ref
        ReactOwner.removeComponentAsRefFrom(component, ref, owner);
      }
    }

    ReactRef$1.attachRefs = function (instance, element) {
      if (element === null || element === false) {
        return;
      }
      var ref = element.ref;
      if (ref != null) {
        attachRef(ref, instance, element._owner);
      }
    };

    ReactRef$1.shouldUpdateRefs = function (prevElement, nextElement) {
      // If either the owner or a `ref` has changed, make sure the newest owner
      // has stored a reference to `this`, and the previous owner (if different)
      // has forgotten the reference to `this`. We use the element instead
      // of the public this.props because the post processing cannot determine
      // a ref. The ref conceptually lives on the element.

      // TODO: Should this even be possible? The owner cannot change because
      // it's forbidden by shouldUpdateReactComponent. The ref can change
      // if you swap the keys of but not the refs. Reconsider where this check
      // is made. It probably belongs where the key checking and
      // instantiateReactComponent is done.

      var prevEmpty = prevElement === null || prevElement === false;
      var nextEmpty = nextElement === null || nextElement === false;

      return (
        // This has a few false positives w/r/t empty components.
        prevEmpty || nextEmpty || nextElement.ref !== prevElement.ref ||
        // If owner changes but we have an unchanged function ref, don't update refs
        typeof nextElement.ref === 'string' && nextElement._owner !== prevElement._owner
      );
    };

    ReactRef$1.detachRefs = function (instance, element) {
      if (element === null || element === false) {
        return;
      }
      var ref = element.ref;
      if (ref != null) {
        detachRef(ref, instance, element._owner);
      }
    };

    var __moduleExports$56 = ReactRef$1;

    var ReactInvalidSetStateWarningHook$1 = {
      onBeginProcessingChildContext: function () {
        processingChildContext = true;
      },
      onEndProcessingChildContext: function () {
        processingChildContext = false;
      },
      onSetState: function () {
        warnInvalidSetState();
      }
    };

    var __moduleExports$60 = ReactInvalidSetStateWarningHook$1;

    var history$1 = [];

    var ReactHostOperationHistoryHook$1 = {
      onHostOperation: function (debugID, type, payload) {
        history$1.push({
          instanceID: debugID,
          type: type,
          payload: payload
        });
      },
      clearHistory: function () {
        if (ReactHostOperationHistoryHook$1._preventClearing) {
          // Should only be used for tests.
          return;
        }

        history$1 = [];
      },
      getHistory: function () {
        return history$1;
      }
    };

    var __moduleExports$61 = ReactHostOperationHistoryHook$1;

    var ReactComponentTreeHook$4 = __moduleExports$25;

    function handleElement(debugID, element) {
      if (element == null) {
        return;
      }
      if (element._shadowChildren === undefined) {
        return;
      }
      if (element._shadowChildren === element.props.children) {
        return;
      }
      var isMutated = false;
      if (Array.isArray(element._shadowChildren)) {
        if (element._shadowChildren.length === element.props.children.length) {
          for (var i = 0; i < element._shadowChildren.length; i++) {
            if (element._shadowChildren[i] !== element.props.children[i]) {
              isMutated = true;
            }
          }
        } else {
          isMutated = true;
        }
      }
      if (!Array.isArray(element._shadowChildren) || isMutated) {
        void 0;
      }
    }

    var ReactChildrenMutationWarningHook$1 = {
      onMountComponent: function (debugID) {
        handleElement(debugID, ReactComponentTreeHook$4.getElement(debugID));
      },
      onUpdateComponent: function (debugID) {
        handleElement(debugID, ReactComponentTreeHook$4.getElement(debugID));
      }
    };

    var __moduleExports$62 = ReactChildrenMutationWarningHook$1;

    var ExecutionEnvironment$5 = __moduleExports$45;

    var performance$1;

    if (ExecutionEnvironment$5.canUseDOM) {
      performance$1 = window.performance || window.msPerformance || window.webkitPerformance;
    }

    var __moduleExports$64 = performance$1 || {};

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @typechecks
     */

    var performance = __moduleExports$64;

    var performanceNow$1;

    /**
     * Detect if we can use `window.performance.now()` and gracefully fallback to
     * `Date.now()` if it doesn't exist. We need to support Firefox < 15 for now
     * because of Facebook's testing infrastructure.
     */
    if (performance.now) {
      performanceNow$1 = function performanceNow() {
        return performance.now();
      };
    } else {
      performanceNow$1 = function performanceNow() {
        return Date.now();
      };
    }

    var __moduleExports$63 = performanceNow$1;

    var ReactInvalidSetStateWarningHook = __moduleExports$60;
    var ReactHostOperationHistoryHook = __moduleExports$61;
    var ReactComponentTreeHook$3 = __moduleExports$25;
    var ReactChildrenMutationWarningHook = __moduleExports$62;
    var ExecutionEnvironment$4 = __moduleExports$45;

    var performanceNow = __moduleExports$63;
    var hooks = [];
    var didHookThrowForEvent = {};

    function callHook(event, fn, context, arg1, arg2, arg3, arg4, arg5) {
      try {
        fn.call(context, arg1, arg2, arg3, arg4, arg5);
      } catch (e) {
        void 0;
        didHookThrowForEvent[event] = true;
      }
    }

    function emitEvent(event, arg1, arg2, arg3, arg4, arg5) {
      for (var i = 0; i < hooks.length; i++) {
        var hook = hooks[i];
        var fn = hook[event];
        if (fn) {
          callHook(event, fn, hook, arg1, arg2, arg3, arg4, arg5);
        }
      }
    }

    var isProfiling = false;
    var flushHistory = [];
    var lifeCycleTimerStack = [];
    var currentFlushNesting = 0;
    var currentFlushMeasurements = null;
    var currentFlushStartTime = null;
    var currentTimerDebugID = null;
    var currentTimerStartTime = null;
    var currentTimerNestedFlushDuration = null;
    var currentTimerType = null;

    var lifeCycleTimerHasWarned = false;

    function clearHistory() {
      ReactComponentTreeHook$3.purgeUnmountedComponents();
      ReactHostOperationHistoryHook.clearHistory();
    }

    function getTreeSnapshot(registeredIDs) {
      return registeredIDs.reduce(function (tree, id) {
        var ownerID = ReactComponentTreeHook$3.getOwnerID(id);
        var parentID = ReactComponentTreeHook$3.getParentID(id);
        tree[id] = {
          displayName: ReactComponentTreeHook$3.getDisplayName(id),
          text: ReactComponentTreeHook$3.getText(id),
          updateCount: ReactComponentTreeHook$3.getUpdateCount(id),
          childIDs: ReactComponentTreeHook$3.getChildIDs(id),
          // Text nodes don't have owners but this is close enough.
          ownerID: ownerID || ReactComponentTreeHook$3.getOwnerID(parentID),
          parentID: parentID
        };
        return tree;
      }, {});
    }

    function resetMeasurements() {
      var previousStartTime = currentFlushStartTime;
      var previousMeasurements = currentFlushMeasurements || [];
      var previousOperations = ReactHostOperationHistoryHook.getHistory();

      if (currentFlushNesting === 0) {
        currentFlushStartTime = null;
        currentFlushMeasurements = null;
        clearHistory();
        return;
      }

      if (previousMeasurements.length || previousOperations.length) {
        var registeredIDs = ReactComponentTreeHook$3.getRegisteredIDs();
        flushHistory.push({
          duration: performanceNow() - previousStartTime,
          measurements: previousMeasurements || [],
          operations: previousOperations || [],
          treeSnapshot: getTreeSnapshot(registeredIDs)
        });
      }

      clearHistory();
      currentFlushStartTime = performanceNow();
      currentFlushMeasurements = [];
    }

    function checkDebugID(debugID) {
      var allowRoot = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      if (allowRoot && debugID === 0) {
        return;
      }
      if (!debugID) {
        void 0;
      }
    }

    function beginLifeCycleTimer(debugID, timerType) {
      if (currentFlushNesting === 0) {
        return;
      }
      if (currentTimerType && !lifeCycleTimerHasWarned) {
        void 0;
        lifeCycleTimerHasWarned = true;
      }
      currentTimerStartTime = performanceNow();
      currentTimerNestedFlushDuration = 0;
      currentTimerDebugID = debugID;
      currentTimerType = timerType;
    }

    function endLifeCycleTimer(debugID, timerType) {
      if (currentFlushNesting === 0) {
        return;
      }
      if (currentTimerType !== timerType && !lifeCycleTimerHasWarned) {
        void 0;
        lifeCycleTimerHasWarned = true;
      }
      if (isProfiling) {
        currentFlushMeasurements.push({
          timerType: timerType,
          instanceID: debugID,
          duration: performanceNow() - currentTimerStartTime - currentTimerNestedFlushDuration
        });
      }
      currentTimerStartTime = null;
      currentTimerNestedFlushDuration = null;
      currentTimerDebugID = null;
      currentTimerType = null;
    }

    function pauseCurrentLifeCycleTimer() {
      var currentTimer = {
        startTime: currentTimerStartTime,
        nestedFlushStartTime: performanceNow(),
        debugID: currentTimerDebugID,
        timerType: currentTimerType
      };
      lifeCycleTimerStack.push(currentTimer);
      currentTimerStartTime = null;
      currentTimerNestedFlushDuration = null;
      currentTimerDebugID = null;
      currentTimerType = null;
    }

    function resumeCurrentLifeCycleTimer() {
      var _lifeCycleTimerStack$ = lifeCycleTimerStack.pop();

      var startTime = _lifeCycleTimerStack$.startTime;
      var nestedFlushStartTime = _lifeCycleTimerStack$.nestedFlushStartTime;
      var debugID = _lifeCycleTimerStack$.debugID;
      var timerType = _lifeCycleTimerStack$.timerType;

      var nestedFlushDuration = performanceNow() - nestedFlushStartTime;
      currentTimerStartTime = startTime;
      currentTimerNestedFlushDuration += nestedFlushDuration;
      currentTimerDebugID = debugID;
      currentTimerType = timerType;
    }

    var ReactDebugTool = {
      addHook: function (hook) {
        hooks.push(hook);
      },
      removeHook: function (hook) {
        for (var i = 0; i < hooks.length; i++) {
          if (hooks[i] === hook) {
            hooks.splice(i, 1);
            i--;
          }
        }
      },
      isProfiling: function () {
        return isProfiling;
      },
      beginProfiling: function () {
        if (isProfiling) {
          return;
        }

        isProfiling = true;
        flushHistory.length = 0;
        resetMeasurements();
        ReactDebugTool.addHook(ReactHostOperationHistoryHook);
      },
      endProfiling: function () {
        if (!isProfiling) {
          return;
        }

        isProfiling = false;
        resetMeasurements();
        ReactDebugTool.removeHook(ReactHostOperationHistoryHook);
      },
      getFlushHistory: function () {
        return flushHistory;
      },
      onBeginFlush: function () {
        currentFlushNesting++;
        resetMeasurements();
        pauseCurrentLifeCycleTimer();
        emitEvent('onBeginFlush');
      },
      onEndFlush: function () {
        resetMeasurements();
        currentFlushNesting--;
        resumeCurrentLifeCycleTimer();
        emitEvent('onEndFlush');
      },
      onBeginLifeCycleTimer: function (debugID, timerType) {
        checkDebugID(debugID);
        emitEvent('onBeginLifeCycleTimer', debugID, timerType);
        beginLifeCycleTimer(debugID, timerType);
      },
      onEndLifeCycleTimer: function (debugID, timerType) {
        checkDebugID(debugID);
        endLifeCycleTimer(debugID, timerType);
        emitEvent('onEndLifeCycleTimer', debugID, timerType);
      },
      onError: function (debugID) {
        if (currentTimerDebugID != null) {
          endLifeCycleTimer(currentTimerDebugID, currentTimerType);
        }
        emitEvent('onError', debugID);
      },
      onBeginProcessingChildContext: function () {
        emitEvent('onBeginProcessingChildContext');
      },
      onEndProcessingChildContext: function () {
        emitEvent('onEndProcessingChildContext');
      },
      onHostOperation: function (debugID, type, payload) {
        checkDebugID(debugID);
        emitEvent('onHostOperation', debugID, type, payload);
      },
      onSetState: function () {
        emitEvent('onSetState');
      },
      onSetChildren: function (debugID, childDebugIDs) {
        checkDebugID(debugID);
        childDebugIDs.forEach(checkDebugID);
        emitEvent('onSetChildren', debugID, childDebugIDs);
      },
      onBeforeMountComponent: function (debugID, element, parentDebugID) {
        checkDebugID(debugID);
        checkDebugID(parentDebugID, true);
        emitEvent('onBeforeMountComponent', debugID, element, parentDebugID);
      },
      onMountComponent: function (debugID) {
        checkDebugID(debugID);
        emitEvent('onMountComponent', debugID);
      },
      onBeforeUpdateComponent: function (debugID, element) {
        checkDebugID(debugID);
        emitEvent('onBeforeUpdateComponent', debugID, element);
      },
      onUpdateComponent: function (debugID) {
        checkDebugID(debugID);
        emitEvent('onUpdateComponent', debugID);
      },
      onBeforeUnmountComponent: function (debugID) {
        checkDebugID(debugID);
        emitEvent('onBeforeUnmountComponent', debugID);
      },
      onUnmountComponent: function (debugID) {
        checkDebugID(debugID);
        emitEvent('onUnmountComponent', debugID);
      },
      onTestEvent: function () {
        emitEvent('onTestEvent');
      }
    };

    // TODO remove these when RN/www gets updated
    ReactDebugTool.addDevtool = ReactDebugTool.addHook;
    ReactDebugTool.removeDevtool = ReactDebugTool.removeHook;

    ReactDebugTool.addHook(ReactInvalidSetStateWarningHook);
    ReactDebugTool.addHook(ReactComponentTreeHook$3);
    ReactDebugTool.addHook(ReactChildrenMutationWarningHook);
    var url = ExecutionEnvironment$4.canUseDOM && window.location.href || '';
    if (/[?&]react_perf\b/.test(url)) {
      ReactDebugTool.beginProfiling();
    }

    var __moduleExports$59 = ReactDebugTool;

    var ReactRef = __moduleExports$56;
    /**
     * Helper to call ReactRef.attachRefs with this composite component, split out
     * to avoid allocations in the transaction mount-ready queue.
     */
    function attachRefs() {
      ReactRef.attachRefs(this, this._currentElement);
    }

    var ReactReconciler$2 = {

      /**
       * Initializes the component, renders markup, and registers event listeners.
       *
       * @param {ReactComponent} internalInstance
       * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
       * @param {?object} the containing host component instance
       * @param {?object} info about the host container
       * @return {?string} Rendered markup to be inserted into the DOM.
       * @final
       * @internal
       */
      mountComponent: function (internalInstance, transaction, hostParent, hostContainerInfo, context, parentDebugID // 0 in production and for roots
      ) {
        if ("production" !== 'production') {}
        var markup = internalInstance.mountComponent(transaction, hostParent, hostContainerInfo, context, parentDebugID);
        if (internalInstance._currentElement && internalInstance._currentElement.ref != null) {
          transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
        }
        if ("production" !== 'production') {}
        return markup;
      },

      /**
       * Returns a value that can be passed to
       * ReactComponentEnvironment.replaceNodeWithMarkup.
       */
      getHostNode: function (internalInstance) {
        return internalInstance.getHostNode();
      },

      /**
       * Releases any resources allocated by `mountComponent`.
       *
       * @final
       * @internal
       */
      unmountComponent: function (internalInstance, safely) {
        if ("production" !== 'production') {}
        ReactRef.detachRefs(internalInstance, internalInstance._currentElement);
        internalInstance.unmountComponent(safely);
        if ("production" !== 'production') {}
      },

      /**
       * Update a component using a new element.
       *
       * @param {ReactComponent} internalInstance
       * @param {ReactElement} nextElement
       * @param {ReactReconcileTransaction} transaction
       * @param {object} context
       * @internal
       */
      receiveComponent: function (internalInstance, nextElement, transaction, context) {
        var prevElement = internalInstance._currentElement;

        if (nextElement === prevElement && context === internalInstance._context) {
          // Since elements are immutable after the owner is rendered,
          // we can do a cheap identity compare here to determine if this is a
          // superfluous reconcile. It's possible for state to be mutable but such
          // change should trigger an update of the owner which would recreate
          // the element. We explicitly check for the existence of an owner since
          // it's possible for an element created outside a composite to be
          // deeply mutated and reused.

          // TODO: Bailing out early is just a perf optimization right?
          // TODO: Removing the return statement should affect correctness?
          return;
        }

        if ("production" !== 'production') {}

        var refsChanged = ReactRef.shouldUpdateRefs(prevElement, nextElement);

        if (refsChanged) {
          ReactRef.detachRefs(internalInstance, prevElement);
        }

        internalInstance.receiveComponent(nextElement, transaction, context);

        if (refsChanged && internalInstance._currentElement && internalInstance._currentElement.ref != null) {
          transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
        }

        if ("production" !== 'production') {}
      },

      /**
       * Flush any dirty changes in a component.
       *
       * @param {ReactComponent} internalInstance
       * @param {ReactReconcileTransaction} transaction
       * @internal
       */
      performUpdateIfNecessary: function (internalInstance, transaction, updateBatchNumber) {
        if (internalInstance._updateBatchNumber !== updateBatchNumber) {
          // The component's enqueued batch number should always be the current
          // batch or the following one.
          void 0;
          return;
        }
        if ("production" !== 'production') {}
        internalInstance.performUpdateIfNecessary(transaction);
        if ("production" !== 'production') {}
      }

    };

    var __moduleExports$55 = ReactReconciler$2;

    var _prodInvariant$16 = __moduleExports$4;

    var invariant$18 = __moduleExports$5;

    /**
     * `Transaction` creates a black box that is able to wrap any method such that
     * certain invariants are maintained before and after the method is invoked
     * (Even if an exception is thrown while invoking the wrapped method). Whoever
     * instantiates a transaction can provide enforcers of the invariants at
     * creation time. The `Transaction` class itself will supply one additional
     * automatic invariant for you - the invariant that any transaction instance
     * should not be run while it is already being run. You would typically create a
     * single instance of a `Transaction` for reuse multiple times, that potentially
     * is used to wrap several different methods. Wrappers are extremely simple -
     * they only require implementing two methods.
     *
     * <pre>
     *                       wrappers (injected at creation time)
     *                                      +        +
     *                                      |        |
     *                    +-----------------|--------|--------------+
     *                    |                 v        |              |
     *                    |      +---------------+   |              |
     *                    |   +--|    wrapper1   |---|----+         |
     *                    |   |  +---------------+   v    |         |
     *                    |   |          +-------------+  |         |
     *                    |   |     +----|   wrapper2  |--------+   |
     *                    |   |     |    +-------------+  |     |   |
     *                    |   |     |                     |     |   |
     *                    |   v     v                     v     v   | wrapper
     *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
     * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
     * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
     *                    | |   | |   |   |         |   |   | |   | |
     *                    | |   | |   |   |         |   |   | |   | |
     *                    | |   | |   |   |         |   |   | |   | |
     *                    | +---+ +---+   +---------+   +---+ +---+ |
     *                    |  initialize                    close    |
     *                    +-----------------------------------------+
     * </pre>
     *
     * Use cases:
     * - Preserving the input selection ranges before/after reconciliation.
     *   Restoring selection even in the event of an unexpected error.
     * - Deactivating events while rearranging the DOM, preventing blurs/focuses,
     *   while guaranteeing that afterwards, the event system is reactivated.
     * - Flushing a queue of collected DOM mutations to the main UI thread after a
     *   reconciliation takes place in a worker thread.
     * - Invoking any collected `componentDidUpdate` callbacks after rendering new
     *   content.
     * - (Future use case): Wrapping particular flushes of the `ReactWorker` queue
     *   to preserve the `scrollTop` (an automatic scroll aware DOM).
     * - (Future use case): Layout calculations before and after DOM updates.
     *
     * Transactional plugin API:
     * - A module that has an `initialize` method that returns any precomputation.
     * - and a `close` method that accepts the precomputation. `close` is invoked
     *   when the wrapped process is completed, or has failed.
     *
     * @param {Array<TransactionalWrapper>} transactionWrapper Wrapper modules
     * that implement `initialize` and `close`.
     * @return {Transaction} Single transaction for reuse in thread.
     *
     * @class Transaction
     */
    var Mixin = {
      /**
       * Sets up this instance so that it is prepared for collecting metrics. Does
       * so such that this setup method may be used on an instance that is already
       * initialized, in a way that does not consume additional memory upon reuse.
       * That can be useful if you decide to make your subclass of this mixin a
       * "PooledClass".
       */
      reinitializeTransaction: function () {
        this.transactionWrappers = this.getTransactionWrappers();
        if (this.wrapperInitData) {
          this.wrapperInitData.length = 0;
        } else {
          this.wrapperInitData = [];
        }
        this._isInTransaction = false;
      },

      _isInTransaction: false,

      /**
       * @abstract
       * @return {Array<TransactionWrapper>} Array of transaction wrappers.
       */
      getTransactionWrappers: null,

      isInTransaction: function () {
        return !!this._isInTransaction;
      },

      /**
       * Executes the function within a safety window. Use this for the top level
       * methods that result in large amounts of computation/mutations that would
       * need to be safety checked. The optional arguments helps prevent the need
       * to bind in many cases.
       *
       * @param {function} method Member of scope to call.
       * @param {Object} scope Scope to invoke from.
       * @param {Object?=} a Argument to pass to the method.
       * @param {Object?=} b Argument to pass to the method.
       * @param {Object?=} c Argument to pass to the method.
       * @param {Object?=} d Argument to pass to the method.
       * @param {Object?=} e Argument to pass to the method.
       * @param {Object?=} f Argument to pass to the method.
       *
       * @return {*} Return value from `method`.
       */
      perform: function (method, scope, a, b, c, d, e, f) {
        !!this.isInTransaction() ? _prodInvariant$16('27') : void 0;
        var errorThrown;
        var ret;
        try {
          this._isInTransaction = true;
          // Catching errors makes debugging more difficult, so we start with
          // errorThrown set to true before setting it to false after calling
          // close -- if it's still set to true in the finally block, it means
          // one of these calls threw.
          errorThrown = true;
          this.initializeAll(0);
          ret = method.call(scope, a, b, c, d, e, f);
          errorThrown = false;
        } finally {
          try {
            if (errorThrown) {
              // If `method` throws, prefer to show that stack trace over any thrown
              // by invoking `closeAll`.
              try {
                this.closeAll(0);
              } catch (err) {}
            } else {
              // Since `method` didn't throw, we don't want to silence the exception
              // here.
              this.closeAll(0);
            }
          } finally {
            this._isInTransaction = false;
          }
        }
        return ret;
      },

      initializeAll: function (startIndex) {
        var transactionWrappers = this.transactionWrappers;
        for (var i = startIndex; i < transactionWrappers.length; i++) {
          var wrapper = transactionWrappers[i];
          try {
            // Catching errors makes debugging more difficult, so we start with the
            // OBSERVED_ERROR state before overwriting it with the real return value
            // of initialize -- if it's still set to OBSERVED_ERROR in the finally
            // block, it means wrapper.initialize threw.
            this.wrapperInitData[i] = Transaction$1.OBSERVED_ERROR;
            this.wrapperInitData[i] = wrapper.initialize ? wrapper.initialize.call(this) : null;
          } finally {
            if (this.wrapperInitData[i] === Transaction$1.OBSERVED_ERROR) {
              // The initializer for wrapper i threw an error; initialize the
              // remaining wrappers but silence any exceptions from them to ensure
              // that the first error is the one to bubble up.
              try {
                this.initializeAll(i + 1);
              } catch (err) {}
            }
          }
        }
      },

      /**
       * Invokes each of `this.transactionWrappers.close[i]` functions, passing into
       * them the respective return values of `this.transactionWrappers.init[i]`
       * (`close`rs that correspond to initializers that failed will not be
       * invoked).
       */
      closeAll: function (startIndex) {
        !this.isInTransaction() ? _prodInvariant$16('28') : void 0;
        var transactionWrappers = this.transactionWrappers;
        for (var i = startIndex; i < transactionWrappers.length; i++) {
          var wrapper = transactionWrappers[i];
          var initData = this.wrapperInitData[i];
          var errorThrown;
          try {
            // Catching errors makes debugging more difficult, so we start with
            // errorThrown set to true before setting it to false after calling
            // close -- if it's still set to true in the finally block, it means
            // wrapper.close threw.
            errorThrown = true;
            if (initData !== Transaction$1.OBSERVED_ERROR && wrapper.close) {
              wrapper.close.call(this, initData);
            }
            errorThrown = false;
          } finally {
            if (errorThrown) {
              // The closer for wrapper i threw an error; close the remaining
              // wrappers but silence any exceptions from them to ensure that the
              // first error is the one to bubble up.
              try {
                this.closeAll(i + 1);
              } catch (e) {}
            }
          }
        }
        this.wrapperInitData.length = 0;
      }
    };

    var Transaction$1 = {

      Mixin: Mixin,

      /**
       * Token to look for to determine if an error occurred.
       */
      OBSERVED_ERROR: {}

    };

    var __moduleExports$65 = Transaction$1;

var     _prodInvariant$13 = __moduleExports$4;
var     _assign$6 = __moduleExports$1;
    var CallbackQueue = __moduleExports$53;
    var PooledClass$4 = __moduleExports$3;
    var ReactFeatureFlags = __moduleExports$54;
    var ReactReconciler$1 = __moduleExports$55;
    var Transaction = __moduleExports$65;

    var invariant$15 = __moduleExports$5;

    var dirtyComponents = [];
    var updateBatchNumber = 0;
    var asapCallbackQueue = CallbackQueue.getPooled();
    var asapEnqueued = false;

    var batchingStrategy = null;

    function ensureInjected() {
      !(ReactUpdates$2.ReactReconcileTransaction && batchingStrategy) ? _prodInvariant$13('123') : void 0;
    }

    var NESTED_UPDATES = {
      initialize: function () {
        this.dirtyComponentsLength = dirtyComponents.length;
      },
      close: function () {
        if (this.dirtyComponentsLength !== dirtyComponents.length) {
          // Additional updates were enqueued by componentDidUpdate handlers or
          // similar; before our own UPDATE_QUEUEING wrapper closes, we want to run
          // these new updates so that if A's componentDidUpdate calls setState on
          // B, B will update before the callback A's updater provided when calling
          // setState.
          dirtyComponents.splice(0, this.dirtyComponentsLength);
          flushBatchedUpdates();
        } else {
          dirtyComponents.length = 0;
        }
      }
    };

    var UPDATE_QUEUEING = {
      initialize: function () {
        this.callbackQueue.reset();
      },
      close: function () {
        this.callbackQueue.notifyAll();
      }
    };

    var TRANSACTION_WRAPPERS = [NESTED_UPDATES, UPDATE_QUEUEING];

    function ReactUpdatesFlushTransaction() {
      this.reinitializeTransaction();
      this.dirtyComponentsLength = null;
      this.callbackQueue = CallbackQueue.getPooled();
      this.reconcileTransaction = ReactUpdates$2.ReactReconcileTransaction.getPooled(
      /* useCreateElement */true);
    }

    _assign$6(ReactUpdatesFlushTransaction.prototype, Transaction.Mixin, {
      getTransactionWrappers: function () {
        return TRANSACTION_WRAPPERS;
      },

      destructor: function () {
        this.dirtyComponentsLength = null;
        CallbackQueue.release(this.callbackQueue);
        this.callbackQueue = null;
        ReactUpdates$2.ReactReconcileTransaction.release(this.reconcileTransaction);
        this.reconcileTransaction = null;
      },

      perform: function (method, scope, a) {
        // Essentially calls `this.reconcileTransaction.perform(method, scope, a)`
        // with this transaction's wrappers around it.
        return Transaction.Mixin.perform.call(this, this.reconcileTransaction.perform, this.reconcileTransaction, method, scope, a);
      }
    });

    PooledClass$4.addPoolingTo(ReactUpdatesFlushTransaction);

    function batchedUpdates(callback, a, b, c, d, e) {
      ensureInjected();
      batchingStrategy.batchedUpdates(callback, a, b, c, d, e);
    }

    /**
     * Array comparator for ReactComponents by mount ordering.
     *
     * @param {ReactComponent} c1 first component you're comparing
     * @param {ReactComponent} c2 second component you're comparing
     * @return {number} Return value usable by Array.prototype.sort().
     */
    function mountOrderComparator(c1, c2) {
      return c1._mountOrder - c2._mountOrder;
    }

    function runBatchedUpdates(transaction) {
      var len = transaction.dirtyComponentsLength;
      !(len === dirtyComponents.length) ? _prodInvariant$13('124', len, dirtyComponents.length) : void 0;

      // Since reconciling a component higher in the owner hierarchy usually (not
      // always -- see shouldComponentUpdate()) will reconcile children, reconcile
      // them before their children by sorting the array.
      dirtyComponents.sort(mountOrderComparator);

      // Any updates enqueued while reconciling must be performed after this entire
      // batch. Otherwise, if dirtyComponents is [A, B] where A has children B and
      // C, B could update twice in a single batch if C's render enqueues an update
      // to B (since B would have already updated, we should skip it, and the only
      // way we can know to do so is by checking the batch counter).
      updateBatchNumber++;

      for (var i = 0; i < len; i++) {
        // If a component is unmounted before pending changes apply, it will still
        // be here, but we assume that it has cleared its _pendingCallbacks and
        // that performUpdateIfNecessary is a noop.
        var component = dirtyComponents[i];

        // If performUpdateIfNecessary happens to enqueue any new updates, we
        // shouldn't execute the callbacks until the next render happens, so
        // stash the callbacks first
        var callbacks = component._pendingCallbacks;
        component._pendingCallbacks = null;

        var markerName;
        if (ReactFeatureFlags.logTopLevelRenders) {
          var namedComponent = component;
          // Duck type TopLevelWrapper. This is probably always true.
          if (component._currentElement.props === component._renderedComponent._currentElement) {
            namedComponent = component._renderedComponent;
          }
          markerName = 'React update: ' + namedComponent.getName();
          console.time(markerName);
        }

        ReactReconciler$1.performUpdateIfNecessary(component, transaction.reconcileTransaction, updateBatchNumber);

        if (markerName) {
          console.timeEnd(markerName);
        }

        if (callbacks) {
          for (var j = 0; j < callbacks.length; j++) {
            transaction.callbackQueue.enqueue(callbacks[j], component.getPublicInstance());
          }
        }
      }
    }

    var flushBatchedUpdates = function () {
      // ReactUpdatesFlushTransaction's wrappers will clear the dirtyComponents
      // array and perform any updates enqueued by mount-ready handlers (i.e.,
      // componentDidUpdate) but we need to check here too in order to catch
      // updates enqueued by setState callbacks and asap calls.
      while (dirtyComponents.length || asapEnqueued) {
        if (dirtyComponents.length) {
          var transaction = ReactUpdatesFlushTransaction.getPooled();
          transaction.perform(runBatchedUpdates, null, transaction);
          ReactUpdatesFlushTransaction.release(transaction);
        }

        if (asapEnqueued) {
          asapEnqueued = false;
          var queue = asapCallbackQueue;
          asapCallbackQueue = CallbackQueue.getPooled();
          queue.notifyAll();
          CallbackQueue.release(queue);
        }
      }
    };

    /**
     * Mark a component as needing a rerender, adding an optional callback to a
     * list of functions which will be executed once the rerender occurs.
     */
    function enqueueUpdate(component) {
      ensureInjected();

      // Various parts of our code (such as ReactCompositeComponent's
      // _renderValidatedComponent) assume that calls to render aren't nested;
      // verify that that's the case. (This is called by each top-level update
      // function, like setState, forceUpdate, etc.; creation and
      // destruction of top-level components is guarded in ReactMount.)

      if (!batchingStrategy.isBatchingUpdates) {
        batchingStrategy.batchedUpdates(enqueueUpdate, component);
        return;
      }

      dirtyComponents.push(component);
      if (component._updateBatchNumber == null) {
        component._updateBatchNumber = updateBatchNumber + 1;
      }
    }

    /**
     * Enqueue a callback to be run at the end of the current batching cycle. Throws
     * if no updates are currently being performed.
     */
    function asap(callback, context) {
      !batchingStrategy.isBatchingUpdates ? _prodInvariant$13('125') : void 0;
      asapCallbackQueue.enqueue(callback, context);
      asapEnqueued = true;
    }

    var ReactUpdatesInjection = {
      injectReconcileTransaction: function (ReconcileTransaction) {
        !ReconcileTransaction ? _prodInvariant$13('126') : void 0;
        ReactUpdates$2.ReactReconcileTransaction = ReconcileTransaction;
      },

      injectBatchingStrategy: function (_batchingStrategy) {
        !_batchingStrategy ? _prodInvariant$13('127') : void 0;
        !(typeof _batchingStrategy.batchedUpdates === 'function') ? _prodInvariant$13('128') : void 0;
        !(typeof _batchingStrategy.isBatchingUpdates === 'boolean') ? _prodInvariant$13('129') : void 0;
        batchingStrategy = _batchingStrategy;
      }
    };

    var ReactUpdates$2 = {
      /**
       * React references `ReactReconcileTransaction` using this property in order
       * to allow dependency injection.
       *
       * @internal
       */
      ReactReconcileTransaction: null,

      batchedUpdates: batchedUpdates,
      enqueueUpdate: enqueueUpdate,
      flushBatchedUpdates: flushBatchedUpdates,
      injection: ReactUpdatesInjection,
      asap: asap
    };

    var __moduleExports$52 = ReactUpdates$2;

    /**
     * Gets the target node from a native browser event by accounting for
     * inconsistencies in browser DOM APIs.
     *
     * @param {object} nativeEvent Native browser event.
     * @return {DOMEventTarget} Target node.
     */

    function getEventTarget$1(nativeEvent) {
      var target = nativeEvent.target || nativeEvent.srcElement || window;

      // Normalize SVG <use> element events #4963
      if (target.correspondingUseElement) {
        target = target.correspondingUseElement;
      }

      // Safari may fire events on text nodes (Node.TEXT_NODE is 3).
      // @see http://www.quirksmode.org/js/events_properties.html
      return target.nodeType === 3 ? target.parentNode : target;
    }

    var __moduleExports$66 = getEventTarget$1;

    var ExecutionEnvironment$6 = __moduleExports$45;

    var useHasFeature;
    if (ExecutionEnvironment$6.canUseDOM) {
      useHasFeature = document.implementation && document.implementation.hasFeature &&
      // always returns true in newer browsers as per the standard.
      // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
      document.implementation.hasFeature('', '') !== true;
    }

    /**
     * Checks if an event is supported in the current execution environment.
     *
     * NOTE: This will not work correctly for non-generic events such as `change`,
     * `reset`, `load`, `error`, and `select`.
     *
     * Borrows from Modernizr.
     *
     * @param {string} eventNameSuffix Event name, e.g. "click".
     * @param {?boolean} capture Check if the capture phase is supported.
     * @return {boolean} True if the event is supported.
     * @internal
     * @license Modernizr 3.0.0pre (Custom Build) | MIT
     */
    function isEventSupported$1(eventNameSuffix, capture) {
      if (!ExecutionEnvironment$6.canUseDOM || capture && !('addEventListener' in document)) {
        return false;
      }

      var eventName = 'on' + eventNameSuffix;
      var isSupported = eventName in document;

      if (!isSupported) {
        var element = document.createElement('div');
        element.setAttribute(eventName, 'return;');
        isSupported = typeof element[eventName] === 'function';
      }

      if (!isSupported && useHasFeature && eventNameSuffix === 'wheel') {
        // This is the only way to test support for the `wheel` event in IE9+.
        isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
      }

      return isSupported;
    }

    var __moduleExports$67 = isEventSupported$1;

    /**
     * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
     */

    var supportedInputTypes = {
      'color': true,
      'date': true,
      'datetime': true,
      'datetime-local': true,
      'email': true,
      'month': true,
      'number': true,
      'password': true,
      'range': true,
      'search': true,
      'tel': true,
      'text': true,
      'time': true,
      'url': true,
      'week': true
    };

    function isTextInputElement$1(elem) {
      var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();

      if (nodeName === 'input') {
        return !!supportedInputTypes[elem.type];
      }

      if (nodeName === 'textarea') {
        return true;
      }

      return false;
    }

    var __moduleExports$68 = isTextInputElement$1;

    var EventConstants$4 = __moduleExports$37;
    var EventPluginHub$2 = __moduleExports$39;
    var EventPropagators$2 = __moduleExports$38;
    var ExecutionEnvironment$3 = __moduleExports$45;
    var ReactDOMComponentTree$3 = __moduleExports$32;
    var ReactUpdates$1 = __moduleExports$52;
    var SyntheticEvent$3 = __moduleExports$49;

    var getEventTarget = __moduleExports$66;
    var isEventSupported = __moduleExports$67;
    var isTextInputElement = __moduleExports$68;
    var keyOf$3 = __moduleExports$22;

    var topLevelTypes$3 = EventConstants$4.topLevelTypes;

    var eventTypes$1 = {
      change: {
        phasedRegistrationNames: {
          bubbled: keyOf$3({ onChange: null }),
          captured: keyOf$3({ onChangeCapture: null })
        },
        dependencies: [topLevelTypes$3.topBlur, topLevelTypes$3.topChange, topLevelTypes$3.topClick, topLevelTypes$3.topFocus, topLevelTypes$3.topInput, topLevelTypes$3.topKeyDown, topLevelTypes$3.topKeyUp, topLevelTypes$3.topSelectionChange]
      }
    };

    /**
     * For IE shims
     */
    var activeElement = null;
    var activeElementInst = null;
    var activeElementValue = null;
    var activeElementValueProp = null;

    /**
     * SECTION: handle `change` event
     */
    function shouldUseChangeEvent(elem) {
      var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
      return nodeName === 'select' || nodeName === 'input' && elem.type === 'file';
    }

    var doesChangeEventBubble = false;
    if (ExecutionEnvironment$3.canUseDOM) {
      // See `handleChange` comment below
      doesChangeEventBubble = isEventSupported('change') && (!('documentMode' in document) || document.documentMode > 8);
    }

    function manualDispatchChangeEvent(nativeEvent) {
      var event = SyntheticEvent$3.getPooled(eventTypes$1.change, activeElementInst, nativeEvent, getEventTarget(nativeEvent));
      EventPropagators$2.accumulateTwoPhaseDispatches(event);

      // If change and propertychange bubbled, we'd just bind to it like all the
      // other events and have it go through ReactBrowserEventEmitter. Since it
      // doesn't, we manually listen for the events and so we have to enqueue and
      // process the abstract event manually.
      //
      // Batching is necessary here in order to ensure that all event handlers run
      // before the next rerender (including event handlers attached to ancestor
      // elements instead of directly on the input). Without this, controlled
      // components don't work properly in conjunction with event bubbling because
      // the component is rerendered and the value reverted before all the event
      // handlers can run. See https://github.com/facebook/react/issues/708.
      ReactUpdates$1.batchedUpdates(runEventInBatch, event);
    }

    function runEventInBatch(event) {
      EventPluginHub$2.enqueueEvents(event);
      EventPluginHub$2.processEventQueue(false);
    }

    function startWatchingForChangeEventIE8(target, targetInst) {
      activeElement = target;
      activeElementInst = targetInst;
      activeElement.attachEvent('onchange', manualDispatchChangeEvent);
    }

    function stopWatchingForChangeEventIE8() {
      if (!activeElement) {
        return;
      }
      activeElement.detachEvent('onchange', manualDispatchChangeEvent);
      activeElement = null;
      activeElementInst = null;
    }

    function getTargetInstForChangeEvent(topLevelType, targetInst) {
      if (topLevelType === topLevelTypes$3.topChange) {
        return targetInst;
      }
    }
    function handleEventsForChangeEventIE8(topLevelType, target, targetInst) {
      if (topLevelType === topLevelTypes$3.topFocus) {
        // stopWatching() should be a noop here but we call it just in case we
        // missed a blur event somehow.
        stopWatchingForChangeEventIE8();
        startWatchingForChangeEventIE8(target, targetInst);
      } else if (topLevelType === topLevelTypes$3.topBlur) {
        stopWatchingForChangeEventIE8();
      }
    }

    /**
     * SECTION: handle `input` event
     */
    var isInputEventSupported = false;
    if (ExecutionEnvironment$3.canUseDOM) {
      // IE9 claims to support the input event but fails to trigger it when
      // deleting text, so we ignore its input events.
      // IE10+ fire input events to often, such when a placeholder
      // changes or when an input with a placeholder is focused.
      isInputEventSupported = isEventSupported('input') && (!('documentMode' in document) || document.documentMode > 11);
    }

    /**
     * (For IE <=11) Replacement getter/setter for the `value` property that gets
     * set on the active element.
     */
    var newValueProp = {
      get: function () {
        return activeElementValueProp.get.call(this);
      },
      set: function (val) {
        // Cast to a string so we can do equality checks.
        activeElementValue = '' + val;
        activeElementValueProp.set.call(this, val);
      }
    };

    /**
     * (For IE <=11) Starts tracking propertychange events on the passed-in element
     * and override the value property so that we can distinguish user events from
     * value changes in JS.
     */
    function startWatchingForValueChange(target, targetInst) {
      activeElement = target;
      activeElementInst = targetInst;
      activeElementValue = target.value;
      activeElementValueProp = Object.getOwnPropertyDescriptor(target.constructor.prototype, 'value');

      // Not guarded in a canDefineProperty check: IE8 supports defineProperty only
      // on DOM elements
      Object.defineProperty(activeElement, 'value', newValueProp);
      if (activeElement.attachEvent) {
        activeElement.attachEvent('onpropertychange', handlePropertyChange);
      } else {
        activeElement.addEventListener('propertychange', handlePropertyChange, false);
      }
    }

    /**
     * (For IE <=11) Removes the event listeners from the currently-tracked element,
     * if any exists.
     */
    function stopWatchingForValueChange() {
      if (!activeElement) {
        return;
      }

      // delete restores the original property definition
      delete activeElement.value;

      if (activeElement.detachEvent) {
        activeElement.detachEvent('onpropertychange', handlePropertyChange);
      } else {
        activeElement.removeEventListener('propertychange', handlePropertyChange, false);
      }

      activeElement = null;
      activeElementInst = null;
      activeElementValue = null;
      activeElementValueProp = null;
    }

    /**
     * (For IE <=11) Handles a propertychange event, sending a `change` event if
     * the value of the active element has changed.
     */
    function handlePropertyChange(nativeEvent) {
      if (nativeEvent.propertyName !== 'value') {
        return;
      }
      var value = nativeEvent.srcElement.value;
      if (value === activeElementValue) {
        return;
      }
      activeElementValue = value;

      manualDispatchChangeEvent(nativeEvent);
    }

    /**
     * If a `change` event should be fired, returns the target's ID.
     */
    function getTargetInstForInputEvent(topLevelType, targetInst) {
      if (topLevelType === topLevelTypes$3.topInput) {
        // In modern browsers (i.e., not IE8 or IE9), the input event is exactly
        // what we want so fall through here and trigger an abstract event
        return targetInst;
      }
    }

    function handleEventsForInputEventIE(topLevelType, target, targetInst) {
      if (topLevelType === topLevelTypes$3.topFocus) {
        // In IE8, we can capture almost all .value changes by adding a
        // propertychange handler and looking for events with propertyName
        // equal to 'value'
        // In IE9-11, propertychange fires for most input events but is buggy and
        // doesn't fire when text is deleted, but conveniently, selectionchange
        // appears to fire in all of the remaining cases so we catch those and
        // forward the event if the value has changed
        // In either case, we don't want to call the event handler if the value
        // is changed from JS so we redefine a setter for `.value` that updates
        // our activeElementValue variable, allowing us to ignore those changes
        //
        // stopWatching() should be a noop here but we call it just in case we
        // missed a blur event somehow.
        stopWatchingForValueChange();
        startWatchingForValueChange(target, targetInst);
      } else if (topLevelType === topLevelTypes$3.topBlur) {
        stopWatchingForValueChange();
      }
    }

    // For IE8 and IE9.
    function getTargetInstForInputEventIE(topLevelType, targetInst) {
      if (topLevelType === topLevelTypes$3.topSelectionChange || topLevelType === topLevelTypes$3.topKeyUp || topLevelType === topLevelTypes$3.topKeyDown) {
        // On the selectionchange event, the target is just document which isn't
        // helpful for us so just check activeElement instead.
        //
        // 99% of the time, keydown and keyup aren't necessary. IE8 fails to fire
        // propertychange on the first input event after setting `value` from a
        // script and fires only keydown, keypress, keyup. Catching keyup usually
        // gets it and catching keydown lets us fire an event for the first
        // keystroke if user does a key repeat (it'll be a little delayed: right
        // before the second keystroke). Other input methods (e.g., paste) seem to
        // fire selectionchange normally.
        if (activeElement && activeElement.value !== activeElementValue) {
          activeElementValue = activeElement.value;
          return activeElementInst;
        }
      }
    }

    /**
     * SECTION: handle `click` event
     */
    function shouldUseClickEvent(elem) {
      // Use the `click` event to detect changes to checkbox and radio inputs.
      // This approach works across all browsers, whereas `change` does not fire
      // until `blur` in IE8.
      return elem.nodeName && elem.nodeName.toLowerCase() === 'input' && (elem.type === 'checkbox' || elem.type === 'radio');
    }

    function getTargetInstForClickEvent(topLevelType, targetInst) {
      if (topLevelType === topLevelTypes$3.topClick) {
        return targetInst;
      }
    }

    /**
     * This plugin creates an `onChange` event that normalizes change events
     * across form elements. This event fires at a time when it's possible to
     * change the element's value without seeing a flicker.
     *
     * Supported elements are:
     * - input (see `isTextInputElement`)
     * - textarea
     * - select
     */
    var ChangeEventPlugin$1 = {

      eventTypes: eventTypes$1,

      extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var targetNode = targetInst ? ReactDOMComponentTree$3.getNodeFromInstance(targetInst) : window;

        var getTargetInstFunc, handleEventFunc;
        if (shouldUseChangeEvent(targetNode)) {
          if (doesChangeEventBubble) {
            getTargetInstFunc = getTargetInstForChangeEvent;
          } else {
            handleEventFunc = handleEventsForChangeEventIE8;
          }
        } else if (isTextInputElement(targetNode)) {
          if (isInputEventSupported) {
            getTargetInstFunc = getTargetInstForInputEvent;
          } else {
            getTargetInstFunc = getTargetInstForInputEventIE;
            handleEventFunc = handleEventsForInputEventIE;
          }
        } else if (shouldUseClickEvent(targetNode)) {
          getTargetInstFunc = getTargetInstForClickEvent;
        }

        if (getTargetInstFunc) {
          var inst = getTargetInstFunc(topLevelType, targetInst);
          if (inst) {
            var event = SyntheticEvent$3.getPooled(eventTypes$1.change, inst, nativeEvent, nativeEventTarget);
            event.type = 'change';
            EventPropagators$2.accumulateTwoPhaseDispatches(event);
            return event;
          }
        }

        if (handleEventFunc) {
          handleEventFunc(topLevelType, targetNode, targetInst);
        }
      }

    };

    var __moduleExports$51 = ChangeEventPlugin$1;

    var keyOf$4 = __moduleExports$22;

    /**
     * Module that is injectable into `EventPluginHub`, that specifies a
     * deterministic ordering of `EventPlugin`s. A convenient way to reason about
     * plugins, without having to package every one of them. This is better than
     * having plugins be ordered in the same order that they are injected because
     * that ordering would be influenced by the packaging order.
     * `ResponderEventPlugin` must occur before `SimpleEventPlugin` so that
     * preventing default on events is convenient in `SimpleEventPlugin` handlers.
     */
    var DefaultEventPluginOrder$1 = [keyOf$4({ ResponderEventPlugin: null }), keyOf$4({ SimpleEventPlugin: null }), keyOf$4({ TapEventPlugin: null }), keyOf$4({ EnterLeaveEventPlugin: null }), keyOf$4({ ChangeEventPlugin: null }), keyOf$4({ SelectEventPlugin: null }), keyOf$4({ BeforeInputEventPlugin: null })];

    var __moduleExports$69 = DefaultEventPluginOrder$1;

    var SyntheticEvent$4 = __moduleExports$49;

    var getEventTarget$2 = __moduleExports$66;

    /**
     * @interface UIEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
    var UIEventInterface = {
      view: function (event) {
        if (event.view) {
          return event.view;
        }

        var target = getEventTarget$2(event);
        if (target.window === target) {
          // target is a window object
          return target;
        }

        var doc = target.ownerDocument;
        // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
        if (doc) {
          return doc.defaultView || doc.parentWindow;
        } else {
          return window;
        }
      },
      detail: function (event) {
        return event.detail || 0;
      }
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticEvent}
     */
    function SyntheticUIEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticEvent$4.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticEvent$4.augmentClass(SyntheticUIEvent$1, UIEventInterface);

    var __moduleExports$72 = SyntheticUIEvent$1;

    var ViewportMetrics$1 = {

      currentScrollLeft: 0,

      currentScrollTop: 0,

      refreshScrollValues: function (scrollPosition) {
        ViewportMetrics$1.currentScrollLeft = scrollPosition.x;
        ViewportMetrics$1.currentScrollTop = scrollPosition.y;
      }

    };

    var __moduleExports$73 = ViewportMetrics$1;

    /**
     * Translation from modifier key to the associated property in the event.
     * @see http://www.w3.org/TR/DOM-Level-3-Events/#keys-Modifiers
     */

    var modifierKeyToProp = {
      'Alt': 'altKey',
      'Control': 'ctrlKey',
      'Meta': 'metaKey',
      'Shift': 'shiftKey'
    };

    // IE8 does not implement getModifierState so we simply map it to the only
    // modifier keys exposed by the event itself, does not support Lock-keys.
    // Currently, all major browsers except Chrome seems to support Lock-keys.
    function modifierStateGetter(keyArg) {
      var syntheticEvent = this;
      var nativeEvent = syntheticEvent.nativeEvent;
      if (nativeEvent.getModifierState) {
        return nativeEvent.getModifierState(keyArg);
      }
      var keyProp = modifierKeyToProp[keyArg];
      return keyProp ? !!nativeEvent[keyProp] : false;
    }

    function getEventModifierState$1(nativeEvent) {
      return modifierStateGetter;
    }

    var __moduleExports$74 = getEventModifierState$1;

    var SyntheticUIEvent = __moduleExports$72;
    var ViewportMetrics = __moduleExports$73;

    var getEventModifierState = __moduleExports$74;

    /**
     * @interface MouseEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
    var MouseEventInterface = {
      screenX: null,
      screenY: null,
      clientX: null,
      clientY: null,
      ctrlKey: null,
      shiftKey: null,
      altKey: null,
      metaKey: null,
      getModifierState: getEventModifierState,
      button: function (event) {
        // Webkit, Firefox, IE9+
        // which:  1 2 3
        // button: 0 1 2 (standard)
        var button = event.button;
        if ('which' in event) {
          return button;
        }
        // IE<9
        // which:  undefined
        // button: 0 0 0
        // button: 1 4 2 (onmouseup)
        return button === 2 ? 2 : button === 4 ? 1 : 0;
      },
      buttons: null,
      relatedTarget: function (event) {
        return event.relatedTarget || (event.fromElement === event.srcElement ? event.toElement : event.fromElement);
      },
      // "Proprietary" Interface.
      pageX: function (event) {
        return 'pageX' in event ? event.pageX : event.clientX + ViewportMetrics.currentScrollLeft;
      },
      pageY: function (event) {
        return 'pageY' in event ? event.pageY : event.clientY + ViewportMetrics.currentScrollTop;
      }
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticUIEvent}
     */
    function SyntheticMouseEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticUIEvent.augmentClass(SyntheticMouseEvent$1, MouseEventInterface);

    var __moduleExports$71 = SyntheticMouseEvent$1;

    var EventConstants$5 = __moduleExports$37;
    var EventPropagators$3 = __moduleExports$38;
    var ReactDOMComponentTree$4 = __moduleExports$32;
    var SyntheticMouseEvent = __moduleExports$71;

    var keyOf$5 = __moduleExports$22;

    var topLevelTypes$4 = EventConstants$5.topLevelTypes;

    var eventTypes$2 = {
      mouseEnter: {
        registrationName: keyOf$5({ onMouseEnter: null }),
        dependencies: [topLevelTypes$4.topMouseOut, topLevelTypes$4.topMouseOver]
      },
      mouseLeave: {
        registrationName: keyOf$5({ onMouseLeave: null }),
        dependencies: [topLevelTypes$4.topMouseOut, topLevelTypes$4.topMouseOver]
      }
    };

    var EnterLeaveEventPlugin$1 = {

      eventTypes: eventTypes$2,

      /**
       * For almost every interaction we care about, there will be both a top-level
       * `mouseover` and `mouseout` event that occurs. Only use `mouseout` so that
       * we do not extract duplicate events. However, moving the mouse into the
       * browser from outside will not fire a `mouseout` event. In this case, we use
       * the `mouseover` top-level event.
       */
      extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        if (topLevelType === topLevelTypes$4.topMouseOver && (nativeEvent.relatedTarget || nativeEvent.fromElement)) {
          return null;
        }
        if (topLevelType !== topLevelTypes$4.topMouseOut && topLevelType !== topLevelTypes$4.topMouseOver) {
          // Must not be a mouse in or mouse out - ignoring.
          return null;
        }

        var win;
        if (nativeEventTarget.window === nativeEventTarget) {
          // `nativeEventTarget` is probably a window object.
          win = nativeEventTarget;
        } else {
          // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
          var doc = nativeEventTarget.ownerDocument;
          if (doc) {
            win = doc.defaultView || doc.parentWindow;
          } else {
            win = window;
          }
        }

        var from;
        var to;
        if (topLevelType === topLevelTypes$4.topMouseOut) {
          from = targetInst;
          var related = nativeEvent.relatedTarget || nativeEvent.toElement;
          to = related ? ReactDOMComponentTree$4.getClosestInstanceFromNode(related) : null;
        } else {
          // Moving to a node from outside the window.
          from = null;
          to = targetInst;
        }

        if (from === to) {
          // Nothing pertains to our managed components.
          return null;
        }

        var fromNode = from == null ? win : ReactDOMComponentTree$4.getNodeFromInstance(from);
        var toNode = to == null ? win : ReactDOMComponentTree$4.getNodeFromInstance(to);

        var leave = SyntheticMouseEvent.getPooled(eventTypes$2.mouseLeave, from, nativeEvent, nativeEventTarget);
        leave.type = 'mouseleave';
        leave.target = fromNode;
        leave.relatedTarget = toNode;

        var enter = SyntheticMouseEvent.getPooled(eventTypes$2.mouseEnter, to, nativeEvent, nativeEventTarget);
        enter.type = 'mouseenter';
        enter.target = toNode;
        enter.relatedTarget = fromNode;

        EventPropagators$3.accumulateEnterLeaveDispatches(leave, enter, from, to);

        return [leave, enter];
      }

    };

    var __moduleExports$70 = EnterLeaveEventPlugin$1;

    var DOMProperty$2 = __moduleExports$33;

    var MUST_USE_PROPERTY = DOMProperty$2.injection.MUST_USE_PROPERTY;
    var HAS_BOOLEAN_VALUE = DOMProperty$2.injection.HAS_BOOLEAN_VALUE;
    var HAS_NUMERIC_VALUE = DOMProperty$2.injection.HAS_NUMERIC_VALUE;
    var HAS_POSITIVE_NUMERIC_VALUE = DOMProperty$2.injection.HAS_POSITIVE_NUMERIC_VALUE;
    var HAS_OVERLOADED_BOOLEAN_VALUE = DOMProperty$2.injection.HAS_OVERLOADED_BOOLEAN_VALUE;

    var HTMLDOMPropertyConfig$1 = {
      isCustomAttribute: RegExp.prototype.test.bind(new RegExp('^(data|aria)-[' + DOMProperty$2.ATTRIBUTE_NAME_CHAR + ']*$')),
      Properties: {
        /**
         * Standard Properties
         */
        accept: 0,
        acceptCharset: 0,
        accessKey: 0,
        action: 0,
        allowFullScreen: HAS_BOOLEAN_VALUE,
        allowTransparency: 0,
        alt: 0,
        async: HAS_BOOLEAN_VALUE,
        autoComplete: 0,
        // autoFocus is polyfilled/normalized by AutoFocusUtils
        // autoFocus: HAS_BOOLEAN_VALUE,
        autoPlay: HAS_BOOLEAN_VALUE,
        capture: HAS_BOOLEAN_VALUE,
        cellPadding: 0,
        cellSpacing: 0,
        charSet: 0,
        challenge: 0,
        checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
        cite: 0,
        classID: 0,
        className: 0,
        cols: HAS_POSITIVE_NUMERIC_VALUE,
        colSpan: 0,
        content: 0,
        contentEditable: 0,
        contextMenu: 0,
        controls: HAS_BOOLEAN_VALUE,
        coords: 0,
        crossOrigin: 0,
        data: 0, // For `<object />` acts as `src`.
        dateTime: 0,
        'default': HAS_BOOLEAN_VALUE,
        defer: HAS_BOOLEAN_VALUE,
        dir: 0,
        disabled: HAS_BOOLEAN_VALUE,
        download: HAS_OVERLOADED_BOOLEAN_VALUE,
        draggable: 0,
        encType: 0,
        form: 0,
        formAction: 0,
        formEncType: 0,
        formMethod: 0,
        formNoValidate: HAS_BOOLEAN_VALUE,
        formTarget: 0,
        frameBorder: 0,
        headers: 0,
        height: 0,
        hidden: HAS_BOOLEAN_VALUE,
        high: 0,
        href: 0,
        hrefLang: 0,
        htmlFor: 0,
        httpEquiv: 0,
        icon: 0,
        id: 0,
        inputMode: 0,
        integrity: 0,
        is: 0,
        keyParams: 0,
        keyType: 0,
        kind: 0,
        label: 0,
        lang: 0,
        list: 0,
        loop: HAS_BOOLEAN_VALUE,
        low: 0,
        manifest: 0,
        marginHeight: 0,
        marginWidth: 0,
        max: 0,
        maxLength: 0,
        media: 0,
        mediaGroup: 0,
        method: 0,
        min: 0,
        minLength: 0,
        // Caution; `option.selected` is not updated if `select.multiple` is
        // disabled with `removeAttribute`.
        multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
        muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
        name: 0,
        nonce: 0,
        noValidate: HAS_BOOLEAN_VALUE,
        open: HAS_BOOLEAN_VALUE,
        optimum: 0,
        pattern: 0,
        placeholder: 0,
        poster: 0,
        preload: 0,
        profile: 0,
        radioGroup: 0,
        readOnly: HAS_BOOLEAN_VALUE,
        referrerPolicy: 0,
        rel: 0,
        required: HAS_BOOLEAN_VALUE,
        reversed: HAS_BOOLEAN_VALUE,
        role: 0,
        rows: HAS_POSITIVE_NUMERIC_VALUE,
        rowSpan: HAS_NUMERIC_VALUE,
        sandbox: 0,
        scope: 0,
        scoped: HAS_BOOLEAN_VALUE,
        scrolling: 0,
        seamless: HAS_BOOLEAN_VALUE,
        selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
        shape: 0,
        size: HAS_POSITIVE_NUMERIC_VALUE,
        sizes: 0,
        span: HAS_POSITIVE_NUMERIC_VALUE,
        spellCheck: 0,
        src: 0,
        srcDoc: 0,
        srcLang: 0,
        srcSet: 0,
        start: HAS_NUMERIC_VALUE,
        step: 0,
        style: 0,
        summary: 0,
        tabIndex: 0,
        target: 0,
        title: 0,
        // Setting .type throws on non-<input> tags
        type: 0,
        useMap: 0,
        value: 0,
        width: 0,
        wmode: 0,
        wrap: 0,

        /**
         * RDFa Properties
         */
        about: 0,
        datatype: 0,
        inlist: 0,
        prefix: 0,
        // property is also supported for OpenGraph in meta tags.
        property: 0,
        resource: 0,
        'typeof': 0,
        vocab: 0,

        /**
         * Non-standard Properties
         */
        // autoCapitalize and autoCorrect are supported in Mobile Safari for
        // keyboard hints.
        autoCapitalize: 0,
        autoCorrect: 0,
        // autoSave allows WebKit/Blink to persist values of input fields on page reloads
        autoSave: 0,
        // color is for Safari mask-icon link
        color: 0,
        // itemProp, itemScope, itemType are for
        // Microdata support. See http://schema.org/docs/gs.html
        itemProp: 0,
        itemScope: HAS_BOOLEAN_VALUE,
        itemType: 0,
        // itemID and itemRef are for Microdata support as well but
        // only specified in the WHATWG spec document. See
        // https://html.spec.whatwg.org/multipage/microdata.html#microdata-dom-api
        itemID: 0,
        itemRef: 0,
        // results show looking glass icon and recent searches on input
        // search fields in WebKit/Blink
        results: 0,
        // IE-only attribute that specifies security restrictions on an iframe
        // as an alternative to the sandbox attribute on IE<10
        security: 0,
        // IE-only attribute that controls focus behavior
        unselectable: 0
      },
      DOMAttributeNames: {
        acceptCharset: 'accept-charset',
        className: 'class',
        htmlFor: 'for',
        httpEquiv: 'http-equiv'
      },
      DOMPropertyNames: {}
    };

    var __moduleExports$75 = HTMLDOMPropertyConfig$1;

    var DOMNamespaces$1 = {
      html: 'http://www.w3.org/1999/xhtml',
      mathml: 'http://www.w3.org/1998/Math/MathML',
      svg: 'http://www.w3.org/2000/svg'
    };

    var __moduleExports$79 = DOMNamespaces$1;

    /**
     * Create a function which has 'unsafe' privileges (required by windows8 apps)
     */

    var createMicrosoftUnsafeLocalFunction$3 = function (func) {
      if (typeof MSApp !== 'undefined' && MSApp.execUnsafeLocalFunction) {
        return function (arg0, arg1, arg2, arg3) {
          MSApp.execUnsafeLocalFunction(function () {
            return func(arg0, arg1, arg2, arg3);
          });
        };
      } else {
        return func;
      }
    };

    var __moduleExports$81 = createMicrosoftUnsafeLocalFunction$3;

    var ExecutionEnvironment$7 = __moduleExports$45;
    var DOMNamespaces$2 = __moduleExports$79;

    var WHITESPACE_TEST = /^[ \r\n\t\f]/;
    var NONVISIBLE_TEST = /<(!--|link|noscript|meta|script|style)[ \r\n\t\f\/>]/;

    var createMicrosoftUnsafeLocalFunction$2 = __moduleExports$81;

    // SVG temp container for IE lacking innerHTML
    var reusableSVGContainer;

    /**
     * Set the innerHTML property of a node, ensuring that whitespace is preserved
     * even in IE8.
     *
     * @param {DOMElement} node
     * @param {string} html
     * @internal
     */
    var setInnerHTML$2 = createMicrosoftUnsafeLocalFunction$2(function (node, html) {
      // IE does not have innerHTML for SVG nodes, so instead we inject the
      // new markup in a temp node and then move the child nodes across into
      // the target node
      if (node.namespaceURI === DOMNamespaces$2.svg && !('innerHTML' in node)) {
        reusableSVGContainer = reusableSVGContainer || document.createElement('div');
        reusableSVGContainer.innerHTML = '<svg>' + html + '</svg>';
        var newNodes = reusableSVGContainer.firstChild.childNodes;
        for (var i = 0; i < newNodes.length; i++) {
          node.appendChild(newNodes[i]);
        }
      } else {
        node.innerHTML = html;
      }
    });

    if (ExecutionEnvironment$7.canUseDOM) {
      // IE8: When updating a just created node with innerHTML only leading
      // whitespace is removed. When updating an existing node with innerHTML
      // whitespace in root TextNodes is also collapsed.
      // @see quirksmode.org/bugreports/archives/2004/11/innerhtml_and_t.html

      // Feature detection; only IE8 is known to behave improperly like this.
      var testElement = document.createElement('div');
      testElement.innerHTML = ' ';
      if (testElement.innerHTML === '') {
        setInnerHTML$2 = function (node, html) {
          // Magic theory: IE8 supposedly differentiates between added and updated
          // nodes when processing innerHTML, innerHTML on updated nodes suffers
          // from worse whitespace behavior. Re-adding a node like this triggers
          // the initial and more favorable whitespace behavior.
          // TODO: What to do on a detached node?
          if (node.parentNode) {
            node.parentNode.replaceChild(node, node);
          }

          // We also implement a workaround for non-visible tags disappearing into
          // thin air on IE8, this only happens if there is no visible text
          // in-front of the non-visible tags. Piggyback on the whitespace fix
          // and simply check if any non-visible tags appear in the source.
          if (WHITESPACE_TEST.test(html) || html[0] === '<' && NONVISIBLE_TEST.test(html)) {
            // Recover leading whitespace by temporarily prepending any character.
            // \uFEFF has the potential advantage of being zero-width/invisible.
            // UglifyJS drops U+FEFF chars when parsing, so use String.fromCharCode
            // in hopes that this is preserved even if "\uFEFF" is transformed to
            // the actual Unicode character (by Babel, for example).
            // https://github.com/mishoo/UglifyJS2/blob/v2.4.20/lib/parse.js#L216
            node.innerHTML = String.fromCharCode(0xFEFF) + html;

            // deleteData leaves an empty `TextNode` which offsets the index of all
            // children. Definitely want to avoid this.
            var textNode = node.firstChild;
            if (textNode.data.length === 1) {
              node.removeChild(textNode);
            } else {
              textNode.deleteData(0, 1);
            }
          } else {
            node.innerHTML = html;
          }
        };
      }
      testElement = null;
    }

    var __moduleExports$80 = setInnerHTML$2;

    // code copied and modified from escape-html
    /**
     * Module variables.
     * @private
     */

    var matchHtmlRegExp = /["'&<>]/;

    /**
     * Escape special characters in the given string of html.
     *
     * @param  {string} string The string to escape for inserting into HTML
     * @return {string}
     * @public
     */

    function escapeHtml(string) {
      var str = '' + string;
      var match = matchHtmlRegExp.exec(str);

      if (!match) {
        return str;
      }

      var escape;
      var html = '';
      var index = 0;
      var lastIndex = 0;

      for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
          case 34:
            // "
            escape = '&quot;';
            break;
          case 38:
            // &
            escape = '&amp;';
            break;
          case 39:
            // '
            escape = '&#x27;'; // modified from escape-html; used to be '&#39'
            break;
          case 60:
            // <
            escape = '&lt;';
            break;
          case 62:
            // >
            escape = '&gt;';
            break;
          default:
            continue;
        }

        if (lastIndex !== index) {
          html += str.substring(lastIndex, index);
        }

        lastIndex = index + 1;
        html += escape;
      }

      return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
    }
    // end code copied and modified from escape-html


    /**
     * Escapes text to prevent scripting attacks.
     *
     * @param {*} text Text value to escape.
     * @return {string} An escaped string.
     */
    function escapeTextContentForBrowser$1(text) {
      if (typeof text === 'boolean' || typeof text === 'number') {
        // this shortcircuit helps perf for types that we know will never have
        // special characters, especially given that this function is used often
        // for numeric dom ids.
        return '' + text;
      }
      return escapeHtml(text);
    }

    var __moduleExports$83 = escapeTextContentForBrowser$1;

    var ExecutionEnvironment$8 = __moduleExports$45;
    var escapeTextContentForBrowser = __moduleExports$83;
    var setInnerHTML$3 = __moduleExports$80;

    /**
     * Set the textContent property of a node, ensuring that whitespace is preserved
     * even in IE8. innerText is a poor substitute for textContent and, among many
     * issues, inserts <br> instead of the literal newline chars. innerHTML behaves
     * as it should.
     *
     * @param {DOMElement} node
     * @param {string} text
     * @internal
     */
    var setTextContent$2 = function (node, text) {
      if (text) {
        var firstChild = node.firstChild;

        if (firstChild && firstChild === node.lastChild && firstChild.nodeType === 3) {
          firstChild.nodeValue = text;
          return;
        }
      }
      node.textContent = text;
    };

    if (ExecutionEnvironment$8.canUseDOM) {
      if (!('textContent' in document.documentElement)) {
        setTextContent$2 = function (node, text) {
          setInnerHTML$3(node, escapeTextContentForBrowser(text));
        };
      }
    }

    var __moduleExports$82 = setTextContent$2;

    var DOMNamespaces = __moduleExports$79;
    var setInnerHTML$1 = __moduleExports$80;

    var createMicrosoftUnsafeLocalFunction$1 = __moduleExports$81;
    var setTextContent$1 = __moduleExports$82;

    var ELEMENT_NODE_TYPE = 1;
    var DOCUMENT_FRAGMENT_NODE_TYPE = 11;

    /**
     * In IE (8-11) and Edge, appending nodes with no children is dramatically
     * faster than appending a full subtree, so we essentially queue up the
     * .appendChild calls here and apply them so each node is added to its parent
     * before any children are added.
     *
     * In other browsers, doing so is slower or neutral compared to the other order
     * (in Firefox, twice as slow) so we only do this inversion in IE.
     *
     * See https://github.com/spicyj/innerhtml-vs-createelement-vs-clonenode.
     */
    var enableLazy = typeof document !== 'undefined' && typeof document.documentMode === 'number' || typeof navigator !== 'undefined' && typeof navigator.userAgent === 'string' && /\bEdge\/\d/.test(navigator.userAgent);

    function insertTreeChildren(tree) {
      if (!enableLazy) {
        return;
      }
      var node = tree.node;
      var children = tree.children;
      if (children.length) {
        for (var i = 0; i < children.length; i++) {
          insertTreeBefore(node, children[i], null);
        }
      } else if (tree.html != null) {
        setInnerHTML$1(node, tree.html);
      } else if (tree.text != null) {
        setTextContent$1(node, tree.text);
      }
    }

    var insertTreeBefore = createMicrosoftUnsafeLocalFunction$1(function (parentNode, tree, referenceNode) {
      // DocumentFragments aren't actually part of the DOM after insertion so
      // appending children won't update the DOM. We need to ensure the fragment
      // is properly populated first, breaking out of our lazy approach for just
      // this level. Also, some <object> plugins (like Flash Player) will read
      // <param> nodes immediately upon insertion into the DOM, so <object>
      // must also be populated prior to insertion into the DOM.
      if (tree.node.nodeType === DOCUMENT_FRAGMENT_NODE_TYPE || tree.node.nodeType === ELEMENT_NODE_TYPE && tree.node.nodeName.toLowerCase() === 'object' && (tree.node.namespaceURI == null || tree.node.namespaceURI === DOMNamespaces.html)) {
        insertTreeChildren(tree);
        parentNode.insertBefore(tree.node, referenceNode);
      } else {
        parentNode.insertBefore(tree.node, referenceNode);
        insertTreeChildren(tree);
      }
    });

    function replaceChildWithTree(oldNode, newTree) {
      oldNode.parentNode.replaceChild(newTree.node, oldNode);
      insertTreeChildren(newTree);
    }

    function queueChild(parentTree, childTree) {
      if (enableLazy) {
        parentTree.children.push(childTree);
      } else {
        parentTree.node.appendChild(childTree.node);
      }
    }

    function queueHTML(tree, html) {
      if (enableLazy) {
        tree.html = html;
      } else {
        setInnerHTML$1(tree.node, html);
      }
    }

    function queueText(tree, text) {
      if (enableLazy) {
        tree.text = text;
      } else {
        setTextContent$1(tree.node, text);
      }
    }

    function toString() {
      return this.node.nodeName;
    }

    function DOMLazyTree$1(node) {
      return {
        node: node,
        children: [],
        html: null,
        text: null,
        toString: toString
      };
    }

    DOMLazyTree$1.insertTreeBefore = insertTreeBefore;
    DOMLazyTree$1.replaceChildWithTree = replaceChildWithTree;
    DOMLazyTree$1.queueChild = queueChild;
    DOMLazyTree$1.queueHTML = queueHTML;
    DOMLazyTree$1.queueText = queueText;

    var __moduleExports$78 = DOMLazyTree$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @typechecks
     */

    var invariant$21 = __moduleExports$5;

    /**
     * Convert array-like objects to arrays.
     *
     * This API assumes the caller knows the contents of the data type. For less
     * well defined inputs use createArrayFromMixed.
     *
     * @param {object|function|filelist} obj
     * @return {array}
     */
    function toArray$2(obj) {
      var length = obj.length;

      // Some browsers builtin objects can report typeof 'function' (e.g. NodeList
      // in old versions of Safari).
      !(!Array.isArray(obj) && (typeof obj === 'object' || typeof obj === 'function')) ? invariant$21(false) : void 0;

      !(typeof length === 'number') ? invariant$21(false) : void 0;

      !(length === 0 || length - 1 in obj) ? invariant$21(false) : void 0;

      !(typeof obj.callee !== 'function') ? invariant$21(false) : void 0;

      // Old IE doesn't give collections access to hasOwnProperty. Assume inputs
      // without method will throw during the slice call and skip straight to the
      // fallback.
      if (obj.hasOwnProperty) {
        try {
          return Array.prototype.slice.call(obj);
        } catch (e) {
          // IE < 9 does not support Array#slice on collections objects
        }
      }

      // Fall back to copying key by key. This assumes all keys have a value,
      // so will not preserve sparsely populated inputs.
      var ret = Array(length);
      for (var ii = 0; ii < length; ii++) {
        ret[ii] = obj[ii];
      }
      return ret;
    }

    /**
     * Perform a heuristic test to determine if an object is "array-like".
     *
     *   A monk asked Joshu, a Zen master, "Has a dog Buddha nature?"
     *   Joshu replied: "Mu."
     *
     * This function determines if its argument has "array nature": it returns
     * true if the argument is an actual array, an `arguments' object, or an
     * HTMLCollection (e.g. node.childNodes or node.getElementsByTagName()).
     *
     * It will return false for other array-like objects like Filelist.
     *
     * @param {*} obj
     * @return {boolean}
     */
    function hasArrayNature(obj) {
      return (
        // not null/false
        !!obj && (
        // arrays are objects, NodeLists are functions in Safari
        typeof obj == 'object' || typeof obj == 'function') &&
        // quacks like an array
        'length' in obj &&
        // not window
        !('setInterval' in obj) &&
        // no DOM node should be considered an array-like
        // a 'select' element has 'length' and 'item' properties on IE8
        typeof obj.nodeType != 'number' && (
        // a real array
        Array.isArray(obj) ||
        // arguments
        'callee' in obj ||
        // HTMLCollection/NodeList
        'item' in obj)
      );
    }

    /**
     * Ensure that the argument is an array by wrapping it in an array if it is not.
     * Creates a copy of the argument if it is already an array.
     *
     * This is mostly useful idiomatically:
     *
     *   var createArrayFromMixed = require('createArrayFromMixed');
     *
     *   function takesOneOrMoreThings(things) {
     *     things = createArrayFromMixed(things);
     *     ...
     *   }
     *
     * This allows you to treat `things' as an array, but accept scalars in the API.
     *
     * If you need to convert an array-like object, like `arguments`, into an array
     * use toArray instead.
     *
     * @param {*} obj
     * @return {array}
     */
    function createArrayFromMixed$1(obj) {
      if (!hasArrayNature(obj)) {
        return [obj];
      } else if (Array.isArray(obj)) {
        return obj.slice();
      } else {
        return toArray$2(obj);
      }
    }

    var __moduleExports$86 = createArrayFromMixed$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    /*eslint-disable fb-www/unsafe-html */

    var ExecutionEnvironment$11 = __moduleExports$45;

    var invariant$22 = __moduleExports$5;

    /**
     * Dummy container used to detect which wraps are necessary.
     */
    var dummyNode$1 = ExecutionEnvironment$11.canUseDOM ? document.createElement('div') : null;

    /**
     * Some browsers cannot use `innerHTML` to render certain elements standalone,
     * so we wrap them, render the wrapped nodes, then extract the desired node.
     *
     * In IE8, certain elements cannot render alone, so wrap all elements ('*').
     */

    var shouldWrap = {};

    var selectWrap = [1, '<select multiple="true">', '</select>'];
    var tableWrap = [1, '<table>', '</table>'];
    var trWrap = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

    var svgWrap = [1, '<svg xmlns="http://www.w3.org/2000/svg">', '</svg>'];

    var markupWrap = {
      '*': [1, '?<div>', '</div>'],

      'area': [1, '<map>', '</map>'],
      'col': [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
      'legend': [1, '<fieldset>', '</fieldset>'],
      'param': [1, '<object>', '</object>'],
      'tr': [2, '<table><tbody>', '</tbody></table>'],

      'optgroup': selectWrap,
      'option': selectWrap,

      'caption': tableWrap,
      'colgroup': tableWrap,
      'tbody': tableWrap,
      'tfoot': tableWrap,
      'thead': tableWrap,

      'td': trWrap,
      'th': trWrap
    };

    // Initialize the SVG elements since we know they'll always need to be wrapped
    // consistently. If they are created inside a <div> they will be initialized in
    // the wrong namespace (and will not display).
    var svgElements = ['circle', 'clipPath', 'defs', 'ellipse', 'g', 'image', 'line', 'linearGradient', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'text', 'tspan'];
    svgElements.forEach(function (nodeName) {
      markupWrap[nodeName] = svgWrap;
      shouldWrap[nodeName] = true;
    });

    /**
     * Gets the markup wrap configuration for the supplied `nodeName`.
     *
     * NOTE: This lazily detects which wraps are necessary for the current browser.
     *
     * @param {string} nodeName Lowercase `nodeName`.
     * @return {?array} Markup wrap configuration, if applicable.
     */
    function getMarkupWrap$1(nodeName) {
      !!!dummyNode$1 ? invariant$22(false) : void 0;
      if (!markupWrap.hasOwnProperty(nodeName)) {
        nodeName = '*';
      }
      if (!shouldWrap.hasOwnProperty(nodeName)) {
        if (nodeName === '*') {
          dummyNode$1.innerHTML = '<link />';
        } else {
          dummyNode$1.innerHTML = '<' + nodeName + '></' + nodeName + '>';
        }
        shouldWrap[nodeName] = !dummyNode$1.firstChild;
      }
      return shouldWrap[nodeName] ? markupWrap[nodeName] : null;
    }

    var __moduleExports$87 = getMarkupWrap$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @typechecks
     */

    /*eslint-disable fb-www/unsafe-html*/

    var ExecutionEnvironment$10 = __moduleExports$45;

    var createArrayFromMixed = __moduleExports$86;
    var getMarkupWrap = __moduleExports$87;
    var invariant$20 = __moduleExports$5;

    /**
     * Dummy container used to render all markup.
     */
    var dummyNode = ExecutionEnvironment$10.canUseDOM ? document.createElement('div') : null;

    /**
     * Pattern used by `getNodeName`.
     */
    var nodeNamePattern = /^\s*<(\w+)/;

    /**
     * Extracts the `nodeName` of the first element in a string of markup.
     *
     * @param {string} markup String of markup.
     * @return {?string} Node name of the supplied markup.
     */
    function getNodeName(markup) {
      var nodeNameMatch = markup.match(nodeNamePattern);
      return nodeNameMatch && nodeNameMatch[1].toLowerCase();
    }

    /**
     * Creates an array containing the nodes rendered from the supplied markup. The
     * optionally supplied `handleScript` function will be invoked once for each
     * <script> element that is rendered. If no `handleScript` function is supplied,
     * an exception is thrown if any <script> elements are rendered.
     *
     * @param {string} markup A string of valid HTML markup.
     * @param {?function} handleScript Invoked once for each rendered <script>.
     * @return {array<DOMElement|DOMTextNode>} An array of rendered nodes.
     */
    function createNodesFromMarkup$1(markup, handleScript) {
      var node = dummyNode;
      !!!dummyNode ? invariant$20(false) : void 0;
      var nodeName = getNodeName(markup);

      var wrap = nodeName && getMarkupWrap(nodeName);
      if (wrap) {
        node.innerHTML = wrap[1] + markup + wrap[2];

        var wrapDepth = wrap[0];
        while (wrapDepth--) {
          node = node.lastChild;
        }
      } else {
        node.innerHTML = markup;
      }

      var scripts = node.getElementsByTagName('script');
      if (scripts.length) {
        !handleScript ? invariant$20(false) : void 0;
        createArrayFromMixed(scripts).forEach(handleScript);
      }

      var nodes = Array.from(node.childNodes);
      while (node.lastChild) {
        node.removeChild(node.lastChild);
      }
      return nodes;
    }

    var __moduleExports$85 = createNodesFromMarkup$1;

    var _prodInvariant$17 = __moduleExports$4;

    var DOMLazyTree$2 = __moduleExports$78;
    var ExecutionEnvironment$9 = __moduleExports$45;

    var createNodesFromMarkup = __moduleExports$85;
    var emptyFunction$5 = __moduleExports$9;
    var invariant$19 = __moduleExports$5;

    var Danger$1 = {

      /**
       * Replaces a node with a string of markup at its current position within its
       * parent. The markup must render into a single root node.
       *
       * @param {DOMElement} oldChild Child node to replace.
       * @param {string} markup Markup to render in place of the child node.
       * @internal
       */
      dangerouslyReplaceNodeWithMarkup: function (oldChild, markup) {
        !ExecutionEnvironment$9.canUseDOM ? _prodInvariant$17('56') : void 0;
        !markup ? _prodInvariant$17('57') : void 0;
        !(oldChild.nodeName !== 'HTML') ? _prodInvariant$17('58') : void 0;

        if (typeof markup === 'string') {
          var newChild = createNodesFromMarkup(markup, emptyFunction$5)[0];
          oldChild.parentNode.replaceChild(newChild, oldChild);
        } else {
          DOMLazyTree$2.replaceChildWithTree(oldChild, markup);
        }
      }

    };

    var __moduleExports$84 = Danger$1;

    var keyMirror$4 = __moduleExports$20;

    /**
     * When a component's children are updated, a series of update configuration
     * objects are created in order to batch and serialize the required changes.
     *
     * Enumerates all the possible types of update configurations.
     *
     * @internal
     */
    var ReactMultiChildUpdateTypes$1 = keyMirror$4({
      INSERT_MARKUP: null,
      MOVE_EXISTING: null,
      REMOVE_NODE: null,
      SET_MARKUP: null,
      TEXT_CONTENT: null
    });

    var __moduleExports$88 = ReactMultiChildUpdateTypes$1;

    var DOMLazyTree = __moduleExports$78;
    var Danger = __moduleExports$84;
    var ReactMultiChildUpdateTypes = __moduleExports$88;
    var ReactDOMComponentTree$5 = __moduleExports$32;
    var createMicrosoftUnsafeLocalFunction = __moduleExports$81;
    var setInnerHTML = __moduleExports$80;
    var setTextContent = __moduleExports$82;

    function getNodeAfter(parentNode, node) {
      // Special case for text components, which return [open, close] comments
      // from getHostNode.
      if (Array.isArray(node)) {
        node = node[1];
      }
      return node ? node.nextSibling : parentNode.firstChild;
    }

    /**
     * Inserts `childNode` as a child of `parentNode` at the `index`.
     *
     * @param {DOMElement} parentNode Parent node in which to insert.
     * @param {DOMElement} childNode Child node to insert.
     * @param {number} index Index at which to insert the child.
     * @internal
     */
    var insertChildAt = createMicrosoftUnsafeLocalFunction(function (parentNode, childNode, referenceNode) {
      // We rely exclusively on `insertBefore(node, null)` instead of also using
      // `appendChild(node)`. (Using `undefined` is not allowed by all browsers so
      // we are careful to use `null`.)
      parentNode.insertBefore(childNode, referenceNode);
    });

    function insertLazyTreeChildAt(parentNode, childTree, referenceNode) {
      DOMLazyTree.insertTreeBefore(parentNode, childTree, referenceNode);
    }

    function moveChild(parentNode, childNode, referenceNode) {
      if (Array.isArray(childNode)) {
        moveDelimitedText(parentNode, childNode[0], childNode[1], referenceNode);
      } else {
        insertChildAt(parentNode, childNode, referenceNode);
      }
    }

    function removeChild(parentNode, childNode) {
      if (Array.isArray(childNode)) {
        var closingComment = childNode[1];
        childNode = childNode[0];
        removeDelimitedText(parentNode, childNode, closingComment);
        parentNode.removeChild(closingComment);
      }
      parentNode.removeChild(childNode);
    }

    function moveDelimitedText(parentNode, openingComment, closingComment, referenceNode) {
      var node = openingComment;
      while (true) {
        var nextNode = node.nextSibling;
        insertChildAt(parentNode, node, referenceNode);
        if (node === closingComment) {
          break;
        }
        node = nextNode;
      }
    }

    function removeDelimitedText(parentNode, startNode, closingComment) {
      while (true) {
        var node = startNode.nextSibling;
        if (node === closingComment) {
          // The closing comment is removed by ReactMultiChild.
          break;
        } else {
          parentNode.removeChild(node);
        }
      }
    }

    function replaceDelimitedText(openingComment, closingComment, stringText) {
      var parentNode = openingComment.parentNode;
      var nodeAfterComment = openingComment.nextSibling;
      if (nodeAfterComment === closingComment) {
        // There are no text nodes between the opening and closing comments; insert
        // a new one if stringText isn't empty.
        if (stringText) {
          insertChildAt(parentNode, document.createTextNode(stringText), nodeAfterComment);
        }
      } else {
        if (stringText) {
          // Set the text content of the first node after the opening comment, and
          // remove all following nodes up until the closing comment.
          setTextContent(nodeAfterComment, stringText);
          removeDelimitedText(parentNode, nodeAfterComment, closingComment);
        } else {
          removeDelimitedText(parentNode, openingComment, closingComment);
        }
      }

      if ("production" !== 'production') {}
    }

    var dangerouslyReplaceNodeWithMarkup = Danger.dangerouslyReplaceNodeWithMarkup;
    /**
     * Operations for updating with DOM children.
     */
    var DOMChildrenOperations$1 = {

      dangerouslyReplaceNodeWithMarkup: dangerouslyReplaceNodeWithMarkup,

      replaceDelimitedText: replaceDelimitedText,

      /**
       * Updates a component's children by processing a series of updates. The
       * update configurations are each expected to have a `parentNode` property.
       *
       * @param {array<object>} updates List of update configurations.
       * @internal
       */
      processUpdates: function (parentNode, updates) {
        if ("production" !== 'production') {}

        for (var k = 0; k < updates.length; k++) {
          var update = updates[k];
          switch (update.type) {
            case ReactMultiChildUpdateTypes.INSERT_MARKUP:
              insertLazyTreeChildAt(parentNode, update.content, getNodeAfter(parentNode, update.afterNode));
              if ("production" !== 'production') {}
              break;
            case ReactMultiChildUpdateTypes.MOVE_EXISTING:
              moveChild(parentNode, update.fromNode, getNodeAfter(parentNode, update.afterNode));
              if ("production" !== 'production') {}
              break;
            case ReactMultiChildUpdateTypes.SET_MARKUP:
              setInnerHTML(parentNode, update.content);
              if ("production" !== 'production') {}
              break;
            case ReactMultiChildUpdateTypes.TEXT_CONTENT:
              setTextContent(parentNode, update.content);
              if ("production" !== 'production') {}
              break;
            case ReactMultiChildUpdateTypes.REMOVE_NODE:
              removeChild(parentNode, update.fromNode);
              if ("production" !== 'production') {}
              break;
          }
        }
      }

    };

    var __moduleExports$77 = DOMChildrenOperations$1;

    var DOMChildrenOperations$2 = __moduleExports$77;
    var ReactDOMComponentTree$6 = __moduleExports$32;

    /**
     * Operations used to process updates to DOM nodes.
     */
    var ReactDOMIDOperations$1 = {

      /**
       * Updates a component's children by processing a series of updates.
       *
       * @param {array<object>} updates List of update configurations.
       * @internal
       */
      dangerouslyProcessChildrenUpdates: function (parentInst, updates) {
        var node = ReactDOMComponentTree$6.getNodeFromInstance(parentInst);
        DOMChildrenOperations$2.processUpdates(node, updates);
      }
    };

    var __moduleExports$89 = ReactDOMIDOperations$1;

    var DOMChildrenOperations = __moduleExports$77;
    var ReactDOMIDOperations = __moduleExports$89;

    /**
     * Abstracts away all functionality of the reconciler that requires knowledge of
     * the browser context. TODO: These callers should be refactored to avoid the
     * need for this injection.
     */
    var ReactComponentBrowserEnvironment$1 = {

      processChildrenUpdates: ReactDOMIDOperations.dangerouslyProcessChildrenUpdates,

      replaceNodeWithMarkup: DOMChildrenOperations.dangerouslyReplaceNodeWithMarkup

    };

    var __moduleExports$76 = ReactComponentBrowserEnvironment$1;

    /**
     * @param {DOMElement} node input/textarea to focus
     */

    function focusNode$1(node) {
      // IE8 can throw "Can't move focus to the control because it is invisible,
      // not enabled, or of a type that does not accept the focus." for all kinds of
      // reasons that are too expensive and fragile to test.
      try {
        node.focus();
      } catch (e) {}
    }

    var __moduleExports$92 = focusNode$1;

    var ReactDOMComponentTree$8 = __moduleExports$32;

    var focusNode = __moduleExports$92;

    var AutoFocusUtils$1 = {
      focusDOMComponent: function () {
        focusNode(ReactDOMComponentTree$8.getNodeFromInstance(this));
      }
    };

    var __moduleExports$91 = AutoFocusUtils$1;

    /**
     * CSS properties which accept numbers but are not in units of "px".
     */

    var isUnitlessNumber = {
      animationIterationCount: true,
      borderImageOutset: true,
      borderImageSlice: true,
      borderImageWidth: true,
      boxFlex: true,
      boxFlexGroup: true,
      boxOrdinalGroup: true,
      columnCount: true,
      flex: true,
      flexGrow: true,
      flexPositive: true,
      flexShrink: true,
      flexNegative: true,
      flexOrder: true,
      gridRow: true,
      gridColumn: true,
      fontWeight: true,
      lineClamp: true,
      lineHeight: true,
      opacity: true,
      order: true,
      orphans: true,
      tabSize: true,
      widows: true,
      zIndex: true,
      zoom: true,

      // SVG-related properties
      fillOpacity: true,
      floodOpacity: true,
      stopOpacity: true,
      strokeDasharray: true,
      strokeDashoffset: true,
      strokeMiterlimit: true,
      strokeOpacity: true,
      strokeWidth: true
    };

    /**
     * @param {string} prefix vendor-specific prefix, eg: Webkit
     * @param {string} key style name, eg: transitionDuration
     * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
     * WebkitTransitionDuration
     */
    function prefixKey(prefix, key) {
      return prefix + key.charAt(0).toUpperCase() + key.substring(1);
    }

    /**
     * Support style names that may come passed in prefixed by adding permutations
     * of vendor prefixes.
     */
    var prefixes = ['Webkit', 'ms', 'Moz', 'O'];

    // Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
    // infinite loop, because it iterates over the newly added props too.
    Object.keys(isUnitlessNumber).forEach(function (prop) {
      prefixes.forEach(function (prefix) {
        isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
      });
    });

    /**
     * Most style properties can be unset by doing .style[prop] = '' but IE8
     * doesn't like doing that with shorthand properties so for the properties that
     * IE8 breaks on, which are listed here, we instead unset each of the
     * individual properties. See http://bugs.jquery.com/ticket/12385.
     * The 4-value 'clock' properties like margin, padding, border-width seem to
     * behave without any problems. Curiously, list-style works too without any
     * special prodding.
     */
    var shorthandPropertyExpansions = {
      background: {
        backgroundAttachment: true,
        backgroundColor: true,
        backgroundImage: true,
        backgroundPositionX: true,
        backgroundPositionY: true,
        backgroundRepeat: true
      },
      backgroundPosition: {
        backgroundPositionX: true,
        backgroundPositionY: true
      },
      border: {
        borderWidth: true,
        borderStyle: true,
        borderColor: true
      },
      borderBottom: {
        borderBottomWidth: true,
        borderBottomStyle: true,
        borderBottomColor: true
      },
      borderLeft: {
        borderLeftWidth: true,
        borderLeftStyle: true,
        borderLeftColor: true
      },
      borderRight: {
        borderRightWidth: true,
        borderRightStyle: true,
        borderRightColor: true
      },
      borderTop: {
        borderTopWidth: true,
        borderTopStyle: true,
        borderTopColor: true
      },
      font: {
        fontStyle: true,
        fontVariant: true,
        fontWeight: true,
        fontSize: true,
        lineHeight: true,
        fontFamily: true
      },
      outline: {
        outlineWidth: true,
        outlineStyle: true,
        outlineColor: true
      }
    };

    var CSSProperty$1 = {
      isUnitlessNumber: isUnitlessNumber,
      shorthandPropertyExpansions: shorthandPropertyExpansions
    };

    var __moduleExports$94 = CSSProperty$1;

    var CSSProperty$2 = __moduleExports$94;
    var isUnitlessNumber$1 = CSSProperty$2.isUnitlessNumber;
    /**
     * Convert a value into the proper css writable value. The style name `name`
     * should be logical (no hyphens), as specified
     * in `CSSProperty.isUnitlessNumber`.
     *
     * @param {string} name CSS property name such as `topMargin`.
     * @param {*} value CSS property value such as `10px`.
     * @param {ReactDOMComponent} component
     * @return {string} Normalized style value with dimensions applied.
     */
    function dangerousStyleValue$1(name, value, component) {
      // Note that we've removed escapeTextForBrowser() calls here since the
      // whole string will be escaped when the attribute is injected into
      // the markup. If you provide unsafe user data here they can inject
      // arbitrary CSS which may be problematic (I couldn't repro this):
      // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
      // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
      // This is not an XSS hole but instead a potential CSS injection issue
      // which has lead to a greater discussion about how we're going to
      // trust URLs moving forward. See #2115901

      var isEmpty = value == null || typeof value === 'boolean' || value === '';
      if (isEmpty) {
        return '';
      }

      var isNonNumeric = isNaN(value);
      if (isNonNumeric || value === 0 || isUnitlessNumber$1.hasOwnProperty(name) && isUnitlessNumber$1[name]) {
        return '' + value; // cast to string
      }

      if (typeof value === 'string') {
        if ("production" !== 'production') {}
        value = value.trim();
      }
      return value + 'px';
    }

    var __moduleExports$97 = dangerousStyleValue$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @typechecks
     */

    var _uppercasePattern = /([A-Z])/g;

    /**
     * Hyphenates a camelcased string, for example:
     *
     *   > hyphenate('backgroundColor')
     *   < "background-color"
     *
     * For CSS style names, use `hyphenateStyleName` instead which works properly
     * with all vendor prefixes, including `ms`.
     *
     * @param {string} string
     * @return {string}
     */
    function hyphenate$1(string) {
      return string.replace(_uppercasePattern, '-$1').toLowerCase();
    }

    var __moduleExports$99 = hyphenate$1;

    var hyphenate = __moduleExports$99;

    var msPattern$1 = /^ms-/;

    /**
     * Hyphenates a camelcased CSS property name, for example:
     *
     *   > hyphenateStyleName('backgroundColor')
     *   < "background-color"
     *   > hyphenateStyleName('MozTransition')
     *   < "-moz-transition"
     *   > hyphenateStyleName('msTransition')
     *   < "-ms-transition"
     *
     * As Modernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
     * is converted to `-ms-`.
     *
     * @param {string} string
     * @return {string}
     */
    function hyphenateStyleName$1(string) {
      return hyphenate(string).replace(msPattern$1, '-ms-');
    }

    var __moduleExports$98 = hyphenateStyleName$1;

    /**
     * Memoizes the return value of a function that accepts one string argument.
     */

    function memoizeStringOnly$1(callback) {
      var cache = {};
      return function (string) {
        if (!cache.hasOwnProperty(string)) {
          cache[string] = callback.call(this, string);
        }
        return cache[string];
      };
    }

    var __moduleExports$100 = memoizeStringOnly$1;

    var CSSProperty = __moduleExports$94;
    var ExecutionEnvironment$12 = __moduleExports$45;
    var dangerousStyleValue = __moduleExports$97;
    var hyphenateStyleName = __moduleExports$98;
    var memoizeStringOnly = __moduleExports$100;
    var processStyleName = memoizeStringOnly(function (styleName) {
      return hyphenateStyleName(styleName);
    });

    var hasShorthandPropertyBug = false;
    var styleFloatAccessor = 'cssFloat';
    if (ExecutionEnvironment$12.canUseDOM) {
      var tempStyle = document.createElement('div').style;
      try {
        // IE8 throws "Invalid argument." if resetting shorthand style properties.
        tempStyle.font = '';
      } catch (e) {
        hasShorthandPropertyBug = true;
      }
      // IE8 only supports accessing cssFloat (standard) as styleFloat
      if (document.documentElement.style.cssFloat === undefined) {
        styleFloatAccessor = 'styleFloat';
      }
    }

    /**
     * Operations for dealing with CSS properties.
     */
    var CSSPropertyOperations$1 = {

      /**
       * Serializes a mapping of style properties for use as inline styles:
       *
       *   > createMarkupForStyles({width: '200px', height: 0})
       *   "width:200px;height:0;"
       *
       * Undefined values are ignored so that declarative programming is easier.
       * The result should be HTML-escaped before insertion into the DOM.
       *
       * @param {object} styles
       * @param {ReactDOMComponent} component
       * @return {?string}
       */
      createMarkupForStyles: function (styles, component) {
        var serialized = '';
        for (var styleName in styles) {
          if (!styles.hasOwnProperty(styleName)) {
            continue;
          }
          var styleValue = styles[styleName];
          if ("production" !== 'production') {}
          if (styleValue != null) {
            serialized += processStyleName(styleName) + ':';
            serialized += dangerousStyleValue(styleName, styleValue, component) + ';';
          }
        }
        return serialized || null;
      },

      /**
       * Sets the value for multiple styles on a node.  If a value is specified as
       * '' (empty string), the corresponding style property will be unset.
       *
       * @param {DOMElement} node
       * @param {object} styles
       * @param {ReactDOMComponent} component
       */
      setValueForStyles: function (node, styles, component) {
        if ("production" !== 'production') {}

        var style = node.style;
        for (var styleName in styles) {
          if (!styles.hasOwnProperty(styleName)) {
            continue;
          }
          if ("production" !== 'production') {}
          var styleValue = dangerousStyleValue(styleName, styles[styleName], component);
          if (styleName === 'float' || styleName === 'cssFloat') {
            styleName = styleFloatAccessor;
          }
          if (styleValue) {
            style[styleName] = styleValue;
          } else {
            var expansion = hasShorthandPropertyBug && CSSProperty.shorthandPropertyExpansions[styleName];
            if (expansion) {
              // Shorthand property that IE8 won't like unsetting, so unset each
              // component to placate it
              for (var individualStyleName in expansion) {
                style[individualStyleName] = '';
              }
            } else {
              style[styleName] = '';
            }
          }
        }
      }

    };

    var __moduleExports$93 = CSSPropertyOperations$1;

    var escapeTextContentForBrowser$3 = __moduleExports$83;

    /**
     * Escapes attribute value to prevent scripting attacks.
     *
     * @param {*} value Value to escape.
     * @return {string} An escaped string.
     */
    function quoteAttributeValueForBrowser$1(value) {
      return '"' + escapeTextContentForBrowser$3(value) + '"';
    }

    var __moduleExports$102 = quoteAttributeValueForBrowser$1;

    var DOMProperty$4 = __moduleExports$33;
    var ReactDOMComponentTree$9 = __moduleExports$32;
    var quoteAttributeValueForBrowser = __moduleExports$102;
    var VALID_ATTRIBUTE_NAME_REGEX = new RegExp('^[' + DOMProperty$4.ATTRIBUTE_NAME_START_CHAR + '][' + DOMProperty$4.ATTRIBUTE_NAME_CHAR + ']*$');
    var illegalAttributeNameCache = {};
    var validatedAttributeNameCache = {};

    function isAttributeNameSafe(attributeName) {
      if (validatedAttributeNameCache.hasOwnProperty(attributeName)) {
        return true;
      }
      if (illegalAttributeNameCache.hasOwnProperty(attributeName)) {
        return false;
      }
      if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
        validatedAttributeNameCache[attributeName] = true;
        return true;
      }
      illegalAttributeNameCache[attributeName] = true;
      void 0;
      return false;
    }

    function shouldIgnoreValue(propertyInfo, value) {
      return value == null || propertyInfo.hasBooleanValue && !value || propertyInfo.hasNumericValue && isNaN(value) || propertyInfo.hasPositiveNumericValue && value < 1 || propertyInfo.hasOverloadedBooleanValue && value === false;
    }

    /**
     * Operations for dealing with DOM properties.
     */
    var DOMPropertyOperations$1 = {

      /**
       * Creates markup for the ID property.
       *
       * @param {string} id Unescaped ID.
       * @return {string} Markup string.
       */
      createMarkupForID: function (id) {
        return DOMProperty$4.ID_ATTRIBUTE_NAME + '=' + quoteAttributeValueForBrowser(id);
      },

      setAttributeForID: function (node, id) {
        node.setAttribute(DOMProperty$4.ID_ATTRIBUTE_NAME, id);
      },

      createMarkupForRoot: function () {
        return DOMProperty$4.ROOT_ATTRIBUTE_NAME + '=""';
      },

      setAttributeForRoot: function (node) {
        node.setAttribute(DOMProperty$4.ROOT_ATTRIBUTE_NAME, '');
      },

      /**
       * Creates markup for a property.
       *
       * @param {string} name
       * @param {*} value
       * @return {?string} Markup string, or null if the property was invalid.
       */
      createMarkupForProperty: function (name, value) {
        var propertyInfo = DOMProperty$4.properties.hasOwnProperty(name) ? DOMProperty$4.properties[name] : null;
        if (propertyInfo) {
          if (shouldIgnoreValue(propertyInfo, value)) {
            return '';
          }
          var attributeName = propertyInfo.attributeName;
          if (propertyInfo.hasBooleanValue || propertyInfo.hasOverloadedBooleanValue && value === true) {
            return attributeName + '=""';
          }
          return attributeName + '=' + quoteAttributeValueForBrowser(value);
        } else if (DOMProperty$4.isCustomAttribute(name)) {
          if (value == null) {
            return '';
          }
          return name + '=' + quoteAttributeValueForBrowser(value);
        }
        return null;
      },

      /**
       * Creates markup for a custom property.
       *
       * @param {string} name
       * @param {*} value
       * @return {string} Markup string, or empty string if the property was invalid.
       */
      createMarkupForCustomAttribute: function (name, value) {
        if (!isAttributeNameSafe(name) || value == null) {
          return '';
        }
        return name + '=' + quoteAttributeValueForBrowser(value);
      },

      /**
       * Sets the value for a property on a node.
       *
       * @param {DOMElement} node
       * @param {string} name
       * @param {*} value
       */
      setValueForProperty: function (node, name, value) {
        var propertyInfo = DOMProperty$4.properties.hasOwnProperty(name) ? DOMProperty$4.properties[name] : null;
        if (propertyInfo) {
          var mutationMethod = propertyInfo.mutationMethod;
          if (mutationMethod) {
            mutationMethod(node, value);
          } else if (shouldIgnoreValue(propertyInfo, value)) {
            this.deleteValueForProperty(node, name);
            return;
          } else if (propertyInfo.mustUseProperty) {
            // Contrary to `setAttribute`, object properties are properly
            // `toString`ed by IE8/9.
            node[propertyInfo.propertyName] = value;
          } else {
            var attributeName = propertyInfo.attributeName;
            var namespace = propertyInfo.attributeNamespace;
            // `setAttribute` with objects becomes only `[object]` in IE8/9,
            // ('' + value) makes it output the correct toString()-value.
            if (namespace) {
              node.setAttributeNS(namespace, attributeName, '' + value);
            } else if (propertyInfo.hasBooleanValue || propertyInfo.hasOverloadedBooleanValue && value === true) {
              node.setAttribute(attributeName, '');
            } else {
              node.setAttribute(attributeName, '' + value);
            }
          }
        } else if (DOMProperty$4.isCustomAttribute(name)) {
          DOMPropertyOperations$1.setValueForAttribute(node, name, value);
          return;
        }

        if ("production" !== 'production') {}
      },

      setValueForAttribute: function (node, name, value) {
        if (!isAttributeNameSafe(name)) {
          return;
        }
        if (value == null) {
          node.removeAttribute(name);
        } else {
          node.setAttribute(name, '' + value);
        }

        if ("production" !== 'production') {}
      },

      /**
       * Deletes an attributes from a node.
       *
       * @param {DOMElement} node
       * @param {string} name
       */
      deleteValueForAttribute: function (node, name) {
        node.removeAttribute(name);
        if ("production" !== 'production') {}
      },

      /**
       * Deletes the value for a property on a node.
       *
       * @param {DOMElement} node
       * @param {string} name
       */
      deleteValueForProperty: function (node, name) {
        var propertyInfo = DOMProperty$4.properties.hasOwnProperty(name) ? DOMProperty$4.properties[name] : null;
        if (propertyInfo) {
          var mutationMethod = propertyInfo.mutationMethod;
          if (mutationMethod) {
            mutationMethod(node, undefined);
          } else if (propertyInfo.mustUseProperty) {
            var propName = propertyInfo.propertyName;
            if (propertyInfo.hasBooleanValue) {
              node[propName] = false;
            } else {
              node[propName] = '';
            }
          } else {
            node.removeAttribute(propertyInfo.attributeName);
          }
        } else if (DOMProperty$4.isCustomAttribute(name)) {
          node.removeAttribute(name);
        }

        if ("production" !== 'production') {}
      }

    };

    var __moduleExports$101 = DOMPropertyOperations$1;

    var EventPluginHub$4 = __moduleExports$39;

    function runEventQueueInBatch(events) {
      EventPluginHub$4.enqueueEvents(events);
      EventPluginHub$4.processEventQueue(false);
    }

    var ReactEventEmitterMixin$1 = {

      /**
       * Streams a fired top-level event to `EventPluginHub` where plugins have the
       * opportunity to create `ReactEvent`s to be dispatched.
       */
      handleTopLevel: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var events = EventPluginHub$4.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
        runEventQueueInBatch(events);
      }
    };

    var __moduleExports$104 = ReactEventEmitterMixin$1;

    var ExecutionEnvironment$13 = __moduleExports$45;

    /**
     * Generate a mapping of standard vendor prefixes using the defined style property and event name.
     *
     * @param {string} styleProp
     * @param {string} eventName
     * @returns {object}
     */
    function makePrefixMap(styleProp, eventName) {
      var prefixes = {};

      prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
      prefixes['Webkit' + styleProp] = 'webkit' + eventName;
      prefixes['Moz' + styleProp] = 'moz' + eventName;
      prefixes['ms' + styleProp] = 'MS' + eventName;
      prefixes['O' + styleProp] = 'o' + eventName.toLowerCase();

      return prefixes;
    }

    /**
     * A list of event names to a configurable list of vendor prefixes.
     */
    var vendorPrefixes = {
      animationend: makePrefixMap('Animation', 'AnimationEnd'),
      animationiteration: makePrefixMap('Animation', 'AnimationIteration'),
      animationstart: makePrefixMap('Animation', 'AnimationStart'),
      transitionend: makePrefixMap('Transition', 'TransitionEnd')
    };

    /**
     * Event names that have already been detected and prefixed (if applicable).
     */
    var prefixedEventNames = {};

    /**
     * Element to check for prefixes on.
     */
    var style = {};

    /**
     * Bootstrap if a DOM exists.
     */
    if (ExecutionEnvironment$13.canUseDOM) {
      style = document.createElement('div').style;

      // On some platforms, in particular some releases of Android 4.x,
      // the un-prefixed "animation" and "transition" properties are defined on the
      // style object but the events that fire will still be prefixed, so we need
      // to check if the un-prefixed events are usable, and if not remove them from the map.
      if (!('AnimationEvent' in window)) {
        delete vendorPrefixes.animationend.animation;
        delete vendorPrefixes.animationiteration.animation;
        delete vendorPrefixes.animationstart.animation;
      }

      // Same as above
      if (!('TransitionEvent' in window)) {
        delete vendorPrefixes.transitionend.transition;
      }
    }

    /**
     * Attempts to determine the correct vendor prefixed event name.
     *
     * @param {string} eventName
     * @returns {string}
     */
    function getVendorPrefixedEventName$1(eventName) {
      if (prefixedEventNames[eventName]) {
        return prefixedEventNames[eventName];
      } else if (!vendorPrefixes[eventName]) {
        return eventName;
      }

      var prefixMap = vendorPrefixes[eventName];

      for (var styleProp in prefixMap) {
        if (prefixMap.hasOwnProperty(styleProp) && styleProp in style) {
          return prefixedEventNames[eventName] = prefixMap[styleProp];
        }
      }

      return '';
    }

    var __moduleExports$105 = getVendorPrefixedEventName$1;

    var _assign$9 = __moduleExports$1;

    var EventConstants$7 = __moduleExports$37;
    var EventPluginRegistry$3 = __moduleExports$40;
    var ReactEventEmitterMixin = __moduleExports$104;
    var ViewportMetrics$2 = __moduleExports$73;

    var getVendorPrefixedEventName = __moduleExports$105;
    var isEventSupported$3 = __moduleExports$67;

    /**
     * Summary of `ReactBrowserEventEmitter` event handling:
     *
     *  - Top-level delegation is used to trap most native browser events. This
     *    may only occur in the main thread and is the responsibility of
     *    ReactEventListener, which is injected and can therefore support pluggable
     *    event sources. This is the only work that occurs in the main thread.
     *
     *  - We normalize and de-duplicate events to account for browser quirks. This
     *    may be done in the worker thread.
     *
     *  - Forward these native events (with the associated top-level type used to
     *    trap it) to `EventPluginHub`, which in turn will ask plugins if they want
     *    to extract any synthetic events.
     *
     *  - The `EventPluginHub` will then process each event by annotating them with
     *    "dispatches", a sequence of listeners and IDs that care about that event.
     *
     *  - The `EventPluginHub` then dispatches the events.
     *
     * Overview of React and the event system:
     *
     * +------------+    .
     * |    DOM     |    .
     * +------------+    .
     *       |           .
     *       v           .
     * +------------+    .
     * | ReactEvent |    .
     * |  Listener  |    .
     * +------------+    .                         +-----------+
     *       |           .               +--------+|SimpleEvent|
     *       |           .               |         |Plugin     |
     * +-----|------+    .               v         +-----------+
     * |     |      |    .    +--------------+                    +------------+
     * |     +-----------.--->|EventPluginHub|                    |    Event   |
     * |            |    .    |              |     +-----------+  | Propagators|
     * | ReactEvent |    .    |              |     |TapEvent   |  |------------|
     * |  Emitter   |    .    |              |<---+|Plugin     |  |other plugin|
     * |            |    .    |              |     +-----------+  |  utilities |
     * |     +-----------.--->|              |                    +------------+
     * |     |      |    .    +--------------+
     * +-----|------+    .                ^        +-----------+
     *       |           .                |        |Enter/Leave|
     *       +           .                +-------+|Plugin     |
     * +-------------+   .                         +-----------+
     * | application |   .
     * |-------------|   .
     * |             |   .
     * |             |   .
     * +-------------+   .
     *                   .
     *    React Core     .  General Purpose Event Plugin System
     */

    var hasEventPageXY;
    var alreadyListeningTo = {};
    var isMonitoringScrollValue = false;
    var reactTopListenersCounter = 0;

    // For events like 'submit' which don't consistently bubble (which we trap at a
    // lower node than `document`), binding at `document` would cause duplicate
    // events so we don't include them here
    var topEventMapping = {
      topAbort: 'abort',
      topAnimationEnd: getVendorPrefixedEventName('animationend') || 'animationend',
      topAnimationIteration: getVendorPrefixedEventName('animationiteration') || 'animationiteration',
      topAnimationStart: getVendorPrefixedEventName('animationstart') || 'animationstart',
      topBlur: 'blur',
      topCanPlay: 'canplay',
      topCanPlayThrough: 'canplaythrough',
      topChange: 'change',
      topClick: 'click',
      topCompositionEnd: 'compositionend',
      topCompositionStart: 'compositionstart',
      topCompositionUpdate: 'compositionupdate',
      topContextMenu: 'contextmenu',
      topCopy: 'copy',
      topCut: 'cut',
      topDoubleClick: 'dblclick',
      topDrag: 'drag',
      topDragEnd: 'dragend',
      topDragEnter: 'dragenter',
      topDragExit: 'dragexit',
      topDragLeave: 'dragleave',
      topDragOver: 'dragover',
      topDragStart: 'dragstart',
      topDrop: 'drop',
      topDurationChange: 'durationchange',
      topEmptied: 'emptied',
      topEncrypted: 'encrypted',
      topEnded: 'ended',
      topError: 'error',
      topFocus: 'focus',
      topInput: 'input',
      topKeyDown: 'keydown',
      topKeyPress: 'keypress',
      topKeyUp: 'keyup',
      topLoadedData: 'loadeddata',
      topLoadedMetadata: 'loadedmetadata',
      topLoadStart: 'loadstart',
      topMouseDown: 'mousedown',
      topMouseMove: 'mousemove',
      topMouseOut: 'mouseout',
      topMouseOver: 'mouseover',
      topMouseUp: 'mouseup',
      topPaste: 'paste',
      topPause: 'pause',
      topPlay: 'play',
      topPlaying: 'playing',
      topProgress: 'progress',
      topRateChange: 'ratechange',
      topScroll: 'scroll',
      topSeeked: 'seeked',
      topSeeking: 'seeking',
      topSelectionChange: 'selectionchange',
      topStalled: 'stalled',
      topSuspend: 'suspend',
      topTextInput: 'textInput',
      topTimeUpdate: 'timeupdate',
      topTouchCancel: 'touchcancel',
      topTouchEnd: 'touchend',
      topTouchMove: 'touchmove',
      topTouchStart: 'touchstart',
      topTransitionEnd: getVendorPrefixedEventName('transitionend') || 'transitionend',
      topVolumeChange: 'volumechange',
      topWaiting: 'waiting',
      topWheel: 'wheel'
    };

    /**
     * To ensure no conflicts with other potential React instances on the page
     */
    var topListenersIDKey = '_reactListenersID' + String(Math.random()).slice(2);

    function getListeningForDocument(mountAt) {
      // In IE8, `mountAt` is a host object and doesn't have `hasOwnProperty`
      // directly.
      if (!Object.prototype.hasOwnProperty.call(mountAt, topListenersIDKey)) {
        mountAt[topListenersIDKey] = reactTopListenersCounter++;
        alreadyListeningTo[mountAt[topListenersIDKey]] = {};
      }
      return alreadyListeningTo[mountAt[topListenersIDKey]];
    }

    /**
     * `ReactBrowserEventEmitter` is used to attach top-level event listeners. For
     * example:
     *
     *   EventPluginHub.putListener('myID', 'onClick', myFunction);
     *
     * This would allocate a "registration" of `('onClick', myFunction)` on 'myID'.
     *
     * @internal
     */
    var ReactBrowserEventEmitter$1 = _assign$9({}, ReactEventEmitterMixin, {

      /**
       * Injectable event backend
       */
      ReactEventListener: null,

      injection: {
        /**
         * @param {object} ReactEventListener
         */
        injectReactEventListener: function (ReactEventListener) {
          ReactEventListener.setHandleTopLevel(ReactBrowserEventEmitter$1.handleTopLevel);
          ReactBrowserEventEmitter$1.ReactEventListener = ReactEventListener;
        }
      },

      /**
       * Sets whether or not any created callbacks should be enabled.
       *
       * @param {boolean} enabled True if callbacks should be enabled.
       */
      setEnabled: function (enabled) {
        if (ReactBrowserEventEmitter$1.ReactEventListener) {
          ReactBrowserEventEmitter$1.ReactEventListener.setEnabled(enabled);
        }
      },

      /**
       * @return {boolean} True if callbacks are enabled.
       */
      isEnabled: function () {
        return !!(ReactBrowserEventEmitter$1.ReactEventListener && ReactBrowserEventEmitter$1.ReactEventListener.isEnabled());
      },

      /**
       * We listen for bubbled touch events on the document object.
       *
       * Firefox v8.01 (and possibly others) exhibited strange behavior when
       * mounting `onmousemove` events at some node that was not the document
       * element. The symptoms were that if your mouse is not moving over something
       * contained within that mount point (for example on the background) the
       * top-level listeners for `onmousemove` won't be called. However, if you
       * register the `mousemove` on the document object, then it will of course
       * catch all `mousemove`s. This along with iOS quirks, justifies restricting
       * top-level listeners to the document object only, at least for these
       * movement types of events and possibly all events.
       *
       * @see http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
       *
       * Also, `keyup`/`keypress`/`keydown` do not bubble to the window on IE, but
       * they bubble to document.
       *
       * @param {string} registrationName Name of listener (e.g. `onClick`).
       * @param {object} contentDocumentHandle Document which owns the container
       */
      listenTo: function (registrationName, contentDocumentHandle) {
        var mountAt = contentDocumentHandle;
        var isListening = getListeningForDocument(mountAt);
        var dependencies = EventPluginRegistry$3.registrationNameDependencies[registrationName];

        var topLevelTypes = EventConstants$7.topLevelTypes;
        for (var i = 0; i < dependencies.length; i++) {
          var dependency = dependencies[i];
          if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
            if (dependency === topLevelTypes.topWheel) {
              if (isEventSupported$3('wheel')) {
                ReactBrowserEventEmitter$1.ReactEventListener.trapBubbledEvent(topLevelTypes.topWheel, 'wheel', mountAt);
              } else if (isEventSupported$3('mousewheel')) {
                ReactBrowserEventEmitter$1.ReactEventListener.trapBubbledEvent(topLevelTypes.topWheel, 'mousewheel', mountAt);
              } else {
                // Firefox needs to capture a different mouse scroll event.
                // @see http://www.quirksmode.org/dom/events/tests/scroll.html
                ReactBrowserEventEmitter$1.ReactEventListener.trapBubbledEvent(topLevelTypes.topWheel, 'DOMMouseScroll', mountAt);
              }
            } else if (dependency === topLevelTypes.topScroll) {

              if (isEventSupported$3('scroll', true)) {
                ReactBrowserEventEmitter$1.ReactEventListener.trapCapturedEvent(topLevelTypes.topScroll, 'scroll', mountAt);
              } else {
                ReactBrowserEventEmitter$1.ReactEventListener.trapBubbledEvent(topLevelTypes.topScroll, 'scroll', ReactBrowserEventEmitter$1.ReactEventListener.WINDOW_HANDLE);
              }
            } else if (dependency === topLevelTypes.topFocus || dependency === topLevelTypes.topBlur) {

              if (isEventSupported$3('focus', true)) {
                ReactBrowserEventEmitter$1.ReactEventListener.trapCapturedEvent(topLevelTypes.topFocus, 'focus', mountAt);
                ReactBrowserEventEmitter$1.ReactEventListener.trapCapturedEvent(topLevelTypes.topBlur, 'blur', mountAt);
              } else if (isEventSupported$3('focusin')) {
                // IE has `focusin` and `focusout` events which bubble.
                // @see http://www.quirksmode.org/blog/archives/2008/04/delegating_the.html
                ReactBrowserEventEmitter$1.ReactEventListener.trapBubbledEvent(topLevelTypes.topFocus, 'focusin', mountAt);
                ReactBrowserEventEmitter$1.ReactEventListener.trapBubbledEvent(topLevelTypes.topBlur, 'focusout', mountAt);
              }

              // to make sure blur and focus event listeners are only attached once
              isListening[topLevelTypes.topBlur] = true;
              isListening[topLevelTypes.topFocus] = true;
            } else if (topEventMapping.hasOwnProperty(dependency)) {
              ReactBrowserEventEmitter$1.ReactEventListener.trapBubbledEvent(dependency, topEventMapping[dependency], mountAt);
            }

            isListening[dependency] = true;
          }
        }
      },

      trapBubbledEvent: function (topLevelType, handlerBaseName, handle) {
        return ReactBrowserEventEmitter$1.ReactEventListener.trapBubbledEvent(topLevelType, handlerBaseName, handle);
      },

      trapCapturedEvent: function (topLevelType, handlerBaseName, handle) {
        return ReactBrowserEventEmitter$1.ReactEventListener.trapCapturedEvent(topLevelType, handlerBaseName, handle);
      },

      /**
       * Listens to window scroll and resize events. We cache scroll values so that
       * application code can access them without triggering reflows.
       *
       * ViewportMetrics is only used by SyntheticMouse/TouchEvent and only when
       * pageX/pageY isn't supported (legacy browsers).
       *
       * NOTE: Scroll events do not bubble.
       *
       * @see http://www.quirksmode.org/dom/events/scroll.html
       */
      ensureScrollValueMonitoring: function () {
        if (hasEventPageXY === undefined) {
          hasEventPageXY = document.createEvent && 'pageX' in document.createEvent('MouseEvent');
        }
        if (!hasEventPageXY && !isMonitoringScrollValue) {
          var refresh = ViewportMetrics$2.refreshScrollValues;
          ReactBrowserEventEmitter$1.ReactEventListener.monitorScrollValue(refresh);
          isMonitoringScrollValue = true;
        }
      }

    });

    var __moduleExports$103 = ReactBrowserEventEmitter$1;

    var disableableMouseListenerNames = {
      onClick: true,
      onDoubleClick: true,
      onMouseDown: true,
      onMouseMove: true,
      onMouseUp: true,

      onClickCapture: true,
      onDoubleClickCapture: true,
      onMouseDownCapture: true,
      onMouseMoveCapture: true,
      onMouseUpCapture: true
    };

    /**
     * Implements a host component that does not receive mouse events
     * when `disabled` is set.
     */
    var DisabledInputUtils$1 = {
      getHostProps: function (inst, props) {
        if (!props.disabled) {
          return props;
        }

        // Copy the props, except the mouse listeners
        var hostProps = {};
        for (var key in props) {
          if (!disableableMouseListenerNames[key] && props.hasOwnProperty(key)) {
            hostProps[key] = props[key];
          }
        }

        return hostProps;
      }
    };

    var __moduleExports$107 = DisabledInputUtils$1;

    var DisabledInputUtils = __moduleExports$107;

    /**
     * Implements a <button> host component that does not receive mouse events
     * when `disabled` is set.
     */
    var ReactDOMButton$1 = {
      getHostProps: DisabledInputUtils.getHostProps
    };

    var __moduleExports$106 = ReactDOMButton$1;

    var _prodInvariant$20 = __moduleExports$4;

    var ReactPropTypes$2 = __moduleExports$28;
    var ReactPropTypeLocations$3 = __moduleExports$19;
    var ReactPropTypesSecret$3 = __moduleExports$27;

    var invariant$25 = __moduleExports$5;
    var hasReadOnlyValue = {
      'button': true,
      'checkbox': true,
      'image': true,
      'hidden': true,
      'radio': true,
      'reset': true,
      'submit': true
    };

    function _assertSingleLink(inputProps) {
      !(inputProps.checkedLink == null || inputProps.valueLink == null) ? _prodInvariant$20('87') : void 0;
    }
    function _assertValueLink(inputProps) {
      _assertSingleLink(inputProps);
      !(inputProps.value == null && inputProps.onChange == null) ? _prodInvariant$20('88') : void 0;
    }

    function _assertCheckedLink(inputProps) {
      _assertSingleLink(inputProps);
      !(inputProps.checked == null && inputProps.onChange == null) ? _prodInvariant$20('89') : void 0;
    }

    var propTypes = {
      value: function (props, propName, componentName) {
        if (!props[propName] || hasReadOnlyValue[props.type] || props.onChange || props.readOnly || props.disabled) {
          return null;
        }
        return new Error('You provided a `value` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultValue`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
      },
      checked: function (props, propName, componentName) {
        if (!props[propName] || props.onChange || props.readOnly || props.disabled) {
          return null;
        }
        return new Error('You provided a `checked` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultChecked`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
      },
      onChange: ReactPropTypes$2.func
    };

    var loggedTypeFailures$1 = {};
    function getDeclarationErrorAddendum$2(owner) {
      if (owner) {
        var name = owner.getName();
        if (name) {
          return ' Check the render method of `' + name + '`.';
        }
      }
      return '';
    }

    /**
     * Provide a linked `value` attribute for controlled forms. You should not use
     * this outside of the ReactDOM controlled form components.
     */
    var LinkedValueUtils$1 = {
      checkPropTypes: function (tagName, props, owner) {
        for (var propName in propTypes) {
          if (propTypes.hasOwnProperty(propName)) {
            var error = propTypes[propName](props, propName, tagName, ReactPropTypeLocations$3.prop, null, ReactPropTypesSecret$3);
          }
          if (error instanceof Error && !(error.message in loggedTypeFailures$1)) {
            // Only monitor this failure once because there tends to be a lot of the
            // same error.
            loggedTypeFailures$1[error.message] = true;

            var addendum = getDeclarationErrorAddendum$2(owner);
            void 0;
          }
        }
      },

      /**
       * @param {object} inputProps Props for form component
       * @return {*} current value of the input either from value prop or link.
       */
      getValue: function (inputProps) {
        if (inputProps.valueLink) {
          _assertValueLink(inputProps);
          return inputProps.valueLink.value;
        }
        return inputProps.value;
      },

      /**
       * @param {object} inputProps Props for form component
       * @return {*} current checked status of the input either from checked prop
       *             or link.
       */
      getChecked: function (inputProps) {
        if (inputProps.checkedLink) {
          _assertCheckedLink(inputProps);
          return inputProps.checkedLink.value;
        }
        return inputProps.checked;
      },

      /**
       * @param {object} inputProps Props for form component
       * @param {SyntheticEvent} event change event to handle
       */
      executeOnChange: function (inputProps, event) {
        if (inputProps.valueLink) {
          _assertValueLink(inputProps);
          return inputProps.valueLink.requestChange(event.target.value);
        } else if (inputProps.checkedLink) {
          _assertCheckedLink(inputProps);
          return inputProps.checkedLink.requestChange(event.target.checked);
        } else if (inputProps.onChange) {
          return inputProps.onChange.call(undefined, event);
        }
      }
    };

    var __moduleExports$109 = LinkedValueUtils$1;

var     _prodInvariant$19 = __moduleExports$4;
var     _assign$10 = __moduleExports$1;
    var DisabledInputUtils$2 = __moduleExports$107;
    var DOMPropertyOperations$2 = __moduleExports$101;
    var LinkedValueUtils = __moduleExports$109;
    var ReactDOMComponentTree$10 = __moduleExports$32;
    var ReactUpdates$3 = __moduleExports$52;

    var invariant$24 = __moduleExports$5;
    function forceUpdateIfMounted() {
      if (this._rootNodeID) {
        // DOM component is still mounted; update
        ReactDOMInput$1.updateWrapper(this);
      }
    }

    /**
     * Implements an <input> host component that allows setting these optional
     * props: `checked`, `value`, `defaultChecked`, and `defaultValue`.
     *
     * If `checked` or `value` are not supplied (or null/undefined), user actions
     * that affect the checked state or value will trigger updates to the element.
     *
     * If they are supplied (and not null/undefined), the rendered element will not
     * trigger updates to the element. Instead, the props must change in order for
     * the rendered element to be updated.
     *
     * The rendered element will be initialized as unchecked (or `defaultChecked`)
     * with an empty value (or `defaultValue`).
     *
     * @see http://www.w3.org/TR/2012/WD-html5-20121025/the-input-element.html
     */
    var ReactDOMInput$1 = {
      getHostProps: function (inst, props) {
        var value = LinkedValueUtils.getValue(props);
        var checked = LinkedValueUtils.getChecked(props);

        var hostProps = _assign$10({
          // Make sure we set .type before any other properties (setting .value
          // before .type means .value is lost in IE11 and below)
          type: undefined,
          // Make sure we set .step before .value (setting .value before .step
          // means .value is rounded on mount, based upon step precision)
          step: undefined,
          // Make sure we set .min & .max before .value (to ensure proper order
          // in corner cases such as min or max deriving from value, e.g. Issue #7170)
          min: undefined,
          max: undefined
        }, DisabledInputUtils$2.getHostProps(inst, props), {
          defaultChecked: undefined,
          defaultValue: undefined,
          value: value != null ? value : inst._wrapperState.initialValue,
          checked: checked != null ? checked : inst._wrapperState.initialChecked,
          onChange: inst._wrapperState.onChange
        });

        return hostProps;
      },

      mountWrapper: function (inst, props) {
        if ("production" !== 'production') {}

        var defaultValue = props.defaultValue;
        inst._wrapperState = {
          initialChecked: props.checked != null ? props.checked : props.defaultChecked,
          initialValue: props.value != null ? props.value : defaultValue,
          listeners: null,
          onChange: _handleChange.bind(inst)
        };

        if ("production" !== 'production') {}
      },

      updateWrapper: function (inst) {
        var props = inst._currentElement.props;

        if ("production" !== 'production') {}

        // TODO: Shouldn't this be getChecked(props)?
        var checked = props.checked;
        if (checked != null) {
          DOMPropertyOperations$2.setValueForProperty(ReactDOMComponentTree$10.getNodeFromInstance(inst), 'checked', checked || false);
        }

        var node = ReactDOMComponentTree$10.getNodeFromInstance(inst);
        var value = LinkedValueUtils.getValue(props);
        if (value != null) {

          // Cast `value` to a string to ensure the value is set correctly. While
          // browsers typically do this as necessary, jsdom doesn't.
          var newValue = '' + value;

          // To avoid side effects (such as losing text selection), only set value if changed
          if (newValue !== node.value) {
            node.value = newValue;
          }
        } else {
          if (props.value == null && props.defaultValue != null) {
            node.defaultValue = '' + props.defaultValue;
          }
          if (props.checked == null && props.defaultChecked != null) {
            node.defaultChecked = !!props.defaultChecked;
          }
        }
      },

      postMountWrapper: function (inst) {
        var props = inst._currentElement.props;

        // This is in postMount because we need access to the DOM node, which is not
        // available until after the component has mounted.
        var node = ReactDOMComponentTree$10.getNodeFromInstance(inst);

        // Detach value from defaultValue. We won't do anything if we're working on
        // submit or reset inputs as those values & defaultValues are linked. They
        // are not resetable nodes so this operation doesn't matter and actually
        // removes browser-default values (eg "Submit Query") when no value is
        // provided.

        switch (props.type) {
          case 'submit':
          case 'reset':
            break;
          case 'color':
          case 'date':
          case 'datetime':
          case 'datetime-local':
          case 'month':
          case 'time':
          case 'week':
            // This fixes the no-show issue on iOS Safari and Android Chrome:
            // https://github.com/facebook/react/issues/7233
            node.value = '';
            node.value = node.defaultValue;
            break;
          default:
            node.value = node.value;
            break;
        }

        // Normally, we'd just do `node.checked = node.checked` upon initial mount, less this bug
        // this is needed to work around a chrome bug where setting defaultChecked
        // will sometimes influence the value of checked (even after detachment).
        // Reference: https://bugs.chromium.org/p/chromium/issues/detail?id=608416
        // We need to temporarily unset name to avoid disrupting radio button groups.
        var name = node.name;
        if (name !== '') {
          node.name = '';
        }
        node.defaultChecked = !node.defaultChecked;
        node.defaultChecked = !node.defaultChecked;
        if (name !== '') {
          node.name = name;
        }
      }
    };

    function _handleChange(event) {
      var props = this._currentElement.props;

      var returnValue = LinkedValueUtils.executeOnChange(props, event);

      // Here we use asap to wait until all updates have propagated, which
      // is important when using controlled components within layers:
      // https://github.com/facebook/react/issues/1698
      ReactUpdates$3.asap(forceUpdateIfMounted, this);

      var name = props.name;
      if (props.type === 'radio' && name != null) {
        var rootNode = ReactDOMComponentTree$10.getNodeFromInstance(this);
        var queryRoot = rootNode;

        while (queryRoot.parentNode) {
          queryRoot = queryRoot.parentNode;
        }

        // If `rootNode.form` was non-null, then we could try `form.elements`,
        // but that sometimes behaves strangely in IE8. We could also try using
        // `form.getElementsByName`, but that will only return direct children
        // and won't include inputs that use the HTML5 `form=` attribute. Since
        // the input might not even be in a form, let's just use the global
        // `querySelectorAll` to ensure we don't miss anything.
        var group = queryRoot.querySelectorAll('input[name=' + JSON.stringify('' + name) + '][type="radio"]');

        for (var i = 0; i < group.length; i++) {
          var otherNode = group[i];
          if (otherNode === rootNode || otherNode.form !== rootNode.form) {
            continue;
          }
          // This will throw if radio buttons rendered by different copies of React
          // and the same name are rendered into the same form (same as #1939).
          // That's probably okay; we don't support it just as we don't support
          // mixing React radio buttons with non-React ones.
          var otherInstance = ReactDOMComponentTree$10.getInstanceFromNode(otherNode);
          !otherInstance ? _prodInvariant$19('90') : void 0;
          // If this is a controlled radio button group, forcing the input that
          // was previously checked to update will cause it to be come re-checked
          // as appropriate.
          ReactUpdates$3.asap(forceUpdateIfMounted, otherInstance);
        }
      }

      return returnValue;
    }

    var __moduleExports$108 = ReactDOMInput$1;

    var _assign$12 = __moduleExports$1;

    var DisabledInputUtils$3 = __moduleExports$107;
    var LinkedValueUtils$2 = __moduleExports$109;
    var ReactDOMComponentTree$12 = __moduleExports$32;
    var ReactUpdates$4 = __moduleExports$52;

    var didWarnValueDefaultValue$1 = false;

    function updateOptionsIfPendingUpdateAndMounted() {
      if (this._rootNodeID && this._wrapperState.pendingUpdate) {
        this._wrapperState.pendingUpdate = false;

        var props = this._currentElement.props;
        var value = LinkedValueUtils$2.getValue(props);

        if (value != null) {
          updateOptions(this, Boolean(props.multiple), value);
        }
      }
    }

    /**
     * @param {ReactDOMComponent} inst
     * @param {boolean} multiple
     * @param {*} propValue A stringable (with `multiple`, a list of stringables).
     * @private
     */
    function updateOptions(inst, multiple, propValue) {
      var selectedValue, i;
      var options = ReactDOMComponentTree$12.getNodeFromInstance(inst).options;

      if (multiple) {
        selectedValue = {};
        for (i = 0; i < propValue.length; i++) {
          selectedValue['' + propValue[i]] = true;
        }
        for (i = 0; i < options.length; i++) {
          var selected = selectedValue.hasOwnProperty(options[i].value);
          if (options[i].selected !== selected) {
            options[i].selected = selected;
          }
        }
      } else {
        // Do not set `select.value` as exact behavior isn't consistent across all
        // browsers for all cases.
        selectedValue = '' + propValue;
        for (i = 0; i < options.length; i++) {
          if (options[i].value === selectedValue) {
            options[i].selected = true;
            return;
          }
        }
        if (options.length) {
          options[0].selected = true;
        }
      }
    }

    /**
     * Implements a <select> host component that allows optionally setting the
     * props `value` and `defaultValue`. If `multiple` is false, the prop must be a
     * stringable. If `multiple` is true, the prop must be an array of stringables.
     *
     * If `value` is not supplied (or null/undefined), user actions that change the
     * selected option will trigger updates to the rendered options.
     *
     * If it is supplied (and not null/undefined), the rendered options will not
     * update in response to user actions. Instead, the `value` prop must change in
     * order for the rendered options to update.
     *
     * If `defaultValue` is provided, any options with the supplied values will be
     * selected.
     */
    var ReactDOMSelect$2 = {
      getHostProps: function (inst, props) {
        return _assign$12({}, DisabledInputUtils$3.getHostProps(inst, props), {
          onChange: inst._wrapperState.onChange,
          value: undefined
        });
      },

      mountWrapper: function (inst, props) {
        if ("production" !== 'production') {}

        var value = LinkedValueUtils$2.getValue(props);
        inst._wrapperState = {
          pendingUpdate: false,
          initialValue: value != null ? value : props.defaultValue,
          listeners: null,
          onChange: _handleChange$1.bind(inst),
          wasMultiple: Boolean(props.multiple)
        };

        if (props.value !== undefined && props.defaultValue !== undefined && !didWarnValueDefaultValue$1) {
          void 0;
          didWarnValueDefaultValue$1 = true;
        }
      },

      getSelectValueContext: function (inst) {
        // ReactDOMOption looks at this initial value so the initial generated
        // markup has correct `selected` attributes
        return inst._wrapperState.initialValue;
      },

      postUpdateWrapper: function (inst) {
        var props = inst._currentElement.props;

        // After the initial mount, we control selected-ness manually so don't pass
        // this value down
        inst._wrapperState.initialValue = undefined;

        var wasMultiple = inst._wrapperState.wasMultiple;
        inst._wrapperState.wasMultiple = Boolean(props.multiple);

        var value = LinkedValueUtils$2.getValue(props);
        if (value != null) {
          inst._wrapperState.pendingUpdate = false;
          updateOptions(inst, Boolean(props.multiple), value);
        } else if (wasMultiple !== Boolean(props.multiple)) {
          // For simplicity, reapply `defaultValue` if `multiple` is toggled.
          if (props.defaultValue != null) {
            updateOptions(inst, Boolean(props.multiple), props.defaultValue);
          } else {
            // Revert the select back to its default unselected state.
            updateOptions(inst, Boolean(props.multiple), props.multiple ? [] : '');
          }
        }
      }
    };

    function _handleChange$1(event) {
      var props = this._currentElement.props;
      var returnValue = LinkedValueUtils$2.executeOnChange(props, event);

      if (this._rootNodeID) {
        this._wrapperState.pendingUpdate = true;
      }
      ReactUpdates$4.asap(updateOptionsIfPendingUpdateAndMounted, this);
      return returnValue;
    }

    var __moduleExports$111 = ReactDOMSelect$2;

    var _assign$11 = __moduleExports$1;

    var ReactChildren$2 = __moduleExports$2;
    var ReactDOMComponentTree$11 = __moduleExports$32;
    var ReactDOMSelect$1 = __moduleExports$111;

    var didWarnInvalidOptionChildren = false;

    function flattenChildren(children) {
      var content = '';

      // Flatten children and warn if they aren't strings or numbers;
      // invalid types are ignored.
      ReactChildren$2.forEach(children, function (child) {
        if (child == null) {
          return;
        }
        if (typeof child === 'string' || typeof child === 'number') {
          content += child;
        } else if (!didWarnInvalidOptionChildren) {
          didWarnInvalidOptionChildren = true;
          void 0;
        }
      });

      return content;
    }

    /**
     * Implements an <option> host component that warns when `selected` is set.
     */
    var ReactDOMOption$1 = {
      mountWrapper: function (inst, props, hostParent) {
        // TODO (yungsters): Remove support for `selected` in <option>.
        if ("production" !== 'production') {}

        // Look up whether this option is 'selected'
        var selectValue = null;
        if (hostParent != null) {
          var selectParent = hostParent;

          if (selectParent._tag === 'optgroup') {
            selectParent = selectParent._hostParent;
          }

          if (selectParent != null && selectParent._tag === 'select') {
            selectValue = ReactDOMSelect$1.getSelectValueContext(selectParent);
          }
        }

        // If the value is null (e.g., no specified value or after initial mount)
        // or missing (e.g., for <datalist>), we don't change props.selected
        var selected = null;
        if (selectValue != null) {
          var value;
          if (props.value != null) {
            value = props.value + '';
          } else {
            value = flattenChildren(props.children);
          }
          selected = false;
          if (Array.isArray(selectValue)) {
            // multiple
            for (var i = 0; i < selectValue.length; i++) {
              if ('' + selectValue[i] === value) {
                selected = true;
                break;
              }
            }
          } else {
            selected = '' + selectValue === value;
          }
        }

        inst._wrapperState = { selected: selected };
      },

      postMountWrapper: function (inst) {
        // value="" should make a value attribute (#6219)
        var props = inst._currentElement.props;
        if (props.value != null) {
          var node = ReactDOMComponentTree$11.getNodeFromInstance(inst);
          node.setAttribute('value', props.value);
        }
      },

      getHostProps: function (inst, props) {
        var hostProps = _assign$11({ selected: undefined, children: undefined }, props);

        // Read state only from initial mount because <select> updates value
        // manually; we need the initial state only for server rendering
        if (inst._wrapperState.selected != null) {
          hostProps.selected = inst._wrapperState.selected;
        }

        var content = flattenChildren(props.children);

        if (content) {
          hostProps.children = content;
        }

        return hostProps;
      }

    };

    var __moduleExports$110 = ReactDOMOption$1;

var     _prodInvariant$21 = __moduleExports$4;
var     _assign$13 = __moduleExports$1;
    var DisabledInputUtils$4 = __moduleExports$107;
    var LinkedValueUtils$3 = __moduleExports$109;
    var ReactDOMComponentTree$13 = __moduleExports$32;
    var ReactUpdates$5 = __moduleExports$52;

    var invariant$26 = __moduleExports$5;
    function forceUpdateIfMounted$1() {
      if (this._rootNodeID) {
        // DOM component is still mounted; update
        ReactDOMTextarea$1.updateWrapper(this);
      }
    }

    /**
     * Implements a <textarea> host component that allows setting `value`, and
     * `defaultValue`. This differs from the traditional DOM API because value is
     * usually set as PCDATA children.
     *
     * If `value` is not supplied (or null/undefined), user actions that affect the
     * value will trigger updates to the element.
     *
     * If `value` is supplied (and not null/undefined), the rendered element will
     * not trigger updates to the element. Instead, the `value` prop must change in
     * order for the rendered element to be updated.
     *
     * The rendered element will be initialized with an empty value, the prop
     * `defaultValue` if specified, or the children content (deprecated).
     */
    var ReactDOMTextarea$1 = {
      getHostProps: function (inst, props) {
        !(props.dangerouslySetInnerHTML == null) ? _prodInvariant$21('91') : void 0;

        // Always set children to the same thing. In IE9, the selection range will
        // get reset if `textContent` is mutated.  We could add a check in setTextContent
        // to only set the value if/when the value differs from the node value (which would
        // completely solve this IE9 bug), but Sebastian+Ben seemed to like this solution.
        // The value can be a boolean or object so that's why it's forced to be a string.
        var hostProps = _assign$13({}, DisabledInputUtils$4.getHostProps(inst, props), {
          value: undefined,
          defaultValue: undefined,
          children: '' + inst._wrapperState.initialValue,
          onChange: inst._wrapperState.onChange
        });

        return hostProps;
      },

      mountWrapper: function (inst, props) {
        if ("production" !== 'production') {}

        var value = LinkedValueUtils$3.getValue(props);
        var initialValue = value;

        // Only bother fetching default value if we're going to use it
        if (value == null) {
          var defaultValue = props.defaultValue;
          // TODO (yungsters): Remove support for children content in <textarea>.
          var children = props.children;
          if (children != null) {
            if ("production" !== 'production') {}
            !(defaultValue == null) ? _prodInvariant$21('92') : void 0;
            if (Array.isArray(children)) {
              !(children.length <= 1) ? _prodInvariant$21('93') : void 0;
              children = children[0];
            }

            defaultValue = '' + children;
          }
          if (defaultValue == null) {
            defaultValue = '';
          }
          initialValue = defaultValue;
        }

        inst._wrapperState = {
          initialValue: '' + initialValue,
          listeners: null,
          onChange: _handleChange$2.bind(inst)
        };
      },

      updateWrapper: function (inst) {
        var props = inst._currentElement.props;

        var node = ReactDOMComponentTree$13.getNodeFromInstance(inst);
        var value = LinkedValueUtils$3.getValue(props);
        if (value != null) {
          // Cast `value` to a string to ensure the value is set correctly. While
          // browsers typically do this as necessary, jsdom doesn't.
          var newValue = '' + value;

          // To avoid side effects (such as losing text selection), only set value if changed
          if (newValue !== node.value) {
            node.value = newValue;
          }
          if (props.defaultValue == null) {
            node.defaultValue = newValue;
          }
        }
        if (props.defaultValue != null) {
          node.defaultValue = props.defaultValue;
        }
      },

      postMountWrapper: function (inst) {
        // This is in postMount because we need access to the DOM node, which is not
        // available until after the component has mounted.
        var node = ReactDOMComponentTree$13.getNodeFromInstance(inst);

        // Warning: node.value may be the empty string at this point (IE11) if placeholder is set.
        node.value = node.textContent; // Detach value from defaultValue
      }
    };

    function _handleChange$2(event) {
      var props = this._currentElement.props;
      var returnValue = LinkedValueUtils$3.executeOnChange(props, event);
      ReactUpdates$5.asap(forceUpdateIfMounted$1, this);
      return returnValue;
    }

    var __moduleExports$112 = ReactDOMTextarea$1;

    var _prodInvariant$23 = __moduleExports$4;

    var invariant$28 = __moduleExports$5;

    var injected = false;

    var ReactComponentEnvironment$1 = {

      /**
       * Optionally injectable hook for swapping out mount images in the middle of
       * the tree.
       */
      replaceNodeWithMarkup: null,

      /**
       * Optionally injectable hook for processing a queue of child updates. Will
       * later move into MultiChildComponents.
       */
      processChildrenUpdates: null,

      injection: {
        injectEnvironment: function (environment) {
          !!injected ? _prodInvariant$23('104') : void 0;
          ReactComponentEnvironment$1.replaceNodeWithMarkup = environment.replaceNodeWithMarkup;
          ReactComponentEnvironment$1.processChildrenUpdates = environment.processChildrenUpdates;
          injected = true;
        }
      }

    };

    var __moduleExports$114 = ReactComponentEnvironment$1;

    /**
     * `ReactInstanceMap` maintains a mapping from a public facing stateful
     * instance (key) and the internal representation (value). This allows public
     * methods to accept the user facing instance as an argument and map them back
     * to internal methods.
     */

    // TODO: Replace this with ES6: var ReactInstanceMap = new Map();

    var ReactInstanceMap$1 = {

      /**
       * This API should be called `delete` but we'd have to make sure to always
       * transform these to strings for IE support. When this transform is fully
       * supported we can rename it.
       */
      remove: function (key) {
        key._reactInternalInstance = undefined;
      },

      get: function (key) {
        return key._reactInternalInstance;
      },

      has: function (key) {
        return key._reactInternalInstance !== undefined;
      },

      set: function (key, value) {
        key._reactInternalInstance = value;
      }

    };

    var __moduleExports$115 = ReactInstanceMap$1;

    var _prodInvariant$26 = __moduleExports$4;

    var ReactElement$10 = __moduleExports$6;

    var invariant$31 = __moduleExports$5;

    var ReactNodeTypes$1 = {
      HOST: 0,
      COMPOSITE: 1,
      EMPTY: 2,

      getType: function (node) {
        if (node === null || node === false) {
          return ReactNodeTypes$1.EMPTY;
        } else if (ReactElement$10.isValidElement(node)) {
          if (typeof node.type === 'function') {
            return ReactNodeTypes$1.COMPOSITE;
          } else {
            return ReactNodeTypes$1.HOST;
          }
        }
        _prodInvariant$26('26', node);
      }
    };

    var __moduleExports$119 = ReactNodeTypes$1;

    var hasOwnProperty$5 = Object.prototype.hasOwnProperty;

    /**
     * inlined Object.is polyfill to avoid requiring consumers ship their own
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
     */
    function is$1(x, y) {
      // SameValue algorithm
      if (x === y) {
        // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        return x !== 0 || 1 / x === 1 / y;
      } else {
        // Step 6.a: NaN == NaN
        return x !== x && y !== y;
      }
    }

    /**
     * Performs equality by iterating through keys on an object and returning false
     * when any key has values which are not strictly equal between the arguments.
     * Returns true when the values of all keys are strictly equal.
     */
    function shallowEqual$2(objA, objB) {
      if (is$1(objA, objB)) {
        return true;
      }

      if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        return false;
      }

      var keysA = Object.keys(objA);
      var keysB = Object.keys(objB);

      if (keysA.length !== keysB.length) {
        return false;
      }

      // Test for A's keys different from B.
      for (var i = 0; i < keysA.length; i++) {
        if (!hasOwnProperty$5.call(objB, keysA[i]) || !is$1(objA[keysA[i]], objB[keysA[i]])) {
          return false;
        }
      }

      return true;
    }

    var __moduleExports$120 = shallowEqual$2;

    /**
     * Given a `prevElement` and `nextElement`, determines if the existing
     * instance should be updated as opposed to being destroyed or replaced by a new
     * instance. Both arguments are elements. This ensures that this logic can
     * operate on stateless trees without any backing instance.
     *
     * @param {?object} prevElement
     * @param {?object} nextElement
     * @return {boolean} True if the existing instance should be updated.
     * @protected
     */

    function shouldUpdateReactComponent$2(prevElement, nextElement) {
      var prevEmpty = prevElement === null || prevElement === false;
      var nextEmpty = nextElement === null || nextElement === false;
      if (prevEmpty || nextEmpty) {
        return prevEmpty === nextEmpty;
      }

      var prevType = typeof prevElement;
      var nextType = typeof nextElement;
      if (prevType === 'string' || prevType === 'number') {
        return nextType === 'string' || nextType === 'number';
      } else {
        return nextType === 'object' && prevElement.type === nextElement.type && prevElement.key === nextElement.key;
      }
    }

    var __moduleExports$121 = shouldUpdateReactComponent$2;

var     _prodInvariant$25 = __moduleExports$4;
var     _assign$15 = __moduleExports$1;
    var ReactComponentEnvironment$2 = __moduleExports$114;
    var ReactCurrentOwner$6 = __moduleExports$7;
    var ReactElement$9 = __moduleExports$6;
    var ReactErrorUtils$3 = __moduleExports$42;
    var ReactInstanceMap$2 = __moduleExports$115;
    var ReactNodeTypes = __moduleExports$119;
    var ReactPropTypeLocations$4 = __moduleExports$19;
    var ReactReconciler$5 = __moduleExports$55;

    var checkReactTypeSpec$2 = __moduleExports$26;
    var emptyObject$4 = __moduleExports$16;
    var invariant$30 = __moduleExports$5;
    var shallowEqual$1 = __moduleExports$120;
    var shouldUpdateReactComponent$1 = __moduleExports$121;
    var CompositeTypes = {
      ImpureClass: 0,
      PureClass: 1,
      StatelessFunctional: 2
    };

    function StatelessComponent(Component) {}
    StatelessComponent.prototype.render = function () {
      var Component = ReactInstanceMap$2.get(this)._currentElement.type;
      var element = Component(this.props, this.context, this.updater);
      warnIfInvalidElement(Component, element);
      return element;
    };

    function warnIfInvalidElement(Component, element) {
      if ("production" !== 'production') {}
    }

    function shouldConstruct(Component) {
      return !!(Component.prototype && Component.prototype.isReactComponent);
    }

    function isPureComponent(Component) {
      return !!(Component.prototype && Component.prototype.isPureReactComponent);
    }

    /**
     * ------------------ The Life-Cycle of a Composite Component ------------------
     *
     * - constructor: Initialization of state. The instance is now retained.
     *   - componentWillMount
     *   - render
     *   - [children's constructors]
     *     - [children's componentWillMount and render]
     *     - [children's componentDidMount]
     *     - componentDidMount
     *
     *       Update Phases:
     *       - componentWillReceiveProps (only called if parent updated)
     *       - shouldComponentUpdate
     *         - componentWillUpdate
     *           - render
     *           - [children's constructors or receive props phases]
     *         - componentDidUpdate
     *
     *     - componentWillUnmount
     *     - [children's componentWillUnmount]
     *   - [children destroyed]
     * - (destroyed): The instance is now blank, released by React and ready for GC.
     *
     * -----------------------------------------------------------------------------
     */

    /**
     * An incrementing ID assigned to each component when it is mounted. This is
     * used to enforce the order in which `ReactUpdates` updates dirty components.
     *
     * @private
     */
    var nextMountID = 1;

    /**
     * @lends {ReactCompositeComponent.prototype}
     */
    var ReactCompositeComponentMixin = {

      /**
       * Base constructor for all composite component.
       *
       * @param {ReactElement} element
       * @final
       * @internal
       */
      construct: function (element) {
        this._currentElement = element;
        this._rootNodeID = 0;
        this._compositeType = null;
        this._instance = null;
        this._hostParent = null;
        this._hostContainerInfo = null;

        // See ReactUpdateQueue
        this._updateBatchNumber = null;
        this._pendingElement = null;
        this._pendingStateQueue = null;
        this._pendingReplaceState = false;
        this._pendingForceUpdate = false;

        this._renderedNodeType = null;
        this._renderedComponent = null;
        this._context = null;
        this._mountOrder = 0;
        this._topLevelWrapper = null;

        // See ReactUpdates and ReactUpdateQueue.
        this._pendingCallbacks = null;

        // ComponentWillUnmount shall only be called once
        this._calledComponentWillUnmount = false;

        if ("production" !== 'production') {}
      },

      /**
       * Initializes the component, renders markup, and registers event listeners.
       *
       * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
       * @param {?object} hostParent
       * @param {?object} hostContainerInfo
       * @param {?object} context
       * @return {?string} Rendered markup to be inserted into the DOM.
       * @final
       * @internal
       */
      mountComponent: function (transaction, hostParent, hostContainerInfo, context) {
        this._context = context;
        this._mountOrder = nextMountID++;
        this._hostParent = hostParent;
        this._hostContainerInfo = hostContainerInfo;

        var publicProps = this._currentElement.props;
        var publicContext = this._processContext(context);

        var Component = this._currentElement.type;

        var updateQueue = transaction.getUpdateQueue();

        // Initialize the public class
        var doConstruct = shouldConstruct(Component);
        var inst = this._constructComponent(doConstruct, publicProps, publicContext, updateQueue);
        var renderedElement;

        // Support functional components
        if (!doConstruct && (inst == null || inst.render == null)) {
          renderedElement = inst;
          warnIfInvalidElement(Component, renderedElement);
          !(inst === null || inst === false || ReactElement$9.isValidElement(inst)) ? _prodInvariant$25('105', Component.displayName || Component.name || 'Component') : void 0;
          inst = new StatelessComponent(Component);
          this._compositeType = CompositeTypes.StatelessFunctional;
        } else {
          if (isPureComponent(Component)) {
            this._compositeType = CompositeTypes.PureClass;
          } else {
            this._compositeType = CompositeTypes.ImpureClass;
          }
        }

        if ("production" !== 'production') {}

        // These should be set up in the constructor, but as a convenience for
        // simpler class abstractions, we set them up after the fact.
        inst.props = publicProps;
        inst.context = publicContext;
        inst.refs = emptyObject$4;
        inst.updater = updateQueue;

        this._instance = inst;

        // Store a reference from the instance back to the internal representation
        ReactInstanceMap$2.set(inst, this);

        if ("production" !== 'production') {}

        var initialState = inst.state;
        if (initialState === undefined) {
          inst.state = initialState = null;
        }
        !(typeof initialState === 'object' && !Array.isArray(initialState)) ? _prodInvariant$25('106', this.getName() || 'ReactCompositeComponent') : void 0;

        this._pendingStateQueue = null;
        this._pendingReplaceState = false;
        this._pendingForceUpdate = false;

        var markup;
        if (inst.unstable_handleError) {
          markup = this.performInitialMountWithErrorHandling(renderedElement, hostParent, hostContainerInfo, transaction, context);
        } else {
          markup = this.performInitialMount(renderedElement, hostParent, hostContainerInfo, transaction, context);
        }

        if (inst.componentDidMount) {
          if ("production" !== 'production') {} else {
            transaction.getReactMountReady().enqueue(inst.componentDidMount, inst);
          }
        }

        return markup;
      },

      _constructComponent: function (doConstruct, publicProps, publicContext, updateQueue) {
        if ("production" !== 'production') {} else {
          return this._constructComponentWithoutOwner(doConstruct, publicProps, publicContext, updateQueue);
        }
      },

      _constructComponentWithoutOwner: function (doConstruct, publicProps, publicContext, updateQueue) {
        var Component = this._currentElement.type;
        var instanceOrElement;
        if (doConstruct) {
          if ("production" !== 'production') {}
          instanceOrElement = new Component(publicProps, publicContext, updateQueue);
          if ("production" !== 'production') {}
        } else {
          // This can still be an instance in case of factory components
          // but we'll count this as time spent rendering as the more common case.
          if ("production" !== 'production') {}
          instanceOrElement = Component(publicProps, publicContext, updateQueue);
          if ("production" !== 'production') {}
        }
        return instanceOrElement;
      },

      performInitialMountWithErrorHandling: function (renderedElement, hostParent, hostContainerInfo, transaction, context) {
        var markup;
        var checkpoint = transaction.checkpoint();
        try {
          markup = this.performInitialMount(renderedElement, hostParent, hostContainerInfo, transaction, context);
        } catch (e) {
          if ("production" !== 'production') {}
          // Roll back to checkpoint, handle error (which may add items to the transaction), and take a new checkpoint
          transaction.rollback(checkpoint);
          this._instance.unstable_handleError(e);
          if (this._pendingStateQueue) {
            this._instance.state = this._processPendingState(this._instance.props, this._instance.context);
          }
          checkpoint = transaction.checkpoint();

          this._renderedComponent.unmountComponent(true);
          transaction.rollback(checkpoint);

          // Try again - we've informed the component about the error, so they can render an error message this time.
          // If this throws again, the error will bubble up (and can be caught by a higher error boundary).
          markup = this.performInitialMount(renderedElement, hostParent, hostContainerInfo, transaction, context);
        }
        return markup;
      },

      performInitialMount: function (renderedElement, hostParent, hostContainerInfo, transaction, context) {
        var inst = this._instance;
        if (inst.componentWillMount) {
          if ("production" !== 'production') {}
          inst.componentWillMount();
          if ("production" !== 'production') {}
          // When mounting, calls to `setState` by `componentWillMount` will set
          // `this._pendingStateQueue` without triggering a re-render.
          if (this._pendingStateQueue) {
            inst.state = this._processPendingState(inst.props, inst.context);
          }
        }

        // If not a stateless component, we now render
        if (renderedElement === undefined) {
          renderedElement = this._renderValidatedComponent();
        }

        var nodeType = ReactNodeTypes.getType(renderedElement);
        this._renderedNodeType = nodeType;
        var child = this._instantiateReactComponent(renderedElement, nodeType !== ReactNodeTypes.EMPTY /* shouldHaveDebugID */
        );
        this._renderedComponent = child;

        var selfDebugID = 0;
        if ("production" !== 'production') {}
        var markup = ReactReconciler$5.mountComponent(child, transaction, hostParent, hostContainerInfo, this._processChildContext(context), selfDebugID);

        if ("production" !== 'production') {}

        return markup;
      },

      getHostNode: function () {
        return ReactReconciler$5.getHostNode(this._renderedComponent);
      },

      /**
       * Releases any resources allocated by `mountComponent`.
       *
       * @final
       * @internal
       */
      unmountComponent: function (safely) {
        if (!this._renderedComponent) {
          return;
        }
        var inst = this._instance;

        if (inst.componentWillUnmount && !inst._calledComponentWillUnmount) {
          inst._calledComponentWillUnmount = true;
          if ("production" !== 'production') {}
          if (safely) {
            var name = this.getName() + '.componentWillUnmount()';
            ReactErrorUtils$3.invokeGuardedCallback(name, inst.componentWillUnmount.bind(inst));
          } else {
            inst.componentWillUnmount();
          }
          if ("production" !== 'production') {}
        }

        if (this._renderedComponent) {
          ReactReconciler$5.unmountComponent(this._renderedComponent, safely);
          this._renderedNodeType = null;
          this._renderedComponent = null;
          this._instance = null;
        }

        // Reset pending fields
        // Even if this component is scheduled for another update in ReactUpdates,
        // it would still be ignored because these fields are reset.
        this._pendingStateQueue = null;
        this._pendingReplaceState = false;
        this._pendingForceUpdate = false;
        this._pendingCallbacks = null;
        this._pendingElement = null;

        // These fields do not really need to be reset since this object is no
        // longer accessible.
        this._context = null;
        this._rootNodeID = 0;
        this._topLevelWrapper = null;

        // Delete the reference from the instance to this internal representation
        // which allow the internals to be properly cleaned up even if the user
        // leaks a reference to the public instance.
        ReactInstanceMap$2.remove(inst);

        // Some existing components rely on inst.props even after they've been
        // destroyed (in event handlers).
        // TODO: inst.props = null;
        // TODO: inst.state = null;
        // TODO: inst.context = null;
      },

      /**
       * Filters the context object to only contain keys specified in
       * `contextTypes`
       *
       * @param {object} context
       * @return {?object}
       * @private
       */
      _maskContext: function (context) {
        var Component = this._currentElement.type;
        var contextTypes = Component.contextTypes;
        if (!contextTypes) {
          return emptyObject$4;
        }
        var maskedContext = {};
        for (var contextName in contextTypes) {
          maskedContext[contextName] = context[contextName];
        }
        return maskedContext;
      },

      /**
       * Filters the context object to only contain keys specified in
       * `contextTypes`, and asserts that they are valid.
       *
       * @param {object} context
       * @return {?object}
       * @private
       */
      _processContext: function (context) {
        var maskedContext = this._maskContext(context);
        if ("production" !== 'production') {}
        return maskedContext;
      },

      /**
       * @param {object} currentContext
       * @return {object}
       * @private
       */
      _processChildContext: function (currentContext) {
        var Component = this._currentElement.type;
        var inst = this._instance;
        if ("production" !== 'production') {}
        var childContext = inst.getChildContext && inst.getChildContext();
        if ("production" !== 'production') {}
        if (childContext) {
          !(typeof Component.childContextTypes === 'object') ? _prodInvariant$25('107', this.getName() || 'ReactCompositeComponent') : void 0;
          if ("production" !== 'production') {}
          for (var name in childContext) {
            !(name in Component.childContextTypes) ? _prodInvariant$25('108', this.getName() || 'ReactCompositeComponent', name) : void 0;
          }
          return _assign$15({}, currentContext, childContext);
        }
        return currentContext;
      },

      /**
       * Assert that the context types are valid
       *
       * @param {object} typeSpecs Map of context field to a ReactPropType
       * @param {object} values Runtime values that need to be type-checked
       * @param {string} location e.g. "prop", "context", "child context"
       * @private
       */
      _checkContextTypes: function (typeSpecs, values, location) {
        checkReactTypeSpec$2(typeSpecs, values, location, this.getName(), null, this._debugID);
      },

      receiveComponent: function (nextElement, transaction, nextContext) {
        var prevElement = this._currentElement;
        var prevContext = this._context;

        this._pendingElement = null;

        this.updateComponent(transaction, prevElement, nextElement, prevContext, nextContext);
      },

      /**
       * If any of `_pendingElement`, `_pendingStateQueue`, or `_pendingForceUpdate`
       * is set, update the component.
       *
       * @param {ReactReconcileTransaction} transaction
       * @internal
       */
      performUpdateIfNecessary: function (transaction) {
        if (this._pendingElement != null) {
          ReactReconciler$5.receiveComponent(this, this._pendingElement, transaction, this._context);
        } else if (this._pendingStateQueue !== null || this._pendingForceUpdate) {
          this.updateComponent(transaction, this._currentElement, this._currentElement, this._context, this._context);
        } else {
          this._updateBatchNumber = null;
        }
      },

      /**
       * Perform an update to a mounted component. The componentWillReceiveProps and
       * shouldComponentUpdate methods are called, then (assuming the update isn't
       * skipped) the remaining update lifecycle methods are called and the DOM
       * representation is updated.
       *
       * By default, this implements React's rendering and reconciliation algorithm.
       * Sophisticated clients may wish to override this.
       *
       * @param {ReactReconcileTransaction} transaction
       * @param {ReactElement} prevParentElement
       * @param {ReactElement} nextParentElement
       * @internal
       * @overridable
       */
      updateComponent: function (transaction, prevParentElement, nextParentElement, prevUnmaskedContext, nextUnmaskedContext) {
        var inst = this._instance;
        !(inst != null) ? _prodInvariant$25('136', this.getName() || 'ReactCompositeComponent') : void 0;

        var willReceive = false;
        var nextContext;

        // Determine if the context has changed or not
        if (this._context === nextUnmaskedContext) {
          nextContext = inst.context;
        } else {
          nextContext = this._processContext(nextUnmaskedContext);
          willReceive = true;
        }

        var prevProps = prevParentElement.props;
        var nextProps = nextParentElement.props;

        // Not a simple state update but a props update
        if (prevParentElement !== nextParentElement) {
          willReceive = true;
        }

        // An update here will schedule an update but immediately set
        // _pendingStateQueue which will ensure that any state updates gets
        // immediately reconciled instead of waiting for the next batch.
        if (willReceive && inst.componentWillReceiveProps) {
          if ("production" !== 'production') {}
          inst.componentWillReceiveProps(nextProps, nextContext);
          if ("production" !== 'production') {}
        }

        var nextState = this._processPendingState(nextProps, nextContext);
        var shouldUpdate = true;

        if (!this._pendingForceUpdate) {
          if (inst.shouldComponentUpdate) {
            if ("production" !== 'production') {}
            shouldUpdate = inst.shouldComponentUpdate(nextProps, nextState, nextContext);
            if ("production" !== 'production') {}
          } else {
            if (this._compositeType === CompositeTypes.PureClass) {
              shouldUpdate = !shallowEqual$1(prevProps, nextProps) || !shallowEqual$1(inst.state, nextState);
            }
          }
        }

        if ("production" !== 'production') {}

        this._updateBatchNumber = null;
        if (shouldUpdate) {
          this._pendingForceUpdate = false;
          // Will set `this.props`, `this.state` and `this.context`.
          this._performComponentUpdate(nextParentElement, nextProps, nextState, nextContext, transaction, nextUnmaskedContext);
        } else {
          // If it's determined that a component should not update, we still want
          // to set props and state but we shortcut the rest of the update.
          this._currentElement = nextParentElement;
          this._context = nextUnmaskedContext;
          inst.props = nextProps;
          inst.state = nextState;
          inst.context = nextContext;
        }
      },

      _processPendingState: function (props, context) {
        var inst = this._instance;
        var queue = this._pendingStateQueue;
        var replace = this._pendingReplaceState;
        this._pendingReplaceState = false;
        this._pendingStateQueue = null;

        if (!queue) {
          return inst.state;
        }

        if (replace && queue.length === 1) {
          return queue[0];
        }

        var nextState = _assign$15({}, replace ? queue[0] : inst.state);
        for (var i = replace ? 1 : 0; i < queue.length; i++) {
          var partial = queue[i];
          _assign$15(nextState, typeof partial === 'function' ? partial.call(inst, nextState, props, context) : partial);
        }

        return nextState;
      },

      /**
       * Merges new props and state, notifies delegate methods of update and
       * performs update.
       *
       * @param {ReactElement} nextElement Next element
       * @param {object} nextProps Next public object to set as properties.
       * @param {?object} nextState Next object to set as state.
       * @param {?object} nextContext Next public object to set as context.
       * @param {ReactReconcileTransaction} transaction
       * @param {?object} unmaskedContext
       * @private
       */
      _performComponentUpdate: function (nextElement, nextProps, nextState, nextContext, transaction, unmaskedContext) {
        var inst = this._instance;

        var hasComponentDidUpdate = Boolean(inst.componentDidUpdate);
        var prevProps;
        var prevState;
        var prevContext;
        if (hasComponentDidUpdate) {
          prevProps = inst.props;
          prevState = inst.state;
          prevContext = inst.context;
        }

        if (inst.componentWillUpdate) {
          if ("production" !== 'production') {}
          inst.componentWillUpdate(nextProps, nextState, nextContext);
          if ("production" !== 'production') {}
        }

        this._currentElement = nextElement;
        this._context = unmaskedContext;
        inst.props = nextProps;
        inst.state = nextState;
        inst.context = nextContext;

        this._updateRenderedComponent(transaction, unmaskedContext);

        if (hasComponentDidUpdate) {
          if ("production" !== 'production') {} else {
            transaction.getReactMountReady().enqueue(inst.componentDidUpdate.bind(inst, prevProps, prevState, prevContext), inst);
          }
        }
      },

      /**
       * Call the component's `render` method and update the DOM accordingly.
       *
       * @param {ReactReconcileTransaction} transaction
       * @internal
       */
      _updateRenderedComponent: function (transaction, context) {
        var prevComponentInstance = this._renderedComponent;
        var prevRenderedElement = prevComponentInstance._currentElement;
        var nextRenderedElement = this._renderValidatedComponent();
        if (shouldUpdateReactComponent$1(prevRenderedElement, nextRenderedElement)) {
          ReactReconciler$5.receiveComponent(prevComponentInstance, nextRenderedElement, transaction, this._processChildContext(context));
        } else {
          var oldHostNode = ReactReconciler$5.getHostNode(prevComponentInstance);
          ReactReconciler$5.unmountComponent(prevComponentInstance, false);

          var nodeType = ReactNodeTypes.getType(nextRenderedElement);
          this._renderedNodeType = nodeType;
          var child = this._instantiateReactComponent(nextRenderedElement, nodeType !== ReactNodeTypes.EMPTY /* shouldHaveDebugID */
          );
          this._renderedComponent = child;

          var selfDebugID = 0;
          if ("production" !== 'production') {}
          var nextMarkup = ReactReconciler$5.mountComponent(child, transaction, this._hostParent, this._hostContainerInfo, this._processChildContext(context), selfDebugID);

          if ("production" !== 'production') {}

          this._replaceNodeWithMarkup(oldHostNode, nextMarkup, prevComponentInstance);
        }
      },

      /**
       * Overridden in shallow rendering.
       *
       * @protected
       */
      _replaceNodeWithMarkup: function (oldHostNode, nextMarkup, prevInstance) {
        ReactComponentEnvironment$2.replaceNodeWithMarkup(oldHostNode, nextMarkup, prevInstance);
      },

      /**
       * @protected
       */
      _renderValidatedComponentWithoutOwnerOrContext: function () {
        var inst = this._instance;

        if ("production" !== 'production') {}
        var renderedComponent = inst.render();
        if ("production" !== 'production') {}

        if ("production" !== 'production') {}

        return renderedComponent;
      },

      /**
       * @private
       */
      _renderValidatedComponent: function () {
        var renderedComponent;
        if ("production" !== 'production' || this._compositeType !== CompositeTypes.StatelessFunctional) {
          ReactCurrentOwner$6.current = this;
          try {
            renderedComponent = this._renderValidatedComponentWithoutOwnerOrContext();
          } finally {
            ReactCurrentOwner$6.current = null;
          }
        } else {
          renderedComponent = this._renderValidatedComponentWithoutOwnerOrContext();
        }
        !(
        // TODO: An `isValidNode` function would probably be more appropriate
        renderedComponent === null || renderedComponent === false || ReactElement$9.isValidElement(renderedComponent)) ? _prodInvariant$25('109', this.getName() || 'ReactCompositeComponent') : void 0;

        return renderedComponent;
      },

      /**
       * Lazily allocates the refs object and stores `component` as `ref`.
       *
       * @param {string} ref Reference name.
       * @param {component} component Component to store as `ref`.
       * @final
       * @private
       */
      attachRef: function (ref, component) {
        var inst = this.getPublicInstance();
        !(inst != null) ? _prodInvariant$25('110') : void 0;
        var publicComponentInstance = component.getPublicInstance();
        if ("production" !== 'production') {}
        var refs = inst.refs === emptyObject$4 ? inst.refs = {} : inst.refs;
        refs[ref] = publicComponentInstance;
      },

      /**
       * Detaches a reference name.
       *
       * @param {string} ref Name to dereference.
       * @final
       * @private
       */
      detachRef: function (ref) {
        var refs = this.getPublicInstance().refs;
        delete refs[ref];
      },

      /**
       * Get a text description of the component that can be used to identify it
       * in error messages.
       * @return {string} The name or null.
       * @internal
       */
      getName: function () {
        var type = this._currentElement.type;
        var constructor = this._instance && this._instance.constructor;
        return type.displayName || constructor && constructor.displayName || type.name || constructor && constructor.name || null;
      },

      /**
       * Get the publicly accessible representation of this component - i.e. what
       * is exposed by refs and returned by render. Can be null for stateless
       * components.
       *
       * @return {ReactComponent} the public component instance.
       * @internal
       */
      getPublicInstance: function () {
        var inst = this._instance;
        if (this._compositeType === CompositeTypes.StatelessFunctional) {
          return null;
        }
        return inst;
      },

      // Stub
      _instantiateReactComponent: null

    };

    var ReactCompositeComponent$1 = {

      Mixin: ReactCompositeComponentMixin

    };

    var __moduleExports$118 = ReactCompositeComponent$1;

    var emptyComponentFactory;

    var ReactEmptyComponentInjection = {
      injectEmptyComponentFactory: function (factory) {
        emptyComponentFactory = factory;
      }
    };

    var ReactEmptyComponent$1 = {
      create: function (instantiate) {
        return emptyComponentFactory(instantiate);
      }
    };

    ReactEmptyComponent$1.injection = ReactEmptyComponentInjection;

    var __moduleExports$122 = ReactEmptyComponent$1;

var     _prodInvariant$27 = __moduleExports$4;
var     _assign$16 = __moduleExports$1;
    var invariant$32 = __moduleExports$5;

    var genericComponentClass = null;
    // This registry keeps track of wrapper classes around host tags.
    var tagToComponentClass = {};
    var textComponentClass = null;

    var ReactHostComponentInjection = {
      // This accepts a class that receives the tag string. This is a catch all
      // that can render any kind of tag.
      injectGenericComponentClass: function (componentClass) {
        genericComponentClass = componentClass;
      },
      // This accepts a text component class that takes the text string to be
      // rendered as props.
      injectTextComponentClass: function (componentClass) {
        textComponentClass = componentClass;
      },
      // This accepts a keyed object with classes as values. Each key represents a
      // tag. That particular tag will use this class instead of the generic one.
      injectComponentClasses: function (componentClasses) {
        _assign$16(tagToComponentClass, componentClasses);
      }
    };

    /**
     * Get a host internal component class for a specific tag.
     *
     * @param {ReactElement} element The element to create.
     * @return {function} The internal class constructor function.
     */
    function createInternalComponent(element) {
      !genericComponentClass ? _prodInvariant$27('111', element.type) : void 0;
      return new genericComponentClass(element);
    }

    /**
     * @param {ReactText} text
     * @return {ReactComponent}
     */
    function createInstanceForText(text) {
      return new textComponentClass(text);
    }

    /**
     * @param {ReactComponent} component
     * @return {boolean}
     */
    function isTextComponent(component) {
      return component instanceof textComponentClass;
    }

    var ReactHostComponent$1 = {
      createInternalComponent: createInternalComponent,
      createInstanceForText: createInstanceForText,
      isTextComponent: isTextComponent,
      injection: ReactHostComponentInjection
    };

    var __moduleExports$123 = ReactHostComponent$1;

var     _prodInvariant$24 = __moduleExports$4;
var     _assign$14 = __moduleExports$1;
    var ReactCompositeComponent = __moduleExports$118;
    var ReactEmptyComponent = __moduleExports$122;
    var ReactHostComponent = __moduleExports$123;

    var invariant$29 = __moduleExports$5;
    // To avoid a cyclic dependency, we create the final class in this module
    var ReactCompositeComponentWrapper = function (element) {
      this.construct(element);
    };
    _assign$14(ReactCompositeComponentWrapper.prototype, ReactCompositeComponent.Mixin, {
      _instantiateReactComponent: instantiateReactComponent$1
    });

    function getDeclarationErrorAddendum$4(owner) {
      if (owner) {
        var name = owner.getName();
        if (name) {
          return ' Check the render method of `' + name + '`.';
        }
      }
      return '';
    }

    /**
     * Check if the type reference is a known internal type. I.e. not a user
     * provided composite type.
     *
     * @param {function} type
     * @return {boolean} Returns true if this is a valid internal type.
     */
    function isInternalComponentType(type) {
      return typeof type === 'function' && typeof type.prototype !== 'undefined' && typeof type.prototype.mountComponent === 'function' && typeof type.prototype.receiveComponent === 'function';
    }

    /**
     * Given a ReactNode, create an instance that will actually be mounted.
     *
     * @param {ReactNode} node
     * @param {boolean} shouldHaveDebugID
     * @return {object} A new instance of the element's constructor.
     * @protected
     */
    function instantiateReactComponent$1(node, shouldHaveDebugID) {
      var instance;

      if (node === null || node === false) {
        instance = ReactEmptyComponent.create(instantiateReactComponent$1);
      } else if (typeof node === 'object') {
        var element = node;
        !(element && (typeof element.type === 'function' || typeof element.type === 'string')) ? _prodInvariant$24('130', element.type == null ? element.type : typeof element.type, getDeclarationErrorAddendum$4(element._owner)) : void 0;

        // Special case string values
        if (typeof element.type === 'string') {
          instance = ReactHostComponent.createInternalComponent(element);
        } else if (isInternalComponentType(element.type)) {
          // This is temporarily available for custom components that are not string
          // representations. I.e. ART. Once those are updated to use the string
          // representation, we can drop this code path.
          instance = new element.type(element);

          // We renamed this. Allow the old name for compat. :(
          if (!instance.getHostNode) {
            instance.getHostNode = instance.getNativeNode;
          }
        } else {
          instance = new ReactCompositeComponentWrapper(element);
        }
      } else if (typeof node === 'string' || typeof node === 'number') {
        instance = ReactHostComponent.createInstanceForText(node);
      } else {
        _prodInvariant$24('131', typeof node);
      }

      if ("production" !== 'production') {}

      // These two fields are used by the DOM and ART diffing algorithms
      // respectively. Instead of using expandos on components, we should be
      // storing the state needed by the diffing algorithms elsewhere.
      instance._mountIndex = 0;
      instance._mountImage = null;

      if ("production" !== 'production') {}

      // Internal instances should fully constructed at this point, so they should
      // not get any new fields added to them at this point.
      if ("production" !== 'production') {}

      return instance;
    }

    var __moduleExports$117 = instantiateReactComponent$1;

    var ReactReconciler$4 = __moduleExports$55;

    var instantiateReactComponent = __moduleExports$117;
    var KeyEscapeUtils$2 = __moduleExports$13;
    var shouldUpdateReactComponent = __moduleExports$121;
    var traverseAllChildren$2 = __moduleExports$11;
    function instantiateChild(childInstances, child, name, selfDebugID) {
      // We found a component instance.
      var keyUnique = childInstances[name] === undefined;
      if ("production" !== 'production') {}
      if (child != null && keyUnique) {
        childInstances[name] = instantiateReactComponent(child, true);
      }
    }

    /**
     * ReactChildReconciler provides helpers for initializing or updating a set of
     * children. Its output is suitable for passing it onto ReactMultiChild which
     * does diffed reordering and insertion.
     */
    var ReactChildReconciler$1 = {
      /**
       * Generates a "mount image" for each of the supplied children. In the case
       * of `ReactDOMComponent`, a mount image is a string of markup.
       *
       * @param {?object} nestedChildNodes Nested child maps.
       * @return {?object} A set of child instances.
       * @internal
       */
      instantiateChildren: function (nestedChildNodes, transaction, context, selfDebugID // 0 in production and for roots
      ) {
        if (nestedChildNodes == null) {
          return null;
        }
        var childInstances = {};

        if ("production" !== 'production') {} else {
          traverseAllChildren$2(nestedChildNodes, instantiateChild, childInstances);
        }
        return childInstances;
      },

      /**
       * Updates the rendered children and returns a new set of children.
       *
       * @param {?object} prevChildren Previously initialized set of children.
       * @param {?object} nextChildren Flat child element maps.
       * @param {ReactReconcileTransaction} transaction
       * @param {object} context
       * @return {?object} A new set of child instances.
       * @internal
       */
      updateChildren: function (prevChildren, nextChildren, mountImages, removedNodes, transaction, hostParent, hostContainerInfo, context, selfDebugID // 0 in production and for roots
      ) {
        // We currently don't have a way to track moves here but if we use iterators
        // instead of for..in we can zip the iterators and check if an item has
        // moved.
        // TODO: If nothing has changed, return the prevChildren object so that we
        // can quickly bailout if nothing has changed.
        if (!nextChildren && !prevChildren) {
          return;
        }
        var name;
        var prevChild;
        for (name in nextChildren) {
          if (!nextChildren.hasOwnProperty(name)) {
            continue;
          }
          prevChild = prevChildren && prevChildren[name];
          var prevElement = prevChild && prevChild._currentElement;
          var nextElement = nextChildren[name];
          if (prevChild != null && shouldUpdateReactComponent(prevElement, nextElement)) {
            ReactReconciler$4.receiveComponent(prevChild, nextElement, transaction, context);
            nextChildren[name] = prevChild;
          } else {
            if (prevChild) {
              removedNodes[name] = ReactReconciler$4.getHostNode(prevChild);
              ReactReconciler$4.unmountComponent(prevChild, false);
            }
            // The child must be instantiated before it's mounted.
            var nextChildInstance = instantiateReactComponent(nextElement, true);
            nextChildren[name] = nextChildInstance;
            // Creating mount image now ensures refs are resolved in right order
            // (see https://github.com/facebook/react/pull/7101 for explanation).
            var nextChildMountImage = ReactReconciler$4.mountComponent(nextChildInstance, transaction, hostParent, hostContainerInfo, context, selfDebugID);
            mountImages.push(nextChildMountImage);
          }
        }
        // Unmount children that are no longer present.
        for (name in prevChildren) {
          if (prevChildren.hasOwnProperty(name) && !(nextChildren && nextChildren.hasOwnProperty(name))) {
            prevChild = prevChildren[name];
            removedNodes[name] = ReactReconciler$4.getHostNode(prevChild);
            ReactReconciler$4.unmountComponent(prevChild, false);
          }
        }
      },

      /**
       * Unmounts all rendered children. This should be used to clean up children
       * when this component is unmounted.
       *
       * @param {?object} renderedChildren Previously initialized set of children.
       * @internal
       */
      unmountChildren: function (renderedChildren, safely) {
        for (var name in renderedChildren) {
          if (renderedChildren.hasOwnProperty(name)) {
            var renderedChild = renderedChildren[name];
            ReactReconciler$4.unmountComponent(renderedChild, safely);
          }
        }
      }

    };

    var __moduleExports$116 = ReactChildReconciler$1;

    var KeyEscapeUtils$3 = __moduleExports$13;
    var traverseAllChildren$3 = __moduleExports$11;
    /**
     * @param {function} traverseContext Context passed through traversal.
     * @param {?ReactComponent} child React child component.
     * @param {!string} name String name of key path to child.
     * @param {number=} selfDebugID Optional debugID of the current internal instance.
     */
    function flattenSingleChildIntoContext(traverseContext, child, name, selfDebugID) {
      // We found a component instance.
      if (traverseContext && typeof traverseContext === 'object') {
        var result = traverseContext;
        var keyUnique = result[name] === undefined;
        if ("production" !== 'production') {}
        if (keyUnique && child != null) {
          result[name] = child;
        }
      }
    }

    /**
     * Flattens children that are typically specified as `props.children`. Any null
     * children will not be included in the resulting object.
     * @return {!object} flattened children keyed by name.
     */
    function flattenChildren$2(children, selfDebugID) {
      if (children == null) {
        return children;
      }
      var result = {};

      if ("production" !== 'production') {} else {
        traverseAllChildren$3(children, flattenSingleChildIntoContext, result);
      }
      return result;
    }

    var __moduleExports$124 = flattenChildren$2;

    var _prodInvariant$22 = __moduleExports$4;

    var ReactComponentEnvironment = __moduleExports$114;
    var ReactInstanceMap = __moduleExports$115;
    var ReactMultiChildUpdateTypes$2 = __moduleExports$88;

    var ReactCurrentOwner$5 = __moduleExports$7;
    var ReactReconciler$3 = __moduleExports$55;
    var ReactChildReconciler = __moduleExports$116;

    var emptyFunction$7 = __moduleExports$9;
    var flattenChildren$1 = __moduleExports$124;
    var invariant$27 = __moduleExports$5;

    /**
     * Make an update for markup to be rendered and inserted at a supplied index.
     *
     * @param {string} markup Markup that renders into an element.
     * @param {number} toIndex Destination index.
     * @private
     */
    function makeInsertMarkup(markup, afterNode, toIndex) {
      // NOTE: Null values reduce hidden classes.
      return {
        type: ReactMultiChildUpdateTypes$2.INSERT_MARKUP,
        content: markup,
        fromIndex: null,
        fromNode: null,
        toIndex: toIndex,
        afterNode: afterNode
      };
    }

    /**
     * Make an update for moving an existing element to another index.
     *
     * @param {number} fromIndex Source index of the existing element.
     * @param {number} toIndex Destination index of the element.
     * @private
     */
    function makeMove(child, afterNode, toIndex) {
      // NOTE: Null values reduce hidden classes.
      return {
        type: ReactMultiChildUpdateTypes$2.MOVE_EXISTING,
        content: null,
        fromIndex: child._mountIndex,
        fromNode: ReactReconciler$3.getHostNode(child),
        toIndex: toIndex,
        afterNode: afterNode
      };
    }

    /**
     * Make an update for removing an element at an index.
     *
     * @param {number} fromIndex Index of the element to remove.
     * @private
     */
    function makeRemove(child, node) {
      // NOTE: Null values reduce hidden classes.
      return {
        type: ReactMultiChildUpdateTypes$2.REMOVE_NODE,
        content: null,
        fromIndex: child._mountIndex,
        fromNode: node,
        toIndex: null,
        afterNode: null
      };
    }

    /**
     * Make an update for setting the markup of a node.
     *
     * @param {string} markup Markup that renders into an element.
     * @private
     */
    function makeSetMarkup(markup) {
      // NOTE: Null values reduce hidden classes.
      return {
        type: ReactMultiChildUpdateTypes$2.SET_MARKUP,
        content: markup,
        fromIndex: null,
        fromNode: null,
        toIndex: null,
        afterNode: null
      };
    }

    /**
     * Make an update for setting the text content.
     *
     * @param {string} textContent Text content to set.
     * @private
     */
    function makeTextContent(textContent) {
      // NOTE: Null values reduce hidden classes.
      return {
        type: ReactMultiChildUpdateTypes$2.TEXT_CONTENT,
        content: textContent,
        fromIndex: null,
        fromNode: null,
        toIndex: null,
        afterNode: null
      };
    }

    /**
     * Push an update, if any, onto the queue. Creates a new queue if none is
     * passed and always returns the queue. Mutative.
     */
    function enqueue(queue, update) {
      if (update) {
        queue = queue || [];
        queue.push(update);
      }
      return queue;
    }

    /**
     * Processes any enqueued updates.
     *
     * @private
     */
    function processQueue(inst, updateQueue) {
      ReactComponentEnvironment.processChildrenUpdates(inst, updateQueue);
    }

    var setChildrenForInstrumentation = emptyFunction$7;
    /**
     * ReactMultiChild are capable of reconciling multiple children.
     *
     * @class ReactMultiChild
     * @internal
     */
    var ReactMultiChild$1 = {

      /**
       * Provides common functionality for components that must reconcile multiple
       * children. This is used by `ReactDOMComponent` to mount, update, and
       * unmount child components.
       *
       * @lends {ReactMultiChild.prototype}
       */
      Mixin: {

        _reconcilerInstantiateChildren: function (nestedChildren, transaction, context) {
          if ("production" !== 'production') {}
          return ReactChildReconciler.instantiateChildren(nestedChildren, transaction, context);
        },

        _reconcilerUpdateChildren: function (prevChildren, nextNestedChildrenElements, mountImages, removedNodes, transaction, context) {
          var nextChildren;
          var selfDebugID = 0;
          if ("production" !== 'production') {}
          nextChildren = flattenChildren$1(nextNestedChildrenElements, selfDebugID);
          ReactChildReconciler.updateChildren(prevChildren, nextChildren, mountImages, removedNodes, transaction, this, this._hostContainerInfo, context, selfDebugID);
          return nextChildren;
        },

        /**
         * Generates a "mount image" for each of the supplied children. In the case
         * of `ReactDOMComponent`, a mount image is a string of markup.
         *
         * @param {?object} nestedChildren Nested child maps.
         * @return {array} An array of mounted representations.
         * @internal
         */
        mountChildren: function (nestedChildren, transaction, context) {
          var children = this._reconcilerInstantiateChildren(nestedChildren, transaction, context);
          this._renderedChildren = children;

          var mountImages = [];
          var index = 0;
          for (var name in children) {
            if (children.hasOwnProperty(name)) {
              var child = children[name];
              var selfDebugID = 0;
              if ("production" !== 'production') {}
              var mountImage = ReactReconciler$3.mountComponent(child, transaction, this, this._hostContainerInfo, context, selfDebugID);
              child._mountIndex = index++;
              mountImages.push(mountImage);
            }
          }

          if ("production" !== 'production') {}

          return mountImages;
        },

        /**
         * Replaces any rendered children with a text content string.
         *
         * @param {string} nextContent String of content.
         * @internal
         */
        updateTextContent: function (nextContent) {
          var prevChildren = this._renderedChildren;
          // Remove any rendered children.
          ReactChildReconciler.unmountChildren(prevChildren, false);
          for (var name in prevChildren) {
            if (prevChildren.hasOwnProperty(name)) {
              _prodInvariant$22('118');
            }
          }
          // Set new text content.
          var updates = [makeTextContent(nextContent)];
          processQueue(this, updates);
        },

        /**
         * Replaces any rendered children with a markup string.
         *
         * @param {string} nextMarkup String of markup.
         * @internal
         */
        updateMarkup: function (nextMarkup) {
          var prevChildren = this._renderedChildren;
          // Remove any rendered children.
          ReactChildReconciler.unmountChildren(prevChildren, false);
          for (var name in prevChildren) {
            if (prevChildren.hasOwnProperty(name)) {
              _prodInvariant$22('118');
            }
          }
          var updates = [makeSetMarkup(nextMarkup)];
          processQueue(this, updates);
        },

        /**
         * Updates the rendered children with new children.
         *
         * @param {?object} nextNestedChildrenElements Nested child element maps.
         * @param {ReactReconcileTransaction} transaction
         * @internal
         */
        updateChildren: function (nextNestedChildrenElements, transaction, context) {
          // Hook used by React ART
          this._updateChildren(nextNestedChildrenElements, transaction, context);
        },

        /**
         * @param {?object} nextNestedChildrenElements Nested child element maps.
         * @param {ReactReconcileTransaction} transaction
         * @final
         * @protected
         */
        _updateChildren: function (nextNestedChildrenElements, transaction, context) {
          var prevChildren = this._renderedChildren;
          var removedNodes = {};
          var mountImages = [];
          var nextChildren = this._reconcilerUpdateChildren(prevChildren, nextNestedChildrenElements, mountImages, removedNodes, transaction, context);
          if (!nextChildren && !prevChildren) {
            return;
          }
          var updates = null;
          var name;
          // `nextIndex` will increment for each child in `nextChildren`, but
          // `lastIndex` will be the last index visited in `prevChildren`.
          var nextIndex = 0;
          var lastIndex = 0;
          // `nextMountIndex` will increment for each newly mounted child.
          var nextMountIndex = 0;
          var lastPlacedNode = null;
          for (name in nextChildren) {
            if (!nextChildren.hasOwnProperty(name)) {
              continue;
            }
            var prevChild = prevChildren && prevChildren[name];
            var nextChild = nextChildren[name];
            if (prevChild === nextChild) {
              updates = enqueue(updates, this.moveChild(prevChild, lastPlacedNode, nextIndex, lastIndex));
              lastIndex = Math.max(prevChild._mountIndex, lastIndex);
              prevChild._mountIndex = nextIndex;
            } else {
              if (prevChild) {
                // Update `lastIndex` before `_mountIndex` gets unset by unmounting.
                lastIndex = Math.max(prevChild._mountIndex, lastIndex);
                // The `removedNodes` loop below will actually remove the child.
              }
              // The child must be instantiated before it's mounted.
              updates = enqueue(updates, this._mountChildAtIndex(nextChild, mountImages[nextMountIndex], lastPlacedNode, nextIndex, transaction, context));
              nextMountIndex++;
            }
            nextIndex++;
            lastPlacedNode = ReactReconciler$3.getHostNode(nextChild);
          }
          // Remove children that are no longer present.
          for (name in removedNodes) {
            if (removedNodes.hasOwnProperty(name)) {
              updates = enqueue(updates, this._unmountChild(prevChildren[name], removedNodes[name]));
            }
          }
          if (updates) {
            processQueue(this, updates);
          }
          this._renderedChildren = nextChildren;

          if ("production" !== 'production') {}
        },

        /**
         * Unmounts all rendered children. This should be used to clean up children
         * when this component is unmounted. It does not actually perform any
         * backend operations.
         *
         * @internal
         */
        unmountChildren: function (safely) {
          var renderedChildren = this._renderedChildren;
          ReactChildReconciler.unmountChildren(renderedChildren, safely);
          this._renderedChildren = null;
        },

        /**
         * Moves a child component to the supplied index.
         *
         * @param {ReactComponent} child Component to move.
         * @param {number} toIndex Destination index of the element.
         * @param {number} lastIndex Last index visited of the siblings of `child`.
         * @protected
         */
        moveChild: function (child, afterNode, toIndex, lastIndex) {
          // If the index of `child` is less than `lastIndex`, then it needs to
          // be moved. Otherwise, we do not need to move it because a child will be
          // inserted or moved before `child`.
          if (child._mountIndex < lastIndex) {
            return makeMove(child, afterNode, toIndex);
          }
        },

        /**
         * Creates a child component.
         *
         * @param {ReactComponent} child Component to create.
         * @param {string} mountImage Markup to insert.
         * @protected
         */
        createChild: function (child, afterNode, mountImage) {
          return makeInsertMarkup(mountImage, afterNode, child._mountIndex);
        },

        /**
         * Removes a child component.
         *
         * @param {ReactComponent} child Child to remove.
         * @protected
         */
        removeChild: function (child, node) {
          return makeRemove(child, node);
        },

        /**
         * Mounts a child with the supplied name.
         *
         * NOTE: This is part of `updateChildren` and is here for readability.
         *
         * @param {ReactComponent} child Component to mount.
         * @param {string} name Name of the child.
         * @param {number} index Index at which to insert the child.
         * @param {ReactReconcileTransaction} transaction
         * @private
         */
        _mountChildAtIndex: function (child, mountImage, afterNode, index, transaction, context) {
          child._mountIndex = index;
          return this.createChild(child, afterNode, mountImage);
        },

        /**
         * Unmounts a rendered child.
         *
         * NOTE: This is part of `updateChildren` and is here for readability.
         *
         * @param {ReactComponent} child Component to unmount.
         * @private
         */
        _unmountChild: function (child, node) {
          var update = this.removeChild(child, node);
          child._mountIndex = null;
          return update;
        }

      }

    };

    var __moduleExports$113 = ReactMultiChild$1;

    var _prodInvariant$28 = __moduleExports$4;

    var ReactCurrentOwner$7 = __moduleExports$7;
    var ReactInstanceMap$3 = __moduleExports$115;
    var ReactUpdates$6 = __moduleExports$52;

    var invariant$33 = __moduleExports$5;
    function enqueueUpdate$1(internalInstance) {
      ReactUpdates$6.enqueueUpdate(internalInstance);
    }

    function formatUnexpectedArgument(arg) {
      var type = typeof arg;
      if (type !== 'object') {
        return type;
      }
      var displayName = arg.constructor && arg.constructor.name || type;
      var keys = Object.keys(arg);
      if (keys.length > 0 && keys.length < 20) {
        return displayName + ' (keys: ' + keys.join(', ') + ')';
      }
      return displayName;
    }

    function getInternalInstanceReadyForUpdate(publicInstance, callerName) {
      var internalInstance = ReactInstanceMap$3.get(publicInstance);
      if (!internalInstance) {
        if ("production" !== 'production') {}
        return null;
      }

      if ("production" !== 'production') {}

      return internalInstance;
    }

    /**
     * ReactUpdateQueue allows for state updates to be scheduled into a later
     * reconciliation step.
     */
    var ReactUpdateQueue$1 = {

      /**
       * Checks whether or not this composite component is mounted.
       * @param {ReactClass} publicInstance The instance we want to test.
       * @return {boolean} True if mounted, false otherwise.
       * @protected
       * @final
       */
      isMounted: function (publicInstance) {
        if ("production" !== 'production') {}
        var internalInstance = ReactInstanceMap$3.get(publicInstance);
        if (internalInstance) {
          // During componentWillMount and render this will still be null but after
          // that will always render to something. At least for now. So we can use
          // this hack.
          return !!internalInstance._renderedComponent;
        } else {
          return false;
        }
      },

      /**
       * Enqueue a callback that will be executed after all the pending updates
       * have processed.
       *
       * @param {ReactClass} publicInstance The instance to use as `this` context.
       * @param {?function} callback Called after state is updated.
       * @param {string} callerName Name of the calling function in the public API.
       * @internal
       */
      enqueueCallback: function (publicInstance, callback, callerName) {
        ReactUpdateQueue$1.validateCallback(callback, callerName);
        var internalInstance = getInternalInstanceReadyForUpdate(publicInstance);

        // Previously we would throw an error if we didn't have an internal
        // instance. Since we want to make it a no-op instead, we mirror the same
        // behavior we have in other enqueue* methods.
        // We also need to ignore callbacks in componentWillMount. See
        // enqueueUpdates.
        if (!internalInstance) {
          return null;
        }

        if (internalInstance._pendingCallbacks) {
          internalInstance._pendingCallbacks.push(callback);
        } else {
          internalInstance._pendingCallbacks = [callback];
        }
        // TODO: The callback here is ignored when setState is called from
        // componentWillMount. Either fix it or disallow doing so completely in
        // favor of getInitialState. Alternatively, we can disallow
        // componentWillMount during server-side rendering.
        enqueueUpdate$1(internalInstance);
      },

      enqueueCallbackInternal: function (internalInstance, callback) {
        if (internalInstance._pendingCallbacks) {
          internalInstance._pendingCallbacks.push(callback);
        } else {
          internalInstance._pendingCallbacks = [callback];
        }
        enqueueUpdate$1(internalInstance);
      },

      /**
       * Forces an update. This should only be invoked when it is known with
       * certainty that we are **not** in a DOM transaction.
       *
       * You may want to call this when you know that some deeper aspect of the
       * component's state has changed but `setState` was not called.
       *
       * This will not invoke `shouldComponentUpdate`, but it will invoke
       * `componentWillUpdate` and `componentDidUpdate`.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @internal
       */
      enqueueForceUpdate: function (publicInstance) {
        var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'forceUpdate');

        if (!internalInstance) {
          return;
        }

        internalInstance._pendingForceUpdate = true;

        enqueueUpdate$1(internalInstance);
      },

      /**
       * Replaces all of the state. Always use this or `setState` to mutate state.
       * You should treat `this.state` as immutable.
       *
       * There is no guarantee that `this.state` will be immediately updated, so
       * accessing `this.state` after calling this method may return the old value.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object} completeState Next state.
       * @internal
       */
      enqueueReplaceState: function (publicInstance, completeState) {
        var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'replaceState');

        if (!internalInstance) {
          return;
        }

        internalInstance._pendingStateQueue = [completeState];
        internalInstance._pendingReplaceState = true;

        enqueueUpdate$1(internalInstance);
      },

      /**
       * Sets a subset of the state. This only exists because _pendingState is
       * internal. This provides a merging strategy that is not available to deep
       * properties which is confusing. TODO: Expose pendingState or don't use it
       * during the merge.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object} partialState Next partial state to be merged with state.
       * @internal
       */
      enqueueSetState: function (publicInstance, partialState) {
        if ("production" !== 'production') {}

        var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState');

        if (!internalInstance) {
          return;
        }

        var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
        queue.push(partialState);

        enqueueUpdate$1(internalInstance);
      },

      enqueueElementInternal: function (internalInstance, nextElement, nextContext) {
        internalInstance._pendingElement = nextElement;
        // TODO: introduce _pendingContext instead of setting it directly.
        internalInstance._context = nextContext;
        enqueueUpdate$1(internalInstance);
      },

      validateCallback: function (callback, callerName) {
        !(!callback || typeof callback === 'function') ? _prodInvariant$28('122', callerName, formatUnexpectedArgument(callback)) : void 0;
      }

    };

    var __moduleExports$127 = ReactUpdateQueue$1;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var ReactUpdateQueue = __moduleExports$127;
    var Transaction$3 = __moduleExports$65;
    function warnNoop$1(publicInstance, callerName) {
      if ("production" !== 'production') {}
    }

    /**
     * This is the update queue used for server rendering.
     * It delegates to ReactUpdateQueue while server rendering is in progress and
     * switches to ReactNoopUpdateQueue after the transaction has completed.
     * @class ReactServerUpdateQueue
     * @param {Transaction} transaction
     */

    var ReactServerUpdateQueue$1 = function () {
      /* :: transaction: Transaction; */

      function ReactServerUpdateQueue(transaction) {
        _classCallCheck(this, ReactServerUpdateQueue);

        this.transaction = transaction;
      }

      /**
       * Checks whether or not this composite component is mounted.
       * @param {ReactClass} publicInstance The instance we want to test.
       * @return {boolean} True if mounted, false otherwise.
       * @protected
       * @final
       */


      ReactServerUpdateQueue.prototype.isMounted = function isMounted(publicInstance) {
        return false;
      };

      /**
       * Enqueue a callback that will be executed after all the pending updates
       * have processed.
       *
       * @param {ReactClass} publicInstance The instance to use as `this` context.
       * @param {?function} callback Called after state is updated.
       * @internal
       */


      ReactServerUpdateQueue.prototype.enqueueCallback = function enqueueCallback(publicInstance, callback, callerName) {
        if (this.transaction.isInTransaction()) {
          ReactUpdateQueue.enqueueCallback(publicInstance, callback, callerName);
        }
      };

      /**
       * Forces an update. This should only be invoked when it is known with
       * certainty that we are **not** in a DOM transaction.
       *
       * You may want to call this when you know that some deeper aspect of the
       * component's state has changed but `setState` was not called.
       *
       * This will not invoke `shouldComponentUpdate`, but it will invoke
       * `componentWillUpdate` and `componentDidUpdate`.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @internal
       */


      ReactServerUpdateQueue.prototype.enqueueForceUpdate = function enqueueForceUpdate(publicInstance) {
        if (this.transaction.isInTransaction()) {
          ReactUpdateQueue.enqueueForceUpdate(publicInstance);
        } else {
          warnNoop$1(publicInstance, 'forceUpdate');
        }
      };

      /**
       * Replaces all of the state. Always use this or `setState` to mutate state.
       * You should treat `this.state` as immutable.
       *
       * There is no guarantee that `this.state` will be immediately updated, so
       * accessing `this.state` after calling this method may return the old value.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object|function} completeState Next state.
       * @internal
       */


      ReactServerUpdateQueue.prototype.enqueueReplaceState = function enqueueReplaceState(publicInstance, completeState) {
        if (this.transaction.isInTransaction()) {
          ReactUpdateQueue.enqueueReplaceState(publicInstance, completeState);
        } else {
          warnNoop$1(publicInstance, 'replaceState');
        }
      };

      /**
       * Sets a subset of the state. This only exists because _pendingState is
       * internal. This provides a merging strategy that is not available to deep
       * properties which is confusing. TODO: Expose pendingState or don't use it
       * during the merge.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object|function} partialState Next partial state to be merged with state.
       * @internal
       */


      ReactServerUpdateQueue.prototype.enqueueSetState = function enqueueSetState(publicInstance, partialState) {
        if (this.transaction.isInTransaction()) {
          ReactUpdateQueue.enqueueSetState(publicInstance, partialState);
        } else {
          warnNoop$1(publicInstance, 'setState');
        }
      };

      return ReactServerUpdateQueue;
    }();

    var __moduleExports$126 = ReactServerUpdateQueue$1;

    var _assign$17 = __moduleExports$1;

    var PooledClass$6 = __moduleExports$3;
    var Transaction$2 = __moduleExports$65;
    var ReactServerUpdateQueue = __moduleExports$126;

    /**
     * Executed within the scope of the `Transaction` instance. Consider these as
     * being member methods, but with an implied ordering while being isolated from
     * each other.
     */
    var TRANSACTION_WRAPPERS$1 = [];

    var noopCallbackQueue = {
      enqueue: function () {}
    };

    /**
     * @class ReactServerRenderingTransaction
     * @param {boolean} renderToStaticMarkup
     */
    function ReactServerRenderingTransaction$1(renderToStaticMarkup) {
      this.reinitializeTransaction();
      this.renderToStaticMarkup = renderToStaticMarkup;
      this.useCreateElement = false;
      this.updateQueue = new ReactServerUpdateQueue(this);
    }

    var Mixin$1 = {
      /**
       * @see Transaction
       * @abstract
       * @final
       * @return {array} Empty list of operation wrap procedures.
       */
      getTransactionWrappers: function () {
        return TRANSACTION_WRAPPERS$1;
      },

      /**
       * @return {object} The queue to collect `onDOMReady` callbacks with.
       */
      getReactMountReady: function () {
        return noopCallbackQueue;
      },

      /**
       * @return {object} The queue to collect React async events.
       */
      getUpdateQueue: function () {
        return this.updateQueue;
      },

      /**
       * `PooledClass` looks for this, and will invoke this before allowing this
       * instance to be reused.
       */
      destructor: function () {},

      checkpoint: function () {},

      rollback: function () {}
    };

    _assign$17(ReactServerRenderingTransaction$1.prototype, Transaction$2.Mixin, Mixin$1);

    PooledClass$6.addPoolingTo(ReactServerRenderingTransaction$1);

    var __moduleExports$125 = ReactServerRenderingTransaction$1;

    var _assign$18 = __moduleExports$1;

    var emptyFunction$8 = __moduleExports$9;
    var validateDOMNesting$1 = emptyFunction$8;

    var __moduleExports$128 = validateDOMNesting$1;

var     _prodInvariant$18 = __moduleExports$4;
var     _assign$8 = __moduleExports$1;
    var AutoFocusUtils = __moduleExports$91;
    var CSSPropertyOperations = __moduleExports$93;
    var DOMLazyTree$3 = __moduleExports$78;
    var DOMNamespaces$3 = __moduleExports$79;
    var DOMProperty$3 = __moduleExports$33;
    var DOMPropertyOperations = __moduleExports$101;
    var EventConstants$6 = __moduleExports$37;
    var EventPluginHub$3 = __moduleExports$39;
    var EventPluginRegistry$2 = __moduleExports$40;
    var ReactBrowserEventEmitter = __moduleExports$103;
    var ReactDOMButton = __moduleExports$106;
    var ReactDOMComponentFlags$2 = __moduleExports$34;
    var ReactDOMComponentTree$7 = __moduleExports$32;
    var ReactDOMInput = __moduleExports$108;
    var ReactDOMOption = __moduleExports$110;
    var ReactDOMSelect = __moduleExports$111;
    var ReactDOMTextarea = __moduleExports$112;
    var ReactMultiChild = __moduleExports$113;
    var ReactServerRenderingTransaction = __moduleExports$125;

    var emptyFunction$6 = __moduleExports$9;
    var escapeTextContentForBrowser$2 = __moduleExports$83;
    var invariant$23 = __moduleExports$5;
    var isEventSupported$2 = __moduleExports$67;
    var keyOf$6 = __moduleExports$22;
    var shallowEqual = __moduleExports$120;
    var Flags$1 = ReactDOMComponentFlags$2;
    var deleteListener = EventPluginHub$3.deleteListener;
    var getNode = ReactDOMComponentTree$7.getNodeFromInstance;
    var listenTo = ReactBrowserEventEmitter.listenTo;
    var registrationNameModules = EventPluginRegistry$2.registrationNameModules;

    // For quickly matching children type, to test if can be treated as content.
    var CONTENT_TYPES = { 'string': true, 'number': true };

    var STYLE = keyOf$6({ style: null });
    var HTML = keyOf$6({ __html: null });
    var RESERVED_PROPS$1 = {
      children: null,
      dangerouslySetInnerHTML: null,
      suppressContentEditableWarning: null
    };

    // Node type for document fragments (Node.DOCUMENT_FRAGMENT_NODE).
    var DOC_FRAGMENT_TYPE = 11;

    function getDeclarationErrorAddendum$1(internalInstance) {
      if (internalInstance) {
        var owner = internalInstance._currentElement._owner || null;
        if (owner) {
          var name = owner.getName();
          if (name) {
            return ' This DOM node was rendered by `' + name + '`.';
          }
        }
      }
      return '';
    }

    /**
     * @param {object} component
     * @param {?object} props
     */
    function assertValidProps(component, props) {
      if (!props) {
        return;
      }
      // Note the use of `==` which checks for null or undefined.
      if (voidElementTags[component._tag]) {
        !(props.children == null && props.dangerouslySetInnerHTML == null) ? _prodInvariant$18('137', component._tag, component._currentElement._owner ? ' Check the render method of ' + component._currentElement._owner.getName() + '.' : '') : void 0;
      }
      if (props.dangerouslySetInnerHTML != null) {
        !(props.children == null) ? _prodInvariant$18('60') : void 0;
        !(typeof props.dangerouslySetInnerHTML === 'object' && HTML in props.dangerouslySetInnerHTML) ? _prodInvariant$18('61') : void 0;
      }
      if ("production" !== 'production') {}
      !(props.style == null || typeof props.style === 'object') ? _prodInvariant$18('62', getDeclarationErrorAddendum$1(component)) : void 0;
    }

    function enqueuePutListener(inst, registrationName, listener, transaction) {
      if (transaction instanceof ReactServerRenderingTransaction) {
        return;
      }
      if ("production" !== 'production') {}
      var containerInfo = inst._hostContainerInfo;
      var isDocumentFragment = containerInfo._node && containerInfo._node.nodeType === DOC_FRAGMENT_TYPE;
      var doc = isDocumentFragment ? containerInfo._node : containerInfo._ownerDocument;
      listenTo(registrationName, doc);
      transaction.getReactMountReady().enqueue(putListener, {
        inst: inst,
        registrationName: registrationName,
        listener: listener
      });
    }

    function putListener() {
      var listenerToPut = this;
      EventPluginHub$3.putListener(listenerToPut.inst, listenerToPut.registrationName, listenerToPut.listener);
    }

    function inputPostMount() {
      var inst = this;
      ReactDOMInput.postMountWrapper(inst);
    }

    function textareaPostMount() {
      var inst = this;
      ReactDOMTextarea.postMountWrapper(inst);
    }

    function optionPostMount() {
      var inst = this;
      ReactDOMOption.postMountWrapper(inst);
    }

    var setContentChildForInstrumentation = emptyFunction$6;
    // There are so many media events, it makes sense to just
    // maintain a list rather than create a `trapBubbledEvent` for each
    var mediaEvents = {
      topAbort: 'abort',
      topCanPlay: 'canplay',
      topCanPlayThrough: 'canplaythrough',
      topDurationChange: 'durationchange',
      topEmptied: 'emptied',
      topEncrypted: 'encrypted',
      topEnded: 'ended',
      topError: 'error',
      topLoadedData: 'loadeddata',
      topLoadedMetadata: 'loadedmetadata',
      topLoadStart: 'loadstart',
      topPause: 'pause',
      topPlay: 'play',
      topPlaying: 'playing',
      topProgress: 'progress',
      topRateChange: 'ratechange',
      topSeeked: 'seeked',
      topSeeking: 'seeking',
      topStalled: 'stalled',
      topSuspend: 'suspend',
      topTimeUpdate: 'timeupdate',
      topVolumeChange: 'volumechange',
      topWaiting: 'waiting'
    };

    function trapBubbledEventsLocal() {
      var inst = this;
      // If a component renders to null or if another component fatals and causes
      // the state of the tree to be corrupted, `node` here can be null.
      !inst._rootNodeID ? _prodInvariant$18('63') : void 0;
      var node = getNode(inst);
      !node ? _prodInvariant$18('64') : void 0;

      switch (inst._tag) {
        case 'iframe':
        case 'object':
          inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent(EventConstants$6.topLevelTypes.topLoad, 'load', node)];
          break;
        case 'video':
        case 'audio':

          inst._wrapperState.listeners = [];
          // Create listener for each media event
          for (var event in mediaEvents) {
            if (mediaEvents.hasOwnProperty(event)) {
              inst._wrapperState.listeners.push(ReactBrowserEventEmitter.trapBubbledEvent(EventConstants$6.topLevelTypes[event], mediaEvents[event], node));
            }
          }
          break;
        case 'source':
          inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent(EventConstants$6.topLevelTypes.topError, 'error', node)];
          break;
        case 'img':
          inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent(EventConstants$6.topLevelTypes.topError, 'error', node), ReactBrowserEventEmitter.trapBubbledEvent(EventConstants$6.topLevelTypes.topLoad, 'load', node)];
          break;
        case 'form':
          inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent(EventConstants$6.topLevelTypes.topReset, 'reset', node), ReactBrowserEventEmitter.trapBubbledEvent(EventConstants$6.topLevelTypes.topSubmit, 'submit', node)];
          break;
        case 'input':
        case 'select':
        case 'textarea':
          inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent(EventConstants$6.topLevelTypes.topInvalid, 'invalid', node)];
          break;
      }
    }

    function postUpdateSelectWrapper() {
      ReactDOMSelect.postUpdateWrapper(this);
    }

    // For HTML, certain tags should omit their close tag. We keep a whitelist for
    // those special-case tags.

    var omittedCloseTags = {
      'area': true,
      'base': true,
      'br': true,
      'col': true,
      'embed': true,
      'hr': true,
      'img': true,
      'input': true,
      'keygen': true,
      'link': true,
      'meta': true,
      'param': true,
      'source': true,
      'track': true,
      'wbr': true
    };

    // NOTE: menuitem's close tag should be omitted, but that causes problems.
    var newlineEatingTags = {
      'listing': true,
      'pre': true,
      'textarea': true
    };

    // For HTML, certain tags cannot have children. This has the same purpose as
    // `omittedCloseTags` except that `menuitem` should still have its closing tag.

    var voidElementTags = _assign$8({
      'menuitem': true
    }, omittedCloseTags);

    // We accept any tag to be rendered but since this gets injected into arbitrary
    // HTML, we want to make sure that it's a safe tag.
    // http://www.w3.org/TR/REC-xml/#NT-Name

    var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/; // Simplified subset
    var validatedTagCache = {};
    var hasOwnProperty$4 = {}.hasOwnProperty;

    function validateDangerousTag(tag) {
      if (!hasOwnProperty$4.call(validatedTagCache, tag)) {
        !VALID_TAG_REGEX.test(tag) ? _prodInvariant$18('65', tag) : void 0;
        validatedTagCache[tag] = true;
      }
    }

    function isCustomComponent(tagName, props) {
      return tagName.indexOf('-') >= 0 || props.is != null;
    }

    var globalIdCounter = 1;

    /**
     * Creates a new React class that is idempotent and capable of containing other
     * React components. It accepts event listeners and DOM properties that are
     * valid according to `DOMProperty`.
     *
     *  - Event listeners: `onClick`, `onMouseDown`, etc.
     *  - DOM properties: `className`, `name`, `title`, etc.
     *
     * The `style` property functions differently from the DOM API. It accepts an
     * object mapping of style properties to values.
     *
     * @constructor ReactDOMComponent
     * @extends ReactMultiChild
     */
    function ReactDOMComponent$1(element) {
      var tag = element.type;
      validateDangerousTag(tag);
      this._currentElement = element;
      this._tag = tag.toLowerCase();
      this._namespaceURI = null;
      this._renderedChildren = null;
      this._previousStyle = null;
      this._previousStyleCopy = null;
      this._hostNode = null;
      this._hostParent = null;
      this._rootNodeID = 0;
      this._domID = 0;
      this._hostContainerInfo = null;
      this._wrapperState = null;
      this._topLevelWrapper = null;
      this._flags = 0;
      if ("production" !== 'production') {}
    }

    ReactDOMComponent$1.displayName = 'ReactDOMComponent';

    ReactDOMComponent$1.Mixin = {

      /**
       * Generates root tag markup then recurses. This method has side effects and
       * is not idempotent.
       *
       * @internal
       * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
       * @param {?ReactDOMComponent} the parent component instance
       * @param {?object} info about the host container
       * @param {object} context
       * @return {string} The computed markup.
       */
      mountComponent: function (transaction, hostParent, hostContainerInfo, context) {
        this._rootNodeID = globalIdCounter++;
        this._domID = hostContainerInfo._idCounter++;
        this._hostParent = hostParent;
        this._hostContainerInfo = hostContainerInfo;

        var props = this._currentElement.props;

        switch (this._tag) {
          case 'audio':
          case 'form':
          case 'iframe':
          case 'img':
          case 'link':
          case 'object':
          case 'source':
          case 'video':
            this._wrapperState = {
              listeners: null
            };
            transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
            break;
          case 'button':
            props = ReactDOMButton.getHostProps(this, props, hostParent);
            break;
          case 'input':
            ReactDOMInput.mountWrapper(this, props, hostParent);
            props = ReactDOMInput.getHostProps(this, props);
            transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
            break;
          case 'option':
            ReactDOMOption.mountWrapper(this, props, hostParent);
            props = ReactDOMOption.getHostProps(this, props);
            break;
          case 'select':
            ReactDOMSelect.mountWrapper(this, props, hostParent);
            props = ReactDOMSelect.getHostProps(this, props);
            transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
            break;
          case 'textarea':
            ReactDOMTextarea.mountWrapper(this, props, hostParent);
            props = ReactDOMTextarea.getHostProps(this, props);
            transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
            break;
        }

        assertValidProps(this, props);

        // We create tags in the namespace of their parent container, except HTML
        // tags get no namespace.
        var namespaceURI;
        var parentTag;
        if (hostParent != null) {
          namespaceURI = hostParent._namespaceURI;
          parentTag = hostParent._tag;
        } else if (hostContainerInfo._tag) {
          namespaceURI = hostContainerInfo._namespaceURI;
          parentTag = hostContainerInfo._tag;
        }
        if (namespaceURI == null || namespaceURI === DOMNamespaces$3.svg && parentTag === 'foreignobject') {
          namespaceURI = DOMNamespaces$3.html;
        }
        if (namespaceURI === DOMNamespaces$3.html) {
          if (this._tag === 'svg') {
            namespaceURI = DOMNamespaces$3.svg;
          } else if (this._tag === 'math') {
            namespaceURI = DOMNamespaces$3.mathml;
          }
        }
        this._namespaceURI = namespaceURI;

        if ("production" !== 'production') {}

        var mountImage;
        if (transaction.useCreateElement) {
          var ownerDocument = hostContainerInfo._ownerDocument;
          var el;
          if (namespaceURI === DOMNamespaces$3.html) {
            if (this._tag === 'script') {
              // Create the script via .innerHTML so its "parser-inserted" flag is
              // set to true and it does not execute
              var div = ownerDocument.createElement('div');
              var type = this._currentElement.type;
              div.innerHTML = '<' + type + '></' + type + '>';
              el = div.removeChild(div.firstChild);
            } else if (props.is) {
              el = ownerDocument.createElement(this._currentElement.type, props.is);
            } else {
              // Separate else branch instead of using `props.is || undefined` above becuase of a Firefox bug.
              // See discussion in https://github.com/facebook/react/pull/6896
              // and discussion in https://bugzilla.mozilla.org/show_bug.cgi?id=1276240
              el = ownerDocument.createElement(this._currentElement.type);
            }
          } else {
            el = ownerDocument.createElementNS(namespaceURI, this._currentElement.type);
          }
          ReactDOMComponentTree$7.precacheNode(this, el);
          this._flags |= Flags$1.hasCachedChildNodes;
          if (!this._hostParent) {
            DOMPropertyOperations.setAttributeForRoot(el);
          }
          this._updateDOMProperties(null, props, transaction);
          var lazyTree = DOMLazyTree$3(el);
          this._createInitialChildren(transaction, props, context, lazyTree);
          mountImage = lazyTree;
        } else {
          var tagOpen = this._createOpenTagMarkupAndPutListeners(transaction, props);
          var tagContent = this._createContentMarkup(transaction, props, context);
          if (!tagContent && omittedCloseTags[this._tag]) {
            mountImage = tagOpen + '/>';
          } else {
            mountImage = tagOpen + '>' + tagContent + '</' + this._currentElement.type + '>';
          }
        }

        switch (this._tag) {
          case 'input':
            transaction.getReactMountReady().enqueue(inputPostMount, this);
            if (props.autoFocus) {
              transaction.getReactMountReady().enqueue(AutoFocusUtils.focusDOMComponent, this);
            }
            break;
          case 'textarea':
            transaction.getReactMountReady().enqueue(textareaPostMount, this);
            if (props.autoFocus) {
              transaction.getReactMountReady().enqueue(AutoFocusUtils.focusDOMComponent, this);
            }
            break;
          case 'select':
            if (props.autoFocus) {
              transaction.getReactMountReady().enqueue(AutoFocusUtils.focusDOMComponent, this);
            }
            break;
          case 'button':
            if (props.autoFocus) {
              transaction.getReactMountReady().enqueue(AutoFocusUtils.focusDOMComponent, this);
            }
            break;
          case 'option':
            transaction.getReactMountReady().enqueue(optionPostMount, this);
            break;
        }

        return mountImage;
      },

      /**
       * Creates markup for the open tag and all attributes.
       *
       * This method has side effects because events get registered.
       *
       * Iterating over object properties is faster than iterating over arrays.
       * @see http://jsperf.com/obj-vs-arr-iteration
       *
       * @private
       * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
       * @param {object} props
       * @return {string} Markup of opening tag.
       */
      _createOpenTagMarkupAndPutListeners: function (transaction, props) {
        var ret = '<' + this._currentElement.type;

        for (var propKey in props) {
          if (!props.hasOwnProperty(propKey)) {
            continue;
          }
          var propValue = props[propKey];
          if (propValue == null) {
            continue;
          }
          if (registrationNameModules.hasOwnProperty(propKey)) {
            if (propValue) {
              enqueuePutListener(this, propKey, propValue, transaction);
            }
          } else {
            if (propKey === STYLE) {
              if (propValue) {
                if ("production" !== 'production') {}
                propValue = this._previousStyleCopy = _assign$8({}, props.style);
              }
              propValue = CSSPropertyOperations.createMarkupForStyles(propValue, this);
            }
            var markup = null;
            if (this._tag != null && isCustomComponent(this._tag, props)) {
              if (!RESERVED_PROPS$1.hasOwnProperty(propKey)) {
                markup = DOMPropertyOperations.createMarkupForCustomAttribute(propKey, propValue);
              }
            } else {
              markup = DOMPropertyOperations.createMarkupForProperty(propKey, propValue);
            }
            if (markup) {
              ret += ' ' + markup;
            }
          }
        }

        // For static pages, no need to put React ID and checksum. Saves lots of
        // bytes.
        if (transaction.renderToStaticMarkup) {
          return ret;
        }

        if (!this._hostParent) {
          ret += ' ' + DOMPropertyOperations.createMarkupForRoot();
        }
        ret += ' ' + DOMPropertyOperations.createMarkupForID(this._domID);
        return ret;
      },

      /**
       * Creates markup for the content between the tags.
       *
       * @private
       * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
       * @param {object} props
       * @param {object} context
       * @return {string} Content markup.
       */
      _createContentMarkup: function (transaction, props, context) {
        var ret = '';

        // Intentional use of != to avoid catching zero/false.
        var innerHTML = props.dangerouslySetInnerHTML;
        if (innerHTML != null) {
          if (innerHTML.__html != null) {
            ret = innerHTML.__html;
          }
        } else {
          var contentToUse = CONTENT_TYPES[typeof props.children] ? props.children : null;
          var childrenToUse = contentToUse != null ? null : props.children;
          if (contentToUse != null) {
            // TODO: Validate that text is allowed as a child of this node
            ret = escapeTextContentForBrowser$2(contentToUse);
            if ("production" !== 'production') {}
          } else if (childrenToUse != null) {
            var mountImages = this.mountChildren(childrenToUse, transaction, context);
            ret = mountImages.join('');
          }
        }
        if (newlineEatingTags[this._tag] && ret.charAt(0) === '\n') {
          // text/html ignores the first character in these tags if it's a newline
          // Prefer to break application/xml over text/html (for now) by adding
          // a newline specifically to get eaten by the parser. (Alternately for
          // textareas, replacing "^\n" with "\r\n" doesn't get eaten, and the first
          // \r is normalized out by HTMLTextAreaElement#value.)
          // See: <http://www.w3.org/TR/html-polyglot/#newlines-in-textarea-and-pre>
          // See: <http://www.w3.org/TR/html5/syntax.html#element-restrictions>
          // See: <http://www.w3.org/TR/html5/syntax.html#newlines>
          // See: Parsing of "textarea" "listing" and "pre" elements
          //  from <http://www.w3.org/TR/html5/syntax.html#parsing-main-inbody>
          return '\n' + ret;
        } else {
          return ret;
        }
      },

      _createInitialChildren: function (transaction, props, context, lazyTree) {
        // Intentional use of != to avoid catching zero/false.
        var innerHTML = props.dangerouslySetInnerHTML;
        if (innerHTML != null) {
          if (innerHTML.__html != null) {
            DOMLazyTree$3.queueHTML(lazyTree, innerHTML.__html);
          }
        } else {
          var contentToUse = CONTENT_TYPES[typeof props.children] ? props.children : null;
          var childrenToUse = contentToUse != null ? null : props.children;
          if (contentToUse != null) {
            // TODO: Validate that text is allowed as a child of this node
            if ("production" !== 'production') {}
            DOMLazyTree$3.queueText(lazyTree, contentToUse);
          } else if (childrenToUse != null) {
            var mountImages = this.mountChildren(childrenToUse, transaction, context);
            for (var i = 0; i < mountImages.length; i++) {
              DOMLazyTree$3.queueChild(lazyTree, mountImages[i]);
            }
          }
        }
      },

      /**
       * Receives a next element and updates the component.
       *
       * @internal
       * @param {ReactElement} nextElement
       * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
       * @param {object} context
       */
      receiveComponent: function (nextElement, transaction, context) {
        var prevElement = this._currentElement;
        this._currentElement = nextElement;
        this.updateComponent(transaction, prevElement, nextElement, context);
      },

      /**
       * Updates a DOM component after it has already been allocated and
       * attached to the DOM. Reconciles the root DOM node, then recurses.
       *
       * @param {ReactReconcileTransaction} transaction
       * @param {ReactElement} prevElement
       * @param {ReactElement} nextElement
       * @internal
       * @overridable
       */
      updateComponent: function (transaction, prevElement, nextElement, context) {
        var lastProps = prevElement.props;
        var nextProps = this._currentElement.props;

        switch (this._tag) {
          case 'button':
            lastProps = ReactDOMButton.getHostProps(this, lastProps);
            nextProps = ReactDOMButton.getHostProps(this, nextProps);
            break;
          case 'input':
            lastProps = ReactDOMInput.getHostProps(this, lastProps);
            nextProps = ReactDOMInput.getHostProps(this, nextProps);
            break;
          case 'option':
            lastProps = ReactDOMOption.getHostProps(this, lastProps);
            nextProps = ReactDOMOption.getHostProps(this, nextProps);
            break;
          case 'select':
            lastProps = ReactDOMSelect.getHostProps(this, lastProps);
            nextProps = ReactDOMSelect.getHostProps(this, nextProps);
            break;
          case 'textarea':
            lastProps = ReactDOMTextarea.getHostProps(this, lastProps);
            nextProps = ReactDOMTextarea.getHostProps(this, nextProps);
            break;
        }

        assertValidProps(this, nextProps);
        this._updateDOMProperties(lastProps, nextProps, transaction);
        this._updateDOMChildren(lastProps, nextProps, transaction, context);

        switch (this._tag) {
          case 'input':
            // Update the wrapper around inputs *after* updating props. This has to
            // happen after `_updateDOMProperties`. Otherwise HTML5 input validations
            // raise warnings and prevent the new value from being assigned.
            ReactDOMInput.updateWrapper(this);
            break;
          case 'textarea':
            ReactDOMTextarea.updateWrapper(this);
            break;
          case 'select':
            // <select> value update needs to occur after <option> children
            // reconciliation
            transaction.getReactMountReady().enqueue(postUpdateSelectWrapper, this);
            break;
        }
      },

      /**
       * Reconciles the properties by detecting differences in property values and
       * updating the DOM as necessary. This function is probably the single most
       * critical path for performance optimization.
       *
       * TODO: Benchmark whether checking for changed values in memory actually
       *       improves performance (especially statically positioned elements).
       * TODO: Benchmark the effects of putting this at the top since 99% of props
       *       do not change for a given reconciliation.
       * TODO: Benchmark areas that can be improved with caching.
       *
       * @private
       * @param {object} lastProps
       * @param {object} nextProps
       * @param {?DOMElement} node
       */
      _updateDOMProperties: function (lastProps, nextProps, transaction) {
        var propKey;
        var styleName;
        var styleUpdates;
        for (propKey in lastProps) {
          if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
            continue;
          }
          if (propKey === STYLE) {
            var lastStyle = this._previousStyleCopy;
            for (styleName in lastStyle) {
              if (lastStyle.hasOwnProperty(styleName)) {
                styleUpdates = styleUpdates || {};
                styleUpdates[styleName] = '';
              }
            }
            this._previousStyleCopy = null;
          } else if (registrationNameModules.hasOwnProperty(propKey)) {
            if (lastProps[propKey]) {
              // Only call deleteListener if there was a listener previously or
              // else willDeleteListener gets called when there wasn't actually a
              // listener (e.g., onClick={null})
              deleteListener(this, propKey);
            }
          } else if (isCustomComponent(this._tag, lastProps)) {
            if (!RESERVED_PROPS$1.hasOwnProperty(propKey)) {
              DOMPropertyOperations.deleteValueForAttribute(getNode(this), propKey);
            }
          } else if (DOMProperty$3.properties[propKey] || DOMProperty$3.isCustomAttribute(propKey)) {
            DOMPropertyOperations.deleteValueForProperty(getNode(this), propKey);
          }
        }
        for (propKey in nextProps) {
          var nextProp = nextProps[propKey];
          var lastProp = propKey === STYLE ? this._previousStyleCopy : lastProps != null ? lastProps[propKey] : undefined;
          if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || nextProp == null && lastProp == null) {
            continue;
          }
          if (propKey === STYLE) {
            if (nextProp) {
              if ("production" !== 'production') {}
              nextProp = this._previousStyleCopy = _assign$8({}, nextProp);
            } else {
              this._previousStyleCopy = null;
            }
            if (lastProp) {
              // Unset styles on `lastProp` but not on `nextProp`.
              for (styleName in lastProp) {
                if (lastProp.hasOwnProperty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
                  styleUpdates = styleUpdates || {};
                  styleUpdates[styleName] = '';
                }
              }
              // Update styles that changed since `lastProp`.
              for (styleName in nextProp) {
                if (nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== nextProp[styleName]) {
                  styleUpdates = styleUpdates || {};
                  styleUpdates[styleName] = nextProp[styleName];
                }
              }
            } else {
              // Relies on `updateStylesByID` not mutating `styleUpdates`.
              styleUpdates = nextProp;
            }
          } else if (registrationNameModules.hasOwnProperty(propKey)) {
            if (nextProp) {
              enqueuePutListener(this, propKey, nextProp, transaction);
            } else if (lastProp) {
              deleteListener(this, propKey);
            }
          } else if (isCustomComponent(this._tag, nextProps)) {
            if (!RESERVED_PROPS$1.hasOwnProperty(propKey)) {
              DOMPropertyOperations.setValueForAttribute(getNode(this), propKey, nextProp);
            }
          } else if (DOMProperty$3.properties[propKey] || DOMProperty$3.isCustomAttribute(propKey)) {
            var node = getNode(this);
            // If we're updating to null or undefined, we should remove the property
            // from the DOM node instead of inadvertently setting to a string. This
            // brings us in line with the same behavior we have on initial render.
            if (nextProp != null) {
              DOMPropertyOperations.setValueForProperty(node, propKey, nextProp);
            } else {
              DOMPropertyOperations.deleteValueForProperty(node, propKey);
            }
          }
        }
        if (styleUpdates) {
          CSSPropertyOperations.setValueForStyles(getNode(this), styleUpdates, this);
        }
      },

      /**
       * Reconciles the children with the various properties that affect the
       * children content.
       *
       * @param {object} lastProps
       * @param {object} nextProps
       * @param {ReactReconcileTransaction} transaction
       * @param {object} context
       */
      _updateDOMChildren: function (lastProps, nextProps, transaction, context) {
        var lastContent = CONTENT_TYPES[typeof lastProps.children] ? lastProps.children : null;
        var nextContent = CONTENT_TYPES[typeof nextProps.children] ? nextProps.children : null;

        var lastHtml = lastProps.dangerouslySetInnerHTML && lastProps.dangerouslySetInnerHTML.__html;
        var nextHtml = nextProps.dangerouslySetInnerHTML && nextProps.dangerouslySetInnerHTML.__html;

        // Note the use of `!=` which checks for null or undefined.
        var lastChildren = lastContent != null ? null : lastProps.children;
        var nextChildren = nextContent != null ? null : nextProps.children;

        // If we're switching from children to content/html or vice versa, remove
        // the old content
        var lastHasContentOrHtml = lastContent != null || lastHtml != null;
        var nextHasContentOrHtml = nextContent != null || nextHtml != null;
        if (lastChildren != null && nextChildren == null) {
          this.updateChildren(null, transaction, context);
        } else if (lastHasContentOrHtml && !nextHasContentOrHtml) {
          this.updateTextContent('');
          if ("production" !== 'production') {}
        }

        if (nextContent != null) {
          if (lastContent !== nextContent) {
            this.updateTextContent('' + nextContent);
            if ("production" !== 'production') {}
          }
        } else if (nextHtml != null) {
          if (lastHtml !== nextHtml) {
            this.updateMarkup('' + nextHtml);
          }
          if ("production" !== 'production') {}
        } else if (nextChildren != null) {
          if ("production" !== 'production') {}

          this.updateChildren(nextChildren, transaction, context);
        }
      },

      getHostNode: function () {
        return getNode(this);
      },

      /**
       * Destroys all event registrations for this instance. Does not remove from
       * the DOM. That must be done by the parent.
       *
       * @internal
       */
      unmountComponent: function (safely) {
        switch (this._tag) {
          case 'audio':
          case 'form':
          case 'iframe':
          case 'img':
          case 'link':
          case 'object':
          case 'source':
          case 'video':
            var listeners = this._wrapperState.listeners;
            if (listeners) {
              for (var i = 0; i < listeners.length; i++) {
                listeners[i].remove();
              }
            }
            break;
          case 'html':
          case 'head':
          case 'body':
            /**
             * Components like <html> <head> and <body> can't be removed or added
             * easily in a cross-browser way, however it's valuable to be able to
             * take advantage of React's reconciliation for styling and <title>
             * management. So we just document it and throw in dangerous cases.
             */
            _prodInvariant$18('66', this._tag);
            break;
        }

        this.unmountChildren(safely);
        ReactDOMComponentTree$7.uncacheNode(this);
        EventPluginHub$3.deleteAllListeners(this);
        this._rootNodeID = 0;
        this._domID = 0;
        this._wrapperState = null;

        if ("production" !== 'production') {}
      },

      getPublicInstance: function () {
        return getNode(this);
      }

    };

    _assign$8(ReactDOMComponent$1.prototype, ReactDOMComponent$1.Mixin, ReactMultiChild.Mixin);

    var __moduleExports$90 = ReactDOMComponent$1;

    var _assign$19 = __moduleExports$1;

    var DOMLazyTree$4 = __moduleExports$78;
    var ReactDOMComponentTree$14 = __moduleExports$32;

    var ReactDOMEmptyComponent$1 = function (instantiate) {
      // ReactCompositeComponent uses this:
      this._currentElement = null;
      // ReactDOMComponentTree uses these:
      this._hostNode = null;
      this._hostParent = null;
      this._hostContainerInfo = null;
      this._domID = 0;
    };
    _assign$19(ReactDOMEmptyComponent$1.prototype, {
      mountComponent: function (transaction, hostParent, hostContainerInfo, context) {
        var domID = hostContainerInfo._idCounter++;
        this._domID = domID;
        this._hostParent = hostParent;
        this._hostContainerInfo = hostContainerInfo;

        var nodeValue = ' react-empty: ' + this._domID + ' ';
        if (transaction.useCreateElement) {
          var ownerDocument = hostContainerInfo._ownerDocument;
          var node = ownerDocument.createComment(nodeValue);
          ReactDOMComponentTree$14.precacheNode(this, node);
          return DOMLazyTree$4(node);
        } else {
          if (transaction.renderToStaticMarkup) {
            // Normally we'd insert a comment node, but since this is a situation
            // where React won't take over (static pages), we can simply return
            // nothing.
            return '';
          }
          return '<!--' + nodeValue + '-->';
        }
      },
      receiveComponent: function () {},
      getHostNode: function () {
        return ReactDOMComponentTree$14.getNodeFromInstance(this);
      },
      unmountComponent: function () {
        ReactDOMComponentTree$14.uncacheNode(this);
      }
    });

    var __moduleExports$129 = ReactDOMEmptyComponent$1;

    var _prodInvariant$29 = __moduleExports$4;

    var invariant$34 = __moduleExports$5;

    /**
     * Return the lowest common ancestor of A and B, or null if they are in
     * different trees.
     */
    function getLowestCommonAncestor(instA, instB) {
      !('_hostNode' in instA) ? _prodInvariant$29('33') : void 0;
      !('_hostNode' in instB) ? _prodInvariant$29('33') : void 0;

      var depthA = 0;
      for (var tempA = instA; tempA; tempA = tempA._hostParent) {
        depthA++;
      }
      var depthB = 0;
      for (var tempB = instB; tempB; tempB = tempB._hostParent) {
        depthB++;
      }

      // If A is deeper, crawl up.
      while (depthA - depthB > 0) {
        instA = instA._hostParent;
        depthA--;
      }

      // If B is deeper, crawl up.
      while (depthB - depthA > 0) {
        instB = instB._hostParent;
        depthB--;
      }

      // Walk in lockstep until we find a match.
      var depth = depthA;
      while (depth--) {
        if (instA === instB) {
          return instA;
        }
        instA = instA._hostParent;
        instB = instB._hostParent;
      }
      return null;
    }

    /**
     * Return if A is an ancestor of B.
     */
    function isAncestor(instA, instB) {
      !('_hostNode' in instA) ? _prodInvariant$29('35') : void 0;
      !('_hostNode' in instB) ? _prodInvariant$29('35') : void 0;

      while (instB) {
        if (instB === instA) {
          return true;
        }
        instB = instB._hostParent;
      }
      return false;
    }

    /**
     * Return the parent instance of the passed-in instance.
     */
    function getParentInstance(inst) {
      !('_hostNode' in inst) ? _prodInvariant$29('36') : void 0;

      return inst._hostParent;
    }

    /**
     * Simulates the traversal of a two-phase, capture/bubble event dispatch.
     */
    function traverseTwoPhase(inst, fn, arg) {
      var path = [];
      while (inst) {
        path.push(inst);
        inst = inst._hostParent;
      }
      var i;
      for (i = path.length; i-- > 0;) {
        fn(path[i], false, arg);
      }
      for (i = 0; i < path.length; i++) {
        fn(path[i], true, arg);
      }
    }

    /**
     * Traverses the ID hierarchy and invokes the supplied `cb` on any IDs that
     * should would receive a `mouseEnter` or `mouseLeave` event.
     *
     * Does not invoke the callback on the nearest common ancestor because nothing
     * "entered" or "left" that element.
     */
    function traverseEnterLeave(from, to, fn, argFrom, argTo) {
      var common = from && to ? getLowestCommonAncestor(from, to) : null;
      var pathFrom = [];
      while (from && from !== common) {
        pathFrom.push(from);
        from = from._hostParent;
      }
      var pathTo = [];
      while (to && to !== common) {
        pathTo.push(to);
        to = to._hostParent;
      }
      var i;
      for (i = 0; i < pathFrom.length; i++) {
        fn(pathFrom[i], true, argFrom);
      }
      for (i = pathTo.length; i-- > 0;) {
        fn(pathTo[i], false, argTo);
      }
    }

    var __moduleExports$130 = {
      isAncestor: isAncestor,
      getLowestCommonAncestor: getLowestCommonAncestor,
      getParentInstance: getParentInstance,
      traverseTwoPhase: traverseTwoPhase,
      traverseEnterLeave: traverseEnterLeave
    };

var     _prodInvariant$30 = __moduleExports$4;
var     _assign$20 = __moduleExports$1;
    var DOMChildrenOperations$3 = __moduleExports$77;
    var DOMLazyTree$5 = __moduleExports$78;
    var ReactDOMComponentTree$15 = __moduleExports$32;

    var escapeTextContentForBrowser$4 = __moduleExports$83;
    var invariant$35 = __moduleExports$5;
    /**
     * Text nodes violate a couple assumptions that React makes about components:
     *
     *  - When mounting text into the DOM, adjacent text nodes are merged.
     *  - Text nodes cannot be assigned a React root ID.
     *
     * This component is used to wrap strings between comment nodes so that they
     * can undergo the same reconciliation that is applied to elements.
     *
     * TODO: Investigate representing React components in the DOM with text nodes.
     *
     * @class ReactDOMTextComponent
     * @extends ReactComponent
     * @internal
     */
    var ReactDOMTextComponent$1 = function (text) {
      // TODO: This is really a ReactText (ReactNode), not a ReactElement
      this._currentElement = text;
      this._stringText = '' + text;
      // ReactDOMComponentTree uses these:
      this._hostNode = null;
      this._hostParent = null;

      // Properties
      this._domID = 0;
      this._mountIndex = 0;
      this._closingComment = null;
      this._commentNodes = null;
    };

    _assign$20(ReactDOMTextComponent$1.prototype, {

      /**
       * Creates the markup for this text node. This node is not intended to have
       * any features besides containing text content.
       *
       * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
       * @return {string} Markup for this text node.
       * @internal
       */
      mountComponent: function (transaction, hostParent, hostContainerInfo, context) {
        if ("production" !== 'production') {}

        var domID = hostContainerInfo._idCounter++;
        var openingValue = ' react-text: ' + domID + ' ';
        var closingValue = ' /react-text ';
        this._domID = domID;
        this._hostParent = hostParent;
        if (transaction.useCreateElement) {
          var ownerDocument = hostContainerInfo._ownerDocument;
          var openingComment = ownerDocument.createComment(openingValue);
          var closingComment = ownerDocument.createComment(closingValue);
          var lazyTree = DOMLazyTree$5(ownerDocument.createDocumentFragment());
          DOMLazyTree$5.queueChild(lazyTree, DOMLazyTree$5(openingComment));
          if (this._stringText) {
            DOMLazyTree$5.queueChild(lazyTree, DOMLazyTree$5(ownerDocument.createTextNode(this._stringText)));
          }
          DOMLazyTree$5.queueChild(lazyTree, DOMLazyTree$5(closingComment));
          ReactDOMComponentTree$15.precacheNode(this, openingComment);
          this._closingComment = closingComment;
          return lazyTree;
        } else {
          var escapedText = escapeTextContentForBrowser$4(this._stringText);

          if (transaction.renderToStaticMarkup) {
            // Normally we'd wrap this between comment nodes for the reasons stated
            // above, but since this is a situation where React won't take over
            // (static pages), we can simply return the text as it is.
            return escapedText;
          }

          return '<!--' + openingValue + '-->' + escapedText + '<!--' + closingValue + '-->';
        }
      },

      /**
       * Updates this component by updating the text content.
       *
       * @param {ReactText} nextText The next text content
       * @param {ReactReconcileTransaction} transaction
       * @internal
       */
      receiveComponent: function (nextText, transaction) {
        if (nextText !== this._currentElement) {
          this._currentElement = nextText;
          var nextStringText = '' + nextText;
          if (nextStringText !== this._stringText) {
            // TODO: Save this as pending props and use performUpdateIfNecessary
            // and/or updateComponent to do the actual update for consistency with
            // other component types?
            this._stringText = nextStringText;
            var commentNodes = this.getHostNode();
            DOMChildrenOperations$3.replaceDelimitedText(commentNodes[0], commentNodes[1], nextStringText);
          }
        }
      },

      getHostNode: function () {
        var hostNode = this._commentNodes;
        if (hostNode) {
          return hostNode;
        }
        if (!this._closingComment) {
          var openingComment = ReactDOMComponentTree$15.getNodeFromInstance(this);
          var node = openingComment.nextSibling;
          while (true) {
            !(node != null) ? _prodInvariant$30('67', this._domID) : void 0;
            if (node.nodeType === 8 && node.nodeValue === ' /react-text ') {
              this._closingComment = node;
              break;
            }
            node = node.nextSibling;
          }
        }
        hostNode = [this._hostNode, this._closingComment];
        this._commentNodes = hostNode;
        return hostNode;
      },

      unmountComponent: function () {
        this._closingComment = null;
        this._commentNodes = null;
        ReactDOMComponentTree$15.uncacheNode(this);
      }

    });

    var __moduleExports$131 = ReactDOMTextComponent$1;

    var _assign$21 = __moduleExports$1;

    var ReactUpdates$7 = __moduleExports$52;
    var Transaction$4 = __moduleExports$65;

    var emptyFunction$9 = __moduleExports$9;

    var RESET_BATCHED_UPDATES = {
      initialize: emptyFunction$9,
      close: function () {
        ReactDefaultBatchingStrategy$1.isBatchingUpdates = false;
      }
    };

    var FLUSH_BATCHED_UPDATES = {
      initialize: emptyFunction$9,
      close: ReactUpdates$7.flushBatchedUpdates.bind(ReactUpdates$7)
    };

    var TRANSACTION_WRAPPERS$2 = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];

    function ReactDefaultBatchingStrategyTransaction() {
      this.reinitializeTransaction();
    }

    _assign$21(ReactDefaultBatchingStrategyTransaction.prototype, Transaction$4.Mixin, {
      getTransactionWrappers: function () {
        return TRANSACTION_WRAPPERS$2;
      }
    });

    var transaction = new ReactDefaultBatchingStrategyTransaction();

    var ReactDefaultBatchingStrategy$1 = {
      isBatchingUpdates: false,

      /**
       * Call the provided function in a context within which calls to `setState`
       * and friends are batched such that components aren't updated unnecessarily.
       */
      batchedUpdates: function (callback, a, b, c, d, e) {
        var alreadyBatchingUpdates = ReactDefaultBatchingStrategy$1.isBatchingUpdates;

        ReactDefaultBatchingStrategy$1.isBatchingUpdates = true;

        // The code is written this way to avoid extra allocations
        if (alreadyBatchingUpdates) {
          callback(a, b, c, d, e);
        } else {
          transaction.perform(callback, null, a, b, c, d, e);
        }
      }
    };

    var __moduleExports$132 = ReactDefaultBatchingStrategy$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * @typechecks
     */

    var emptyFunction$10 = __moduleExports$9;

    /**
     * Upstream version of event listener. Does not take into account specific
     * nature of platform.
     */
    var EventListener$1 = {
      /**
       * Listen to DOM events during the bubble phase.
       *
       * @param {DOMEventTarget} target DOM element to register listener on.
       * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
       * @param {function} callback Callback function.
       * @return {object} Object with a `remove` method.
       */
      listen: function listen(target, eventType, callback) {
        if (target.addEventListener) {
          target.addEventListener(eventType, callback, false);
          return {
            remove: function remove() {
              target.removeEventListener(eventType, callback, false);
            }
          };
        } else if (target.attachEvent) {
          target.attachEvent('on' + eventType, callback);
          return {
            remove: function remove() {
              target.detachEvent('on' + eventType, callback);
            }
          };
        }
      },

      /**
       * Listen to DOM events during the capture phase.
       *
       * @param {DOMEventTarget} target DOM element to register listener on.
       * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
       * @param {function} callback Callback function.
       * @return {object} Object with a `remove` method.
       */
      capture: function capture(target, eventType, callback) {
        if (target.addEventListener) {
          target.addEventListener(eventType, callback, true);
          return {
            remove: function remove() {
              target.removeEventListener(eventType, callback, true);
            }
          };
        } else {
          if ("production" !== 'production') {}
          return {
            remove: emptyFunction$10
          };
        }
      },

      registerDefault: function registerDefault() {}
    };

    var __moduleExports$134 = EventListener$1;

    /**
     * Gets the scroll position of the supplied element or window.
     *
     * The return values are unbounded, unlike `getScrollPosition`. This means they
     * may be negative or exceed the element boundaries (which is possible using
     * inertial scrolling).
     *
     * @param {DOMWindow|DOMElement} scrollable
     * @return {object} Map with `x` and `y` keys.
     */

    function getUnboundedScrollPosition$1(scrollable) {
      if (scrollable === window) {
        return {
          x: window.pageXOffset || document.documentElement.scrollLeft,
          y: window.pageYOffset || document.documentElement.scrollTop
        };
      }
      return {
        x: scrollable.scrollLeft,
        y: scrollable.scrollTop
      };
    }

    var __moduleExports$135 = getUnboundedScrollPosition$1;

    var _assign$22 = __moduleExports$1;

    var EventListener = __moduleExports$134;
    var ExecutionEnvironment$14 = __moduleExports$45;
    var PooledClass$7 = __moduleExports$3;
    var ReactDOMComponentTree$16 = __moduleExports$32;
    var ReactUpdates$8 = __moduleExports$52;

    var getEventTarget$3 = __moduleExports$66;
    var getUnboundedScrollPosition = __moduleExports$135;

    /**
     * Find the deepest React component completely containing the root of the
     * passed-in instance (for use when entire React trees are nested within each
     * other). If React trees are not nested, returns null.
     */
    function findParent(inst) {
      // TODO: It may be a good idea to cache this to prevent unnecessary DOM
      // traversal, but caching is difficult to do correctly without using a
      // mutation observer to listen for all DOM changes.
      while (inst._hostParent) {
        inst = inst._hostParent;
      }
      var rootNode = ReactDOMComponentTree$16.getNodeFromInstance(inst);
      var container = rootNode.parentNode;
      return ReactDOMComponentTree$16.getClosestInstanceFromNode(container);
    }

    // Used to store ancestor hierarchy in top level callback
    function TopLevelCallbackBookKeeping(topLevelType, nativeEvent) {
      this.topLevelType = topLevelType;
      this.nativeEvent = nativeEvent;
      this.ancestors = [];
    }
    _assign$22(TopLevelCallbackBookKeeping.prototype, {
      destructor: function () {
        this.topLevelType = null;
        this.nativeEvent = null;
        this.ancestors.length = 0;
      }
    });
    PooledClass$7.addPoolingTo(TopLevelCallbackBookKeeping, PooledClass$7.twoArgumentPooler);

    function handleTopLevelImpl(bookKeeping) {
      var nativeEventTarget = getEventTarget$3(bookKeeping.nativeEvent);
      var targetInst = ReactDOMComponentTree$16.getClosestInstanceFromNode(nativeEventTarget);

      // Loop through the hierarchy, in case there's any nested components.
      // It's important that we build the array of ancestors before calling any
      // event handlers, because event handlers can modify the DOM, leading to
      // inconsistencies with ReactMount's node cache. See #1105.
      var ancestor = targetInst;
      do {
        bookKeeping.ancestors.push(ancestor);
        ancestor = ancestor && findParent(ancestor);
      } while (ancestor);

      for (var i = 0; i < bookKeeping.ancestors.length; i++) {
        targetInst = bookKeeping.ancestors[i];
        ReactEventListener$1._handleTopLevel(bookKeeping.topLevelType, targetInst, bookKeeping.nativeEvent, getEventTarget$3(bookKeeping.nativeEvent));
      }
    }

    function scrollValueMonitor(cb) {
      var scrollPosition = getUnboundedScrollPosition(window);
      cb(scrollPosition);
    }

    var ReactEventListener$1 = {
      _enabled: true,
      _handleTopLevel: null,

      WINDOW_HANDLE: ExecutionEnvironment$14.canUseDOM ? window : null,

      setHandleTopLevel: function (handleTopLevel) {
        ReactEventListener$1._handleTopLevel = handleTopLevel;
      },

      setEnabled: function (enabled) {
        ReactEventListener$1._enabled = !!enabled;
      },

      isEnabled: function () {
        return ReactEventListener$1._enabled;
      },

      /**
       * Traps top-level events by using event bubbling.
       *
       * @param {string} topLevelType Record from `EventConstants`.
       * @param {string} handlerBaseName Event name (e.g. "click").
       * @param {object} handle Element on which to attach listener.
       * @return {?object} An object with a remove function which will forcefully
       *                  remove the listener.
       * @internal
       */
      trapBubbledEvent: function (topLevelType, handlerBaseName, handle) {
        var element = handle;
        if (!element) {
          return null;
        }
        return EventListener.listen(element, handlerBaseName, ReactEventListener$1.dispatchEvent.bind(null, topLevelType));
      },

      /**
       * Traps a top-level event by using event capturing.
       *
       * @param {string} topLevelType Record from `EventConstants`.
       * @param {string} handlerBaseName Event name (e.g. "click").
       * @param {object} handle Element on which to attach listener.
       * @return {?object} An object with a remove function which will forcefully
       *                  remove the listener.
       * @internal
       */
      trapCapturedEvent: function (topLevelType, handlerBaseName, handle) {
        var element = handle;
        if (!element) {
          return null;
        }
        return EventListener.capture(element, handlerBaseName, ReactEventListener$1.dispatchEvent.bind(null, topLevelType));
      },

      monitorScrollValue: function (refresh) {
        var callback = scrollValueMonitor.bind(null, refresh);
        EventListener.listen(window, 'scroll', callback);
      },

      dispatchEvent: function (topLevelType, nativeEvent) {
        if (!ReactEventListener$1._enabled) {
          return;
        }

        var bookKeeping = TopLevelCallbackBookKeeping.getPooled(topLevelType, nativeEvent);
        try {
          // Event queue being processed in the same cycle allows
          // `preventDefault`.
          ReactUpdates$8.batchedUpdates(handleTopLevelImpl, bookKeeping);
        } finally {
          TopLevelCallbackBookKeeping.release(bookKeeping);
        }
      }
    };

    var __moduleExports$133 = ReactEventListener$1;

    var DOMProperty$5 = __moduleExports$33;
    var EventPluginHub$5 = __moduleExports$39;
    var EventPluginUtils$3 = __moduleExports$41;
    var ReactComponentEnvironment$3 = __moduleExports$114;
    var ReactClass$2 = __moduleExports$18;
    var ReactEmptyComponent$2 = __moduleExports$122;
    var ReactBrowserEventEmitter$2 = __moduleExports$103;
    var ReactHostComponent$2 = __moduleExports$123;
    var ReactUpdates$9 = __moduleExports$52;

    var ReactInjection$1 = {
      Component: ReactComponentEnvironment$3.injection,
      Class: ReactClass$2.injection,
      DOMProperty: DOMProperty$5.injection,
      EmptyComponent: ReactEmptyComponent$2.injection,
      EventPluginHub: EventPluginHub$5.injection,
      EventPluginUtils: EventPluginUtils$3.injection,
      EventEmitter: ReactBrowserEventEmitter$2.injection,
      HostComponent: ReactHostComponent$2.injection,
      Updates: ReactUpdates$9.injection
    };

    var __moduleExports$136 = ReactInjection$1;

    /**
     * Given any node return the first leaf node without children.
     *
     * @param {DOMElement|DOMTextNode} node
     * @return {DOMElement|DOMTextNode}
     */

    function getLeafNode(node) {
      while (node && node.firstChild) {
        node = node.firstChild;
      }
      return node;
    }

    /**
     * Get the next sibling within a container. This will walk up the
     * DOM if a node's siblings have been exhausted.
     *
     * @param {DOMElement|DOMTextNode} node
     * @return {?DOMElement|DOMTextNode}
     */
    function getSiblingNode(node) {
      while (node) {
        if (node.nextSibling) {
          return node.nextSibling;
        }
        node = node.parentNode;
      }
    }

    /**
     * Get object describing the nodes which contain characters at offset.
     *
     * @param {DOMElement|DOMTextNode} root
     * @param {number} offset
     * @return {?object}
     */
    function getNodeForCharacterOffset$1(root, offset) {
      var node = getLeafNode(root);
      var nodeStart = 0;
      var nodeEnd = 0;

      while (node) {
        if (node.nodeType === 3) {
          nodeEnd = nodeStart + node.textContent.length;

          if (nodeStart <= offset && nodeEnd >= offset) {
            return {
              node: node,
              offset: offset - nodeStart
            };
          }

          nodeStart = nodeEnd;
        }

        node = getLeafNode(getSiblingNode(node));
      }
    }

    var __moduleExports$140 = getNodeForCharacterOffset$1;

    var ExecutionEnvironment$15 = __moduleExports$45;

    var getNodeForCharacterOffset = __moduleExports$140;
    var getTextContentAccessor$2 = __moduleExports$47;

    /**
     * While `isCollapsed` is available on the Selection object and `collapsed`
     * is available on the Range object, IE11 sometimes gets them wrong.
     * If the anchor/focus nodes and offsets are the same, the range is collapsed.
     */
    function isCollapsed(anchorNode, anchorOffset, focusNode, focusOffset) {
      return anchorNode === focusNode && anchorOffset === focusOffset;
    }

    /**
     * Get the appropriate anchor and focus node/offset pairs for IE.
     *
     * The catch here is that IE's selection API doesn't provide information
     * about whether the selection is forward or backward, so we have to
     * behave as though it's always forward.
     *
     * IE text differs from modern selection in that it behaves as though
     * block elements end with a new line. This means character offsets will
     * differ between the two APIs.
     *
     * @param {DOMElement} node
     * @return {object}
     */
    function getIEOffsets(node) {
      var selection = document.selection;
      var selectedRange = selection.createRange();
      var selectedLength = selectedRange.text.length;

      // Duplicate selection so we can move range without breaking user selection.
      var fromStart = selectedRange.duplicate();
      fromStart.moveToElementText(node);
      fromStart.setEndPoint('EndToStart', selectedRange);

      var startOffset = fromStart.text.length;
      var endOffset = startOffset + selectedLength;

      return {
        start: startOffset,
        end: endOffset
      };
    }

    /**
     * @param {DOMElement} node
     * @return {?object}
     */
    function getModernOffsets(node) {
      var selection = window.getSelection && window.getSelection();

      if (!selection || selection.rangeCount === 0) {
        return null;
      }

      var anchorNode = selection.anchorNode;
      var anchorOffset = selection.anchorOffset;
      var focusNode = selection.focusNode;
      var focusOffset = selection.focusOffset;

      var currentRange = selection.getRangeAt(0);

      // In Firefox, range.startContainer and range.endContainer can be "anonymous
      // divs", e.g. the up/down buttons on an <input type="number">. Anonymous
      // divs do not seem to expose properties, triggering a "Permission denied
      // error" if any of its properties are accessed. The only seemingly possible
      // way to avoid erroring is to access a property that typically works for
      // non-anonymous divs and catch any error that may otherwise arise. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=208427
      try {
        /* eslint-disable no-unused-expressions */
        currentRange.startContainer.nodeType;
        currentRange.endContainer.nodeType;
        /* eslint-enable no-unused-expressions */
      } catch (e) {
        return null;
      }

      // If the node and offset values are the same, the selection is collapsed.
      // `Selection.isCollapsed` is available natively, but IE sometimes gets
      // this value wrong.
      var isSelectionCollapsed = isCollapsed(selection.anchorNode, selection.anchorOffset, selection.focusNode, selection.focusOffset);

      var rangeLength = isSelectionCollapsed ? 0 : currentRange.toString().length;

      var tempRange = currentRange.cloneRange();
      tempRange.selectNodeContents(node);
      tempRange.setEnd(currentRange.startContainer, currentRange.startOffset);

      var isTempRangeCollapsed = isCollapsed(tempRange.startContainer, tempRange.startOffset, tempRange.endContainer, tempRange.endOffset);

      var start = isTempRangeCollapsed ? 0 : tempRange.toString().length;
      var end = start + rangeLength;

      // Detect whether the selection is backward.
      var detectionRange = document.createRange();
      detectionRange.setStart(anchorNode, anchorOffset);
      detectionRange.setEnd(focusNode, focusOffset);
      var isBackward = detectionRange.collapsed;

      return {
        start: isBackward ? end : start,
        end: isBackward ? start : end
      };
    }

    /**
     * @param {DOMElement|DOMTextNode} node
     * @param {object} offsets
     */
    function setIEOffsets(node, offsets) {
      var range = document.selection.createRange().duplicate();
      var start, end;

      if (offsets.end === undefined) {
        start = offsets.start;
        end = start;
      } else if (offsets.start > offsets.end) {
        start = offsets.end;
        end = offsets.start;
      } else {
        start = offsets.start;
        end = offsets.end;
      }

      range.moveToElementText(node);
      range.moveStart('character', start);
      range.setEndPoint('EndToStart', range);
      range.moveEnd('character', end - start);
      range.select();
    }

    /**
     * In modern non-IE browsers, we can support both forward and backward
     * selections.
     *
     * Note: IE10+ supports the Selection object, but it does not support
     * the `extend` method, which means that even in modern IE, it's not possible
     * to programmatically create a backward selection. Thus, for all IE
     * versions, we use the old IE API to create our selections.
     *
     * @param {DOMElement|DOMTextNode} node
     * @param {object} offsets
     */
    function setModernOffsets(node, offsets) {
      if (!window.getSelection) {
        return;
      }

      var selection = window.getSelection();
      var length = node[getTextContentAccessor$2()].length;
      var start = Math.min(offsets.start, length);
      var end = offsets.end === undefined ? start : Math.min(offsets.end, length);

      // IE 11 uses modern selection, but doesn't support the extend method.
      // Flip backward selections, so we can set with a single range.
      if (!selection.extend && start > end) {
        var temp = end;
        end = start;
        start = temp;
      }

      var startMarker = getNodeForCharacterOffset(node, start);
      var endMarker = getNodeForCharacterOffset(node, end);

      if (startMarker && endMarker) {
        var range = document.createRange();
        range.setStart(startMarker.node, startMarker.offset);
        selection.removeAllRanges();

        if (start > end) {
          selection.addRange(range);
          selection.extend(endMarker.node, endMarker.offset);
        } else {
          range.setEnd(endMarker.node, endMarker.offset);
          selection.addRange(range);
        }
      }
    }

    var useIEOffsets = ExecutionEnvironment$15.canUseDOM && 'selection' in document && !('getSelection' in window);

    var ReactDOMSelection$1 = {
      /**
       * @param {DOMElement} node
       */
      getOffsets: useIEOffsets ? getIEOffsets : getModernOffsets,

      /**
       * @param {DOMElement|DOMTextNode} node
       * @param {object} offsets
       */
      setOffsets: useIEOffsets ? setIEOffsets : setModernOffsets
    };

    var __moduleExports$139 = ReactDOMSelection$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @typechecks
     */

    /**
     * @param {*} object The object to check.
     * @return {boolean} Whether or not the object is a DOM node.
     */
    function isNode$2(object) {
      return !!(object && (typeof Node === 'function' ? object instanceof Node : typeof object === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string'));
    }

    var __moduleExports$143 = isNode$2;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @typechecks
     */

    var isNode$1 = __moduleExports$143;

    /**
     * @param {*} object The object to check.
     * @return {boolean} Whether or not the object is a DOM text node.
     */
    function isTextNode$1(object) {
      return isNode$1(object) && object.nodeType == 3;
    }

    var __moduleExports$142 = isTextNode$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * 
     */

    var isTextNode = __moduleExports$142;

    /*eslint-disable no-bitwise */

    /**
     * Checks if a given DOM node contains or is another DOM node.
     */
    function containsNode$1(outerNode, innerNode) {
      if (!outerNode || !innerNode) {
        return false;
      } else if (outerNode === innerNode) {
        return true;
      } else if (isTextNode(outerNode)) {
        return false;
      } else if (isTextNode(innerNode)) {
        return containsNode$1(outerNode, innerNode.parentNode);
      } else if ('contains' in outerNode) {
        return outerNode.contains(innerNode);
      } else if (outerNode.compareDocumentPosition) {
        return !!(outerNode.compareDocumentPosition(innerNode) & 16);
      } else {
        return false;
      }
    }

    var __moduleExports$141 = containsNode$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @typechecks
     */

    /* eslint-disable fb-www/typeof-undefined */

    /**
     * Same as document.activeElement but wraps in a try-catch block. In IE it is
     * not safe to call document.activeElement if there is nothing focused.
     *
     * The activeElement will be null only if the document or document body is not
     * yet defined.
     */
    function getActiveElement$1() /*?DOMElement*/{
      if (typeof document === 'undefined') {
        return null;
      }
      try {
        return document.activeElement || document.body;
      } catch (e) {
        return document.body;
      }
    }

    var __moduleExports$144 = getActiveElement$1;

    var ReactDOMSelection = __moduleExports$139;

    var containsNode = __moduleExports$141;
    var focusNode$2 = __moduleExports$92;
    var getActiveElement = __moduleExports$144;

    function isInDocument(node) {
      return containsNode(document.documentElement, node);
    }

    /**
     * @ReactInputSelection: React input selection module. Based on Selection.js,
     * but modified to be suitable for react and has a couple of bug fixes (doesn't
     * assume buttons have range selections allowed).
     * Input selection module for React.
     */
    var ReactInputSelection$1 = {

      hasSelectionCapabilities: function (elem) {
        var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
        return nodeName && (nodeName === 'input' && elem.type === 'text' || nodeName === 'textarea' || elem.contentEditable === 'true');
      },

      getSelectionInformation: function () {
        var focusedElem = getActiveElement();
        return {
          focusedElem: focusedElem,
          selectionRange: ReactInputSelection$1.hasSelectionCapabilities(focusedElem) ? ReactInputSelection$1.getSelection(focusedElem) : null
        };
      },

      /**
       * @restoreSelection: If any selection information was potentially lost,
       * restore it. This is useful when performing operations that could remove dom
       * nodes and place them back in, resulting in focus being lost.
       */
      restoreSelection: function (priorSelectionInformation) {
        var curFocusedElem = getActiveElement();
        var priorFocusedElem = priorSelectionInformation.focusedElem;
        var priorSelectionRange = priorSelectionInformation.selectionRange;
        if (curFocusedElem !== priorFocusedElem && isInDocument(priorFocusedElem)) {
          if (ReactInputSelection$1.hasSelectionCapabilities(priorFocusedElem)) {
            ReactInputSelection$1.setSelection(priorFocusedElem, priorSelectionRange);
          }
          focusNode$2(priorFocusedElem);
        }
      },

      /**
       * @getSelection: Gets the selection bounds of a focused textarea, input or
       * contentEditable node.
       * -@input: Look up selection bounds of this input
       * -@return {start: selectionStart, end: selectionEnd}
       */
      getSelection: function (input) {
        var selection;

        if ('selectionStart' in input) {
          // Modern browser with input or textarea.
          selection = {
            start: input.selectionStart,
            end: input.selectionEnd
          };
        } else if (document.selection && input.nodeName && input.nodeName.toLowerCase() === 'input') {
          // IE8 input.
          var range = document.selection.createRange();
          // There can only be one selection per document in IE, so it must
          // be in our element.
          if (range.parentElement() === input) {
            selection = {
              start: -range.moveStart('character', -input.value.length),
              end: -range.moveEnd('character', -input.value.length)
            };
          }
        } else {
          // Content editable or old IE textarea.
          selection = ReactDOMSelection.getOffsets(input);
        }

        return selection || { start: 0, end: 0 };
      },

      /**
       * @setSelection: Sets the selection bounds of a textarea or input and focuses
       * the input.
       * -@input     Set selection bounds of this input or textarea
       * -@offsets   Object of same form that is returned from get*
       */
      setSelection: function (input, offsets) {
        var start = offsets.start;
        var end = offsets.end;
        if (end === undefined) {
          end = start;
        }

        if ('selectionStart' in input) {
          input.selectionStart = start;
          input.selectionEnd = Math.min(end, input.value.length);
        } else if (document.selection && input.nodeName && input.nodeName.toLowerCase() === 'input') {
          var range = input.createTextRange();
          range.collapse(true);
          range.moveStart('character', start);
          range.moveEnd('character', end - start);
          range.select();
        } else {
          ReactDOMSelection.setOffsets(input, offsets);
        }
      }
    };

    var __moduleExports$138 = ReactInputSelection$1;

    var _assign$23 = __moduleExports$1;

    var CallbackQueue$2 = __moduleExports$53;
    var PooledClass$8 = __moduleExports$3;
    var ReactBrowserEventEmitter$3 = __moduleExports$103;
    var ReactInputSelection = __moduleExports$138;
    var Transaction$5 = __moduleExports$65;
    var ReactUpdateQueue$2 = __moduleExports$127;

    /**
     * Ensures that, when possible, the selection range (currently selected text
     * input) is not disturbed by performing the transaction.
     */
    var SELECTION_RESTORATION = {
      /**
       * @return {Selection} Selection information.
       */
      initialize: ReactInputSelection.getSelectionInformation,
      /**
       * @param {Selection} sel Selection information returned from `initialize`.
       */
      close: ReactInputSelection.restoreSelection
    };

    /**
     * Suppresses events (blur/focus) that could be inadvertently dispatched due to
     * high level DOM manipulations (like temporarily removing a text input from the
     * DOM).
     */
    var EVENT_SUPPRESSION = {
      /**
       * @return {boolean} The enabled status of `ReactBrowserEventEmitter` before
       * the reconciliation.
       */
      initialize: function () {
        var currentlyEnabled = ReactBrowserEventEmitter$3.isEnabled();
        ReactBrowserEventEmitter$3.setEnabled(false);
        return currentlyEnabled;
      },

      /**
       * @param {boolean} previouslyEnabled Enabled status of
       *   `ReactBrowserEventEmitter` before the reconciliation occurred. `close`
       *   restores the previous value.
       */
      close: function (previouslyEnabled) {
        ReactBrowserEventEmitter$3.setEnabled(previouslyEnabled);
      }
    };

    /**
     * Provides a queue for collecting `componentDidMount` and
     * `componentDidUpdate` callbacks during the transaction.
     */
    var ON_DOM_READY_QUEUEING = {
      /**
       * Initializes the internal `onDOMReady` queue.
       */
      initialize: function () {
        this.reactMountReady.reset();
      },

      /**
       * After DOM is flushed, invoke all registered `onDOMReady` callbacks.
       */
      close: function () {
        this.reactMountReady.notifyAll();
      }
    };

    /**
     * Executed within the scope of the `Transaction` instance. Consider these as
     * being member methods, but with an implied ordering while being isolated from
     * each other.
     */
    var TRANSACTION_WRAPPERS$3 = [SELECTION_RESTORATION, EVENT_SUPPRESSION, ON_DOM_READY_QUEUEING];

    /**
     * Currently:
     * - The order that these are listed in the transaction is critical:
     * - Suppresses events.
     * - Restores selection range.
     *
     * Future:
     * - Restore document/overflow scroll positions that were unintentionally
     *   modified via DOM insertions above the top viewport boundary.
     * - Implement/integrate with customized constraint based layout system and keep
     *   track of which dimensions must be remeasured.
     *
     * @class ReactReconcileTransaction
     */
    function ReactReconcileTransaction$1(useCreateElement) {
      this.reinitializeTransaction();
      // Only server-side rendering really needs this option (see
      // `ReactServerRendering`), but server-side uses
      // `ReactServerRenderingTransaction` instead. This option is here so that it's
      // accessible and defaults to false when `ReactDOMComponent` and
      // `ReactDOMTextComponent` checks it in `mountComponent`.`
      this.renderToStaticMarkup = false;
      this.reactMountReady = CallbackQueue$2.getPooled(null);
      this.useCreateElement = useCreateElement;
    }

    var Mixin$2 = {
      /**
       * @see Transaction
       * @abstract
       * @final
       * @return {array<object>} List of operation wrap procedures.
       *   TODO: convert to array<TransactionWrapper>
       */
      getTransactionWrappers: function () {
        return TRANSACTION_WRAPPERS$3;
      },

      /**
       * @return {object} The queue to collect `onDOMReady` callbacks with.
       */
      getReactMountReady: function () {
        return this.reactMountReady;
      },

      /**
       * @return {object} The queue to collect React async events.
       */
      getUpdateQueue: function () {
        return ReactUpdateQueue$2;
      },

      /**
       * Save current transaction state -- if the return value from this method is
       * passed to `rollback`, the transaction will be reset to that state.
       */
      checkpoint: function () {
        // reactMountReady is the our only stateful wrapper
        return this.reactMountReady.checkpoint();
      },

      rollback: function (checkpoint) {
        this.reactMountReady.rollback(checkpoint);
      },

      /**
       * `PooledClass` looks for this, and will invoke this before allowing this
       * instance to be reused.
       */
      destructor: function () {
        CallbackQueue$2.release(this.reactMountReady);
        this.reactMountReady = null;
      }
    };

    _assign$23(ReactReconcileTransaction$1.prototype, Transaction$5.Mixin, Mixin$2);

    PooledClass$8.addPoolingTo(ReactReconcileTransaction$1);

    var __moduleExports$137 = ReactReconcileTransaction$1;

    var NS = {
      xlink: 'http://www.w3.org/1999/xlink',
      xml: 'http://www.w3.org/XML/1998/namespace'
    };

    // We use attributes for everything SVG so let's avoid some duplication and run
    // code instead.
    // The following are all specified in the HTML config already so we exclude here.
    // - class (as className)
    // - color
    // - height
    // - id
    // - lang
    // - max
    // - media
    // - method
    // - min
    // - name
    // - style
    // - target
    // - type
    // - width
    var ATTRS = {
      accentHeight: 'accent-height',
      accumulate: 0,
      additive: 0,
      alignmentBaseline: 'alignment-baseline',
      allowReorder: 'allowReorder',
      alphabetic: 0,
      amplitude: 0,
      arabicForm: 'arabic-form',
      ascent: 0,
      attributeName: 'attributeName',
      attributeType: 'attributeType',
      autoReverse: 'autoReverse',
      azimuth: 0,
      baseFrequency: 'baseFrequency',
      baseProfile: 'baseProfile',
      baselineShift: 'baseline-shift',
      bbox: 0,
      begin: 0,
      bias: 0,
      by: 0,
      calcMode: 'calcMode',
      capHeight: 'cap-height',
      clip: 0,
      clipPath: 'clip-path',
      clipRule: 'clip-rule',
      clipPathUnits: 'clipPathUnits',
      colorInterpolation: 'color-interpolation',
      colorInterpolationFilters: 'color-interpolation-filters',
      colorProfile: 'color-profile',
      colorRendering: 'color-rendering',
      contentScriptType: 'contentScriptType',
      contentStyleType: 'contentStyleType',
      cursor: 0,
      cx: 0,
      cy: 0,
      d: 0,
      decelerate: 0,
      descent: 0,
      diffuseConstant: 'diffuseConstant',
      direction: 0,
      display: 0,
      divisor: 0,
      dominantBaseline: 'dominant-baseline',
      dur: 0,
      dx: 0,
      dy: 0,
      edgeMode: 'edgeMode',
      elevation: 0,
      enableBackground: 'enable-background',
      end: 0,
      exponent: 0,
      externalResourcesRequired: 'externalResourcesRequired',
      fill: 0,
      fillOpacity: 'fill-opacity',
      fillRule: 'fill-rule',
      filter: 0,
      filterRes: 'filterRes',
      filterUnits: 'filterUnits',
      floodColor: 'flood-color',
      floodOpacity: 'flood-opacity',
      focusable: 0,
      fontFamily: 'font-family',
      fontSize: 'font-size',
      fontSizeAdjust: 'font-size-adjust',
      fontStretch: 'font-stretch',
      fontStyle: 'font-style',
      fontVariant: 'font-variant',
      fontWeight: 'font-weight',
      format: 0,
      from: 0,
      fx: 0,
      fy: 0,
      g1: 0,
      g2: 0,
      glyphName: 'glyph-name',
      glyphOrientationHorizontal: 'glyph-orientation-horizontal',
      glyphOrientationVertical: 'glyph-orientation-vertical',
      glyphRef: 'glyphRef',
      gradientTransform: 'gradientTransform',
      gradientUnits: 'gradientUnits',
      hanging: 0,
      horizAdvX: 'horiz-adv-x',
      horizOriginX: 'horiz-origin-x',
      ideographic: 0,
      imageRendering: 'image-rendering',
      'in': 0,
      in2: 0,
      intercept: 0,
      k: 0,
      k1: 0,
      k2: 0,
      k3: 0,
      k4: 0,
      kernelMatrix: 'kernelMatrix',
      kernelUnitLength: 'kernelUnitLength',
      kerning: 0,
      keyPoints: 'keyPoints',
      keySplines: 'keySplines',
      keyTimes: 'keyTimes',
      lengthAdjust: 'lengthAdjust',
      letterSpacing: 'letter-spacing',
      lightingColor: 'lighting-color',
      limitingConeAngle: 'limitingConeAngle',
      local: 0,
      markerEnd: 'marker-end',
      markerMid: 'marker-mid',
      markerStart: 'marker-start',
      markerHeight: 'markerHeight',
      markerUnits: 'markerUnits',
      markerWidth: 'markerWidth',
      mask: 0,
      maskContentUnits: 'maskContentUnits',
      maskUnits: 'maskUnits',
      mathematical: 0,
      mode: 0,
      numOctaves: 'numOctaves',
      offset: 0,
      opacity: 0,
      operator: 0,
      order: 0,
      orient: 0,
      orientation: 0,
      origin: 0,
      overflow: 0,
      overlinePosition: 'overline-position',
      overlineThickness: 'overline-thickness',
      paintOrder: 'paint-order',
      panose1: 'panose-1',
      pathLength: 'pathLength',
      patternContentUnits: 'patternContentUnits',
      patternTransform: 'patternTransform',
      patternUnits: 'patternUnits',
      pointerEvents: 'pointer-events',
      points: 0,
      pointsAtX: 'pointsAtX',
      pointsAtY: 'pointsAtY',
      pointsAtZ: 'pointsAtZ',
      preserveAlpha: 'preserveAlpha',
      preserveAspectRatio: 'preserveAspectRatio',
      primitiveUnits: 'primitiveUnits',
      r: 0,
      radius: 0,
      refX: 'refX',
      refY: 'refY',
      renderingIntent: 'rendering-intent',
      repeatCount: 'repeatCount',
      repeatDur: 'repeatDur',
      requiredExtensions: 'requiredExtensions',
      requiredFeatures: 'requiredFeatures',
      restart: 0,
      result: 0,
      rotate: 0,
      rx: 0,
      ry: 0,
      scale: 0,
      seed: 0,
      shapeRendering: 'shape-rendering',
      slope: 0,
      spacing: 0,
      specularConstant: 'specularConstant',
      specularExponent: 'specularExponent',
      speed: 0,
      spreadMethod: 'spreadMethod',
      startOffset: 'startOffset',
      stdDeviation: 'stdDeviation',
      stemh: 0,
      stemv: 0,
      stitchTiles: 'stitchTiles',
      stopColor: 'stop-color',
      stopOpacity: 'stop-opacity',
      strikethroughPosition: 'strikethrough-position',
      strikethroughThickness: 'strikethrough-thickness',
      string: 0,
      stroke: 0,
      strokeDasharray: 'stroke-dasharray',
      strokeDashoffset: 'stroke-dashoffset',
      strokeLinecap: 'stroke-linecap',
      strokeLinejoin: 'stroke-linejoin',
      strokeMiterlimit: 'stroke-miterlimit',
      strokeOpacity: 'stroke-opacity',
      strokeWidth: 'stroke-width',
      surfaceScale: 'surfaceScale',
      systemLanguage: 'systemLanguage',
      tableValues: 'tableValues',
      targetX: 'targetX',
      targetY: 'targetY',
      textAnchor: 'text-anchor',
      textDecoration: 'text-decoration',
      textRendering: 'text-rendering',
      textLength: 'textLength',
      to: 0,
      transform: 0,
      u1: 0,
      u2: 0,
      underlinePosition: 'underline-position',
      underlineThickness: 'underline-thickness',
      unicode: 0,
      unicodeBidi: 'unicode-bidi',
      unicodeRange: 'unicode-range',
      unitsPerEm: 'units-per-em',
      vAlphabetic: 'v-alphabetic',
      vHanging: 'v-hanging',
      vIdeographic: 'v-ideographic',
      vMathematical: 'v-mathematical',
      values: 0,
      vectorEffect: 'vector-effect',
      version: 0,
      vertAdvY: 'vert-adv-y',
      vertOriginX: 'vert-origin-x',
      vertOriginY: 'vert-origin-y',
      viewBox: 'viewBox',
      viewTarget: 'viewTarget',
      visibility: 0,
      widths: 0,
      wordSpacing: 'word-spacing',
      writingMode: 'writing-mode',
      x: 0,
      xHeight: 'x-height',
      x1: 0,
      x2: 0,
      xChannelSelector: 'xChannelSelector',
      xlinkActuate: 'xlink:actuate',
      xlinkArcrole: 'xlink:arcrole',
      xlinkHref: 'xlink:href',
      xlinkRole: 'xlink:role',
      xlinkShow: 'xlink:show',
      xlinkTitle: 'xlink:title',
      xlinkType: 'xlink:type',
      xmlBase: 'xml:base',
      xmlns: 0,
      xmlnsXlink: 'xmlns:xlink',
      xmlLang: 'xml:lang',
      xmlSpace: 'xml:space',
      y: 0,
      y1: 0,
      y2: 0,
      yChannelSelector: 'yChannelSelector',
      z: 0,
      zoomAndPan: 'zoomAndPan'
    };

    var SVGDOMPropertyConfig$1 = {
      Properties: {},
      DOMAttributeNamespaces: {
        xlinkActuate: NS.xlink,
        xlinkArcrole: NS.xlink,
        xlinkHref: NS.xlink,
        xlinkRole: NS.xlink,
        xlinkShow: NS.xlink,
        xlinkTitle: NS.xlink,
        xlinkType: NS.xlink,
        xmlBase: NS.xml,
        xmlLang: NS.xml,
        xmlSpace: NS.xml
      },
      DOMAttributeNames: {}
    };

    Object.keys(ATTRS).forEach(function (key) {
      SVGDOMPropertyConfig$1.Properties[key] = 0;
      if (ATTRS[key]) {
        SVGDOMPropertyConfig$1.DOMAttributeNames[key] = ATTRS[key];
      }
    });

    var __moduleExports$145 = SVGDOMPropertyConfig$1;

    var EventConstants$8 = __moduleExports$37;
    var EventPropagators$4 = __moduleExports$38;
    var ExecutionEnvironment$16 = __moduleExports$45;
    var ReactDOMComponentTree$17 = __moduleExports$32;
    var ReactInputSelection$2 = __moduleExports$138;
    var SyntheticEvent$5 = __moduleExports$49;

    var getActiveElement$2 = __moduleExports$144;
    var isTextInputElement$2 = __moduleExports$68;
    var keyOf$7 = __moduleExports$22;
    var shallowEqual$3 = __moduleExports$120;

    var topLevelTypes$5 = EventConstants$8.topLevelTypes;

    var skipSelectionChangeEvent = ExecutionEnvironment$16.canUseDOM && 'documentMode' in document && document.documentMode <= 11;

    var eventTypes$3 = {
      select: {
        phasedRegistrationNames: {
          bubbled: keyOf$7({ onSelect: null }),
          captured: keyOf$7({ onSelectCapture: null })
        },
        dependencies: [topLevelTypes$5.topBlur, topLevelTypes$5.topContextMenu, topLevelTypes$5.topFocus, topLevelTypes$5.topKeyDown, topLevelTypes$5.topMouseDown, topLevelTypes$5.topMouseUp, topLevelTypes$5.topSelectionChange]
      }
    };

    var activeElement$1 = null;
    var activeElementInst$1 = null;
    var lastSelection = null;
    var mouseDown = false;

    // Track whether a listener exists for this plugin. If none exist, we do
    // not extract events. See #3639.
    var hasListener = false;
    var ON_SELECT_KEY = keyOf$7({ onSelect: null });

    /**
     * Get an object which is a unique representation of the current selection.
     *
     * The return value will not be consistent across nodes or browsers, but
     * two identical selections on the same node will return identical objects.
     *
     * @param {DOMElement} node
     * @return {object}
     */
    function getSelection(node) {
      if ('selectionStart' in node && ReactInputSelection$2.hasSelectionCapabilities(node)) {
        return {
          start: node.selectionStart,
          end: node.selectionEnd
        };
      } else if (window.getSelection) {
        var selection = window.getSelection();
        return {
          anchorNode: selection.anchorNode,
          anchorOffset: selection.anchorOffset,
          focusNode: selection.focusNode,
          focusOffset: selection.focusOffset
        };
      } else if (document.selection) {
        var range = document.selection.createRange();
        return {
          parentElement: range.parentElement(),
          text: range.text,
          top: range.boundingTop,
          left: range.boundingLeft
        };
      }
    }

    /**
     * Poll selection to see whether it's changed.
     *
     * @param {object} nativeEvent
     * @return {?SyntheticEvent}
     */
    function constructSelectEvent(nativeEvent, nativeEventTarget) {
      // Ensure we have the right element, and that the user is not dragging a
      // selection (this matches native `select` event behavior). In HTML5, select
      // fires only on input and textarea thus if there's no focused element we
      // won't dispatch.
      if (mouseDown || activeElement$1 == null || activeElement$1 !== getActiveElement$2()) {
        return null;
      }

      // Only fire when selection has actually changed.
      var currentSelection = getSelection(activeElement$1);
      if (!lastSelection || !shallowEqual$3(lastSelection, currentSelection)) {
        lastSelection = currentSelection;

        var syntheticEvent = SyntheticEvent$5.getPooled(eventTypes$3.select, activeElementInst$1, nativeEvent, nativeEventTarget);

        syntheticEvent.type = 'select';
        syntheticEvent.target = activeElement$1;

        EventPropagators$4.accumulateTwoPhaseDispatches(syntheticEvent);

        return syntheticEvent;
      }

      return null;
    }

    /**
     * This plugin creates an `onSelect` event that normalizes select events
     * across form elements.
     *
     * Supported elements are:
     * - input (see `isTextInputElement`)
     * - textarea
     * - contentEditable
     *
     * This differs from native browser implementations in the following ways:
     * - Fires on contentEditable fields as well as inputs.
     * - Fires for collapsed selection.
     * - Fires after user input.
     */
    var SelectEventPlugin$1 = {

      eventTypes: eventTypes$3,

      extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        if (!hasListener) {
          return null;
        }

        var targetNode = targetInst ? ReactDOMComponentTree$17.getNodeFromInstance(targetInst) : window;

        switch (topLevelType) {
          // Track the input node that has focus.
          case topLevelTypes$5.topFocus:
            if (isTextInputElement$2(targetNode) || targetNode.contentEditable === 'true') {
              activeElement$1 = targetNode;
              activeElementInst$1 = targetInst;
              lastSelection = null;
            }
            break;
          case topLevelTypes$5.topBlur:
            activeElement$1 = null;
            activeElementInst$1 = null;
            lastSelection = null;
            break;

          // Don't fire the event while the user is dragging. This matches the
          // semantics of the native select event.
          case topLevelTypes$5.topMouseDown:
            mouseDown = true;
            break;
          case topLevelTypes$5.topContextMenu:
          case topLevelTypes$5.topMouseUp:
            mouseDown = false;
            return constructSelectEvent(nativeEvent, nativeEventTarget);

          // Chrome and IE fire non-standard event when selection is changed (and
          // sometimes when it hasn't). IE's event fires out of order with respect
          // to key and input events on deletion, so we discard it.
          //
          // Firefox doesn't support selectionchange, so check selection status
          // after each key entry. The selection changes after keydown and before
          // keyup, but we check on keydown as well in the case of holding down a
          // key, when multiple keydown events are fired but only one keyup is.
          // This is also our approach for IE handling, for the reason above.
          case topLevelTypes$5.topSelectionChange:
            if (skipSelectionChangeEvent) {
              break;
            }
          // falls through
          case topLevelTypes$5.topKeyDown:
          case topLevelTypes$5.topKeyUp:
            return constructSelectEvent(nativeEvent, nativeEventTarget);
        }

        return null;
      },

      didPutListener: function (inst, registrationName, listener) {
        if (registrationName === ON_SELECT_KEY) {
          hasListener = true;
        }
      }
    };

    var __moduleExports$146 = SelectEventPlugin$1;

    var SyntheticEvent$7 = __moduleExports$49;

    /**
     * @interface Event
     * @see http://www.w3.org/TR/css3-animations/#AnimationEvent-interface
     * @see https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent
     */
    var AnimationEventInterface = {
      animationName: null,
      elapsedTime: null,
      pseudoElement: null
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticEvent}
     */
    function SyntheticAnimationEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticEvent$7.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticEvent$7.augmentClass(SyntheticAnimationEvent$1, AnimationEventInterface);

    var __moduleExports$148 = SyntheticAnimationEvent$1;

    var SyntheticEvent$8 = __moduleExports$49;

    /**
     * @interface Event
     * @see http://www.w3.org/TR/clipboard-apis/
     */
    var ClipboardEventInterface = {
      clipboardData: function (event) {
        return 'clipboardData' in event ? event.clipboardData : window.clipboardData;
      }
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticUIEvent}
     */
    function SyntheticClipboardEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticEvent$8.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticEvent$8.augmentClass(SyntheticClipboardEvent$1, ClipboardEventInterface);

    var __moduleExports$149 = SyntheticClipboardEvent$1;

    var SyntheticUIEvent$3 = __moduleExports$72;

    /**
     * @interface FocusEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
    var FocusEventInterface = {
      relatedTarget: null
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticUIEvent}
     */
    function SyntheticFocusEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticUIEvent$3.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticUIEvent$3.augmentClass(SyntheticFocusEvent$1, FocusEventInterface);

    var __moduleExports$150 = SyntheticFocusEvent$1;

    /**
     * `charCode` represents the actual "character code" and is safe to use with
     * `String.fromCharCode`. As such, only keys that correspond to printable
     * characters produce a valid `charCode`, the only exception to this is Enter.
     * The Tab-key is considered non-printable and does not have a `charCode`,
     * presumably because it does not produce a tab-character in browsers.
     *
     * @param {object} nativeEvent Native browser event.
     * @return {number} Normalized `charCode` property.
     */

    function getEventCharCode$2(nativeEvent) {
      var charCode;
      var keyCode = nativeEvent.keyCode;

      if ('charCode' in nativeEvent) {
        charCode = nativeEvent.charCode;

        // FF does not set `charCode` for the Enter-key, check against `keyCode`.
        if (charCode === 0 && keyCode === 13) {
          charCode = 13;
        }
      } else {
        // IE8 does not implement `charCode`, but `keyCode` has the correct value.
        charCode = keyCode;
      }

      // Some non-printable keys are reported in `charCode`/`keyCode`, discard them.
      // Must not discard the (non-)printable Enter-key.
      if (charCode >= 32 || charCode === 13) {
        return charCode;
      }

      return 0;
    }

    var __moduleExports$152 = getEventCharCode$2;

    var getEventCharCode$3 = __moduleExports$152;

    /**
     * Normalization of deprecated HTML5 `key` values
     * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
     */
    var normalizeKey = {
      'Esc': 'Escape',
      'Spacebar': ' ',
      'Left': 'ArrowLeft',
      'Up': 'ArrowUp',
      'Right': 'ArrowRight',
      'Down': 'ArrowDown',
      'Del': 'Delete',
      'Win': 'OS',
      'Menu': 'ContextMenu',
      'Apps': 'ContextMenu',
      'Scroll': 'ScrollLock',
      'MozPrintableKey': 'Unidentified'
    };

    /**
     * Translation from legacy `keyCode` to HTML5 `key`
     * Only special keys supported, all others depend on keyboard layout or browser
     * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
     */
    var translateToKey = {
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      45: 'Insert',
      46: 'Delete',
      112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6',
      118: 'F7', 119: 'F8', 120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12',
      144: 'NumLock',
      145: 'ScrollLock',
      224: 'Meta'
    };

    /**
     * @param {object} nativeEvent Native browser event.
     * @return {string} Normalized `key` property.
     */
    function getEventKey$1(nativeEvent) {
      if (nativeEvent.key) {
        // Normalize inconsistent values reported by browsers due to
        // implementations of a working draft specification.

        // FireFox implements `key` but returns `MozPrintableKey` for all
        // printable characters (normalized to `Unidentified`), ignore it.
        var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
        if (key !== 'Unidentified') {
          return key;
        }
      }

      // Browser does not implement `key`, polyfill as much of it as we can.
      if (nativeEvent.type === 'keypress') {
        var charCode = getEventCharCode$3(nativeEvent);

        // The enter-key is technically both printable and non-printable and can
        // thus be captured by `keypress`, no other non-printable key should.
        return charCode === 13 ? 'Enter' : String.fromCharCode(charCode);
      }
      if (nativeEvent.type === 'keydown' || nativeEvent.type === 'keyup') {
        // While user keyboard layout determines the actual meaning of each
        // `keyCode` value, almost all function keys have a universal value.
        return translateToKey[nativeEvent.keyCode] || 'Unidentified';
      }
      return '';
    }

    var __moduleExports$153 = getEventKey$1;

    var SyntheticUIEvent$4 = __moduleExports$72;

    var getEventCharCode$1 = __moduleExports$152;
    var getEventKey = __moduleExports$153;
    var getEventModifierState$2 = __moduleExports$74;

    /**
     * @interface KeyboardEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
    var KeyboardEventInterface = {
      key: getEventKey,
      location: null,
      ctrlKey: null,
      shiftKey: null,
      altKey: null,
      metaKey: null,
      repeat: null,
      locale: null,
      getModifierState: getEventModifierState$2,
      // Legacy Interface
      charCode: function (event) {
        // `charCode` is the result of a KeyPress event and represents the value of
        // the actual printable character.

        // KeyPress is deprecated, but its replacement is not yet final and not
        // implemented in any major browser. Only KeyPress has charCode.
        if (event.type === 'keypress') {
          return getEventCharCode$1(event);
        }
        return 0;
      },
      keyCode: function (event) {
        // `keyCode` is the result of a KeyDown/Up event and represents the value of
        // physical keyboard key.

        // The actual meaning of the value depends on the users' keyboard layout
        // which cannot be detected. Assuming that it is a US keyboard layout
        // provides a surprisingly accurate mapping for US and European users.
        // Due to this, it is left to the user to implement at this time.
        if (event.type === 'keydown' || event.type === 'keyup') {
          return event.keyCode;
        }
        return 0;
      },
      which: function (event) {
        // `which` is an alias for either `keyCode` or `charCode` depending on the
        // type of the event.
        if (event.type === 'keypress') {
          return getEventCharCode$1(event);
        }
        if (event.type === 'keydown' || event.type === 'keyup') {
          return event.keyCode;
        }
        return 0;
      }
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticUIEvent}
     */
    function SyntheticKeyboardEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticUIEvent$4.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticUIEvent$4.augmentClass(SyntheticKeyboardEvent$1, KeyboardEventInterface);

    var __moduleExports$151 = SyntheticKeyboardEvent$1;

    var SyntheticMouseEvent$3 = __moduleExports$71;

    /**
     * @interface DragEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
    var DragEventInterface = {
      dataTransfer: null
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticUIEvent}
     */
    function SyntheticDragEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticMouseEvent$3.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticMouseEvent$3.augmentClass(SyntheticDragEvent$1, DragEventInterface);

    var __moduleExports$154 = SyntheticDragEvent$1;

    var SyntheticUIEvent$5 = __moduleExports$72;

    var getEventModifierState$3 = __moduleExports$74;

    /**
     * @interface TouchEvent
     * @see http://www.w3.org/TR/touch-events/
     */
    var TouchEventInterface = {
      touches: null,
      targetTouches: null,
      changedTouches: null,
      altKey: null,
      metaKey: null,
      ctrlKey: null,
      shiftKey: null,
      getModifierState: getEventModifierState$3
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticUIEvent}
     */
    function SyntheticTouchEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticUIEvent$5.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticUIEvent$5.augmentClass(SyntheticTouchEvent$1, TouchEventInterface);

    var __moduleExports$155 = SyntheticTouchEvent$1;

    var SyntheticEvent$9 = __moduleExports$49;

    /**
     * @interface Event
     * @see http://www.w3.org/TR/2009/WD-css3-transitions-20090320/#transition-events-
     * @see https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent
     */
    var TransitionEventInterface = {
      propertyName: null,
      elapsedTime: null,
      pseudoElement: null
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticEvent}
     */
    function SyntheticTransitionEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticEvent$9.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticEvent$9.augmentClass(SyntheticTransitionEvent$1, TransitionEventInterface);

    var __moduleExports$156 = SyntheticTransitionEvent$1;

    var SyntheticMouseEvent$4 = __moduleExports$71;

    /**
     * @interface WheelEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
    var WheelEventInterface = {
      deltaX: function (event) {
        return 'deltaX' in event ? event.deltaX :
        // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
        'wheelDeltaX' in event ? -event.wheelDeltaX : 0;
      },
      deltaY: function (event) {
        return 'deltaY' in event ? event.deltaY :
        // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
        'wheelDeltaY' in event ? -event.wheelDeltaY :
        // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
        'wheelDelta' in event ? -event.wheelDelta : 0;
      },
      deltaZ: null,

      // Browsers without "deltaMode" is reporting in raw wheel delta where one
      // notch on the scroll is always +/- 120, roughly equivalent to pixels.
      // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
      // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
      deltaMode: null
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticMouseEvent}
     */
    function SyntheticWheelEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticMouseEvent$4.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticMouseEvent$4.augmentClass(SyntheticWheelEvent$1, WheelEventInterface);

    var __moduleExports$157 = SyntheticWheelEvent$1;

    var _prodInvariant$31 = __moduleExports$4;

    var EventConstants$9 = __moduleExports$37;
    var EventListener$2 = __moduleExports$134;
    var EventPropagators$5 = __moduleExports$38;
    var ReactDOMComponentTree$18 = __moduleExports$32;
    var SyntheticAnimationEvent = __moduleExports$148;
    var SyntheticClipboardEvent = __moduleExports$149;
    var SyntheticEvent$6 = __moduleExports$49;
    var SyntheticFocusEvent = __moduleExports$150;
    var SyntheticKeyboardEvent = __moduleExports$151;
    var SyntheticMouseEvent$2 = __moduleExports$71;
    var SyntheticDragEvent = __moduleExports$154;
    var SyntheticTouchEvent = __moduleExports$155;
    var SyntheticTransitionEvent = __moduleExports$156;
    var SyntheticUIEvent$2 = __moduleExports$72;
    var SyntheticWheelEvent = __moduleExports$157;

    var emptyFunction$11 = __moduleExports$9;
    var getEventCharCode = __moduleExports$152;
    var invariant$36 = __moduleExports$5;
    var keyOf$8 = __moduleExports$22;

    var topLevelTypes$6 = EventConstants$9.topLevelTypes;

    var eventTypes$4 = {
      abort: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onAbort: true }),
          captured: keyOf$8({ onAbortCapture: true })
        }
      },
      animationEnd: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onAnimationEnd: true }),
          captured: keyOf$8({ onAnimationEndCapture: true })
        }
      },
      animationIteration: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onAnimationIteration: true }),
          captured: keyOf$8({ onAnimationIterationCapture: true })
        }
      },
      animationStart: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onAnimationStart: true }),
          captured: keyOf$8({ onAnimationStartCapture: true })
        }
      },
      blur: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onBlur: true }),
          captured: keyOf$8({ onBlurCapture: true })
        }
      },
      canPlay: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onCanPlay: true }),
          captured: keyOf$8({ onCanPlayCapture: true })
        }
      },
      canPlayThrough: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onCanPlayThrough: true }),
          captured: keyOf$8({ onCanPlayThroughCapture: true })
        }
      },
      click: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onClick: true }),
          captured: keyOf$8({ onClickCapture: true })
        }
      },
      contextMenu: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onContextMenu: true }),
          captured: keyOf$8({ onContextMenuCapture: true })
        }
      },
      copy: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onCopy: true }),
          captured: keyOf$8({ onCopyCapture: true })
        }
      },
      cut: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onCut: true }),
          captured: keyOf$8({ onCutCapture: true })
        }
      },
      doubleClick: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onDoubleClick: true }),
          captured: keyOf$8({ onDoubleClickCapture: true })
        }
      },
      drag: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onDrag: true }),
          captured: keyOf$8({ onDragCapture: true })
        }
      },
      dragEnd: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onDragEnd: true }),
          captured: keyOf$8({ onDragEndCapture: true })
        }
      },
      dragEnter: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onDragEnter: true }),
          captured: keyOf$8({ onDragEnterCapture: true })
        }
      },
      dragExit: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onDragExit: true }),
          captured: keyOf$8({ onDragExitCapture: true })
        }
      },
      dragLeave: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onDragLeave: true }),
          captured: keyOf$8({ onDragLeaveCapture: true })
        }
      },
      dragOver: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onDragOver: true }),
          captured: keyOf$8({ onDragOverCapture: true })
        }
      },
      dragStart: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onDragStart: true }),
          captured: keyOf$8({ onDragStartCapture: true })
        }
      },
      drop: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onDrop: true }),
          captured: keyOf$8({ onDropCapture: true })
        }
      },
      durationChange: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onDurationChange: true }),
          captured: keyOf$8({ onDurationChangeCapture: true })
        }
      },
      emptied: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onEmptied: true }),
          captured: keyOf$8({ onEmptiedCapture: true })
        }
      },
      encrypted: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onEncrypted: true }),
          captured: keyOf$8({ onEncryptedCapture: true })
        }
      },
      ended: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onEnded: true }),
          captured: keyOf$8({ onEndedCapture: true })
        }
      },
      error: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onError: true }),
          captured: keyOf$8({ onErrorCapture: true })
        }
      },
      focus: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onFocus: true }),
          captured: keyOf$8({ onFocusCapture: true })
        }
      },
      input: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onInput: true }),
          captured: keyOf$8({ onInputCapture: true })
        }
      },
      invalid: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onInvalid: true }),
          captured: keyOf$8({ onInvalidCapture: true })
        }
      },
      keyDown: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onKeyDown: true }),
          captured: keyOf$8({ onKeyDownCapture: true })
        }
      },
      keyPress: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onKeyPress: true }),
          captured: keyOf$8({ onKeyPressCapture: true })
        }
      },
      keyUp: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onKeyUp: true }),
          captured: keyOf$8({ onKeyUpCapture: true })
        }
      },
      load: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onLoad: true }),
          captured: keyOf$8({ onLoadCapture: true })
        }
      },
      loadedData: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onLoadedData: true }),
          captured: keyOf$8({ onLoadedDataCapture: true })
        }
      },
      loadedMetadata: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onLoadedMetadata: true }),
          captured: keyOf$8({ onLoadedMetadataCapture: true })
        }
      },
      loadStart: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onLoadStart: true }),
          captured: keyOf$8({ onLoadStartCapture: true })
        }
      },
      // Note: We do not allow listening to mouseOver events. Instead, use the
      // onMouseEnter/onMouseLeave created by `EnterLeaveEventPlugin`.
      mouseDown: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onMouseDown: true }),
          captured: keyOf$8({ onMouseDownCapture: true })
        }
      },
      mouseMove: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onMouseMove: true }),
          captured: keyOf$8({ onMouseMoveCapture: true })
        }
      },
      mouseOut: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onMouseOut: true }),
          captured: keyOf$8({ onMouseOutCapture: true })
        }
      },
      mouseOver: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onMouseOver: true }),
          captured: keyOf$8({ onMouseOverCapture: true })
        }
      },
      mouseUp: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onMouseUp: true }),
          captured: keyOf$8({ onMouseUpCapture: true })
        }
      },
      paste: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onPaste: true }),
          captured: keyOf$8({ onPasteCapture: true })
        }
      },
      pause: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onPause: true }),
          captured: keyOf$8({ onPauseCapture: true })
        }
      },
      play: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onPlay: true }),
          captured: keyOf$8({ onPlayCapture: true })
        }
      },
      playing: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onPlaying: true }),
          captured: keyOf$8({ onPlayingCapture: true })
        }
      },
      progress: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onProgress: true }),
          captured: keyOf$8({ onProgressCapture: true })
        }
      },
      rateChange: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onRateChange: true }),
          captured: keyOf$8({ onRateChangeCapture: true })
        }
      },
      reset: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onReset: true }),
          captured: keyOf$8({ onResetCapture: true })
        }
      },
      scroll: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onScroll: true }),
          captured: keyOf$8({ onScrollCapture: true })
        }
      },
      seeked: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onSeeked: true }),
          captured: keyOf$8({ onSeekedCapture: true })
        }
      },
      seeking: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onSeeking: true }),
          captured: keyOf$8({ onSeekingCapture: true })
        }
      },
      stalled: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onStalled: true }),
          captured: keyOf$8({ onStalledCapture: true })
        }
      },
      submit: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onSubmit: true }),
          captured: keyOf$8({ onSubmitCapture: true })
        }
      },
      suspend: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onSuspend: true }),
          captured: keyOf$8({ onSuspendCapture: true })
        }
      },
      timeUpdate: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onTimeUpdate: true }),
          captured: keyOf$8({ onTimeUpdateCapture: true })
        }
      },
      touchCancel: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onTouchCancel: true }),
          captured: keyOf$8({ onTouchCancelCapture: true })
        }
      },
      touchEnd: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onTouchEnd: true }),
          captured: keyOf$8({ onTouchEndCapture: true })
        }
      },
      touchMove: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onTouchMove: true }),
          captured: keyOf$8({ onTouchMoveCapture: true })
        }
      },
      touchStart: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onTouchStart: true }),
          captured: keyOf$8({ onTouchStartCapture: true })
        }
      },
      transitionEnd: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onTransitionEnd: true }),
          captured: keyOf$8({ onTransitionEndCapture: true })
        }
      },
      volumeChange: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onVolumeChange: true }),
          captured: keyOf$8({ onVolumeChangeCapture: true })
        }
      },
      waiting: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onWaiting: true }),
          captured: keyOf$8({ onWaitingCapture: true })
        }
      },
      wheel: {
        phasedRegistrationNames: {
          bubbled: keyOf$8({ onWheel: true }),
          captured: keyOf$8({ onWheelCapture: true })
        }
      }
    };

    var topLevelEventsToDispatchConfig = {
      topAbort: eventTypes$4.abort,
      topAnimationEnd: eventTypes$4.animationEnd,
      topAnimationIteration: eventTypes$4.animationIteration,
      topAnimationStart: eventTypes$4.animationStart,
      topBlur: eventTypes$4.blur,
      topCanPlay: eventTypes$4.canPlay,
      topCanPlayThrough: eventTypes$4.canPlayThrough,
      topClick: eventTypes$4.click,
      topContextMenu: eventTypes$4.contextMenu,
      topCopy: eventTypes$4.copy,
      topCut: eventTypes$4.cut,
      topDoubleClick: eventTypes$4.doubleClick,
      topDrag: eventTypes$4.drag,
      topDragEnd: eventTypes$4.dragEnd,
      topDragEnter: eventTypes$4.dragEnter,
      topDragExit: eventTypes$4.dragExit,
      topDragLeave: eventTypes$4.dragLeave,
      topDragOver: eventTypes$4.dragOver,
      topDragStart: eventTypes$4.dragStart,
      topDrop: eventTypes$4.drop,
      topDurationChange: eventTypes$4.durationChange,
      topEmptied: eventTypes$4.emptied,
      topEncrypted: eventTypes$4.encrypted,
      topEnded: eventTypes$4.ended,
      topError: eventTypes$4.error,
      topFocus: eventTypes$4.focus,
      topInput: eventTypes$4.input,
      topInvalid: eventTypes$4.invalid,
      topKeyDown: eventTypes$4.keyDown,
      topKeyPress: eventTypes$4.keyPress,
      topKeyUp: eventTypes$4.keyUp,
      topLoad: eventTypes$4.load,
      topLoadedData: eventTypes$4.loadedData,
      topLoadedMetadata: eventTypes$4.loadedMetadata,
      topLoadStart: eventTypes$4.loadStart,
      topMouseDown: eventTypes$4.mouseDown,
      topMouseMove: eventTypes$4.mouseMove,
      topMouseOut: eventTypes$4.mouseOut,
      topMouseOver: eventTypes$4.mouseOver,
      topMouseUp: eventTypes$4.mouseUp,
      topPaste: eventTypes$4.paste,
      topPause: eventTypes$4.pause,
      topPlay: eventTypes$4.play,
      topPlaying: eventTypes$4.playing,
      topProgress: eventTypes$4.progress,
      topRateChange: eventTypes$4.rateChange,
      topReset: eventTypes$4.reset,
      topScroll: eventTypes$4.scroll,
      topSeeked: eventTypes$4.seeked,
      topSeeking: eventTypes$4.seeking,
      topStalled: eventTypes$4.stalled,
      topSubmit: eventTypes$4.submit,
      topSuspend: eventTypes$4.suspend,
      topTimeUpdate: eventTypes$4.timeUpdate,
      topTouchCancel: eventTypes$4.touchCancel,
      topTouchEnd: eventTypes$4.touchEnd,
      topTouchMove: eventTypes$4.touchMove,
      topTouchStart: eventTypes$4.touchStart,
      topTransitionEnd: eventTypes$4.transitionEnd,
      topVolumeChange: eventTypes$4.volumeChange,
      topWaiting: eventTypes$4.waiting,
      topWheel: eventTypes$4.wheel
    };

    for (var type in topLevelEventsToDispatchConfig) {
      topLevelEventsToDispatchConfig[type].dependencies = [type];
    }

    var ON_CLICK_KEY = keyOf$8({ onClick: null });
    var onClickListeners = {};

    function getDictionaryKey$1(inst) {
      // Prevents V8 performance issue:
      // https://github.com/facebook/react/pull/7232
      return '.' + inst._rootNodeID;
    }

    var SimpleEventPlugin$1 = {

      eventTypes: eventTypes$4,

      extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var dispatchConfig = topLevelEventsToDispatchConfig[topLevelType];
        if (!dispatchConfig) {
          return null;
        }
        var EventConstructor;
        switch (topLevelType) {
          case topLevelTypes$6.topAbort:
          case topLevelTypes$6.topCanPlay:
          case topLevelTypes$6.topCanPlayThrough:
          case topLevelTypes$6.topDurationChange:
          case topLevelTypes$6.topEmptied:
          case topLevelTypes$6.topEncrypted:
          case topLevelTypes$6.topEnded:
          case topLevelTypes$6.topError:
          case topLevelTypes$6.topInput:
          case topLevelTypes$6.topInvalid:
          case topLevelTypes$6.topLoad:
          case topLevelTypes$6.topLoadedData:
          case topLevelTypes$6.topLoadedMetadata:
          case topLevelTypes$6.topLoadStart:
          case topLevelTypes$6.topPause:
          case topLevelTypes$6.topPlay:
          case topLevelTypes$6.topPlaying:
          case topLevelTypes$6.topProgress:
          case topLevelTypes$6.topRateChange:
          case topLevelTypes$6.topReset:
          case topLevelTypes$6.topSeeked:
          case topLevelTypes$6.topSeeking:
          case topLevelTypes$6.topStalled:
          case topLevelTypes$6.topSubmit:
          case topLevelTypes$6.topSuspend:
          case topLevelTypes$6.topTimeUpdate:
          case topLevelTypes$6.topVolumeChange:
          case topLevelTypes$6.topWaiting:
            // HTML Events
            // @see http://www.w3.org/TR/html5/index.html#events-0
            EventConstructor = SyntheticEvent$6;
            break;
          case topLevelTypes$6.topKeyPress:
            // Firefox creates a keypress event for function keys too. This removes
            // the unwanted keypress events. Enter is however both printable and
            // non-printable. One would expect Tab to be as well (but it isn't).
            if (getEventCharCode(nativeEvent) === 0) {
              return null;
            }
          /* falls through */
          case topLevelTypes$6.topKeyDown:
          case topLevelTypes$6.topKeyUp:
            EventConstructor = SyntheticKeyboardEvent;
            break;
          case topLevelTypes$6.topBlur:
          case topLevelTypes$6.topFocus:
            EventConstructor = SyntheticFocusEvent;
            break;
          case topLevelTypes$6.topClick:
            // Firefox creates a click event on right mouse clicks. This removes the
            // unwanted click events.
            if (nativeEvent.button === 2) {
              return null;
            }
          /* falls through */
          case topLevelTypes$6.topContextMenu:
          case topLevelTypes$6.topDoubleClick:
          case topLevelTypes$6.topMouseDown:
          case topLevelTypes$6.topMouseMove:
          case topLevelTypes$6.topMouseOut:
          case topLevelTypes$6.topMouseOver:
          case topLevelTypes$6.topMouseUp:
            EventConstructor = SyntheticMouseEvent$2;
            break;
          case topLevelTypes$6.topDrag:
          case topLevelTypes$6.topDragEnd:
          case topLevelTypes$6.topDragEnter:
          case topLevelTypes$6.topDragExit:
          case topLevelTypes$6.topDragLeave:
          case topLevelTypes$6.topDragOver:
          case topLevelTypes$6.topDragStart:
          case topLevelTypes$6.topDrop:
            EventConstructor = SyntheticDragEvent;
            break;
          case topLevelTypes$6.topTouchCancel:
          case topLevelTypes$6.topTouchEnd:
          case topLevelTypes$6.topTouchMove:
          case topLevelTypes$6.topTouchStart:
            EventConstructor = SyntheticTouchEvent;
            break;
          case topLevelTypes$6.topAnimationEnd:
          case topLevelTypes$6.topAnimationIteration:
          case topLevelTypes$6.topAnimationStart:
            EventConstructor = SyntheticAnimationEvent;
            break;
          case topLevelTypes$6.topTransitionEnd:
            EventConstructor = SyntheticTransitionEvent;
            break;
          case topLevelTypes$6.topScroll:
            EventConstructor = SyntheticUIEvent$2;
            break;
          case topLevelTypes$6.topWheel:
            EventConstructor = SyntheticWheelEvent;
            break;
          case topLevelTypes$6.topCopy:
          case topLevelTypes$6.topCut:
          case topLevelTypes$6.topPaste:
            EventConstructor = SyntheticClipboardEvent;
            break;
        }
        !EventConstructor ? _prodInvariant$31('86', topLevelType) : void 0;
        var event = EventConstructor.getPooled(dispatchConfig, targetInst, nativeEvent, nativeEventTarget);
        EventPropagators$5.accumulateTwoPhaseDispatches(event);
        return event;
      },

      didPutListener: function (inst, registrationName, listener) {
        // Mobile Safari does not fire properly bubble click events on
        // non-interactive elements, which means delegated click listeners do not
        // fire. The workaround for this bug involves attaching an empty click
        // listener on the target node.
        if (registrationName === ON_CLICK_KEY) {
          var key = getDictionaryKey$1(inst);
          var node = ReactDOMComponentTree$18.getNodeFromInstance(inst);
          if (!onClickListeners[key]) {
            onClickListeners[key] = EventListener$2.listen(node, 'click', emptyFunction$11);
          }
        }
      },

      willDeleteListener: function (inst, registrationName) {
        if (registrationName === ON_CLICK_KEY) {
          var key = getDictionaryKey$1(inst);
          onClickListeners[key].remove();
          delete onClickListeners[key];
        }
      }

    };

    var __moduleExports$147 = SimpleEventPlugin$1;

    var BeforeInputEventPlugin = __moduleExports$36;
    var ChangeEventPlugin = __moduleExports$51;
    var DefaultEventPluginOrder = __moduleExports$69;
    var EnterLeaveEventPlugin = __moduleExports$70;
    var HTMLDOMPropertyConfig = __moduleExports$75;
    var ReactComponentBrowserEnvironment = __moduleExports$76;
    var ReactDOMComponent = __moduleExports$90;
    var ReactDOMComponentTree$2 = __moduleExports$32;
    var ReactDOMEmptyComponent = __moduleExports$129;
    var ReactDOMTreeTraversal = __moduleExports$130;
    var ReactDOMTextComponent = __moduleExports$131;
    var ReactDefaultBatchingStrategy = __moduleExports$132;
    var ReactEventListener = __moduleExports$133;
    var ReactInjection = __moduleExports$136;
    var ReactReconcileTransaction = __moduleExports$137;
    var SVGDOMPropertyConfig = __moduleExports$145;
    var SelectEventPlugin = __moduleExports$146;
    var SimpleEventPlugin = __moduleExports$147;

    var alreadyInjected = false;

    function inject() {
      if (alreadyInjected) {
        // TODO: This is currently true because these injections are shared between
        // the client and the server package. They should be built independently
        // and not share any injection state. Then this problem will be solved.
        return;
      }
      alreadyInjected = true;

      ReactInjection.EventEmitter.injectReactEventListener(ReactEventListener);

      /**
       * Inject modules for resolving DOM hierarchy and plugin ordering.
       */
      ReactInjection.EventPluginHub.injectEventPluginOrder(DefaultEventPluginOrder);
      ReactInjection.EventPluginUtils.injectComponentTree(ReactDOMComponentTree$2);
      ReactInjection.EventPluginUtils.injectTreeTraversal(ReactDOMTreeTraversal);

      /**
       * Some important event plugins included by default (without having to require
       * them).
       */
      ReactInjection.EventPluginHub.injectEventPluginsByName({
        SimpleEventPlugin: SimpleEventPlugin,
        EnterLeaveEventPlugin: EnterLeaveEventPlugin,
        ChangeEventPlugin: ChangeEventPlugin,
        SelectEventPlugin: SelectEventPlugin,
        BeforeInputEventPlugin: BeforeInputEventPlugin
      });

      ReactInjection.HostComponent.injectGenericComponentClass(ReactDOMComponent);

      ReactInjection.HostComponent.injectTextComponentClass(ReactDOMTextComponent);

      ReactInjection.DOMProperty.injectDOMPropertyConfig(HTMLDOMPropertyConfig);
      ReactInjection.DOMProperty.injectDOMPropertyConfig(SVGDOMPropertyConfig);

      ReactInjection.EmptyComponent.injectEmptyComponentFactory(function (instantiate) {
        return new ReactDOMEmptyComponent(instantiate);
      });

      ReactInjection.Updates.injectReconcileTransaction(ReactReconcileTransaction);
      ReactInjection.Updates.injectBatchingStrategy(ReactDefaultBatchingStrategy);

      ReactInjection.Component.injectEnvironment(ReactComponentBrowserEnvironment);
    }

    var __moduleExports$35 = {
      inject: inject
    };

    var DOC_NODE_TYPE$1 = 9;

    function ReactDOMContainerInfo$1(topLevelWrapper, node) {
      var info = {
        _topLevelWrapper: topLevelWrapper,
        _idCounter: 1,
        _ownerDocument: node ? node.nodeType === DOC_NODE_TYPE$1 ? node : node.ownerDocument : null,
        _node: node,
        _tag: node ? node.nodeName.toLowerCase() : null,
        _namespaceURI: node ? node.namespaceURI : null
      };
      if ("production" !== 'production') {}
      return info;
    }

    var __moduleExports$159 = ReactDOMContainerInfo$1;

    var ReactDOMFeatureFlags$1 = {
      useCreateElement: true
    };

    var __moduleExports$160 = ReactDOMFeatureFlags$1;

    var MOD = 65521;

    // adler32 is not cryptographically strong, and is only used to sanity check that
    // markup generated on the server matches the markup generated on the client.
    // This implementation (a modified version of the SheetJS version) has been optimized
    // for our use case, at the expense of conforming to the adler32 specification
    // for non-ascii inputs.
    function adler32$1(data) {
      var a = 1;
      var b = 0;
      var i = 0;
      var l = data.length;
      var m = l & ~0x3;
      while (i < m) {
        var n = Math.min(i + 4096, m);
        for (; i < n; i += 4) {
          b += (a += data.charCodeAt(i)) + (a += data.charCodeAt(i + 1)) + (a += data.charCodeAt(i + 2)) + (a += data.charCodeAt(i + 3));
        }
        a %= MOD;
        b %= MOD;
      }
      for (; i < l; i++) {
        b += a += data.charCodeAt(i);
      }
      a %= MOD;
      b %= MOD;
      return a | b << 16;
    }

    var __moduleExports$162 = adler32$1;

    var adler32 = __moduleExports$162;

    var TAG_END = /\/?>/;
    var COMMENT_START = /^<\!\-\-/;

    var ReactMarkupChecksum$1 = {
      CHECKSUM_ATTR_NAME: 'data-react-checksum',

      /**
       * @param {string} markup Markup string
       * @return {string} Markup string with checksum attribute attached
       */
      addChecksumToMarkup: function (markup) {
        var checksum = adler32(markup);

        // Add checksum (handle both parent tags, comments and self-closing tags)
        if (COMMENT_START.test(markup)) {
          return markup;
        } else {
          return markup.replace(TAG_END, ' ' + ReactMarkupChecksum$1.CHECKSUM_ATTR_NAME + '="' + checksum + '"$&');
        }
      },

      /**
       * @param {string} markup to use
       * @param {DOMElement} element root React element
       * @returns {boolean} whether or not the markup is the same
       */
      canReuseMarkup: function (markup, element) {
        var existingChecksum = element.getAttribute(ReactMarkupChecksum$1.CHECKSUM_ATTR_NAME);
        existingChecksum = existingChecksum && parseInt(existingChecksum, 10);
        var markupChecksum = adler32(markup);
        return markupChecksum === existingChecksum;
      }
    };

    var __moduleExports$161 = ReactMarkupChecksum$1;

    var _prodInvariant$32 = __moduleExports$4;

    var DOMLazyTree$6 = __moduleExports$78;
    var DOMProperty$6 = __moduleExports$33;
    var ReactBrowserEventEmitter$4 = __moduleExports$103;
    var ReactCurrentOwner$8 = __moduleExports$7;
    var ReactDOMComponentTree$19 = __moduleExports$32;
    var ReactDOMContainerInfo = __moduleExports$159;
    var ReactDOMFeatureFlags = __moduleExports$160;
    var ReactElement$11 = __moduleExports$6;
    var ReactFeatureFlags$2 = __moduleExports$54;
    var ReactInstanceMap$4 = __moduleExports$115;
    var ReactMarkupChecksum = __moduleExports$161;
    var ReactReconciler$6 = __moduleExports$55;
    var ReactUpdateQueue$3 = __moduleExports$127;
    var ReactUpdates$10 = __moduleExports$52;

    var emptyObject$5 = __moduleExports$16;
    var instantiateReactComponent$2 = __moduleExports$117;
    var invariant$37 = __moduleExports$5;
    var setInnerHTML$4 = __moduleExports$80;
    var shouldUpdateReactComponent$3 = __moduleExports$121;
    var ATTR_NAME$1 = DOMProperty$6.ID_ATTRIBUTE_NAME;
    var ROOT_ATTR_NAME = DOMProperty$6.ROOT_ATTRIBUTE_NAME;

    var ELEMENT_NODE_TYPE$1 = 1;
    var DOC_NODE_TYPE = 9;
    var DOCUMENT_FRAGMENT_NODE_TYPE$1 = 11;

    var instancesByReactRootID = {};

    /**
     * Finds the index of the first character
     * that's not common between the two given strings.
     *
     * @return {number} the index of the character where the strings diverge
     */
    function firstDifferenceIndex(string1, string2) {
      var minLen = Math.min(string1.length, string2.length);
      for (var i = 0; i < minLen; i++) {
        if (string1.charAt(i) !== string2.charAt(i)) {
          return i;
        }
      }
      return string1.length === string2.length ? -1 : minLen;
    }

    /**
     * @param {DOMElement|DOMDocument} container DOM element that may contain
     * a React component
     * @return {?*} DOM element that may have the reactRoot ID, or null.
     */
    function getReactRootElementInContainer(container) {
      if (!container) {
        return null;
      }

      if (container.nodeType === DOC_NODE_TYPE) {
        return container.documentElement;
      } else {
        return container.firstChild;
      }
    }

    function internalGetID(node) {
      // If node is something like a window, document, or text node, none of
      // which support attributes or a .getAttribute method, gracefully return
      // the empty string, as if the attribute were missing.
      return node.getAttribute && node.getAttribute(ATTR_NAME$1) || '';
    }

    /**
     * Mounts this component and inserts it into the DOM.
     *
     * @param {ReactComponent} componentInstance The instance to mount.
     * @param {DOMElement} container DOM element to mount into.
     * @param {ReactReconcileTransaction} transaction
     * @param {boolean} shouldReuseMarkup If true, do not insert markup
     */
    function mountComponentIntoNode(wrapperInstance, container, transaction, shouldReuseMarkup, context) {
      var markerName;
      if (ReactFeatureFlags$2.logTopLevelRenders) {
        var wrappedElement = wrapperInstance._currentElement.props;
        var type = wrappedElement.type;
        markerName = 'React mount: ' + (typeof type === 'string' ? type : type.displayName || type.name);
        console.time(markerName);
      }

      var markup = ReactReconciler$6.mountComponent(wrapperInstance, transaction, null, ReactDOMContainerInfo(wrapperInstance, container), context, 0 /* parentDebugID */
      );

      if (markerName) {
        console.timeEnd(markerName);
      }

      wrapperInstance._renderedComponent._topLevelWrapper = wrapperInstance;
      ReactMount$1._mountImageIntoNode(markup, container, wrapperInstance, shouldReuseMarkup, transaction);
    }

    /**
     * Batched mount.
     *
     * @param {ReactComponent} componentInstance The instance to mount.
     * @param {DOMElement} container DOM element to mount into.
     * @param {boolean} shouldReuseMarkup If true, do not insert markup
     */
    function batchedMountComponentIntoNode(componentInstance, container, shouldReuseMarkup, context) {
      var transaction = ReactUpdates$10.ReactReconcileTransaction.getPooled(
      /* useCreateElement */
      !shouldReuseMarkup && ReactDOMFeatureFlags.useCreateElement);
      transaction.perform(mountComponentIntoNode, null, componentInstance, container, transaction, shouldReuseMarkup, context);
      ReactUpdates$10.ReactReconcileTransaction.release(transaction);
    }

    /**
     * Unmounts a component and removes it from the DOM.
     *
     * @param {ReactComponent} instance React component instance.
     * @param {DOMElement} container DOM element to unmount from.
     * @final
     * @internal
     * @see {ReactMount.unmountComponentAtNode}
     */
    function unmountComponentFromNode(instance, container, safely) {
      if ("production" !== 'production') {}
      ReactReconciler$6.unmountComponent(instance, safely);
      if ("production" !== 'production') {}

      if (container.nodeType === DOC_NODE_TYPE) {
        container = container.documentElement;
      }

      // http://jsperf.com/emptying-a-node
      while (container.lastChild) {
        container.removeChild(container.lastChild);
      }
    }

    /**
     * True if the supplied DOM node has a direct React-rendered child that is
     * not a React root element. Useful for warning in `render`,
     * `unmountComponentAtNode`, etc.
     *
     * @param {?DOMElement} node The candidate DOM node.
     * @return {boolean} True if the DOM element contains a direct child that was
     * rendered by React but is not a root element.
     * @internal
     */
    function hasNonRootReactChild(container) {
      var rootEl = getReactRootElementInContainer(container);
      if (rootEl) {
        var inst = ReactDOMComponentTree$19.getInstanceFromNode(rootEl);
        return !!(inst && inst._hostParent);
      }
    }

    /**
     * True if the supplied DOM node is a valid node element.
     *
     * @param {?DOMElement} node The candidate DOM node.
     * @return {boolean} True if the DOM is a valid DOM node.
     * @internal
     */
    function isValidContainer(node) {
      return !!(node && (node.nodeType === ELEMENT_NODE_TYPE$1 || node.nodeType === DOC_NODE_TYPE || node.nodeType === DOCUMENT_FRAGMENT_NODE_TYPE$1));
    }

    function getHostRootInstanceInContainer(container) {
      var rootEl = getReactRootElementInContainer(container);
      var prevHostInstance = rootEl && ReactDOMComponentTree$19.getInstanceFromNode(rootEl);
      return prevHostInstance && !prevHostInstance._hostParent ? prevHostInstance : null;
    }

    function getTopLevelWrapperInContainer(container) {
      var root = getHostRootInstanceInContainer(container);
      return root ? root._hostContainerInfo._topLevelWrapper : null;
    }

    /**
     * Temporary (?) hack so that we can store all top-level pending updates on
     * composites instead of having to worry about different types of components
     * here.
     */
    var topLevelRootCounter = 1;
    var TopLevelWrapper = function () {
      this.rootID = topLevelRootCounter++;
    };
    TopLevelWrapper.prototype.isReactComponent = {};
    TopLevelWrapper.prototype.render = function () {
      // this.props is actually a ReactElement
      return this.props;
    };

    /**
     * Mounting is the process of initializing a React component by creating its
     * representative DOM elements and inserting them into a supplied `container`.
     * Any prior content inside `container` is destroyed in the process.
     *
     *   ReactMount.render(
     *     component,
     *     document.getElementById('container')
     *   );
     *
     *   <div id="container">                   <-- Supplied `container`.
     *     <div data-reactid=".3">              <-- Rendered reactRoot of React
     *       // ...                                 component.
     *     </div>
     *   </div>
     *
     * Inside of `container`, the first element rendered is the "reactRoot".
     */
    var ReactMount$1 = {

      TopLevelWrapper: TopLevelWrapper,

      /**
       * Used by devtools. The keys are not important.
       */
      _instancesByReactRootID: instancesByReactRootID,

      /**
       * This is a hook provided to support rendering React components while
       * ensuring that the apparent scroll position of its `container` does not
       * change.
       *
       * @param {DOMElement} container The `container` being rendered into.
       * @param {function} renderCallback This must be called once to do the render.
       */
      scrollMonitor: function (container, renderCallback) {
        renderCallback();
      },

      /**
       * Take a component that's already mounted into the DOM and replace its props
       * @param {ReactComponent} prevComponent component instance already in the DOM
       * @param {ReactElement} nextElement component instance to render
       * @param {DOMElement} container container to render into
       * @param {?function} callback function triggered on completion
       */
      _updateRootComponent: function (prevComponent, nextElement, nextContext, container, callback) {
        ReactMount$1.scrollMonitor(container, function () {
          ReactUpdateQueue$3.enqueueElementInternal(prevComponent, nextElement, nextContext);
          if (callback) {
            ReactUpdateQueue$3.enqueueCallbackInternal(prevComponent, callback);
          }
        });

        return prevComponent;
      },

      /**
       * Render a new component into the DOM. Hooked by hooks!
       *
       * @param {ReactElement} nextElement element to render
       * @param {DOMElement} container container to render into
       * @param {boolean} shouldReuseMarkup if we should skip the markup insertion
       * @return {ReactComponent} nextComponent
       */
      _renderNewRootComponent: function (nextElement, container, shouldReuseMarkup, context) {
        // Various parts of our code (such as ReactCompositeComponent's
        // _renderValidatedComponent) assume that calls to render aren't nested;
        // verify that that's the case.
        void 0;

        !isValidContainer(container) ? _prodInvariant$32('37') : void 0;

        ReactBrowserEventEmitter$4.ensureScrollValueMonitoring();
        var componentInstance = instantiateReactComponent$2(nextElement, false);

        // The initial render is synchronous but any updates that happen during
        // rendering, in componentWillMount or componentDidMount, will be batched
        // according to the current batching strategy.

        ReactUpdates$10.batchedUpdates(batchedMountComponentIntoNode, componentInstance, container, shouldReuseMarkup, context);

        var wrapperID = componentInstance._instance.rootID;
        instancesByReactRootID[wrapperID] = componentInstance;

        return componentInstance;
      },

      /**
       * Renders a React component into the DOM in the supplied `container`.
       *
       * If the React component was previously rendered into `container`, this will
       * perform an update on it and only mutate the DOM as necessary to reflect the
       * latest React component.
       *
       * @param {ReactComponent} parentComponent The conceptual parent of this render tree.
       * @param {ReactElement} nextElement Component element to render.
       * @param {DOMElement} container DOM element to render into.
       * @param {?function} callback function triggered on completion
       * @return {ReactComponent} Component instance rendered in `container`.
       */
      renderSubtreeIntoContainer: function (parentComponent, nextElement, container, callback) {
        !(parentComponent != null && ReactInstanceMap$4.has(parentComponent)) ? _prodInvariant$32('38') : void 0;
        return ReactMount$1._renderSubtreeIntoContainer(parentComponent, nextElement, container, callback);
      },

      _renderSubtreeIntoContainer: function (parentComponent, nextElement, container, callback) {
        ReactUpdateQueue$3.validateCallback(callback, 'ReactDOM.render');
        !ReactElement$11.isValidElement(nextElement) ? _prodInvariant$32('39', typeof nextElement === 'string' ? ' Instead of passing a string like \'div\', pass ' + 'React.createElement(\'div\') or <div />.' : typeof nextElement === 'function' ? ' Instead of passing a class like Foo, pass ' + 'React.createElement(Foo) or <Foo />.' : nextElement != null && nextElement.props !== undefined ? ' This may be caused by unintentionally loading two independent ' + 'copies of React.' : '') : void 0;

        void 0;

        var nextWrappedElement = ReactElement$11(TopLevelWrapper, null, null, null, null, null, nextElement);

        var nextContext;
        if (parentComponent) {
          var parentInst = ReactInstanceMap$4.get(parentComponent);
          nextContext = parentInst._processChildContext(parentInst._context);
        } else {
          nextContext = emptyObject$5;
        }

        var prevComponent = getTopLevelWrapperInContainer(container);

        if (prevComponent) {
          var prevWrappedElement = prevComponent._currentElement;
          var prevElement = prevWrappedElement.props;
          if (shouldUpdateReactComponent$3(prevElement, nextElement)) {
            var publicInst = prevComponent._renderedComponent.getPublicInstance();
            var updatedCallback = callback && function () {
              callback.call(publicInst);
            };
            ReactMount$1._updateRootComponent(prevComponent, nextWrappedElement, nextContext, container, updatedCallback);
            return publicInst;
          } else {
            ReactMount$1.unmountComponentAtNode(container);
          }
        }

        var reactRootElement = getReactRootElementInContainer(container);
        var containerHasReactMarkup = reactRootElement && !!internalGetID(reactRootElement);
        var containerHasNonRootReactChild = hasNonRootReactChild(container);

        if ("production" !== 'production') {}

        var shouldReuseMarkup = containerHasReactMarkup && !prevComponent && !containerHasNonRootReactChild;
        var component = ReactMount$1._renderNewRootComponent(nextWrappedElement, container, shouldReuseMarkup, nextContext)._renderedComponent.getPublicInstance();
        if (callback) {
          callback.call(component);
        }
        return component;
      },

      /**
       * Renders a React component into the DOM in the supplied `container`.
       * See https://facebook.github.io/react/docs/top-level-api.html#reactdom.render
       *
       * If the React component was previously rendered into `container`, this will
       * perform an update on it and only mutate the DOM as necessary to reflect the
       * latest React component.
       *
       * @param {ReactElement} nextElement Component element to render.
       * @param {DOMElement} container DOM element to render into.
       * @param {?function} callback function triggered on completion
       * @return {ReactComponent} Component instance rendered in `container`.
       */
      render: function (nextElement, container, callback) {
        return ReactMount$1._renderSubtreeIntoContainer(null, nextElement, container, callback);
      },

      /**
       * Unmounts and destroys the React component rendered in the `container`.
       * See https://facebook.github.io/react/docs/top-level-api.html#reactdom.unmountcomponentatnode
       *
       * @param {DOMElement} container DOM element containing a React component.
       * @return {boolean} True if a component was found in and unmounted from
       *                   `container`
       */
      unmountComponentAtNode: function (container) {
        // Various parts of our code (such as ReactCompositeComponent's
        // _renderValidatedComponent) assume that calls to render aren't nested;
        // verify that that's the case. (Strictly speaking, unmounting won't cause a
        // render but we still don't expect to be in a render call here.)
        void 0;

        !isValidContainer(container) ? _prodInvariant$32('40') : void 0;

        if ("production" !== 'production') {}

        var prevComponent = getTopLevelWrapperInContainer(container);
        if (!prevComponent) {
          // Check if the node being unmounted was rendered by React, but isn't a
          // root node.
          var containerHasNonRootReactChild = hasNonRootReactChild(container);

          // Check if the container itself is a React root node.
          var isContainerReactRoot = container.nodeType === 1 && container.hasAttribute(ROOT_ATTR_NAME);

          if ("production" !== 'production') {}

          return false;
        }
        delete instancesByReactRootID[prevComponent._instance.rootID];
        ReactUpdates$10.batchedUpdates(unmountComponentFromNode, prevComponent, container, false);
        return true;
      },

      _mountImageIntoNode: function (markup, container, instance, shouldReuseMarkup, transaction) {
        !isValidContainer(container) ? _prodInvariant$32('41') : void 0;

        if (shouldReuseMarkup) {
          var rootElement = getReactRootElementInContainer(container);
          if (ReactMarkupChecksum.canReuseMarkup(markup, rootElement)) {
            ReactDOMComponentTree$19.precacheNode(instance, rootElement);
            return;
          } else {
            var checksum = rootElement.getAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);
            rootElement.removeAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);

            var rootMarkup = rootElement.outerHTML;
            rootElement.setAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME, checksum);

            var normalizedMarkup = markup;
            if ("production" !== 'production') {}

            var diffIndex = firstDifferenceIndex(normalizedMarkup, rootMarkup);
            var difference = ' (client) ' + normalizedMarkup.substring(diffIndex - 20, diffIndex + 20) + '\n (server) ' + rootMarkup.substring(diffIndex - 20, diffIndex + 20);

            !(container.nodeType !== DOC_NODE_TYPE) ? _prodInvariant$32('42', difference) : void 0;

            if ("production" !== 'production') {}
          }
        }

        !(container.nodeType !== DOC_NODE_TYPE) ? _prodInvariant$32('43') : void 0;

        if (transaction.useCreateElement) {
          while (container.lastChild) {
            container.removeChild(container.lastChild);
          }
          DOMLazyTree$6.insertTreeBefore(container, markup, null);
        } else {
          setInnerHTML$4(container, markup);
          ReactDOMComponentTree$19.precacheNode(instance, container.firstChild);
        }

        if ("production" !== 'production') {}
      }
    };

    var __moduleExports$158 = ReactMount$1;

    var ReactNodeTypes$2 = __moduleExports$119;

    function getHostComponentFromComposite$2(inst) {
      var type;

      while ((type = inst._renderedNodeType) === ReactNodeTypes$2.COMPOSITE) {
        inst = inst._renderedComponent;
      }

      if (type === ReactNodeTypes$2.HOST) {
        return inst._renderedComponent;
      } else if (type === ReactNodeTypes$2.EMPTY) {
        return null;
      }
    }

    var __moduleExports$164 = getHostComponentFromComposite$2;

    var _prodInvariant$33 = __moduleExports$4;

    var ReactCurrentOwner$9 = __moduleExports$7;
    var ReactDOMComponentTree$20 = __moduleExports$32;
    var ReactInstanceMap$5 = __moduleExports$115;

    var getHostComponentFromComposite$1 = __moduleExports$164;
    var invariant$38 = __moduleExports$5;
    /**
     * Returns the DOM node rendered by this element.
     *
     * See https://facebook.github.io/react/docs/top-level-api.html#reactdom.finddomnode
     *
     * @param {ReactComponent|DOMElement} componentOrElement
     * @return {?DOMElement} The root node of this element.
     */
    function findDOMNode$1(componentOrElement) {
      if ("production" !== 'production') {}
      if (componentOrElement == null) {
        return null;
      }
      if (componentOrElement.nodeType === 1) {
        return componentOrElement;
      }

      var inst = ReactInstanceMap$5.get(componentOrElement);
      if (inst) {
        inst = getHostComponentFromComposite$1(inst);
        return inst ? ReactDOMComponentTree$20.getNodeFromInstance(inst) : null;
      }

      if (typeof componentOrElement.render === 'function') {
        _prodInvariant$33('44');
      } else {
        _prodInvariant$33('45', Object.keys(componentOrElement));
      }
    }

    var __moduleExports$163 = findDOMNode$1;

    var ReactMount$2 = __moduleExports$158;

    var __moduleExports$165 = ReactMount$2.renderSubtreeIntoContainer;

    var DOMProperty$7 = __moduleExports$33;
    var EventPluginRegistry$4 = __moduleExports$40;
    var ReactComponentTreeHook$7 = __moduleExports$25;

    var ReactComponentTreeHook$8 = __moduleExports$25;

    var ReactDOMComponentTree = __moduleExports$32;
    var ReactDefaultInjection = __moduleExports$35;
    var ReactMount = __moduleExports$158;
    var ReactReconciler = __moduleExports$55;
    var ReactUpdates = __moduleExports$52;
    var ReactVersion$1 = __moduleExports$29;

    var findDOMNode = __moduleExports$163;
    var getHostComponentFromComposite = __moduleExports$164;
    var renderSubtreeIntoContainer = __moduleExports$165;
    ReactDefaultInjection.inject();

    var ReactDOM = {
      findDOMNode: findDOMNode,
      render: ReactMount.render,
      unmountComponentAtNode: ReactMount.unmountComponentAtNode,
      version: ReactVersion$1,

      /* eslint-disable camelcase */
      unstable_batchedUpdates: ReactUpdates.batchedUpdates,
      unstable_renderSubtreeIntoContainer: renderSubtreeIntoContainer
    };

    // Inject the runtime into a devtools global hook regardless of browser.
    // Allows for debugging when the hook is injected on the page.
    /* eslint-enable camelcase */
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject === 'function') {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.inject({
        ComponentTree: {
          getClosestInstanceFromNode: ReactDOMComponentTree.getClosestInstanceFromNode,
          getNodeFromInstance: function (inst) {
            // inst is an internal instance (but could be a composite)
            if (inst._renderedComponent) {
              inst = getHostComponentFromComposite(inst);
            }
            if (inst) {
              return ReactDOMComponentTree.getNodeFromInstance(inst);
            } else {
              return null;
            }
          }
        },
        Mount: ReactMount,
        Reconciler: ReactReconciler
      });
    }

    var __moduleExports$31 = ReactDOM;

    var index = __moduleExports$31;

    var VirtualDom = { render: index.render };

    var flattenChildren$3 = __moduleExports$124;

    var ReactTransitionChildMapping$1 = {
      /**
       * Given `this.props.children`, return an object mapping key to child. Just
       * simple syntactic sugar around flattenChildren().
       *
       * @param {*} children `this.props.children`
       * @param {number=} selfDebugID Optional debugID of the current internal instance.
       * @return {object} Mapping of key to child
       */
      getChildMapping: function (children, selfDebugID) {
        if (!children) {
          return children;
        }

        if ("production" !== 'production') {}

        return flattenChildren$3(children);
      },

      /**
       * When you're adding or removing children some may be added or removed in the
       * same render pass. We want to show *both* since we want to simultaneously
       * animate elements in and out. This function takes a previous set of keys
       * and a new set of keys and merges them with its best guess of the correct
       * ordering. In the future we may expose some of the utilities in
       * ReactMultiChild to make this easy, but for now React itself does not
       * directly have this concept of the union of prevChildren and nextChildren
       * so we implement it here.
       *
       * @param {object} prev prev children as returned from
       * `ReactTransitionChildMapping.getChildMapping()`.
       * @param {object} next next children as returned from
       * `ReactTransitionChildMapping.getChildMapping()`.
       * @return {object} a key set that contains all keys in `prev` and all keys
       * in `next` in a reasonable order.
       */
      mergeChildMappings: function (prev, next) {
        prev = prev || {};
        next = next || {};

        function getValueForKey(key) {
          if (next.hasOwnProperty(key)) {
            return next[key];
          } else {
            return prev[key];
          }
        }

        // For each key of `next`, the list of keys to insert before that key in
        // the combined list
        var nextKeysPending = {};

        var pendingKeys = [];
        for (var prevKey in prev) {
          if (next.hasOwnProperty(prevKey)) {
            if (pendingKeys.length) {
              nextKeysPending[prevKey] = pendingKeys;
              pendingKeys = [];
            }
          } else {
            pendingKeys.push(prevKey);
          }
        }

        var i;
        var childMapping = {};
        for (var nextKey in next) {
          if (nextKeysPending.hasOwnProperty(nextKey)) {
            for (i = 0; i < nextKeysPending[nextKey].length; i++) {
              var pendingNextKey = nextKeysPending[nextKey][i];
              childMapping[nextKeysPending[nextKey][i]] = getValueForKey(pendingNextKey);
            }
          }
          childMapping[nextKey] = getValueForKey(nextKey);
        }

        // Finally, add the keys which didn't appear before any key in `next`
        for (i = 0; i < pendingKeys.length; i++) {
          childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
        }

        return childMapping;
      }
    };

    var __moduleExports$170 = ReactTransitionChildMapping$1;

    var _assign$25 = __moduleExports$1;

    var React$2 = __moduleExports;
    var ReactInstanceMap$6 = __moduleExports$115;
    var ReactTransitionChildMapping = __moduleExports$170;

    var emptyFunction$12 = __moduleExports$9;

    /**
     * A basis for animations. When children are declaratively added or removed,
     * special lifecycle hooks are called.
     * See https://facebook.github.io/react/docs/animation.html#low-level-api-reacttransitiongroup
     */
    var ReactTransitionGroup$1 = React$2.createClass({
      displayName: 'ReactTransitionGroup',

      propTypes: {
        component: React$2.PropTypes.any,
        childFactory: React$2.PropTypes.func
      },

      getDefaultProps: function () {
        return {
          component: 'span',
          childFactory: emptyFunction$12.thatReturnsArgument
        };
      },

      getInitialState: function () {
        return {
          // TODO: can we get useful debug information to show at this point?
          children: ReactTransitionChildMapping.getChildMapping(this.props.children)
        };
      },

      componentWillMount: function () {
        this.currentlyTransitioningKeys = {};
        this.keysToEnter = [];
        this.keysToLeave = [];
      },

      componentDidMount: function () {
        var initialChildMapping = this.state.children;
        for (var key in initialChildMapping) {
          if (initialChildMapping[key]) {
            this.performAppear(key);
          }
        }
      },

      componentWillReceiveProps: function (nextProps) {
        var nextChildMapping;
        if ("production" !== 'production') {} else {
          nextChildMapping = ReactTransitionChildMapping.getChildMapping(nextProps.children);
        }
        var prevChildMapping = this.state.children;

        this.setState({
          children: ReactTransitionChildMapping.mergeChildMappings(prevChildMapping, nextChildMapping)
        });

        var key;

        for (key in nextChildMapping) {
          var hasPrev = prevChildMapping && prevChildMapping.hasOwnProperty(key);
          if (nextChildMapping[key] && !hasPrev && !this.currentlyTransitioningKeys[key]) {
            this.keysToEnter.push(key);
          }
        }

        for (key in prevChildMapping) {
          var hasNext = nextChildMapping && nextChildMapping.hasOwnProperty(key);
          if (prevChildMapping[key] && !hasNext && !this.currentlyTransitioningKeys[key]) {
            this.keysToLeave.push(key);
          }
        }

        // If we want to someday check for reordering, we could do it here.
      },

      componentDidUpdate: function () {
        var keysToEnter = this.keysToEnter;
        this.keysToEnter = [];
        keysToEnter.forEach(this.performEnter);

        var keysToLeave = this.keysToLeave;
        this.keysToLeave = [];
        keysToLeave.forEach(this.performLeave);
      },

      performAppear: function (key) {
        this.currentlyTransitioningKeys[key] = true;

        var component = this.refs[key];

        if (component.componentWillAppear) {
          component.componentWillAppear(this._handleDoneAppearing.bind(this, key));
        } else {
          this._handleDoneAppearing(key);
        }
      },

      _handleDoneAppearing: function (key) {
        var component = this.refs[key];
        if (component.componentDidAppear) {
          component.componentDidAppear();
        }

        delete this.currentlyTransitioningKeys[key];

        var currentChildMapping;
        if ("production" !== 'production') {} else {
          currentChildMapping = ReactTransitionChildMapping.getChildMapping(this.props.children);
        }

        if (!currentChildMapping || !currentChildMapping.hasOwnProperty(key)) {
          // This was removed before it had fully appeared. Remove it.
          this.performLeave(key);
        }
      },

      performEnter: function (key) {
        this.currentlyTransitioningKeys[key] = true;

        var component = this.refs[key];

        if (component.componentWillEnter) {
          component.componentWillEnter(this._handleDoneEntering.bind(this, key));
        } else {
          this._handleDoneEntering(key);
        }
      },

      _handleDoneEntering: function (key) {
        var component = this.refs[key];
        if (component.componentDidEnter) {
          component.componentDidEnter();
        }

        delete this.currentlyTransitioningKeys[key];

        var currentChildMapping;
        if ("production" !== 'production') {} else {
          currentChildMapping = ReactTransitionChildMapping.getChildMapping(this.props.children);
        }

        if (!currentChildMapping || !currentChildMapping.hasOwnProperty(key)) {
          // This was removed before it had fully entered. Remove it.
          this.performLeave(key);
        }
      },

      performLeave: function (key) {
        this.currentlyTransitioningKeys[key] = true;

        var component = this.refs[key];
        if (component.componentWillLeave) {
          component.componentWillLeave(this._handleDoneLeaving.bind(this, key));
        } else {
          // Note that this is somewhat dangerous b/c it calls setState()
          // again, effectively mutating the component before all the work
          // is done.
          this._handleDoneLeaving(key);
        }
      },

      _handleDoneLeaving: function (key) {
        var component = this.refs[key];

        if (component.componentDidLeave) {
          component.componentDidLeave();
        }

        delete this.currentlyTransitioningKeys[key];

        var currentChildMapping;
        if ("production" !== 'production') {} else {
          currentChildMapping = ReactTransitionChildMapping.getChildMapping(this.props.children);
        }

        if (currentChildMapping && currentChildMapping.hasOwnProperty(key)) {
          // This entered again before it fully left. Add it again.
          this.performEnter(key);
        } else {
          this.setState(function (state) {
            var newChildren = _assign$25({}, state.children);
            delete newChildren[key];
            return { children: newChildren };
          });
        }
      },

      render: function () {
        // TODO: we could get rid of the need for the wrapper node
        // by cloning a single child
        var childrenToRender = [];
        for (var key in this.state.children) {
          var child = this.state.children[key];
          if (child) {
            // You may need to apply reactive updates to a child as it is leaving.
            // The normal React way to do it won't work since the child will have
            // already been removed. In case you need this behavior you can provide
            // a childFactory function to wrap every child, even the ones that are
            // leaving.
            childrenToRender.push(React$2.cloneElement(this.props.childFactory(child), { ref: key, key: key }));
          }
        }

        // Do not forward ReactTransitionGroup props to primitive DOM nodes
        var props = _assign$25({}, this.props);
        delete props.transitionLeave;
        delete props.transitionName;
        delete props.transitionAppear;
        delete props.transitionEnter;
        delete props.childFactory;
        delete props.transitionLeaveTimeout;
        delete props.transitionEnterTimeout;
        delete props.transitionAppearTimeout;
        delete props.component;

        return React$2.createElement(this.props.component, props, childrenToRender);
      }
    });

    var __moduleExports$169 = ReactTransitionGroup$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @typechecks
     */

    var invariant$39 = __moduleExports$5;

    /**
     * The CSSCore module specifies the API (and implements most of the methods)
     * that should be used when dealing with the display of elements (via their
     * CSS classes and visibility on screen. It is an API focused on mutating the
     * display and not reading it as no logical state should be encoded in the
     * display of elements.
     */

    /* Slow implementation for browsers that don't natively support .matches() */
    function matchesSelector_SLOW(element, selector) {
      var root = element;
      while (root.parentNode) {
        root = root.parentNode;
      }

      var all = root.querySelectorAll(selector);
      return Array.prototype.indexOf.call(all, element) !== -1;
    }

    var CSSCore$1 = {

      /**
       * Adds the class passed in to the element if it doesn't already have it.
       *
       * @param {DOMElement} element the element to set the class on
       * @param {string} className the CSS className
       * @return {DOMElement} the element passed in
       */
      addClass: function addClass(element, className) {
        !!/\s/.test(className) ? invariant$39(false) : void 0;

        if (className) {
          if (element.classList) {
            element.classList.add(className);
          } else if (!CSSCore$1.hasClass(element, className)) {
            element.className = element.className + ' ' + className;
          }
        }
        return element;
      },

      /**
       * Removes the class passed in from the element
       *
       * @param {DOMElement} element the element to set the class on
       * @param {string} className the CSS className
       * @return {DOMElement} the element passed in
       */
      removeClass: function removeClass(element, className) {
        !!/\s/.test(className) ? invariant$39(false) : void 0;

        if (className) {
          if (element.classList) {
            element.classList.remove(className);
          } else if (CSSCore$1.hasClass(element, className)) {
            element.className = element.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)', 'g'), '$1').replace(/\s+/g, ' ') // multiple spaces to one
            .replace(/^\s*|\s*$/g, ''); // trim the ends
          }
        }
        return element;
      },

      /**
       * Helper to add or remove a class from an element based on a condition.
       *
       * @param {DOMElement} element the element to set the class on
       * @param {string} className the CSS className
       * @param {*} bool condition to whether to add or remove the class
       * @return {DOMElement} the element passed in
       */
      conditionClass: function conditionClass(element, className, bool) {
        return (bool ? CSSCore$1.addClass : CSSCore$1.removeClass)(element, className);
      },

      /**
       * Tests whether the element has the class specified.
       *
       * @param {DOMNode|DOMWindow} element the element to check the class on
       * @param {string} className the CSS className
       * @return {boolean} true if the element has the class, false if not
       */
      hasClass: function hasClass(element, className) {
        !!/\s/.test(className) ? invariant$39(false) : void 0;
        if (element.classList) {
          return !!className && element.classList.contains(className);
        }
        return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
      },

      /**
       * Tests whether the element matches the selector specified
       *
       * @param {DOMNode|DOMWindow} element the element that we are querying
       * @param {string} selector the CSS selector
       * @return {boolean} true if the element matches the selector, false if not
       */
      matchesSelector: function matchesSelector(element, selector) {
        var matchesImpl = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector || function (s) {
          return matchesSelector_SLOW(element, s);
        };
        return matchesImpl.call(element, selector);
      }

    };

    var __moduleExports$172 = CSSCore$1;

    var ExecutionEnvironment$17 = __moduleExports$45;

    var getVendorPrefixedEventName$2 = __moduleExports$105;

    var endEvents = [];

    function detectEvents() {
      var animEnd = getVendorPrefixedEventName$2('animationend');
      var transEnd = getVendorPrefixedEventName$2('transitionend');

      if (animEnd) {
        endEvents.push(animEnd);
      }

      if (transEnd) {
        endEvents.push(transEnd);
      }
    }

    if (ExecutionEnvironment$17.canUseDOM) {
      detectEvents();
    }

    // We use the raw {add|remove}EventListener() call because EventListener
    // does not know how to remove event listeners and we really should
    // clean up. Also, these events are not triggered in older browsers
    // so we should be A-OK here.

    function addEventListener(node, eventName, eventListener) {
      node.addEventListener(eventName, eventListener, false);
    }

    function removeEventListener(node, eventName, eventListener) {
      node.removeEventListener(eventName, eventListener, false);
    }

    var ReactTransitionEvents$1 = {
      addEndEventListener: function (node, eventListener) {
        if (endEvents.length === 0) {
          // If CSS transitions are not supported, trigger an "end animation"
          // event immediately.
          window.setTimeout(eventListener, 0);
          return;
        }
        endEvents.forEach(function (endEvent) {
          addEventListener(node, endEvent, eventListener);
        });
      },

      removeEndEventListener: function (node, eventListener) {
        if (endEvents.length === 0) {
          return;
        }
        endEvents.forEach(function (endEvent) {
          removeEventListener(node, endEvent, eventListener);
        });
      }
    };

    var __moduleExports$173 = ReactTransitionEvents$1;

    var React$3 = __moduleExports;
    var ReactDOM$1 = __moduleExports$31;

    var CSSCore = __moduleExports$172;
    var ReactTransitionEvents = __moduleExports$173;

    var onlyChild$2 = __moduleExports$30;

    var TICK = 17;

    var ReactCSSTransitionGroupChild$1 = React$3.createClass({
      displayName: 'ReactCSSTransitionGroupChild',

      propTypes: {
        name: React$3.PropTypes.oneOfType([React$3.PropTypes.string, React$3.PropTypes.shape({
          enter: React$3.PropTypes.string,
          leave: React$3.PropTypes.string,
          active: React$3.PropTypes.string
        }), React$3.PropTypes.shape({
          enter: React$3.PropTypes.string,
          enterActive: React$3.PropTypes.string,
          leave: React$3.PropTypes.string,
          leaveActive: React$3.PropTypes.string,
          appear: React$3.PropTypes.string,
          appearActive: React$3.PropTypes.string
        })]).isRequired,

        // Once we require timeouts to be specified, we can remove the
        // boolean flags (appear etc.) and just accept a number
        // or a bool for the timeout flags (appearTimeout etc.)
        appear: React$3.PropTypes.bool,
        enter: React$3.PropTypes.bool,
        leave: React$3.PropTypes.bool,
        appearTimeout: React$3.PropTypes.number,
        enterTimeout: React$3.PropTypes.number,
        leaveTimeout: React$3.PropTypes.number
      },

      transition: function (animationType, finishCallback, userSpecifiedDelay) {
        var node = ReactDOM$1.findDOMNode(this);

        if (!node) {
          if (finishCallback) {
            finishCallback();
          }
          return;
        }

        var className = this.props.name[animationType] || this.props.name + '-' + animationType;
        var activeClassName = this.props.name[animationType + 'Active'] || className + '-active';
        var timeout = null;

        var endListener = function (e) {
          if (e && e.target !== node) {
            return;
          }

          clearTimeout(timeout);

          CSSCore.removeClass(node, className);
          CSSCore.removeClass(node, activeClassName);

          ReactTransitionEvents.removeEndEventListener(node, endListener);

          // Usually this optional callback is used for informing an owner of
          // a leave animation and telling it to remove the child.
          if (finishCallback) {
            finishCallback();
          }
        };

        CSSCore.addClass(node, className);

        // Need to do this to actually trigger a transition.
        this.queueClassAndNode(activeClassName, node);

        // If the user specified a timeout delay.
        if (userSpecifiedDelay) {
          // Clean-up the animation after the specified delay
          timeout = setTimeout(endListener, userSpecifiedDelay);
          this.transitionTimeouts.push(timeout);
        } else {
          // DEPRECATED: this listener will be removed in a future version of react
          ReactTransitionEvents.addEndEventListener(node, endListener);
        }
      },

      queueClassAndNode: function (className, node) {
        this.classNameAndNodeQueue.push({
          className: className,
          node: node
        });

        if (!this.timeout) {
          this.timeout = setTimeout(this.flushClassNameAndNodeQueue, TICK);
        }
      },

      flushClassNameAndNodeQueue: function () {
        if (this.isMounted()) {
          this.classNameAndNodeQueue.forEach(function (obj) {
            CSSCore.addClass(obj.node, obj.className);
          });
        }
        this.classNameAndNodeQueue.length = 0;
        this.timeout = null;
      },

      componentWillMount: function () {
        this.classNameAndNodeQueue = [];
        this.transitionTimeouts = [];
      },

      componentWillUnmount: function () {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.transitionTimeouts.forEach(function (timeout) {
          clearTimeout(timeout);
        });

        this.classNameAndNodeQueue.length = 0;
      },

      componentWillAppear: function (done) {
        if (this.props.appear) {
          this.transition('appear', done, this.props.appearTimeout);
        } else {
          done();
        }
      },

      componentWillEnter: function (done) {
        if (this.props.enter) {
          this.transition('enter', done, this.props.enterTimeout);
        } else {
          done();
        }
      },

      componentWillLeave: function (done) {
        if (this.props.leave) {
          this.transition('leave', done, this.props.leaveTimeout);
        } else {
          done();
        }
      },

      render: function () {
        return onlyChild$2(this.props.children);
      }
    });

    var __moduleExports$171 = ReactCSSTransitionGroupChild$1;

    var _assign$24 = __moduleExports$1;

    var React$1 = __moduleExports;

    var ReactTransitionGroup = __moduleExports$169;
    var ReactCSSTransitionGroupChild = __moduleExports$171;

    function createTransitionTimeoutPropValidator(transitionType) {
      var timeoutPropName = 'transition' + transitionType + 'Timeout';
      var enabledPropName = 'transition' + transitionType;

      return function (props) {
        // If the transition is enabled
        if (props[enabledPropName]) {
          // If no timeout duration is provided
          if (props[timeoutPropName] == null) {
            return new Error(timeoutPropName + ' wasn\'t supplied to ReactCSSTransitionGroup: ' + 'this can cause unreliable animations and won\'t be supported in ' + 'a future version of React. See ' + 'https://fb.me/react-animation-transition-group-timeout for more ' + 'information.');

            // If the duration isn't a number
          } else if (typeof props[timeoutPropName] !== 'number') {
              return new Error(timeoutPropName + ' must be a number (in milliseconds)');
            }
        }
      };
    }

    /**
     * An easy way to perform CSS transitions and animations when a React component
     * enters or leaves the DOM.
     * See https://facebook.github.io/react/docs/animation.html#high-level-api-reactcsstransitiongroup
     */
    var ReactCSSTransitionGroup = React$1.createClass({
      displayName: 'ReactCSSTransitionGroup',

      propTypes: {
        transitionName: ReactCSSTransitionGroupChild.propTypes.name,

        transitionAppear: React$1.PropTypes.bool,
        transitionEnter: React$1.PropTypes.bool,
        transitionLeave: React$1.PropTypes.bool,
        transitionAppearTimeout: createTransitionTimeoutPropValidator('Appear'),
        transitionEnterTimeout: createTransitionTimeoutPropValidator('Enter'),
        transitionLeaveTimeout: createTransitionTimeoutPropValidator('Leave')
      },

      getDefaultProps: function () {
        return {
          transitionAppear: false,
          transitionEnter: true,
          transitionLeave: true
        };
      },

      _wrapChild: function (child) {
        // We need to provide this childFactory so that
        // ReactCSSTransitionGroupChild can receive updates to name, enter, and
        // leave while it is leaving.
        return React$1.createElement(ReactCSSTransitionGroupChild, {
          name: this.props.transitionName,
          appear: this.props.transitionAppear,
          enter: this.props.transitionEnter,
          leave: this.props.transitionLeave,
          appearTimeout: this.props.transitionAppearTimeout,
          enterTimeout: this.props.transitionEnterTimeout,
          leaveTimeout: this.props.transitionLeaveTimeout
        }, child);
      },

      render: function () {
        return React$1.createElement(ReactTransitionGroup, _assign$24({}, this.props, { childFactory: this._wrapChild }));
      }
    });

    var __moduleExports$168 = ReactCSSTransitionGroup;

    var index$1 = __moduleExports$168;

    var __moduleExports$175 = Array.isArray || function (arr) {
      return Object.prototype.toString.call(arr) == '[object Array]';
    };

    var isarray = __moduleExports$175

    /**
     * Expose `pathToRegexp`.
     */
    var __moduleExports$174 = pathToRegexp
    var parse_1 = parse
    var tokensToRegExp_1 = tokensToRegExp

    /**
     * The main path matching regexp utility.
     *
     * @type {RegExp}
     */
    var PATH_REGEXP = new RegExp([
      // Match escaped characters that would otherwise appear in future matches.
      // This allows the user to escape special characters that won't transform.
      '(\\\\.)',
      // Match Express-style parameters and un-named parameters with a prefix
      // and optional suffixes. Matches appear as:
      //
      // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
      // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
      // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
      '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
    ].join('|'), 'g')

    /**
     * Parse a string for the raw tokens.
     *
     * @param  {String} str
     * @return {Array}
     */
    function parse (str) {
      var tokens = []
      var key = 0
      var index = 0
      var path = ''
      var res

      while ((res = PATH_REGEXP.exec(str)) != null) {
        var m = res[0]
        var escaped = res[1]
        var offset = res.index
        path += str.slice(index, offset)
        index = offset + m.length

        // Ignore already escaped sequences.
        if (escaped) {
          path += escaped[1]
          continue
        }

        // Push the current path onto the tokens.
        if (path) {
          tokens.push(path)
          path = ''
        }

        var prefix = res[2]
        var name = res[3]
        var capture = res[4]
        var group = res[5]
        var suffix = res[6]
        var asterisk = res[7]

        var repeat = suffix === '+' || suffix === '*'
        var optional = suffix === '?' || suffix === '*'
        var delimiter = prefix || '/'
        var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?')

        tokens.push({
          name: name || key++,
          prefix: prefix || '',
          delimiter: delimiter,
          optional: optional,
          repeat: repeat,
          pattern: escapeGroup(pattern)
        })
      }

      // Match any characters still remaining.
      if (index < str.length) {
        path += str.substr(index)
      }

      // If the path exists, push it onto the end.
      if (path) {
        tokens.push(path)
      }

      return tokens
    }

    /**
     * Escape a regular expression string.
     *
     * @param  {String} str
     * @return {String}
     */
    function escapeString (str) {
      return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
    }

    /**
     * Escape the capturing group by escaping special characters and meaning.
     *
     * @param  {String} group
     * @return {String}
     */
    function escapeGroup (group) {
      return group.replace(/([=!:$\/()])/g, '\\$1')
    }

    /**
     * Attach the keys as a property of the regexp.
     *
     * @param  {RegExp} re
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function attachKeys (re, keys) {
      re.keys = keys
      return re
    }

    /**
     * Get the flags for a regexp from the options.
     *
     * @param  {Object} options
     * @return {String}
     */
    function flags (options) {
      return options.sensitive ? '' : 'i'
    }

    /**
     * Pull out keys from a regexp.
     *
     * @param  {RegExp} path
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function regexpToRegexp (path, keys) {
      // Use a negative lookahead to match only capturing groups.
      var groups = path.source.match(/\((?!\?)/g)

      if (groups) {
        for (var i = 0; i < groups.length; i++) {
          keys.push({
            name: i,
            prefix: null,
            delimiter: null,
            optional: false,
            repeat: false,
            pattern: null
          })
        }
      }

      return attachKeys(path, keys)
    }

    /**
     * Transform an array into a regexp.
     *
     * @param  {Array}  path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function arrayToRegexp (path, keys, options) {
      var parts = []

      for (var i = 0; i < path.length; i++) {
        parts.push(pathToRegexp(path[i], keys, options).source)
      }

      var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

      return attachKeys(regexp, keys)
    }

    /**
     * Create a path regexp from string input.
     *
     * @param  {String} path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function stringToRegexp (path, keys, options) {
      var tokens = parse(path)
      var re = tokensToRegExp(tokens, options)

      // Attach keys back to the regexp.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] !== 'string') {
          keys.push(tokens[i])
        }
      }

      return attachKeys(re, keys)
    }

    /**
     * Expose a function for taking tokens and returning a RegExp.
     *
     * @param  {Array}  tokens
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function tokensToRegExp (tokens, options) {
      options = options || {}

      var strict = options.strict
      var end = options.end !== false
      var route = ''
      var lastToken = tokens[tokens.length - 1]
      var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken)

      // Iterate over the tokens and create our regexp string.
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i]

        if (typeof token === 'string') {
          route += escapeString(token)
        } else {
          var prefix = escapeString(token.prefix)
          var capture = token.pattern

          if (token.repeat) {
            capture += '(?:' + prefix + capture + ')*'
          }

          if (token.optional) {
            if (prefix) {
              capture = '(?:' + prefix + '(' + capture + '))?'
            } else {
              capture = '(' + capture + ')?'
            }
          } else {
            capture = prefix + '(' + capture + ')'
          }

          route += capture
        }
      }

      // In non-strict mode we allow a slash at the end of match. If the path to
      // match already ends with a slash, we remove it for consistency. The slash
      // is valid at the end of a path match, not in the middle. This is important
      // in non-ending mode, where "/test/" shouldn't match "/test//route".
      if (!strict) {
        route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?'
      }

      if (end) {
        route += '$'
      } else {
        // In non-ending mode, we need the capturing groups to match as much as
        // possible by using a positive lookahead to the end or next path segment.
        route += strict && endsWithSlash ? '' : '(?=\\/|$)'
      }

      return new RegExp('^' + route, flags(options))
    }

    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     *
     * @param  {(String|RegExp|Array)} path
     * @param  {Array}                 [keys]
     * @param  {Object}                [options]
     * @return {RegExp}
     */
    function pathToRegexp (path, keys, options) {
      keys = keys || []

      if (!isarray(keys)) {
        options = keys
        keys = []
      } else if (!options) {
        options = {}
      }

      if (path instanceof RegExp) {
        return regexpToRegexp(path, keys, options)
      }

      if (isarray(path)) {
        return arrayToRegexp(path, keys, options)
      }

      return stringToRegexp(path, keys, options)
    }

    /**
       * Module dependencies.
       */

      var pathtoRegexp = __moduleExports$174;

      /**
       * Module exports.
       */

      var index$2 = page;

      /**
       * Detect click event
       */
      var clickEvent = ('undefined' !== typeof document) && document.ontouchstart ? 'touchstart' : 'click';

      /**
       * To work properly with the URL
       * history.location generated polyfill in https://github.com/devote/HTML5-History-API
       */

      var location = ('undefined' !== typeof window) && (window.history.location || window.location);

      /**
       * Perform initial dispatch.
       */

      var dispatch = true;


      /**
       * Decode URL components (query string, pathname, hash).
       * Accommodates both regular percent encoding and x-www-form-urlencoded format.
       */
      var decodeURLComponents = true;

      /**
       * Base path.
       */

      var base = '';

      /**
       * Running flag.
       */

      var running;

      /**
       * HashBang option
       */

      var hashbang = false;

      /**
       * Previous context, for capturing
       * page exit events.
       */

      var prevContext;

      /**
       * Register `path` with callback `fn()`,
       * or route `path`, or redirection,
       * or `page.start()`.
       *
       *   page(fn);
       *   page('*', fn);
       *   page('/user/:id', load, user);
       *   page('/user/' + user.id, { some: 'thing' });
       *   page('/user/' + user.id);
       *   page('/from', '/to')
       *   page();
       *
       * @param {string|!Function|!Object} path
       * @param {Function=} fn
       * @api public
       */

      function page(path, fn) {
        // <callback>
        if ('function' === typeof path) {
          return page('*', path);
        }

        // route <path> to <callback ...>
        if ('function' === typeof fn) {
          var route = new Route(/** @type {string} */ (path));
          for (var i = 1; i < arguments.length; ++i) {
            page.callbacks.push(route.middleware(arguments[i]));
          }
          // show <path> with [state]
        } else if ('string' === typeof path) {
          page['string' === typeof fn ? 'redirect' : 'show'](path, fn);
          // start [options]
        } else {
          page.start(path);
        }
      }

      /**
       * Callback functions.
       */

      page.callbacks = [];
      page.exits = [];

      /**
       * Current path being processed
       * @type {string}
       */
      page.current = '';

      /**
       * Number of pages navigated to.
       * @type {number}
       *
       *     page.len == 0;
       *     page('/login');
       *     page.len == 1;
       */

      page.len = 0;

      /**
       * Get or set basepath to `path`.
       *
       * @param {string} path
       * @api public
       */

      page.base = function(path) {
        if (0 === arguments.length) return base;
        base = path;
      };

      /**
       * Bind with the given `options`.
       *
       * Options:
       *
       *    - `click` bind to click events [true]
       *    - `popstate` bind to popstate [true]
       *    - `dispatch` perform initial dispatch [true]
       *
       * @param {Object} options
       * @api public
       */

      page.start = function(options) {
        options = options || {};
        if (running) return;
        running = true;
        if (false === options.dispatch) dispatch = false;
        if (false === options.decodeURLComponents) decodeURLComponents = false;
        if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
        if (false !== options.click) {
          document.addEventListener(clickEvent, onclick, false);
        }
        if (true === options.hashbang) hashbang = true;
        if (!dispatch) return;
        var url = (hashbang && ~location.hash.indexOf('#!')) ? location.hash.substr(2) + location.search : location.pathname + location.search + location.hash;
        page.replace(url, null, true, dispatch);
      };

      /**
       * Unbind click and popstate event handlers.
       *
       * @api public
       */

      page.stop = function() {
        if (!running) return;
        page.current = '';
        page.len = 0;
        running = false;
        document.removeEventListener(clickEvent, onclick, false);
        window.removeEventListener('popstate', onpopstate, false);
      };

      /**
       * Show `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} dispatch
       * @param {boolean=} push
       * @return {!Context}
       * @api public
       */

      page.show = function(path, state, dispatch, push) {
        var ctx = new Context(path, state);
        page.current = ctx.path;
        if (false !== dispatch) page.dispatch(ctx);
        if (false !== ctx.handled && false !== push) ctx.pushState();
        return ctx;
      };

      /**
       * Goes back in the history
       * Back should always let the current route push state and then go back.
       *
       * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
       * @param {Object=} state
       * @api public
       */

      page.back = function(path, state) {
        if (page.len > 0) {
          // this may need more testing to see if all browsers
          // wait for the next tick to go back in history
          history.back();
          page.len--;
        } else if (path) {
          setTimeout(function() {
            page.show(path, state);
          });
        }else{
          setTimeout(function() {
            page.show(base, state);
          });
        }
      };


      /**
       * Register route to redirect from one path to other
       * or just redirect to another route
       *
       * @param {string} from - if param 'to' is undefined redirects to 'from'
       * @param {string=} to
       * @api public
       */
      page.redirect = function(from, to) {
        // Define route from a path to another
        if ('string' === typeof from && 'string' === typeof to) {
          page(from, function(e) {
            setTimeout(function() {
              page.replace(/** @type {!string} */ (to));
            }, 0);
          });
        }

        // Wait for the push state and replace it with another
        if ('string' === typeof from && 'undefined' === typeof to) {
          setTimeout(function() {
            page.replace(from);
          }, 0);
        }
      };

      /**
       * Replace `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} init
       * @param {boolean=} dispatch
       * @return {!Context}
       * @api public
       */


      page.replace = function(path, state, init, dispatch) {
        var ctx = new Context(path, state);
        page.current = ctx.path;
        ctx.init = init;
        ctx.save(); // save before dispatching, which may redirect
        if (false !== dispatch) page.dispatch(ctx);
        return ctx;
      };

      /**
       * Dispatch the given `ctx`.
       *
       * @param {Context} ctx
       * @api private
       */
      page.dispatch = function(ctx) {
        var prev = prevContext,
          i = 0,
          j = 0;

        prevContext = ctx;

        function nextExit() {
          var fn = page.exits[j++];
          if (!fn) return nextEnter();
          fn(prev, nextExit);
        }

        function nextEnter() {
          var fn = page.callbacks[i++];

          if (ctx.path !== page.current) {
            ctx.handled = false;
            return;
          }
          if (!fn) return unhandled(ctx);
          fn(ctx, nextEnter);
        }

        if (prev) {
          nextExit();
        } else {
          nextEnter();
        }
      };

      /**
       * Unhandled `ctx`. When it's not the initial
       * popstate then redirect. If you wish to handle
       * 404s on your own use `page('*', callback)`.
       *
       * @param {Context} ctx
       * @api private
       */
      function unhandled(ctx) {
        if (ctx.handled) return;
        var current;

        if (hashbang) {
          current = base + location.hash.replace('#!', '');
        } else {
          current = location.pathname + location.search;
        }

        if (current === ctx.canonicalPath) return;
        page.stop();
        ctx.handled = false;
        location.href = ctx.canonicalPath;
      }

      /**
       * Register an exit route on `path` with
       * callback `fn()`, which will be called
       * on the previous context when a new
       * page is visited.
       */
      page.exit = function(path, fn) {
        if (typeof path === 'function') {
          return page.exit('*', path);
        }

        var route = new Route(path);
        for (var i = 1; i < arguments.length; ++i) {
          page.exits.push(route.middleware(arguments[i]));
        }
      };

      /**
       * Remove URL encoding from the given `str`.
       * Accommodates whitespace in both x-www-form-urlencoded
       * and regular percent-encoded form.
       *
       * @param {string} val - URL component to decode
       */
      function decodeURLEncodedURIComponent(val) {
        if (typeof val !== 'string') { return val; }
        return decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
      }

      /**
       * Initialize a new "request" `Context`
       * with the given `path` and optional initial `state`.
       *
       * @constructor
       * @param {string} path
       * @param {Object=} state
       * @api public
       */

      function Context(path, state) {
        if ('/' === path[0] && 0 !== path.indexOf(base)) path = base + (hashbang ? '#!' : '') + path;
        var i = path.indexOf('?');

        this.canonicalPath = path;
        this.path = path.replace(base, '') || '/';
        if (hashbang) this.path = this.path.replace('#!', '') || '/';

        this.title = document.title;
        this.state = state || {};
        this.state.path = path;
        this.querystring = ~i ? decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
        this.pathname = decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
        this.params = {};

        // fragment
        this.hash = '';
        if (!hashbang) {
          if (!~this.path.indexOf('#')) return;
          var parts = this.path.split('#');
          this.path = parts[0];
          this.hash = decodeURLEncodedURIComponent(parts[1]) || '';
          this.querystring = this.querystring.split('#')[0];
        }
      }

      /**
       * Expose `Context`.
       */

      page.Context = Context;

      /**
       * Push state.
       *
       * @api private
       */

      Context.prototype.pushState = function() {
        page.len++;
        history.pushState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
      };

      /**
       * Save the context state.
       *
       * @api public
       */

      Context.prototype.save = function() {
        history.replaceState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
      };

      /**
       * Initialize `Route` with the given HTTP `path`,
       * and an array of `callbacks` and `options`.
       *
       * Options:
       *
       *   - `sensitive`    enable case-sensitive routes
       *   - `strict`       enable strict matching for trailing slashes
       *
       * @constructor
       * @param {string} path
       * @param {Object=} options
       * @api private
       */

      function Route(path, options) {
        options = options || {};
        this.path = (path === '*') ? '(.*)' : path;
        this.method = 'GET';
        this.regexp = pathtoRegexp(this.path,
          this.keys = [],
          options);
      }

      /**
       * Expose `Route`.
       */

      page.Route = Route;

      /**
       * Return route middleware with
       * the given callback `fn()`.
       *
       * @param {Function} fn
       * @return {Function}
       * @api public
       */

      Route.prototype.middleware = function(fn) {
        var self = this;
        return function(ctx, next) {
          if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
          next();
        };
      };

      /**
       * Check if this route matches `path`, if so
       * populate `params`.
       *
       * @param {string} path
       * @param {Object} params
       * @return {boolean}
       * @api private
       */

      Route.prototype.match = function(path, params) {
        var keys = this.keys,
          qsIndex = path.indexOf('?'),
          pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
          m = this.regexp.exec(decodeURIComponent(pathname));

        if (!m) return false;

        for (var i = 1, len = m.length; i < len; ++i) {
          var key = keys[i - 1];
          var val = decodeURLEncodedURIComponent(m[i]);
          if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
            params[key.name] = val;
          }
        }

        return true;
      };


      /**
       * Handle "populate" events.
       */

      var onpopstate = (function () {
        var loaded = false;
        if ('undefined' === typeof window) {
          return;
        }
        if (document.readyState === 'complete') {
          loaded = true;
        } else {
          window.addEventListener('load', function() {
            setTimeout(function() {
              loaded = true;
            }, 0);
          });
        }
        return function onpopstate(e) {
          if (!loaded) return;
          if (e.state) {
            var path = e.state.path;
            page.replace(path, e.state);
          } else {
            page.show(location.pathname + location.hash, undefined, undefined, false);
          }
        };
      })();
      /**
       * Handle "click" events.
       */

      function onclick(e) {

        if (1 !== which(e)) return;

        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        if (e.defaultPrevented) return;



        // ensure link
        // use shadow dom when available
        var el = e.path ? e.path[0] : e.target;
        while (el && 'A' !== el.nodeName) el = el.parentNode;
        if (!el || 'A' !== el.nodeName) return;



        // Ignore if tag has
        // 1. "download" attribute
        // 2. rel="external" attribute
        if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

        // ensure non-hash for the same path
        var link = el.getAttribute('href');
        if (!hashbang && el.pathname === location.pathname && (el.hash || '#' === link)) return;



        // Check for mailto: in the href
        if (link && link.indexOf('mailto:') > -1) return;

        // check target
        if (el.target) return;

        // x-origin
        if (!sameOrigin(el.href)) return;



        // rebuild path
        var path = el.pathname + el.search + (el.hash || '');

        // strip leading "/[drive letter]:" on NW.js on Windows
        if (typeof process !== 'undefined' && path.match(/^\/[a-zA-Z]:\//)) {
          path = path.replace(/^\/[a-zA-Z]:\//, '/');
        }

        // same page
        var orig = path;

        if (path.indexOf(base) === 0) {
          path = path.substr(base.length);
        }

        if (hashbang) path = path.replace('#!', '');

        if (base && orig === path) return;

        e.preventDefault();
        page.show(orig);
      }

      /**
       * Event button.
       */

      function which(e) {
        e = e || window.event;
        return null === e.which ? e.button : e.which;
      }

      /**
       * Check if `href` is the same origin.
       */

      function sameOrigin(href) {
        var origin = location.protocol + '//' + location.hostname;
        if (location.port) origin += ':' + location.port;
        return (href && (0 === href.indexOf(origin)));
      }

      page.sameOrigin = sameOrigin;

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var localforage = createCommonjsModule(function (module, exports) {
    /*!
        localForage -- Offline Storage, Improved
        Version 1.4.2
        https://mozilla.github.io/localForage
        (c) 2013-2015 Mozilla, Apache License 2.0
    */
    (function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof commonjsGlobal!=="undefined"){g=commonjsGlobal}else if(typeof self!=="undefined"){g=self}else{g=this}g.localforage = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a='function'=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i='function'=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
    'use strict';
    var immediate = _dereq_(2);

    /* istanbul ignore next */
    function INTERNAL() {}

    var handlers = {};

    var REJECTED = ['REJECTED'];
    var FULFILLED = ['FULFILLED'];
    var PENDING = ['PENDING'];

    module.exports = exports = Promise;

    function Promise(resolver) {
      if (typeof resolver !== 'function') {
        throw new TypeError('resolver must be a function');
      }
      this.state = PENDING;
      this.queue = [];
      this.outcome = void 0;
      if (resolver !== INTERNAL) {
        safelyResolveThenable(this, resolver);
      }
    }

    Promise.prototype["catch"] = function (onRejected) {
      return this.then(null, onRejected);
    };
    Promise.prototype.then = function (onFulfilled, onRejected) {
      if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
        typeof onRejected !== 'function' && this.state === REJECTED) {
        return this;
      }
      var promise = new this.constructor(INTERNAL);
      if (this.state !== PENDING) {
        var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
        unwrap(promise, resolver, this.outcome);
      } else {
        this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
      }

      return promise;
    };
    function QueueItem(promise, onFulfilled, onRejected) {
      this.promise = promise;
      if (typeof onFulfilled === 'function') {
        this.onFulfilled = onFulfilled;
        this.callFulfilled = this.otherCallFulfilled;
      }
      if (typeof onRejected === 'function') {
        this.onRejected = onRejected;
        this.callRejected = this.otherCallRejected;
      }
    }
    QueueItem.prototype.callFulfilled = function (value) {
      handlers.resolve(this.promise, value);
    };
    QueueItem.prototype.otherCallFulfilled = function (value) {
      unwrap(this.promise, this.onFulfilled, value);
    };
    QueueItem.prototype.callRejected = function (value) {
      handlers.reject(this.promise, value);
    };
    QueueItem.prototype.otherCallRejected = function (value) {
      unwrap(this.promise, this.onRejected, value);
    };

    function unwrap(promise, func, value) {
      immediate(function () {
        var returnValue;
        try {
          returnValue = func(value);
        } catch (e) {
          return handlers.reject(promise, e);
        }
        if (returnValue === promise) {
          handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
        } else {
          handlers.resolve(promise, returnValue);
        }
      });
    }

    handlers.resolve = function (self, value) {
      var result = tryCatch(getThen, value);
      if (result.status === 'error') {
        return handlers.reject(self, result.value);
      }
      var thenable = result.value;

      if (thenable) {
        safelyResolveThenable(self, thenable);
      } else {
        self.state = FULFILLED;
        self.outcome = value;
        var i = -1;
        var len = self.queue.length;
        while (++i < len) {
          self.queue[i].callFulfilled(value);
        }
      }
      return self;
    };
    handlers.reject = function (self, error) {
      self.state = REJECTED;
      self.outcome = error;
      var i = -1;
      var len = self.queue.length;
      while (++i < len) {
        self.queue[i].callRejected(error);
      }
      return self;
    };

    function getThen(obj) {
      // Make sure we only access the accessor once as required by the spec
      var then = obj && obj.then;
      if (obj && typeof obj === 'object' && typeof then === 'function') {
        return function appyThen() {
          then.apply(obj, arguments);
        };
      }
    }

    function safelyResolveThenable(self, thenable) {
      // Either fulfill, reject or reject with error
      var called = false;
      function onError(value) {
        if (called) {
          return;
        }
        called = true;
        handlers.reject(self, value);
      }

      function onSuccess(value) {
        if (called) {
          return;
        }
        called = true;
        handlers.resolve(self, value);
      }

      function tryToUnwrap() {
        thenable(onSuccess, onError);
      }

      var result = tryCatch(tryToUnwrap);
      if (result.status === 'error') {
        onError(result.value);
      }
    }

    function tryCatch(func, value) {
      var out = {};
      try {
        out.value = func(value);
        out.status = 'success';
      } catch (e) {
        out.status = 'error';
        out.value = e;
      }
      return out;
    }

    exports.resolve = resolve;
    function resolve(value) {
      if (value instanceof this) {
        return value;
      }
      return handlers.resolve(new this(INTERNAL), value);
    }

    exports.reject = reject;
    function reject(reason) {
      var promise = new this(INTERNAL);
      return handlers.reject(promise, reason);
    }

    exports.all = all;
    function all(iterable) {
      var self = this;
      if (Object.prototype.toString.call(iterable) !== '[object Array]') {
        return this.reject(new TypeError('must be an array'));
      }

      var len = iterable.length;
      var called = false;
      if (!len) {
        return this.resolve([]);
      }

      var values = new Array(len);
      var resolved = 0;
      var i = -1;
      var promise = new this(INTERNAL);

      while (++i < len) {
        allResolver(iterable[i], i);
      }
      return promise;
      function allResolver(value, i) {
        self.resolve(value).then(resolveFromAll, function (error) {
          if (!called) {
            called = true;
            handlers.reject(promise, error);
          }
        });
        function resolveFromAll(outValue) {
          values[i] = outValue;
          if (++resolved === len && !called) {
            called = true;
            handlers.resolve(promise, values);
          }
        }
      }
    }

    exports.race = race;
    function race(iterable) {
      var self = this;
      if (Object.prototype.toString.call(iterable) !== '[object Array]') {
        return this.reject(new TypeError('must be an array'));
      }

      var len = iterable.length;
      var called = false;
      if (!len) {
        return this.resolve([]);
      }

      var i = -1;
      var promise = new this(INTERNAL);

      while (++i < len) {
        resolver(iterable[i]);
      }
      return promise;
      function resolver(value) {
        self.resolve(value).then(function (response) {
          if (!called) {
            called = true;
            handlers.resolve(promise, response);
          }
        }, function (error) {
          if (!called) {
            called = true;
            handlers.reject(promise, error);
          }
        });
      }
    }

    },{"2":2}],2:[function(_dereq_,module,exports){
    (function (global){
    'use strict';
    var Mutation = global.MutationObserver || global.WebKitMutationObserver;

    var scheduleDrain;

    {
      if (Mutation) {
        var called = 0;
        var observer = new Mutation(nextTick);
        var element = global.document.createTextNode('');
        observer.observe(element, {
          characterData: true
        });
        scheduleDrain = function () {
          element.data = (called = ++called % 2);
        };
      } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
        var channel = new global.MessageChannel();
        channel.port1.onmessage = nextTick;
        scheduleDrain = function () {
          channel.port2.postMessage(0);
        };
      } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
        scheduleDrain = function () {

          // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
          // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
          var scriptEl = global.document.createElement('script');
          scriptEl.onreadystatechange = function () {
            nextTick();

            scriptEl.onreadystatechange = null;
            scriptEl.parentNode.removeChild(scriptEl);
            scriptEl = null;
          };
          global.document.documentElement.appendChild(scriptEl);
        };
      } else {
        scheduleDrain = function () {
          setTimeout(nextTick, 0);
        };
      }
    }

    var draining;
    var queue = [];
    //named nextTick for less confusing stack traces
    function nextTick() {
      draining = true;
      var i, oldQueue;
      var len = queue.length;
      while (len) {
        oldQueue = queue;
        queue = [];
        i = -1;
        while (++i < len) {
          oldQueue[i]();
        }
        len = queue.length;
      }
      draining = false;
    }

    module.exports = immediate;
    function immediate(task) {
      if (queue.push(task) === 1 && !draining) {
        scheduleDrain();
      }
    }

    }).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    },{}],3:[function(_dereq_,module,exports){
    (function (global){
    'use strict';
    if (typeof global.Promise !== 'function') {
      global.Promise = _dereq_(1);
    }

    }).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    },{"1":1}],4:[function(_dereq_,module,exports){
    'use strict';

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function getIDB() {
        /* global indexedDB,webkitIndexedDB,mozIndexedDB,OIndexedDB,msIndexedDB */
        if (typeof indexedDB !== 'undefined') {
            return indexedDB;
        }
        if (typeof webkitIndexedDB !== 'undefined') {
            return webkitIndexedDB;
        }
        if (typeof mozIndexedDB !== 'undefined') {
            return mozIndexedDB;
        }
        if (typeof OIndexedDB !== 'undefined') {
            return OIndexedDB;
        }
        if (typeof msIndexedDB !== 'undefined') {
            return msIndexedDB;
        }
    }

    var idb = getIDB();

    function isIndexedDBValid() {
        try {
            // Initialize IndexedDB; fall back to vendor-prefixed versions
            // if needed.
            if (!idb) {
                return false;
            }
            // We mimic PouchDB here; just UA test for Safari (which, as of
            // iOS 8/Yosemite, doesn't properly support IndexedDB).
            // IndexedDB support is broken and different from Blink's.
            // This is faster than the test case (and it's sync), so we just
            // do this. *SIGH*
            // http://bl.ocks.org/nolanlawson/raw/c83e9039edf2278047e9/
            //
            // We test for openDatabase because IE Mobile identifies itself
            // as Safari. Oh the lulz...
            if (typeof openDatabase !== 'undefined' && typeof navigator !== 'undefined' && navigator.userAgent && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
                return false;
            }

            return idb && typeof idb.open === 'function' &&
            // Some Samsung/HTC Android 4.0-4.3 devices
            // have older IndexedDB specs; if this isn't available
            // their IndexedDB is too old for us to use.
            // (Replaces the onupgradeneeded test.)
            typeof IDBKeyRange !== 'undefined';
        } catch (e) {
            return false;
        }
    }

    function isWebSQLValid() {
        return typeof openDatabase === 'function';
    }

    function isLocalStorageValid() {
        try {
            return typeof localStorage !== 'undefined' && 'setItem' in localStorage && localStorage.setItem;
        } catch (e) {
            return false;
        }
    }

    // Abstracts constructing a Blob object, so it also works in older
    // browsers that don't support the native Blob constructor. (i.e.
    // old QtWebKit versions, at least).
    // Abstracts constructing a Blob object, so it also works in older
    // browsers that don't support the native Blob constructor. (i.e.
    // old QtWebKit versions, at least).
    function createBlob(parts, properties) {
        /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
        parts = parts || [];
        properties = properties || {};
        try {
            return new Blob(parts, properties);
        } catch (e) {
            if (e.name !== 'TypeError') {
                throw e;
            }
            var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder : typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : WebKitBlobBuilder;
            var builder = new Builder();
            for (var i = 0; i < parts.length; i += 1) {
                builder.append(parts[i]);
            }
            return builder.getBlob(properties.type);
        }
    }

    // This is CommonJS because lie is an external dependency, so Rollup
    // can just ignore it.
    if (typeof Promise === 'undefined' && typeof _dereq_ !== 'undefined') {
        _dereq_(3);
    }
    var Promise$1 = Promise;

    function executeCallback(promise, callback) {
        if (callback) {
            promise.then(function (result) {
                callback(null, result);
            }, function (error) {
                callback(error);
            });
        }
    }

    // Some code originally from async_storage.js in
    // [Gaia](https://github.com/mozilla-b2g/gaia).

    var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
    var supportsBlobs;
    var dbContexts;

    // Transform a binary string to an array buffer, because otherwise
    // weird stuff happens when you try to work with the binary string directly.
    // It is known.
    // From http://stackoverflow.com/questions/14967647/ (continues on next line)
    // encode-decode-image-with-base64-breaks-image (2013-04-21)
    function _binStringToArrayBuffer(bin) {
        var length = bin.length;
        var buf = new ArrayBuffer(length);
        var arr = new Uint8Array(buf);
        for (var i = 0; i < length; i++) {
            arr[i] = bin.charCodeAt(i);
        }
        return buf;
    }

    //
    // Blobs are not supported in all versions of IndexedDB, notably
    // Chrome <37 and Android <5. In those versions, storing a blob will throw.
    //
    // Various other blob bugs exist in Chrome v37-42 (inclusive).
    // Detecting them is expensive and confusing to users, and Chrome 37-42
    // is at very low usage worldwide, so we do a hacky userAgent check instead.
    //
    // content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
    // 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
    // FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
    //
    // Code borrowed from PouchDB. See:
    // https://github.com/pouchdb/pouchdb/blob/9c25a23/src/adapters/idb/blobSupport.js
    //
    function _checkBlobSupportWithoutCaching(txn) {
        return new Promise$1(function (resolve) {
            var blob = createBlob(['']);
            txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');

            txn.onabort = function (e) {
                // If the transaction aborts now its due to not being able to
                // write to the database, likely due to the disk being full
                e.preventDefault();
                e.stopPropagation();
                resolve(false);
            };

            txn.oncomplete = function () {
                var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
                var matchedEdge = navigator.userAgent.match(/Edge\//);
                // MS Edge pretends to be Chrome 42:
                // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
                resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
            };
        })["catch"](function () {
            return false; // error, so assume unsupported
        });
    }

    function _checkBlobSupport(idb) {
        if (typeof supportsBlobs === 'boolean') {
            return Promise$1.resolve(supportsBlobs);
        }
        return _checkBlobSupportWithoutCaching(idb).then(function (value) {
            supportsBlobs = value;
            return supportsBlobs;
        });
    }

    function _deferReadiness(dbInfo) {
        var dbContext = dbContexts[dbInfo.name];

        // Create a deferred object representing the current database operation.
        var deferredOperation = {};

        deferredOperation.promise = new Promise$1(function (resolve) {
            deferredOperation.resolve = resolve;
        });

        // Enqueue the deferred operation.
        dbContext.deferredOperations.push(deferredOperation);

        // Chain its promise to the database readiness.
        if (!dbContext.dbReady) {
            dbContext.dbReady = deferredOperation.promise;
        } else {
            dbContext.dbReady = dbContext.dbReady.then(function () {
                return deferredOperation.promise;
            });
        }
    }

    function _advanceReadiness(dbInfo) {
        var dbContext = dbContexts[dbInfo.name];

        // Dequeue a deferred operation.
        var deferredOperation = dbContext.deferredOperations.pop();

        // Resolve its promise (which is part of the database readiness
        // chain of promises).
        if (deferredOperation) {
            deferredOperation.resolve();
        }
    }

    function _getConnection(dbInfo, upgradeNeeded) {
        return new Promise$1(function (resolve, reject) {

            if (dbInfo.db) {
                if (upgradeNeeded) {
                    _deferReadiness(dbInfo);
                    dbInfo.db.close();
                } else {
                    return resolve(dbInfo.db);
                }
            }

            var dbArgs = [dbInfo.name];

            if (upgradeNeeded) {
                dbArgs.push(dbInfo.version);
            }

            var openreq = idb.open.apply(idb, dbArgs);

            if (upgradeNeeded) {
                openreq.onupgradeneeded = function (e) {
                    var db = openreq.result;
                    try {
                        db.createObjectStore(dbInfo.storeName);
                        if (e.oldVersion <= 1) {
                            // Added when support for blob shims was added
                            db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                        }
                    } catch (ex) {
                        if (ex.name === 'ConstraintError') {
                            console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + e.oldVersion + ' to version ' + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                        } else {
                            throw ex;
                        }
                    }
                };
            }

            openreq.onerror = function () {
                reject(openreq.error);
            };

            openreq.onsuccess = function () {
                resolve(openreq.result);
                _advanceReadiness(dbInfo);
            };
        });
    }

    function _getOriginalConnection(dbInfo) {
        return _getConnection(dbInfo, false);
    }

    function _getUpgradedConnection(dbInfo) {
        return _getConnection(dbInfo, true);
    }

    function _isUpgradeNeeded(dbInfo, defaultVersion) {
        if (!dbInfo.db) {
            return true;
        }

        var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
        var isDowngrade = dbInfo.version < dbInfo.db.version;
        var isUpgrade = dbInfo.version > dbInfo.db.version;

        if (isDowngrade) {
            // If the version is not the default one
            // then warn for impossible downgrade.
            if (dbInfo.version !== defaultVersion) {
                console.warn('The database "' + dbInfo.name + '"' + ' can\'t be downgraded from version ' + dbInfo.db.version + ' to version ' + dbInfo.version + '.');
            }
            // Align the versions to prevent errors.
            dbInfo.version = dbInfo.db.version;
        }

        if (isUpgrade || isNewStore) {
            // If the store is new then increment the version (if needed).
            // This will trigger an "upgradeneeded" event which is required
            // for creating a store.
            if (isNewStore) {
                var incVersion = dbInfo.db.version + 1;
                if (incVersion > dbInfo.version) {
                    dbInfo.version = incVersion;
                }
            }

            return true;
        }

        return false;
    }

    // encode a blob for indexeddb engines that don't support blobs
    function _encodeBlob(blob) {
        return new Promise$1(function (resolve, reject) {
            var reader = new FileReader();
            reader.onerror = reject;
            reader.onloadend = function (e) {
                var base64 = btoa(e.target.result || '');
                resolve({
                    __local_forage_encoded_blob: true,
                    data: base64,
                    type: blob.type
                });
            };
            reader.readAsBinaryString(blob);
        });
    }

    // decode an encoded blob
    function _decodeBlob(encodedBlob) {
        var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
        return createBlob([arrayBuff], { type: encodedBlob.type });
    }

    // is this one of our fancy encoded blobs?
    function _isEncodedBlob(value) {
        return value && value.__local_forage_encoded_blob;
    }

    // Specialize the default `ready()` function by making it dependent
    // on the current database operations. Thus, the driver will be actually
    // ready when it's been initialized (default) *and* there are no pending
    // operations on the database (initiated by some other instances).
    function _fullyReady(callback) {
        var self = this;

        var promise = self._initReady().then(function () {
            var dbContext = dbContexts[self._dbInfo.name];

            if (dbContext && dbContext.dbReady) {
                return dbContext.dbReady;
            }
        });

        promise.then(callback, callback);
        return promise;
    }

    // Open the IndexedDB database (automatically creates one if one didn't
    // previously exist), using any options set in the config.
    function _initStorage(options) {
        var self = this;
        var dbInfo = {
            db: null
        };

        if (options) {
            for (var i in options) {
                dbInfo[i] = options[i];
            }
        }

        // Initialize a singleton container for all running localForages.
        if (!dbContexts) {
            dbContexts = {};
        }

        // Get the current context of the database;
        var dbContext = dbContexts[dbInfo.name];

        // ...or create a new context.
        if (!dbContext) {
            dbContext = {
                // Running localForages sharing a database.
                forages: [],
                // Shared database.
                db: null,
                // Database readiness (promise).
                dbReady: null,
                // Deferred operations on the database.
                deferredOperations: []
            };
            // Register the new context in the global container.
            dbContexts[dbInfo.name] = dbContext;
        }

        // Register itself as a running localForage in the current context.
        dbContext.forages.push(self);

        // Replace the default `ready()` function with the specialized one.
        if (!self._initReady) {
            self._initReady = self.ready;
            self.ready = _fullyReady;
        }

        // Create an array of initialization states of the related localForages.
        var initPromises = [];

        function ignoreErrors() {
            // Don't handle errors here,
            // just makes sure related localForages aren't pending.
            return Promise$1.resolve();
        }

        for (var j = 0; j < dbContext.forages.length; j++) {
            var forage = dbContext.forages[j];
            if (forage !== self) {
                // Don't wait for itself...
                initPromises.push(forage._initReady()["catch"](ignoreErrors));
            }
        }

        // Take a snapshot of the related localForages.
        var forages = dbContext.forages.slice(0);

        // Initialize the connection process only when
        // all the related localForages aren't pending.
        return Promise$1.all(initPromises).then(function () {
            dbInfo.db = dbContext.db;
            // Get the connection or open a new one without upgrade.
            return _getOriginalConnection(dbInfo);
        }).then(function (db) {
            dbInfo.db = db;
            if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
                // Reopen the database for upgrading.
                return _getUpgradedConnection(dbInfo);
            }
            return db;
        }).then(function (db) {
            dbInfo.db = dbContext.db = db;
            self._dbInfo = dbInfo;
            // Share the final connection amongst related localForages.
            for (var k = 0; k < forages.length; k++) {
                var forage = forages[k];
                if (forage !== self) {
                    // Self is already up-to-date.
                    forage._dbInfo.db = dbInfo.db;
                    forage._dbInfo.version = dbInfo.version;
                }
            }
        });
    }

    function getItem(key, callback) {
        var self = this;

        // Cast the key to a string, as that's all we can set as a key.
        if (typeof key !== 'string') {
            console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
        }

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
                var req = store.get(key);

                req.onsuccess = function () {
                    var value = req.result;
                    if (value === undefined) {
                        value = null;
                    }
                    if (_isEncodedBlob(value)) {
                        value = _decodeBlob(value);
                    }
                    resolve(value);
                };

                req.onerror = function () {
                    reject(req.error);
                };
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Iterate over all items stored in database.
    function iterate(iterator, callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);

                var req = store.openCursor();
                var iterationNumber = 1;

                req.onsuccess = function () {
                    var cursor = req.result;

                    if (cursor) {
                        var value = cursor.value;
                        if (_isEncodedBlob(value)) {
                            value = _decodeBlob(value);
                        }
                        var result = iterator(value, cursor.key, iterationNumber++);

                        if (result !== void 0) {
                            resolve(result);
                        } else {
                            cursor["continue"]();
                        }
                    } else {
                        resolve();
                    }
                };

                req.onerror = function () {
                    reject(req.error);
                };
            })["catch"](reject);
        });

        executeCallback(promise, callback);

        return promise;
    }

    function setItem(key, value, callback) {
        var self = this;

        // Cast the key to a string, as that's all we can set as a key.
        if (typeof key !== 'string') {
            console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
        }

        var promise = new Promise$1(function (resolve, reject) {
            var dbInfo;
            self.ready().then(function () {
                dbInfo = self._dbInfo;
                if (value instanceof Blob) {
                    return _checkBlobSupport(dbInfo.db).then(function (blobSupport) {
                        if (blobSupport) {
                            return value;
                        }
                        return _encodeBlob(value);
                    });
                }
                return value;
            }).then(function (value) {
                var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
                var store = transaction.objectStore(dbInfo.storeName);

                // The reason we don't _save_ null is because IE 10 does
                // not support saving the `null` type in IndexedDB. How
                // ironic, given the bug below!
                // See: https://github.com/mozilla/localForage/issues/161
                if (value === null) {
                    value = undefined;
                }

                transaction.oncomplete = function () {
                    // Cast to undefined so the value passed to
                    // callback/promise is the same as what one would get out
                    // of `getItem()` later. This leads to some weirdness
                    // (setItem('foo', undefined) will return `null`), but
                    // it's not my fault localStorage is our baseline and that
                    // it's weird.
                    if (value === undefined) {
                        value = null;
                    }

                    resolve(value);
                };
                transaction.onabort = transaction.onerror = function () {
                    var err = req.error ? req.error : req.transaction.error;
                    reject(err);
                };

                var req = store.put(value, key);
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function removeItem(key, callback) {
        var self = this;

        // Cast the key to a string, as that's all we can set as a key.
        if (typeof key !== 'string') {
            console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
        }

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
                var store = transaction.objectStore(dbInfo.storeName);

                // We use a Grunt task to make this safe for IE and some
                // versions of Android (including those used by Cordova).
                // Normally IE won't like `.delete()` and will insist on
                // using `['delete']()`, but we have a build step that
                // fixes this for us now.
                var req = store["delete"](key);
                transaction.oncomplete = function () {
                    resolve();
                };

                transaction.onerror = function () {
                    reject(req.error);
                };

                // The request will be also be aborted if we've exceeded our storage
                // space.
                transaction.onabort = function () {
                    var err = req.error ? req.error : req.transaction.error;
                    reject(err);
                };
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function clear(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
                var store = transaction.objectStore(dbInfo.storeName);
                var req = store.clear();

                transaction.oncomplete = function () {
                    resolve();
                };

                transaction.onabort = transaction.onerror = function () {
                    var err = req.error ? req.error : req.transaction.error;
                    reject(err);
                };
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function length(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
                var req = store.count();

                req.onsuccess = function () {
                    resolve(req.result);
                };

                req.onerror = function () {
                    reject(req.error);
                };
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function key(n, callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            if (n < 0) {
                resolve(null);

                return;
            }

            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);

                var advanced = false;
                var req = store.openCursor();
                req.onsuccess = function () {
                    var cursor = req.result;
                    if (!cursor) {
                        // this means there weren't enough keys
                        resolve(null);

                        return;
                    }

                    if (n === 0) {
                        // We have the first key, return it if that's what they
                        // wanted.
                        resolve(cursor.key);
                    } else {
                        if (!advanced) {
                            // Otherwise, ask the cursor to skip ahead n
                            // records.
                            advanced = true;
                            cursor.advance(n);
                        } else {
                            // When we get here, we've got the nth key.
                            resolve(cursor.key);
                        }
                    }
                };

                req.onerror = function () {
                    reject(req.error);
                };
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function keys(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);

                var req = store.openCursor();
                var keys = [];

                req.onsuccess = function () {
                    var cursor = req.result;

                    if (!cursor) {
                        resolve(keys);
                        return;
                    }

                    keys.push(cursor.key);
                    cursor["continue"]();
                };

                req.onerror = function () {
                    reject(req.error);
                };
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    var asyncStorage = {
        _driver: 'asyncStorage',
        _initStorage: _initStorage,
        iterate: iterate,
        getItem: getItem,
        setItem: setItem,
        removeItem: removeItem,
        clear: clear,
        length: length,
        key: key,
        keys: keys
    };

    // Sadly, the best way to save binary data in WebSQL/localStorage is serializing
    // it to Base64, so this is how we store it to prevent very strange errors with less
    // verbose ways of binary <-> string data storage.
    var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    var BLOB_TYPE_PREFIX = '~~local_forage_type~';
    var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;

    var SERIALIZED_MARKER = '__lfsc__:';
    var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;

    // OMG the serializations!
    var TYPE_ARRAYBUFFER = 'arbf';
    var TYPE_BLOB = 'blob';
    var TYPE_INT8ARRAY = 'si08';
    var TYPE_UINT8ARRAY = 'ui08';
    var TYPE_UINT8CLAMPEDARRAY = 'uic8';
    var TYPE_INT16ARRAY = 'si16';
    var TYPE_INT32ARRAY = 'si32';
    var TYPE_UINT16ARRAY = 'ur16';
    var TYPE_UINT32ARRAY = 'ui32';
    var TYPE_FLOAT32ARRAY = 'fl32';
    var TYPE_FLOAT64ARRAY = 'fl64';
    var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;

    function stringToBuffer(serializedString) {
        // Fill the string into a ArrayBuffer.
        var bufferLength = serializedString.length * 0.75;
        var len = serializedString.length;
        var i;
        var p = 0;
        var encoded1, encoded2, encoded3, encoded4;

        if (serializedString[serializedString.length - 1] === '=') {
            bufferLength--;
            if (serializedString[serializedString.length - 2] === '=') {
                bufferLength--;
            }
        }

        var buffer = new ArrayBuffer(bufferLength);
        var bytes = new Uint8Array(buffer);

        for (i = 0; i < len; i += 4) {
            encoded1 = BASE_CHARS.indexOf(serializedString[i]);
            encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
            encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
            encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);

            /*jslint bitwise: true */
            bytes[p++] = encoded1 << 2 | encoded2 >> 4;
            bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
            bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
        }
        return buffer;
    }

    // Converts a buffer to a string to store, serialized, in the backend
    // storage library.
    function bufferToString(buffer) {
        // base64-arraybuffer
        var bytes = new Uint8Array(buffer);
        var base64String = '';
        var i;

        for (i = 0; i < bytes.length; i += 3) {
            /*jslint bitwise: true */
            base64String += BASE_CHARS[bytes[i] >> 2];
            base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
            base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
            base64String += BASE_CHARS[bytes[i + 2] & 63];
        }

        if (bytes.length % 3 === 2) {
            base64String = base64String.substring(0, base64String.length - 1) + '=';
        } else if (bytes.length % 3 === 1) {
            base64String = base64String.substring(0, base64String.length - 2) + '==';
        }

        return base64String;
    }

    // Serialize a value, afterwards executing a callback (which usually
    // instructs the `setItem()` callback/promise to be executed). This is how
    // we store binary data with localStorage.
    function serialize(value, callback) {
        var valueString = '';
        if (value) {
            valueString = value.toString();
        }

        // Cannot use `value instanceof ArrayBuffer` or such here, as these
        // checks fail when running the tests using casper.js...
        //
        // TODO: See why those tests fail and use a better solution.
        if (value && (value.toString() === '[object ArrayBuffer]' || value.buffer && value.buffer.toString() === '[object ArrayBuffer]')) {
            // Convert binary arrays to a string and prefix the string with
            // a special marker.
            var buffer;
            var marker = SERIALIZED_MARKER;

            if (value instanceof ArrayBuffer) {
                buffer = value;
                marker += TYPE_ARRAYBUFFER;
            } else {
                buffer = value.buffer;

                if (valueString === '[object Int8Array]') {
                    marker += TYPE_INT8ARRAY;
                } else if (valueString === '[object Uint8Array]') {
                    marker += TYPE_UINT8ARRAY;
                } else if (valueString === '[object Uint8ClampedArray]') {
                    marker += TYPE_UINT8CLAMPEDARRAY;
                } else if (valueString === '[object Int16Array]') {
                    marker += TYPE_INT16ARRAY;
                } else if (valueString === '[object Uint16Array]') {
                    marker += TYPE_UINT16ARRAY;
                } else if (valueString === '[object Int32Array]') {
                    marker += TYPE_INT32ARRAY;
                } else if (valueString === '[object Uint32Array]') {
                    marker += TYPE_UINT32ARRAY;
                } else if (valueString === '[object Float32Array]') {
                    marker += TYPE_FLOAT32ARRAY;
                } else if (valueString === '[object Float64Array]') {
                    marker += TYPE_FLOAT64ARRAY;
                } else {
                    callback(new Error('Failed to get type for BinaryArray'));
                }
            }

            callback(marker + bufferToString(buffer));
        } else if (valueString === '[object Blob]') {
            // Conver the blob to a binaryArray and then to a string.
            var fileReader = new FileReader();

            fileReader.onload = function () {
                // Backwards-compatible prefix for the blob type.
                var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);

                callback(SERIALIZED_MARKER + TYPE_BLOB + str);
            };

            fileReader.readAsArrayBuffer(value);
        } else {
            try {
                callback(JSON.stringify(value));
            } catch (e) {
                console.error("Couldn't convert value into a JSON string: ", value);

                callback(null, e);
            }
        }
    }

    // Deserialize data we've inserted into a value column/field. We place
    // special markers into our strings to mark them as encoded; this isn't
    // as nice as a meta field, but it's the only sane thing we can do whilst
    // keeping localStorage support intact.
    //
    // Oftentimes this will just deserialize JSON content, but if we have a
    // special marker (SERIALIZED_MARKER, defined above), we will extract
    // some kind of arraybuffer/binary data/typed array out of the string.
    function deserialize(value) {
        // If we haven't marked this string as being specially serialized (i.e.
        // something other than serialized JSON), we can just return it and be
        // done with it.
        if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
            return JSON.parse(value);
        }

        // The following code deals with deserializing some kind of Blob or
        // TypedArray. First we separate out the type of data we're dealing
        // with from the data itself.
        var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
        var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);

        var blobType;
        // Backwards-compatible blob type serialization strategy.
        // DBs created with older versions of localForage will simply not have the blob type.
        if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
            var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
            blobType = matcher[1];
            serializedString = serializedString.substring(matcher[0].length);
        }
        var buffer = stringToBuffer(serializedString);

        // Return the right type based on the code/type set during
        // serialization.
        switch (type) {
            case TYPE_ARRAYBUFFER:
                return buffer;
            case TYPE_BLOB:
                return createBlob([buffer], { type: blobType });
            case TYPE_INT8ARRAY:
                return new Int8Array(buffer);
            case TYPE_UINT8ARRAY:
                return new Uint8Array(buffer);
            case TYPE_UINT8CLAMPEDARRAY:
                return new Uint8ClampedArray(buffer);
            case TYPE_INT16ARRAY:
                return new Int16Array(buffer);
            case TYPE_UINT16ARRAY:
                return new Uint16Array(buffer);
            case TYPE_INT32ARRAY:
                return new Int32Array(buffer);
            case TYPE_UINT32ARRAY:
                return new Uint32Array(buffer);
            case TYPE_FLOAT32ARRAY:
                return new Float32Array(buffer);
            case TYPE_FLOAT64ARRAY:
                return new Float64Array(buffer);
            default:
                throw new Error('Unkown type: ' + type);
        }
    }

    var localforageSerializer = {
        serialize: serialize,
        deserialize: deserialize,
        stringToBuffer: stringToBuffer,
        bufferToString: bufferToString
    };

    /*
     * Includes code from:
     *
     * base64-arraybuffer
     * https://github.com/niklasvh/base64-arraybuffer
     *
     * Copyright (c) 2012 Niklas von Hertzen
     * Licensed under the MIT license.
     */
    // Open the WebSQL database (automatically creates one if one didn't
    // previously exist), using any options set in the config.
    function _initStorage$1(options) {
        var self = this;
        var dbInfo = {
            db: null
        };

        if (options) {
            for (var i in options) {
                dbInfo[i] = typeof options[i] !== 'string' ? options[i].toString() : options[i];
            }
        }

        var dbInfoPromise = new Promise$1(function (resolve, reject) {
            // Open the database; the openDatabase API will automatically
            // create it for us if it doesn't exist.
            try {
                dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
            } catch (e) {
                return reject(e);
            }

            // Create our key/value table if it doesn't exist.
            dbInfo.db.transaction(function (t) {
                t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' (id INTEGER PRIMARY KEY, key unique, value)', [], function () {
                    self._dbInfo = dbInfo;
                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            });
        });

        dbInfo.serializer = localforageSerializer;
        return dbInfoPromise;
    }

    function getItem$1(key, callback) {
        var self = this;

        // Cast the key to a string, as that's all we can set as a key.
        if (typeof key !== 'string') {
            console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
        }

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    t.executeSql('SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function (t, results) {
                        var result = results.rows.length ? results.rows.item(0).value : null;

                        // Check to see if this is serialized content we need to
                        // unpack.
                        if (result) {
                            result = dbInfo.serializer.deserialize(result);
                        }

                        resolve(result);
                    }, function (t, error) {

                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function iterate$1(iterator, callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;

                dbInfo.db.transaction(function (t) {
                    t.executeSql('SELECT * FROM ' + dbInfo.storeName, [], function (t, results) {
                        var rows = results.rows;
                        var length = rows.length;

                        for (var i = 0; i < length; i++) {
                            var item = rows.item(i);
                            var result = item.value;

                            // Check to see if this is serialized content
                            // we need to unpack.
                            if (result) {
                                result = dbInfo.serializer.deserialize(result);
                            }

                            result = iterator(result, item.key, i + 1);

                            // void(0) prevents problems with redefinition
                            // of `undefined`.
                            if (result !== void 0) {
                                resolve(result);
                                return;
                            }
                        }

                        resolve();
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function setItem$1(key, value, callback) {
        var self = this;

        // Cast the key to a string, as that's all we can set as a key.
        if (typeof key !== 'string') {
            console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
        }

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                // The localStorage API doesn't return undefined values in an
                // "expected" way, so undefined is always cast to null in all
                // drivers. See: https://github.com/mozilla/localForage/pull/42
                if (value === undefined) {
                    value = null;
                }

                // Save the original value to pass to the callback.
                var originalValue = value;

                var dbInfo = self._dbInfo;
                dbInfo.serializer.serialize(value, function (value, error) {
                    if (error) {
                        reject(error);
                    } else {
                        dbInfo.db.transaction(function (t) {
                            t.executeSql('INSERT OR REPLACE INTO ' + dbInfo.storeName + ' (key, value) VALUES (?, ?)', [key, value], function () {
                                resolve(originalValue);
                            }, function (t, error) {
                                reject(error);
                            });
                        }, function (sqlError) {
                            // The transaction failed; check
                            // to see if it's a quota error.
                            if (sqlError.code === sqlError.QUOTA_ERR) {
                                // We reject the callback outright for now, but
                                // it's worth trying to re-run the transaction.
                                // Even if the user accepts the prompt to use
                                // more storage on Safari, this error will
                                // be called.
                                //
                                // TODO: Try to re-run the transaction.
                                reject(sqlError);
                            }
                        });
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function removeItem$1(key, callback) {
        var self = this;

        // Cast the key to a string, as that's all we can set as a key.
        if (typeof key !== 'string') {
            console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
        }

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    t.executeSql('DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function () {
                        resolve();
                    }, function (t, error) {

                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Deletes every item in the table.
    // TODO: Find out if this resets the AUTO_INCREMENT number.
    function clear$1(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    t.executeSql('DELETE FROM ' + dbInfo.storeName, [], function () {
                        resolve();
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Does a simple `COUNT(key)` to get the number of items stored in
    // localForage.
    function length$1(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    // Ahhh, SQL makes this one soooooo easy.
                    t.executeSql('SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function (t, results) {
                        var result = results.rows.item(0).c;

                        resolve(result);
                    }, function (t, error) {

                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Return the key located at key index X; essentially gets the key from a
    // `WHERE id = ?`. This is the most efficient way I can think to implement
    // this rarely-used (in my experience) part of the API, but it can seem
    // inconsistent, because we do `INSERT OR REPLACE INTO` on `setItem()`, so
    // the ID of each key will change every time it's updated. Perhaps a stored
    // procedure for the `setItem()` SQL would solve this problem?
    // TODO: Don't change ID on `setItem()`.
    function key$1(n, callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    t.executeSql('SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function (t, results) {
                        var result = results.rows.length ? results.rows.item(0).key : null;
                        resolve(result);
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function keys$1(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    t.executeSql('SELECT key FROM ' + dbInfo.storeName, [], function (t, results) {
                        var keys = [];

                        for (var i = 0; i < results.rows.length; i++) {
                            keys.push(results.rows.item(i).key);
                        }

                        resolve(keys);
                    }, function (t, error) {

                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    var webSQLStorage = {
        _driver: 'webSQLStorage',
        _initStorage: _initStorage$1,
        iterate: iterate$1,
        getItem: getItem$1,
        setItem: setItem$1,
        removeItem: removeItem$1,
        clear: clear$1,
        length: length$1,
        key: key$1,
        keys: keys$1
    };

    // Config the localStorage backend, using options set in the config.
    function _initStorage$2(options) {
        var self = this;
        var dbInfo = {};
        if (options) {
            for (var i in options) {
                dbInfo[i] = options[i];
            }
        }

        dbInfo.keyPrefix = dbInfo.name + '/';

        if (dbInfo.storeName !== self._defaultConfig.storeName) {
            dbInfo.keyPrefix += dbInfo.storeName + '/';
        }

        self._dbInfo = dbInfo;
        dbInfo.serializer = localforageSerializer;

        return Promise$1.resolve();
    }

    // Remove all keys from the datastore, effectively destroying all data in
    // the app's key/value store!
    function clear$2(callback) {
        var self = this;
        var promise = self.ready().then(function () {
            var keyPrefix = self._dbInfo.keyPrefix;

            for (var i = localStorage.length - 1; i >= 0; i--) {
                var key = localStorage.key(i);

                if (key.indexOf(keyPrefix) === 0) {
                    localStorage.removeItem(key);
                }
            }
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Retrieve an item from the store. Unlike the original async_storage
    // library in Gaia, we don't modify return values at all. If a key's value
    // is `undefined`, we pass that value to the callback function.
    function getItem$2(key, callback) {
        var self = this;

        // Cast the key to a string, as that's all we can set as a key.
        if (typeof key !== 'string') {
            console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
        }

        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var result = localStorage.getItem(dbInfo.keyPrefix + key);

            // If a result was found, parse it from the serialized
            // string into a JS object. If result isn't truthy, the key
            // is likely undefined and we'll pass it straight to the
            // callback.
            if (result) {
                result = dbInfo.serializer.deserialize(result);
            }

            return result;
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Iterate over all items in the store.
    function iterate$2(iterator, callback) {
        var self = this;

        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var keyPrefix = dbInfo.keyPrefix;
            var keyPrefixLength = keyPrefix.length;
            var length = localStorage.length;

            // We use a dedicated iterator instead of the `i` variable below
            // so other keys we fetch in localStorage aren't counted in
            // the `iterationNumber` argument passed to the `iterate()`
            // callback.
            //
            // See: github.com/mozilla/localForage/pull/435#discussion_r38061530
            var iterationNumber = 1;

            for (var i = 0; i < length; i++) {
                var key = localStorage.key(i);
                if (key.indexOf(keyPrefix) !== 0) {
                    continue;
                }
                var value = localStorage.getItem(key);

                // If a result was found, parse it from the serialized
                // string into a JS object. If result isn't truthy, the
                // key is likely undefined and we'll pass it straight
                // to the iterator.
                if (value) {
                    value = dbInfo.serializer.deserialize(value);
                }

                value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);

                if (value !== void 0) {
                    return value;
                }
            }
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Same as localStorage's key() method, except takes a callback.
    function key$2(n, callback) {
        var self = this;
        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var result;
            try {
                result = localStorage.key(n);
            } catch (error) {
                result = null;
            }

            // Remove the prefix from the key, if a key is found.
            if (result) {
                result = result.substring(dbInfo.keyPrefix.length);
            }

            return result;
        });

        executeCallback(promise, callback);
        return promise;
    }

    function keys$2(callback) {
        var self = this;
        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var length = localStorage.length;
            var keys = [];

            for (var i = 0; i < length; i++) {
                if (localStorage.key(i).indexOf(dbInfo.keyPrefix) === 0) {
                    keys.push(localStorage.key(i).substring(dbInfo.keyPrefix.length));
                }
            }

            return keys;
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Supply the number of keys in the datastore to the callback function.
    function length$2(callback) {
        var self = this;
        var promise = self.keys().then(function (keys) {
            return keys.length;
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Remove an item from the store, nice and simple.
    function removeItem$2(key, callback) {
        var self = this;

        // Cast the key to a string, as that's all we can set as a key.
        if (typeof key !== 'string') {
            console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
        }

        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            localStorage.removeItem(dbInfo.keyPrefix + key);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Set a key's value and run an optional callback once the value is set.
    // Unlike Gaia's implementation, the callback function is passed the value,
    // in case you want to operate on that value only after you're sure it
    // saved, or something like that.
    function setItem$2(key, value, callback) {
        var self = this;

        // Cast the key to a string, as that's all we can set as a key.
        if (typeof key !== 'string') {
            console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
        }

        var promise = self.ready().then(function () {
            // Convert undefined values to null.
            // https://github.com/mozilla/localForage/pull/42
            if (value === undefined) {
                value = null;
            }

            // Save the original value to pass to the callback.
            var originalValue = value;

            return new Promise$1(function (resolve, reject) {
                var dbInfo = self._dbInfo;
                dbInfo.serializer.serialize(value, function (value, error) {
                    if (error) {
                        reject(error);
                    } else {
                        try {
                            localStorage.setItem(dbInfo.keyPrefix + key, value);
                            resolve(originalValue);
                        } catch (e) {
                            // localStorage capacity exceeded.
                            // TODO: Make this a specific error/event.
                            if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                                reject(e);
                            }
                            reject(e);
                        }
                    }
                });
            });
        });

        executeCallback(promise, callback);
        return promise;
    }

    var localStorageWrapper = {
        _driver: 'localStorageWrapper',
        _initStorage: _initStorage$2,
        // Default API, from Gaia/localStorage.
        iterate: iterate$2,
        getItem: getItem$2,
        setItem: setItem$2,
        removeItem: removeItem$2,
        clear: clear$2,
        length: length$2,
        key: key$2,
        keys: keys$2
    };

    function executeTwoCallbacks(promise, callback, errorCallback) {
        if (typeof callback === 'function') {
            promise.then(callback);
        }

        if (typeof errorCallback === 'function') {
            promise["catch"](errorCallback);
        }
    }

    // Custom drivers are stored here when `defineDriver()` is called.
    // They are shared across all instances of localForage.
    var CustomDrivers = {};

    var DriverType = {
        INDEXEDDB: 'asyncStorage',
        LOCALSTORAGE: 'localStorageWrapper',
        WEBSQL: 'webSQLStorage'
    };

    var DefaultDriverOrder = [DriverType.INDEXEDDB, DriverType.WEBSQL, DriverType.LOCALSTORAGE];

    var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'];

    var DefaultConfig = {
        description: '',
        driver: DefaultDriverOrder.slice(),
        name: 'localforage',
        // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
        // we can use without a prompt.
        size: 4980736,
        storeName: 'keyvaluepairs',
        version: 1.0
    };

    var driverSupport = {};
    // Check to see if IndexedDB is available and if it is the latest
    // implementation; it's our preferred backend library. We use "_spec_test"
    // as the name of the database because it's not the one we'll operate on,
    // but it's useful to make sure its using the right spec.
    // See: https://github.com/mozilla/localForage/issues/128
    driverSupport[DriverType.INDEXEDDB] = isIndexedDBValid();

    driverSupport[DriverType.WEBSQL] = isWebSQLValid();

    driverSupport[DriverType.LOCALSTORAGE] = isLocalStorageValid();

    var isArray = Array.isArray || function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };

    function callWhenReady(localForageInstance, libraryMethod) {
        localForageInstance[libraryMethod] = function () {
            var _args = arguments;
            return localForageInstance.ready().then(function () {
                return localForageInstance[libraryMethod].apply(localForageInstance, _args);
            });
        };
    }

    function extend() {
        for (var i = 1; i < arguments.length; i++) {
            var arg = arguments[i];

            if (arg) {
                for (var key in arg) {
                    if (arg.hasOwnProperty(key)) {
                        if (isArray(arg[key])) {
                            arguments[0][key] = arg[key].slice();
                        } else {
                            arguments[0][key] = arg[key];
                        }
                    }
                }
            }
        }

        return arguments[0];
    }

    function isLibraryDriver(driverName) {
        for (var driver in DriverType) {
            if (DriverType.hasOwnProperty(driver) && DriverType[driver] === driverName) {
                return true;
            }
        }

        return false;
    }

    var LocalForage = function () {
        function LocalForage(options) {
            _classCallCheck(this, LocalForage);

            this.INDEXEDDB = DriverType.INDEXEDDB;
            this.LOCALSTORAGE = DriverType.LOCALSTORAGE;
            this.WEBSQL = DriverType.WEBSQL;

            this._defaultConfig = extend({}, DefaultConfig);
            this._config = extend({}, this._defaultConfig, options);
            this._driverSet = null;
            this._initDriver = null;
            this._ready = false;
            this._dbInfo = null;

            this._wrapLibraryMethodsWithReady();
            this.setDriver(this._config.driver);
        }

        // Set any config values for localForage; can be called anytime before
        // the first API call (e.g. `getItem`, `setItem`).
        // We loop through options so we don't overwrite existing config
        // values.


        LocalForage.prototype.config = function config(options) {
            // If the options argument is an object, we use it to set values.
            // Otherwise, we return either a specified config value or all
            // config values.
            if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
                // If localforage is ready and fully initialized, we can't set
                // any new configuration values. Instead, we return an error.
                if (this._ready) {
                    return new Error("Can't call config() after localforage " + 'has been used.');
                }

                for (var i in options) {
                    if (i === 'storeName') {
                        options[i] = options[i].replace(/\W/g, '_');
                    }

                    this._config[i] = options[i];
                }

                // after all config options are set and
                // the driver option is used, try setting it
                if ('driver' in options && options.driver) {
                    this.setDriver(this._config.driver);
                }

                return true;
            } else if (typeof options === 'string') {
                return this._config[options];
            } else {
                return this._config;
            }
        };

        // Used to define a custom driver, shared across all instances of
        // localForage.


        LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
            var promise = new Promise$1(function (resolve, reject) {
                try {
                    var driverName = driverObject._driver;
                    var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');
                    var namingError = new Error('Custom driver name already in use: ' + driverObject._driver);

                    // A driver name should be defined and not overlap with the
                    // library-defined, default drivers.
                    if (!driverObject._driver) {
                        reject(complianceError);
                        return;
                    }
                    if (isLibraryDriver(driverObject._driver)) {
                        reject(namingError);
                        return;
                    }

                    var customDriverMethods = LibraryMethods.concat('_initStorage');
                    for (var i = 0; i < customDriverMethods.length; i++) {
                        var customDriverMethod = customDriverMethods[i];
                        if (!customDriverMethod || !driverObject[customDriverMethod] || typeof driverObject[customDriverMethod] !== 'function') {
                            reject(complianceError);
                            return;
                        }
                    }

                    var supportPromise = Promise$1.resolve(true);
                    if ('_support' in driverObject) {
                        if (driverObject._support && typeof driverObject._support === 'function') {
                            supportPromise = driverObject._support();
                        } else {
                            supportPromise = Promise$1.resolve(!!driverObject._support);
                        }
                    }

                    supportPromise.then(function (supportResult) {
                        driverSupport[driverName] = supportResult;
                        CustomDrivers[driverName] = driverObject;
                        resolve();
                    }, reject);
                } catch (e) {
                    reject(e);
                }
            });

            executeTwoCallbacks(promise, callback, errorCallback);
            return promise;
        };

        LocalForage.prototype.driver = function driver() {
            return this._driver || null;
        };

        LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
            var self = this;
            var getDriverPromise = Promise$1.resolve().then(function () {
                if (isLibraryDriver(driverName)) {
                    switch (driverName) {
                        case self.INDEXEDDB:
                            return asyncStorage;
                        case self.LOCALSTORAGE:
                            return localStorageWrapper;
                        case self.WEBSQL:
                            return webSQLStorage;
                    }
                } else if (CustomDrivers[driverName]) {
                    return CustomDrivers[driverName];
                } else {
                    throw new Error('Driver not found.');
                }
            });
            executeTwoCallbacks(getDriverPromise, callback, errorCallback);
            return getDriverPromise;
        };

        LocalForage.prototype.getSerializer = function getSerializer(callback) {
            var serializerPromise = Promise$1.resolve(localforageSerializer);
            executeTwoCallbacks(serializerPromise, callback);
            return serializerPromise;
        };

        LocalForage.prototype.ready = function ready(callback) {
            var self = this;

            var promise = self._driverSet.then(function () {
                if (self._ready === null) {
                    self._ready = self._initDriver();
                }

                return self._ready;
            });

            executeTwoCallbacks(promise, callback, callback);
            return promise;
        };

        LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
            var self = this;

            if (!isArray(drivers)) {
                drivers = [drivers];
            }

            var supportedDrivers = this._getSupportedDrivers(drivers);

            function setDriverToConfig() {
                self._config.driver = self.driver();
            }

            function initDriver(supportedDrivers) {
                return function () {
                    var currentDriverIndex = 0;

                    function driverPromiseLoop() {
                        while (currentDriverIndex < supportedDrivers.length) {
                            var driverName = supportedDrivers[currentDriverIndex];
                            currentDriverIndex++;

                            self._dbInfo = null;
                            self._ready = null;

                            return self.getDriver(driverName).then(function (driver) {
                                self._extend(driver);
                                setDriverToConfig();

                                self._ready = self._initStorage(self._config);
                                return self._ready;
                            })["catch"](driverPromiseLoop);
                        }

                        setDriverToConfig();
                        var error = new Error('No available storage method found.');
                        self._driverSet = Promise$1.reject(error);
                        return self._driverSet;
                    }

                    return driverPromiseLoop();
                };
            }

            // There might be a driver initialization in progress
            // so wait for it to finish in order to avoid a possible
            // race condition to set _dbInfo
            var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function () {
                return Promise$1.resolve();
            }) : Promise$1.resolve();

            this._driverSet = oldDriverSetDone.then(function () {
                var driverName = supportedDrivers[0];
                self._dbInfo = null;
                self._ready = null;

                return self.getDriver(driverName).then(function (driver) {
                    self._driver = driver._driver;
                    setDriverToConfig();
                    self._wrapLibraryMethodsWithReady();
                    self._initDriver = initDriver(supportedDrivers);
                });
            })["catch"](function () {
                setDriverToConfig();
                var error = new Error('No available storage method found.');
                self._driverSet = Promise$1.reject(error);
                return self._driverSet;
            });

            executeTwoCallbacks(this._driverSet, callback, errorCallback);
            return this._driverSet;
        };

        LocalForage.prototype.supports = function supports(driverName) {
            return !!driverSupport[driverName];
        };

        LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
            extend(this, libraryMethodsAndProperties);
        };

        LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
            var supportedDrivers = [];
            for (var i = 0, len = drivers.length; i < len; i++) {
                var driverName = drivers[i];
                if (this.supports(driverName)) {
                    supportedDrivers.push(driverName);
                }
            }
            return supportedDrivers;
        };

        LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
            // Add a stub for each driver API method that delays the call to the
            // corresponding driver method until localForage is ready. These stubs
            // will be replaced by the driver methods as soon as the driver is
            // loaded, so there is no performance impact.
            for (var i = 0; i < LibraryMethods.length; i++) {
                callWhenReady(this, LibraryMethods[i]);
            }
        };

        LocalForage.prototype.createInstance = function createInstance(options) {
            return new LocalForage(options);
        };

        return LocalForage;
    }();

    // The actual localForage object that we expose as a module or via a
    // global. It's extended by pulling in one of our other libraries.


    var localforage_js = new LocalForage();

    module.exports = localforage_js;

    },{"3":3}]},{},[4])(4)
    });
    });

    window.interfaces = {
        Redux: Redux,
        Virtual: Virtual,
        VirtualDom: VirtualDom,
        VirtualCSSTransitionGroup: index$1,
        page: index$2,
        localforage: localforage
    };

}());
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":2}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1]);

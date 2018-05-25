webpackJsonp([0],{

/***/ 141:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config_js__ = __webpack_require__(142);
var page = window.interfaces.page;


//let beaconBaseURL = 'http://192.168.2.116:30080/nLogger/boomLogger.php?data={"rt.start":"navigation","t_resp":"0","t_page":"0","t_done":"0","r":"","r2":"","t_resr":{"t_domloaded":0},"u":"","nt_dns":"0","appId":"126","tag":"","event":""}',
var beaconJSON = {
    "rt.start": "navigation",
    "nt_red": "0",
    "nt_dns": "0",
    "nt_tcp": "0",
    "nt_req": "0",
    "nt_res": "0",
    "t_resp": "0",
    "nt_plt": "0",
    "nt_render": "0",
    "t_page": "0",
    "t_done": "0",
    "r": "",
    "r2": "",
    "u": "",
    "tag": "",
    "appId": window.appId,
    "t_resr": { "t_domloaded": 0 },
    "event": "routeChange"
};
var webAppTracking = {
    act: null,
    appId: window.appId
};
var winLoad = false;
var referrer = void 0;
window.RCCT;
window.RCST;
var checkWinLoad = void 0;

var obj = {
    startTimer: function startTimer(RCS) {
        if (RCS) {
            if (!window.RCCT) {
                window.RCST = new Date().getTime();
            }
        } else {
            window.RCCT = new Date().getTime();
        }
    },
    stopTimer: function stopTimer() {
        if (window.RCCT || window.RCST) {
            var diff = new Date().getTime() - (window.RCCT || window.RCST);
            window.RCCT = null;
            window.RCST = null;
            return diff;
        } else {
            return null;
        }
    },
    postData: function postData(opts) {
        var endTime = null;
        if (!opts.type) {
            opts.type = "performance";
        }
        if (opts.type == "performance" && !opts.pageLoad) {
            endTime = obj.stopTimer();
            if (!endTime) {
                return;
            }
        }
        var urlMap = {
            performance: {
                url: __WEBPACK_IMPORTED_MODULE_0__config_js__["a" /* newmonk */].performance,
                dataObj: opts.pageload ? beaconJSON : $.extend({}, beaconJSON, { "t_done": endTime })
            },
            launchOrInstall: {
                url: __WEBPACK_IMPORTED_MODULE_0__config_js__["a" /* newmonk */].launchOrInstall,
                dataObj: webAppTracking
            }
        };
        var beaconData = $.extend({}, urlMap[opts.type].dataObj, opts.data);
        var url = urlMap[opts.type].url + "?data=" + JSON.stringify(beaconData) + '&' + Math.random();

        $.ajax({
            xhrFields: {
                withCredentials: false
            },
            method: 'GET',
            url: url
        });
    },
    sendBeacon: function sendBeacon(tag) {
        obj.postData({ "t_done": obj.stopTimer(), tag: tag, "event": "customTimer" });
    },
    attachOnForms: function attachOnForms() {
        var forms = $(document).find('form');
        $.each(forms, function (form, index) {
            submitService.addCallback(form.name, { success: function success() {
                    obj.startTimer();
                } });
        });
    },
    postDataOnWinLoad: function postDataOnWinLoad(opts) {
        if (winLoad) {
            clearInterval(checkWinLoad);
            var state = opts.store.getState();
            var routeName = state.route.routeName;
            var pageReferrer = document.referrer;
            var pagePath = document.location.href;
            var pageTitle = state.route.title;

            /*dataLayer.push({
               'event':'spa-pageview',
               'spa-page-name':routeName,
               'spa-page-title':pageTitle,
               'spa-page-referrer':pageReferrer
            })*/

            var t = performance.timing;
            var redirect = t.redirectEnd - t.redirectStart;
            var dns = t.domainLookupEnd - t.domainLookupStart;
            var tcp = t.connectEnd - t.connectStart;
            var request = t.responseStart - t.navigationStart - (t.requestStart - t.navigationStart);
            var res = t.responseEnd - t.responseStart;
            var response = t.responseStart - t.navigationStart;
            var plt = t.domInteractive - t.domLoading;
            var render = t.domComplete - t.domLoading;
            var _page = t.loadEventEnd - t.navigationStart - (t.responseStart - t.navigationStart);
            var done = t.loadEventEnd - t.navigationStart;
            var _referrer = document.referrer;

            obj.postData({
                type: "performance",
                pageLoad: true,
                data: {
                    "nt_red": redirect,
                    "nt_dns": dns,
                    "nt_tcp": tcp,
                    "nt_req": request,
                    "nt_res": res,
                    "t_resp": response,
                    "nt_plt": plt,
                    "nt_render": render,
                    "t_page": _page,
                    "t_done": done,
                    "r": encodeURIComponent(pageReferrer),
                    "u": encodeURIComponent(pagePath),
                    tag: opts.tagName,
                    "event": "WindowLoad"
                }
            });
        }
    },
    init: function init(store) {
        if (winLoad) {
            //obj.postData({"t_done":obj.stopTimer(), tag:tagName, "event":"ViewContentLoaded"});
        } else {
            checkWinLoad = setInterval(function () {
                obj.postDataOnWinLoad({ "tagName": "AppLoad", "store": store });
            }, 10);
        }
    }
};

window.onload = function () {
    setTimeout(function () {
        winLoad = true;
    }, 200);
};

// if (process.env.NODE_ENV !== "dev") {
page.exit('*', function (ctx, next) {
    var path = ctx.path;
    obj.startTimer(true);
    next(ctx);
});
// }

/* harmony default export */ __webpack_exports__["a"] = (obj);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(1)))

/***/ }),

/***/ 142:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return newmonk; });
var newmonk = {
    performance: '//lg.naukri.com/nLogger/boomLogger.php',
    feedback: '//lg.naukri.com/nLogger/feedback.php',
    launchOrInstall: '//lg.naukri.com/nLogger/webAppLogger.php'
};



/***/ }),

/***/ 143:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*const routeNameMap = {
    "landing": {
        pageName: "SplashScreen",
        title: "Naukri Web App"
    },
    "recJobs": {
        pageName: "recommendedjobs",
        title: "Jobs For You"
    },
    "similarJobsPage" : {
      pageName: "apply"
    },
    "searchForm" : {
      pageName: "searchform",  
    }
}*/

var gaConfig = function gaConfig(route) {
    var routeName = route.routeName;
    var routeTitle = route.title;
    var routePrevious = route.previousName;
    var returnValue = { pageName: routeName, title: routeTitle, previous: routePrevious };
    /*if (routeNameMap.hasOwnProperty(routeName)) {
        $.extend(returnValue, routeNameMap[routeName])
    }
    if (routeNameMap.hasOwnProperty(routePrevious)) {
        $.extend(returnValue, { previous: routeNameMap[routePrevious].pageName })
    }*/
    return returnValue;
};

/* harmony default export */ __webpack_exports__["a"] = (gaConfig);

/***/ }),

/***/ 144:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__newMonk_newMonkSPA_js__ = __webpack_require__(141);

/*let postData = () => {
	let url = appLaunchTrackingURL
	fetch(url, {
		method : "POST",
		body:"{l:true}"
	})
	.then(() => {alert("App Launch Logged")})
	.catch(() => {alert("App Launch Logging Failed")})
}*/

/*let postDataXHR = () => {
	let http = new XMLHttpRequest()
	let url = config.newmonk.launch
	let data = "{l:true}"
	http.open("POST", url, true)
	http.setRequestHeader("Content-type", "application/json")

	http.onreadystatechange = function() {
	    if(http.readyState == 4 && http.status == 200) {}
	    else{alert("nM_log_fail")}
	}
	http.send(data)
}*/

var showLayer = function showLayer() {
	window.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1 || navigator.userAgent.toLowerCase().indexOf('CriOS') > -1;
	window.showATHS = true;
};

var disablePullToRefresh = function disablePullToRefresh() {
	var maybePreventPullToRefresh = false;
	var lastTouchY = 0;
	var touchstartHandler = function touchstartHandler(e) {
		if (e.touches.length != 1) {
			return;
		}
		lastTouchY = e.touches[0].clientY;
		maybePreventPullToRefresh = window.pageYOffset == 0;
	};

	var touchmoveHandler = function touchmoveHandler(e) {
		var touchY = e.touches[0].clientY;
		var touchYDelta = touchY - lastTouchY;
		lastTouchY = touchY;

		if (maybePreventPullToRefresh) {
			maybePreventPullToRefresh = false;
			if (touchYDelta > 0) {
				e.preventDefault();
				return;
			}
		}
	};

	document.addEventListener('touchstart', touchstartHandler, false);
	document.addEventListener('touchmove', touchmoveHandler, false);
};

var logAppLaunch = function logAppLaunch(querystring) {
	try {
		if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
			if (querystring.length && querystring.match("lnch=1")) {
				disablePullToRefresh();
				__WEBPACK_IMPORTED_MODULE_0__newMonk_newMonkSPA_js__["a" /* default */].postData({
					type: "launchOrInstall",
					data: { act: "L" }
				});
			}
		} else if (navigator.standalone) {
			$("#root").addClass("fs");
			__WEBPACK_IMPORTED_MODULE_0__newMonk_newMonkSPA_js__["a" /* default */].postData({
				type: "launchOrInstall",
				data: { act: "L" }
			});
		} else {
			showLayer();
		}
	} catch (err) {
		console.log(err);
	}
};

window.addEventListener('beforeinstallprompt', function (e) {
	e.userChoice.then(function (choiceResult) {
		/*console.log(choiceResult.outcome);*/
		if (choiceResult.outcome == 'dismissed') {
			/*console.log('User cancelled home screen install');*/
		} else {
			/*console.log('User added to home screen');*/
			__WEBPACK_IMPORTED_MODULE_0__newMonk_newMonkSPA_js__["a" /* default */].postData({
				type: "launchOrInstall",
				data: { act: "I" }
			});
		}
	});
});

/* harmony default export */ __webpack_exports__["a"] = (logAppLaunch);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(1)))

/***/ }),

/***/ 39:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function($) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trackPageViewByGA", function() { return trackPageViewByGA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trackCustomEventByGA", function() { return trackCustomEventByGA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trackNewMonk", function() { return trackNewMonk; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trackNewMonkAndGA", function() { return trackNewMonkAndGA; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__newMonk_newMonkSPA_js__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__GA_gaConfig_js__ = __webpack_require__(143);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__appLaunch_appLaunch_js__ = __webpack_require__(144);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "newMonk", function() { return __WEBPACK_IMPORTED_MODULE_0__newMonk_newMonkSPA_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "logAppLaunch", function() { return __WEBPACK_IMPORTED_MODULE_2__appLaunch_appLaunch_js__["a"]; });




var trackPageViewByGA = function trackPageViewByGA(route) {
    var routeObj = Object(__WEBPACK_IMPORTED_MODULE_1__GA_gaConfig_js__["a" /* default */])(route);
    window.dataLayer && dataLayer.push({
        'event': 'spa-pageview',
        'spa-page-name': routeObj.pageName,
        'spa-page-title': document.title, //routeObj.title
        'spa-page-referrer': routeObj.previous
    });
};

var trackCustomEventByGA = function trackCustomEventByGA(event, category, label, action) {
    event = event || 'spa-event';
    window.dataLayer && dataLayer.push({
        'event': event,
        'spa-event-category': category,
        'spa-event-label': label,
        'spa-event-action': action
    });
};

var trackNewMonk = function trackNewMonk(route) {
    var host = document.location.host;
    __WEBPACK_IMPORTED_MODULE_0__newMonk_newMonkSPA_js__["a" /* default */] && __WEBPACK_IMPORTED_MODULE_0__newMonk_newMonkSPA_js__["a" /* default */].postData && __WEBPACK_IMPORTED_MODULE_0__newMonk_newMonkSPA_js__["a" /* default */].postData({
        data: {
            'r': encodeURIComponent(host + route.previous),
            'u': encodeURIComponent(host + route.current),
            'tag': route.routeName
        }
    });
};

// can be used if static page
var trackNewMonkAndGA = function trackNewMonkAndGA(route) {
    trackPageViewByGA(route);
    trackNewMonk(route);
};

/*************************************************************
    <a data-ga-track="category|label" href="">Submit</a>
**************************************************************/
var initClickTrackGA = function initClickTrackGA() {
    if (!document.isTrackingEnabled) {
        $(document).on('click', '[data-ga-track]', function () {
            document.isTrackingEnabled = true;
            var params = $(this).data('ga-track').split("|");
            var _category = params[0];
            var _label = params[1];
            var _event = params[2] || 'click';

            window.dataLayer && dataLayer.push({
                'event': 'spa-event',
                'spa-event-category': _category,
                'spa-event-label': _label,
                'spa-event-action': _event
            });
        });
    }
};
initClickTrackGA();


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(1)))

/***/ })

});
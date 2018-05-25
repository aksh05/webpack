import newMonk from "../newMonk/newMonkSPA.js"
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

let showLayer = () => {
	window.isChrome = (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) || (navigator.userAgent.toLowerCase().indexOf('CriOS') > -1);
	window.showATHS = true;
}

let disablePullToRefresh = () => {
    let maybePreventPullToRefresh = false
    let lastTouchY = 0
    let touchstartHandler = (e) => {
        if (e.touches.length != 1){return}
        lastTouchY = e.touches[0].clientY
        maybePreventPullToRefresh = (window.pageYOffset == 0)
    }

    let touchmoveHandler = (e) => {
        let touchY = e.touches[0].clientY
        let touchYDelta = touchY - lastTouchY
        lastTouchY = touchY

        if (maybePreventPullToRefresh) {
            maybePreventPullToRefresh = false
            if (touchYDelta > 0) {
                e.preventDefault()
                return
            }
        }
    }

    document.addEventListener('touchstart', touchstartHandler, false)
    document.addEventListener('touchmove', touchmoveHandler, false)
}

let logAppLaunch = (querystring) => {
	try{
		if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
			if(querystring.length && querystring.match("lnch=1")){
				disablePullToRefresh()
				newMonk.postData({
					type:"launchOrInstall",
					data : {act:"L"}
				})
			}
		} else if (navigator.standalone) {
			$("#root").addClass("fs");
			newMonk.postData({
				type:"launchOrInstall",
				data : {act:"L"}
			})
		}
		else{
			showLayer();
		}
	}catch(err){console.log(err)}
}


window.addEventListener('beforeinstallprompt', function(e) {
  e.userChoice.then(function(choiceResult) {
    /*console.log(choiceResult.outcome);*/
    if(choiceResult.outcome == 'dismissed') {
      /*console.log('User cancelled home screen install');*/
    }
    else {
      /*console.log('User added to home screen');*/
      newMonk.postData({
      	type:"launchOrInstall",
      	data : {act:"I"}
      })
    }
  });
});	

export default logAppLaunch
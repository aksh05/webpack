let { page } = window.interfaces;
import * as config from "./config.js"
//let beaconBaseURL = 'http://192.168.2.116:30080/nLogger/boomLogger.php?data={"rt.start":"navigation","t_resp":"0","t_page":"0","t_done":"0","r":"","r2":"","t_resr":{"t_domloaded":0},"u":"","nt_dns":"0","appId":"126","tag":"","event":""}',
let beaconJSON = {
    "rt.start": "navigation",
    "nt_red":"0",
    "nt_dns": "0",
    "nt_tcp":"0",
    "nt_req":"0",
    "nt_res":"0",
    "t_resp": "0",
    "nt_plt":"0",
    "nt_render":"0",
    "t_page": "0",
    "t_done": "0",
    "r": "",
    "r2": "",
    "u": "",
    "tag": "",
    "appId": window.appId,
    "t_resr": { "t_domloaded": 0 },
    "event": "routeChange"
}
let webAppTracking = {
    act:null,
    appId: window.appId
}
let winLoad=false
let	referrer
window.RCCT
window.RCST
let checkWinLoad

let obj =  {
    startTimer: (RCS) => {
        if (RCS) {
            if (!window.RCCT) {
                window.RCST = new Date().getTime()
            }
        } else {
            window.RCCT = new Date().getTime()
        }
    },
    stopTimer: () => {
        if(window.RCCT || window.RCST){
            let diff = new Date().getTime() - (window.RCCT || window.RCST)
            window.RCCT=null
            window.RCST=null
            return diff
        }
        else{
            return null
        }
    },
    postData: (opts) => {
        let endTime = null
        if(!opts.type){opts.type = "performance"}
        if (opts.type == "performance" && !opts.pageLoad) {
            endTime = obj.stopTimer();
            if (!endTime) {return;}
        }
        let urlMap = {
            performance : {
                url : config.newmonk.performance,
                dataObj : (opts.pageload) ? beaconJSON : $.extend({},beaconJSON,{"t_done":endTime})
            },
            launchOrInstall : {
                url : config.newmonk.launchOrInstall,
                dataObj : webAppTracking
            }
        }
        let beaconData = $.extend({},urlMap[opts.type].dataObj,opts.data)
        let url = urlMap[opts.type].url+"?data="+JSON.stringify(beaconData)+'&'+Math.random()

        $.ajax({
            xhrFields: {
                withCredentials: false
            },
            method: 'GET',
            url: url
        })
    },
    sendBeacon: (tag) => {
    	obj.postData({"t_done":obj.stopTimer(),tag:tag,"event":"customTimer"})
    },
    attachOnForms : () => {
        let forms = $(document).find('form')
        $.each(forms,(form,index) => {
            submitService.addCallback(form.name, {success:() => {obj.startTimer()}})
        })
    },
    postDataOnWinLoad : (opts) => {
        if(winLoad){
            clearInterval(checkWinLoad)
            let state = opts.store.getState()
            let routeName = state.route.routeName
            let pageReferrer = document.referrer
            let pagePath = document.location.href
            let pageTitle = state.route.title

            /*dataLayer.push({
               'event':'spa-pageview',
               'spa-page-name':routeName,
               'spa-page-title':pageTitle,
               'spa-page-referrer':pageReferrer
            })*/

            let t = performance.timing
            let redirect = t.redirectEnd - t.redirectStart
            let dns = t.domainLookupEnd - t.domainLookupStart
            let tcp = t.connectEnd - t.connectStart
            let request = (t.responseStart - t.navigationStart) - (t.requestStart - t.navigationStart)
            let res = t.responseEnd - t.responseStart
            let response = t.responseStart - t.navigationStart
            let plt = t.domInteractive - t.domLoading
            let render = t.domComplete - t.domLoading
            let page = (t.loadEventEnd - t.navigationStart) - (t.responseStart - t.navigationStart)
            let done = t.loadEventEnd - t.navigationStart
            let referrer = document.referrer

            obj.postData({
                type:"performance",
                pageLoad:true,
                data : {
                    "nt_red":redirect,
                    "nt_dns":dns,
                    "nt_tcp":tcp,
                    "nt_req":request,
                    "nt_res":res,
                    "t_resp":response,
                    "nt_plt":plt,
                    "nt_render":render,
                    "t_page":page,
                    "t_done":done,
                    "r":encodeURIComponent(pageReferrer),
                    "u":encodeURIComponent(pagePath),
                    tag:opts.tagName,
                    "event":"WindowLoad"
                }
            })
        }
    },
    init : (store) => {
        if(winLoad){
            //obj.postData({"t_done":obj.stopTimer(), tag:tagName, "event":"ViewContentLoaded"});
        }
        else{
            checkWinLoad = setInterval(() => {obj.postDataOnWinLoad({"tagName":"AppLoad","store":store})}, 10);
        }
    }
}

window.onload = () => {setTimeout(() => {winLoad = true},200)}


// if (process.env.NODE_ENV !== "dev") {
    page.exit('*', (ctx, next) => {
        let path = ctx.path
        obj.startTimer(true)
        next(ctx)
    });
// }

export default obj
import newMonk from './newMonk/newMonkSPA.js';
import gaConfig from './GA/gaConfig.js';
import logAppLaunch from './appLaunch/appLaunch.js';

let trackPageViewByGA = (route) => {
    let routeObj = gaConfig(route);
    window.dataLayer && dataLayer.push({
        'event': 'spa-pageview',
        'spa-page-name': routeObj.pageName,
        'spa-page-title': document.title, //routeObj.title
        'spa-page-referrer': routeObj.previous
    });
}

let trackCustomEventByGA = (event, category, label, action) => {
    event = event || 'spa-event'
    window.dataLayer && dataLayer.push({
        'event': event,
        'spa-event-category': category,
        'spa-event-label': label,
        'spa-event-action': action
    });
}

let trackNewMonk = (route) => {
    let host = document.location.host;
    newMonk && newMonk.postData && newMonk.postData({
        data: {
            'r': encodeURIComponent(host + route.previous),
            'u': encodeURIComponent(host + route.current),
            'tag': route.routeName
        }
    });
}

// can be used if static page
let trackNewMonkAndGA = (route) => {
    trackPageViewByGA(route);
    trackNewMonk(route);
}

/*************************************************************
    <a data-ga-track="category|label" href="">Submit</a>
**************************************************************/
let initClickTrackGA = () => {
    if (!document.isTrackingEnabled) {
        $(document).on('click', '[data-ga-track]', function() {
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
            })
        });
    }
}
initClickTrackGA();

export {
    trackPageViewByGA,
    trackCustomEventByGA,
    newMonk,
    trackNewMonk,
    trackNewMonkAndGA,
    logAppLaunch
}

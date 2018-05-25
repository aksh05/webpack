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

let gaConfig = (route) => {
    let routeName = route.routeName;
    let routeTitle = route.title;
    let routePrevious = route.previousName;
    let returnValue = { pageName: routeName, title: routeTitle, previous: routePrevious };
    /*if (routeNameMap.hasOwnProperty(routeName)) {
        $.extend(returnValue, routeNameMap[routeName])
    }
    if (routeNameMap.hasOwnProperty(routePrevious)) {
        $.extend(returnValue, { previous: routeNameMap[routePrevious].pageName })
    }*/
    return returnValue;
}

export default gaConfig;

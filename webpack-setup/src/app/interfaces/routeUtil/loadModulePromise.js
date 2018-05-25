const loadedUrls = {/*url:true*/}

/**
 * @param  {[Object]}
 * @return {[type]}
 */
const requireErrorCallback = (err) => {
    //Undefine failed module id
    err.requireModules.map((failedId) => {
        requirejs.undef(failedId);
    });
}

const isCssUrl = (url)=>{
	return url.match(/\.css$/);
}

const modifyReponse = (url,response)=>{
	/*if(isCssUrl(url) && loadedUrls[url]){
		return "";
	}*/
	return response;
}

export default (url) => {
    return new Promise((resolve, reject) => {
    	//requirejs is considerd a global dependecy
        requirejs([url],(response)=> {
        	resolve(modifyReponse(url,response))
        	loadedUrls[url] = true;        	
        }, (err) => {
        	requireErrorCallback(err);
            reject(err);            
            loadedUrls[url] = false;
        })
    });
}

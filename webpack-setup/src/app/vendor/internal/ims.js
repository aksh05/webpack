let {page} = window.interfaces;
window.ims = function (){
		var prv = {
			init : function(params){
			var t = prv,
				selector = (params.trigger) ? ((params.trigger.selector) ? params.trigger.selector : null) : null,
				evnt = (params.trigger) ? ((params.trigger.on) ? params.trigger.on : 'click') : 'click',
				loader = (params.trigger) ? ((params.trigger.loader) ? params.trigger.loader : null) : null,
				embedTo = params.embedTo || null,
				drawer = params.drawer || null,
				url = params.url || null,
				iName = params.iName || null,
				postData = params.postData || '',
				requestTimeout = params.requestTimeout || 3E4,
				requestSuccess = params.requestSuccess || function(){},
				requestFail = params.requestFail || function(){},
				crossDomain = params.crossDomain || null,
				autoInvoke = params.autoInvoke || null,
				ajaxData = {url:url,pD:postData,rT:requestTimeout,rS:requestSuccess,rF:requestFail,cD:crossDomain},
				jsFiles = {count:0,loaded:0,failed:0},
				disableClose = params.disableClose || null;
				var disableCloseByLayer = (typeof params.disableCloseByLayer == "boolean")?params.disableCloseByLayer : false;
				var disableCloseByEsc = (typeof params.disableCloseByEsc == "boolean")?params.disableCloseByEsc : false;
			
			t.drw = drawer;
			t.sel = selector;
			t.evt = evnt;
			t.loader = loader;
			t.emb = embedTo;
			t.aD = ajaxData;
			t.jF = jsFiles;
			t.dC = disableClose;
			t.dCBL = disableCloseByLayer ;
			t.dCBE = disableCloseByEsc ;
			
			if(selector) t.bindEvents();
			if(autoInvoke) t.sendRequest();
		},
		
		showLoader : function(action){
			var t = prv;
			if(t.loader){
				if(action=='show')
					if(t.loader.auto){$(t.loader.auto).gLoader().block();}else{$(t.loader).show();}
				else
					if(t.loader.auto){$(t.loader.auto).gLoader().unblock();}else{$(t.loader).hide();}
			}
		},
		
		bindEvents : function(){
			var t = prv;
			$('body').on(t.evt,t.sel,function (event){t.sendRequest();});
			
		},
		
		sendRequest : function(){
			var t = prv;
			$.ajax({
				cache: false,
				type : (t.aD.cD) ? 'GET' : 'POST',
				dataType : (t.aD.cD) ? 'jsonp' : '',
				url : (t.aD.cD) ? t.aD.url+'?'+t.aD.pD : t.aD.url,
				data : t.aD.pD,
				timeout : t.aD.rT,
				beforeSend : function(){t.showLoader('show');},
				success : function(resp){
					var rsp = (typeof resp == 'string') ? $.parseJSON(resp) : resp ;
					t.procssResponse(rsp);
				},
				error : function(xhr,status,error){
					if(t.aD.rF)t.aD.rF({'XHR':xhr,'STATUS':status,'ERROR':error});
				},
				complete : function(){t.showLoader('hide');}
			});
		},
		
		procssResponse : function (resp){
			var t = prv;
			/*var selID = (t.sel).substring(1,(t.sel.length));*/
			t.jF = {count:0,loaded:0,failed:0};
			if(resp){
				if(resp.exception){
					if(t.aD.rF){
						t.aD.rF(resp.exception);
						var _url = (window.location.href).split('action=')[0];
						/*console.log(_url,1111);*/
						page.redirect(_url);
						globalActionCreators.showToast(resp.exception.expData,'error');
					}else{alert('Reqest could not be completed. Please try again...');}
					return;
				}
				else if(resp.data){
					var contObj=null,fileInt,fileInt_Count=0;
					if(resp.data.files && resp.data.files.length>0)t.setFiles(resp.data.files);
					fileInt = setInterval(function (){
						fileInt_Count++;
						//alert(t.jF.count+','+t.jF.loaded+','+t.jF.failed);
						if(t.jF.count<=(t.jF.loaded+t.jF.failed)){
							clearInterval(fileInt);
							if(t.emb){
								t.setContent($(t.emb),resp.data);
							}
							else{
								t.showLightbox(resp.data);
							}
							if(t.aD.rS)t.aD.rS(resp);
						}
						else if(fileInt_Count>300){clearInterval(fileInt);}
					},100);
				}
				else if(resp.redirectURL){
					if(t.aD.rS)t.aD.rS(resp);
					window.acpData= resp.acpData;
					var redUrl = ((resp.redirectURL).replace(/^http[s]{0,1}:\/\/[^\/]+/, '')).replace('/', '');
					page.redirect('/'+redUrl);
				}
			}
		},
		
		setFiles : function(files){
			var t = prv, x;
			for(x=0;x<files.length;x++){if(!t.checkFile(files[x])) t.injectFile(files[x]);}
		},
		
		setContent : function (obj,data){
			var t = prv;
			if(data.html)t.setHtml(obj,data.html);
			if(data.script)t.setScript(obj,data.script);
		},
		
		setHtml : function(obj,html){
			obj.html(html);
		},
		
		setScript : function(obj,script){
			/*var scrObj = $('<script>');
			scrObj.get(0).text = script;
			obj.append(scrObj);*/
		  var s = document.createElement('script');
		  s.type = 'text/javascript';
		  s.text = script;
		  if(!obj.get || !obj.get(0)){
			  document.body.appendChild(s);
		  }
		  else{
		  	obj.get(0).appendChild(s);
		  }
		},
		showLightbox : function(data){
			var t = prv;
			if(!ims.lbOpened){
				if(data.html){
					$("<div>").drawer({
			            "model": $(t.drw.model),
			            "dimens":{"width":t.drw.width,"height":t.drw.height},        
			            "close": {layer:true,"anim":t.drw.closeClass},
			           	"open" :{"anim":t.drw.openClass},
			            "dir": t.drw.dir,
			        }).open();

					$(t.drw.model).html(data.html);
					$(t.drw.model).drawer().resize();
				}

				var p = setInterval(function(){
						$('.ltCont').focus();
					},100);
					$("body").on("focusin", '.ltCont', function() {
						clearInterval(p);
						$('body').append('<script>' + data.script + '</script>');
						$("body").off("focusin", '.ltCont');
					});

			}else{
				setTimeout(function(){
					if(data.html){t.setHtml($('#imsLBMain'),data.html);}
			//		$(ims.lbOpened).lightBox().resize();
					if(data.script){t.setScript($('#imsLBMain'),data.script);}
				},10);
			}	

		},	
		/*showLightbox : function(data){
			var t = prv;
			if(!ims.lbOpened){
				if(data.html){
					var dom = $('<div id="imsLBMain" class="ltBx lightbox">' + data.html + '</div>');
					window.options = {
						ltBox: dom,
						resetForm: true,
						dimens: {
							width: '700px'
						},
						open: {
							success: function() {
								if ($(ims.lbOpened).lightBox()) {
									$(ims.lbOpened).lightBox().resize()
								}
							},
							event: 'click'
						},
						close: {}
					};
					if (t.dC) {
						options['close'] = {
							anim: {
								className: 'flipClose',
								duration: 300
							},
							layer: !t.dCBL,
							esc: !t.dCBE,
							success: function() {}
						}
					} else {
						options['close'] = {
							nodes: {
								target: '#imsLBMain',
								selector: '.imsLBClose'
							},
							anim: {
								className: 'flipClose',
								duration: 300
							},
							layer: !t.dCBL,
							esc: !t.dCBE,
							success: function() {
								ims.lbOpened = false;
								$('#imsLBMain').remove();
								$(t.sel).lightBox().reInit();
							}
						}
					}
					ims.lbOpened = t.sel;
					$(t.sel).lightBox(window.options);
					var p = setInterval(function(){
						$('.ltCont').focus();
					},100);
					$("body").on("focusin", '.ltCont', function() {
						clearInterval(p)
						$(t.sel).lightBox().resize();
						$('body').append('<script>' + data.script + '</script>');
						$("body").off("focusin", '.ltCont');
						dom.on("click", "#closeLB", function() {
							$.fn.lightBox.closeAll()
						});
					});
					$(t.sel).lightBox().open();
				
				}
			}
		},*/
		
		checkFile : function (filePath){
			var t = prv,file = t.getFile(filePath).name, fileType = t.getFile(filePath).ext,ret=null;
			switch(fileType){
				case 'js' : {
					var scripts=$('script');
					for(var x=0;x<scripts.length;x++){
						var src=scripts.eq(x).attr('src');
						if(src && src.indexOf(file)>=0){
							ret=scripts.eq(x).attr('status') || true;
						}
					}
					break;
				}
				case 'css' : {
					var css=$('link');
					for(var y=0;y<css.length;y++){
						var href=css.eq(y).attr('href');
						if(href && href.indexOf(file)>=0){
							ret=css.eq(y).attr('status') || true;
						}
					}
					break;
					}
				}
		return ret;
		},
		
		injectFile : function(filePath,callback) {
			var t=prv,status = false,obj,jsObj,ext = t.getFile(filePath).ext;
			
			switch (ext){
				case  'js' : {
					t.jF.count++;
					obj = $('<script>').attr({'type':'text/javascript'});
					jsObj = obj.get(0);
					jsObj.onload = handleLoad;
					jsObj.onreadystatechange = handleReadyStateChange;
					jsObj.onerror = handleError;
					break;
				}
				case 'css' : {
					obj = $('<link>').attr({'type':'text/css','rel':'stylesheet'});
					break;
				}
				default : break;
			}
			$('head').append(obj);
			if(ext=='js'){
				obj.attr({'src':filePath});
				status = 'loading';
				obj.attr('status',status);
			}
			else{
				obj.attr({'href':filePath});
			}
			
			function handleLoad() {
				if (!status || status==='loading') {
					status = 'loaded';
					obj.removeAttr('status');
					if(callback) callback(filePath, status);
					t.jF.loaded++;
				}
			}
		
			function handleReadyStateChange() {
				var state;
				if (!status || status==='loading') {
					state = this.readyState;
					if (state === "complete" || state === "loaded" || state === 4) {
						handleLoad();
					}
				}
			}
			function handleError() {
				if (!status || status==='loading') {
					status = 'error';
					obj.remove();
					if(callback) callback(filePath, "error");
					t.jF.failed++;
				}
			}
		},
		
		getFile : function(filePath){
			var rgX = new RegExp(/\.([0-9a-z]+)(?:[\?#]|$)/i), ext = filePath.match(rgX)[1], name = filePath.substring(filePath.lastIndexOf('/')+1,filePath.lastIndexOf(ext));
			return {name:name+ext,ext:ext};
		}
		
	};
	
	
//	return (Object.create({init : prv.init}));//{init : prv.init}
	return (Object.create({init : prv.init, prv : prv}));	//for Unit-Tests only
};


if (typeof Object.create != 'function') {
    (function () {
        var F = function () {};
        Object.create = function (o) {
            if (arguments.length > 1) {
              throw Error('Second argument not supported');
            }
            if (o === null) {
              throw Error('Cannot set a null [[Prototype]]');
            }
            if (typeof o != 'object') {
              throw TypeError('Argument must be an object');
            }
            F.prototype = o;
            return new F();
        };
    })();
}
(function(){
    function Vipspa(){
        
    }
    Vipspa.prototype.start = function(config){
        var self = this;
        self.routerMap = parseRouter(config.router);
        self.mainView = config.view;
        self.errorTemplateId = config.errorTemplateId;
        startRouter();
        window.onhashchange = function(){
            startRouter();
        };
    };
    var messageStack = [];
    // {
    //     'id': 'home_bindcard',
    //     'content': {
    //     }
    // }
    
    // getMessage, get message from the messageStack by id
    Vipspa.prototype.getMessage = function(id){
        var msg = {};
        $.each(messageStack,function(i,e){
            if(e.id===id){
                msg = e;
            }
        });
        return msg;
    };

    // setMessage, set the obj into the messageStack
    Vipspa.prototype.setMessage = function(obj){
        var _obj = JSON.parse(JSON.stringify(obj));
        $.each(messageStack,function(i,e){
            if(e.id===_obj.id){
                e = _obj;
                return false;
            }
        });
        messageStack.push(_obj);
    };
    
    // delMessage, delete the message from the messageStack by id
    Vipspa.prototype.delMessage = function(id){
        if(typeof id==='undefined'){
            return false;
        }
        var index = 0;
        $.each(messageStack,function(i,e){
            if(e.id===id){
                index = i;
            }
        });
        $.each(messageStack,function(i,e){
            if(i>index){
                messageStack[i-1] = e;
            }
        });
    };
    
    // clearMessage, clear all messages from the messageStack
    Vipspa.prototype.clearMessage = function(id){
        var index = 0;
        messageStack = [];
    };
    
    Vipspa.prototype.stringify = function(routerUrl,paramObj){
        var paramStr='' ,hash;
        for(var i in  paramObj){
            paramStr += i + '=' + encodeURIComponent(paramObj[i]) + '&';
        }
        if(paramStr === ''){
            hash = routerUrl;
        }
        else{
            paramStr = paramStr.substring(0,paramStr.length-1);
            hash = routerUrl + '?' + paramStr;
        }
        return hash;
    };
    function parseRouter(router) {
    	var routerMap = [];
    	if(router) {
    		$.each(router, function(k, v) {
    			if(k == 'defaults') {
    				routerMap.defaults = v;
    			} else {
    				var params = [];
	    			k = getUrlParams(k, params);
	    			var r = {
	    				url: '^#' + k + '$',
	    				params: params,
	    				content: v
	    			};
	    			routerMap.push(r);
    			}
    		});
    	}
    	return routerMap;
    }
    function getUrlParams(url, params) {
		var pIndex = url.indexOf(':');
        if(pIndex>-1){
        	var prefix = url.substring(0, pIndex), suffix = url.substring(pIndex + 1);
        	var splitIndex = suffix.indexOf('/'), p, pIndex = suffix.indexOf(':');
        	if((splitIndex==-1 && pIndex>-1) || (pIndex > -1 && pIndex < splitIndex)) 
        		throw new Error('illegal router config, url: "' + url + '"');
        	if(splitIndex>-1) {
        		p = suffix.substring(0, splitIndex);
        		suffix = suffix.substring(splitIndex);
        		url = prefix + '[^/]*' + suffix;
        	} else {
        		p = suffix;
        		url = prefix + '[^/]*';
        	}
        	params.push({
        		name: p,
        		reg: '^#' + prefix
        	});
        	if(pIndex > splitIndex) {
        		url = getUrlParams(url, params);// 递归调用
        	}
        }
        return url;
    }
    function routerAction (hash){
        var routerItem;
        vipspa.params = {};
        if(vipspa.routerMap.length) {
        	for(var i=0; i<vipspa.routerMap.length; i ++) {
        		var router = vipspa.routerMap[i];
        		var reg = new RegExp(router.url);
        		if(reg.test(hash)) {
        			routerItem = router.content;
        			if(router.params && router.params.length) {
        				for(var j=0; j<router.params.length; j++) {
        					var p = router.params[j];
        					var reg = new RegExp(p.reg);
        					var prefix = reg.exec(hash);
        					if(prefix) {
        						prefix = prefix[0];
        						var suffix = hash.substring(prefix.length);
	        					var sIndex = suffix.indexOf('/'), v;
	        					if(sIndex > -1) {
	        						v = suffix.substring(0, sIndex);
	        					} else {
	        						v = suffix;
	        					}
	        					vipspa.params[p.name] = v;
        					}
        				}
        			}
        			break;
        		}
        	}
        }
        if(typeof routerItem==='undefined'){
            var defaultsRoute = vipspa.routerMap.defaults;
            routerItem = vipspa.routerMap[defaultsRoute];
            location.hash = defaultsRoute;
            return false;
        }
        
        $.ajax({
            type: 'GET',
            url: routerItem.templateUrl,
            dataType: 'html',
            success: function(data, status, xhr){
                $(vipspa.mainView).html(data);
                loadScript(routerItem.controller);
            },
            error: function(xhr, errorType, error){
                if($(vipspa.errorTemplateId).length===0){
                    return false;
                }
                var errHtml = $(vipspa.errorTemplateId).html();
                errHtml = errHtml.replace(/{{errStatus}}/,xhr.status);
                errHtml = errHtml.replace(/{{errContent}}/,xhr.responseText);
                $(vipspa.mainView).html(errHtml);
            }
        });
    }
   
    function startRouter  () {
        var hash = location.hash;
        routerAction(hash);
    }
    
    function loadScript(src, callback) {
        
        var script = document.createElement('script'),
            loaded;
        script.setAttribute('src', src);
        script.onreadystatechange = script.onload = function() {
            script.onreadystatechange = null;
            document.documentElement.removeChild(script);
            script = null;
            if (!loaded) {
                if(typeof callback==='function')
                    callback();
            }
            loaded = true;
        };
        document.documentElement.appendChild(script);
    }

    window.vipspa = new Vipspa();
})();
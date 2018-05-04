'use strict';

//读取链接参数
function getUrlParam(name, link){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
    var search;  
    if (link) {search = link.substr(link.indexOf("?"),link.length);}
    else { search = window.location.search;}
    var r = search.substr(1).match(reg);   
    if (r != null)
    	return decodeURI(r[2]); 
    return null; 
}

// 判断是否是UAS客户端打开
function isUasClient() {
	var index = navigator.userAgent.indexOf('uasClient');
	return index > -1;
}

$(function(){
	$("#search").on('keydown', function(event) {
		if(event.keyCode == 13) {
			window.location.href="commonSearch#/component/" + $('#search')[0].value;
		}
	});
	
	var clientParam = getUrlParam('client');
	
	if(!isUasClient() && clientParam != 'true') {
		$('#app-bar').show();
		
		//下载app链接
		$('.app-btn').on('click', function() {
			window.location.href = 'http://www.usoftchina.com/usoft/uas_client.html';
		});
		
		// 关闭
		$('.app-close').on('click',function() {
			var app_bar = document.getElementById('app-bar');
			app_bar.parentNode.removeChild(app_bar);
		});
	}
	
/*	
 * 联想词的方法，暂时注释掉
 * var params = {
			keyword: $scope.keyword
		};
		if($rootScope.userInfo) {
			params.userUU = $rootScope.userInfo.userUU;
		}
		$http.get('search/suggestedKeyword', {
			params : params
		}).success(function(data){
			$scope.associates = [];// 联想词数组
			if(data.ad) {
				$scope.associates = $scope.associates.concat(data.ad);
			}
			if(data.hot) {
				$scope.associates = $scope.associates.concat(data.hot);
			}
			if(data.recent) {
				$scope.associates = $scope.associates.concat(data.recent);
			}
			if(data.similar) {
				$scope.associates = $scope.associates.concat(data.similar);
			}
		}).error(function(response) {
			console.log(response);	
		});*/
});
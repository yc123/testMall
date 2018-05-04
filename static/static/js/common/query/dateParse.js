define([ 'ngResource' ], function() {
angular.module('dateparseServices', [ 'ngResource' ]).factory('DateParse', ['$modal', function($modal){
	/*
	*功能：对前端输入框进行验证
	*正则：此正则表达式能判断目前所有情况下的字符串日期
	*
	*格式 ：2013-12-12
	*/
		return {
			match : function(str) {
				if(str != null && str.split('-') != null && str.split('-').length == 3) {
					var result = str.match(/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/);
					if(result != null) {
						return true;
					}
				}
				return false;
			}
		};
	}])
});
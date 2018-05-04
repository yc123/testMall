define([ 'ngResource' ], function() {
	angular.module('ReviewerEmailInfoService', [ 'ngResource' ]).factory('ReviewerEmailInfo', ['$resource', function($resource) {
		
		return $resource('customService', {}, {
			//获取收件人信息
			getMailInfo : {
				url : 'customService/ReviewerEmailInfo',
				method : 'GET',
				isArray: true
			},
			//新增操作
			saveMailInfo : {
				url : 'customService/ReviewerEmailInfo/save',
				method : 'POST'
			},
			//更新操作
			updateMailInfo : {
				url : 'customService/ReviewerEmailInfo/update',
				method : 'POST'
			},
			//删除信息
			deleteMailInfo : {
				url : 'customService/ReviewerEmailInfo/delete/:id',
				method : 'DELETE'
			}
		
		});
	}]);
});
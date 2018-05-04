define([ 'ngResource' ], function() {
	angular.module('messageBoardServices', [ 'ngResource' ]).factory('MessageBoardAPI', ['$resource', function($resource) {
		return $resource('api/operation/messageBoard', {}, {
			// 新增留言
			save : {
				url : 'api/operation/messageBoard',
				method : 'POST'
			}
		});
	}]).factory('MessageBoard', ['$resource', function($resource) {
		return $resource('operation/messageBoard', {}, {
			// 分页获取留言信息（全部）
			getAllPageInfo : {
				url : 'operation/messageBoard/pageInfo',
				method : 'GET',
				params : { _status : 'all' }
			},
			// 分页获取留言信息（待处理）
			getToBeHandlePageInfo : {
				url : 'operation/messageBoard/pageInfo',
				method : 'GET',
				params : { _status : 'tobehandle' }
			},
			// 分页获取留言信息（已处理）
			getHandledPageInfo : {
				url : 'operation/messageBoard/pageInfo',
				method : 'GET',
				params : { _status : 'handled' }
			},
			// 获取单条留言信息
			get : {
				url : 'operation/messageBoard/:id',
				method : 'GET'
			},
			// 处理留言
			handle : {
				url : 'operation/messageBoard/handle',
				method : 'PUT'
			},
			// 分页获取留言（个人）
			getPageInfoByUser : {
				url : 'operation/messageBoard//pageInfo/user',
				method : 'GET'
			}
		});
	}]);
});
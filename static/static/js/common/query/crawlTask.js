define([ 'ngResource' ], function() {
	angular.module('crawlTaskServices', [ 'ngResource' ]).factory('CrawlTask', ['$resource', function($resource) {
		//获取数据爬取的分页数据
		return $resource('produce/crawlTask', {}, {
			// 获取未完成的任务
			to_crawl : {
				url : 'produce/crawlTask',
				method : 'GET',
				params : {_status : 'to_crawl'}
			},
			// 获取进行中的任务
			running : {
				url : 'produce/crawlTask',
				method : 'GET',
				params : {_status : 'running'}
			},
			// 获取已完成的任务
			crawled : {
				url : 'produce/crawlTask',
				method : 'GET',
				params : {_status : 'crawled'}
			},
			// 获取失败的任务
			failed : {
				url : 'produce/crawlTask',
				method : 'GET',
				params : {_status : 'failed'}
			},
			// 新增任务（来自参数对应关系）
			save : {
				url : 'produce/crawlTask/:id',
				method : 'POST'
			},
			// 新增任务（来自用户申请列表）
			saveBySubmit : {
				url : 'produce/crawlTask/saveBySubmit/:ids',
				method : 'POST'
			},
			// 根据id获取任务详情
			getOne : {
				url : 'produce/crawlTask/:id',
				method : 'GET'
			},
			// 任务开启
			crawlStart : {
				url : 'produce/crawlTask/crawl',
				params : { _status : 'start'},
				method : 'PUT'
			},
			// 任务完成
			crawlSuccess : {
				url : 'produce/crawlTask/crawl',
				params : { _status : 'success'},
				method : 'PUT'
			},
			// 任务异常
			crawlFail : {
				url : 'produce/crawlTask/crawl',
				params : { _status : 'fail'},
				method : 'PUT'
			},
			// 获取已完成任务的维护器件列表
			getCmpList : {
				url : 'produce/crawlTask/cmpList',
				method : 'GET'
			}
		});
	}]);
});
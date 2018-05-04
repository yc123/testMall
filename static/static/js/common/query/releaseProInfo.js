define([ 'ngResource' ], function() {
	angular.module('ReleaseProductByBatchService', [ 'ngResource' ]).factory('ReleaseProductByBatch', ['$resource', function($resource) {
		
		return $resource('release/product', {}, {
			//更新产品信息
			updateProInfo: {
				url: 'release/product/update/proInfo',
				method: 'POST'
			},
			//删除产品信息
			deleteProInfo: {
				url: 'release/product/delete/:id',
				method: 'DELETE'
			},
			// 批量发布产品
			batchRelease: {
				url: 'release/product/batchRelease',
				method: 'POST',
			},
            // 批量上架个人产品
            batchReleasePerson: {
                url: 'release/product/batchRelease/person',
                method: 'POST',
            },
			// 获取批量上架的分页信息
			getPageBatchRelease: {
				url: 'release/product/batch/page',
				method: 'GET',
			},
			// 通过发布者uu查询所有添加的产品信息
			findAll: {
				url: 'release/product/getAll',
				method: 'POST',
				isArray: true
			},
			//批量删除
			deleteByQuery: {
				url: 'release/product/deleteByQuery',
				method: 'POST'
			},
			// 上传Excel批量发布产品(大量)
			releaseByExcel: {
				url: 'release/product/release/excel',
				method: 'POST'
			},
			// 上传Excel批量发布产品(大量)
			downLoadErrorExcel: {
				url: 'release/product/release/failure/xls',
				method: 'GET'
			},
			
		});
	}]);
});
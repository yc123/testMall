define(['ngResource'], function(ngResource) {
	angular.module('searchService', ['ngResource', 'common.services']).factory('Search', ['$resource', function($resource) {
		return $resource('search/', {}, {// 搜索接口
			kindSearch: {
				url: 'search/kind',
				method: 'GET'
			},
			brandSearch: {
				url: 'search/brand',
				method: 'GET'
			},
			componentSearch: {
				url: 'search/component',
				method: 'GET'
			},
			componentKinds: {
				url: 'search/component/kinds',
				method: 'GET',
				isArray: true
			},
            componentCollect: {
                url: 'search/componentGoods/collect',
                method: 'GET',
                isArray: true
            },
			componentBrands: {
				url: 'search/component/brands',
				method: 'GET',
				isArray: true
			},
			getSimilarBrands: {
				// 根据品牌名获取品牌联想词
				url: 'search/similarBrands',
				method: 'GET',
				isArray: true
			},
			getSimilarKinds: {
				// 根据类目名获取类目联想词
				url: 'search/similarKinds',
				method: 'GET',
				isArray: true
			},
			getSimilarLeafKinds: {
				// 根据类目名获取 末级类目 联想词
				url: 'search/similarLeafKinds',
				method: 'GET',
				isArray: true
			},
			getSimilarComponents: {
				// 根据器件名获取器件联想词
				url: 'search/similarComponents',
				method: 'GET',
				isArray: true
			}
		});
	}]);
})
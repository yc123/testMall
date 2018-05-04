define([ 'ngResource' ], function() {
	angular.module('cmsService', [ 'ngResource' ]).factory('Carousel', ['$resource', function($resource) {
		// 获取指定的幻灯片数据
		return $resource('api/carousel/:module', {}, {
            // 获取列表
            get: {
                method: 'GET',
                isArray: true
            }
		});
	}]).factory('Floors', ['$resource', function ($resource) {
        return $resource('api/floors/:module', {}, {
            // 获取列表
            get: {
                method: 'GET',
                isArray: true
            }
        });
    }]).factory('News', ['$resource', function ($resource) {
        return $resource('api/news/created', {}, {
            // 获取列表
            get: {
                method: 'GET',
            },
			// 根据查看数量获取新闻列表
			getNewsListOrderByViewCount: {
            	url: 'api/news/viewCount',
            	method: 'GET',
			},
			// 根据新闻ID获取新闻信息
			getNewsById: {
            	url: 'api/news/:id',
				method: 'GET'
			}
		});
	}]).factory('StoreCms', ['$resource', function ($resource) {
		return $resource('api/cms-service/hotComponents/useFor/pageFor', {}, {
			// 获取热销器件信息
			getHotComponentByUseForAndPageFor: {
				url: 'api/cms-service/hotComponents/useFor/pageFor',
				method: 'GET',
				isArray: true
			},
			// 获取推荐店铺的信息
			getStoreCmsByUseForAndCmsType: {
				url: 'api/cms-service/storeIn',
				method: 'GET',
				isArray: true
			},
			// 获取推荐店铺的信息
			findGoodInventory: {
				url: 'api/cms-service/storeCms/inventory',
				method: 'GET',
				isArray: true
			},
            /**
			 * 添加一条某一页面的某种内容
			 *
			 * @param store         商城店铺相关内容[body]
             * @param useFor        内容呈现页面[query, 'STORE_LIST']
             * @param cmsType       内容类型[query, 'NEW_SIGN', 'EXCELLENT_STORE', 'EXCELLENT_SALE_STORE', 'TEST_CMS_BATCH']
             */
            addOneTypeStoreCms : {
            	url : 'storecms-service/storeCms',
				method : 'POST'
			},
			/**
			 * 分页获取某种类型的店铺内容信息
			 */
			getContentByType : {
				url : 'api/store-cms/contents/store/:num',
				method : 'GET',
				isArray: true
			}
		});
	}]);
});

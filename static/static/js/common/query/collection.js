define([ 'ngResource' ], function() {
	angular.module('collection', ['ngResource']).factory('collectionService', ['$resource', 'BaseService', function($resource, BaseService) {
		var rootPath = BaseService.getRootPath();
		return $resource( rootPath + '/trade/collection/list', {}, {
			/*
			 * 根据uu号获取个人的收藏信息
			 */
			getStoreByUU: {
				method : 'GET',
				isArray : true
			},
			/*
			 * 查找个人的品牌收藏
			 */
			getStoreByUUAndBrand: {
				method : 'GET',
				params : { type : 'brand' }
			},
			/*
			 * 查找个人的器件收藏
			 */
			getStoreByUUAndComponent: {
				method : 'GET',
				params : { type : 'component' }
			},
			/*
			 * 根据id 删除指定的信息
			 */
			deleteStoreById: {
				url :  rootPath + '/trade/collection/:id',
				method : 'DELETE',
				isArray : true
			},
			/*
			 * 批量删除id
			 */
			deleteStoreByIds: {
				url :  rootPath + '/trade/collection/delete',
				method : 'POST'
			},		
			/*
			 * 清空个人的收藏
			 */
			clearStore: {
				url : rootPath + '/trade/collection/clear',
				method : 'GET'
			},
			/*
			 * 保存一列收藏记录, 此方法仅限于在登陆界面使用
			 */
			saveStores: {
				url : rootPath + '/trade/collection/save/list',
				method : 'POST'
			},
			/*
			 * 保存单个记录
			 */
			saveEntity: {
				url : rootPath + '/trade/collection/save',
				method : 'POST'
			}
			
		})
	}]).factory('StoreFocusService', ['$resource', 'BaseService', function($resource, BaseService){
		var rootPath = BaseService.getRootPath();
		return $resource( rootPath + '/trade/storeFocus', {}, {
			/*
			 * 保存一个店铺关注记录
			 */
			saveStoreFocus : {
				url : rootPath + '/trade/storeFocus/save',
				method : 'POST'
			},
			/*
			 * 得到uu号及enuu号下的所有店铺关注记录
			 */
			getStoreFocusList : {
				url : rootPath + '/trade/storeFocus/list',
				method : 'GET',
				isArray : true
			},
			/*
			 * 单个/批量删除店铺关注记录
			 */
			deleteStoreFocus : {
				url : rootPath + '/trade/storeFocus/delete',
				method : 'POST'
			},
			/*
			 * 分页获取uu号及enuu号下的店铺关注记录
			 */
			getStoreFocusPage: {
				url : rootPath + '/trade/storeFocus/page',
				method : 'GET'
			},
			/*
			 * 判断店铺是否已经关注 
			 * 
			 * @return  true   已关注
			 *          false  未关注
			 */
			storeIfFocus: {
				url : rootPath + '/trade/storeFocus/ifFocus',
				method : 'GET'
			}
		})
	}]);
});

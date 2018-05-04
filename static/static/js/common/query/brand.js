define([ 'ngResource' ], function() {
	angular.module('brandServices', [ 'ngResource' ]).factory('BrandsSubmit', ['$resource', 'BaseService', function($resource, BaseService) {
		//获取BrandSubmit的分页数据
		var rootPath = BaseService.getRootPath() + '/';
		return $resource('produce/brandSubmit', {}, {
			//未审核
			getUnAudited : {
				params : { _state : 'unAudited'}
			},
			//已通过
			getAllow : {
				params : { _state : 'allow'}
			},
			//未通过
			getNotAllow : {
				params : { _state : 'notAllow'}
			}
		});
	}]).factory('BrandSubmit', ['$resource', 'BaseService', function($resource, BaseService) {
		//对单个BrandSubmit的操作
		var rootPath = BaseService.getRootPath() + '/';
		return $resource('produce/brandSubmit/:id', {}, {
			//提交（保存）
			submit : {
				url : rootPath + 'produce/brandSubmit/saveBrandSubmit',
				method : 'POST'
			},
			//审核通过
			valid : {
				url : rootPath + 'produce/brandSubmit/audit',
				method : 'PUT',
				params : {
					valid : true
				}
			},
			//审核不通过
			invalid : {
				url : rootPath + 'produce/brandSubmit/audit/:id',
				method : 'PUT',
				params : {
					valid : false
				}
			},
			// 审核通过信息冲突的更新申请
			validUpdate : {
				url : rootPath + 'produce/brandSubmit/audituUpdate',
				method : 'PUT'
			},
			// 非标器件申请品牌
			unstandardSubmit : {
				url : rootPath + '/produce/brandSubmit/fromunstandard',
				method : 'POST'
			}
		});
	}]).factory('BrandVersion', ['$resource', function($resource) {
		//获取根据uuid获取BrandVersion列表
		return $resource('produce/brandVersion/:uuid', {}, {
			/*
			 * get,根据uuid,version获取BrandVersion对象
			 */
			//根据uuid获取BrandVersion列表
			getList : {
				url : 'produce/brandVersion/list/:uuid',
				method : 'GET',
				isArray : true
			},
			//根据uuid获取BrandVersion名称
			getCount : {
				url : 'produce/brandVersion/count/:uuid',
				method : 'GET'
			}
		});
	}]).factory('BrandActive', ['$resource', function($resource) {
		//对单个BrandActive对象操作
		return $resource('produce/brand/:uuid', {}, {
			//禁用BrandActive
			disable : {
				url : 'produce/brand/disable/:uuid',
				method : 'PUT',
				isArray : true
			},
			// 获取所有品牌的简要信息
			getSimpleInfo : {
				url : 'api/product/brand/Info',
				method : 'GET',
				isArray : true
			},
            // 查找已推广的按权重排序的品牌信息
            getSimpleInfoByWeight : {
                url : 'api/product/brand/Info/weight',
                method : 'GET',
                isArray : true
            },
            // 修改权重品牌信息
           setSimpleInfoWeight : {
                url : 'api/product/brand/Info/weight',
                method : 'PUT'
            },
			// 根据品牌ID获取相关的类目列表
			getKinds : {
				url: 'api/product/brand/:brandId/kinds',
				method: 'GET',
				isArray: true
			},
			// 获取品牌下的产品页面
			getComponents: {
				url: 'api/product/brand/:brandId/components',
				method: 'GET'
			},
			// 分页获取简要信息
			getSimpleInfoPage: {
				url: 'api/product/brand/Info/ByPage',
				method: 'GET'
			},
			// 分页获取简要信息
			getInfoPageWithInitial: {
				url: 'api/product/brand/page/initial',
				method: 'GET'
			},
			// 验证品牌名是否存在
			nameExist : {
				url: 'produce/brand/nameExist',
				method: 'GET',
				isArray: true
			},
			// 更新与修改
			update : {
				url: 'produce/brand/saveBrandActive',
				method: 'POST'
			},
			// 获取各月新增品牌数量
			getIncreaseCount : {
				url: 'produce/brand/increaseCount',
				method: 'GET',
				isArray: true
			}
		})
	}]).factory('BrandActiveAPI', ['$resource', function($resource) {
		//对单个BrandActive对象操作
		return $resource('api/product/brand/:uuid', {}, {
			/*
			 * get,根据uuid获得BrandActive
			 */
			// 获取所有品牌的简要信息
			getSimpleInfo : {
				url : 'api/product/brand/Info',
				method : 'GET',
				isArray : true
			},
			// 分页获取简要信息
			getSimpleInfoPage: {
				url: 'api/product/brand/Info/ByPage',
				method: 'GET'
			},
			// 获取按首字母分类的品牌信息
			getInitialSimpleInfo : {
				url : 'api/product/brand/initial',
				method : 'GET'
			},
			// 根据品牌ID获取相关的类目列表
			getKinds : {
				url: 'api/product/brand/:brandId/kinds',
				method: 'GET',
				isArray: true
			},
			// 根据uuid获取品牌信息
			getBrand : {
				url: 'api/product/brand/:uuid',
				method: 'GET'
			},
			// 根据品牌中文名获取品牌信息
			getByNameCn : {
				url: 'api/product/brand/nameCn/:nameCn',
				method: 'GET',
				isArray: true
			},
			// 根据品牌英文名获取品牌信息
			getByNameEn : {
				url: 'api/product/brand/nameEn/:nameEn',
				method: 'GET',
				isArray: true
			},
			// 通过名称获取品牌
			findByName : {
				url: 'api/product/brand/ByName/:name',
				method: 'GET'
			},
			// 通过名称获取品牌信息
			findBrandInfoByName : {
				url: 'api/product/brand',
				method: 'GET',
				params: {
					op: 'by_name'
				}
			},
            // 获取最新入驻品牌
			getNewBrands : {
				url: 'api/product/brand/new/:num',
				method: 'GET',
				isArray: true
			},
            // 获取推荐品牌
            getHotBrands : {
                url: 'api/product/brand/hot/:num',
                method: 'GET',
                isArray: true
            }
		})
	}]).factory('BrandDisable', ['$resource', function($resource) {
		//对BrandDisable禁用品牌的操作
		return $resource('produce/brandDisable/:uuid', {}, {
			/**
			 * get, 根据uuid获取BrandDisable
			 */
			// 获取全部已禁用品牌的简要信息
			getSimpleInfo : {
				url: 'produce/brandDisable/info',
				method: 'GET',
				isArray: true
			},
			// 分页获取全部已禁用品牌的简要信息
			getSimpleInfoPage : {
				url: 'produce/brandDisable/info/ByPage',
				method: 'GET'
			}
		});
	}]).factory('BrandMap', ['$resource', function ($resource) {
		//品牌映射关系相关操作
		return $resource('produce/brandMap', {}, {
			//分页获取品牌映射关系
			getPageOfBrandMap : {
				url: 'produce/brandMap/page',
				method: 'GET'
			},
			addOneBrandMap : {
				url: 'produce/brandMap/addOne',
				method: 'POST'
			}
		});
	}]);
});
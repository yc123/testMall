define([ 'ngResource'], function() {
	angular.module('common.query.kind', [ 'ngResource' ]).factory('Kind', ['$resource', '$cacheFactory', function($resource, $cacheFactory) {
		var cache = $cacheFactory('Kind');
		return $resource('produce/kind/:kindIds', {}, {
			// 修改分类的属性
			updateProperties: {
				url: 'produce/kind/:kindId/properties',
				method: 'POST',
				isArray: true
			},
			//重置类属性值
			resetKindPropertyValues: {
				url: 'produce/kind/kindPropertyValues/reset',
				method:  'GET'
			},
			// 编辑修改
			update: {
				url: 'produce/kind/:kindId',
				method: 'POST'
			},
			// 新增保存
			save: {
				url: 'produce/kind',
				method: 'POST'
			},
			// 交换序号
			exchangeNumber: {
				url: 'produce/kind/number',
				method: 'POST',
				params: {
					operate: 'exchange'
				}
			},
			// 删除类目属性
			deleteKindProperty: {
				url: 'produce/kind/kindProperty/:kindPropertyId',
				method: 'DELETE',
			},
			// 添加类目属性
			addKindProperty: {
				url: 'produce/kind/kindProperty/add',
				method: 'PUT'
			},
			// 修改类目属性具体值
			updateKindProperty: {
				url: 'produce/kind/kindProperty/update',
				method: 'PUT'
			},
			// 改变类目属性顺序
			changeDetno: {
				url: 'produce/kind/kindProperty/changeDetno',
				method: 'PUT',
				isArray: true
			},
			// 更换类目属性
			changeKindProperty: {
				url: 'produce/kind/kindProperty/changeKindProperty',
				method: 'PUT'
			}
		});
	}]).factory('KindAPI', ['$resource', '$cacheFactory', function($resource, $cacheFactory) {
		var cache = $cacheFactory('KindAPI');
		return $resource ('api/product/kind', {}, {
			// 根据父级类目获取其子类目，不包含深层
			getChildren: {
				url: 'api/product/kind/:parentId/children',
				method: 'GET',
				isArray: true
			},
			// 获取父级分类的所有子分类，含深层
			getAllChildren: {
				url: 'api/product/kind/:parentId/children_all',
				method: 'GET',
				isArray: true
			},
			// 获取子类目的所有父类目(含每级类目的兄弟类目)，返回逐级向下的类目数组
			getParentsWithBothers: {
				url: 'api/product/kind/:childId/parentsWithBothers',
				method: 'GET',
				isArray: true
			},
			// 获取子类目的所有父类目，返回逐级向下的类目数组
			getParents: {
				url: 'api/product/kind/:childId/parents',
				method: 'GET',
				isArray: true
			},
			// 获取类目所属的一级类目
			getFirstKind: {
				url: 'api/product/kind/:kindId/firstKind',
				method: 'GET'
			},
			// 根据类目id获取结构化类目(从一级到该类目)
			getStructingKinds: {
				url: 'api/product/kind/structing/:id',
				method: 'GET',
				isArray: true
			},
			// 获取分类的所有属性，包括存在的值选项
			getPropertiesValues: {
				url: 'api/product/kind/:kindId/properties/values',
				method: 'GET',
				isArray: true
			},
			// 获取分类的所有属性，不含值选项
			getProperties: {
				url: 'api/product/kind/:kindId/properties',
				method: 'GET',
				isArray: true
			},
			// 获取类目下器件的所属品牌列表
			getBrands: {
				url: 'api/product/kind/:kindId/brands',
				methos: 'GTE',
				isArray: true
			},
			// 获取类目下主要属性存在的值选项
			getPropertyOptions: {
				url: 'api/product/kind/:kindId/propertyOptions',
				method: 'GET',
				isArray: true
			},
			// 根据kindid获取一页ComponentGoods
			getCompGoodsByKindid: {
				url: 'api/product/product/getCompGoodsByKindid',
				method: 'GET'
			},
			// 根据keyword获取一页ComponentGoods
			getCompGoodsBySearch: {
				url: 'api/product/component/search/compGoods',
				method: 'GET'
			},
			// 根据kindid获取类目属性
			getKindProperties: {
				url: 'api/product/kind/:kindId/kindProperties',
				method: 'GET',
				isArray: true
			},
			// 根据分类名获取类目信息
			getKindByName: {
				url: 'api/product/kind/findByName/:name',
				method: 'GET'
			}
		})
	}]);
});
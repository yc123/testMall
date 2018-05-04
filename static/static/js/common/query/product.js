define([ 'angular', 'ui-bootstrap', 'ngResource', 'ngLocal' ], function(angular) {
	'use strict';
	angular.module('common.query.product', ['ui.bootstrap','ngResource', 'ng.local']).factory('ProductService', ['$modal', function($modal){
		return {
			open: function(filter) {
				var modalInstance = $modal.open({
					templateUrl : 'static/view/common/query/product.html',
					controller : 'ProductQueryCtrl',
					backdrop : "static",
					resolve : {
						filter : function() {
							return filter;
						}
					},
					windowClass : 'modal-large'
				});
				return modalInstance;
			}
		};
	}]).controller('ProductQueryCtrl', ['$scope', '$modalInstance', '$http', 'ngTableParams', '$resource', 'locale', function($scope, $modalInstance, $http, ngTableParams, $resource, locale){
		var Products = $resource('prod/products');
		
		var isNumber = function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };
		var parseParams = function(requestParams) {
            // parse url params
            for (var key in requestParams) {
                if (key.indexOf('[') >= 0) {
                    var params = key.split(/\[(.*)\]/), value = requestParams[key], lastKey = '';
                    angular.forEach(params.reverse(), function(name) {
                        if (name != '') {
                            var v = value;
                            value = {};
                            value[lastKey = name] = isNumber(v) ? parseFloat(v) : v;
                        }
                    });
                    requestParams[lastKey] = angular.extend(requestParams[lastKey] || {}, value[lastKey]);
                    delete requestParams[key];
                } else {
                    requestParams[key] = isNumber(requestParams[key]) ? parseFloat(requestParams[key]) : requestParams[key];
                }
            }
            return requestParams;
		};
		$scope.tableParams = new ngTableParams({
			page : 1, // show first page
			count : 10, // count per page
			sorting: {
                'code': 'asc'
            },
            filter: {
            	status: locale.status.AUDITED
            }
		}, {
			total : 0, 
			getData : function($defer, params) {
				var param = parseParams(params.url());
				Products.get(param, function(page){
					if(page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});

		// 关闭模态窗
		$scope.close = function() {
			$modalInstance.close();
		};
		// 选择
		$scope.select = function(product) {
			$modalInstance.close(product);
		};
		
	}]).factory('ProductServiceQuery', ['$resource', function ($resource) {
		return $resource('trade/products', {}, {
			/**
			 * 根据id 获取products信息
			 */
			getProductById: {
				url: 'trade/products/:id',
				method: 'GET'
			}
		});
	}]);
});
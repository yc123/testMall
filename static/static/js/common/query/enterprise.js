define([ 'angular', 'ui-bootstrap', 'ngResource' ], function(angular) {
	'use strict';
	angular.module('common.query.enterprise', ['ui.bootstrap','ngResource']).factory('EnterpriseService', ['$modal', function($modal){
		return {
			open: function(filter) {
				var modalInstance = $modal.open({
					templateUrl : 'static/view/common/query/enterprise.html',
					controller : 'EnterpriseQueryCtrl',
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
	}]).controller('EnterpriseQueryCtrl', ['$scope', '$modalInstance', '$http', 'ngTableParams', '$resource', function($scope, $modalInstance, $http, ngTableParams, $resource){
		var Enterprises = $resource('user/enterprises');
		
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
                'enName': 'asc' 
            },
            filter: {
            	enabled: 1
            }
		}, {
			total : 0, 
			getData : function($defer, params) {
				var param = parseParams(params.url());
				Enterprises.get(param, function(page){
					if(page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
		
		$scope.checkboxes = {
			'checked' : false,
			items : {},
			data: [],
			length : 0
		};
		var select = function(item) {
			var checked = false;
			angular.forEach($scope.checkboxes.data, function(d, i){
				if(d.uu == item.uu) {
					checked = true;return;
				}
			});
			!checked && $scope.checkboxes.data.push(angular.copy(item));
		};
		var deselect = function(item) {
			angular.forEach($scope.checkboxes.data, function(d, i) {
				if(d.uu == item.uu) {
					$scope.checkboxes.data.splice(i, 1);
					return;
				}
			});
		};
		var toggleSelection = function(item, values) {
			var checked = values[item.uu];
			if (checked) {
				select(item);
			} else {
				deselect(item);
			}
		};
		// watch for check all checkbox
		$scope.$watch('checkboxes.checked', function(value) {
			var i = 0;
			angular.forEach($scope.tableParams.data, function(item) {
				if (angular.isDefined(item.uu)) {
					$scope.checkboxes.items[item.uu] = value;
					i++;
				}
			});
			$scope.checkboxes.length = i;
		});

		// watch for data checkboxes
		$scope.$watch('checkboxes.items', function(values) {
			if (!$scope.tableParams.data) {
				return;
			}
			var checked = 0, unchecked = 0, total = $scope.tableParams.data.length;
			angular.forEach($scope.tableParams.data, function(item) {
				checked += ($scope.checkboxes.items[item.uu]) || 0;
				unchecked += (!$scope.checkboxes.items[item.uu]) || 0;
				toggleSelection(item, values);
			});
			if (total > 0 && (unchecked == 0 || checked == 0)) {
				$scope.checkboxes.checked = (checked == total);
			}
			$scope.checkboxes.length = checked;
			// grayed checkbox
			angular.element(document.getElementById("select_all_enterprise")).prop("indeterminate",
					(checked != 0 && unchecked != 0));
		}, true);
		// 关闭模态窗
		$scope.close = function() {
			$modalInstance.close();
		};
		// 移除已选择的企业
		$scope.deselect = function(index) {
			var item = $scope.checkboxes.data[index];
			if(item) {
				$scope.checkboxes.data.splice(index, 1);
				$scope.checkboxes.items[item.uu] = false;
			}
		};
		// 下一步
		$scope.next = function() {
			$modalInstance.close($scope.checkboxes.data);
		};
	}]).factory('Enterprise', ['$resource', function($resource){
		return $resource('basic/enterprise', {}, {
			getEnterpriseInfo : {
				url : 'basic/enterprise/:enuu/info',
				method : 'GET'
			},
            getEnterpriseDetailInfo : {
                url : 'basic/enterprise/:enuu/detailInfo',
                method : 'GET'
            },
            getEnterpriseAdminInfo : {
                url : 'basic/enterprise/:enuu/admin',
                method : 'GET'
            },
			getAllUsersByEnuu : {
				url : 'basic/user/enterprise/info',
				method : 'GET'
			},
            findUsersByKeyword : {
                url : 'basic/user/enterprise/keywordinfo',
				method : 'GET'
            },
			saveUser : {
				url : 'basic/user',
				method : 'POST'
			},
			removeUser : {
				url : 'basic/user/:uu',
				method : 'DELETE'
			},
			updateUser : {
				url : 'basic/user/:uu',
				method : 'PUT'
			},
			updateEnterpriseInfo : {
				url : 'basic/enterprise/:enuu/info',
				method : 'POST'
			},
			//绑定界面的用户搜索
			searchUser: {
				url: 'basic/user/searchUser',
				method: 'GET'
			},
			//绑定用户到企业
			bindUserToMyEnterprise: {
				url: 'basic/user/bindUser',
				method: 'GET'
			},

			/**
			 * 根据注册地址返回币别信息
			 */
			getCurrencyByRegisterAddress : {
				url : 'basic/enterprise/currency',
				method : 'GET'
			},
			/**
			 * 获取企业的店铺信息
			 * @return
			 */
			getStoreInfo : {
				url : 'basic/enterprise/store',
				method : 'GET'
			}
		});
	}]);
});
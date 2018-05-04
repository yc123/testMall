define([ 'app/app' ], function(app) {
	app.register.controller('CustomerListCtrl', function($scope, $filter, $http, $modal, ngTableParams, locale, EnterpriseService, Customers) {
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
                'customerEnterprise.enName': 'asc' 
            },
            filter: {
            	status: locale.status.AUDITED
            }
		}, {
			total : 0, 
			getData : function($defer, params) {
				var param = parseParams(params.url());
				Customers.get(param, function(page){
					if(page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
		
		var resetSelector = function() {
			$scope.checkboxes = {
				'checked' : false,
				items : {},
				length : 0
			};
		};
		
		resetSelector();
		
		// watch for check all checkbox
		$scope.$watch('checkboxes.checked', function(value) {
			var i = 0;
			angular.forEach($scope.tableParams.data, function(item) {
				if (angular.isDefined(item.id)) {
					$scope.checkboxes.items[item.id] = value;
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
			var checked = 0, unchecked = 0, total = $scope.tableParams.total();
			angular.forEach($scope.tableParams.data, function(item) {
				checked += ($scope.checkboxes.items[item.id]) || 0;
				unchecked += (!$scope.checkboxes.items[item.id]) || 0;
			});
			if (total > 0 && (unchecked == 0 || checked == 0)) {
				$scope.checkboxes.checked = (checked == total);
			}
			$scope.checkboxes.length = checked;
			// grayed checkbox
			angular.element(document.getElementById("select_all")).prop("indeterminate",
					(checked != 0 && unchecked != 0));
		}, true);
		
		var getSelected = function() {
			var selected = [];
			angular.forEach($scope.tableParams.data, function(item) {
				if($scope.checkboxes.items[item.id])
					selected.push(item);
			});
			return selected;
		};
		var getSelectedId = function() {
			var selected = [];
			angular.forEach($scope.tableParams.data, function(item) {
				if($scope.checkboxes.items[item.id])
					selected.push(item.id);
			});
			return selected;
		};
		// 添加客户
		$scope.getEnterprise = function() {
			EnterpriseService.open().result.then(function(selected){
				if (selected) {
					openAddCustomerWindow(selected);
				}
			});
		};
		var openAddCustomerWindow = function(enterprises) {
			$modal.open({
				templateUrl : 'sale/getCustomer.html',
				controller : 'AddCustomerCtrl',
				backdrop : "static",
				resolve : {
					enterprises : function() {
						return enterprises;
					},
					prevScope: function() {
						return $scope;
					}
				}
			});
		};
		//审核
		$scope.audit = function() {
			if($scope.checkboxes.length > 0) {
				Customers.audit(getSelected(), function(){
					$scope.tableParams.reload();
					resetSelector();
				}, function(response){
					alert('审批失败.');
				});
			}
		};
		//反审核
		$scope.unaudit = function() {
			if($scope.checkboxes.length > 0) {
				Customers.unaudit(getSelected(), function(){
					$scope.tableParams.reload();
					resetSelector();
				}, function(response){
					alert('反审批失败.');
				});
			}
		};
		//删除
		$scope.del = function() {
			if($scope.checkboxes.length > 0) {
				Customers.remove({custId: getSelectedId().join(',')}, function(){
					$scope.tableParams.reload();
					resetSelector();
				}, function(response){
					alert('删除失败.');
				});
			}
		};
	});
	app.register.controller('AddCustomerCtrl', function($scope, $http, $modalInstance, prevScope, enterprises, UserService, Customers) {
		$scope.enterprises = enterprises;
		$scope.close = function() {
			$modalInstance.close();
		};
		//是否有效
		$scope.isInvalid = function() {
			var count = 0;
			angular.forEach($scope.enterprises, function(enterprise){
				if(!enterprise.$exist)
					count++;
			});
			return count == 0;
		};
		//判断客户是否已经存在
		var checkExists = function(enterprises) {
			var uus = [], i = 0;
			for(i in enterprises) {
				uus.push(enterprises[i].uu);
			}
			Customers.queryByUU({custUU: uus.join(',')}, function(customers){
				if(customers.length > 0) {
					angular.forEach($scope.enterprises, function(enterprise){
						angular.forEach(customers, function(customer){
							if(enterprise.uu == customer.customerEnterprise.uu)
								enterprise.$exist = true;
						});
					});
				}
			});
		};
		
		checkExists(enterprises);
		//返回重新选择
		$scope.back = function() {
			prevScope.getEnterprise();
			$modalInstance.close();
		};
		// 添加默认联系人
		$scope.getUser = function(enterprise) {
			UserService.open(angular.copy(enterprise)).result.then(function(user){
				enterprise.$user = user;
			});
		};
		//客户申请
		$scope.apply = function() {
			if(!$scope.isInvalid()) {
				var customers = [];
				angular.forEach($scope.enterprises, function(enterprise){
					if(!enterprise.$exist)
						customers.push({
							customerEnterprise: enterprise,
							customerUser: (enterprise.$user || {userUU: enterprise.enAdminuu})
						});
				});
				Customers.saveAll(customers, function(){
					alert('保存成功!');
					$modalInstance.close();
				}, function(){
					alert('保存失败!');
				});
			}
		};
	});
});
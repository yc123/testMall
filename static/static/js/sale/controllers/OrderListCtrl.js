define([ 'app/app' ], function(app) {
	app.register.controller('OrderListCtrl', function($scope, $filter, $http, ngTableParams) {
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
                code: 'asc' 
            }
		}, {
			total : 0, 
			getData : function($defer, params) {
				$http.post('sale/orders', parseParams(params.url())).success(function(page){
					if(page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				}).error(function(){
					
				});
			}
		});
		$scope.checkboxes = {
			'checked' : false,
			items : {},
			length : 0
		};
		
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
	});
});
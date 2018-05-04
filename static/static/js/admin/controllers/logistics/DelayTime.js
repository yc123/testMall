define([ 'app/app' ], function(app) {
	app.register.controller('DelayTimeCtrl',['$scope', 'tradeDeliveryDelayTimeServices', 'toaster', function($scope, tradeDeliveryDelayTimeServices, toaster) {
		$scope.delayTimes = [];
		tradeDeliveryDelayTimeServices.get(null, function(data) {
			if(!data.length) {
				$scope.delayTimes = initInfo();
			}else {
				$scope.delayTimes = data;
				var obj = initObj();
				angular.forEach($scope.delayTimes, function(delayTime) {
					obj[delayTime.type] = false;
				});
				angular.forEach(obj, function(value, key) {
					if(value) {
						$scope.delayTimes.push({minDate: 0, maxDate: 0, type : parseInt(key)});
					}
				});
			}
		}, function(res) {
			toaster.pop('error', '获取信息失败 ', res.data);
		});
		$scope.modify = function(delayTime) {
			delayTime.edit = true;
		}
		
		$scope.save = function(delayTime, index) {
			var arr = [];
			arr.push(delayTime);
			tradeDeliveryDelayTimeServices.save(null, arr, function(data) {
				$scope.delayTimes[index] = data[0];
				toaster.pop('success', '保存成功');
			}, function(response) {
				toaster.pop('error', '保存失败' + response.text);
			});
		}
		
		$scope.cancle = function(delayTime) {
			delayTime.edit = false;
		}
		
		var initInfo = function() {
			var arr = [];
			arr.push({minDate: 0, maxDate: 0, type : 1});
			arr.push({minDate: 0, maxDate: 0, type : 2});
			arr.push({minDate: 0, maxDate: 0, type : 3});
			arr.push({minDate: 0, maxDate: 0, type : 4});
			return arr;
		}
		
		var initObj = function() {
			var obj = {1 : true, 2 : true, 3 : true, 4 : true};
			return obj;
		}
	}]);
	
	app.register.filter('delayTimeType', function() {
		return function(type) {
			var description = "";
			switch(type) {
				case 1: description = "国内发往国外(已弃用):"; break;
				case 2: description = "国外发往国外:"; break;
				case 3: description = "国内发往国内:"; break;
				case 4: description = "国外发往国内(已弃用):"; break;
			}
			return description;
		}
	});
});
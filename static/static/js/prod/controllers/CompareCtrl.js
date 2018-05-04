define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('CompareCtrl', ['$scope', 'toaster', '$stateParams', 'ComponentActiveAPI', function($scope, toaster, $stateParams, ComponentActiveAPI) {
		
		//检查一个东西是不是在一个数组里面
		var isIn = function(id, arr){
			var isIn = false;
			for(var i = 0; i < arr.length; i++){
				if(id == arr[i]){
					isIn = true;
					break;
				}
			}
			return isIn;
		}
		
		$scope.indexes = [0, 1, 2, 3, 4];
		if($stateParams.uuids) {
			ComponentActiveAPI.getByUuids({uuids: $stateParams.uuids}, function(data) {
				var allPropertiesId = [];
				var allPropertiesLabel = [];
				$scope.properties = [];
				//先遍历所有的properties得到对应的allPropertiesId和allPropertiesLabel
				for(var i=0; i<data.length; i++) {
					var properties = data[i].properties;
					for(var j=0; j<properties.length; j++){
						if(!isIn(properties[j].propertyid, allPropertiesId)){
							var obj = {};
							obj.propertyid = properties[j].propertyid;
							obj.labelCn = properties[j].property.labelCn;
							$scope.properties.push(obj);
							allPropertiesId.push(properties[j].propertyid);
						}
					}
				}
				//再利用生成好的重新运算
				angular.forEach($scope.properties, function(v, k) {
					v.values = [];
					for(var i=0; i<data.length; i++) {
						var properties = data[i].properties;
						var hasProperty = false;
						for(var j=0; j<properties.length; j++){
							if(properties[j].propertyid == v.propertyid){
								v.values.push(properties[j].value);
								hasProperty = true;
							}
						}
						if(!hasProperty){
							v.values.push(null);
						}
					}
				});
				
				
				$scope.components = data;
					
				//相似对比
				compareToTheAttri($scope.components);
				angular.forEach($scope.properties, function(p) {
					p.same = compareToSame(p.values);
				});
			}, function(response) {
				
			});
		}

		
		$scope.hideSame = false;
		
		$scope.attribute = 'true'; //是否展开的属性，默认展开 商品属性
		$scope.detailAttri = 'true'; //产品详细属性
		
		$scope.exposeAttri = function() {
			$scope.attribute = !$scope.attribute;
		}
		
		var compareToSame = function(data) {
			var value;
			if(data) {
				value = data[0];
			}
			var same= true;
			angular.forEach(data, function(obj) {
				if(!angular.equals(obj, value)) {
					same = false;
				}
			});
			return same;
		};
		
		var compareToTheAttri = function(data) {
			//比较最低价格
			var minPrice; //比较最低价格
			var reserve; //库存量
			var reserveType; //库存类别
			var minBuyQty; //最小起订量
			var minDelivery; //最小交货周期
			var maxDelivery; //maxDelivery
			var extraProperties //额外的属性
			if(data) {
				minPrice = data[0].minPrice;
				data.minPriceSame = true;
				reserve = data[0].reserve;
				data.reserveSame = true;
				reserveType = data[0].reserveType;
				data.reserveTypeSame = true;
				minBuyQty = data[0].minBuyQty;
				data.minBuyQtySame = true;
				minDelivery = data[0].minDelivery;
				data.deliverySame = true;
				maxDelivery = data[0].maxDelivery;
				extraProperties = data[0].extraProperties;
				data.extraProperties = true;
			}
			angular.forEach(data, function(obj) {
				if(!angular.equals(obj.minPrice, minPrice)) {
					data.minPriceSame = false;
				}
				if(!angular.equals(obj.reserveType, reserveType)) {
					data.reserveTypeSame = false;
				}
				if(!angular.equals(obj.reserve, reserve)) {
					data.reserveSame = false;
				}
				if(!angular.equals(obj.minBuyQty, minBuyQty)) {
					data.minBuyQtySame = false;
				}
				if((!angular.equals(obj.minDelivery, minDelivery))||(!angular.equals(obj.maxDelivery, maxDelivery))) {
					data.deliverySame = false;
				}
				if(!angular.equals(obj.extraProperties, extraProperties)) {
					data.extraProperties = false;
				}
			});
			
		};
		
		$scope.exposeDetail = function() {
			$scope.detailAttri = !$scope.detailAttri;
		}
	}]);
});
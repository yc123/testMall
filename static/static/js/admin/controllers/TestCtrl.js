define([ 'app/app' ], function(app) {
	app.register.controller('TestCtrl', ['$scope', '$http', 'ngTableParams', 'BrandsSubmit', 'BaseService', '$stateParams', '$timeout', function($scope, $http, ngTableParams, BrandsSubmit, BaseService, $stateParams, $timeout) {
		
		/**
		 * description 这是用来数据初始化的，别删除
		 * author 陈昊
		 * date 2016年4月1日15:28:50
		 */
		
		$scope.uploadKinds = function(){
			path_kinds = "static/js/test/kind.json"
			$http.get(path_kinds).success(function(data){
				str_kinds = angular.toJson(data);
				$http.post("product/kind/init", str_kinds).success(function(data){
					
				}).error(function(){
					
				});
			}).error(function(){
			});
		}
		
		$scope.uploadBrands = function(){
			path_brand = "static/js/test/brand.json"
			$http.get(path_brand).success(function(data){
				str_brands = angular.toJson(data)
				$http.post("product/init/brand", str_brands).success(function(data){
					
				}).error(function(){
					
				});
			}).error(function(){
				
			});
		}

		$scope.uploadProperty = function(){
			path_property = "static/js/test/property.json"
			$http.get(path_property).success(function(data){
				str_property = angular.toJson(data)
				$http.post("product/init/property", str_property).success(function(data){
					
				}).error(function(){
					
				});
			}).error(function(){
				
			});
		}
		
		$scope.uploadComponent = function(componentFileCount){
			for(var i = 0; i < componentFileCount; i++){
				filePath = "static/js/test/component" + i + ".json"
				$http.get(filePath).success(function(data){
					str_propertyvalue = angular.toJson(data);
					$http.post("product/init/component", str_propertyvalue).success(function(data){
						
					}).error(function(){
						
					});
				}).error(function(){
					
				});
			}
		}
		
		$scope.uploadPropertyValues = function(brandFileCount){
			for(var i = 0; i < brandFileCount; i++){
				filePath = "static/js/test/propertyvalue" + i + ".json"
				$http.get(filePath).success(function(data){
					str_propertyvalue = angular.toJson(data);
					$http.post("product/init/propertyvalue", str_propertyvalue).success(function(data){
						
					}).error(function(){
						
					});
				}).error(function(){
					
				});
				//为了防止浏览器卡死，这里需要休息一下下
				$timeout(function() {console.log("休息一下", i);}, 30000);
			}
		}
			
	}]);
});
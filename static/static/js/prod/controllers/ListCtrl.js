define([ 'app/app', 'jquery-summernote' ], function(app) {
	'use strict';
	app.register.controller('ListCtrl', ['$scope', 'toaster', '$modal', '$http', '$location', '$stateParams', '$templateCache', 'BrandActive', 'BrandVersion', 'ArrayUtil', 'NgTableParams', function($scope, toaster, $modal, $http, $location, $stateParams, $templateCache, BrandActive, BrandVersion, ArrayUtil, NgTableParams) {
		
		$scope.choices = [];
		
		var data = {
			    "pickers": [
			               {
			                   "type": "select", 
			                   "title": "脸型", 
			                   "options": [
			                       {"name": "圆脸", "isSelected": false},
			                       {"name": "方脸", "isSelected": false},
			                       {"name": "椭圆", "isSelected": false},
			                       {"name": "三角形", "isSelected": false},
			                       {"name": "正三角形", "isSelected": false},
			                       {"name": "黄金三角", "isSelected": false},
			                       {"name": "长方形", "isSelected": false},
			                       {"name": "正方形", "isSelected": false},
			                       {"name": "黄金比例长方形", "isSelected": false},
			                       {"name": "梯形", "isSelected": false},
			                       {"name": "直角梯形", "isSelected": false},
			                       {"name": "等腰梯形", "isSelected": false},
			                       {"name": "等边梯形", "isSelected": false},
			                       {"name": "圆锥", "isSelected": false},
			                       {"name": "大饼", "isSelected": false},
			                       {"name": "锥子", "isSelected": false}
			                   ]
			               }, 
			               {
			                   "type": "range", 
			                   "title": "库存", 
			                   "options": [
									{"name": "0-499", "isSelected": false},
									{"name": "500-999", "isSelected": false},
									{"name": "1000-10000", "isSelected": false}
			                   ]
			               }
			           ]
			       };
		
		$scope.pickers = data.pickers;
		
		$scope.addChoice = function(option){
			console.log(option);
			option.isSelected = !option.isSelected;
			
			
		};
		
		
		$scope.deleteChoice = function(index){
			$scope.choices.splice(index, 1);
		};
		
		
		
		
		
		
	}]);
	
});
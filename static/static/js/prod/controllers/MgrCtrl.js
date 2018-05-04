define(['app/app'], function(app) {
	'use strict';
	app.register.controller('MgrCtrl', ['$scope', '$http', '$location', '$stateParams', '$templateCache', 'toaster', 'productKinds', function($scope, $http, $location, $stateParams, $templateCache, toaster, productKinds){
		$scope.productKinds = productKinds;
		$scope.properties = [];
		// 不是通过路由过来的，再检查地址栏的参数kindIds
		if(!$scope.productKinds && $stateParams.kindIds && 
				/^(\d{1,}_)*(\d){1,}$/.test($stateParams.kindIds)) {
			$http.get('produce/kinds/' + $stateParams.kindIds.replace(/_/g, ','), {
				cache: $templateCache
			}).success(function(kinds){
				if(kinds.length > 0 && kinds.last().isLeaf) {
					$scope.productKinds = kinds;
					$scope.kindIds = $stateParams.kindIds;
					getKindProperties(kinds.last().id);
				}
			});
		}
		/**
		 * loading
		 */
		var setLoading = function(isLoading) {
			$scope.loading = isLoading;
		};
		/**
		 * 有效的
		 */
		var isValid = function() {
			return $scope.productKinds && $scope.productKinds.length > 0;
		};
		/**
		 * 获取类目属性
		 */
		var getKindProperties = function(kindId) {
			setLoading(true);
			$http.get('produce/kinds/' + kindId + '/properties').success(function(response){
				$scope.properties = response;
				setLoading(false);
			});
		};
		/**
		 * 选择类目
		 */
		$scope.select = function() {
			var selected = [];
			angular.forEach(arguments, function(arg) {
				arg.id && selected.push(arg);
			});
			var modified = selected.length > 0 && (!isValid() || 
				$scope.productKinds.last().id != selected.last().id);
			if(modified) {
				$scope.productKinds = selected;
				// 利用浏览器地址栏参数kindIds记住当前的选择
				var path = [];
				angular.forEach(selected, function(a){
					path.push(a.id);
				});
				$scope.kindIds = path.join('_');
				$location.search({kindIds: $scope.kindIds});
				// 同时加载该类目的属性
				getKindProperties(selected.last().id);
			}
		};
		/**
		 * 组件接触到可放置的位置时
		 */
		$scope.onDropEnter = function(data, e) {
			if(!isValid()) {
				return false;
			}
			return typeof data === 'object';
		};
		/**
		 * 摆放组件，并放在最后面
		 */
		$scope.onDropComplete1 = function(data, e) {
			if(isValid()) {
				if (data.num) {// 已存在的组件，拖放到最后一个
					angular.forEach($scope.properties, function(p, i){
						(p.num > data.num) && p.num--; 
					});
					data.num = $scope.properties.length;
				} else {// 新组件
					$scope.properties.push(angular.extend(angular.copy(data), {
						num: $scope.properties.length + 1
					}));
				}
			} else {
				toaster.pop('warning', '警告', '请先选择商品类目！');
			}
		};
		/**
		 * 摆放组件
		 */
		$scope.onDropComplete2 = function(data, e, self) {
			if(isValid()) {
				if (data.num) {// 已存在的组件，放在self之上
					var m = data.num, n = self.num;
					angular.forEach($scope.properties, function(p, i){
						if(m > n) {
							(p.num >= n && p.num < m) && p.num++;
						} else {
							(p.num > m && p.num <= n) && p.num--;
						}
					});
					data.num = n;
				} else {// 新组件，放在self之上
					$scope.properties.push(angular.extend(angular.copy(data), {
						num: self.num
					}));
					angular.forEach($scope.properties, function(p, i){
						(p.num >= self.num) && p.num++; 
					});
				}		
			} else {
				toaster.pop('warning', '警告', '请先选择商品类目！');
			}
		};
		/**
		 * 删除组件
		 */
		$scope.onDropDelete = function(data) {
			var num = data.num, idx = -1;
			angular.forEach($scope.properties, function(p, i) {
				(p.num == num) && (idx = i);
				(p.num > num) && (p.num -= 1);
			});
			$scope.properties.splice(idx, 1);
		};
		/**
		 * 保存属性设置
		 */
		$scope.save = function() {
			if($scope.productKinds && $scope.productKinds.length > 0) {
				var kindId = $scope.productKinds.last().id, data = [];
				angular.forEach($scope.properties, function(p){
					var _p = angular.copy(p);
					_p.required = _p.required ? 1 : 0;
					_p.kindId = kindId;
					data.push(_p);
				});
				setLoading(true);
				$http.post('produce/kinds/' + kindId + '/properties', data).success(function(response){
					setLoading(false);
					toaster.pop('success', '提示', '保存成功！');
					$scope.properties = response;
				}).error(function(response){
					setLoading(false);
					toaster.pop('error', '错误', '保存失败！' + response);
				});
			}
		};
	}]);
	// 所有商品类目
	app.register.controller('NavCtrl', ['$scope', '$http', function($scope, $http) {
		$scope.categories = [ {
			name : 'LED、LCD系列产品',
			ex : [ {
				name : 'LED灯珠'
			}, {
				name : 'LED显示屏'
			} ]
		}, {
			name : '集成电路（IC）',
			ex : [ {
				name : '通信IC'
			}, {
				name : '稳压IC'
			}, {
				name : '驱动IC'
			} ]
		}, {
			name : '二、三极管',
			ex : [ {
				name : '二极管'
			}, {
				name : '三极管'
			}, {
				name : '整流器'
			} ]
		}, {
			name : '连接器',
			ex : [ {
				name : '汽车连接器'
			}, {
				name : '电脑连接器'
			}, {
				name : '端子'
			} ]
		}, {
			name : '电阻、电容、电感',
			ex : [ {
				name : '热敏电阻'
			}, {
				name : '电解电容'
			}, {
				name : '互感器'
			} ]
		}, {
			name : '传感器',
			ex : [ {
				name : '压力传感器'
			}, {
				name : '温度传感器'
			} ]
		}, {
			name : '保护器件及继电器',
			ex : [ {
				name : '保险丝'
			}, {
				name : '温度开关'
			}, {
				name : '继电器'
			} ]
		}, {
			name : '变压器',
			ex : [ {
				name : '高频变压器'
			}, {
				name : '稳压器'
			} ]
		}, {
			name : '电子材料、电路板',
			ex : [ {
				name : '电磁铁'
			}, {
				name : 'PCB电路板'
			} ]
		}, {
			name : '其他',
			ex : [ {
				name : '蜂鸣器'
			}, {
				name : '变频器'
			}, {
				name : '电位器'
			} ]
		} ];
		var getCategories = function(parentId) {
			return $http.get('produce/kinds/' + parentId + '/children_all');
		};
		getCategories(0).success(function(response) {
			var cates = [];
			angular.forEach(response, function(c, i) {
				cates.push(angular.extend($scope.categories[i], c));
			});
			$scope.categories = cates;
		});
	}]);
	/**
	 * 生成动态表单字段
	 */
	app.register.directive('dynamicInput', ['$parse', '$compile', 'fieldBuilder', function($parse, $compile, fieldBuilder){
		return {
			restrict: 'A',
			transclude: true,
			link: function (scope, element, attrs, ctrl) {
				var input = attrs.dynamicInput;
				scope.$watch($parse(input), function(p){
					element.replaceWith($compile(fieldBuilder.element(input, p))(scope));
				});
			}
		};
	}]).factory('fieldBuilder', function(){
		return {
			element: function(input, property) {
				var el = null, scope = this;
				switch(property.type) {
				case 'text':
					el = scope.text(input, property);
					break;
				case 'text-addon-left':
					el = scope.text(input, property);
					break;
				case 'text-addon-right':
					el = scope.text(input, property);
					break;
				case 'text-text':
					el = scope.doubleText(input, property);
					break;
				case 'textarea':
					el = scope.textarea(input, property);
					break;
				case 'select':
					el = scope.select(input, property);
					break;
				case 'select-multiple':
					el = scope.select(input, property);
					break;
				case 'checkbox-inline':
					el = scope.boxInline(input, property);
					break;
				case 'radio-inline':
					el = scope.boxInline(input, property);
					break;
				case 'checkbox':
					el = scope.box(input, property);
					break;
				case 'radio':
					el = scope.box(input, property);
					break;
				case 'file':
					el = scope.file(input, property);
					break;
				}
				return el;
			},
			text: function(input, property) {
				var name = 'dynamic_field_' + property.num, 
					isAdd = property.type == 'text-addon-left' || property.type == 'text-addon-right';
				return angular.element(
					'<div class="col-sm-7">' + 
						(isAdd ? '<div class="input-group">' : '') +
							(property.type == 'text-addon-left' ? '<div class="input-group-addon">{{' + input + '.prefix}}</div>' : '') +
							'<input type="text" placeholder="{{' + input + '.placeholder}}" class="form-control input-sm" ' +
							'name="' + name + '" ng-model="' + name + '" ' +
							(property.required == 1 ? 'required' : '') + '>' +
							(property.type == 'text-addon-right' ? '<div class="input-group-addon">{{' + input + '.subfix}}</div>' : '') +
						(isAdd ? '</div>' : '') +
						'<p class="help-block" ng-show="' + input + '.helpinfo">{{' + input + '.helpinfo}}</p>' +
					'</div>');
			},
			doubleText: function(input, property) {
				var name = 'dynamic_field_' + property.num;
				return angular.element(
					'<div class="col-sm-7">' + 
						'<div class="input-group group-2">' +
							'<input type="text" placeholder="{{' + input + '.placeholder}}" class="form-control input-sm" ' +
							'name="' + name + '" ng-model="' + name + '_0" ' +
							(property.required == 1 ? 'required' : '') + '>' +
							'<input type="text" placeholder="{{' + input + '.placeholder}}" class="form-control input-sm" ' +
							'name="' + name + '" ng-model="' + name + '_1" ' +
							(property.required == 1 ? 'required' : '') + '>' +
						'</div>' +
						'<p class="help-block" ng-show="' + input + '.helpinfo">{{' + input + '.helpinfo}}</p>' +
					'</div>');
			},
			textarea: function(input, property) {
				var name = 'dynamic_field_' + property.num;
				return angular.element(
					'<div class="col-sm-7">' + 
						'<textarea placeholder="{{' + input + '.placeholder}}" class="form-control" ' +
						'name="' + name + '" ng-model="' + name + '" ' +
						(property.required == 1 ? 'required' : '') + '>' +
						'</textarea>' +
						'<p class="help-block" ng-show="' + input + '.helpinfo">{{' + input + '.helpinfo}}</p>' +
					'</div>');
			},
			select: function(input, property) {
				var name = 'dynamic_field_' + property.num;
				return angular.element(
					'<div class="col-sm-6">' + 
						'<select class="form-control input-sm" ' +
						'name="' + name + '" ng-model="' + name + '" ' +
						(property.type == 'select-multiple' ? 'multiple ' : '') +
						(property.required == 1 ? 'required' : '') + '>' +
							'<option ng-repeat="opt in ' + input + '.options | split: \'\n\'">{{opt}}</option>' +
						'</select>' +
					'</div>');				
			},
			boxInline: function(input, property) {
				var name = 'dynamic_field_' + property.num, 
					type = property.type == 'checkbox-inline' ? 'checkbox' : 'radio';
				return angular.element(
					'<div class="col-sm-7">' + 
						'<label class="' + type + '-inline" ng-repeat="opt in ' + input + '.options | split: \'\n\'">' + 
							'<input type="' + type + '" name="' + name + '"> {{opt}}' + 
						'</label>' +
					'</div>');	
			},
			box: function(input, property) {
				var name = 'dynamic_field_' + property.num, type = property.type;
				return angular.element(
					'<div class="col-sm-7">' + 
						'<div class="' + type + '" ng-repeat="opt in ' + input + '.options | split: \'\n\'"><label>' + 
							'<input type="' + type + '" name="' + name + '"> {{opt}}' + 
						'</label></div>' +
					'</div>');	
			},
			file: function(input, property) {
				var name = 'dynamic_field_' + property.num;
				return angular.element(
					'<div class="col-sm-7">' + 
						'<input type="file" class="input-file" ' +
						'name="' + name + '" ng-model="' + name + '">' +
					'</div>');
			}
		};
	});
	/**
	 * Array split
	 */
	app.register.filter('split', function(){
		return function(str, charr) {
			if(str)
				return str.split(charr);
			return [];
		};
	});
	/**
	 * popover with html content
	 */
	app.register.directive('htmlPopup', function() {
		return {
			restrict: 'EA',
			replace: true,
	        transclude: true,
			scope: {
			    title: '@',
			    placement: '@',
			    animation: '&',
			    isOpen: '&'
			},
			template: "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
			    "  <div class=\"arrow\"></div>" +
			    "  <div class=\"popover-inner\">" +
			    "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-show=\"title\"></h3>" +
			    "      <div class=\"popover-content\" ng-transclude></div>" +
			    "  </div>" +
			    "</div>"
		};
	});
	/**
	 * loading
	 */
	app.register.directive('loading', ['$parse', function($parse) {
		return {
			restrict : 'A',
			scope : false,
			link : function(scope, element, attrs) {
				element.addClass('loading-container');
				scope.$watch($parse(attrs.loading), function(value) {
					element.toggleClass('ng-hide', !value);
				});
			}
		};
	}]);
});
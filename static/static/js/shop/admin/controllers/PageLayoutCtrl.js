define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('PageLayoutCtrl', function($scope, pageConfig) {
		$scope.config = pageConfig;
		$scope.layouts = [];
		/**
		 * 摆放布局，放在最后面
		 */
		$scope.onDropComplete1 = function(data, e) {
			if (typeof data === 'string') {
				var arr = data.split(','), size = 0, modules = [], num = $scope.layouts.length + 1;
				for ( var i in arr) {
					size += Number(arr[i]);
					modules.push({
						constructor : 'module',
						flex : Number(arr[i]),
						type : null,
						text : null
					});
				}
				$scope.layouts.push({
					constructor : 'layout',
					number : num,
					size : size,
					modules : modules
				});
			} else if (typeof data === 'object' && data.constructor == 'layout') {
				// 布局单元拖动到最后面
				var num = data.number;
				angular.forEach($scope.layouts, function(l) {
					(l.number > num) && (l.number -= 1);
				});
				data.number = $scope.layouts.length;
			}
		};
		/**
		 * 摆放布局，放在选中布局前面
		 * 
		 * @param data
		 *            布局单元
		 * @param e
		 * @param obj
		 *            表示接触到的摆放布局
		 */
		$scope.onDropComplete2 = function(data, e, obj) {
			if (obj && obj.constructor == 'layout') {
				if (typeof data === 'string') {
					var arr = data.split(','), size = 0, modules = [], num = $scope.layouts.length + 1;
					if (obj && angular.isNumber(obj.number)) {
						num = obj.number;
						angular.forEach($scope.layouts, function(l) {
							(l.number >= num) && (l.number += 1);
						});
					}
					for ( var i in arr) {
						size += Number(arr[i]);
						modules.push({
							constructor : 'module',
							flex : Number(arr[i]),
							type : null,
							text : null
						});
					}
					$scope.layouts.push({
						constructor : 'layout',
						number : num,
						size : size,
						modules : modules
					});
				} else if (typeof data === 'object' && data.constructor == 'layout') {
					// 两个布局之间互相拖动变更位置
					var num = data.number;
					data.number = obj.number;
					obj.number = num;
				}
			}
		};
		/**
		 * 摆放模块，放到选中布局小单元里面
		 * 
		 * @param data
		 *            模块
		 * @param e
		 * @param obj 布局小单元
		 */
		$scope.onDropComplete3 = function(data, e, obj) {
			angular.extend(obj, data);
		};
		/**
		 * 布局接触到可放置的位置时 限制拖过来的组件必须是布局元素
		 */
		$scope.onLayoutDropEnter = function(data, e) {
			return typeof data === 'string' || (typeof data === 'object' && data.constructor == 'layout');
		};
		/**
		 * 模块接触到可放置的布局时 限制拖过来的组件必须是模块
		 */
		$scope.onModuleDropEnter = function(data, e) {
			return typeof data === 'object' && angular.isDefined(data.type);
		};
		/**
		 * 删除布局
		 */
		$scope.onDropDelete = function(data) {
			var num = data.number, idx = -1;
			angular.forEach($scope.layouts, function(l, i) {
				(l.number == num) && (idx = i);
				(l.number > num) && (l.number -= 1);
			});
			$scope.layouts.splice(idx, 1);
		};
		/**
		 * 删除模块
		 */
		$scope.onModuleDelete = function(module) {
			module.type = null;
			module.text = null;
		};
		/**
		 * 模块样式
		 */
		$scope.getColClass = function(size, module) {
			var cls = 'col-';
			switch (size) {
			case 12:
				cls += 'md-';
				break;
			case 10:
				cls += '10-';
				break;
			default:
				cls += 'md-';
			}
			return cls + module.flex + (module.type ? ' added' : '');
		};
	});
});
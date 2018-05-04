define(['angular'], function(angular) {
	'use strict';
	
	/**
	 * 生成动态表单字段
	 */
	var app = angular.module('ngDynamicInput', []);
	
	/**
	 * 1、用法<div dynamic-input="property" [readonly="true"]></div>
	 * 	将动态属性的模型property传入，readonly 属性可选，为true时说明不用于获取输入框的值
	 * 
	 * 2、获取的值存于property.value
	 * 	文本输入框：property.value = 'value'
	 * 	前置/后置输入框：property.value = 'value'(不含前缀后缀值)
	 * 	复选框：property.value = {0: 'value0', 1: false, 2: 'value2', 3: 'value3', 4: false}
	 * 	单选框：property.value = 'value2'(被选中的标签值)
	 * 	区间输入框：property.value = {0: 'minValue', 1: 'maxValue'}
	 * 	文件输入框：暂时无效//TODO
	 * 
	 * 3、输入验证还没做//TODO
	 */
	app.directive('propertyInput', ['$parse', '$compile', 'inputBuilder', function($parse, $compile, inputBuilder){
		return {
			restrict: 'A',
			transclude: true,
			scope: {
				propertyInput: '='
			},
			link: function (scope, element, attrs, ctrl) {
				var input = attrs.propertyInput;
				element.replaceWith($compile(inputBuilder.element(input, scope.propertyInput))(scope.$parent));
			}
		};
	}]).factory('inputBuilder', function(){
		return {
			element: function(input, property) {
				var me = this, el = null;
				switch(property.type) {
					case 'S':
						el = me.select(input, property);
						break;
					case 'N':
						el = me.number(input, property);
						break;
					case 'F':
						el = me.fromTo(input, property);
						break;
					case 'A':
						el = me.associate(input, property);
						break;
					default:
						el = me.associate(input, property);
						break;
				}
				return el;
			},
			select: function(input, property) {
				return angular.element(
					'<div>' + 
						'<select class="form-control input-sm" ng-model="' + input + '.value" ng-options="o.option as o.option for o in ' + input + '.options" placeholder="请选择' + property.property.labelCn + '">' +
						'</select>' +
					'</div>');
			},
			number: function(input, property) {
				return angular.element(
					'<div class="input-group input-group-sm">' + 
						'<input class="form-control input-sm" placeholder="+/-/数字" ng-model="' + input + '.value">' +
						'<div class="input-group-addon mt-units">' + 
							'<span ng-bind="' + input + '.selectedUnit.unit || ' + input + '.multiUnits[0].unit"></span>' +
							'<ul class="mt-units-down">' +
								'<li class="mt-units-item" ng-repeat="u in ' + input + '.multiUnits" ng-bind="u.unit" ng-click="selectUnit(' + input + ',u)"></li>' +
							'<ul>' +
						'</div>' + 
					'</div>');
			},
			fromTo: function(input, property) {
				return angular.element(
					'<div class="input-group input-group-sm">' + 
						'<input class="form-control input-sm" placeholder="最小值" ng-model="' + input + '.min">' +
						'<div class="input-group-addon mt-units">' +
							'<span ng-bind="' + input + '.minUnit.unit || ' + input + '.multiUnits[0].unit"></span>' +
							'<ul class="mt-units-down">' +
								'<li class="mt-units-item" ng-repeat="u in ' + input + '.multiUnits" ng-bind="u.unit" ng-click="selectMinUnit(' + input + ',u)"></li>' +
							'<ul>' +
						'</div>' + 
						'<div class="input-group-addon">~</div>' + 
						'<input class="form-control input-sm" placeholder="最大值" ng-model="' + input + '.max">' +
						'<div class="input-group-addon mt-units">' +
							'<span ng-bind="' + input + '.maxUnit.unit || ' + input + '.multiUnits[0].unit"></span>' +
							'<ul class="mt-units-down">' +
								'<li class="mt-units-item" ng-repeat="u in ' + input + '.multiUnits" ng-bind="u.unit" ng-click="selectMaxUnit(' + input + ',u)"></li>' +
							'<ul>' +
						'</div>' + 
					'</div>' +
					'<div class="help-block">如果只是单个数值，并非范围数值，请填写最小值。</div>');
			},
			associate: function(input, property) {
				return angular.element(
					'<div>' + 
						'<input class="form-control input-sm" ng-model="' + input + '.value" autocomplete="off" placeholder="{{' 
						+ input + '.property.labelCn}}" typeahead="value.value for value in ' + input + '.values | filter : $viewValue | limitTo : 10 " typeahead-min-length="0" maxDat>' +
					'</div>');
			}
		}
	}).directive('dynamicInput', ['$parse', '$compile', 'fieldBuilder', function($parse, $compile, fieldBuilder){
		return {
			restrict: 'A',
			transclude: true,
			link: function (scope, element, attrs, ctrl) {
				var input = attrs.dynamicInput;
				var editProperty = attrs.editProperty;
				scope.$watch($parse(input), function(p){
					element.replaceWith($compile(fieldBuilder.element(input, p, editProperty))(scope));
				});
			}
		};
	}]).factory('fieldBuilder', function(){
		return {
			element: function(input, property, editProperty) {
				var el = null, scope = this;
				switch(property.type) {
				case 'text':
					el = scope.text(input, property, editProperty);
					break;
				case 'text-addon-left':
					el = scope.text(input, property, editProperty);
					break;
				case 'text-addon-right':
					el = scope.text(input, property, editProperty);
					break;
				case 'text-text':
					el = scope.doubleText(input, property, editProperty);
					break;
				case 'textarea':
					el = scope.textarea(input, property, editProperty);
					break;
				case 'select':
					el = scope.select(input, property, editProperty);
					break;
				case 'checkbox-inline':
					el = scope.boxInline(input, property, editProperty);
					break;
				case 'radio-inline':
					el = scope.boxInline(input, property, editProperty);
					break;
				case 'checkbox':
					el = scope.box(input, property, editProperty);
					break;
				case 'radio':
					el = scope.box(input, property, editProperty);
					break;
				case 'file':
					el = scope.file(input, property, editProperty);
					break;
				}
				return el;
			},
			text: function(input, property, editProperty) {
				var readonly = input + '.readonly',
					name = 'dynamic_field_' + property.num,
					model = input + '.value',
					dataType = property.dataType || 'text',
					isAdd = property.type == 'text-addon-left' || property.type == 'text-addon-right';
				return angular.element(
					'<div class="col-sm-6">' + 
						(isAdd ? '<div class="input-group">' : '') +
							(property.type == 'text-addon-left' ? '<div class="input-group-addon">{{' + input + '.prefix}}</div>' : '') +
							'<input ng-disabled="' + readonly + '" type="' + dataType + '" placeholder="{{' + input + '.placeholder}}" class="form-control input-sm" ' +
							'name="' + name + '" ng-model="' + model + '" ' +
							(property.required == 1 ? 'required' : '') + '>' +
							(property.type == 'text-addon-right' ? '<div class="input-group-addon">{{' + input + '.subfix}}</div>' : '') +
						(isAdd ? '</div>' : '') +
						'<p class="help-block" ng-show="' + input + '.helpinfo">{{' + input + '.helpinfo}}</p>' +
					'</div>');
			},
			doubleText: function(input, property, editProperty) {
				var readonly = input + '.readonly',
					name = 'dynamic_field_' + property.num,
					dataType = property.dataType || 'text',
					model = input + '.value';
				return angular.element(
					'<div class="col-sm-6">' + 
						'<div class="input-group group-2">' +
							'<input ng-disabled="' + readonly + '" type="' + dataType + '" placeholder="{{' + input + '.placeholder}}" class="form-control input-sm" ' +
							'name="' + name + '" ng-model="' + model + '[0]" ' +
							(property.required == 1 ? 'required' : '') + '>' +
							'<input ng-disabled="' + readonly + '" type="' + dataType + '" placeholder="{{' + input + '.placeholder}}" class="form-control input-sm" ' +
							'name="' + name + '" ng-model="' + model + '[1]" ' +
							(property.required == 1 ? 'required' : '') + '>' +
						'</div>' +
						'<p class="help-block" ng-show="' + input + '.helpinfo">{{' + input + '.helpinfo}}</p>' +
					'</div>');
			},
			textarea: function(input, property, editProperty) {
				var readonly = input + '.readonly',
					name = 'dynamic_field_' + property.num,
					model = input + '.value';
				return angular.element(
					'<div class="col-sm-6">' + 
						'<textarea ng-disabled="' + readonly + '" placeholder="{{' + input + '.placeholder}}" class="form-control" ' +
						'name="' + name + '" ng-model="' + model + '" ' +
						(property.required == 1 ? 'required' : '') + '>' +
						'</textarea>' +
						'<p class="help-block" ng-show="' + input + '.helpinfo">{{' + input + '.helpinfo}}</p>' +
					'</div>');
			},
			select: function(input, property, editProperty) {
				var readonly = input + '.readonly',
					name = 'dynamic_field_' + property.num,
					model = input + '.value';
				return angular.element(
					'<div class="col-sm-6">' + 
						'<select ng-disabled="' + readonly + '" class="form-control input-sm" ' +
						'name="' + name + '" ng-model="' + model + '" ' +
						(property.required == 1 ? 'required' : '') + 
						' ng-options="opt for opt in ' + input + '.options | split: \'\n\'">' +
//							'<option ng-repeat="opt in ' + input + '.options | split: \'\n\'" value="{{opt}}">{{opt}}</option>' +
						'</select>' +
					'</div>');
			},
			boxInline: function(input, property, editProperty) {
				var readonly = input + '.readonly',
					name = 'dynamic_field_' + property.num,
					model = input + '.value', 
					type = property.type == 'checkbox-inline' ? 'checkbox' : 'radio';
				var html = '<div class="col-sm-6">';
				angular.forEach(property.options.split('\n'), function(v, k){
					html += '<label class="' + type + '-inline">' + 
							(type == 'radio' ? ('<input ng-disabled="' + readonly + '" type="' + type + '" name="' + name + '" ng-model="' + model + '" value="' + v + '"> ' + v) : (
							'<input ng-disabled="' + readonly + '" type="' + type + '" name="' + name + '" ng-model="' + model + '[' + k + ']" ng-true-value="\'' + v + '\'"> ' + v)) + 
						'</label>';
				});
				html += '</div>';
				if(editProperty) {
					html = '<div class="col-sm-6">' + 
						'<label class="' + type + '-inline" ng-repeat="opt in ' + input + '.options | split: \'\n\'">' + 
							'<input type="' + type + '" name="' + name + '" ng-model="' + name + '" value="{{opt}}"> {{opt}}' + 
						'</label>' +
					'</div>';
				}
				return angular.element(html);
			},
			box: function(input, property, editProperty) {
				var readonly = input + '.readonly',
					name = 'dynamic_field_' + property.num,
					model = input + '.value', type = property.type;
				var html = '<div class="col-sm-6">';
				angular.forEach(property.options.split('\n'), function(v, k){
					html += '<div class="' + type + '"><label>' + 
							(type == 'radio' ? ('<input ng-disabled="' + readonly + '" type="' + type + '" name="' + name + '" ng-model="' + model + '" value="' + v + '"> ' + v) : (
							'<input ng-disabled="' + readonly + '" type="' + type + '" name="' + name + '" ng-model="' + model + '[' + k + ']" ng-true-value="\'' + v + '\'"> ' + v)) + 
						'</label></div>';
				});
				html += '</div>';
				if(editProperty) {
					html = '<div class="col-sm-6">' + 
						'<div class="' + type + '" ng-repeat="opt in ' + input + '.options | split: \'\n\'"><label>' + 
							'<input type="' + type + '" name="' + name + '"> {{opt}}' + 
						'</label></div>' +
					'</div>';
				}
				return angular.element(html);
			},
			file: function(input, property, editProperty) {
				var name = 'dynamic_field_' + property.num,
					model = input + '.value';
				return angular.element(
					'<div class="col-sm-6">' + 
						'<input type="file" class="input-file" ' +
						'name="' + name + '" ng-model="' + model + '">' +
					'</div>');
			}
		};
	});
	
	/**
	 * popover with html content
	 */
	app.directive('htmlPopup',function() {
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
	 * 把字符串按分隔符分割成数组
	 */
	app.filter('split', function(){
		return function(str, charr) {
			if(str)
				return str.split(charr);
			return [];
		};
	});
});
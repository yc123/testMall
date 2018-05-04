define(['angular', 'showdown', 'angular-toaster'], function(angular) {
	'use strict';
	angular.module('common.directives', ['common.tpls']).directive('loading', function() {
		return {
			restrict: 'A',
			scope: false,
			link: function(scope, element, attrs) {
				element.addClass('loading-container');
				scope.$watch(attrs.loading, function(value) {
					element.toggleClass('ng-hide', !value);
				});
			}
		};
	}).directive('datetrigger', ['$parse', function($parse) {
		return {
			restrict: 'EA',
			transclude: true,
			replace: true,
			scope: {
				format: '@',
				name: '@',
				style: '@',
				maxDate: '=',
				minDate: '='
			},
			templateUrl: 'template/common/datetrigger.html',
			link: function(scope, element, attrs) {
				scope.isOpen = false;
				scope.open = function($event) {
					$event.preventDefault();
					$event.stopPropagation();
					scope.isOpen = !scope.isOpen;
				};
				var getModelValue = $parse(attrs.model),
					setModelValue = getModelValue.assign;
				scope.$parent.$watch(getModelValue, function(val) {
					scope.date = val;
				});
				scope.$watch('date', function(val) {
					if (setModelValue) {
						setModelValue(scope.$parent, val);
					}
				});
			}
		};
	}]).directive('ngSearch', ['$parse', function($parse) {
		/** Introduction
		 * 搜索输入框
		 * eg:<input ng-search="onSearch(keyword)" ng-model="keyword">
		 */
		return {
			require: '?ngModel',
			restrict: 'A',
			link: function(scope, element, attrs, ngModel) {
				var searchFn = $parse(attrs.ngSearch);
				element.bind('keypress', function(event) {
					if (event.keyCode == '13') {
						event.preventDefault();
						event.stopPropagation();
						searchFn(scope, {
							$data: ngModel.$modelValue,
							$event: event
						});
					}
				});
			}
		};
	}]).directive('scrollTop', ['$document', function($document) { // 向上滚动到屏幕顶部是就固定到屏幕顶部
		return {
			restrict: 'A',
			scope: {
				'scrollTop': '@'
			},
			link: function(scope, element, attr) {
				var scrollTop = scope.scrollTop || 0;
				var offsetTop = element[0].offsetTop,
					position = element.css('position'),
					top = element.css('top');
				var height = element[0].offsetHeight,
					nextMargin = element.next().css('margin-top');
				var m = height + parseInt(nextMargin);
				$document.on('scroll', function(e) {
					var documentScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
					if (documentScrollTop > offsetTop - scrollTop) {
						element.css('position', 'fixed').css('top', scrollTop + 'px');
						if (position == 'static') { // 给后面兄弟节点加上margin-top，防止Dom结构错乱
							element.next().css('margin-top', m + 'px');
						}
					} else {
						element.css('position', position).css('top', top + 'px');
						if (position == 'static') {
							element.next().css('margin-top', nextMargin);
						}
					}
				});
			}
		};
	}]).directive('margin', ['$document', function($document) { // 向上滚动到屏幕顶部是就固定到屏幕顶部
		return {
			restrict: 'A',
			scope: {
				margin: '@',
				size: '='
			},
			link: function(scope, element, attr) {
				var margin = scope.margin || 'top';
				var size = scope.size || 10;
				if (margin == 'top') {
					element.css('margin-top', size + 'px');
				} else if (margin == 'bottom') {
					element.css('margin-bottom', size + 'px');
				} else if (margin == 'left') {
					element.css('margin-left', size + 'px');
				} else if (margin == 'right') {
					element.css('margin-right', size + 'px');
				}
			}
		};
	}]).directive('lazyLoad', function() {
		/**
		 * 延迟加载:lazy-load="http://www.example.com/1.png"
		 */
		var elements = (function() {
			var index = 0;
			var _elements = [];
			return {
				push: function(element) {
					_elements[index++] = element;
				},
				del: function(index) {
					_elements.splice(index, 1);
				},
				get: function() {
					return _elements;
				},
				size: function() {
					return _elements.length;
				}
			}
		})();
		//  元素是否在可视区域
		var isVisible = function(ele) {
			var rect = ele[0].getBoundingClientRect();
			if (angular.element(window)[0].parent.innerHeight < rect.top) {// 元素位于屏幕下方
				return false;
			} else {
				return true;
			}
		};
		// 加载图片
		var load = function(element, index) {
			var el = element.el;
			el.attr('src', element.src);
			el.on('load', function() {
				el.css({
					'opacity': '1'
				})
			});
			elements.del(index);
		};
		//  检查是否可见
		var checkElements = function() {
			var els = elements.get();
			angular.forEach(els, function(v, k) {
				isVisible(v.el) ? load(v, k) : false;
			});
		};
		angular.element(window).on('scroll', checkElements);
		return {
			restrict: 'EA',
			replace: false,
			link: function(scope, element, attrs) {
				var url = attrs.lazyLoad;
				if (url) {
					if (isVisible(element)) {
						element.attr('src', url);
					} else {
						element.css({
							'background': '#fff',
							'opacity': 0,
							'transition': 'opacity 1s',
							'-webkit-transition': 'opacity 1s',
							'animation-duration': '1s'
						});

						elements.push({
							el: element,
							src: url
						});
					}
				}
			}
		};
	})
	/**
	 * 分离的下拉框
	 * <div split-dropdown>
	 *   <div dropdown-scroll>
	 *   	<div split-dropdown-trigger="1"></div>
	 *      <div split-dropdown-trigger="2"></div>
	 *      <div split-dropdown-trigger="3"></div>
	 *   </div>
	 *   <div>
	 *   	<div split-dropdown-toggle="1"></div>
	 *   	<div split-dropdown-toggle="2"></div>
	 *   	<div split-dropdown-toggle="3"></div>
	 *   </div>
	 * </div>
	 */
		.directive('splitDropdownTrigger', [function() {
			return {
				restrict: 'A',
				scope: {
					splitDropdownTrigger: '='
				},
				require: '?splitDropdownToggle',
				link: function(scope, element, attr) {
					var me = element;
					var container = me.parents('[split-dropdown]');
					var id = scope.splitDropdownTrigger;
					// 获取对应的下拉显示框
					// 移动到开关时显示下拉框，移开时隐藏下拉框，其中从开关移动到下拉框时是有两个动作的：1、从开关移出；2、移动下拉框
					me.off('mouseenter').bind('mouseenter', function(e) {
						var menu = container.find('[split-dropdown-toggle=' + id + ']');
						setPosition(menu);
						menu.css('display', 'block');
					}).bind('mouseleave', function(e) {
						var menu = container.find('[split-dropdown-toggle=' + id + ']');
						menu.css('display', 'none');
					});

					function setPosition(menu) {
						var top = me.offset().top - container.offset().top;
						var left = me.offset().left - container.offset().left;
						var width = me.innerWidth(), height = me.innerHeight();
						top = top + height;
						// 控制下拉显示框的定位
						menu.css('top', top + 'px').css('left', left);
					}
				}
			};
		}])
		.directive('splitDropdownToggle', [function() {
			return {
				restrict: 'A',
				link: function(scope, element, attr) {
					// 移动到下拉显示框上不隐藏下拉显示框，移开下拉显示框隐藏下拉显示框
					element.off('mouseenter').bind('mouseenter', function(e) {
						element.css('display', 'block');
					}).bind('mouseleave', function(e) {
						element.css('display', 'none');
					});
				}
			}
		}])
		/**
		 * 提示框指令，主要用于从overflow popping出来
		 * 定位的级别是父级的positioned容器/body
		 */
		.directive('callout', [function () {
			return {
				restrict: 'A',
				link: function (scope, element, attrs) {
					var left, top;
					if(attrs['sticky']) { // 对应data-sticky
						// 有问题，无法成功监听DOM改变事件
						// var stickySelector = '#' + attrs['sticky'];
						// var calloutContainer = '#' + attrs['calloutContainer'];
						// left = $(stickySelector).position().left + Number(attrs['leftSticky']);
						// top = $(stickySelector).position().top  + Number(attrs['topSticky']);
						// $(calloutContainer).bind("mouseover",function(){
						//     var newLeft = $(stickySelector).position().left + Number(attrs['leftSticky']);
						//     var newTop = $(stickySelector).position().top  + Number(attrs['topSticky']);
						//     if(left != newLeft || top != newTop) {
						//         element.css({'left': newLeft, 'top' : newTop}); // 便于调试
						//     }
						// });
					}else {
						left = element.position().left + Number(attrs['left']); // 数据属性获取值时去掉data部分。如获取data-left的值使用attrs[left]
						top = element.position().top  + Number(attrs['top']);
					}
					element.css({'left': left, 'top' : top});
				}
			}
		}]).
	/**
	 * 验证所有分段价格的信息
	 */
	directive('validataPrice', ['toaster', function (toaster) {
		return {
			restrict:'A',
			require:'?^ngModel',
			link:function(scope, iele, iattr, ctrl){
				var validataPrice =  function () {
					if(ctrl.$viewValue) {
						var value = ctrl.$viewValue;
						var model = ctrl.$modelValue;
						if(!value) {
							return ;
						}
						if(value.indexOf('.') > -1) {
							var arr = value.split(".");
							if(arr[0].length > 4) {
								ctrl.$setViewValue(model);
								ctrl.$render();
								// toaster.pop('warning', '提示', '单价必须小于10000');
								return model;
							}
							if(arr[1].length > 6) {
								ctrl.$setViewValue(model);
								ctrl.$render();
								// toaster.pop('warning', '提示', '单价只精确到小数点后6位');
								return model;
							}
						}else {
							if(value.toString().length > 4) {
								ctrl.$setViewValue(model);
								ctrl.$render();
								// toaster.pop('warning', '提示', '单价必须小于10000');
								return model;
							}
						}
					}
					return value;
				};
				ctrl.$parsers.push(validataPrice);
			}
		}
	}]);


	angular.module("common.tpls", ["template/common/datetrigger.html"]);
	angular.module("template/common/datetrigger.html", []).run(["$templateCache", function($templateCache) {
		$templateCache.put("template/common/datetrigger.html",
			"<div class=\"input-append\">" +
			"<input type=\"text\" name=\"{{name}}\" class=\"input-medium\" " +
			"style=\"{{style}}\" "+
			"datepicker-popup=\"{{format}}\" ng-model=\"date\" " +
			"is-open=\"isOpen\" show-weeks=\"false\"" +
			"current-text=\"{{'ui.date.currentText' | i18n}}\"" +
			"toggle-weeks-text=\"{{'ui.date.toggleWeeksText' | i18n}}\"" +
			"clear-text=\"{{'ui.date.clearText' | i18n}}\"" +
			"datepicker-options=\"{formatDayTitle: '{{\'ui.date.formatDayTitle\' | i18n}}', formatMonth: '{{\'ui.date.formatMonth\' | i18n}}', showWeeks: false}\"" +
			"readonly=\"readonly\" " +
			"max-date=\"{{maxDate}}\"" +
			"min-date=\"{{minDate}}\"" +
			"close-text=\"{{'ui.date.closeText' | i18n}}\"/>" +
			"<button type=\"button\" class=\"btn btn-default\"" +
			"ng-click=\"open($event)\">" +
			"<i class=\"glyphicon glyphicon-calendar\"></i>" +
			"</button>" +
			"</div>");
	}]);


	/**
	 * 表格相关指令
	 * @author yangck
	 */
	angular.module('table.directives', [])
	/**
	 * 固定表头
	 * 部分支持colspan，tbody前一行tr与下一行tr合并的单元格不同的情况还未处理（这种情况较少，暂不处理）
	 */
		.directive('fixedThead', ['$timeout', function ($timeout) {
			// 设置宽度，box-sizing=border-box这种
			var setTableCss = function (table, state) {
				state.thWidths = [], state.tdWidths = [];

				table.outerWidth(table.outerWidth(true)); // 设置table宽度，不然可能导致tbody宽度与thead宽度不一致，同时使之在thead position为固定定位后宽度保持不变。给正常定位的tbody或tr设置宽度是不起作用的，他们的宽度总是会与table保持一致，只有给fixed/absolute类似的定位设置宽度才管用

				$('thead tr:eq(0) th', table).each(function (i, v) {
					state.thWidths.push({width: $(v).outerWidth(true), height: $(v).outerHeight(true)});
				});
				// 对于fixed的thead，如果给设置给thead设置了宽度，并且设置给内部的th宽度之和大于设置给thead的宽度，则会按照thead宽度重排(因此不要给thead设置宽度)
				// $('thead', table).outerWidth($('tbody', table).outerWidth(true));
				for (var i = 0; i < state.thWidths.length; i++) {
					$('thead th:eq(' + i + ')', table).outerWidth(state.thWidths[i].width);
					$('thead th:eq(' + i + ')', table).outerHeight(state.thWidths[i].height);
				}

				// tbody使用自己的宽度来固定，因为th/td可能会合并单元格，从而设置的宽度不准确
				if(isTdValid(table)) {
					$('tbody tr:eq(0) td', table).each(function (i, v) {
						state.tdWidths.push($(v).outerWidth(true));
					});
				}
				// 为tbody指定宽度是没有意义的，正常表格中设置给tbody与tr的宽度都是无效的，因为他们的宽度始终与table相同，设置在table上才有效
				// tbody的td用td自己的宽度来固定，thead的th用th自己的宽度来固定。这样对于th/td合并单元格之类的问题就好处理一点。但tbody前一行tr与下一行tr合并的单元格不同的情况还未处理
				for (var i = 0; i < state.tdWidths.length; i++) {
					$('tbody tr:eq(0) td:eq('+ i +')', table).outerWidth(state.tdWidths[i]); // 为tbody第一个tr的每个单元格指定宽度，使tbody在position为固定定位后显示效果不变
				}
				$('tbody tr:eq(0)', table).attr('data-tr-width-marked', "marked"); // 固定tbody表格的样式丢失时（翻页、表格重加载时），这时需要重新设置宽度。而这里的属性就是表示是否设置的样式已经丢失。

				table.css({'border-top': 0}); // thead设置为fixed后，table的顶部边框会在tbody的边框之上，应该取消这个边框
				$('thead', table).css({position: 'fixed', 'z-index': 100});
				state.parent.css({'padding-top': $('thead', table).height()}); // 填充表头的位置

				state.thWidthSum = getTrWidth(table, 'thead');

				state.needSetCss = false;
			};
			// 重置表格CSS。表头一行的宽度发生变化时(如：表格列数变化)，需要把表头重置为static来重新渲染。不然表头单元格的宽度就和tbody单元格不匹配
			var resetTableCss = function (table, state) {
				state.needSetCss = true;
				// 不要使用removeAttr，因为可能有别人写inline css
				$('thead', table).css({
					position: 'static',
					'z-index': 'auto',
					left: 'auto',
					top: 'auto',
					width: 'auto'
				});
				table.css({'width': '', 'border-top': ''});
				state.parent.css({'padding-top': 0});
			};
			// 判断滚动方向
			var isScrollUp = function (state) {
				if($(window).scrollTop() < state.lastWindowScrollPos) {
					return true; // 向上滚动
				}else {
					return false; // 向下滚动
				}
			};
			// 解析style为json对象
			var parseCss = function (style) {
				var jsonStyle = {};
				if(style) {
					var csses = style.split(";");
					if(csses[csses.length - 1] == "")
						csses.splice(- 1, 1);
					for(var i = 0; i < csses.length; i++) {
						var css = csses[i].split(":");
						var k = $.trim(css[0]);
						var v = $.trim(css[1]);
						if (k.length > 0 && v.length > 0)
						{
							jsonStyle[k] = v;
						}
					}
				}
				return jsonStyle;
			};
			// 得到element的style属性里面的某个css property的值。 style ex："width: 86px; height: 57px;"
			var getCssValueInStyle = function (style, property) {
				var styleObject = parseCss(style);
				var result = styleObject[property];
				if(result) {
					if(property == 'width') {
						var width = styleObject[property];
						return Number(width.slice(0, -2)); // px不要包含在内。注：因为我们固定样式用的是px，所以不用考虑em、百分数等单位
					}
					return result;
				}
				return null;
			};

			// 得到tr宽度。type:thead/tbody
			var getTrWidth = function (table, type) {
				var trWidth = 0; // cell理论宽度之和。对于fixed的thead，如果给设置给thead设置了宽度，并且设置给内部的th宽度之和大于设置给thead的宽度，则会按照thead宽度重排(因此不要给thead设置宽度)。
				var cells;
				if(type == 'thead') {
					cells = $(type + ' tr:eq(0) th', table);
				}else {
					cells = $(type + ' tr:eq(0) td', table);
				}
				cells.each(function (i, v) {
					// 不能使用"css('width')"，因为"css()"返回的是计算的实际宽度，而不是style里面设置的width值
					var widthValue = getCssValueInStyle($(v).attr('style'), 'width');
					if(widthValue) {
						trWidth += widthValue;
					}else {
						trWidth += $(v).outerWidth(true);
					}
				});
				return trWidth;
			};

			// 判断单元格宽度是否有效(如设置宽度为90px，实际宽度却是100px)
			var isWidthValid = function (table) {
				$('thead tr:eq(0) th', table).each(function (i, v) {
					if($(v).css('width')) {
						var widthValue = getCssValueInStyle($(v).attr('style'), 'width');
						var actualWidth = $(v).outerWidth(true);
						if(widthValue && widthValue != actualWidth) return false;
					}
				});
				$('tbody tr:eq(0) td', table).each(function (i, v) {
					if($(v).css('width')) {
						var widthValue = getCssValueInStyle($(v).attr('style'), 'width');
						var actualWidth = $(v).outerWidth(true);
						if(widthValue && widthValue != actualWidth) return false;
					}
				});
				return true;
			};

			// 判断td是否有效。暂且认为td数量大于1为有效
			var isTdValid = function (table) {
				return $('tbody tr:eq(0) td', table).length > 1;
			}

			// 判断是否th宽度与td对应宽度是否相等
			var isThTdWidthEqual = function (state) {
				for(var i = 0; i < state.thWidths.length; i++) {
					if(state.thWidths[i].width != state.tdWidths[i])
						return false;
				}
				return true;
			};

			// 所有资源是否加载完毕
			var isAllResourceLoadingFinished = function (resourceLoadingRecord) {
				for(var resource in resourceLoadingRecord) {
					if(resourceLoadingRecord.hasOwnProperty(resource) && resourceLoadingRecord[resource] === false) {
						return false;
					}
				}
				return true;
			};

			// 观察/监听DOM变化。注意MutationObserver只能监听DOM变化，对应的内容变化时监听不到的，如图片加载、CSS、JS文件加载。这些需要自己用事件监听器去获取（使用load事件来完成，注意浏览器缓存带来的事件不触发问题，可使用complete来手动触发）
			var observeMutation = function (table, state) {
				// 获取图片加载完的通知
				var loadImage = function(e) {
					var img = e.target,
						width = img.clientWidth,
						height = img.clientHeight;

					img.removeEventListener('load', loadImage, false);
					// alert("Image loaded: width: " + width + " height: " + height);
					state.resourceLoadingRecord[img.getAttribute('src')] = true; // 通过闭包获取state
				};
				MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
				var observer = new MutationObserver(function (mutations, observer) {
					// fired when a mutation occurs
					mutations.forEach(function (mutation) {
						switch (mutation.type) {
							case 'childList':
								// 可以在这里接收子节点的增加、移除通知。
								// 当tbody移除时，取消观察
								// observer.disconnect();
								break;
							case 'characterData':
								break;
							case 'attributes':
								// 可以在这里接收属性变化通知，注意设置了过滤器
								// console.log(attributes);
								// 图片等资源 加载完成需要手动使用事件监听器来获取通知
								if(mutation.target.tagName == 'IMG') { //nodeName
									// console.log('IMG');
									state.resourceLoadingRecord[mutation.target.getAttribute('src')] = false;
									mutation.target.addEventListener('load', loadImage, false);
								}
								break;
							case 'subtree':
								break;
							default:
						}
					});
					execWhenTableChange(table, state);
				});
				// configuration of the observer:
				var config = {
					childList: true,
					attributes: true,
					characterData: true,
					subtree: true,
					attributeFilter: ['style', 'src'] // 1) 固定表头主要是通过设置style来完成的。2）图片等资源不属于DOM监听范围，需要另外添加事件监听器来进行通知
				};
				// pass in the target node, as well as the observer options
				var target = $('tbody', table).get(0);
				observer.observe(target, config);
			};

			// tbody的DOM发生变化时，重新设置宽度，因为可能出现某些单元格变宽或者某些单元格在某些特殊条件下不显示的问题。注：不用绑定事件到table，因为thead的位置样式在滚动时始终在变化，因此table在滚动时一直会被触发
			var execWhenTableChange = function (table, state) {
				// 这里面最好不要修改DOM，不然容易产生无限事件冒泡或非常多的事件冒泡，严重拖慢页面加载速度
				if(!state.isExecing) {
					state.domUpdateFinished = false; // 仅当延时函数未执行时，触发事件，才认为dom渲染未结束
				}
				if(state.timeout) {
					$timeout.cancel(state.timeout); // 如果dom还未渲染结束，且之前添加过延时函数到延时函数队列，则取消延时函数
				}

				// 如果0.1s后仍未监听到DOM变化，则认为dom已经渲染完成(这个时间通常小于0.1s。0.1s以上的间隔，认为dom已经渲染/更新结束)。因此0.1s后设置domUpdateFinished为true，如果DOM还未渲染结束，则会在下次事件发生时取消执行延时函数
				state.timeout = $timeout(function () {
					state.isExecing = true;
					state.domLoadingFinished = true; // 执行到这里表示DOM更新完成

					if($('thead', table).css('position') == 'fixed' ) {
						// 把重置表格CSS放到延时函数里面来执行，这样能保证0.1s内只会执行一次，从而避免最大调用栈溢出（放在外面执行的话，DOM变化事件不断触发容易产生最大调用栈溢出）
						if(!isWidthValid(table)) { // 如果某个单元格宽度无效(如设置宽度为90px，实际宽度却是100px)，则重置表格样式
							state.domUpdateFinished = false;
							resetTableCss(table, state);
						}else if(getTrWidth(table, 'thead') != state.thWidthSum) { // 判断是否th宽度之和是否发生了变化（表格列数增加或减少）
							state.domUpdateFinished = false;
							resetTableCss(table, state);
						}else if(!isTdValid(table) && !isThTdWidthEqual(state)) { // 判断是否th宽度与td对应宽度是否相等
							state.domUpdateFinished = false;
							resetTableCss(table, state);
						}else if($('tbody tr:eq(0)', table).attr('data-tr-width-marked') !== 'marked') { // 注：不要使用dataset来访问数据属性，因为IE11以前版本不支持这种方式获取值
							state.domUpdateFinished = false;
							for (var i = 0; i < state.tdWidths.length; i++) {
								$('tbody tr:eq(0) td:eq('+ i +')', table).outerWidth(state.tdWidths[i]);
							}
							$('tbody tr:eq(0)', table).attr('data-tr-width-marked', "marked");
						}
					}

					state.domUpdateFinished = true;

					state.timeout = null;
					state.isExecing = false;
				}, 0.1, false); // false表示跳过 model dirty checking
			};
			return {
				restrict: 'A',
				/*scope: {
				 baseline: '=fixedThead' /!*在页面滚动条滑动时，表头固定时距离顶部的距离*!/
				 },*/
				link: function (scope, element, attrs) {
					var table = $(element);
					var tbody = $('tbody', table);

					var state = {
						needSetCss: true, // 是否需要设置宽度
						lastWindowScrollPos: $(window).scrollTop(), // 上次window窗口滚动条位置
						timeout: null, // $timeout返回的结果，用于保存在0.1s后设置domUpdateFinished为true
						parent: table.parent(), // 包裹table的父级容器
						thWidthSum: null, // th的宽度之和，在DOM渲染完成后再赋值
						thWidths: [], // thead的第一行tr的每个单元格宽度
						tdWidths: [], // tbody的第一行tr的每个单元格宽度
						domUpdateFinished: false, // dom更新完成后，即表格的样式已经确定后才允许设置表格宽度
						domLoadingFinished: false, // DOM是否加载完成
						resourceLoadingRecord: {}, // 资源完成记录
						allResourceLoadingFinished: false // 所有资源加载是否完成（图片等资源）
					};

					var parent = state.parent;
					parent.scroll(function () {
						if(state.domLoadingFinished && !state.allResourceLoadingFinished) {
							state.allResourceLoadingFinished = isAllResourceLoadingFinished(state.resourceLoadingRecord);
						}
						if(state.needSetCss && state.domUpdateFinished && state.allResourceLoadingFinished) {
							setTableCss(table, state);
						}
						// 设置表头位置
						if(!state.needSetCss && state.domLoadingFinished && state.allResourceLoadingFinished) {
							// 设置表头left
							var leftToWindow = $('tbody', table).offset().left - $(window).scrollLeft(); // tbody距离当前窗口左部的距离
							$('thead', table).css({left: leftToWindow}); // 保证横向滚动时表头与表格一起滚动
							var windowTop = parent.offset().top - $(window).scrollTop(); // 包围表格的容器距离当前窗口顶部的位置
							// 设置表头top
							$('thead', table).css({top: windowTop});
						}
					});

					$(window).scroll(function () {
						if(state.domLoadingFinished && !state.allResourceLoadingFinished) {
							state.allResourceLoadingFinished = isAllResourceLoadingFinished(state.resourceLoadingRecord);
						}

						if(state.needSetCss && state.domUpdateFinished && state.allResourceLoadingFinished) {
							setTableCss(table, state);
						}

						// 设置表头位置
						if(!state.needSetCss && state.domLoadingFinished && state.allResourceLoadingFinished) {
							// 设置表头left
							var leftToWindow = $('tbody', table).offset().left - $(window).scrollLeft(); // tbody距离当前窗口左部的距离
							$('thead', table).css({left: leftToWindow}); // 保证横向滚动时表头与表格一起滚动

							// 设置表头top
							var parentHeight = parent.outerHeight(); // 父级容器高度
							var topToWindow = parent.offset().top - $(window).scrollTop(); // 包围表格的容器顶部距离当前窗口顶部的位置
							var bottomToWindow = topToWindow + parentHeight; // 包围表格的容器底部距离当前窗口顶部的位置

							if(attrs['fixedThead']) { // 指定了基线才相对于整个窗口进行固定。注：属性名在指令里需要使用驼峰表示形式
								var theadHeight = $('thead', table).outerHeight(); // thead高度
								var baseline = parseInt(attrs['fixedThead']); // 在页面滚动条滑动时，表头固定时距离顶部的距离。属性值都是字符串，需手动解析为整数。
								var topToBaseline = topToWindow - baseline; // 包围表格的容器顶部距离基线的距离
								var bottomToBaseline = topToBaseline + parentHeight; // 包围表格的容器的底部距离基线的距离

								if (topToBaseline >= 0) { // 整个父级容器在基线下方
									$('thead', table).css({top: topToWindow}); // 表头位置与父级容器顶部位置一致
								} else if (bottomToBaseline >= theadHeight) { // 顶部在基线上方，底部在基线下方，并且距离基线距离大于等于表头高度
									$('thead', table).css({top: baseline}); // 固定表头到基线
								} else if(bottomToBaseline < theadHeight && bottomToBaseline >= 0) { // 顶部在基线上方，底部在基线下方，并且底部与基线距离小于表头高度
									$('thead', table).css({top: bottomToWindow - theadHeight});
								} else if(bottomToBaseline < 0) { // 顶部在基线上方，底部在基线上方
									$('thead', table).css({top: topToWindow}); // 表头位置与父级容器顶部位置一致
								}
							}else {
								$('thead', table).css({top: topToWindow});
							}
						}
					});

					observeMutation(table, state); // DOM变化的监听从DOMSubtreeModified改为MutationObserver
				}
			};

		}]);

	/**
	 * 常用的工具的指令
	 *
	 * @author huxz
	 */
	angular.module('tool.directives', ['toaster']).directive('showMarkDown', ['$http', function ($http) {
		return {
			restrict : 'EA',
			replace : true,
			template : '<div id="mark-down-content"></div>',
			link : function (scope, elem, attrs) {
				if (attrs.src) {
					// 加载第三方的Markdown转HTML的js库
					require(['showdown'], function (showdown) {
						var converter = new showdown.Converter();
						$http.get(attrs.src).success(function (response) {
							var html = converter.makeHtml(response);
							elem.html(html);
						})
					});
				}
			}
		}
	}]).directive('imageUpload', ['$http', '$parse', 'BaseService', 'toaster', function ($http, $parse, BaseService, toaster) {
		var rootPath = BaseService.getRootPath();


		var validateFileType = function (file) {
			if (!file || (typeof file != 'object')) return false;
			if (!/\/(png|jpeg|pdf|bmp|gif)$/.test(file.type)) {
				alert('请上传可支持的格式');
				return false;
			}
			return true;
		};

		var isOverLimit = function (file) {
			if (!file || (typeof file != 'object')) return false;
			if (file.size > 3145728) {
				alert('请勿超过3M');
				//toaster.pop('error', '上传图片的大小不能超过3M');
				return true;
			}
			return false;
		};
		
		function isNumber(number) {
			if (!number || number === '') return false;
			var n = Number(number);
			return !isNaN(n);
			
		}

		function validateFileSize(file, maxSize, errorSizeMsg) {
			if (!file || (typeof file != 'object')) return false;
			if (!isNumber(maxSize)) return false;
			var fileSize = Number(maxSize);

			if (file.size > fileSize) {
				alert(errorSizeMsg);
				return false;
			}
			return true;
		}

		/**
		 * 上传单个文件操作
		 *
		 * @param config	文件上传配置，形如{file: [file], success：[function], error: [function]}
		 */
		var uploadFile = function (config) {
			// 验证参数
			if (!config) config = {};
			if (!config.file || (typeof config.file != 'object')) return;
			if (config.success && (typeof config.success != 'function')) return;
			if (config.error && (typeof config.error != 'function')) return;

			console.log('upload-file', config.file);

			// 检测上传文件的类型
			var isImage = true;
			if(!/image\/\w+/.test(config.file.type)){
				isImage =  false;
			}

			// 限制文件的大小
			if (config.file.size > 3145728) {
				alert('上传图片的大小不能超过3M');
				//toaster.pop('error', '上传图片的大小不能超过3M');
				return;
			}

			// 封装表单数据
			var data = new FormData();
			data.append(isImage ? 'image' : 'file', config.file);

			$http({
				method : 'POST',
				url : rootPath + (isImage ? '/api/images' : '/file'),
				data : data,
				headers : {'Content-Type' : undefined}
			}).success(config.success).error(config.error);
		};

		/**
		 * 根据path文件名来判断文件是否是PDF文件
		 *
		 * @param path		文件名称
		 */
		function isPdf(path) {
			if(path) {
				var str = path.slice(path.lastIndexOf('.')).toLowerCase();
				return str === '.pdf';
			}
			return false;
		}

		/**
		 * 根据文件的URL生成预览文件URL
		 *
		 * @param url	文件URL
		 */
		function createShowUrl(url) {
			return isPdf(url) ? 'static/img/vendor/store/timg.png' : url;
		}

		/**
		 * tip:
		 * 	上传组件样式通过CSS进行控制
		 * 	上传组件默认是可以进行预览的
		 */
		return {
			restrict : 'A',
			replace : true,
			template : "<div class='preview' style='display: flex;justify-content: center;align-items: center;'></div>",
			link : function (scope, element, attr) {
				// TODO huxz 样式通过CSS进行控制
				// 获取自定义属性
				var onSuccess = $parse(attr.onSuccess);
				var preview = !attr.nonPreview;
				var maxSize = attr.maxSize;
				var errorSizeMsg = attr.errorSizeMsg;

				// 设置图片预览
				element.append('<img class=previewImage title="请上传附件"/>');
				var previewImage = $(element).find('.previewImage');
				previewImage.attr('src', attr.src);

				previewImage.click(function () {
					uploadImage.click();
				});

				// 设置文件上传
				element.append('<input type=file class=uploadImage style=display:none; accept=image/jpeg,image/jpg,image/gif,image/bmp,image/png,.pdf />');
				var uploadImage = $(element).find('.uploadImage');

				uploadImage.change(function () {
					var file = $(this)[0];

					if (file.files && file.files[0]) {

						console.log(file.files[0]);

						if (!maxSize) {
							if (isOverLimit(file.files[0])) return;
						} else {
							if (!validateFileSize(file.files[0], maxSize, errorSizeMsg)) return ;
						}

						if (!validateFileType(file.files[0])) return;

						// 如果不可预览属性设置为false，则显示预览图片
						if (preview) {
							var reader = new FileReader();
							reader.onload = function (evt) {
								if (isPdf(file.files[0].name)) {
									previewImage.attr('src', createShowUrl(file.files[0].name));
								} else {
									previewImage.attr('src', evt.target.result);
								}
							};
							reader.readAsDataURL(file.files[0]);
						}

						uploadFile({
							file : file.files[0],
							success : function (data) {
								onSuccess(scope, {$data: data[0]});
							},
							error : function (message) {
								alert(message);
								//toaster.pop('error', message);
							}
						});
					} else {
						// TODO huxz 兼容IE
						/*var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
						file.select();
						var src = document.selection.createRange().text;
						var img = document.getElementById('imgHead');
						img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;*/
					}


				});
			}
		};
	}]);
	/*global angular */
	/**
	 * uiTour directive
	 *
	 * @example:
	 *   <ul ui-tour="currentStep">
	 *     <li target="#someId">
	 *       First Tooltip
	 *       <a ng-click="currentStep=currentStep+1">Next</a>
	 *     </li>
	 *     <li target=".items:eq(2)" name="two">
	 *       Second Tooltip
	 *       <a ng-click="currentStep=currentStep-1">Prev</a>
	 *     </li>
	 *     <li target=".items:eq(2)">
	 *       Third Tooltip
	 *       <a ng-click="currentStep='two'">Go directly to 'two'</a>
	 *       <a ng-click="currentStep=0">Done</a>
	 *     </li>
	 *   </ul>
	 */
	angular.module('ui.tour', [])

		.directive('uiTour', ['$timeout', '$parse', function($timeout, $parse){
			return {
				link: function($scope, $element, $attributes) {
					var model = $parse($attributes.uiTour);

					// Watch model and change steps
					$scope.$watch($attributes.uiTour, function(newVal, oldVal){
						if (angular.isNumber(newVal)) {
							showStep(newVal)
						} else {
							if (angular.isString(newVal)) {
								var stepNumber = 0,
									children = $element.children()
								angular.forEach(children, function(step, index) {
									if (angular.element(step).attr('name') === newVal)
										stepNumber = index+1;
								});
								model.assign($scope, stepNumber);
							} else {
								model.assign($scope, newVal && 1 || 0);
							}
						}
					});

					// Show step
					function showStep(stepNumber) {
						var elm, at, children = $element.children().removeClass('active');
						elm = children.eq(stepNumber - 1);
						if (stepNumber) {
							at = elm.attr('at');
							$timeout(function(){
								var target = angular.element(elm.attr('target'))[0];


								if (elm.attr('overlay') !== undefined) {
									$('.tour-overlay').addClass('active').css({
										// marginLeft: target.offsetLeft + target.offsetWidth / 2 - 150,
										// marginTop: target.offsetTop + target.offsetHeight / 2 - 150
									}).addClass('in');
								}
								// offset = {};
                                //
								// offset.top = target.offsetTop;
								// offset.left = target.offsetLeft;

								elm.addClass('active');

								// if (at.indexOf('bottom') > -1) {
								// 	offset.top += target.offsetHeight;
								// } else if (at.indexOf('top') > -1) {
								// 	offset.top -= elm[0].offsetHeight;
								// } else {
								// 	offset.top += target.offsetHeight / 2 - elm[0].offsetHeight / 2;
								// }
								// if (at.indexOf('left') > -1) {
								// 	offset.left -= elm[0].offsetWidth;
								// } else if (at.indexOf('right') > -1) {
								// 	offset.left += target.offsetWidth;
								// } else {
								// 	offset.left += target.offsetWidth / 2 - elm[0].offsetWidth / 2;
								// }
                                //
								// elm.css(offset);
							});
						} else {
							$('.tour-overlay').removeClass('in');
								$('.tour-overlay').removeClass('active');
						}
					}
				}
			};
		}]);
});

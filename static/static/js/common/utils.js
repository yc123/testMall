define(['angular'],
function(angular) {
	'use strict';
    angular.module('common.utils', []).factory('SerializerUtil', function() {
        return {
        	/**
        	 * 将元素值转换为序列化的字符串表示
        	 */
            param: function(obj) {
                var query = '',
                name, value, fullSubName, subName, subValue, innerObj, i, me = this;
                for (name in obj) {
                    value = obj[name];
                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += me.param(innerObj) + '&';
                        }
                    } else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += me.param(innerObj) + '&';
                        }
                    } else if (value !== undefined && value !== null) query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
                return query.length ? query.substr(0, query.length - 1) : query;
            }
        };
    }).factory('TimerUtil', ['$timeout', function($timeout) {
    	var on = true, task = null, scope = null, timeParam = null;
        return {
        	/**
        	 * 简单计时器
        	 */
        	init: function(s, t) {
        		scope = s;
        		timeParam = t;
        		scope[timeParam] = 60;
				this.go();
				return this;
			},
			go: function() {
				var me = this;
				task = $timeout(function(){
					scope[timeParam]--;
				}, 1000).then(function(){
					if(on && scope[timeParam] > 0)
						me.go();
				});
			},
			cancel: function() {
				on = false;
				task && $timeout.cancel(task);
			},
			info: function() {
				return scope[timeParam];
			}
        };
	}])
	/**
	 * @author yangck
	 */
		.factory('DateUtil', function () {

		Date.prototype.yyyyMmDd = function() {
			var mm = this.getMonth() + 1; // getMonth() is zero-based
			var dd = this.getDate();

			return [this.getFullYear(), '-',
				(mm>9 ? '' : '0') + mm, '-',
				(dd>9 ? '' : '0') + dd
			].join('');
		};

		// var date = new Date();
		// date.yyyyMmDd();

		var yyyyMmDd = function(date) {
			var mm = date.getMonth() + 1; // getMonth() is zero-based
			var dd = date.getDate();

			return [date.getFullYear(), '-',
				(mm>9 ? '' : '0') + mm, '-',
				(dd>9 ? '' : '0') + dd
			].join('');
		};

		return {
			yyyyMmDd: yyyyMmDd
		}
	})
		.filter('commonDate', ['$filter', function($filter) {// 实用日期过滤器
		return function(input) {
			console.log($filter('date')(new Date(), 'yyyy-MM-dd HH:m:ss'));
			var date = new Date(), dateFilter = $filter('date');
			var r = '';
			if(dateFilter(date, 'yyyy') == dateFilter(input, 'yyyy')) {
				if(dateFilter(date, 'MM') == dateFilter(input, 'MM')) {
					if(dateFilter(date, 'dd') == dateFilter(input, 'dd')) {
						r = dateFilter(input, '今天 HH:mm:ss');
					} else {
						r = dateFilter(input, 'MM月dd日');
					}
				} else {
					r = dateFilter(input, 'MM月dd日');
				}
			} else {
				r = dateFilter(input, 'yy年MM月dd日');
			}
			return r;
		};
	}]).filter('numberToFixed', ['$filter', function ($filter) { // 将数字转换为固定长度字符串
            return function (input, decimals ) {
                var num = parseFloat($filter('number')(input, decimals));
                return num.toFixed(decimals);
            }
        }])
		// 根据指定状态码获取状态历史记录里面的项
		.filter('toState', function () {
			return function (input, status) {
				if(input) {
					if(Object.prototype.toString.call(input) != '[object Array]')
						console.error('被过滤数据不是数组');
					for(var i = 0; i < input.length; i++) {
						if(input[i].status == status)
							return input[i];
					}
				}
			}
		});
});
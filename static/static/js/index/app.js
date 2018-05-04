define([ 'angularAMD', 'ngRoute', 'ui-bootstrap', 'ngLocal', 'ngTable', 'common/services', 'common/directives', 'common/query/kind', 'common/query/brand',  'common/query/component', 'common/query/cart', 'angular-toaster', 'common/query/collection', 'common/query/slideImage', 'jquery', 'common/query/messageBoard', 'common/query/cms', 'common/query/commonCount', 'sanitize', 'common/query/storeInfo', 'common/module/chat_web_module'], function(angularAMD) {
	'use strict';
	var app = angular.module('myApp', [ 'ngRoute', 'ui.bootstrap', 'ng.local', 'ngTable', 'tool.directives', 'common.services', 'common.query.kind', 'brandServices', 'cartServices', 'componentServices', 'common.directives', 'toaster', 'collection', 'slideImageService', 'messageBoardServices', 'cmsService', 'commonCountServices', 'ngSanitize', 'storeInfoServices', 'WebChatModule']);
	app.init = function() {
		angularAMD.bootstrap(app);
	};
	app.config(['$routeProvider', function($routeProvider) {

	}]);

	app.run(['$rootScope', 'BaseService', 'StoreInfo', function($rootScope, BaseService, StoreInfo) {
		$rootScope.rootPath = BaseService.getRootPath();
		$rootScope.$menuShow = true;
		$rootScope.page = 'home';
		StoreInfo.getUmallStoreId({}, {}, function (result) {
			if (result.data) {
				$rootScope.umallStoreId = result.data;
			} else {
				delete $rootScope.umallStoreId;
			}
		}, function () {
			delete $rootScope.umallStoreId;
		});
	}]);

	app.controller('commentCtrl', ['$scope', function($scope) {
		$scope.comments = {
				comment : [ {
				name : '837316***@qq.com',
				time : '04-21 12:12',
				text : '开票很快，东西性价比贼好了'
			}, {
				name : '111316***@163.com',
				time : '04-21 12:11',
				text : '东西性价比贼好了,开票很快'
			}, {
				name : '222222***@qq.com',
				time : '04-21 12:10',
				text : '好评啊'
			}, {
				name : '333333***@qq.com',
				time : '04-21 12:09',
				text : '还行'
			}, {
				name : '444444***@qq.com',
				time : '04-21 12:09',
				text : '价钱公道'
			}, {
				name : '555555***@qq.com',
				time : '04-21 12:07',
				text : '不错'
			} ]
		};
	}]);

	app.controller('tableCtrl', ['$scope', function($scope) {
//		$http.get('static/js/index/data/testorder.json').success(function(data) {	})
		$scope.orders = {
				order : [ {
				name : '8373***@qq.com',
				code : 'S2016050719038',
				createtime : '04-21 12:12',
				price: '20210',
				status : '已收货'
			}, {
				name : '7316***@qq.com',
				code : 'S2016050719038',
				createtime : '04-21 12:12',
				price: '20210',
				status : '已收货'
			}, {
				name : '4416***@qq.com',
				code : 'S2016050719038',
				createtime : '04-21 12:12',
				price: '20210',
				status : '已收货'
			}, {
				name : '5516***@qq.com',
				code : 'S2016050719038',
				createtime : '04-21 12:12',
				price: '20210',
				status : '已收货'
			}, {
				name : '6616***@qq.com',
				code : 'S2016050719038',
				createtime : '04-21 12:12',
				price: '20210',
				status : '已收货'
			}, {
				name : '8216***@qq.com',
				code : 'S2016050719038',
				createtime : '04-21 12:12',
				price: '20210',
				status : '已收货'
			}, {
				name : '7776***@qq.com',
				code : 'S2016050719038',
				createtime : '04-21 12:12',
				price: '20210',
				status : '已收货'
			}  ]
		};
	}]);

	app.controller('MarketCtrl', ['$scope', function($scope) {
		$scope.markets = {
			supply : [ {
				title : '8851C,V1.0,转接按键',
				remark : '5000PCS'
			}, {
				title : 'S570-AI-XL,皮套贴纸,V1.0/富鹏',
				remark : '300箱'
			}, {
				title : '有线键鼠光电套件',
				remark : '$19.8'
			}, {
				title : 'MCP存储器IC',
				remark : '500PCS'
			}, {
				title : 'PE保护膜',
				remark : '800PCS'
			}, {
				title : '驻极体受话器',
				remark : '$9.8'
			} ],
			need : [ {
				title : 'MCP存储器IC',
				remark : '500PCS'
			}, {
				title : 'PE保护膜',
				remark : '800PCS'
			}, {
				title : '驻极体受话器',
				remark : '<$9.8'
			}, {
				title : '8851C,V1.0,转接按键',
				remark : '5000PCS'
			}, {
				title : 'S570-AI-XL,皮套贴纸,V1.0/富鹏',
				remark : '300箱'
			}, {
				title : '有线键鼠光电套件',
				remark : '<$19.8'
			} ],
			done : [ {
				title : '8851C,V1.0,转接按键',
				remark : '5000PCS'
			}, {
				title : 'S570-AI-XL,皮套贴纸,V1.0/富鹏',
				remark : '300箱'
			}, {
				title : '有线键鼠光电套件',
				remark : '$19.8'
			}, {
				title : 'MCP存储器IC',
				remark : '500PCS'
			}, {
				title : 'PE保护膜',
				remark : '800PCS'
			}, {
				title : '驻极体受话器',
				remark : '$9.1'
			} ]
		};
		$scope.getMarketClass = function(type) {
			return type == '供应' ? 'label label-success' : 'label label-warning';
		};
		$scope.infos = [ {
			type : '行情',
			title : '钢价现止跌，部分地方看涨'
		}, {
			type : '公告',
			title : '原油上涨0.5%报$101.94'
		}, {
			type : '行情',
			title : '九月国内钢材市场走势预测'
		} ];
	}]);

	// 幻灯片
	app.controller('CarouselCtrl', ['$scope', 'Carousel', function($scope, Carousel) {

		Carousel.get({module: 'home page banner'}, {}, function (data) {
			$scope.carousels = data;
        }, function (res) {

        });
	}]);

	// 器件库、品牌
	app.controller('CategoryCtrl', ['$scope', 'KindAPI', 'BrandActiveAPI', 'toaster', function($scope, KindAPI, BrandActiveAPI, toaster) {
		$scope.setType = function(t) {
			$scope.type = t;
			if(t == 'kind' && !$scope.kinds) {
				KindAPI.getChildren({parentId: 0}, function(data) {
					$scope.kinds = data;
				}, function(response) {
					toaster.pop('error', '获取器件库信息失败');
				});
			}
			if(t == 'brand' && !$scope.brands) {
				BrandActiveAPI.getSimpleInfoPage({
					sorting: {'weight': 'desc'},
					page: 1,
					count: 20
				}, function(data){
					$scope.brands = data.content;
				}, function(response){
					toaster.pop('error', '获取品牌信息失败');
				});
			}
		};

		$scope.setType('kind');
	}]);

	app.controller('BrandLogoCtrl', ['$scope', 'BrandActiveAPI', function($scope, BrandActiveAPI) {
		/**
		 * 获得当前排名最高的10个品牌
		 * TODO 现在是我直接获得最新的8个品牌信息，今后搜索上来了，按照搜索的获取数据
		 */
		BrandActiveAPI.getSimpleInfoPage({
			sorting: {'weight': 'desc'},
			page: 1,
			count: 10
		}, function(data){
			$scope.brandsData = data.content;
		}, function(response){

		});
	}]);

	app.controller('HotSellCtrl', ['$scope', function($scope) {
		/**
		 * 热卖
		 */
	}]);

	// 楼层
	app.controller('FloorsCtrl', ['$scope', 'Floors', function ($scope, Floors) {
		var colors = [];

		Floors.get({module: 'home'}, {}, function (data) {
			$scope.floors = data;
			angular.forEach($scope.floors, function (floor, index) {
				if (floor.items) {
					var borderColor = floor.items[1].backGroundColor;
					angular.forEach(floor.items, function (item) {
						item.borderColor = borderColor;
					});
					colors[index] = borderColor;
				}
			});
			console.log($scope.floors);
        }, function (res) {

        });

		$scope.scrollFloor = function(number) {
			console.log(number);
			document.getElementById('floor-' + number).scrollIntoView(false);
		};
		window.onscroll = function () {
			var fl = document.getElementById("floors-lift");
			var floors = document.getElementById("floors");
			var s = document.body.scrollTop;
			var i = parseInt((s + fl.offsetTop - floors.offsetTop) / 470);
			//$('.floors-lift-item').removeClass('active');
			$('.floors-lift-item a').css('background-color', '#b7dfff');
			$('.floors-lift-item a').css('color', '#FFFFFF');
			$('#fl_' + i + ' a').css('background-color', colors[i] || 'blue');
			//$('#fl_' + i).addClass('active');
			// console.log(s)
			if((floors.offsetTop - s < fl.offsetTop) && (floors.offsetTop + floors.offsetHeight - s > fl.offsetTop + fl.offsetHeight)) {
				fl.style.opacity = '1';
				fl.style.pointerEvents = 'auto';
			} else {
				fl.style.opacity = '0';
				fl.style.pointerEvents = 'none';
			}
		}
    }]);

	// 优软新闻
	app.controller('NewsCtrl', ['$scope', 'News', function ($scope, News) {
		var init = function (page) {
			//获取资讯列表
			News.get({ page: page},{},function (data) {
				$scope.news = data.content;
				console.log(data);
			},function (response) {
			})
		};
		init(1);
    }]);

	// 滚动信息标签定义
	app.controller('ScrollListCtrl', ['$scope', '$timeout', function($scope, $timeout) {
		var currTimer = null, currIdx = 0, isPlaying = true;
		var self = this, items = self.items = $scope.items = [], size = $scope.size, liheight = $scope.liheight;
		self.addItem = function(item, element) {
			item.$element = element;
			item.$index = items.length;
			items.push(item);
			if (item.$index == size - 1) {
				self.select(items[0]);
			}
		};
		self.select = function(item) {
			for (var j = 0; j < size; j++) {
				var t = items[(item.$index + j) % items.length];
				t.$element.attr('style', 'opacity: 1;top:' + liheight * j + 'px');
				t.active = true;
			}
			for (var k = 0; k < items.length - size; k++) {
				var t = items[(item.$index + size + k) % items.length];
				if (k == items.length - size - 1)
					t.$element.attr('style', 'opacity: 0;top:' + liheight * (-1) + 'px');
				else
					t.$element.attr('style', 'opacity: 0;top:' + liheight * (size + k) + 'px');
			}
		};
		var timerFn = function() {
			if (isPlaying) {
				$scope.currIdx = ++currIdx % items.length;
				self.select(items[$scope.currIdx]);
				restartFn();
			} else {
				$scope.pause();
			}
		};
		var resetFn = function() {
			currTimer && ($timeout.cancel(currTimer));
		};
		var restartFn = function() {
			resetFn();
			currTimer = $timeout(timerFn, $scope.interval);
		};
		$scope.play = function() {
			if (!isPlaying) {
				isPlaying = true;
				restartFn();
			}
		};
		$scope.pause = function() {
			isPlaying = false;
			resetFn();
		};
		$scope.$watch('interval', function(val) {
			if (val) {
				currTimer = $timeout(timerFn, val);
			} else {
				resetFn();
			}
		});
	}]).controller('ScrollTableCtrl', ['$scope', '$timeout', function($scope, $timeout) {
		var currTimer = null, currIdx = 0, isPlaying = true;
		var self = this, items = self.items = $scope.items = [], size = $scope.size, liheight = 24;
		console.log(self);
		console.log(size);
		self.addItem = function(item, element) {
			item.$element = element;
			item.$index = items.length;
			items.push(item);
			if (item.$index == size - 1) {
				self.select(items[0]);
			}
		};
		self.select = function(item) {
			console.log(item.length);
			for (var j = 0; j < size; j++) {
				var t = items[(item.$index + j) % items.length];
				t.$element.attr('style', 'opacity: 1;top:' + liheight * j + 'px');
				t.active = true;
			}
			for (var k = 0; k < items.length - size; k++) {
				var t = items[(item.$index + size + k) % items.length];
				if (k == items.length - size - 1)
					t.$element.attr('style', 'opacity: 0;top:' + liheight * (-1) + 'px');
				else
					t.$element.attr('style', 'opacity: 0;top:' + liheight * (size + k) + 'px');
			}
		};
		var timerFn = function() {
			if (isPlaying) {
				$scope.currIdx = ++currIdx % items.length;
				self.select(items[$scope.currIdx]);
				restartFn();
			} else {
				$scope.pause();
			}
		};
		var resetFn = function() {
			currTimer && ($timeout.cancel(currTimer));
		};
		var restartFn = function() {
			resetFn();
			currTimer = $timeout(timerFn, $scope.interval);
		};
		$scope.play = function() {
			if (!isPlaying) {
				isPlaying = true;
				restartFn();
			}
		};
		$scope.pause = function() {
			isPlaying = false;
			resetFn();
		};
		$scope.$watch('interval', function(val) {
			if (val) {
				currTimer = $timeout(timerFn, val);
			} else {
				resetFn();
			}
		});
	}]).directive('tablelist',[ function() {
		return {
			restrict : 'EA',
			transclude : true,
			replace : true,
			controller : 'ScrollTableCtrl',
			require : 'tablelist',
			template : '<table class="order-table block" style="width: 99%;">'+
			'<thead><tr><th width="120">客户名称</th><th width="auto">订单编号</th><th width="200">付款时间</th><th width="110">成交金额</th><th width="110">订单状态</th></tr></thead>'
			+'<tbody ng-transclude ng-mouseenter="pause()" ng-mouseleave="play()"></tbody></table>',
			scope : {
				interval : '=',
				size : '='
			},
			link : function(scope, element) {
				scope.size = scope.size || 1;
			}
		};
	}]).directive('tableitem', [ function() {
		return {
			require : '^tablelist',
			restrict : 'EA',
			transclude : true,
			replace : true,
			template : '<tr class="order-hd"><td ng-bind="order.name"></td><td ng-bind="order.code"></td><td ng-bind="order.createtime"></td>'+
				'<td ng-bind="order.price"></td><td ng-bind="order.status"></td></tr>',
			link : function(scope, element, attrs, ScrollTableCtrl) {
				ScrollTableCtrl.addItem(scope, element);
			}
		};
	}]).directive('scrolllist', [ function() {
		return {
			restrict : 'EA',
			transclude : true,
			replace : true,
			controller : 'ScrollListCtrl',
			require : 'scrolllist',
			template : '<ul class="scroll-list" ng-transclude ng-mouseenter="pause()" ng-mouseleave="play()"></ul>',
			scope : {
				interval : '=',
				size : '=',
				liheight : '='
			},
			link : function(scope, element) {
				scope.size = scope.size || 1;
				scope.liheight = scope.liheight || 24;
				element.attr('style', 'height:' + scope.liheight * scope.size + 'px');
			}
		};
	}]).directive('scrollitem', [ function() {
		return {
			require : '^scrolllist',
			restrict : 'EA',
			transclude : true,
			replace : true,
			template : '<li class="item" ng-transclude></li>',
			link : function(scope, element, attrs, scrollListCtrl) {
				scrollListCtrl.addItem(scope, element);
			}
		};
	}]);

	return app;
});
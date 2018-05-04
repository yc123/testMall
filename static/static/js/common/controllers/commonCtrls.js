define([ 'app/app' ], function(app) {
	'use strict';

	app.config(['$httpProvider', function($httpProvider) {
		// 设置http拦截器
		$httpProvider.interceptors.push('httpInterceptor');
	}]);

	// http拦截器，设置请求自定打开和关闭Loading框
	app.factory('httpInterceptor', ['Loading', '$q', function(Loading, $q) {
		var i = 0;
		var startLoading = function() {
			if(i++ == 0) Loading.show();
		};
		var endLoading = function() {
			if(--i < 1) Loading.hide();
		};

        var im_api_url = 'api/chat/message';
        return {
            request: function(cfg){
                if(cfg.url && cfg.url.indexOf(im_api_url) < 0) {
                    startLoading();
                }
                return cfg;
            },
            requestError: function(rejection) {
                if(rejection.config.url && rejection.config.url.indexOf(im_api_url) < 0) {
                    endLoading();
                }
                return $q.reject(rejection);
            },
            response: function(res) {
                if(res.config.url && res.config.url.indexOf(im_api_url) < 0) {
                    endLoading();
                }
                return res;
            },
            responseError: function(rejection) {
                if(rejection.config.url && rejection.config.url.indexOf(im_api_url) < 0) {
                    endLoading();
                }
                if(rejection.status == 401) {
                    window.location.href = rejection.data.loginUrl || 'index';
                }
                return $q.reject(rejection);
            }
        }
	}]);

	// 修改页面标题
	app.controller('TitleCtrl', ['$scope', '$rootScope', '$window', function($scope, $rootScope, $window) {
		$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
			if(current.$$route) {
				$scope.pageTitle = current.$$route.title || '商品管理';
				document.title = $scope.pageTitle + '-优软商城';
			}
		});
	}]);

	// 身份认证
	app.controller('AuthenticationCtrl', ['$scope', '$window', 'AuthenticationService', '$rootScope', 'SessionService', 'collectionService', '$modal', 'toaster','$q', 'Cart',
		function($scope, $window, AuthenticationService, $rootScope, SessionService, collectionService, $modal, toaster, $q, Cart) {
			$scope.user = {
				j_username : "",
				j_password : "",
				loginType : 'uu'
			};

			// 登录
			$scope.login = function(user) {
				AuthenticationService.login(user).success(function(responseText, status) {
					if (status == 200) {
					}
				}).error(function(response) {
					toaster.pop('error', response);
				});
			};

			// 退出
			$scope.logout = function() {
				/*AuthenticationService.logout().success(function() {
					SessionService.removeCookie($rootScope.userInfo.userUU);
				});*/
                AuthenticationService.logoutWithoutProxy();
			};

			// 企业换企业开关
			$scope.toggleSwitch = function () {
				$scope.switching = !$scope.switching;
			};


            // 企业换企业开关
            $scope.toggleSwitchFalse = function () {
                $scope.switching = false;
            };

			// 切换企业
			$scope.switchto = function(enUU) {
				AuthenticationService.reSignin(enUU).success(function(){
					//$window.location.reload();
					/*if (!enUU || enUU == '0'){
						var now = window.location.href.toString();
						if (now.indexOf('vendor') > -1){
                            location.href = './register-saler';
                            return;
						}
					}*/
                    location.href = './';
				});
			};

			// 是否已经登录
			$scope.isAuthed = AuthenticationService.isAuthed();
			$scope.userInfo = {};

			// 获取已登录的用户信息
			var getAuthentication = function() {
				return AuthenticationService.getAuthentication().success(function(data) {
					if(data && data.enterprises) {
						//data.enterprise = data.enterprises[data.enterprises.length - 1];
						if(data.enterprises.length > 0) {
							var enSelect = [];
							angular.forEach(data.enterprises, function(e){
								if(e.current)
									data.enterprise = e;
								else
									enSelect.push(e);
							});
							data.enSelect = enSelect;
						}
					}
					$scope.userInfo = data;
                    $scope.sortEnterprises = $scope.userInfo.enterprises || [];
                    if ($scope.sortEnterprises.length) {
                        $scope.sortEnterprises.sort(function (a, b) {
                            return b.lastLoginTime - a.lastLoginTime;
                        })
                    }

                    // 增加收藏功能的代码
					$rootScope.userInfo = data;
					$rootScope.brandCount = 0;
					$rootScope.componentCount = 0;
					// 以用户的身份进入系统
					if(SessionService.get('authenticated')) {
						collectionService.getStoreByUU({}, function(data) {
							var store = [];
							var brandCount = 0;
							var componentCount = 0;
							for(var i = 0; i < data.length; i++) {
								if(data[i].kind == 1) {
									brandCount++;
								}else if (data[i].kind == 2){
									componentCount++;
								}
								store.push(data[i]);
							}
							$rootScope.brandCount = brandCount;
							$rootScope.componentCount = componentCount;
							SessionService.setCookie($rootScope.userInfo.enterprise ? $rootScope.userInfo.userUU +"-"+ $rootScope.userInfo.enterprise.uu : $rootScope.userInfo.userUU, angular.toJson(store));
							// 默认在登录界面游客收藏的数据已传输成功，删除游客的数据
							SessionService.removeCookie('visitor');
						}, function(response) {
						});
					}else { // 以游客身份登录系统
						// 获取本地的数据
						var arrs = angular.fromJson(SessionService.getCookie('visitor'));
						angular.forEach(arrs, function(store) {
							if(store.kind == 2) {
								$rootScope.componentCount++;
							}else {
								$rootScope.brandCount++;
							}
						});
					}

					$scope.isAuthed = data != null && data.userUU;
				});
			};

			//根据用户的信息
			$q.all([getAuthentication()]).then(function () {
				if(AuthenticationService.isAuthed()) {
					Cart.getCount({}, function(data){
						$rootScope.countCart = data.count;
					}, function(res){
						toaster.pop('error', '系统错误', '获取购物车失败');
					});
				}
			}, function () {
			});

			// 打开登录模态框
			$scope.signinModal = function() {
//			var modalInstance = $modal.open({
//				templateUrl : 'static/view/common/modal/signin.html',// 指向上面创建的视图
//	            controller : 'SigninModalCtrl'// 初始化模态范围
//	        });
//	        modalInstance.result.then(function(orderid){
//	        	$window.location.reload();
//	        }, function(reason){
//	        	
//	        });
				// 跳转账户中心
				AuthenticationService.redirectSignin();
			};
            // 注册
            $scope.registerModal = function() {
                // 跳转账户中心
                AuthenticationService.redirectRegister();
            };

			// 跳转
			$scope.gotoUrl = function(url) {
				location.href = url;
			};
		}]);

	// 登录模态框
	app.controller('SigninModalCtrl', ['$scope', '$modalInstance', 'AuthenticationService', 'toaster', function($scope, $modalInstance, AuthenticationService, toaster) {
		$scope.user = {
			j_username : "",
			j_password : "",
			loginType : 'uu'
		};

		// 关闭
		$scope.cancel = function(){
			$modalInstance.dismiss('');
		};

		// 登录
		$scope.login = function(user) {
			AuthenticationService.login(user).success(function(responseText, status) {
				if (status == 200) {
					$modalInstance.close();
				} else if(status == 207 && responseText instanceof Array) {// multi
					$scope.$enSelect = true;// 输入框此时readOnly，不可输入
					$scope.enterprises = responseText;
					angular.forEach($scope.enterprises, function(e){
						if(e.isLast)
							$scope.user.t_enuu = e.uu;
					});
				}
			}).error(function(response) {
				toaster.pop('error', response);
			});
		};

		// 取消选择企业，可以重新输入账号
		$scope.cancelSelect = function() {
			$scope.$enSelect = false;
			$scope.enterprises = null;
			$scope.user.t_enuu = null;
		};
	}]);

	// 搜索框Ctrl
	app.controller('SearchCtrl', ['$scope', '$http', '$rootScope', 'SessionService', function($scope, $http, $rootScope, SessionService) {
		$scope.searchType = 'original';// 搜索类型
		$scope.searchType = {
			original: false,
			inaction: false,
			proffing: false,
			brand: false,
			isCmp: function() {
				var me = this;
				return me.original || me.inaction || me.proffing;
			}
		};
		if(SessionService.get('brand')) {
			$scope.searchType.brand = true;
		}

		var componentSearchType = SessionService.get('component');
		if(componentSearchType) {
			$scope.searchType = angular.fromJson(componentSearchType);
			$scope.searchType.isCmp = function() {
				var me = this;
				return me.original || me.inaction || me.proffing;
			}
		}

		// 点击搜索库存、样品、呆滞
		$scope.cmpTypeClick = function() {
			if($scope.searchType.isCmp()) {
				$scope.searchType.brand = false;
			}
		};

		// 点击搜索品牌
		$scope.brandTypeClick = function() {
			if($scope.searchType.brand) {
				$scope.searchType.original = false;
				$scope.searchType.inaction = false;
				$scope.searchType.proffing = false;
			}
		};

		// 选搜索类型
		$scope.setSearchType = function(t) {
			$scope.searchType = t;
		};

		// 搜索
		$scope.search = function() {
			if($scope.keyword) {
				if($scope.searchType.brand) {
					SessionService.set('brand', true);
					SessionService.unset('component');
					window.location.href = 'search?w=' + encodeURI($scope.keyword) + '&type=brand';
				}else if($scope.searchType.isCmp()){
					SessionService.set('component', angular.toJson($scope.searchType));
					SessionService.unset('brand');
					window.location.href = 'search?w=' + encodeURI($scope.keyword) + '&type=component';
				}else {
					SessionService.unset('component');
					SessionService.unset('brand');
					window.location.href = 'search?w=' + encodeURI($scope.keyword) + '&type=all';
				}

			}
		};

		// 搜索框获得焦点，显示联想框
		$scope.onFocus = function() {
			$scope.associate = true;
			$scope.selectIndex = -1;
			if(!$scope.keyword) $scope.keyword = '';
		};

		// 搜索框失去焦点，关闭联想框
		$scope.onBlur = function() {
			$scope.associate = false;
		};

		// 搜索框通过按键选取想要的联想词
		$scope.onKeyup = function() {
			if($scope.associates && $scope.associates.length) {
				if(event.keyCode == 40) { //监听到按下键
					$scope.selectIndex ++;
					if($scope.selectIndex >= $scope.associates.length) $scope.selectIndex = 0;
					$scope.keyword = $scope.associates[$scope.selectIndex];
				} else if(event.keyCode == 38) { //监听到按上键
					$scope.selectIndex --;
					if($scope.selectIndex < 0) $scope.selectIndex = $scope.associates.length - 1;
					$scope.keyword = $scope.keyword = $scope.associates[$scope.selectIndex];
				} else if(event.keyCode == 13) { //确定键
					$scope.search();
				}
			}
		};

		// 输入框内容变化，获取新的联想词
		$scope.onChange = function() {
			if ($scope.keyword) {
				var params = {
					keyword: $scope.keyword
				};
				if($rootScope.userInfo) {
					params.userUU = $rootScope.userInfo.userUU;
				}
				$http.get('search/similarKeywords', {
					params : params
				}).success(function(data){
					$scope.associates = data;// 联想词数组
				}).error(function(response) {

				});
			} else {
				$scope.associates = [];// 联想词数组
			}

		};

		// 点击联想词
		$scope.onAssociateClick = function(component) {
			$scope.keyword = component;
			$scope.search();
		};

		// 鼠标进入联想词框，不能关闭联想词框
		$scope.onAssociateEnter = function() {
			$scope.associateEnter = true;
		};

		// 鼠标离开联想词框，可以关闭联想词框
		$scope.onAssociateLeave = function() {
			$scope.associateEnter = false;
		};

		// 热词
		$scope.hotwords = [{name : 'SCT2080KEC', url :'product#/component/1100400300009990/'},
			{name : '电池组', url : 'product#/kinds/346'},
			{name : 'Vishay',url : 'product#/brand/30327265e42a871be050007f01003d96/'},
			{name : 'Panasonic Battery', url : 'product#/brand/30327265e4e7871be050007f01003d96/'}];
	}]);

	// 商品类目菜单导航
	app.controller('CategoryMenuCtrl', ['$scope', 'KindAPI', '$rootScope', function($scope, KindAPI, $rootScope) {
		// 展开、收起类目菜单
		$scope.showMenu = function(b) {
			$scope.isMenuShow = b;
		};

		// 获取类目数据
		KindAPI.getAllChildren({parentId: 0}, function(data) {
			$scope.categories = data;
		}, function(response) {

		});

	}]);

	// 首页计数器
	app.controller('CommonCountCtrl', [ '$scope', 'CommonCountAPI', function ($scope, CommonCountAPI) {
		$scope.opreatedCounts = [];
		CommonCountAPI.getActived({}, function (data) {
			$scope.counts = data;
			angular.forEach($scope.counts, function (count) {
				count.countStr = count.count.toString();
				while (count.countStr.length < 9) {
					count.countStr = '0' + count.countStr;
				}

				count.nums = [];
				for(var i = 0; i < count.countStr.length; i++) {
					if (i%3 == 0) {
						var num = [];
					}
					var str = count.countStr.substring(i, i+1);
					num.push({value : str});
					if (i%3 == 0) {
						count.nums.push(num);
					}
				}
			});

			for(var i = 0; i < $scope.counts.length; i++) {
				if (i % 2 == 0) {
					var countList = [];
				}
				countList.push($scope.counts[i]);
				if (i % 2 == 0) {
					$scope.opreatedCounts.push(countList);
				}
			}
		}, function (response) {

		})
	}]);


	//器件的上架货物选择模态框的controller
	app.controller('GoodChooseCtrl', ['$scope', '$rootScope', 'toaster', 'NgTableParams', '$modalInstance', 'uuid', 'isBuy', 'Goods', 'Cart' , 'Order', '$filter', '$modal' ,'$location', 'Currency', 'SessionService', 'ngTableParams', function($scope, $rootScope, toaster, NgTableParams, $modalInstance, uuid, isBuy, Goods, Cart, Order, $filter, $modal, $location, Currency, SessionService, ngTableParams) {
		var enIdFilter = $filter('EncryptionFilter');
		$scope.uuid = uuid;
		$scope.isBuy = isBuy;
		$scope.choosedGoods = [];
		$scope.sort = {field: 'minPrice', desc: 'asc'};
		// 是否已加入购物车判断
		$scope.flag = {};
		$scope.orderType= 'prices[0].rMBPrice';

		// 设置每个批次的最低价格，用于排序
		var setMinPrice = function(data) {
			for(var i = 0; i < data.length; i ++) {
				var g = data[i];
				if(g.prices && g.prices.length) {
					g.minPrice = g.prices[g.prices.length - 1].price;
				}
				g.minPackQty = g.minPackQty || 1;
				g.minBuyQty = g.minBuyQty || 1;
			}
		};

		// 获取商品是否加入购物车状态信息
		var getCarts = function() {
			$scope.flag = {};
			if($rootScope.userInfo) {
				Cart.getCarts({}, function(data) {
					angular.forEach(data,function(cart){
						$scope.flag[cart.batchCode] = true;
					});
				});
			}
		};


		// 展开或隐藏分段价格
		$scope.showPrices = function(goods, currency) {
			if(currency === 'RMB') {
				goods.$pricesShowRmb = !goods.$pricesShowRmb;
			}else if(currency === 'USD') {
				goods.$pricesShowUsd = !goods.$pricesShowUsd;
			}
		};

		// 获取初始数据
		var getData = function() {
			$scope.productTableParams = new ngTableParams({
				page : 1,
				count : 10
			}, {
				total : 0,
				getData : function($defer, params) {
					$scope.paginationParams = params;
					var pageParams = params.url();
					pageParams.filter = {};
					getCarts();
					pageParams.filter.kindid = $scope.kindId;
					if($scope.filters.brandid) {// 品牌筛选
						pageParams.filter.brandid = $scope.filters.brandid;
					}
					// 属性值筛选
					if($scope.filters.properties && Object.keys($scope.filters.properties).length) {
						pageParams.filter.properties = angular.toJson($scope.filters.properties);
					}
					KindAPI.getCompGoodsByKindid(BaseService.parseParams(pageParams), function(data) {
						init(data.content);
						$defer.resolve(data.content);
						params.total(data.totalElements);
						// 初始化一下是否有送样
						$scope.hasSample = [];
						angular.forEach(data.content, function(compGoods) {
							compGoods.$pricesShowRmb = false;
							compGoods.$pricesShowUsd = false;
							if(compGoods.sampleQty > 0) {
								$scope.hasSample.push(false);
							}
						});

					}, function(res) {
						toaster.pop('error', '获取信息失败 ', res.data);
					});
				}
			});
		}

		getData();

		// 检测是否给定产品只有一种类型，同时标记同种类型的批次，便于在HTML中年使之具备相同的背景色。约定：content的数据是按型号已经分组好的。
		var init = function(content) {
			$scope.onlyOneType = false;
			if(content.length > 0) {
				$scope.onlyOneType = true;
				var obj0 = content[0];
				obj0.isOdd = true;
				var previousObj = obj0;
				var currentObj;
				for(var i = 0; i < content.length; i++) {
					currentObj = content[i];
					if(currentObj.code !== obj0.code) {
						$scope.onlyOneType = false;
					}
					if(currentObj.code !== previousObj.code) {
						//console.log('curr.code'+content[i].code);
						currentObj.isOdd = !previousObj.isOdd;
						//console.log('prev.code'+content[i].code);
					}else {
						currentObj.isOdd = previousObj.isOdd;
					}
					previousObj = currentObj;
				}
			}

			if($scope.onlyOneType) {
				$scope.orderType = 'reserve';
				$scope.dir = '-';
			}
		}

		// 改变排序顺序
		$scope.changeOrder = function(type){
			$scope.orderType = type;
			if(!$scope.dir || $scope.dir === '') {
				$scope.dir = '-';
			}else {
				$scope.dir = '';
			}
		}

		// 加入购物车或直接购买
		$scope.addToCart = function(goods, isBuy, value){
			if(!$rootScope.userInfo || !$rootScope.userInfo.userUU) {
				AuthenticationService.redirectSignin();
				return;
			}
			var a = {};
			a.uuid = goods.uuid;
			//TODO 先设置为点击加入购物车加入最小起订量，方便修改页面
			a.number = goods.minBuyQty;
			a.batchCode = goods.batchCode;
			a.taxes = goods.taxes;
			///a.storeuuid = goods.s
			var goodsList = [];
			goodsList.push(a);
			SessionService.set("buyNow", false);
			if(isBuy){// 1、如果是立即购买，跳转订单确认页面
				if(a.number > 0) {
					var newWindow = window.open('product#/cart');
					Order.saveByGroup({}, goodsList, function(data){
						// 控制订单确认页，直接购买不显示进度条
						SessionService.set("buyNow", true);
						newWindow.location.href = 'products#/orderEnsure/'+ enIdFilter(data.data.orderid);
					}, function(res){
						newWindow.close();
						toaster.pop('error', '警告', res.data);
					});
				}else {
					toaster.pop('warning', '提示', '该商品库存为0，请等待上货或咨询客服');
				}
			} else {// 2、如果是加入购物车，组装cart对象，提交
				if (a.number > 0) {
					Cart.save({uuid: a.uuid}, a, function(data){
						toaster.pop('success', '保存成功', '添加购物车成功');
						Cart.getCount({}, function(data){
							$rootScope.countCart = data.count;
						}, function(res){
						});
						// 每次修改购物车信息之后，都获取当前状态
						getCarts();
					}, function(res){
						toaster.pop('error', '警告', res.data);
						getCarts();
					});
				} else {
					toaster.pop('warning', '提示', '该商品库存为0，请等待上货或咨询客服');
				}
			}
		};

		// 删除购物车对应商品
		$scope.deleteFromCart = function(batchCode) {
			var arr = [];
			arr.push(batchCode);
			var batchCodes = angular.toJson(arr);
			Cart.deleteByBatchCode(batchCodes,function(data){
				toaster.pop('info', '取消成功', '撤销商品成功');
				Cart.getCount({}, function(data){
					$rootScope.countCart = data.count;
				}, function(res){
				});

				// 每次修改购物车信息之后，都获取当前状态
				getCarts();
			}, function(res){
				toaster.pop('error', '取消失败', '商品已从购物车删除，请重新选择');
				getCarts();
			});
		};

		Currency.getAllName({}, {}, function(data) {
			$scope.currencyNames = data;
		}, function(res) {
			toaster.pop('error', '币别信息加载失败，请刷新页面')
		})

		// 选择币别
		$scope.setCurrency = function(c){
			$scope.goodsTableParams.filter({'currencyName': c});
		}

		// 设置已添加购物车数
		var setAddedCart = function(carts) {
			if(carts && carts.length > 0) {
				for(var i = 0; i < carts.length; i ++) {
					var cart = carts[i];
					for(var j = 0; j < $scope.goodes.length; j ++) {
						var goods = $scope.goodes[j];
						if(goods.batchCode == cart.batchCode) {
							goods.addedQty = (goods.addedQty || 0) + cart.number;
							goods.qty = goods.addedQty;
							$scope.checkQty(goods);
						}
					}
				}
			}
		};

		var loadData = function(){
			// 请求商品批次信息
			Goods.findSimpleAvailableByUuid({uuid: uuid}, {}, function(data){
				setMinPrice(data);// 设置每个批次的最低价格
				$scope.goodes = data;
				$scope.goodsTableParams = new NgTableParams({}, { dataset: data});
				$scope.goodsTableParams.sorting($scope.sort.field, $scope.sort.desc);
				getCarts();
				Cart.getByUuid({uuid: uuid}, function(data) {
					setAddedCart(data);
				}, function(response) {
					toaster.pop('error', '获取购物车信息失败', response.data);
				});
			}, function(res){
				toaster.pop('error', '系统异常', '产品现货批次数据加载失败');
			});
		};

		// 设置排序方式
		$scope.setSort = function(field, desc) {
			if(field == 'minPrice' && $scope.sort.field != 'minPrice') {// 切换到价格排序时先升序排序
				desc = 'asc';
			} else if( ! desc) {// 不指定升降序时，进行升降序切换
				if($scope.sort.desc == 'asc') {
					desc = 'desc';
				} else {
					desc = 'asc';
				}
			}
			$scope.sort = {field: field, desc: desc};
			$scope.goodsTableParams.sorting($scope.sort.field, $scope.sort.desc);
		};

		// 根据批次已输入购买数量获取对应的分段价格
		$scope.currentPrice = function(goods) {
			var r;
			if(goods.qty && goods.prices) {
				angular.forEach(goods.prices, function(v, k) {
					if(v.start <= goods.qty && v.end >= goods.qty) {
						r = v.taxPrice;
						v.$checked = true;
					} else {
						v.$checked = false;
					}
					if(k == (goods.prices.length - 1) && goods.qty > v.end) {
						r = v.taxPrice;
					}
				});
			}
			return r;
		};

		// 验证批次购买数量是否有效
		$scope.qtyInvalid = function(goods) {
			return goods.qty && (goods.qty % goods.minPackQty);
		};

		// 检验购买数量，合理则加入已加入购物清单
		$scope.checkQty = function(goods) {
			if(! $scope.qtyInvalid(goods) && goods.qty) {
				var p = $scope.currentPrice(goods);
				var taxes = goods.qty*(p*goods.tax/(100+goods.tax)); // 税率是相对于未含税的价格，而此处的价格已含税
				var unContained = true;
				angular.forEach($scope.choosedGoods, function(v, k) {
					if(v.batchCode == goods.batchCode) {
						unContained = false;
						v.taxPrice = p;
						v.qty = goods.qty;
						v.taxes = taxes;
					}
				});
				if(unContained) {
					$scope.choosedGoods.push(angular.extend({taxPrice: p, taxes: taxes}, goods));
				}
				goods.$choosed = true;// 此批次已选购
			} else {
				angular.forEach($scope.choosedGoods, function(v, k) {
					if(v.batchCode == goods.batchCode) {
						$scope.choosedGoods.splice(k, 1);
					}
				});
				goods.$choosed = false;// 此批次未选购
			}
		};

		// 移除已选择的批次
		$scope.removeChoosed = function(index) {
			var cg = $scope.choosedGoods[index];
			if(cg) {
				$scope.choosedGoods.splice(index, 1);
				angular.forEach($scope.goodes, function(v, k) {
					if(cg.batchCode == v.batchCode) {
						v.qty = null;
						v.$choosed = false;
					}
				});
			}
		};

		// 获取已选购的总数量
		$scope.getTotalQty = function() {
			var qty = 0;
			angular.forEach($scope.choosedGoods, function(v, k) {
				qty += Number(v.qty);
			});
			return qty;
		};

		// 获取已选购的总额
		$scope.getTotal = function() {
			var total = {};
			angular.forEach($scope.choosedGoods, function(v, k) {
				total[v.currencyName] = total[v.currencyName] || 0;
				total[v.currencyName] += v.taxPrice * v.qty;
			});
			return total;
		};

		// 提交前转换一下已选购的商品
		var convertGoods = function() {
			var r = [];
			angular.forEach($scope.choosedGoods, function(v, k) {
				r.push({
					uuid: v.uuid,
					batchCode: v.batchCode,
					number: v.qty,
					taxes: v.taxes
				});
			});
			return r;
		};

		loadData();

		/*// 自动分配选购数量
		 $scope.allocate = function(num) {
		 if(num) {
		 if (!$scope.currency) {
		 $scope.currency = 'RMB';
		 $scope.goodsTableParams.filter({'currencyName': 'RMB'});
		 }
		 $scope.choosedGoods = [];
		 var datas = $filter('orderBy')($scope.goodes, $scope.sort.field, $scope.sort.desc == 'desc');
		 for(var i = 0; i < datas.length; i ++) {
		 var d = datas[i];
		 // 只对指定的币别 && 要分配数量大于最小订购量 的商品批次分配
		 if(d.currencyName == $scope.currency && num >= d.minBuyQty) {
		 if(d.reserve >= num) {
		 if(num % d.minPackQty > 0) {
		 d.qty = num - (num % d.minPackQty) + d.minPackQty;
		 } else {
		 d.qty = num;
		 }
		 } else {
		 d.qty = d.reserve - (d.reserve % d.minPackQty);
		 }
		 num -= d.qty;
		 } else {
		 d.qty = null;
		 }
		 $scope.checkQty(d);
		 }
		 }
		 };*/

		/*// 确认
		 $scope.ok = function(){
		 angular.forEach($scope.goodes, function(v, k) {
		 $scope.checkQty(v);
		 });
		 var g = convertGoods();
		 if(!g || g.length == 0) return;// 没选择批次就不提交
		 if($scope.isBuy){// 1、如果是立即购买，直接生成订单，返回订单
		 Order.saveByGroup({}, g, function(data){
		 var orderids = [];
		 angular.forEach(data, function(order) {
		 orderids.push(order.orderid );
		 })
		 toaster.pop('success', '成功', '订单生成成功，订单号为【' + orderids.join(',') + '】。请您确认订单并付款');
		 $modalInstance.close(enIdFilter(orderids.join('-')));
		 }, function(res){
		 toaster.pop('error', '警告', res.data);
		 });
		 } else {// 2、如果是加入购物车，组装cart对象，提交
		 Cart.save({uuid: $scope.uuid}, g, function(data){
		 toaster.pop('success', '保存成功', '添加购物车成功');
		 Cart.getCount({}, function(data){
		 $rootScope.countCart = data.count;
		 }, function(res){
		 });
		 $modalInstance.close(); //关闭并返回当前选项
		 window.open('user#/cart');
		 }, function(res){
		 toaster.pop('error', '警告', res.data);
		 });
		 }
		 };*/

		$scope.applysample = function(goods) {
			//首先判断是否已送样
			Goods.isSample({id: goods.id}, {}, function(data){
				if(data.id) {
					window.open("product#/proofings/" + enIdFilter(goods.batchCode));
				}else {
					toaster.pop('info', '该批次已申请样品', '请勿重复申请');
					loadData();
				}
			}, function(res){
				loadData();
				toaster.pop('error', '系统异常', '产品现货批次数据加载失败');
			});
		}

		// 退出
		$scope.cancel = function(){
			$modalInstance.dismiss('');
		};

	}]);

	// 对比框侧边栏的Controller
	app.controller('CompareBarCtrl', ['$scope', '$rootScope', 'Compare', 'toaster', function($scope, $rootScope, Compare, toaster) {
		if(!$rootScope.compares) {
			Compare.get({}, function(data){
				$rootScope.compares = data;
			}, function(response) {
				toaster.pop('error', '获取对比列表失败', response.data);
			});
		}

		// 移除对比
		$scope.remove = function(uuid) {
			Compare.remove({uuid: uuid}, {}, function(data) {
				$rootScope.compares = data;
			}, function(response) {
				toaster.pop('error', '移除对比失败', response.data);
			});
		};

		// 清空对比
		$scope.removeAll = function() {
			Compare.removeAll({}, {}, function(data) {
				$rootScope.compares = data;
			}, function(response) {
				toaster.pop('error', '清空对比失败', response.data);
			});
		};

		// 开始对比
		$scope.compare = function() {
			$rootScope.$content_open = false;
			var uuids = [];
			if($rootScope.compares.length<2) {
				toaster.pop('info', "少于两个产品，不能对比");
				return ;
			}
			for(var i=0; i<$rootScope.compares.length; i ++) {
				uuids.push($rootScope.compares[i].uuid);
			}
			var uuidStr = uuids.join(',');
			window.location.href = 'product#/compare/' + uuidStr;
		};

	}]);

	// 留言板侧边栏的Controller
	app.controller('MessageBarCtrl', ['$scope', '$modal', 'BaseService', function($scope, $modal, BaseService) {
		var rootPath = BaseService.getRootPath();
		$scope.openMessagePanel = function() {
			var modalInstance = $modal.open({
				templateUrl : rootPath + '/static/view/common/modal/messageBoard.html',  //指向上面创建的视图
				controller : 'MessageBoardModalCtrl',// 初始化模态范围
				size : 'md',
				backdrop : 'static'
			});
			modalInstance.opened.then(function(){
			});
			modalInstance.result.then(function(brand){
			}, function(reason){
			});
		}
	}]);

	// Web Chat侧边栏的Controller
	app.controller('WebChatCtrl', ['$scope', '$interval', 'AuthenticationService', 'ChatBusinessLayer', 'toaster','$rootScope', function($scope, $interval, AuthenticationService, ChatBusinessLayer, toaster ,$rootScope) {
		$scope.userInfo = null;
		$scope.countData = 0;
		$scope.goWebChat = goWebChat;

		activate();

		function activate() {
			AuthenticationService.getAuthentication().then(function (data) {
				if (data && data.data) {
					$scope.userInfo = data.data;
					$scope.param = ChatBusinessLayer.getParamsFromUserInfo(data.data);
					accessRealTimeData($scope.param);
				}
			}, function () {
			});
		}

		function accessRealTimeData(param) {
			//先调一次
            ChatBusinessLayer.accessUnreadMessageCount(param).then(function (count) {
                $scope.countData = count;
            }, function () {
                $scope.countData = 0;
            });
			$interval(function () {
				ChatBusinessLayer.accessUnreadMessageCount(param).then(function (count) {
					$scope.countData = count;
				}, function () {
					$scope.countData = 0;
				});
			}, 10000);
		}

		function goWebChat() {
			if (!$scope.userInfo) {
				toaster.pop('error', '请先登录优软商城！');
				return ;
			}
			if (!$scope.userInfo.userTel || $scope.userInfo.userTel === '') {
				toaster.pop('error', '请先注册优软互联！');
				return ;
			}

			//获得窗口的垂直位置
			var iTop = (window.screen.availHeight - 30 - 780) / 2;
			//获得窗口的水平位置
			var iLeft = (window.screen.availWidth - 10 - 1030) / 2;
			var newTab = window.open('', '即时对话框', 'height=750, width=1000, top=' + iTop + ', left=' + iLeft + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
			newTab.close();
            var newTab = window.open('', '即时对话框', 'height=750, width=1000, top=' + iTop + ', left=' + iLeft + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
			var chatInfoDto = { userPhone: $scope.param.phone, enUU: $scope.param.enUU };
			if (!chatInfoDto.enUU){
				chatInfoDto = {userPhone: $scope.param.phone};
			}
			ChatBusinessLayer.visitWebChat(chatInfoDto, 'LIST').then(function (gid) {
				console.log(gid);
				//newTab.location.href = 'http://192.168.253.31:20220/chat/visit?gid=' + gid;
				newTab.location.href = 'https://im.ubtob.com/chat/visit?gid=' + gid;
			}, function (error) {
				console.log(error);
				newTab.close();
				toaster.pop('warning', '您还没有开通客服系统，请开通客服系统！');
			});
		}
	}]);

	// 跳至顶部
	app.controller('ScrollToTopCtrl', ['$scope', 'SmoothScroll', 'toaster', 'CommonGoodsBrowsingHistory', 'AuthenticationService', function($scope, SmoothScroll, toaster, CommonGoodsBrowsingHistory, AuthenticationService){
		$scope.scrollToTop = function(){
			SmoothScroll.scrollTo(null, 'site-nav');
		};

		AuthenticationService.getAuthentication().success(function(data){
			$scope.userInfo = data;
			if(data){
				loadData();
			}
		});

		// 获取浏览历史
		var  loadData = function(){
			CommonGoodsBrowsingHistory.getAllHistory({ }, { }, function (response) {
				$scope.inithistory = response;
				$scope.history = [];
				angular.forEach($scope.inithistory, function(data){
					if(data.isDelete == 1){
						$scope.history.push(data);
					}
				})
			})
		}

		// 删除足迹历史
		$scope.deleteHistory = function (id) {
			CommonGoodsBrowsingHistory.setDelete({id : id}, { }, function(response){
				if(response.data = "success"){
					toaster.pop("success", "删除足迹成功");
					loadData();
				}
			})
		}

	}]);

	// 留言板模态框
	app.controller('MessageBoardModalCtrl', ['$scope', '$modalInstance', 'AuthenticationService', 'MessageBoardAPI', 'MessageBoard', 'toaster', 'ngTableParams', 'BaseService', function($scope, $modalInstance, AuthenticationService, MessageBoardAPI, MessageBoard, toaster, ngTableParams, BaseService) {
		$scope.messageBoard = {};
		$scope.showHistory = false;

		$scope.params = {
			page : 1,
			count : 3,
			sorting : {
				createDate: 'DESC'
			}
		};

		AuthenticationService.getAuthentication().success(function(data){
			$scope.user = data;
		});

		document.onkeydown = function (ev) {
			var onEvent = ev || event;
			if (onEvent.keyCode == 27)
				$('#image-box').hide();
		};

		/**
		 * 上传图片
		 */
		$scope.onUpload = function ($data, index) {
			if (!$scope.imgs) {
				$scope.imgs = [{}, {}, {}, {}, {}];
			}
			if (!$data || !$data.path) {
				toaster.pop('error', '图片上传失败');
				return ;
			}
			$scope.imgs[index] = {'img' : $data.path};
		};

		// 删除图片
		$scope.deleteImg = function (index) {
			$scope.imgs[index] = {};
		};

		// 查看范例
		$scope.showImg = function(imgUrl) {
			var src = imgUrl, box = $('#image-box'), modal = $('.modal-content');
			box.show();
			box.find('img').attr('src', src);
			box.find('a').click(function(){
				box.hide();
			});
			box.dblclick(function(){
				box.hide();
			});
		};

		//初始化页数信息
		$scope.initPages = function (totalElementPages) {
			var pageNum = [];
			if(totalElementPages == 1) {
				return ;
			}else if(totalElementPages < 10) {
				for(var i = 0; i < totalElementPages + 2; i++) {
					pageNum.push(i);
				}
			}else {
				pageNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
			}
			angular.forEach(pageNum, function (number) {
				var page = {active : true, type : 'page', number : number};
				if(number == 0) {
					page.type = 'prev';
				}else if(number == 1) {
					page.type = 'first';
				}else if(number == pageNum.length - 2) {
					page.type = 'last';
					page.number = totalElementPages;
				}else if(number == pageNum.length - 1){
					page.type = 'next';
				}
				$scope.pages.push(page);
			});
		};

		//当前页在后端计算方式
		$scope.endSegment = function (currentPage, totalElementPages) {
			if (totalElementPages > 8) {
				angular.forEach($scope.pages, function (page) {
					switch (page.number) {
						case 2:
							page.active = false;
							page.type = 'more';
							break;
						case 10:
							if(currentPage == totalElementPages) {
								page.active = false;
							}
							break;
						case 0:
						case 1:
							break;
						default:
							if(page.number != totalElementPages) {
								page.number = totalElementPages - 9 + page.number;
							}
							page.current = (currentPage == page.number);
							break;
					}
				});
			}
		};

		//当前页在中间计算方式
		$scope.middleSegment = function (currentPage) {
			angular.forEach($scope.pages, function (page) {
				switch (page.number) {
					case 2:
					case 8:
						page.type ='more';
						page.active = false;
						break;
					case 3:
						page.number = currentPage - 2;
						break;
					case 4:
						page.number = currentPage - 1;
						break;
					case 5:
						page.number = currentPage;
						page.current = true;
						break;
					case 6:
						page.number = currentPage + 1;
						break;
					case 7:
						page.number = currentPage + 2;
						break;
				}
			});
		};

		//当前页在前段的计算方式
		$scope.frontSegment = function (currentPage, totalElementPages) {
			if (totalElementPages > 8) {
				angular.forEach($scope.pages, function (page) {
					switch (page.number) {
						case 8:
							page.type = 'more';
							page.active = false;
							break;
						case 0:
							if(currentPage == 1) {
								page.active = false;
							}
						default : {
							page.current = (currentPage == page.number);
						}
					}
				});
			}
		};

		//输入框监听Enter事件
		$scope.listenEnter = function () {
			if(event.keyCode == 13) {
				var rnum = /^\d*$/;
				if (rnum.test($scope.params.currentPage)) {
					$scope.setPage("page", $scope.params.currentPage);
				} else {
					toaster.pop('info', '请输入合法数字');
				}
			}
		};

		$scope.setPage = function(type, number) {
			if(type != 'prev' &&  type != 'page' && type != 'next' && type != 'last' && type != 'first') {
				return ;
			};
			var page = -1;
			switch (type) {
				case "page":
					if(number < 1) {
						page = 1;
					}else if(number > $scope.messageBoardAllData.totalPages) {
						page = $scope.messageBoardAllData.totalPages;
					}else {
						page = number;
					};
					break;
				case "prev":
					if($scope.params.page <= 1) {
						page = 1;
					}else {
						page =$scope.params.page - 1;
					};
					break;
				case "next":
					if($scope.params.page >= $scope.messageBoardAllData.totalPages) {
						page = $scope.messageBoardAllData.totalPages
					}else {
						page =$scope.params.page + 1;
					}
					break;
				case "first":
					page = 1;
					break;
				case "last":
					page = $scope.messageBoardAllData.totalPages;
					break;
			}
			if(page == $scope.params.page || page < 1 || page > $scope.messageBoardAllData.totalPages) {
				$scope.params.currentPage = $scope.params.page;
				return ;
			}
			var rnum = /^\d*$/;
			if (rnum.test(page)) {
				$scope.params.page = page;
				loadData();
			} else {
				toaster.pop('info', '请输入合法数字');
			}
		};

		//计算页数的方式。
		$scope.acculatePages = function(currentPage, totalElementPages) {
			$scope.pages = [];
			if(totalElementPages < 1)  {
				return ;
			}
			//初始化页面数据
			$scope.initPages(totalElementPages);
			if(currentPage < 6) {//当期页小于6
				$scope.frontSegment(currentPage, totalElementPages);
			}else if(currentPage > totalElementPages - 5) { //当期页在后面
				$scope.endSegment(currentPage, totalElementPages);
			}else { //当期页在中间
				$scope.middleSegment(currentPage);
			}
		};

		var loadData = function() {
			MessageBoard.getPageInfoByUser($scope.params, function(page) {
				if (page) {
					$scope.messageBoardAllData = page;
					$scope.messageBoardCurrent = page.content;
					$scope.params.currentPage = page.number;
					$scope.acculatePages(page.number, page.totalPages);
				}
			}, function(){
			});
		};

		// 提交留言
		$scope.confirm = function(){
			$scope.messageBoard.imgs = [];
			angular.forEach($scope.imgs, function(img){
				if (img.img) {
					$scope.messageBoard.imgs.push(img);
				}
			});
			if (!$scope.messageBoard.question) {
				toaster.pop('info', '您还没有填写反馈内容');
				return;
			}

			if (!$scope.messageBoard.role) {
				toaster.pop('info', '请选择您的身份信息');
				return;
			}

			if (!$scope.messageBoard.type) {
				toaster.pop('info', '请选择一种反馈类型');
				return;
			}

			if (!$scope.user) {
				if (!$scope.messageBoard.userTel && !$scope.messageBoard.email) {
					toaster.pop('info', '请填写任意一种联系方式');
					return;
				}

				var regTel = /^[\d]{8,11}$/;
				if ($scope.messageBoard.userTel && ($scope.messageBoard.userTel.length > 11 || $scope.messageBoard.userTel.length < 8)) {
					toaster.pop('info', '请填写8~11位手机号码');
					return;
				}
				if ($scope.messageBoard.userTel && $scope.messageBoard.userTel.match(regTel) == null) {
					toaster.pop('info', '请填写正确的联系方式');
					return;
				}

				var regEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				if ($scope.messageBoard.email && $scope.messageBoard.email.length > 125) {
					toaster.pop('info', '邮箱地址不得超过125个字符');
					return;
				}
				if ($scope.messageBoard.email && messageBoardForm.email.$invalid) {
					toaster.pop('info', '请填写正确的联系方式');
					return;
				}

				if (!$scope.messageBoard.userTel && !$scope.messageBoard.email) {
					toaster.pop('info', '请填写任意一种联系方式');
					return;
				}
			}

			$scope.messageBoard.submitUrl = window.location.href;
			$scope.messageBoard.submitTitle = document.title;

			MessageBoardAPI.save({}, $scope.messageBoard, function(data) {
				toaster.pop('info', '提示', '感谢您的宝贵意见');
				$modalInstance.close();
			}, function(res) {
				toaster.pop('error', '提示', '留言失败，请重新提交' + res.data);
			});
		};

		// 关闭
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};

		// 打开记录
		$scope.openHistory = function() {
			$scope.showHistory = true;
			loadData();
		};

		// 关闭记录
		$scope.hideHistory = function() {
			$scope.showHistory = false;
		};
	}]);

	// 留言记录模态框
	app.controller('MessageBoardListModalCtrl', ['$scope', function($scope) {
		// 关闭
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
	}]);


	// 线下支付模态框
	app.controller('OfflinePayCtrl', ['$scope', '$modalInstance', 'order', 'totalAmount', 'bankInfoService', 'toaster', '$modal', '$filter', 'ImgUrl', 'bankTransferService', function ($scope, $modalInstance, order, totalAmount, bankInfoService, toaster, $modal, $filter, ImgUrl, bankTransferService) {
		var hideBankFilter = $filter("hideBankFilter");

		$scope.order = order;
		$scope.totalAmount = totalAmount;

		$scope.isBuyerAccountPersonal = false; // 默认买家账户是企业账户
		$scope.isMallAccountPersonal = false; // 默认商城账户是企业账户

		// 为买家设置账户类型
		$scope.setAccountTypeForBuyer = function(isPersonal) {
			if(!angular.equals($scope.isBuyerAccountPersonal, isPersonal)) {
				$scope.isBuyerAccountPersonal = isPersonal;
				getBuyAccount();
			}
		};

		// 为商城设置账户类型
		$scope.setAccountTypeForMall = function(isPersonal) {
			if(!angular.equals($scope.isMallAccountPersonal, isPersonal)) {
				$scope.isMallAccountPersonal = isPersonal;
				getSellerAccount();
			}
		};

		// 下拉买家账户
		$scope.dropDownBuyerAccount = function(dropdown) {
			$scope.isBuyerAccountDropDown = dropdown
		}
		// 选择买家账户
		$scope.selectBuyerAccount = function (account) {
			$scope.buyAccount = account;
			$scope.isBuyerAccountDropDown = false;
		}
		// 下拉商城账户
		$scope.dropDownMallAccount = function(dropdown) {
			$scope.isMallAccountDropDown = dropdown
		}
		// 选择商城账户
		$scope.selectMallAccount = function (account) {
			$scope.saleAccount = account;
			$scope.isMallAccountDropDown = false;
		}

		// 获取数据
		//根据单选框的状态，提取不同的数据
		var getBuyAccount = function() {
			if(!$scope.isBuyerAccountPersonal) {
				bankInfoService.getBuyEnterpriseBank('', function(data) {
					$scope.buyAccountInfos = resolveData(data);
					angular.forEach($scope.buyAccountInfos, function(buyAccountInfo) {
						buyAccountInfo.filterAccount = hideBankFilter(buyAccountInfo.number);
					});
					$scope.buyAccount = getOriginalData($scope.buyAccountInfos);
				}, function(error) {
					toaster.pop('error', '错误', '提取企业账户信息失败');
				});
			}else {
				bankInfoService.getBuyPersonalBank('', function(data) {
					$scope.buyAccountInfos = resolveData(data);
					angular.forEach($scope.buyAccountInfos, function(buyAccountInfo) {
						buyAccountInfo.filterAccount = hideBankFilter(buyAccountInfo.number);
					});
					$scope.buyAccount = getOriginalData($scope.buyAccountInfos);
				}, function(error) {
					toaster.pop('error', '错误', '提取个人账户信息失败');
				});
			}
		};
		getBuyAccount();

		//获取管理平台账户信息
		var getSellerAccount = function() {
			if(!$scope.isMallAccountPersonal) {
				bankInfoService.getAdminEnterAccount('', function(data) {
					$scope.saleAccountInfos = resolveData(data);
					angular.forEach($scope.saleAccountInfos, function(saleAccountInfo) {
						saleAccountInfo.filterAccount = hideBankFilter(saleAccountInfo.number);
					});
					$scope.saleAccount = getOriginalData($scope.saleAccountInfos);
				}, function(res) {
					toaster.pop('error', '错误', '获取卖家企业账户信息失败');
				});
			}else {
				bankInfoService.getAdminPersAccount('', function(data) {
					$scope.saleAccountInfos = resolveData(data);
					angular.forEach($scope.saleAccountInfos, function(saleAccountInfo) {
						saleAccountInfo.filterAccount = hideBankFilter(saleAccountInfo.number);
					});
					$scope.saleAccount = getOriginalData($scope.saleAccountInfos);
				}, function(res) {
					toaster.pop('error', '错误', '获取卖家个人账户信息失败');
				});
			}
		}
		getSellerAccount();

		// 买家新增账户
		$scope.newAccount = function(data) {
			var modalInstance = $modal.open({
				templateUrl : 'static/view/common/bankInfoModal.html',
				controller : 'BankInfoCtrl',
				resolve : {
					kind : function() {
						//深拷贝一份
						return angular.copy($scope.isBuyerAccountPersonal);
					},
					account : function() {
						//深拷贝一份
						return angular.copy(data);
					}
				}
			});

			modalInstance.result.then(function(account) {
				if(account.kind) {
					bankInfoService.saveBuyPersonalBank({}, account, function(data) {
						toaster.pop('success', '成功','信息已添加');
						$scope.purKind = account.kind;
						getBuyAccount();  //这个方法不能提取到外面，因为存在异步。
					}, function(res) {
						toaster.pop('error', '错误', res.data);
					});
				}else {
					//企业账户
					bankInfoService.saveBuyEnterpriseBank({}, account, function(data) {
						toaster.pop('success', '保存成功','信息已添加');
						$scope.purKind = account.kind;
						getBuyAccount();
					}, function(res) {
						toaster.pop('error', '错误', res.data);
					});
				}
			}, function() {

			});
		};
		// 买家删除账户
		$scope.deleteAccount = function(buyAccount) {
			var  isSure = confirm('确认删除本银行账户？删除后无法恢复，请谨慎操作');
			if(isSure){
				bankInfoService.deleteBank({id: buyAccount.id}, function(data) {
					toaster.pop('success', '删除成功');
					getBuyAccount();
				}, function(response) {
					toaster.pop('error', '删除失败');
				})
			}
		}

		// 选择日期相关逻辑
		$scope.maxDate = new Date();

		$scope.image = {src: null};
		// 图片上传成功之后
		$scope.onUploadSuccess = function(data){
			var path = data.path;
			path = ImgUrl.handelByWidthHeigth(path, 65, 66);
			$scope.$apply(function(){
				$scope.image.src = data.path;
				$scope.image.thumb = path;
			});
		};

		$scope.pay = function(order) {
			if(order.availabletime < new Date().getTime()) {
				toaster.pop("error", '错误', '此订单已过期，已失效');
			}
		};

		$scope.confirm = function() {
			if(angular.isUndefined($scope.order.orderid) || angular.equals($scope.order.orderid,'') || angular.equals($scope.total, 0)) {
				toaster.pop('info', '提示', '没有选择要付款的订单,或付款总额为0');
				return ;
			}
			if(angular.isUndefined($scope.buyAccount)||angular.equals("{}", angular.toJson($scope.buyAccount))) {
				toaster.pop('info', '提示', '请选择买家账户');
				return ;
			}
			if(angular.isUndefined($scope.saleAccount)||angular.equals("{}", angular.toJson($scope.saleAccount))) {
				toaster.pop('info', '提示', '请选择卖家账户');
				return ;
			}
			if(!$scope.transferTime) {
				toaster.pop('info', '提示', '请选择付款日期');
				return ;
			}
			if(!$scope.image.src) {
				toaster.pop('info', '提示', '请选择付款截图');
				return ;
			}
			var buyAccount = angular.copy($scope.buyAccount);
			var saleAccount = angular.copy($scope.saleAccount);
			delete saleAccount.filterAccount;
			delete buyAccount.filterAccount;
			var jsonPament = angular.toJson(buyAccount);
			var jsonReceive = angular.toJson(saleAccount);
			var transfer = {};
			transfer.jsonPament = jsonPament;
			transfer.jsonReceive = jsonReceive;
			transfer.imgUrl = $scope.logoUrl;
			transfer.transferTime = $scope.transferTime.getTime();
			transfer.total = $scope.total;
			bankTransferService.saveTransfer({order: $scope.order.orderid}, transfer, function(data) {
				$modalInstance.close();
			}, function(response) {
				toaster.pop("error", '失败', '信息保存失败:' + response.data);
			});
		}

		// 取消
		$scope.cancel = function () {
			$modalInstance.dismiss();
		}

		// 确认提醒
		$scope.ensureWarning = function (isWarning) {
			if(isWarning) {
				if(!$scope.transferTime) $scope.transferWaring = true;
				if(!$scope.image.src) $scope.imgWarning = true;
			}else {
				$scope.transferWaring = false;
				$scope.imgWarning = false;
			}
		}
	}]);

	// 新建/修改银行账户
	app.controller('BankInfoCtrl', ['$scope', '$modalInstance', 'account', 'kind', function($scope, $modalInstance, account, kind){
		$scope.account = account;
		if($scope.account) {
			$scope.eidt = true;
		} else {
			delete $scope.eidt;
		}
		$scope.kind = kind;

		if($scope.account) {
			$scope.title = "修改账户";
		}else {
			$scope.title = "新增账户";
			$scope.account = {};
			$scope.account.currency = 'RMB'; // 默认银行卡币别是人民币
		}

		$scope.set = function(kind) {
			$scope.kind = kind;
		}

		$scope.confirm = function() {
			$scope.account.kind = $scope.kind;
			$modalInstance.close($scope.account);
		}

		$scope.cancel = function() {
			$modalInstance.dismiss();
		}

	}]);

	/**
	 * 店铺首页header控制器
	 */
	app.controller('StoreHeaderCtrl', ['$scope', '$rootScope', '$modal', 'toaster', 'StoreFocusService', 'AuthenticationService', function ($scope, $rootScope, $modal, toaster, StoreFocusService, AuthenticationService) {
		/**
		 * 店铺首页下拉信息是否展开
		 */
		$scope.isOpen = false;

		/**
		 * 展示下拉信息
		 */
		$scope.openDropDown = function () {
			$scope.isOpen = true;
		};

		/**
		 * 收起下拉信息
		 */
		$scope.closeDropDown = function () {
			$scope.isOpen = false;
		};


		$scope.isFocus = false;  // 是否关注标识
		// 用户已登陆状态，初始加载页面时，判断店铺是否已经关注
		AuthenticationService.getAuthentication().success(function(data){
			$scope.userInfo = data;
			if(data) {
				StoreFocusService.storeIfFocus({storeid : $rootScope.storeInfo.id}, {}, function(response){
					var result = response.data;
					if(result == "true"){
						$scope.isFocus = true;
					}
				});
			}
		});

		// 店铺关注	
		$scope.focus = function(id, storeName){
			$scope.storeFocus = {};
			$scope.storeFocus.storeName = storeName;
			$scope.storeFocus.storeid = id;
			StoreFocusService.saveStoreFocus({}, $scope.storeFocus, function(response){
				var result = response.data;
				if(result == "success"){
					$scope.isFocus = true;
					$modal.open({
						templateUrl : $rootScope.rootPath + "/static/view/store/modal/storeFocus_modal.html",
						controller : "storeFocusModalCtrl",
						size : 'sm'
					});
				}else{
					toaster.pop("error", "店铺关注失败");
				}
			})
		}
	}]);

	app.controller('storeFocusModalCtrl', ["$scope", "$modalInstance", function($scope, $modalInstance){
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
	}]);

  /**
   * 左侧导航栏控制器
   */
	app.controller('leftNavCtrl', ["$scope", "toaster", function($scope, toaster){
		$scope.promptUpdate = function() {
			console.info($scope.userInfo.pwdEnable);
			if (!$scope.userInfo.pwdEnable) {
        toaster.pop("info", "请修改登录密码");
        return;
			}
      if (!$scope.userInfo.userEmail) {
        toaster.pop("info", "请绑定邮箱");
        return;
      }
      if (!$scope.userInfo.haveUserQuestion) {
        toaster.pop("info",  "请设置密保问题 ");
        return;
      }
		}
  }]);
	var getOriginalData = function(data) {
		var result = {};
		if(data&&data.length) {
			result = data[0];
		}else {
			result = null;
		}
		return result;
	};
	//解析数据，从返回的数据中找到要解析的数据
	var resolveData = function(data) {
		var arr = new Array();
		for(var key in data) {
			var numb= Number(key);
			if(angular.isNumber(numb)&&(!isNaN(numb))) {
				arr.push(data[key]);
			}
		}
		return arr;
	};
});
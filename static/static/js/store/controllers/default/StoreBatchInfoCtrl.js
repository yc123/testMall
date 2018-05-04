/**
 * 店铺详情页面控制器
 *
 * history:
 * Created by huxz on 2017-3-22 15:51:06
 */
define(['app/app'], function(app) {
	app.register.controller('StoreBatchInfoCtrl', ['$scope', '$stateParams', 'Commodity', 'NumberService', 'GoodsBrowsingHistory', 'AuthenticationService', function($scope, $stateParams, Commodity, NumberService, GoodsBrowsingHistory, AuthenticationService) {

		$scope.isAuthed = AuthenticationService.isAuthed();

		// 保存浏览记录
		if ($scope.isAuthed) {
			GoodsBrowsingHistory.saveGoods({ batchCode : $stateParams.batchCode }, { }, function(response){
				console.log("保存成功");
			});
		}

		// 获取商品批次号信息
		const batchCode = $stateParams.batchCode;
		// 价格信息
		$scope.fragment = {};
		$scope.fragment.price = {};
		$scope.fragment.canAdd = true;

		$scope.changeCurrency = changeCurrency;
		$scope.choosePrice = choosePrice;

		$scope.addNum = addNum;
		$scope.subNum = subNum;
		$scope.inputNum = inputNum;
		$scope.$$commodity = {};

		activate();

		////////////

		function activate() {
			if (!batchCode) {
				return ;
			}
			// 根据商品批次号获取商品信息以及器件信息
			Commodity.findByBatchCode({ batchCode : batchCode}, function(goods) {
				// 初始化商品价格信息
				$scope.commodity = goods;
				console.log(goods);
				$scope.fragment.num = goods.minBuyQty || 0;
				$scope.fragment.prices = goods.prices && goods.prices.length > 0 ? goods.prices[0] : {};
				if(goods.currencyName != 'USD') {
					$scope.fragment.currency = 'RMB';
				}else {
					$scope.fragment.currency = 'USD';
				}
				if($scope.fragment.currency != 'USD') {
					$scope.fragment.price = $scope.fragment.prices.rMBPrice || 0;
				}else {
					$scope.fragment.price = $scope.fragment.prices.uSDPrice || 0;
				}
				acculate();
				// 初始化器件属性信息
				Commodity.findComponentByUuid({ componentUuid : goods.uuid }, function (component) {
					console.log(component);
					$scope.$$commodity.noProperty = true;
					if (component) {
						$scope.component = component;
						if($scope.component.properties && $scope.component.properties.length != 0) {
							for(var i = 0; i < $scope.component.properties.length; i++) {
								var  property = $scope.component.properties[i];
								if(property.value) {
									$scope.$$commodity.noProperty = false;
								}
							};
						}
					} else {
						$scope.component = {};
					}
				}, function () {
					$scope.component = {};
				});
			});
		}

		/**
		 * 修改币别
		 */
		function changeCurrency() {
			$scope.choosePrice();
			acculate();
		}

		/**
		 * 选择对应币别的价格
		 */
		function choosePrice() {
			switch ($scope.fragment.currency) {
				case 'RMB':
					$scope.fragment.price = $scope.fragment.prices.rMBPrice;
					break;
				case 'USD':
					$scope.fragment.price = $scope.fragment.prices.uSDPrice;
				default :
				//TODO 弹出错误的信息
			}
		}

		/**
		 * 增加数量
		 */
		function addNum() {
			var incresed = parseInt($scope.fragment.num) + parseInt($scope.commodity.minPackQty)
			if(incresed <= $scope.commodity.reserve) {
				$scope.fragment.num = incresed;
			}else {
				$scope.fragment.canAdd = false;
			}
			$scope.fragment.canSub = true;
			getFragment();
			acculate();
		}

		/**
		 * 减去数量
		 */
		function subNum() {
			var incresed = parseInt($scope.fragment.num) - parseInt($scope.commodity.minPackQty)
			if(incresed >= $scope.commodity.minBuyQty) {
				$scope.fragment.num = incresed;
			}else {
				$scope.fragment.canSub = false;
			}
			$scope.fragment.canAdd = true;
			getFragment();
			acculate();
		}

		/**
		 * 输入数量
		 */
		function inputNum() {
			if($scope.fragment.num < $scope.commodity.minBuyQty) {
				$scope.fragment.num = $scope.commodity.minBuyQty;
			}else if($scope.fragment.num > $scope.commodity.reserve) {
				$scope.fragment.num = $scope.commodity.reserve;
			}
			getFragment();
			acculate();
		}

		/**
		 * 获取分段的数量
		 */
		function getFragment() {
			//判断是否小于第一分段的起订量
			if($scope.commodity.prices[0].start > $scope.fragment.num) {
				$scope.fragment.num = $scope.commodity.prices[0].start;
			}
			//获取分段的信息。
			var prices = $scope.commodity.prices;
			for (var i = 0; i< prices.length; i++) {
				if($scope.fragment.num <= prices[i].end ) {
					$scope.fragment.prices = prices[i];
					break;
				}
			}
			$scope.choosePrice();
		}

		/**
		 * 计算总金额
		 */
		function acculate() {
			$scope.fragment.total = NumberService.mul($scope.fragment.price ,$scope.fragment.num);
			$scope.fragment.total = NumberService.toCeil($scope.fragment.total, 2);
		}
	}]);
});

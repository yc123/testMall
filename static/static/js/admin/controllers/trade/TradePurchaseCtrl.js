define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('TradePurchaseCtrl', ['$scope', 'ngTableParams', 'BaseService', 'SessionService' ,'Purchase', 'toaster', '$stateParams', '$state', '$filter', function($scope, ngTableParams, BaseService, SessionService ,Purchase, toaster, $stateParams, $state, $filter) {
		
		//如果window.sessionStorage 有值，就设置为当前的active值
		$scope.active = SessionService.get('adminPurcState')? SessionService.get('adminPurcState'):'inbound';
		$scope.localInfo = {};

		// 加密订单的ID过滤器
		var enIdFilter = $filter('EncryptionFilter');
		
		/*
		 * 待出货（inbound）按钮下显示待出货（406）、待收货（404）两种状态的采购单，
		 * 已收货（received）按钮下显示已出货（405）状态的采购单,
		 * 待付款（tobepaid）按钮下显示待付款（503）状态的采购单，
		 * 已付款（paid）按钮下显示已付款（504）状态的采购单
		 */
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'tobeconfirmed' :
					state = '501'; break;
				case 'tobeshipped' :
					state = '406'; break;
				case 'inbound' :
					state = '404'; break;
				case 'received' :
					state = '405'; break;
				case 'tobepaid' :
					state = '503'; break;
				case 'paid' : 
					state = '504'; break;
				case 'notsettled' :
					state = '514'; break;
				case 'completed' :
					state = '520'; break;
			}
			return state;
		};
		
		$scope.setActive = function(state) {
			SessionService.set('adminPurcState',state);
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.purchaseTableParams.page() == 1)
				$scope.purchaseTableParams.reload();
			else
				$scope.purchaseTableParams.page(1);
		};
		
		$scope.purchaseTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				createtime: 'DESC'
			}
		}, {
			total : 0,
			counts: [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = getState();
				Purchase.getAdminPurchases(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
		
		//根据采购单号搜索采购单
		$scope.onSearch = function() {
			$scope.purchaseTableParams.reload();
		};
		
		$scope.exApply = function(puid) {
			$state.go('exceptionApply', {purchaseid : enIdFilter(puid)});
		};

		/**
		 * 获取当前需要下载的订单信息的ID
		 */
		var getDownLoadPurchaseId = function() {
			var purchaseID = [];
			angular.forEach($scope.purchaseTableParams.data, function (pur) {
				purchaseID.push(pur.id);
			});
			return purchaseID;
		};

		/**
		 * 下载当前页的订单信息
		 */
		$scope.downPurchase = function () {
			var listId = getDownLoadPurchaseId();
			if(listId.length < 1) {
				toaster.pop('warning', '当前需要下载的订单条数为0');
				return ;
			}
			$scope.localInfo.ids = listId.join("-");
			$scope.$apply();
			var form = document.getElementById('down-load-purchase');
			form.action = 'trade/purchase/down/ids';
			form.submit();
			var clockID = null;
			var getDownLoadStatus = function () {
				$.ajax({
					url : 'trade/purchase/down/ids',
					data : {isAjax : true, ids : $scope.localInfo.ids},
					method : 'GET',
					dataType : 'json',
					success : function (data) {
						if(data.loading) {
							clockID = setInterval(function() {
								getDownLoadStatus()
							}, 500);
						}else {
							$scope.$apply(function () {
								toaster.pop('info', '数据处理完毕，正在下载文件，请稍等。');
							});
							if(!clockID) {
								clearInterval(clockID);
							}
						}
					},
					error : function () {
						if(!clockID) {
							clearInterval(clockID);
						}
					}
				});
			};
			getDownLoadStatus();
		};


		/**
		 * 付款全部在供应商结算模块，此部分暂时注释
		 */
/*		$scope.ensurePaid = function(purchase) {
			Purchase.ensurePaid({id: purchase.id}, {}, function(data){
				toaster.pop('success', '处理成功', '付款成功');
				$scope.purchaseTableParams.reload();
			}, function(res){
				
			})
		}*/
		
	}]);
});
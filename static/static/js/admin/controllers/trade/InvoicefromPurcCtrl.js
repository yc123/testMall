define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('InvoicefromPurcCtrl', ['$scope', '$anchorScroll', '$location' , 'ngTableParams', 'InvoiceFPurchase','SessionService' , 'BaseService', 'Purchase' , 'toaster', '$stateParams', function($scope, $anchorScroll, $location , ngTableParams, InvoiceFPurchase , SessionService , BaseService, Purchase ,toaster, $stateParams) {
		//这里是需要立马处理的单据，如果积压超过1000张都是不正常的，所以后台是一次加载所有的分类，直接前端搜索
		
		//如果window.sessionStorage 有值，就设置为当前的active值
		$scope.active = SessionService.get('adminInvoiceFmpuState')? SessionService.get('adminInvoiceFmpuState'):'inbound';
		
		/*
		 * 待收货（inbound）按钮下显示待出货（406）和待收货（404）状态的卖家出货单，
		 * 已收货（received）按钮下显示已收货（405）状态的卖家出货单，
		 * 待收款（toreceivemoney）按钮下显示待收款（506）状态的卖家出货单，
		 * 已收货（moneyreceived）按钮下显示已收货（505）状态的卖家出货单，
		 */
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'tobeconfirmed':
					state = '501'; break;
				case 'tobeshipped':
					state = '406'; break;
				case 'inbound' :
					state = '404'; break;
				case 'received' :
					state = '405'; break;
				case 'toreceivemoney' :
					state = '506'; break;
				case 'moneyreceived' : 
					state = '505'; break;			
			}
			return state;
		};
		
		$scope.setActive = function(state) {
			SessionService.set('adminInvoiceFmpuState',state);
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.invoiceForPuTableParams.page() == 1)
				$scope.invoiceForPuTableParams.reload();
			else
				$scope.invoiceForPuTableParams.page(1);
		};
		
		$scope.invoiceForPuTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				creattime: 'DESC'
			}
		}, {
			total : 0,
			counts: [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = getState();
				InvoiceFPurchase.getAdminInFpu(param, function(page) {
					//将数据清零
					clearchecked();
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
						//备份一份，因为需要修改从后台传输过来的数据，所以做一个备份。
						//那就只修改这个备份的数据,原数据不做改变
						$scope.localOrder = angular.copy(page.content);
						var orderCount = $scope.localOrder.length;
						if(orderCount != 0) {
							angular.forEach($scope.localOrder, function(value, key){
								//给checkCodes数组赋初始值
								if($scope.checkCodes.length < orderCount) {
									$scope.checkCodes.push(false);
								}
							});
						}
						$scope.count = 0;
					}
				});
			}
		});

		//根据采购单号搜索采购单
		$scope.onSearch = function() {
			$scope.invoiceForPuTableParams.reload();
		}
		
		//平台确定收货
		$scope.ensureAccept = function(invoice) {
			InvoiceFPurchase.ensurereceipt({invoiceid:invoice.invoiceid}, {}, function() {
				toaster.pop('success', '处理成功', '平台确认收货');
				$scope.invoiceForPuTableParams.reload();
				$scope.invoiceForPuTableParams.page(1);
			}, function(res){
				toaster.pop('error', '失败' ,res.data);
			});
		}
		
		//平台批量确定收货
		$scope.batchEnsureAccept = function(invoice) {
			if(invoice) {
				$scope.batchInvoice = [];
				$scope.batchInvoice.push(invoice);
			}else {
				$scope.batchInvoice = $scope.getBatch();
			}
			var invoiceId = [];
			angular.forEach($scope.batchInvoice, function(invoice) {
				invoiceId.push(invoice.invoiceid);
			});
			InvoiceFPurchase.batchEnsureAccept({invoiceids:invoiceId}, null, function() {
				toaster.pop('success', '处理成功', '平台确认收货');
				$scope.invoiceForPuTableParams.reload();
				$scope.invoiceForPuTableParams.page(1);
			}, function(res){
				toaster.pop('error', '失败了！');
			});
		}
		
		/**
		 * TODO 全选操作开始
		 **/
		//将数据清零
		var clearchecked = function () {
			$scope.checks = {
					checked : false
				};
			$scope.checkCodes = [];
		}
		
		//控制变量
		$scope.checkCodes = [];
		
		$scope.checks = {
				checked : false
			};
		
		// 点击勾选Code全部的复选框
		$scope.checkAll = function() {
			if($scope.checks.checked) {
				$scope.count = $scope.localOrder.length;
			}else {
				$scope.count = 0;
			}
			angular.forEach($scope.checkCodes, function(item, key) {
				$scope.checkCodes[key] = $scope.checks.checked;
			});
		};
		
		//点击Code单选
		$scope.checkOne = function(index) {
			var result = true;
			if($scope.checkCodes[index]) {
				$scope.count++;
			}else {
				$scope.count--;
			}
			angular.forEach($scope.checkCodes, function(item,key) {
				if(!item){
					result = false;
					return;
				}
			});
			$scope.checks.checked = result;
		}
		
		/*已出货 转出货单的代码*/
		$scope.getBatch = function() {
			var batchInvoice = [];
			for (var i = 0; i < $scope.checkCodes.length; i++) {
				if($scope.checkCodes[i]) {
					batchInvoice.push($scope.localOrder[i]);
				};
			}
			return batchInvoice;
		}
		
	}]);
});
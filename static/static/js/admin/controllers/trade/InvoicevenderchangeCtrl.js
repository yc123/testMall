define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('InvoicevenderchangeCtrl', ['$scope', '$anchorScroll', '$location' , 'ngTableParams', 'Invoice','SessionService' , 'BaseService', 'Purchase' , 'toaster', '$stateParams', function($scope, $anchorScroll, $location , ngTableParams, Invoice , SessionService , BaseService, Purchase ,toaster, $stateParams) {
		//这里是需要立马处理的单据，如果积压超过1000张都是不正常的，所以后台是一次加载所有的分类，直接前端搜索
		
		//如果window.sessionStorage 有值，就设置为当前的active值
		$scope.active = SessionService.get('adminInvoicevechState')? SessionService.get('adminInvoicevechState'):'inbound';
		
		/*
		 * 待收货（inbound）按钮下显示待出货（406）和待收货（404）状态的卖家出货单，
		 * 已收货（received）按钮下显示已收货（405）状态的卖家出货单，
		 * 待收款（toreceivemoney）按钮下显示待收款（506）状态的卖家出货单，
		 * 已收货（moneyreceived）按钮下显示已收货（505）状态的卖家出货单，
		 */
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
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
			SessionService.set('adminInvoicevechState',state);
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.invoiceForChTableParams.page() == 1)
				$scope.invoiceForChTableParams.reload();
			else
				$scope.invoiceForChTableParams.page(1);
		};
		
		$scope.invoiceForChTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				createtime: 'DESC'
			}
		}, {
			total : 0,
			getData : function($defer, params) {
				$scope.loading = true;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = getState();
				Invoice.getAdminInFch(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});

		//根据出货单号搜索出货单
		$scope.onSearch = function() {
			$scope.invoiceForChTableParams.reload();
		}
		
		//平台确定收货
		$scope.ensureAccept = function(invoice) {
			Invoice.ensurereceipt({inid:invoice.id}, {}, function() {
				$scope.invoiceForChTableParams.page(1);
				$scope.invoiceForChTableParams.reload();
				toaster.pop('success', '处理成功', '平台确认收货');
			}, function(response){
				toaster.pop('error', '收货失败，' + response.data);
			});
		}
		
	}]);
});
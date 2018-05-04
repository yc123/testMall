define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('ChangefromcustCtrl', ['$scope', '$anchorScroll' ,'BaseService' ,'Change','ngTableParams' , 'SessionService' ,'toaster', '$stateParams', function($scope, $anchorScroll , BaseService , Change ,ngTableParams, SessionService ,toaster, $stateParams) {
		//这里是需要立马处理的单据，如果积压超过1000张都是不正常的，所以后台是一次加载所有的分类，直接前端搜索
		
		//如果window.sessionStorage 有值，就设置为当前的active值
		$scope.active = SessionService.get('adminChangefmcState')? SessionService.get('adminChangefmcState'):'tobesihpback';
		
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'tobeshipback' :
					state = '409'; break;
				case 'inspecting' :
					state = '410'; break;
				case 'toBeShipped':
					state = '406'; break;
				case 'shipped' :
					state = '407'; break;
				case 'inbound' :
					state = '404'; break;
			}
			return state;
		};
		
		$scope.onSearch = function() {
			$scope.changefmcustTableParams.reload();
		};
		
		$scope.changefmcustTableParams = new ngTableParams({
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
				Change.getIndividualfcust(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
		
		$scope.setActive = function(state) {
			SessionService.set('adminChangefmcState',state);
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.changefmcustTableParams.page() == 1)
				$scope.changefmcustTableParams.reload();
			else
				$scope.changefmcustTableParams.page(1);
		};
		/**
		 * 审核客户退货单
		 */
		$scope.auditChange = function(custchange,boo) {
			var json = {
						changeid:custchange.id,
						boo:boo
						};
			Change.auditChange(null,json,function(data) {
				$scope.changefmcustTableParams.reload();
				toaster.pop('success', '处理成功', '平台审核成功');
			},function(response) {
				toaster.pop('error', '审核失败 ' + response.data);
			})
		};
		/**
		 * 平台确认收货
		 */
		$scope.ensureAccept = function(custchange) {
			Change.ensureAccept({changeid:custchange.id},null,function(data) {
				$scope.changefmcustTableParams.reload();
				toaster.pop('success', '处理成功', '平台收货成功');
			},function() {
				toaster.pop('error', '收货失败');
			})
		};
		
		/**
		 * 转换货出货单单
		 */
		$scope.changeInvoice = function(change) {
			Change.ensureSend({changeid:change.id}, null, function(data) {
				$scope.changefmcustTableParams.page(1);
				$scope.changefmcustTableParams.reload();
				toaster.pop('success', '处理成功', '发货成功');
			},function(response) {
				toaster.pop('error', '发货失败, ' + response.data);
			})
		}
		
	}]);
});
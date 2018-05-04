define(['app/app'], function(app) {
	'use strict';
	app.register.controller('refundCtrl', ['$scope', 'ngTableParams', 'refundService', 'toaster', 'BaseService', function($scope, ngTableParams, refundService, toaster, BaseService) {
		$scope.active = 'toberefund';
		
		$scope.setActive = function(status) {
			$scope.active = status;
			$scope.refundTable.page(1);
			$scope.refundTable.reload();
		};
		
		$scope.refundTable = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				createTime : 'DESC'
			}
		}, {
			total : 0,
			counts : [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.status = $scope.active;
				refundService.getRefundAllByB2C(param, function(page) {
					if(page.content) {
						$defer.resolve(page.content);
						params.total(page.totalElements);
					}
				}, function(response) {
					toaster.pop('error', '获取信息错误 ' + response.data);
				});
			}
		});
		
		$scope.ensureRefund = function(refund) {
			if(!refund) {
				toaster.pop('info', "请选择相应的退款单");
				return;
			}

			if (refund.payType == 1102) {
				refundService.handleRefund({reid : refund.reid}, function() {
					toaster.pop('success', '退款成功');
					$scope.refundTable.page(1);
					$scope.refundTable.reload();
				}, function(response) {
					toaster.pop('error', '退款失败' + response.data);
				});
			} else if (refund.payType == 1103) {
				refundService.handleOfflineRefund({reid : refund.reid}, null, function (req) {
					if (req.data == 'success') {
						$scope.refundTable.page(1);
						$scope.refundTable.reload();
					}
				}, function (resp) {
					toaster.pop('error', '退款失败' + resp.data);
				});
			}
			

		}
	}]);
});
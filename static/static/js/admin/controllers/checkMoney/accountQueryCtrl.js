define(['app/app'], function(app) {
	'use strict';
	app.register.controller('accountQueryCtrl', ['$scope', 'Ysepay' ,  function($scope, Ysepay) {
		
		$scope.refund_oderid = '';
		$scope.orderQuery_oderid = '';
		$scope.refundQuery_oderid = '';
		
		Ysepay.accountSign({}, {}, function (data){
			$scope.accountInfo = angular.fromJson(data.accountInfo);
		},function(res){
			toaster.pop('error', '获取银盛支付请求参数错误');
		});
		
		
		// 此部分功能暂时不显示
		// 退款
		$scope.refund = function(){
			Ysepay.refundSign({orderid:$scope.refund_oderid},{},function(data) {
				$scope.refundInfo = angular.fromJson(data.refundInfo);
			},function(res){
				toaster.pop('error', '获取银盛支付请求参数错误');
			});
		}
		
		// 查询单个订单
		$scope.orderQuery = function(){
			Ysepay.orderQuerySign({orderid:$scope.orderQuery_oderid},{},function(data) {
				$scope.orderQueryInfo = angular.fromJson(data.orderQueryInfo);
			},function(res){
				toaster.pop('error', '获取银盛支付请求参数错误');
			});
		}
		
		// 查询单个退款订单
		$scope.refundQuery = function(){
			Ysepay.refundQuerySign({orderid:$scope.refundQuery_oderid},{},function(data) {				
				$scope.refundQueryInfo = angular.fromJson(data.refundQueryInfo);
			},function(res){
				toaster.pop('error', '获取银盛支付请求参数错误');
			});
		}
		
	}]);
});
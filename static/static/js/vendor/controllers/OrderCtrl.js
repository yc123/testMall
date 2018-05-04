define([ 'app/app'], function(app) {
	'use strict';
	app.register.controller('OrderCtrl', ['$scope', 'toaster', 'InvoiceFPurchase', 'ChineseToPinYin', 'Order' , '$modal', 'BaseService' , 'ngTableParams' , '$stateParams', 'ComponentActive', function($scope, toaster, InvoiceFPurchase, ChineseToPinYin, Order , $modal, BaseService , ngTableParams , $stateParams, ComponentActive) {
		BaseService.scrollBackToTop();
		
		//如果window.sessionStorage 有值，就设置为当前的active值
		$scope.active = window.sessionStorage.getItem('purchaseState')? window.sessionStorage.getItem('purchaseState'):'tobeshipped';
		var loadData = function(){
			switch($scope.active) {
				case 'all' : 
					break;
				case 'tobepurcchange' : 
					Order.shippingin({}, function(data){
						$scope.orders = data;
					}, function(res){
						
					});break;
				case 'tobeshipped' : 
					Order.tobeshipped({}, function(data){
						$scope.orders = data;
					}, function(res){
						
					});break;
				case 'tobepaid' : 
					Order.tobepaid({}, function(data){
						$scope.orders = data;
					}, function(res){
						
					});break;
				case 'inbound' : 
					Order.inbound({}, function(data){
						$scope.orders = data;
					}, function(res){
						
					});break;
			}
		};
		//这里是需要立马处理的单据，如果积压超过1000张都是不正常的，所以后台是一次加载所有的分类，直接前端搜索
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'all' : 
					break;
				case 'tobeshipped' :
					state = 'tobeshipped'; break;
				case 'tobepaid' : 
					state = 'tobepaid'; break;
				case 'inbound' :
					state = 'inbound'; break;
			}
			return state;
		};
		
		$scope.setActive = function(state) {
			window.sessionStorage.setItem('adminOrderState',state);
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.orderTableParams.page() == 1)
				$scope.orderTableParams.reload();
			else
				$scope.orderTableParams.page(1);
		};
		
		$scope.orderTableParams = new ngTableParams({
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
				Order[getState()].call(null, param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});

		//确认发货
		$scope.send = function(invoice){
			InvoiceFPurchase.send({inid: invoice.id}, {}, function(data){
				toaster.pop('success', '处理成功', '【' + data.invoiceid + '】' + '确认发货成功');
				$scope.orderTableParams.reload();
			}, function(res){
				
			})
		};
		
	}]);
	
});
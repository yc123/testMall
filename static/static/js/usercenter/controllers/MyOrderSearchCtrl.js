define([ 'app/app' ], function(app) {
	app.register.controller('MyOrderSearchCtrl', ['$scope', 'ngTableParams', 'BaseService', '$stateParams', 'Return' , 'Change' ,'SessionService', 'toaster', function($scope, ngTableParams, BaseService, $stateParams, Return , Change , SessionService, toaster) {
		BaseService.scrollBackToTop();
		
		//保存历史点击
		$scope.active = SessionService.get('custReturnState') ? SessionService.get('custReturnState'):'tobeshippedback';
		
		$scope.setActive = function(state) {
			SessionService.set('custReturnState',state);
			if($scope.active != state) {
				$scope.active = state;
				loadData();
			}
		};
		//这里要做到，先判断是否有退货单或者换货单，在考虑显示
		var loadData = function(){
			$scope.hasReturns = false;
			Return.hasReturns({}, function(data){
				if(data.data == "success") {
					$scope.hasReturns = true;
				}
			}, function(res){
				
			})
			switch($scope.active) {
				case 'all' : 
					break;
				case 'unaudit' : 
					Return.getOnesUnaudit({}, function(data){
						$scope.returns = data;
					}, function(res){
						
					});break;
				case 'tobeshippedback' : 
					Return.getOnesTobeshippedback({}, function(data){
						$scope.returns = data;
					}, function(res){
						
					});break;
				case 'toreceivemoney' ://TODO 这里的待退款指的是验货中到待退款三个状态
					Return.getOnesToreceivemoney({}, function(data){
						$scope.returns = data;
					}, function(res){
						
					});break;
				case 'moneyreceived' :
					Return.getOnesMoneyreceived({}, function(data){
						$scope.returns = data;
					}, function(res){
					
					});break;
			}
		};
		
		loadData();
		
		$scope.afterSale = function(returns) {
			Return.sendReturn({returnid:returns.id},null,function(data) {
				$scope.active = 'toreceivemoney';
				loadData();
				toaster.pop('success', '发货成功!');
			}, function(res){
				
			})
		}
		/* 换货开始  */
		$scope.activeCopy = SessionService.get('custReturnState') ? SessionService.get('custReturnState'):'tobeshippedback';
		
		$scope.setActiveCopy = function(state) {
			SessionService.set('custChangeState',state);
			if($scope.activeCopy != state) {
				$scope.activeCopy = state;
				loadData();
			}
		};
		var loadDataCopy = function(){
			$scope.hasChanges = false;
			Change.hasChanges({}, function(data){
				if(data.data == "success") {
					$scope.hasChanges = true;
				}
			}, function(res){
				
			})
			switch($scope.activeCopy) {
				case 'all' : 
					break;
				case 'unaudit' : 
					Change.getOnesUnaudit({}, function(data){
						$scope.changes = data;
					}, function(res){
						
					});break;
				case 'tobeshippedback' : 
					Change.getOnesTobeshippedback({}, function(data){
						$scope.changes = data;
					}, function(res){
						
					});break;
				case 'toreceivemoney' ://TODO 这里的待退款指的是验货中到待退款三个状态
					Change.getOnesToreceivemoney({}, function(data){
						$scope.changes = data;
					}, function(res){
						
					});break;
				case 'moneyreceived' :
					Change.getOnesMoneyreceived({}, function(data){
						$scope.changes = data;
					}, function(res){
					
					});break;
			}
		};
		
		loadDataCopy();
		
		/**
		 * 客户发换货单
		 */
		$scope.sendChange = function(change) {
			Change.sendChange({changeid:change.id},null,function(data) {
//				$scope.active = 'toreceivemoney';
				loadDataCopy();
				toaster.pop('success', '发货成功!');
			}, function(res){
				
			})
		}
		
	}]);
	
});
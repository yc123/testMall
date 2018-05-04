define(['app/app'], function(app) {
	'use strict'
	app.register.controller('ReviewerEmailInfoCtrl', ['$scope', '$modal', 'ReviewerEmailInfo', 'toaster', function($scope, $modal, ReviewerEmailInfo, toaster) {
		
		//获取所有审核人邮箱信息
		var getMailInfo = function() {
			$scope.MailInfo = [];
			ReviewerEmailInfo.getMailInfo({}, {}, function(data) {
				$scope.MailInfo = data;
			}, function(res) {
				
			});
		}
		getMailInfo();
		
		//增加审核人邮箱
		$scope.addMailInfo = function() {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl : 'static/view/admin/customService/modal/addMailInfo.html',
				controller : 'addMailInfoCtrl',
				resolve : {

				}
			});
			
			modalInstance.result.then(function(response) {
                getMailInfo();
			}, function() {
				
			});
		}
		
		//修改信息
		$scope.editMailInfo = function(info) {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl : 'static/view/admin/customService/modal/editMailInfo.html',
				controller : 'editMailInfoCtrl',
				resolve : {
					MailInfo : function() {
						return info;
					}
				}
			});
			
			modalInstance.result.then(function(mailInfo) {
				
			}, function(){
				
			});
		}
		
		//删除信息
		$scope.deleteMailInfo = function(info, index) {
			$scope.info = info;
			$scope.id = info.id;
			console.log($scope.id);
			ReviewerEmailInfo.deleteMailInfo({id: info.id}, function(data) {
				toaster.pop('success', '提示', '信息删除成功');
				$scope.MailInfo.splice(index, 1);
			}, function(response) {
				toaster.pop('error', '提示', '信息删除失败');
			});
		}
	}]);
	
	app.register.controller('addMailInfoCtrl',['$scope', '$modalInstance', 'ReviewerEmailInfo', 'toaster', function($scope, $modalInstance, ReviewerEmailInfo, toaster) {
		$scope.saveMailInfo = function(userName, userEmail) {
			ReviewerEmailInfo.saveMailInfo({userName: userName, userEmail: userEmail}, {}, function(data) {
				toaster.pop('success', '提示', '信息保存成功');
				$modalInstance.close(userName, userEmail);
			}, function(response) {
				toaster.pop('error', '提示', '信息保存失败');
			});
		}
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
	}]);
	
	app.register.controller('editMailInfoCtrl',['$scope', '$modalInstance', 'ReviewerEmailInfo', 'MailInfo', 'toaster', function($scope, $modalInstance, ReviewerEmailInfo, MailInfo, toaster) {
		$scope.MailInfo = MailInfo;
		$scope.saveMailInfo = function(userName, userEmail) {
			ReviewerEmailInfo.updateMailInfo({id: MailInfo.id, userName: MailInfo.username, userEmail: MailInfo.useremail}, {}, function(data) {
				toaster.pop('success', '提示', '信息更新成功');
				$modalInstance.close(userName, userEmail);
			}, function(response) {
				toaster.pop('error', '提示', '信息更新失败');
			});
		}
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
	}]);
})
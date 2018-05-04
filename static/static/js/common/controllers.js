define([ 'angular', 'ui-bootstrap' ], function(angular) {
	angular.module('common.controllers', ['ui.bootstrap', 'common.tpls']).controller('ModalCtrl', ['$scope', '$modal', function($scope, $modal) {
		$scope.open = function (modalParams, size) {
		    $modal.open({
		      templateUrl: 'common/template/modal.html',
		      controller: ModalInstanceCtrl,
		      size: size,
		      resolve: {
		    	  modalParams: modalParams
		      }
		    });
		  };
	}]).controller('ModalInstanceCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance){
		$scope.ok = function () {
		    $modalInstance.close();
		  };
		  $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		  };
	}]);
	
	angular.module("common.tpls", ["common/template/modal.html"]);
	angular.module("common/template/modal.html", []).run(["$templateCache", function($templateCache) {
		  $templateCache.put("common/template/modal.html",
			"<div class=\"modal-header\">" +
				  		"<h3 class=\"modal-title\">{{modalParams.title}}</h3>" + 
			"</div>" +
			"<div class=\"modal-body\">" +
				  		"{{modalParams.content}}" +
			"</div>" +
			"<div class=\"modal-footer\">" +
				  	"<button class=\"btn btn-primary\" ng-click=\"ok()\">确定</button>" +
				  	"<button class=\"btn btn-warning\" ng-click=\"cancel()\">取消</button>" +
		  	"</div>");
	}]);
});
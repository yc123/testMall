define([ 'app/app' ], function(app) {
    // 器件审批
    app.register.controller('vendorComponentBatchApplyListCtrl', ['$scope', 'ngTableParams', 'BaseService', 'ComponentSubmit', function($scope, ngTableParams, BaseService, ComponentSubmit) {
        BaseService.scrollBackToTop();
        document.title = '器件申请-优软商城';
        $scope.active = 'all';

        $scope.setActive = function(result) {
            $scope.active = result;
            console.log($scope.active);
            $scope.componentTableParams.reload();
        }

        var getStatus = function() {
            var result;
            switch($scope.active) {
                case 'all':
                    result = 'allBatch'; break;
                case 'unAuditedBatch':
                    result = 'unAuditedBatch'; break;
                case 'passBatch':
                    result = 'passBatch'; break;
                case 'forbiddenBatch':
                    result = 'forbiddenBatch'; break;
                default :
                    result = 'unAuditedBatch';
            }
            return result;
        }

        $scope.componentTableParams = new ngTableParams({
            page : 1,
            count : 10,
            sorting : {
                createDate: 'DESC'
            }
        }, {
            total : 0,
            counts: [10, 25, 50, 100],
            getData : function($defer, params) {
                $scope.paginationParams = params;
                var param = BaseService.parseParams(params.url());
                param.keyword = $scope.keyword;
                ComponentSubmit[getStatus()].call(null, param, function(page) {
                    if (page) {
                        params.total(page.totalElements);
                        $defer.resolve(page.content);
                    }
                }, function(){

                });
            }
        });

        $scope.onSearch = function() {
            $scope.componentTableParams.page(1);
            $scope.componentTableParams.reload();
        }
    }]);
});
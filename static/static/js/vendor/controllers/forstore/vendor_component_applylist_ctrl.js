define([ 'app/app' ], function(app) {
    // 器件审批
    app.register.controller('vendorComponentApplyListCtrl', ['$scope', 'ngTableParams', 'ComponentsSubmit', 'BaseService', '$stateParams', 'AuthenticationService', function($scope, ngTableParams, ComponentsSubmit, BaseService, $stateParams, AuthenticationService) {
        BaseService.scrollBackToTop();
        document.title = '器件申请-优软商城';
        var loadMyComponentsSubmit = function(){
            $scope.componentTableParams = new ngTableParams({
                page : 1,
                count : 10,
                sorting : {
                    lastModifyDate: 'DESC'
                }
            }, {
                total : 0,
                counts: [10, 25, 50, 100],
                getData : function($defer, params) {
                    $scope.paginationParams = params;
                    var param = BaseService.parseParams(params.url());
                    param.modifyuu = $scope.uu;
                    param.keyword = $scope.keyword;
                    ComponentsSubmit.get(param, function(page) {
                        if (page) {
                            params.total(page.totalElements);
                            $defer.resolve(page.content);
                        }
                    }, function(){

                    });
                }
            });
        };

        $scope.active = 'tobeAudit';

        $scope.setActive = function(result) {
            $scope.active = result;
            $scope.componentTableParams.reload();
        };

        AuthenticationService.getAuthentication().success(function(data){
            $scope.uu = data.userUU;
            loadMyComponentsSubmit();
        });

        $scope.onSearch = function() {
            $scope.componentTableParams.page(1);
            $scope.componentTableParams.reload();
        }

    }]);
});
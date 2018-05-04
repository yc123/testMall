/**
 * Created by wangyc on 2017/3/31.
 */
define(['app/app'], function(app) {
    "use strict";
    app.register.controller('vendorBrandApplyListCtrl', ['$scope', '$rootScope', 'AuthenticationService', 'BaseService', 'BrandsSubmit', 'ngTableParams', function ($scope, $rootScope, AuthenticationService, BaseService, BrandsSubmit, ngTableParams) {
        document.title = "品牌申请" + "-优软商城";
        $rootScope.active = 'vendor_brand_apply';
        var loadMyBrandsSubmit = function(){
            $scope.brandTableParams = new ngTableParams({
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
                    param.keyword = $scope.keyword;
                    param.modifyuu = $scope.uu;
                    // param.status = getStatus();
                    BrandsSubmit.get.call(null, param, function(page) {
                        if (page) {
                            params.total(page.totalElements);
                            $defer.resolve(page.content);
                        }
                    }, function(){

                    });
                }
            });
        };

        AuthenticationService.getAuthentication().success(function(data){
            $scope.uu = data.userUU;
            loadMyBrandsSubmit();
        });

        $scope.onSearch = function() {
            $scope.brandTableParams.page(1);
            $scope.brandTableParams.reload();
        }
    }]);
});
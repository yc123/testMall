define(['angular', 'ui-bootstrap', 'ngResource'], function (angular) {
    'use strict';
    angular.module('common.query.user', ['ui.bootstrap', 'ngResource']).factory('UserService', ['$modal', function ($modal) {
        return {
            open: function (enterprise) {
                var modalInstance = $modal.open({
                    templateUrl: 'static/view/common/query/user.html',
                    controller: 'UserQueryCtrl',
                    backdrop: "static",
                    resolve: {
                        enterprise: function () {
                            return enterprise;
                        }
                    },
                    windowClass: 'modal-large'
                });
                return modalInstance;
            }
        };
    }]).controller('UserQueryCtrl', ['$scope', '$modalInstance', '$http', '$filter', 'enterprise', 'ngTableParams', function ($scope, $modalInstance, $http, $filter, enterprise, ngTableParams) {
        $scope.enterprise = enterprise;

        $scope.tableParams = new ngTableParams({
            page: 1,
            total: 1,
            count: 500,
            sorting: {
                'userName': 'asc'
            },
            filter: {
                'enabled': 1
            }
        }, {
            groupBy: 'role',
            counts: [],
            getData: function ($defer, params) {
                $http.get('user/' + enterprise.uu + '/users').success(function (users) {
                    if (users) {
                        var data = params.filter() ? $filter('filter')(users, params.filter()) : users;
                        params.total(data.length);
                        data = params.sorting() ? $filter('orderBy')(data, $scope.tableParams.orderBy()) : data;
                        $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                }).error(function () {

                });
            }
        });

        // 关闭模态窗
        $scope.close = function () {
            $modalInstance.close();
        };
        // 选中user
        $scope.select = function (user) {
            $modalInstance.close(angular.copy(user));
        };
    }]).factory('User', ['$resource', function ($resource) {
        return $resource('basic/user/personal', {}, {
            postImageUrl: {
                url: 'basic/user/setImageUrl',
                method: 'POST'
            },
            getUser: {
                method: 'GET'
            },
            getUserByUU: {
                url: 'basic/user/getUserByUU',
                method: 'GET'
            },
            checkPassword: {
                url: 'basic/user/checkPassword',
                method: 'GET'
            },
            updatePassword: {
                url: 'basic/user/updatePassword',
                method: 'POST'
            },
            update: {
                url: 'basic/user',
                method: 'PUT'
            },
            checkUserEmail: {
                url: 'basic/user/checkUserEmail',
                method: 'GET'
            },
            isDevOrProd: {
                url: 'basic/user/isDev',
                method : 'GET'
            },
            sendCheckCode: {
                url: 'basic/user/sendCheckCode',
                method: 'GET'
            },
            emailEnable: {
                url: 'basic/user/emailEnable',
                method: 'GET'
            },
            validCheckCode: {
                url: 'basic/user/validCheckCode',
                method: 'GET'
            },
            updateUserEmail: {
                url: 'basic/user/updateUserEmail',
                method: 'POST'
            },
            checkUserTel: {
                url: 'basic/user/checkUserTel',
                method: 'GET'
            },
            telEnable: {
                url: 'basic/user/telEnable',
                method: 'GET'
            },
            getPageToken: {
                url: 'basic/user/getPageToken',
                method: 'GET'
            },
            sendTelCheckCode: {
                url: 'basic/user/sendTelCheckCode',
                method: 'GET'
            },
            validTelCheckCode: {
                url: 'basic/user/validTelCheckCode',
                method: 'GET'
            },
            updateUserTel: {
                url: 'basic/user/updateUserTel',
                method: 'POST'
            },
            checkHaveUserPay: {
                url: 'basic/user/checkHaveUserPay',
                method: 'GET'
            },
            checkUserPay: {
                url: 'basic/user/checkUserPay',
                method: 'GET'
            },
            updateUserPay: {
                url: 'basic/user/updateUserPay',
                method: 'POST'
            },
            updateUserQuestion: {
                url: 'basic/user/updateUserQuestion',
                method: 'POST'
            },
            getUserQuestion: {
                url: 'basic/user/getUserQuestion',
                method: 'GET',
                isArray: true
            },
            updateRealAuth: {
                url: 'basic/user/updateRealAuth',
                method: 'POST'
            },
            getPageStatusRealAuth: {
                url: 'basic/user/getPageStatusRealAuth',
                method: 'GET'
            },
            updateIdEnable: {
                url: 'basic/user/updateIdEnable',
                method: 'POST'
            },
            getAllSecQuestion: {
                url: 'user/secQuestion/getPageInfo',
                method: 'GET'
            }
        });
    }]).factory('AccountResource', ['$resource', function ($resource) {
        return $resource('account/resource', {});
    }]).factory('AccountRole', ['$resource', function ($resource) {
        return $resource('account/role/:id',{},{
            getByExistRoleAndEnuu: {
                url: 'account/role/existRole',
                method: 'GET',
                isArray: true
            },
            save: {
                url: 'account/role',
                method: 'POST'
            },
            remove: {
                url: 'account/role/:id',
                method: 'DELETE'
            },
            findAll: {
                url: 'account/role',
                method: 'GET',
                isArray: true
            }
        });
    }]);
});
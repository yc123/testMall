/**
 * Created by wangyc on 2017/5/3.
 */
define(['app/app'], function(app) {
    'use strict';
    app.register.controller('HelpDetailCtrl', ['$scope', '$modal', 'HelpIssue', 'toaster', '$stateParams', 'HelpAPI', '$state', function ($scope, $modal, HelpIssue, toaster, $stateParams, HelpAPI, $state) {

        HelpIssue.get({id : $stateParams.id}, function (data) {
            $scope.issue = data;
            quill.setContents(angular.fromJson($scope.issue.content));
            if ($scope.issue.navId) {
                HelpAPI.get({id :　$scope.issue.navId},function (data) {
                    $scope.issue.nav = data;
                }, function (response) {
                    toaster.pop('error', response.data);
                });
            } else {
                toaster.pop('warning', '暂无导航信息，请补充');
            }
        }, function (response) {
            toaster.pop('error', response.data);
        });

        $('.main-content').scroll(function() {
            var scrollTop = $('.main-content')[0].scrollTop || 0;
            var toolbarTop = $('.ql-toolbar').offsetTop || 42;
            if (scrollTop >= toolbarTop) {
                $('.ql-toolbar').addClass('onTop').css('top', toolbarTop + 'px');
            } else {
                $('.ql-toolbar').removeClass('onTop');
            }
        });

        // 选择导航
        $scope.chooseNav = function() {
            var modalInstance = $modal.open({
                templateUrl : 'static/view/admin/help/helpNav_modal.html',  //指向上面创建的视图
                controller : 'HelpNavModalCtrl',// 初始化模态范围
                size : 'md' // 大小配置
            });
            modalInstance.opened.then(function(){// 模态窗口打开之后执行的函数
            });
            modalInstance.result.then(function(nav){
                $scope.issue.nav = nav;
                $scope.issue.navId = nav.id;
            }, function(reason){

            });
        };

        // 保存
        $scope.save = function () {
            $scope.issue.article = quill.container.innerHTML.replace('\<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">','').replace('contenteditable="true"', 'contenteditable="false"');
            $scope.issue.content = angular.toJson(quill.getContents());
            HelpIssue.update({}, $scope.issue, function (data) {
                toaster.pop('success', '保存成功');
                $state.go('helpPublish');
                window.location.href ='admin_n#/help/publish';// quilljs锁定了跳转 必须这样跳两次才有效
            }, function(response) {
                toaster.pop('error', response.data);
            });
        };

        // 发布
        $scope.publish = function () {
            $scope.issue.article = quill.container.innerHTML.replace('\<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">','').replace('contenteditable="true"', 'contenteditable="false"');
            $scope.issue.content = angular.toJson(quill.getContents());
            HelpIssue.publish({}, $scope.issue, function (data) {
                toaster.pop('success', '发布成功');
                $state.go('helpPublish');
                window.location.href = 'admin_n#/help/publish';
            }, function(response) {
                toaster.pop('error', response.data);
            });
        };
        
        // 删除
        $scope.deleteIssue = function () {
            HelpIssue.deleteById({id : $scope.issue.id},function (data) {
                toaster.pop('success', '删除成功');
                $state.go('helpPublish');
                window.location.href = 'admin_n#/help/publish';
            }, function(response) {
                toaster.pop('error', response.data);
            })
        }
    }]);

    app.register.controller('HelpNavModalCtrl', ['$scope', '$modalInstance', 'toaster', 'HelpAPI', function($scope, $modalInstance, toaster, HelpAPI) {
        HelpAPI.findChildren({parentId : 0}, function (data) {
            $scope.nav1 = data;
            angular.forEach($scope.nav1, function(nav) {
                nav.isShow = false;
            });
        }, function (response) {
            toaster.pop('error', response.data);
        });

        var toggleNav = function (nav) {
            if (nav.isShow) {
                nav.children = {};
                nav.isShow = false;
            } else if (nav.count > 0) {
                HelpAPI.findChildren({parentId : nav.id}, function (data) {
                    nav.children = data;
                    angular.forEach($scope.nav1, function (allNav) {
                        allNav.isShow = false;
                    });
                    nav.isShow = true;
                }, function(response) {
                    toaster.pop('error', response.data)
                });
            }
        };

        // 开关导航
        $scope.toggleNav = function (nav) {
            if (nav.isLeaf == 0) {
                toggleNav(nav);
            } else {
                $scope.chooseNav = nav;
            }
        };

        // 确认
        $scope.confirm = function() {
            $modalInstance.close($scope.chooseNav);
        };

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss();
        }
    }]);
});
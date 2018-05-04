define(['app/app'], function(app) {
    'use strict';
    app.register.controller('HelpMaintenanceCtrl', ['$scope', 'Help', 'HelpAPI', 'toaster', '$modal', 'HelpIssueAPI', 'HelpIssue', function ($scope, Help, HelpAPI, toaster, $modal, HelpIssueAPI, HelpIssue) {

        var getData = function () {
            HelpAPI.findChildren({parentId : 0}, function (data) {
                $scope.nav1 = data;
                angular.forEach($scope.nav1, function(nav) {
                    nav.isShow = false;
                });
            }, function (response) {
                toaster.pop('error', response.data);
            });
        };

        getData();

        // 添加导航
        $scope.addNav = function(parent, isUpdate) {
            var modalInstance = $modal.open({
                templateUrl : 'static/view/admin/help/addNav_modal.html',  //指向上面创建的视图
                controller : 'AddNavModalCtrl',// 初始化模态范围
                size : 'md', // 大小配置
                resolve : {
                    parent : function() {
                        return parent;
                    },
                    isUpdate : function () {
                        return isUpdate;
                    }
                }
            });
            modalInstance.opened.then(function(){// 模态窗口打开之后执行的函数
            });
            modalInstance.result.then(function(){
                getData();
                if (parent != 0) {
                    HelpAPI.get({id : parent.id}, function (data) {
                        parent = data;
                        parent.isShow = false;
                        toggleNav(parent);
                    }, function(response) {
                        toaster.pop('error', response.data)
                    });
                }
            }, function(reason){

            });
        };

        // 删除导航
        $scope.deleteNav = function(id, parentId) {
            Help.deleteById({id : id}, function (data) {
                toaster.pop('success', '删除成功');
                if (parentId == 0) {
                    getData();
                } else {
                    HelpAPI.findChildren({parentId : parentId}, function (data) {
                        angular.forEach($scope.nav1, function (nav) {
                            if (nav.id == parentId) {
                                nav.children = data;
                                nav.isShow = true;
                            }
                        });
                    }, function(response) {
                        if (response.data == '\"帮助中心信息有误\"') {
                            getData();
                        } else {
                            toaster.pop('error', response.data)
                        }
                    });
                }
            }, function (response) {
                toaster.pop('error', response.data);
            })
        };

        $scope.move = function (preDetno, postDetno, navs) {
            var preNav,postNav;
            angular.forEach(navs, function (nav) {
                if (nav.detno == preDetno) {
                    preNav = nav;
                }
                if (nav.detno == postDetno) {
                    postNav = nav;
                }
            });
            Help.exchangeDetno({preId : preNav.id, postId : postNav.id}, {}, function (data) {
              if (data.parentId == 0) {
                  getData();
              } else {
                  HelpAPI.findChildren({parentId : data.parentId}, function (navChildren) {
                      angular.forEach($scope.nav1, function (nav) {
                          if (nav.id == data.parentId) {
                              nav.children = navChildren;
                              nav.isShow = true;
                          }
                      });
                  }, function (response) {
                      toaster.pop('error', response.data)
                  });
              }
            }, function (response) {
                toaster.pop('error', response.data);
            })
        };

        // 移动文章序号
        $scope.moveIssue = function (preDetno, postDetno, issues) {
            var preIssue,postIssue;
            angular.forEach(issues, function (issue) {
                if (issue.detno == preDetno) {
                    preIssue = issue;
                }
                if (issue.detno == postDetno) {
                    postIssue = issue;
                }
            });
            HelpIssue.exchangeDetno({preId : preIssue.id, postId : postIssue.id}, {}, function (data) {
                HelpIssueAPI.getIssues({navId : data.navId}, function (data) {
                    $scope.issues = data;
                }, function (response) {
                    toaster.pop('error', response.data);
                });
            }, function (response) {
                toaster.pop('error', response.data);
            });
        };

        var toggleNav = function (nav) {
            if (nav.isShow) {
                nav.children = {};
                nav.isShow = false;
            } else if (nav.count > 0) {
                HelpAPI.findChildren({parentId : nav.id}, function (data) {
                    nav.children = data;
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
                angular.forEach($scope.nav1, function (nav) {
                    if(nav.isLeaf == 1) {
                        nav.isSelected = false;
                    } else {
                        angular.forEach(nav.children, function (navChild) {
                            if(navChild.isLeaf == 1) {
                                navChild.isSelected = false;
                            }
                        });
                    }
                });

                nav.isSelected = true;

                HelpIssueAPI.getIssues({navId : nav.id}, function (data) {
                    $scope.issues = data;
                }, function (response) {
                    toaster.pop('error', response.data);
                });
            }
        };
    }]);

    app.register.controller('AddNavModalCtrl', ['$scope', '$modalInstance', 'parent', 'isUpdate', 'toaster', 'Help', function($scope, $modalInstance, parent, isUpdate, toaster, Help) {

        $scope.isUpdate = isUpdate;

        if (!$scope.isUpdate) {
            $scope.parent = parent;
            $scope.nav = {parentId: $scope.parent.id };
        } else {
            $scope.nav = parent;
        }
        // 确认
        $scope.confirm = function() {
            if ($scope.isUpdate) {
                Help.updateNav({}, $scope.nav, function (data) {
                    toaster.pop('success', '修改成功');
                    $modalInstance.close();
                }, function (response) {
                    toaster.pop('error', response.data);
                });
            } else {
                Help.save({}, $scope.nav, function (data) {
                    toaster.pop('success', '创建成功');
                    $modalInstance.close();
                }, function (response) {
                    toaster.pop('error', response.data);
                });
            }
        };

        // 取消
        $scope.cancel = function() {
            $modalInstance.dismiss();
        }
    }]);
});
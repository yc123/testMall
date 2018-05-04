/**
 * Created by yujia on 2017/3/24.
 *  原厂认证
 */
define(['app/app'], function (app) {
    "use strict";
    app.register.controller('vendorAccountManagementCtrl', ['$scope', '$rootScope', 'Enterprise', 'User', 'toaster', '$modal', 'BaseService', 'ngTableParams', '$http', 'AuthenticationService', '$stateParams','AccountResource','AccountRole', function ($scope, $rootScope, Enterprise, User, toaster, $modal, BaseService, ngTableParams, $http, AuthenticationService, $stateParams, AccountResource, AccountRole) {
        $rootScope.active = 'vendor_account_management';
        document.title = '账户管理-优软商城';
        $scope.tab = 'base';
        $scope.addingUser = false;
        $scope.setAddingUser = function (status) {
            $scope.addingUser = status;
            $scope.adding = false;
        };
        $scope.userInfo = $rootScope.userInfo;
		$scope.updateState = false;
        $scope.filterRole = 'all';
        // $scope.userInfo.pwdEnable = false;
        // $scope.userInfo.haveUserQuestion = false;
        // $scope.userInfo.userEmail = null;

      //手机号和邮箱号的部分隐藏
      if($scope.userInfo.userTel){
        $scope.userInfo.userTel = $scope.userInfo.userTel.substr(0, 3)
            + '****' + $scope.userInfo.userTel.substr(7);
      }
      var userEmailTemp = $scope.userInfo.userEmail
          ? $scope.userInfo.userEmail.indexOf("@") : '';
      if (userEmailTemp != '') {
        $scope.userInfo.userEmail = $scope.userInfo.userEmail.substr(
            0,1) + "***"
            + $scope.userInfo.userEmail.substr(userEmailTemp);
      }

		var getEnterprise = function () {
			// 获取企业信息
			Enterprise.getEnterpriseInfo({enuu : $scope.userInfo.enterprise.uu}, function(data) {
				$scope.enterpriseInfo = data;
				$scope.enterpriseInfoBackup = angular.copy($scope.enterpriseInfo);
				$scope.enAdminuu = $scope.enterpriseInfo.enAdminuu;
				User.getUserByUU({uu: $scope.enAdminuu}, {}, function(data){
					$scope.adminInfo = data;
					console.log($scope.adminInfo);
				}, function(){
					toaster.pop('error', '获取管理员信息失败');
				});
			},function(response) {
				toaster.pop('error', '获取企业信息失败');
			});
		}
		if (typeof $scope.userInfo != 'undefined' && typeof $scope.userInfo.enterprise != 'undefined') {
			getEnterprise();
		} else {
			AuthenticationService.getAuthentication().success(function (data) {
				$scope.userInfo = data;
				for (var i=0; i<$scope.userInfo.enterprises.length; i++) {
					if ($scope.userInfo.enterprises[i].current) {
						$scope.userInfo.enterprise = $scope.userInfo.enterprises[i];
						break;
					}
				}
				getEnterprise();
			}, function (error) {
				toaster.pop('error', '获取用户信息失败');
			})
		}

        $scope.pageParam = {};
        $scope.tableParams = new ngTableParams({
            page : 1, // show first page
            count : 10 // count per page
        }, {
            total : 0,
            getData : function($defer, params) {
                var param = BaseService.parseParams(params.url());
                param.enuu = $scope.userInfo.enterprise.uu;
                if(!$scope.searchMthod) {
                    Enterprise.getAllUsersByEnuu(param, function (page) {
                        if (page) {
                            $scope.pageParam.start = (page.number-1)*page.size+1;
                            $scope.pageParam.end = $scope.pageParam.start + page.numberOfElements - 1;
                            $scope.pageParam.all = page.totalElements;
                            params.total(page.totalElements);
                            $defer.resolve(page.content);
                            $scope.users = page.content;
                            $scope.reloadUserCheck(false);
                        }
                    },function (error) {
                        toaster.pop('error', '获取企业人员信息失败',error.data);
                    });
                }
                else {
                    param.keyword = $scope.keyword;
                    if (filterRolejs !== 1){
                        param.roleId = filterRolejs;
                    }
                    Enterprise.findUsersByKeyword(param,function (page) {
                        if (page) {
                            $scope.pageParam.start = (page.number-1)*page.size+1;
                            $scope.pageParam.end = $scope.pageParam.start + page.numberOfElements - 1;
                            $scope.pageParam.all = page.totalElements;
                            params.total(page.totalElements);
                            $defer.resolve(page.content);
                            $scope.users = page.content;
                            $scope.reloadUserCheck(false);
                        }
                    },function (error) {
                        toaster.pop('error', '获取企业人员信息失败',error.data);
                    })
                }
            }
        });

        var filterRolejs = 1;
        $scope.onSearch = function (keyword,filterRole) {
            filterRolejs = 1;
            if ((keyword != null && keyword != '') || filterRole !== 'all') {
                if (filterRole === 'all'){
                    filterRolejs = 1;
                }else {
                    filterRolejs = filterRole;
                }
                $scope.searchMthod = true;
                $scope.keyword = keyword;
            } else {
                $scope.searchMthod = false;
            }
            $scope.tableParams.page(1);
            $scope.tableParams.reload();
        };
        $scope.onKeyUpSearch = function (keyword, filterRole, event) {
            if (event && event.keyCode == 13) {
                $scope.onSearch(keyword, filterRole);
            }
        }

        $scope.newUser = {};

        //弹出添加用户模态框
        $scope.addExistUser = function () {
            $scope.adding = false;
            $scope.setAddingUser(false);
            $scope.newUser = {};
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: $rootScope.rootPath + '/static/view/vendor/forstore/addExistUser.html',
                controller: 'AddExistUserCtrl'
            });

            modalInstance.result.then(function () {
                $scope.userTelSuccess = false;
                $scope.userTelError = false;
                $scope.tableParams.page(1);
                $scope.tableParams.reload();
            }, function () {

            });

        };
        /**
         * 添加未注册用户
         */
        $scope.addUser = function () {
            if (!$scope.userEmailSuccess || !$scope.userTelSuccess) {
                toaster.pop('error', '请填写完信息后提交');
                return;
            }
            $scope.adding = true;
            $scope.loading = true;
            Enterprise.saveUser({}, $scope.newUser, function () {
                $scope.loading = false;
                toaster.pop('success', '提示', '增加用户成功：' + $scope.newUser.userName);
                $scope.setAddingUser(false);
                $scope.newUser = {userSex: 'M'};
                $scope.tableParams.page(1);
                $scope.tableParams.reload();
                $scope.adding = false;
                // $scope.newUserForm.newUserTel.$setValidity('available', false);
                // $scope.newUserForm.newUserEmail.$setValidity('available', false);
                $scope.userTelSuccess = false;
                $scope.userTelError = false;
                $scope.userEmailSuccess = false;
                $scope.userEmailError = false;
            }, function (response) {
                $scope.loading = false;
                toaster.pop('error', '错误', response.data);
            });
        };

        $scope.adding = false;
        $scope.setAdding = function (status) {
            $scope.adding = status;
        }
        /**
         * 删除用户
         */
        $scope.removeUser = function (user) {

            if (confirm('确定删除用户(' + user.userName + ')吗？')) {
                Enterprise.removeUser({uu: user.userUU}, function () {
                    toaster.pop('success', '提示', '用户删除成功。');
                    $scope.tableParams.page(1);
                    $scope.tableParams.reload();
                }, function (response) {
                    toaster.pop('error', '删除失败', response.data);
                });
            }
        };
        //用户删除确认框
        $scope.showDelUserFlag = false;

        $scope.setShowDelUserFlag = function (flag, user) {
            $scope.showDelUserFlag = flag;
            if (flag) {
                $scope.delUser = user;
            }
        }
        /***
         * 全选
         * */
        $scope.isCheckAll = false;
        $scope.doCheckAll = function () {
            $scope.isCheckAll = !$scope.isCheckAll;
            if ($scope.isCheckAll) {
                $scope.reloadUserCheck(true);
            } else {
                $scope.reloadUserCheck(false);
            }
        }

        $scope.checkUser = function (user) {
            user.checked = !user.checked;
            var allcheck = true
            angular.forEach($scope.users, function (item) {
                if (!item.checked) {
                    allcheck = false;
                }
            });
            $scope.isCheckAll = allcheck;
        }

        $scope.reloadUserCheck = function (flag) {
            angular.forEach($scope.users, function (item) {
                item.checked = flag;
            });
        }
        /**
         * 验证手机号是否可用
         */
        $scope.telValid = function (tel) {
            if (tel) {
                $http.get('basic/user/telEnable', {
                    params: {
                        tel: tel
                    }
                }).success(function (data) {
                    data = eval(data);
                    if (data == true) {
                        // $scope.newUserForm.newUserTel.$setValidity('available', true);
                        $scope.userTelSuccess = true;
                        $scope.userTelError = false;
                    } else {
                        // $scope.newUserForm.newUserTel.$setValidity('available', false);
                        $scope.userTelError = true;
                        $scope.userTelSuccess = false;
                        if (tel.length == 11)
                            toaster.pop('error', '错误', '手机号 ' + tel + ' 已被注册');
                    }
                }).error(function () {
                    $scope.userTelSuccess = false;
                    $scope.userTelError = true;
                });
            } else {
                $scope.userTelSuccess = false;
                $scope.userTelError = false;
            }
          };

        /**
         * 验证邮箱是否可用
         */
        $scope.emailValid = function (email) {
            if (email) {
                $http.get('basic/user/emailEnable', {
                    params: {
                        email: email
                    }
                }).success(function (data) {
                    data = eval(data);
                    if (data == true) {
                        // $scope.newUserForm.newUserEmail.$setValidity('available',
                        //     true);
                        $scope.userEmailSuccess = true;
                        $scope.userEmailError = false;
                    } else {
                        // $scope.newUserForm.newUserEmail.$setValidity('available',
                        //     false);
                        $scope.userEmailError = true;
                        $scope.userEmailSuccess = false;
                    }
                }).error(function () {
                    $scope.userEmailError = true;
                    $scope.userEmailSuccess = false;
                });
            } else {
                $scope.userEmailError = false;
                $scope.userEmailSuccess = false;
            }
        };

        /**
         * 变更到更新状态
         */
        $scope.changeToUpdate = function (isUpdate) {
            $scope.updateState = isUpdate;
            if ($scope.updateState == false) {
                $scope.enterpriseInfo = angular.copy($scope.enterpriseInfoBackup);
            }
        };

          /**
           * 验证企业信息
           */
          function validateEnterpriseInfo() {
            var props = ['enName', 'enAddress', 'enUrl'];

            var flag = true;
            angular.forEach(props, function (prop) {
                if ($scope.enterpriseInfo.hasOwnProperty(prop)) {
                    if (!$scope.enterpriseInfo[prop] || $scope.enterpriseInfo[prop]
                        === '') {
                        console.log(prop + '不能为空');
                        // TODO 记录验证信息
                        flag = false;
                    }
                } else {
                    console.log(prop + '不能为空');
                    flag = false;
                }
            });
            return flag;
        }

        /**
         * 保存企业信息
         */
        $scope.saveUpdate = function () {
            // 先检查信息是否为空
            if (angular.equals($scope.enterpriseInfo,
                    $scope.enterpriseInfoBackup)) {
                toaster.pop('error', '未做任何修改');
                $scope.updateState = false;
                return;
            }
            var enterpriseInfoFlag = validateEnterpriseInfo();
            if (!enterpriseInfoFlag) {
                toaster.pop('error', '请补充完信息后再次提交');
                return;
            }
            Enterprise.updateEnterpriseInfo(
                {enuu: $scope.userInfo.enterprise.uu}, $scope.enterpriseInfo,
                function () {
                    $scope.loading = false;
                    toaster.pop('success', '提示', '企业信息修改成功');
                    $scope.enterpriseInfoBackup = angular.copy(
                        $scope.enterpriseInfo);
                    $scope.updateState = false;

                }, function (response) {
                  $scope.loading = false;
                  toaster.pop('error', '修改失败', response.data);
                });
          };

          // 切换tab
          $scope.checkTab = function (t) {
            $scope.tab = t;
            if (t === 'role' && $scope.rolesExcept) {
                toaster.pop('error', '获取企业角色信息失败',$scope.rolesExcept);
            }
            if (t === 'auth') {
                $scope.keyword = '';
                $scope.onSearch($scope.keyword,'all');
            }
          };

          $scope.updatePassword = function () {
            var modalInstance = $modal.open({
              animation: true,
              templateUrl: $rootScope.rootPath
              + '/static/view/vendor/modal/updatePassword.html',
              controller: 'PasswordCtrl',
              resolve: {
                user: function () {
                  return angular.copy($rootScope.userInfo);
                }
              }
            });
            modalInstance.result.then(function () {
              window.location.href = "vendor#/account/management/sec";
            }, function () {
            });
          };

          $scope.updateUserEmail = function(){
            var modalInstance = $modal.open({
              animation: true,
              templateUrl: $rootScope.rootPath + '/static/view/vendor/modal/updateUserEmail.html',
              controller: 'UserEmailCtrl',
              resolve: {
                user: function(){return angular.copy($rootScope.userInfo);}
              }
            });

            modalInstance.result.then(function(){
              window.location.href = "vendor#/account/management/sec";
            }, function(){
            });
          };

          $scope.updateUserTel = function(){
            var modalInstance = $modal.open({
              animation: true,
              templateUrl: $rootScope.rootPath + '/static/view/vendor/modal/updateUserTel.html',
              controller: 'UserTelCtrl',
              resolve: {
                user: function(){return angular.copy($rootScope.userInfo);}
              }
            });

            modalInstance.result.then(function(){
            }, function(){
            });
          };

          $scope.updateUserPay = function(){
            var modalInstance = $modal.open({
              animation: true,
              templateUrl: $rootScope.rootPath + '/static/view/vendor/modal/updateUserPay.html',
              controller: 'UserPayCtrl',
              resolve: {
                user: function(){return angular.copy($rootScope.userInfo);}
              }
            });

            modalInstance.result.then(function(){
            }, function(){
            });
          };

          $scope.updateUserQuestion = function(){
            var modalInstance = $modal.open({
              animation: true,
              templateUrl: $rootScope.rootPath + '/static/view/vendor/modal/updateUserQuestion.html',
              controller: 'UserQuestionCtrl',
              resolve: {
                user: function(){return angular.copy($rootScope.userInfo);}
              }
            });

            modalInstance.result.then(function(){
              window.location.href = "vendor#/account/management/sec";
            }, function(){
            });
          };

          $scope.updateRealAuth = function(){
            var modalInstance = $modal.open({
              animation: true,
              templateUrl: $rootScope.rootPath + '/static/view/vendor/modal/updateRealAuth.html',
              controller: 'UserRealAuthCtrl',
              resolve: {
                user: function(){return angular.copy($rootScope.userInfo);}
              }
            });

            modalInstance.result.then(function(){
            }, function(){
            });
          };

          //卖家中心 等级提示跳转
          if($stateParams.op!=""){
            var op =$stateParams.op;
            $scope.checkTab('safe');
            switch(op)
            {
              case 'pwd':
                $scope.updatePassword();
                break;
              case 'question':
                $scope.updateUserQuestion();
                break;
              case 'email':
                $scope.updateUserEmail();
                break;
            }
        }
        //角色控制
        $scope.roles = {};
        AccountResource.query({}, function (data) {
            if (data && data.length > 0) {
                data[0].$open = true;
            }
            $scope.resources = data;
        });
        var getData = function () {
            AccountRole.findAll({}, function (data) {
                var defaults = [], custom = [];
                angular.forEach(data, function (d) {
                    if (d.isdefault == 1)
                        defaults.push(d);
                    else
                        custom.push(d);
                });
                $scope.roles = {defaults: defaults, custom: custom};
            },function (error) {
                $scope.rolesExcept = error.data;
            });
            AccountRole.getByExistRoleAndEnuu({}, function (data) {
                var defaults = [], custom = [];
                angular.forEach(data, function (d) {
                    if (d.isdefault == 1)
                        defaults.push(d);
                    else
                        custom.push(d);
                });
                $scope.existRoles = {defaults: defaults, custom: custom};
            });
        };
        getData();
        $scope.editRole = function (role) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: $rootScope.rootPath + '/static/view/vendor/modal/role_detail.html',
                controller: 'RoleEditCtrl',
                resolve: {
                    role: function () {
                        return role;
                    }
                }
            });
            modalInstance.result.then(function (added) {
                added && (getData());
            });
        };

        $scope.editUserRole = function (user) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: $rootScope.rootPath + '/static/view/vendor/modal/edit_user_role.html',
                controller: 'UserRoleEditCtrl',
                resolve: {
                    user: function () {
                        return user;
                    }
                }
            });
        };

        $scope.inSelect = false;
        $scope.setInSelect = function (status) {
            $scope.inSelect = status;
        }
        $(document).on("click", function () {
            $scope.$apply(function () {
                if (!$scope.inSelect) {
                    $scope.setAdding(false);
                }
            })
        })
    }]);


    /*
     * 绑定用户到企业
     */
    app.register.controller('AddExistUserCtrl',
        ['$scope', '$modalInstance', 'Enterprise', 'AuthenticationService',
            '$timeout', 'toaster',
            function ($scope, $modalInstance, Enterprise, AuthenticationService,
                      $timeout, toaster) {
                $scope.searching = false;
                //根据输入的内容查找用户
                $scope.searchUser = function (keyWord) {
                    $scope.searching = true;
                    $scope.searchSuccess = false;
                    $scope.searchFailed = false;
                    $scope.illegalError = false;
                    $scope.reBindError = false;
                    $scope.okDisabled = false;
                    Enterprise.searchUser({keyWord: keyWord}, function (data) {
                        $scope.searchSuccess = true;
                        $scope.searchFailed = false;
                        $scope.user = data;		//查询到的用户
                    }, function (response) {
                        $scope.searchSuccess = false;
                        $scope.searchFailed = true;
                    });
                };

                $scope.onKeyDown = function (e, key) {
                    var keycode = window.event ? e.keyCode : e.which;
                    if (keycode == 13) {
                        $scope.searchUser(key);
                    }
                }

                //确认绑定
                $scope.ok = function (keyWord) {
                    AuthenticationService.getAuthentication().success(function (data) {
                        $scope.currentUser = data;	//当前登录的用户（管理员）
                        //不可自己绑定自己
                        if ($scope.currentUser.userUU == $scope.user.userUU) {
                            $scope.illegalError = true;
                            $scope.okDisabled = true;
                            return false;
                        }

                        //用户未绑定到任何企业时
                        if (!$scope.user.enterprises) {
                            //正常绑定
                            Enterprise.bindUserToMyEnterprise({userUU: $scope.user.userUU},
                                function (data) {
                                    $scope.okDisabled = true;
                                    toaster.pop("success", "提示", "用户绑定成功");
                                    $modalInstance.close(true);
                                }, function (response) {
                                });
                            return true;
                        }

                        //用户已绑定到某些企业时
                        for (var i = 0; i < $scope.currentUser.enterprises.length; i++) {
                            if ($scope.currentUser.enterprises[i].current) {
                                for (var j = 0; j < $scope.user.enterprises.length; j++) {
                                    //该用户已绑定到当前企业，不可重复绑定
                                    if ($scope.currentUser.enterprises[i].uu
                                        == $scope.user.enterprises[j].uu) {
                                        $scope.reBindError = true;
                                        $scope.okDisabled = true;
                                        return false;
                                    }
                                }
                                //该用户未绑定到当前企业，可以进行绑定
                                Enterprise.bindUserToMyEnterprise(
                                    {userUU: $scope.user.userUU}, function (data) {
                                        $scope.okDisabled = true;
                                        toaster.pop("success", "提示", "用户绑定成功");
                                        $modalInstance.close(true);
                                    }, function (response) {
                                        console.log("绑定失败！");
                                    });

                }
              }

            });
          };

          $scope.cancel = function () {
            $modalInstance.dismiss();
          };
        }]);

  // 修改密码Controller
  app.register.controller('PasswordCtrl',
      ['$rootScope', '$scope', '$modalInstance', 'user', 'User', 'toaster','$state',
        function ($rootScope, $scope, $modalInstance, user, User, toaster,$state) {
          $rootScope.$on('$stateChangeStart',
              function(event, toState, toParams, fromState, fromParams){
                $modalInstance.dismiss();
          })
          $scope.user = user;
          $scope.checking = false;
          $scope.showPassword = false;
          $scope.showNewPassword = false;
          $scope.showPassword1 = false;
          $scope.reloadKeyboard = function (type, $event) {
            $event.stopPropagation();
            if (type === 'showPassword') {
              $scope.showPassword = !$scope.showPassword;
              if (!$scope.showPassword) {
                $scope.checkPassword($scope.user.password);
              } else {
                $scope.closeOtherKeyboard('showPassword');
              }
            } else if (type === 'showNewPassword') {
              $scope.showNewPassword = !$scope.showNewPassword;
              if (!$scope.showNewPassword) {
                $scope.checkNewPassword($scope.user.newPassword);
              } else {
                $scope.closeOtherKeyboard('showNewPassword');
              }
            } else if (type === 'showPassword1') {
              $scope.showPassword1 = !$scope.showPassword1;
              if (!$scope.showNewPassword1) {
                $scope.checkNewPassword1($scope.user.newPassword1);
              } else {
                $scope.closeOtherKeyboard('showPassword1');
              }
            }
          }

          function resetPassword() {
            $scope.showPassword = false;
            $scope.checkPassword($scope.user.password);
          }

          function resetNewPassword() {
            $scope.showNewPassword = false;
            $scope.checkNewPassword($scope.user.newPassword);
          }

          function resetPassword1() {
            $scope.showPassword1 = false;
            $scope.checkNewPassword1($scope.user.newPassword1);
          }

          $scope.closeOtherKeyboard = function (type) {
            if (type == 'showPassword') {
              if ($scope.showNewPassword) {
                resetNewPassword();
              } else if ($scope.showPassword1) {
                resetPassword1();
              }
            } else if (type == 'showNewPassword') {
              if ($scope.showPassword) {
                resetPassword();
              } else if ($scope.showPassword1) {
                resetPassword1();
              }
            } else if (type == 'showPassword1') {
              if ($scope.showPassword) {
                resetPassword();
              } else if ($scope.showNewPassword) {
                resetNewPassword();
              }
            }
          }
          $scope.closeKeyboard = function () {
            if ($scope.showPassword) {
              $scope.showPassword = false;
              $scope.checkPassword($scope.user.password);
            } else if ($scope.showNewPassword) {
              $scope.showNewPassword = false;
              $scope.checkNewPassword($scope.user.newPassword);
            } else if ($scope.showPassword1) {
              $scope.showPassword1 = false;
              $scope.checkNewPassword1($scope.user.newPassword1);
            }
          }
          //输入原密码后验证原密码是否正确
          $scope.checkSuccess = false;
          $scope.checkFailed = false;
          $scope.checkPassword = function (password) {
            $scope.checkSuccess = false;
            $scope.checkFailed = false;
            if(!password){
              $scope.checkFailed = true;
              $scope.checkSuccess = false;
            }
            User.checkPassword({password: password}, function () {
              $scope.checkSuccess = true;
              $scope.checkFailed = false;
            }, function () {
              $scope.checkFailed = true;
              $scope.checkSuccess = false;
            });
          };

          // 对新密码进行校验
          $scope.checkSuccess1 = false;
          $scope.checkFailed1 = false;
          $scope.checkNewPassword = function (newPassword) {
            var middlLevelReg = /^(?=.{8,20})(((?=.*[0-9])(?=.*[a-z]))|((?=.*[0-9])(?=.*[A-Z]))).*$/;
            if (newPassword == null || !middlLevelReg.test(newPassword)) {
              //toaster.pop('error', '错误', '密码为8-20字符的英文、数字混合');
              $scope.checkSuccess1 = false;
              $scope.checkFailed1 = true;
              return false;
            } else {
              $scope.checkSuccess1 = true;
              $scope.checkFailed1 = false;
            }
          }

          $scope.$watch('user.newPassword', function (newValue, oldValue) {
            $scope.checkPasswordLevel(newValue);
          });

          // 密码强度校验
          $scope.secLevel = 0;
          $scope.checkPasswordLevel = function (newPassword) {
            $scope.checkFailed1 = false;
            if (newPassword == null) {
              $scope.secLevel = 0;
              return false;
            }
            // 密码强度中的正则
            var middlLevelReg = /^(?=.{8,20})(((?=.*[0-9])(?=.*[a-z]))|((?=.*[0-9])(?=.*[A-Z]))).*$/;
            // 密码强度高的正则
            var heightLevelReg = /^(?=.{8,20})(((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]))|((?=.*[0-9])((?=.*[a-zA-Z]))(?=.*[^a-zA-Z0-9]))).*$/;
            if(heightLevelReg.test(newPassword)){
              $scope.secLevel = 3;
              return true;
            }else if(middlLevelReg.test(newPassword)){
              $scope.secLevel = 2;
              return true;
            }else{
              $scope.secLevel = 1;
              return false;
            }
          }

          //校验确认密码是否与新密码相同
          $scope.checkSuccess2 = false;
          $scope.checkFailed2 = false;
          $scope.checkNewPassword1 = function () {
            if ($scope.checkSuccess1 == true && ($scope.user.newPassword
                    == $scope.user.newPassword1)) {
              $scope.checkSuccess2 = true;
              $scope.checkFailed2 = false;
              return false;
            }
            $scope.checkSuccess2 = false;
            $scope.checkFailed2 = true;
          }

          // 修改密码
          $scope.ok = function () {
            // 原密码校验
            if(!$scope.checkSuccess){
              $scope.checkPassword($scope.user.password);
            }
            // 新密码校验
            $scope.checkNewPassword($scope.user.newPassword);
            // 再次输入密码校验
            $scope.checkNewPassword1();
            if(!$scope.checkSuccess || !$scope.checkSuccess1 || !$scope.checkSuccess2){
              return;
            }
            // 密码强度校验
            if(!$scope.checkPasswordLevel($scope.user.newPassword)){
              toaster.pop('error', '错误', '密码强度不够，请重新输入');
              return;
            }
            if ($scope.user.newPassword == $scope.user.password) {
              toaster.pop('error', '错误', '新密码与原密码相同');
              return;
            }
            if ($scope.user.newPassword == $scope.user.newPassword1) {//验证重复密码相等
              User.updatePassword({
                password: $scope.user.password,
                newPassword: $scope.user.newPassword,
                secLevel: $scope.secLevel
              }, {}, function () {
                toaster.pop('success', '成功', '修改密码成功，请牢记您的新密码。');
                $scope.user.password = null;
                $scope.user.newPassword = null;
                $scope.user.newPassword1 = null;
                $scope.checking = false;
                $scope.checkSuccess = false;
                $scope.checkFailed = false;
                $scope.checkSuccess1 = false;
                $scope.checkFailed1 = false;
                $scope.checkSuccess2 = false;
                $scope.checkFailed2 = false;
                window.location.href = "vendor#/account/management/sec";
                window.location.reload();
                $modalInstance.close();
              }, function (response) {
                toaster.pop('error', '错误', response.data);
                $modalInstance.close();
              });
            } else {
              toaster.pop('error', '错误', '重复密码不一致');
            }
          };

          $scope.cancel = function () {
            $modalInstance.close();
          };
          $scope.hideKeyboard = function () {
            $scope.closeKeyboard();
            console.log(1);
          }
        }]);

  // 修改邮箱Controller
  app.register.controller('UserEmailCtrl',
      ['$rootScope', '$scope', '$modalInstance', 'user', 'User', 'toaster', '$interval',
        function ($rootScope, $scope, $modalInstance, user, User, toaster, $interval) {
          $rootScope.$on('$stateChangeStart',
              function(event, toState, toParams, fromState, fromParams){
                $modalInstance.dismiss();
          })
          User.getPageToken();
          $scope.user = user;
          $scope.user.userEmail = null;
          $scope.user.newUserEmail = null;
          //验证用户输入的旧邮箱地址是否正确
          $scope.checkUserEmail = function (userEmail) {
            if (userEmail == null) {
              $scope.checkFailed = true;
              $scope.checkSuccess = false;
              return false;
            }
            $scope.checkSuccess = false;
            $scope.checkFailed = false;
            User.checkUserEmail({userEmail: userEmail}, function () {
              $scope.checkSuccess = true;
              $scope.checkFailed = false;
            }, function () {
              $scope.checkFailed = true;
              $scope.checkSuccess = false;
            });
          };
          //如果之前未绑定
          if($scope.userInfo.userEmail==null?true:false){
            $scope.checkSuccess = true;
          }

          //验证用户新输入的邮箱是否可用
          $scope.checkSuccess1 = false;
          $scope.checkFailed1 = false;
          $scope.checkFailed1_1 = false;
          $scope.emailEnable = function (newUserEmail) {
            //邮箱不可用
            if ((newUserEmail == null || newUserEmail.length > 30)
                || newUserEmail.indexOf("@") == -1 || newUserEmail.indexOf(".") == -1) {
              $scope.checkSuccess1 = false;
              $scope.checkFailed1 = true;
              $scope.checkFailed1_1 = false;
              return false;
            }
            User.emailEnable({email: newUserEmail}, function (data) {
              if (data.data == "true") {//邮箱可用
                $scope.checkSuccess1 = true;
                $scope.checkFailed1 = false;
                $scope.checkFailed1_1 = false;
              } else {//邮箱不可用
                $scope.checkSuccess1 = false;
                $scope.checkFailed1 = false;
                $scope.checkFailed1_1 = true;
              }
            }, function () {
              $scope.checkSuccess1 = false;
              $scope.checkFailed1 = true;
              $scope.checkFailed1_1 = false;
            });
          };

          $scope.codeSuccess = false;
          $scope.sendSuccess = true;
          //发送验证码
          $scope.sendCheckCode = function (newUserEmail) {
            if (!$scope.checkSuccess1 || ($scope.userInfo.userEmail!=null && !$scope.checkSuccess)) {
                if ($scope.userInfo.userEmail!=null && !$scope.checkSuccess) {
                    $scope.checkFailed = true;
                }
              return;
            }
            $scope.sendSuccess = false;
            User.sendCheckCode({newUserEmail: newUserEmail}, function () {
              $scope.codeSuccess = true;
              $interval.cancel(timePromise);
              var second = 60,
                  timePromise = $interval(function () {
                    if (second <= 0) {
                      $interval.cancel(timePromise);
                      second = 60;
                    } else {
                      second--;
                      $scope.paracont = second + "秒后可重发";
                      if (second == 0) {
                        $scope.paracont = "重发验证码";
                        $scope.sendSuccess = true;
                      }
                    }
                  }, 1000, 60);
            }, function (response) {
              toaster.pop('error', '错误', response.data);
              $scope.sendSuccess = true;
            });
          };

          $scope.checkSuccess2 = false;
          $scope.checkFailed2 = false;
          //校验验证码
          $scope.validCheckCode = function (checkCode) {
            if(!checkCode){
              $scope.checkSuccess2 = false;
              $scope.checkFailed2 = true;
              return false;
            }
            User.validCheckCode({checkCode: checkCode,newUserEmail:$scope.user.newUserEmail}, function (data) {
              var status = data.status;
              var message = data.message;
              if (status == 1) {
                $scope.checkSuccess2 = true;
                $scope.checkFailed2 = false;
              } else {
                $scope.checkSuccess2 = false;
                $scope.checkFailed2 = true;
              }
            });
          };

          //修改邮箱地址
          $scope.ok = function () {
            //原邮箱校验
            if($scope.userInfo.userEmail && !$scope.checkSuccess ){
              $scope.checkUserEmail($scope.user.userEmail);
            }
            //新邮箱校验
            if(!$scope.checkSuccess1){
              $scope.emailEnable($scope.user.newUserEmail);
            }
            //验证码
            $scope.validCheckCode($scope.checkCode);
            if((!$scope.checkSuccess && $scope.userInfo.userEmail)|| !$scope.checkSuccess1 || !$scope.checkSuccess2){
              return;
            }
            var param = {
              newUserEmail: $scope.user.newUserEmail,
              checkCode:$scope.checkCode
            };
            if ($scope.user.userEmail!=null && $scope.user.newUserEmail == $scope.user.userEmail) {
              toaster.pop('error', '错误', '新邮箱地址与旧邮箱地址相同');
              return;
            }else{
              param["userEmail"]=$scope.user.userEmail;
            }

            User.updateUserEmail(param, {}, function () {
              toaster.pop('success', '成功', '修改邮箱成功。');
              //修改userInfo里面的userEmail
              $scope.userInfo.userEmail =$scope.user.newUserEmail.substr(
                  0,1) + "***"
                  + $scope.user.newUserEmail.substr($scope.user.newUserEmail.indexOf("@"));
              $scope.user.userEmail = null;
              $scope.user.newUserEmail = null;
              $scope.checking = false;
              $scope.checkSuccess = false;
              $scope.checkFailed = false;
              $scope.codeSuccess = false;
              $scope.validSuccess = false;
              $scope.checkSuccess1 = false;
              $scope.checkFailed1 = false;
              window.location.href = "vendor#/account/management/sec";
              window.location.reload();
              $modalInstance.close();
            }, function (response) {
              toaster.pop('error', '错误', response.data);
              $modalInstance.close();
            });
          };

          $scope.cancel = function () {
            $modalInstance.close();
          };
        }]);

  //手机验证Controller
  app.register.controller('UserTelCtrl',
      ['$rootScope', '$scope', '$modalInstance', 'user', 'User', 'toaster', '$interval',
        function ($rootScope, $scope, $modalInstance, user, User, toaster, $interval) {
          $rootScope.$on('$stateChangeStart',
              function(event, toState, toParams, fromState, fromParams){
                $modalInstance.dismiss();
          })
          User.getPageToken();
          $scope.user = user;
          $scope.user.userTel = null;
          //原手机号校验
          $scope.checking = false;
          //验证用户输入的旧邮箱地址是否正确
          $scope.checkUserTel = function (userTel) {
            $scope.checking = true;
            $scope.checkSuccess = false;
            $scope.checkFailed = false;
            User.checkUserTel({userTel: userTel}, function () {
              $scope.checkSuccess = true;
              $scope.checking = false;
              $scope.checkFailed = false;
            }, function () {
              $scope.checkFailed = true;
              $scope.checking = false;
              $scope.checkSuccess = false;
            });
          };

          //新手机号是否可用
          $scope.checkFailed1 = false;
          $scope.checkFailed1_1 = false;
          $scope.checkSuccess1 = false;
          $scope.telEnable = function (newUserTel) {
            if (newUserTel == null || !/^[0-9]{8,11}$/.test(newUserTel)) {
              $scope.checkFailed1 = true;
              $scope.checkSuccess1 = false;
              $scope.checkFailed1_1 = false;
              return false;
            }
            $scope.checking1 = true;
            $scope.checkSuccess1 = false;
            $scope.checkFailed1 = false;
            User.telEnable({tel: newUserTel}, function (data) {
              if (data.data == "true") {//手机可用
                $scope.checkSuccess1 = true;
                $scope.checkFailed1 = false;
                $scope.checkFailed1_1 = false;
              } else {//手机不可用
                $scope.checkFailed1_1 = true;
                $scope.checking1 = false;
                $scope.checkSuccess1 = false;
              }
            }, function () {
              $scope.checkFailed1 = true;
              $scope.checking1 = false;
              $scope.checkSuccess1 = false;
              $scope.checkFailed1_1 = false;
            });
          };

          //发送验证码
          $scope.codeSuccess = false;
          $scope.sendSuccess = true;
          //发送验证码
          $scope.sendTelCheckCode = function (newUserTel) {
            if (!$scope.checkSuccess1 || ($scope.userInfo.userTel!=null && !$scope.checkSuccess)) {
                if ($scope.userInfo.userTel!=null && !$scope.checkSuccess) {
                    $scope.checkFailed = true;
                }
                return;
            }
            $scope.sendSuccess = false;
            User.sendTelCheckCode({newUserTel: newUserTel}, function () {
              $scope.codeSuccess = true;
              $interval.cancel(timePromise);
              var second = 60,
                  timePromise = $interval(function () {
                    if (second <= 0) {
                      $interval.cancel(timePromise);
                      second = 60;
                    } else {
                      second--;
                      $scope.paracont = second + "秒后可重发";
                      if (second == 0) {
                        $scope.paracont = "重发验证码";
                        $scope.sendSuccess = true;
                      }
                    }
                  }, 1000, 60);
            }, function (response) {
              toaster.pop('error', '错误', response.data);
              $scope.sendSuccess = true;
            });
          };

          $scope.checkSuccess2 = false;
          $scope.checkFailed2 = false;
          //校验验证码
          $scope.validTelCheckCode = function (telCheckCode) {
            if(!telCheckCode){
              $scope.checkSuccess2 = false;
              $scope.checkFailed2 = true;
              return false;
            }
            User.validTelCheckCode({telCheckCode: telCheckCode,newUserTel:$scope.user.newUserTel},
                function (data) {
                  var status = data.status;
                  var message = data.message;
                  if (status == 1) {
                    $scope.checkSuccess2 = true;
                    $scope.checkFailed2 = false;
                  } else {
                    $scope.checkSuccess2 = false;
                    $scope.checkFailed2 = true;
                  }
                });
          };

          //修改手机
          $scope.ok = function () {
            //原手机校验
            if(!$scope.checkSuccess){
              $scope.checkUserTel($scope.user.userTel);
            }
            //新手机校验
            if(!$scope.checkSuccess1){
              $scope.telEnable($scope.user.newUserTel);
            }
            //验证码校验
            $scope.validTelCheckCode($scope.telCheckCode);
            if(!$scope.checkSuccess || !$scope.checkSuccess1 || !$scope.checkSuccess2){
              return;
            }
            if ($scope.user.newUserTel == $scope.user.userTel) {
              toaster.pop('error', '错误', '新手机号与旧手机号相同');
              return;
            }
            User.updateUserTel({
              newUserTel: $scope.user.newUserTel,
              userTel: $scope.user.userTel,
              telCheckCode:$scope.telCheckCode
            }, {}, function () {
              toaster.pop('success', '成功', '手机修改成功。');
              $scope.userInfo.userTel = $scope.user.newUserTel.substr(0, 3)
                  + '****' + $scope.user.newUserTel.substr(7);
              $scope.user.userTel = null;
              $scope.user.newUserTel = null;
              $scope.checking = false;
              $scope.checkSuccess = false;
              $scope.checkFailed = false;
              $scope.checking1 = false;
              $scope.checkSuccess1 = false;
              $scope.checkFailed1 = false;
              $scope.emailSuccess = false;
              $scope.codeSuccess = false;
              $scope.validSuccess = false;
              window.location.href = "vendor#/account/management/sec";
              window.location.reload();
              $modalInstance.close();
            }, function (response) {
              toaster.pop('error', '错误', response.data);
              //$modalInstance.close();
            });
          };

          $scope.cancel = function () {
            $modalInstance.close();
          };
        }]);

  // 设置支付密码Controller
  app.register.controller('UserPayCtrl',
      ['$rootScope', '$scope', '$modalInstance', 'user', 'User', 'toaster',
        function ($rootScope, $scope, $modalInstance, user, User, toaster) {
          $rootScope.$on('$stateChangeStart',
              function(event, toState, toParams, fromState, fromParams){
                $modalInstance.dismiss();
          })
          //原密码框是否显示
          $scope.user = angular.copy(user);
          $scope.checking = true;
          $scope.showNewUserPay = false;
          $scope.showUserPay = false;
          $scope.showNewUserPay1 = false;
          $scope.reloadKeyboard = function (type, $event) {
            $event.stopPropagation();
            if (type === 'showNewUserPay') {
              $scope.showNewUserPay = !$scope.showNewUserPay;
              if (!$scope.showNewUserPay) {
                $scope.checkNewUserPay($scope.user.newUserPay);
              } else {
                $scope.closeOtherKeyboard('showNewUserPay');
              }
            } else if (type === 'showUserPay') {
              $scope.showUserPay = !$scope.showUserPay;
              if (!$scope.showUserPay) {
                $scope.checkUserPay($scope.user.userPay);
              } else {
                $scope.closeOtherKeyboard('showUserPay');
              }
            } else if (type === 'showNewUserPay1') {
              $scope.showNewUserPay1 = !$scope.showNewUserPay1;
              if (!$scope.showNewUserPay1) {
                $scope.checkNewUserPay1($scope.user.newUserPay1);
              } else {
                $scope.closeOtherKeyboard('showNewUserPay1');
              }
            }
          }

          function resetNewUserPay() {
            $scope.showNewUserPay = false;
            $scope.checkNewUserPay($scope.user.newUserPay);
          }

          function resetUserPay() {
            $scope.showUserPay = false;
            $scope.checkUserPay($scope.user.userPay);
          }

          function resetNewUserPay1() {
            $scope.showNewUserPay1 = false;
            $scope.checkNewUserPay1($scope.user.newUserPay1);
          }

          $scope.closeOtherKeyboard = function (type) {
            if (type == 'showNewUserPay') {
              if ($scope.showUserPay) {
                resetUserPay();
              } else if ($scope.showNewUserPay1) {
                resetNewUserPay1();
              }
            } else if (type == 'showUserPay') {
              if ($scope.showNewUserPay) {
                resetNewUserPay();
              } else if ($scope.showNewUserPay1) {
                resetNewUserPay1();
              }
            } else if (type == 'showNewUserPay1') {
              if ($scope.showNewUserPay) {
                resetNewUserPay();
              } else if ($scope.showUserPay) {
                resetUserPay();
              }
            }
          }
          $scope.closeKeyboard = function () {
            if ($scope.showNewUserPay) {
              $scope.showNewUserPay = false;
              $scope.checkNewUserPay($scope.user.newUserPay);
            } else if ($scope.showUserPay) {
              $scope.showUserPay = false;
              $scope.checkUserPay($scope.user.userPay);
            } else if ($scope.showNewUserPay1) {
              $scope.showNewUserPay1 = false;
              $scope.checkNewUserPay1($scope.user.newUserPay1);
            }
          }
          //验证是否设置密码
          $scope.isNewSuccess = false;
          $scope.isNewFailed = false;
          $scope.checkHaveUserPay = function () {
            $scope.isNewSuccess = false;
            $scope.isNewFailed = true;
            User.checkHaveUserPay(function (data) {
              var flag = data.data;
              if (flag == "false") {
                //隐藏原密码输入框
                angular.element(".oldUserPay").remove();
                //修改新密码框内容
                $scope.newUserPayLabel = "密码";
                $scope.isNewSuccess = true;
                $scope.isNewFailed = false;
              }
            });
          }

          //校验原密码是否正确
          $scope.checkFailed = false;
          $scope.checkSuccess = false;
          $scope.checkUserPay = function (userPay) {
            if (userPay == null) {
              $scope.checkFailed = true;
              $scope.checkSuccess = false;
              return false;
            }
            $scope.checkSuccess = false;
            $scope.checkFailed = false;
            User.checkUserPay({userPay: userPay}, function () {
              $scope.checkFailed = false;
              $scope.checkSuccess = true;
            }, function () {
              $scope.checkFailed = true;
              $scope.checkSuccess = false;
            });
          }

          //输入新密码，进行校验
          $scope.checkSuccess1 = false;
          $scope.checkFailed1 = false;
          $scope.checkNewUserPay = function (newUserPay) {
            if (newUserPay == null) {
              $scope.checkFailed1 = true;
              $scope.checkSuccess1 = false;
              return false;
            }
            //如果两者相同 则返回
            if ($scope.checking && ($scope.user.userPay
                    == $scope.user.newUserPay)) {
              toaster.pop('error', '错误', '新密码与原密码相同');
              $scope.checkFailed1 = true;
              $scope.checkSuccess1 = false;
              return false;
            }
            //正则校验
            var reg = /^\d{6}$/;
            if (!reg.test(newUserPay)) {
              $scope.checkFailed1 = true;
              $scope.checkSuccess1 = false;
              return false;
            }
            $scope.checkFailed1 = false;
            $scope.checkSuccess1 = true;
          }


          //校验确认密码是否与新密码相同
          $scope.checkSuccess2 = false;
          $scope.checkFailed2 = false;
          $scope.checkNewUserPay1 = function () {
            if($scope.user.newUserPay1 == null){
              $scope.checkSuccess2 = false;
              $scope.checkFailed2 = true;
            }
            if ($scope.user.newUserPay1 != null) {
              //如果输入密码正确，并且输入密码=重新输入密码
              if ($scope.checkSuccess1 && ($scope.user.newUserPay
                      == $scope.user.newUserPay1)) {
                $scope.checkSuccess2 = true;
                $scope.checkFailed2 = false;
                return false;
              }
              $scope.checkSuccess2 = false;
              $scope.checkFailed2 = true;
            }
          }

          //支付密码
          $scope.ok = function () {
            //原密码校验
            if(!$scope.checkSuccess && $scope.userInfo.havePayPwd){
              $scope.checkUserPay($scope.user.userPay);
            }
            //新密码校验
            $scope.checkNewUserPay($scope.user.newUserPay);
            //密码确认
            $scope.checkNewUserPay1();
            if((!$scope.checkSuccess && $scope.userInfo.havePayPwd) || !$scope.checkSuccess1 || !$scope.checkSuccess2){
              return;
            }
            if ($scope.checking && ($scope.user.newUserPay
                    == $scope.user.userPay)) {
              toaster.pop('error', '错误', '新密码与旧密码相同');
              return;
            }
            User.updateUserPay({
              newUserPay: $scope.user.newUserPay,
              userPay: $scope.user.userPay
            }, {}, function () {
              toaster.pop('success', '成功', '支付密码设置成功。');
              $scope.user.userPay = null;
              $scope.user.newUserPay = null;
              $scope.checkSuccess = false;
              $scope.checkFailed = false;
              $scope.checkSuccess1 = false;
              $scope.checkFailed1 = false;
              $scope.checkSuccess2 = false;
              $scope.checkFailed2 = false;
              $scope.checking = true;
              window.location.href = "vendor#/account/management/sec";
              window.location.reload();
              $modalInstance.close();
            }, function (response) {
              toaster.pop('error', '错误', response.data);
              $modalInstance.close();
            });
          };

          $scope.cancel = function () {
            $modalInstance.close();
          };
        }]);

  // 设置密保问题Controller
  app.register.controller('UserQuestionCtrl',
      ['$rootScope', '$scope', '$modalInstance', 'user', 'User', 'toaster','$timeout',
        function ($rootScope, $scope, $modalInstance, user, User, toaster,$timeout) {
          $rootScope.$on('$stateChangeStart',
              function(event, toState, toParams, fromState, fromParams){
                $modalInstance.dismiss();
          })
          //查询所有的密保问题
          $scope.pageInfo = {page: 1, count: 20};
          User.getAllSecQuestion($scope.pageInfo, function (data) {
            $scope.secQuestions = data.content;
            //查询当前用户密保问题
            User.getUserQuestion({userUU: $scope.userInfo.userUU},function (data) {
              $scope.uq[0] = data[0];
              $scope.uq[1] = data[1];
            });
          });
          //选择问题 校验
          $scope.checkSuccess = false;
          $scope.checkFailed = false;
          $scope.checkSuccess2 = false;
          $scope.checkFailed2 = false;
          $scope.choose = function () {
            if ($scope.uq[0]!=undefined && $scope.uq[0].question != undefined && $scope.uq[0].question!="") {
              $scope.checkSuccess = true;
              $scope.checkFailed = false;
            } else {
              $scope.checkSuccess = false;
              $scope.checkFailed = true;
            }
          }

          $scope.choose1 = function () {
            if ($scope.uq[1]!=undefined && $scope.uq[1].question != undefined && $scope.uq[1].question!="") {
              $scope.checkSuccess2 = true;
              $scope.checkFailed2 = false;
            } else {
              $scope.checkSuccess2 = false;
              $scope.checkFailed2 = true;
            }
          }

          //答案校验 不超过30个字符
          $scope.checkSuccess1 = false;
          $scope.checkFailed1 = false;
          $scope.checkFailed1_1 = false;
          $scope.checkSuccess3 = false;
          $scope.checkFailed3 = false;
          $scope.checkFailed3_1 = false;
          $scope.inputAnswer = function () {
            if ($scope.uq[0]==undefined || $scope.uq[0].answer == undefined || $scope.uq[0].answer=="") {
              $scope.checkSuccess1 = false;
              $scope.checkFailed1 = true;
              $scope.checkFailed1_1 = false;
              return false;
            }
            if ($scope.uq[0].answer.length > 30) {
              $scope.checkSuccess1 = false;
              $scope.checkFailed1 = false;
              $scope.checkFailed1_1 = true;
              return false;
            }
            $scope.checkSuccess1 = true;
            $scope.checkFailed1 = false;
            $scope.checkFailed1_1 = false;
          }

          $scope.inputAnswer1 = function () {
            if ($scope.uq[1]==undefined || $scope.uq[1].answer == undefined || $scope.uq[1].answer=="") {
              $scope.checkSuccess3 = false;
              $scope.checkFailed3 = true;
              $scope.checkFailed3_1 = false;
              return false;
            }
            if ($scope.uq[1].answer.length > 30) {
              $scope.checkSuccess3 = false;
              $scope.checkFailed3 = false;
              $scope.checkFailed3_1 = true;
              return false;
            }
            $scope.checkSuccess3 = true;
            $scope.checkFailed3 = false;
            $scope.checkFailed3_1 = false;
          }

          //保存密保
          $scope.ok = function () {
            //问题1校验
            $scope.choose();
            $scope.inputAnswer();
            $scope.choose1();
            $scope.inputAnswer1();
            if(!$scope.checkSuccess || !$scope.checkSuccess1 || !$scope.checkSuccess2 || !$scope.checkSuccess3){
              return;
            }
            var arr = [];
            for (var key in $scope.uq) {
              $scope.uq[key].sort = Number(key) + 1;
              arr[key] = $scope.uq[key];
            }
            User.updateUserQuestion({}, arr, function () {
              toaster.pop('success', '成功', '密保问题设置成功。');
              $modalInstance.close();
              $scope.uq = null;
              $scope.checkSuccess = false;
              $scope.checkFailed = false;
              $scope.checkSuccess1 = false;
              $scope.checkFailed1 = false;
              $scope.checkSuccess2 = false;
              $scope.checkFailed2 = false;
              $scope.checkSuccess3 = false;
              $scope.checkFailed3 = false;
              $scope.checkFailed3_1 = false;
              $scope.checkFailed1_1 = false;
              window.location.href = "vendor#/account/management/sec";
              window.location.reload();
              $modalInstance.close();
            }, function (response) {
              toaster.pop('error', '错误', response.data);
              $modalInstance.close();
            });
          };
          $scope.cancel = function () {
            $modalInstance.close();
          };
        }]);

  // 实名认证Controller
  app.register.controller('UserRealAuthCtrl',
      ['$rootScope', '$scope', '$modalInstance', 'user', 'User', 'toaster',
        function ($rootScope, $scope, $modalInstance, user, User, toaster) {
          $rootScope.$on('$stateChangeStart',
              function(event, toState, toParams, fromState, fromParams){
                $modalInstance.dismiss();
          })
          $scope.user = user;
          //姓名验证  不超过20个字符
          $scope.checkSuccess = false;
          $scope.checkFailed = false;
          $scope.checkUserName = function (userName) {
            if (!userName) {
              //toaster.pop('error', '请输入您的真实姓名');
              $scope.checkSuccess = false;
              $scope.checkFailed = true;
              return false;
            } else if (userName.length > 20) {
              //toaster.pop('error', '请勿超过20个字符');
              $scope.checkSuccess = false;
              $scope.checkFailed_1 = true;
              return false;
            } else {
              $scope.checkSuccess = true;
              $scope.checkFailed = false;
              $scope.checkFailed_1 = false;
            }
          }

          //检查身份证
          $scope.checkSuccess1 = false;
          $scope.checkFailed1 = false;
          $scope.checkFailed1_1 = false;
          $scope.checkUserIdcode = function (userIdcode) {
            if (userIdcode == null) {
              //toaster.pop('error', '请输入您的身份证号');
              $scope.checkSuccess1 = false;
              $scope.checkFailed1 = true;
              $scope.checkFailed1_1 = false;
              return false;
            } else if (!(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(userIdcode))) {
              //toaster.pop('error', '请输入18位的身份证号');
              $scope.checkSuccess1 = false;
              $scope.checkFailed1 = false;
              $scope.checkFailed1_1 = true;
              return false;
            } else {
              $scope.checkSuccess1 = true;
              $scope.checkFailed1 = false;
              $scope.checkFailed1_1 = false;
            }
          }

          //图片上传
          $scope.checkSuccess2 = false;
          $scope.onUploadID = function ($data) {
            if (!$data || !$data.path) {
              toaster.pop('error', '图片上传失败');
              return;
            }
            $scope.user.idImgUrl = $data.path;
            $scope.checkSuccess2 = true;
          };

          $scope.deleteImg =function () {
            $scope.user.idImgUrl = '';
            $scope.checkSuccess2=false;
          };

          // 查看范例
          $scope.showImg = function(imgUrl) {
            var src = imgUrl, box = $('#image-box'), modal = $('.modal-content');
            box.show();
            box.find('img').attr('src', src);
            box.find('a').click(function(){
              box.hide();
            });
            box.dblclick(function(){
              box.hide();
            });
          };
          //保存
          $scope.ok = function () {
            //姓名
            $scope.checkUserName($scope.user.userName);
            //身份证
            $scope.checkUserIdcode($scope.user.userIdcode);
            //身份证
            if(!$scope.checkSuccess2){
              toaster.pop('error', '错误', '请上传您的证件...');
              return;
            }
            if(!$scope.checkSuccess || !$scope.checkSuccess1 || !$scope.checkSuccess2){
              return;
            }
            User.updateRealAuth({userName:$scope.user.userName,userIdcode:$scope.user.userIdcode,idImgUrl:$scope.user.idImgUrl},{},function(){
              toaster.pop('success', '成功', '身份信息提交成功。');
              $modalInstance.close();
              $scope.checkSuccess2 = false;
              $scope.checkSuccess1 = false;
              $scope.checkFailed1 = false;
              $scope.checkSuccess = false;
              $scope.checkFailed = false;
              window.location.href = "vendor#/account/management/sec";

                        window.location.reload();
                        $modalInstance.close();
                    }, function (response) {
                        toaster.pop('error', '错误', response.data);
                        $modalInstance.close();
                    });
                };

                $scope.cancel = function () {
                    $modalInstance.close();
                };
            }]);
//角色管理-编辑角色controller
    app.register.controller('RoleEditCtrl', ['$scope', '$modalInstance', '$timeout', 'AccountResource', 'AccountRole', 'toaster', 'role', 'BaseService', function ($scope, $modalInstance, $timeout, AccountResource, AccountRole, toaster, role, BaseService) {
        BaseService.scrollBackToTop();
        $scope.role = role||{};
        $scope.master = angular.copy($scope.role);
        var isNew = role == null;
        $scope.cancel = function () {
            $modalInstance.close(false);
        };

        var getCheckRoleResource = function (data, rs) {
            if (data.items.length > 0) {
                var c = 0;
                angular.forEach(data.items, function (item) {
                    if (rs.indexOf(item.id) > -1) {
                        item.$checked = true;
                        c += 1;
                    }
                });
                data.$checked = c > 0 && c == data.items.length;
                data.$halfChecked = c > 0 && c < data.items.length;
            } else {
                angular.forEach(data.children, function (item) {
                    getCheckRoleResource(item, rs);
                    var activeCount = 0;
                    angular.forEach(data.children, function (item) {
                        if (!item.$checked) {
                            activeCount ++;
                        }
                    });
                    data.$checked = activeCount > 0 && activeCount == data.children.length;

                    data.$halfChecked = activeCount > 0 && activeCount < data.children.length;
                });
            }
        }

        AccountResource.query({}, function (data) {
            if (data && data.length > 0) {
                var rs = [];// 已分配的资源的id
                if (role && role.resourceItems) {
                    angular.forEach(role.resourceItems, function (item) {
                        rs.push(item.id);
                    });
                }
                angular.forEach(data, function (data2) {
                    getCheckRoleResource(data2, rs);
                })
                $scope.resourceItems = data[0].items;
                data[0].$active = true;
            }
            $scope.resources = data;
            // if ($scope.role) {
            // 	angular.forEach($scope.role.resourceItems,function (item) {
            // 		angular.forEach($scope.resources, function (roleItem) {
            // 			if (item.id == roleItem.id) {
            // 				roleItem.$active = true;
            // 			}
            // 		})
            // 	})
            // }
            $timeout(function () {
                angular.forEach($scope.resources, function (resource) {
                    var c = 0;
                    angular.forEach(resource.items, function (item) {
                        item.$checked && (c += 1);
                    });
                    angular.element(document.getElementById('check_' + resource.id)).prop('indeterminate', (c > 0 && !resource.$checked));
                });
            }, 100);
            getChecked();
        });

        $scope.onItemClick = function (resource) {
            if (resource.items.length > 0) {
                $scope.resourceItems = resource.items;
                $scope.activeResource = resource
            } else {
                $scope.resourceItems = [];
                if (!resource.activeLevel) {
                    resource.activeLevel = true;
                } else {
                    resource.activeLevel = false;
                }
            }
            setNoActive($scope.resources);
            resource.$active = true;
        };
        var setNoActive = function (obj) {
            angular.forEach(obj, function (r) {
                r.$active = false;
                if (r.children) {
                    setNoActive(r.children);
                }
            });
        }

        var getChecked = function () {
            var items = [];
            angular.forEach($scope.resources, function (resource) {
                pushCheckedResource(resource, items);
            });
            if ($scope.role) {
                $scope.role.resourceItems = items;
            }
        };
        var pushCheckedResource = function (resource, items) {
            if (resource.items.length > 0) {
                var activeCount = 0;
                angular.forEach(resource.items, function (item) {
                    // item.$checked && items.push(item);
                    if (item.$checked) {
                        items.push(item);
                        activeCount ++;
                    }
                });
                resource.$checked = activeCount > 0 && activeCount == resource.items.length;
                resource.$halfChecked = activeCount > 0 && activeCount < resource.items.length;

            } else {
                var halfCount = 0;
                var fullCount = 0;
                angular.forEach(resource.children, function (item) {
                    if (item.$checked) {
                        fullCount ++;
                    } else if (item.$halfChecked) {
                        halfCount ++;
                    }
                    pushCheckedResource(item, items);
                })
                resource.$halfChecked = halfCount > 0 || (fullCount > 0 && fullCount < resource.children.length);
                resource.$checked = fullCount > 0 && fullCount == resource.children.length;
            }
        }
        $scope.onResourceChange = function (resource) {
            levelResourceChecked(resource);
            getChecked();
        };
        var levelResourceChecked = function (resource) {
            if (resource.items.length > 0) {
                angular.forEach(resource.items, function (item) {
                    item.$checked = resource.$checked;
                });
            } else {
                angular.forEach(resource.children, function (item) {
                    item.$checked = resource.$checked;
                    levelResourceChecked(item);
                });
            }

        }

        $scope.onItemChange = function () {
            var activeCount = 0;
            var resourceItems = $scope.resourceItems;
            // console.log(resourceItems);
            angular.forEach(resourceItems, function (item) {
                if (item.$checked) {
                    activeCount++;
                }
            })
            // console.log(activeCount);
            // console.log( $scope.activeResource)
            $scope.activeResource.$checked = activeCount == resourceItems.length;

            $scope.activeResource.$halfChecked = activeCount > 0 && activeCount < resourceItems.length;

            angular.forEach($scope.resources, function (resource) {
                if (resource.$active) {
                    var c = 0;
                    angular.forEach(resource.items, function (item) {
                        item.$checked && (c += 1);
                    });
                    resource.$checked = (c == resource.items.length);
                    resource.$halfChecked = c > 0 && c < resource.items.length;
                    angular.element(document.getElementById('check_' + resource.id)).prop('indeterminate', (c > 0 && !resource.$checked));
                }
            });
            getChecked();
        };
        $scope.isChanged = function (formData) {
            if (!$scope.master)
                return true;
            return !angular.equals(formData, $scope.master);
        };
        $scope.save = function () {
            $scope.master = angular.copy($scope.role);
            if (!$scope.master.color || $scope.master.color == '') {
                $scope.master.color = parseInt(Math.random() * 5) + 1 + '';
            }
            AccountRole.save($scope.master, function () {
                toaster.pop('success', '提示', '角色：' + $scope.role.desc + ' 资料' + (isNew ? '添加' : '修改') + '成功');
                $modalInstance.close(true);
            }, function (response) {
                toaster.pop('error', '错误', response.data);
            });
        };
        $scope.del = function () {
            if (confirm('确定删除角色(' + $scope.role.desc + ')吗？')) {
                AccountRole.remove({id: role.id}, function () {
                    toaster.pop('success', '提示', '角色：' + $scope.role.desc + ' 删除成功');
                    $modalInstance.close(true);
                }, function (response) {
                    toaster.pop('error', '错误', response.data);
                });
            }
        };
    }]);

    app.register.controller('UserRoleEditCtrl', ['$scope', '$modalInstance', '$timeout', 'AccountResource', 'toaster', 'user', 'BaseService', 'AccountRole', 'User', function ($scope, $modalInstance, $timeout, AccountResource, toaster, user, BaseService, AccountRole, User) {

        $scope.pages = [];

        $scope.params = {
            page: 1,
            count: 6,
            totalPage: 1,
            currentPage: 1
        };

        var loadCurrentRoles = function () {
            var start = ($scope.params.page - 1) * $scope.params.count;
            var end = $scope.params.page * $scope.params.count;
            $scope.currentRoles = $scope.rolesData.slice(start, end);
        };

        var init = function () {
            $scope.user = angular.copy(user);
            AccountRole.query({}, function (data) {
                $scope.rolesData = data;
                loadCurrentRoles();
                $scope.params.totalPage = Math.ceil($scope.rolesData.length / 6);
                $scope.acculatePages(1, $scope.params.totalPage);
                angular.forEach($scope.rolesData, function (item) {
                    item.checked = false;
                    angular.forEach($scope.user.roles, function (userItem) {
                        if (item.id === userItem.id) {
                            item.checked = true;
                        }
                    });
                });
            });
        }
        init();

        $scope.checked = [];
        //勾选角色
        $scope.checkRole = function (role) {
            role.checked = !role.checked;
        }

        //关闭模态框
        $scope.cancelModal = function () {
            $modalInstance.close();
        }
        $scope.close = function (save) {
            if (save) {
                if (user.userUU) {
                    angular.forEach($scope.rolesData, function (item) {
                        if (item.checked) {
                            $scope.checked.push(item);
                        }
                    });
                    $scope.user.roles = $scope.checked;
                    User.update({}, $scope.user, function () {
                        toaster.pop('success', '提示', '保存成功');
                        user.roles = $scope.checked
                        $modalInstance.close(true);
                    }, function (response) {
                        toaster.pop('error', '保存失败', response.data);
                    });
                } else {
                    $modalInstance.close(true, $scope.checked);
                }
            } else {
                $modalInstance.close(false);
            }
        };

        // //初始化分页数据
        // var initPages = function () {
        // 	$scope.totalPages = Math.ceil = ($scope.rolesData.length/6);
        // }
        //初始化页数信息
        $scope.initPages = function (totalElementPages) {
            var pageNum = [];
            if (totalElementPages == 1) {
                return;
            } else if (totalElementPages < 10) {
                for (var i = 0; i < totalElementPages + 2; i++) {
                    pageNum.push(i);
                }
            } else {
                pageNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            }
            angular.forEach(pageNum, function (number) {
                var page = {active: true, type: 'page', number: number};
                if (number == 0) {
                    page.type = 'prev';
                } else if (number == 1) {
                    page.type = 'first';
                } else if (number == pageNum.length - 2) {
                    page.type = 'last';
                    page.number = totalElementPages;
                } else if (number == pageNum.length - 1) {
                    page.type = 'next';
                }
                $scope.pages.push(page);
            });
        };

        //当前页在后端计算方式
        $scope.endSegment = function (currentPage, totalElementPages) {
            if (totalElementPages > 8) {
                angular.forEach($scope.pages, function (page) {
                    switch (page.number) {
                        case 2:
                            page.active = false;
                            page.type = 'more';
                            break;
                        case 10:
                            if (currentPage == totalElementPages) {
                                page.active = false;
                            }
                            break;
                        case 0:
                        case 1:
                            break;
                        default:
                            if (page.number != totalElementPages) {
                                page.number = totalElementPages - 9 + page.number;
                            }
                            page.current = (currentPage == page.number);
                            break;
                    }
                });
            }
        };

        //当前页在中间计算方式
        $scope.middleSegment = function (currentPage) {
            angular.forEach($scope.pages, function (page) {
                switch (page.number) {
                    case 2:
                    case 8:
                        page.type = 'more';
                        page.active = false;
                        break;
                    case 3:
                        page.number = currentPage - 2;
                        break;
                    case 4:
                        page.number = currentPage - 1;
                        break;
                    case 5:
                        page.number = currentPage;
                        page.current = true;
                        break;
                    case 6:
                        page.number = currentPage + 1;
                        break;
                    case 7:
                        page.number = currentPage + 2;
                        break;
                }
            });
        };

        //当前页在前段的计算方式
        $scope.frontSegment = function (currentPage, totalElementPages) {
            if (totalElementPages > 8) {
                angular.forEach($scope.pages, function (page) {
                    switch (page.number) {
                        case 8:
                            page.type = 'more';
                            page.active = false;
                            break;
                        case 0:
                            if (currentPage == 1) {
                                page.active = false;
                            }
                        default : {
                            page.current = (currentPage == page.number);
                        }
                    }
                });
            }
        };

        //输入框监听Enter事件
        $scope.listenEnter = function () {
            if (event.keyCode == 13) {
                $scope.setPage("page", $scope.params.currentPage);
            }
        };
        $scope.setPage = function (type, number) {
            if (type != 'prev' && type != 'page' && type != 'next' && type != 'last' && type != 'first') {
                return;
            }
            ;
            var page = -1;
            switch (type) {
                case "page":
                    if (number < 1) {
                        page = 1;
                    } else if (number > $scope.params.totalPage) {
                        page = $scope.params.totalPage;
                    } else {
                        page = number;
                    }
                    ;
                    break;
                case "prev":
                    if ($scope.params.page <= 1) {
                        page = 1;
                    } else {
                        page = $scope.params.page - 1;
                    }
                    ;
                    break;
                case "next":
                    if ($scope.params.page >= $scope.params.totalPage) {
                        page = $scope.params.totalPage;
                    } else {
                        page = $scope.params.page + 1;
                    }
                    break;
                case "first":
                    page = 1;
                    break;
                case "last":
                    page = $scope.params.totalPage;
                    break;
            }
            if (page == $scope.params.page || page < 1 || page > $scope.params.totalPage) {
                $scope.params.currentPage = $scope.params.page;
                return;
            }
            $scope.params.page = page;
            $scope.params.currentPage = page;
            loadData();
        };

        //计算页数的方式。
        $scope.acculatePages = function (currentPage, totalElementPages) {
            $scope.pages = [];
            if (totalElementPages < 1) {
                return;
            }
            //初始化页面数据
            $scope.initPages(totalElementPages);
            if (currentPage < 6) {//当期页小于6
                $scope.frontSegment(currentPage, totalElementPages);
            } else if (currentPage > totalElementPages - 5) { //当期页在后面
                $scope.endSegment(currentPage, totalElementPages);
            } else { //当期页在中间
                $scope.middleSegment(currentPage);
            }
        };

        var loadData = function () {
            loadCurrentRoles();
            $scope.acculatePages($scope.params.page, $scope.params.totalPage);
        };
    }]);
});

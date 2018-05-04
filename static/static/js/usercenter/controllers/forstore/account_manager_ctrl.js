/**
 *  账户管理控制器
 */
define(['app/app'], function (app) {
  "use strict";
  app.register.controller('accountManagerCtrl',
      ['$scope', '$rootScope', 'ngTableParams', 'BaseService',
        'ShippingAddress', '$modal', 'Enterprise', 'User', 'toaster', '$http',
        '$stateParams',
        function ($scope, $rootScope, ngTableParams, BaseService,
            ShippingAddress, $modal, Enterprise, User, toaster, $http,
            $stateParams) {
          document.title = '账户管理-优软商城';
          $rootScope.active = 'account_manager';
          $scope.tab = 'base';
          $scope.userInfo = $rootScope.userInfo;
          // $scope.userInfo.pwdEnable = false;
          // $scope.userInfo.haveUserQuestion = false;
          // $scope.userInfo.userEmail = null;
          $scope.userInfoBackup = angular.copy($scope.userInfo);
          $scope.canAddTotal = 20;

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
          // 获取企业信息
          if ($scope.userInfo.enterprise) {
            Enterprise.getEnterpriseInfo({enuu: $scope.userInfo.enterprise.uu},
                function (data) {
                  $scope.enterpriseInfo = data;
                  if (!$scope.enterpriseInfo.enAddress) {
                    $scope.enterpriseInfo.enAddress = "暂无信息";
                  }
                  if (!$scope.enterpriseInfo.enUrl) {
                    $scope.enterpriseInfo.enUrl = "暂无信息";
                  }
                }, function (response) {
                  toaster.pop('error', '获取企业信息失败');
                });
          }
          ;

          /**
           * 设置默认收货地址
           *
           * @param addressId  买家收货地址ID
           */
          $scope.setDefaultAddress = function (addressId) {
            ShippingAddress.setTop({addid: addressId}, {}, function () {
              $scope.loadAddresses();
            }, function () {
              toaster.pop('error', '设置默认收货地址失败');
            });
          };

          // $scope.checkPhone = function () {
          // 	var keyCode = event.keyCode;
          // 	if (!(keyCode == 46) && !(keyCode == 8)) {
          // 		if (!(keyCode >= 48 && keyCode <= 57)) {
          // 			event.returnValue = false;
          // 		} 
          // 	}
          // };

          // $scope.showEditFrame = false;
          // //编辑地址
          // $scope.modifyAddress = function (address) {
          // 	//拼装下拉选择框
          // 	var arr = address.area.split(',');
          // 	address.province = arr[0];
          // 	address.city = arr[1];
          // 	address.district = arr[2];
          // 	$scope.modifyObject = angular.copy(address);
          // 	$scope.showEditFrame = true;
          // 	$scope.isModify = true;
          // };
          // //新增地址
          // $scope.addAddress = function () {
          // 	$scope.modifyObject = {};
          // 	$scope.showEditFrame = true;
          // 	$scope.isModify = false;
          // };

		//删除地址
		$scope.deleteAddress = function (address) {
			$scope.deleteObject = angular.copy(address);
			$scope.showDeleteFrame = true;
		};

		$scope.cancelDelete = function () {
			$scope.showDeleteFrame = false;
		};

		$scope.ensureDelete = function (addressId) {
			ShippingAddress.del({ addid : addressId }, {}, function () {
				$scope.showDeleteFrame = false;
				$scope.loadAddresses();
			}, function () {
				toaster.pop('error', '删除收货地址失败');
			});
		};
		$scope.telFlag = true;
		$scope.emailFlag = true;
		/**
		 * 验证手机号是否可用
		 */
		$scope.telValid = function (tel) {
			if (tel) {
				if (tel == $scope.userInfoBackup.userTel){
					$scope.telFlag = true;
					return;
				}
				$http.get('basic/user/telEnable', {
					params: {
						tel: tel
					}
				}).success(function (data) {
					data = eval(data);
					if (data == true) {
						$scope.telFlag = true;
					} else {
						if (tel.length == 11)
							toaster.pop('error', '错误', '手机号 ' + tel + ' 已被注册');
						$scope.telFlag = false;
					}
				}).error(function () {
					$scope.telFlag = false;
				});
			} else {
				$scope.telFlag = false;
			}
		};

		/**
		 * 验证邮箱是否可用
		 */
		$scope.emailValid = function (email) {
			if (email) {
				if (email == $scope.userInfoBackup.userEmail){
					$scope.emailFlag = true;
					return;
				}
				$http.get('basic/user/emailEnable', {
					params: {
						email: email
					}
				}).success(function (data) {
					data = eval(data);
					if (data == true) {
						$scope.emailFlag = true;
					} else {
						toaster.pop('error', '错误', '邮箱 ' + email + ' 已被注册');
						$scope.emailFlag = false;
					}
				}).error(function () {
					$scope.emailFlag = false;
				});
			} else {
				$scope.emailFlag = false;
			}
		};
		/**
		 * 变更到更新状态
		 */
		$scope.changeToUpdate = function(isUpdate) {
			$scope.updateState = isUpdate;
			if ($scope.updateState == false){
				$scope.userInfo = angular.copy($scope.userInfoBackup);
			}
		};
		/**
		 * 验证用户信息
		 */
		function validateUserInfo() {
			var props = ['userName', 'userEmail', 'userTel'];

			var flag = true;
			angular.forEach(props, function (prop) {
				if ($scope.userInfo.hasOwnProperty(prop)) {
					if (!$scope.userInfo[prop] || $scope.userInfo[prop] === '') {
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
		 * 保存用户信息
		 */
		$scope.saveUpdate = function () {
			// 先检查信息是否为空
			if (angular.equals($scope.userInfo,$scope.userInfoBackup)){
				toaster.pop('error', '未做任何修改');
				$scope.updateState = false;
				return ;
			}
			var userInfoFlag = validateUserInfo();
			if (!userInfoFlag) {
				toaster.pop('error', '请补充完信息后再次提交');
				return ;
			}

			if ($scope.telFlag && $scope.emailFlag) {
				Enterprise.updateUser({uu: $scope.userInfo.userUU}, $scope.userInfo, function () {
					$scope.loading = false;
					toaster.pop('success', '提示', '用户信息修改成功');
					$scope.userInfoBackup = angular.copy($scope.userInfo);
					$scope.updateState = false;

				}, function (response) {
					$scope.updateState = false;
					$scope.userInfo = angular.copy($scope.userInfoBackup);
					toaster.pop('error', '修改失败', response.data);
				});
			}
			else{
				toaster.pop('error', '提示', '修改失败！');
				$scope.userInfo = angular.copy($scope.userInfoBackup);
				$scope.updateState = false;
			}
		};

		// 分页数据
		$scope.addressList = [];
		//总条数是否大于5个
		$scope.isBiggerFive = false;
		$scope.shippingAddressTableParams = new ngTableParams({
			page : 1,
			count : 20,
			sorting : {
				num : 'ASC'
			}
		}, {
			total : 0,
			getData : function ($defer, params) {
				const param = BaseService.parseParams(params.url());
				param.isSend = false;
				ShippingAddress.pageAddressOfUser(param, {}, function (page) {
					$scope.isBiggerFive = false;
					$scope.total = page.totalElements;
					params.total(page.totalElements);
					if (page.content) {
						$scope.addressList = page.content;
					} else {
						$scope.addressList = [];
					}
					angular.forEach($scope.addressList, function (attr) {
						var arr = attr.area.split(',');
						attr.province = arr[0];
						attr.city = arr[1];
						attr.district = arr[2];
					});
					if($scope.total > 5) {
						$scope.isBiggerFive = true;
					}
				});
			}
		});

		$scope.loadAddresses = function () {
			$scope.shippingAddressTableParams.page(1);
			$scope.shippingAddressTableParams.reload();
		};
		$scope.loadAddresses();

		// 获取区域信息
		$http.get('static/js/prod/data/city.json').success(function(data) {
			$scope.division = data;
		}).error(function() {
			toaster.pop('error', '系统错误 ' + '加载城市信息失败');
		});

		// 切换tab
		$scope.checkTab = function (t) {
			$scope.tab = t;
		};

		$scope.modifyAddress = function (address) {
			$modal.open({
				templateUrl : $rootScope.rootPath + '/static/view/common/modal/edit_address_modal.html',
				controller : 'editAddrCtrl',
				size : 'lg',
				resolve : {
					addr : function(){
						return angular.copy(address);
					},
					isSendType : function () {
						return false;
					},
					isModify : function () {
						if (address){
							return true;
						}else {
							return false;
						}
					}
				}
			}).result.then(function(address){
				if (address) {
					$scope.loadAddresses();
				}
			}, function(){
				// toaster.pop('info', '提示 ' + '您已取消发货地址的编辑');
			});
		};

		//地址编辑模态框
		app.register.controller('editAddrCtrl', ['$scope', 'addr', '$modalInstance', 'toaster', '$http', 'ShippingAddress', 'isSendType', 'isModify', function($scope, addr, $modalInstance, toaster, $http, ShippingAddress, isSendType, isModify){
			if (addr){
				$scope.isSetTop = addr.num == 1;
			}else {
				$scope.isSetTop = false;
			}
			$scope.isSendType = isSendType;
			$scope.isModify = isModify;

                  $scope.checkForm = function (num) {
                    var size;
                    if (num == 1) {
                      if ($scope.address.name) {
                        size = $scope.address.name.replace(/[^\x00-\xff]/g,
                            '**').length;
                        if (size > 20) {
                          console.log(size);
                          $scope.userError = true;
                          return;
                        }
                        $scope.userError = false;
                      }
                    } else if (num == 2) {
                      if ($scope.address.tel) {
                        size = $scope.address.tel.replace(/[^\x00-\xff]/g,
                            '**').length;
                        if (size < 8 || size > 11) {
                          $scope.telError = true;
                          return;
                        }
                        $scope.telError = false;
                        var telPatt = new RegExp("^[0-9]+$");
                        if (telPatt.test($scope.address.tel)) {
                          $scope.telPatternError = false;
                        } else {
                          $scope.telPatternError = true;
                        }
                      }
                    } else if (num == 3) {
                      if ($scope.address.detailAddress) {
                        size = $scope.address.detailAddress.replace(
                            /[^\x00-\xff]/g, '**').length;
                        if (size > 60) {
                          $scope.addrError = true;
                          return;
                        }
                        $scope.addrError = false;
                      }
                    } else if (num == 4) {
                      var emailPatt = new RegExp(
                          "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$");
                      if ($scope.address.email.length > 0 && !emailPatt.test(
                              $scope.address.email)) {
                        $scope.emailPatternError = true;
                      } else {
                        $scope.emailPatternError = false;
                      }
                    }
                  };

			$http.get('static/js/prod/data/city.json').success(function(data) {
				$scope.division = data;
				if(addr && addr.area){
					// $scope.address = addr;
					//拼装下拉选择框
					var arr = addr.area.split(',');
					addr.province = arr[0];
					addr.city = arr[1];
					addr.district = arr[2];
					$scope.address = addr;
				}
			}).error(function() {
				toaster.pop('error', '系统错误 ' + '加载城市信息失败');
			});

			$scope.save = function () {
				var address = $scope.address;

				if (!address){
					toaster.pop('error', '请补充未填写的信息');
					return ;
				}
				if (!address.name || !address.province || !address.city || !address.district ||
					!address.detailAddress || !address.tel){
					toaster.pop('error', '请补充未填写的信息');
					return ;
				}
				if ($scope.userError || $scope.telError || $scope.addrError || $scope.telPatternError ||
					$scope.emailPatternError){
					toaster.pop('error', '请修改红色框内的信息');
					return ;
				}

				//拼装地区
				address.area = address.province + ',' + address.city + ',' + address.district;

                    // send属性 控制本地址是否是发货地址
                    ShippingAddress.save({
                      isSetTop: $scope.isSetTop,
                      send: $scope.isSendType,
                      isPersonal: !$scope.isSendType
                    }, address, function (data) {
                      toaster.pop('success', '成功 ', '保存收货地址成功');
                      $modalInstance.close(data);
                    }, function (res) {
                      toaster.pop('error', '保存收货地址失败 ', res.data);
                    });
                  };

			$scope.cancel = function() {
				$modalInstance.dismiss();
			};
		}]);


		$scope.updatePassword = function(){
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: $rootScope.rootPath + '/static/view/vendor/modal/updatePassword.html',
				controller: 'PasswordCtrl',
				resolve: {
					user: function(){return angular.copy($rootScope.userInfo);}
				}
			});

			modalInstance.result.then(function () {
				window.location.href = "user#/accountManager/sec";
			}, function () {
			});
		};

          $scope.updateUserEmail = function () {
            var modalInstance = $modal.open({
              animation: true,
              templateUrl: $rootScope.rootPath
              + '/static/view/vendor/modal/updateUserEmail.html',
              controller: 'UserEmailCtrl',
              resolve: {
                user: function () {
                  return angular.copy($rootScope.userInfo);
                }
              }
            });

            modalInstance.result.then(function () {
              window.location.href = "user#/accountManager/sec";
            }, function () {
            });
          };

          $scope.updateUserTel = function () {
            var modalInstance = $modal.open({
              animation: true,
              templateUrl: $rootScope.rootPath
              + '/static/view/vendor/modal/updateUserTel.html',
              controller: 'UserTelCtrl',
              resolve: {
                user: function () {
                  return angular.copy($rootScope.userInfo);
                }
              }
            });

            modalInstance.result.then(function () {
            }, function () {
            });
          };

          $scope.updateUserPay = function () {
            var modalInstance = $modal.open({
              animation: true,
              templateUrl: $rootScope.rootPath
              + '/static/view/vendor/modal/updateUserPay.html',
              controller: 'UserPayCtrl',
              resolve: {
                user: function () {
                  return angular.copy($rootScope.userInfo);
                }
              }
            });

            modalInstance.result.then(function () {
            }, function () {
            });
          };

          $scope.updateUserQuestion = function () {
            var modalInstance = $modal.open({
              animation: true,
              templateUrl: $rootScope.rootPath
              + '/static/view/vendor/modal/updateUserQuestion.html',
              controller: 'UserQuestionCtrl',
              resolve: {
                user: function () {
                  return angular.copy($rootScope.userInfo);
                }
              }
            });

            modalInstance.result.then(function () {
              window.location.href = "user#/accountManager/sec";
            }, function () {
            });
          };

          $scope.updateRealAuth = function () {
            var modalInstance = $modal.open({
              animation: true,
              templateUrl: $rootScope.rootPath
              + '/static/view/vendor/modal/updateRealAuth.html',
              controller: 'UserRealAuthCtrl',
              resolve: {
                user: function () {
                  return angular.copy($rootScope.userInfo);
                }
              }
            });

            modalInstance.result.then(function () {
            }, function () {
            });
          };

          //买家中心 等级提示跳转
          if ($stateParams.op != "") {
            var op = $stateParams.op;
            $scope.checkTab('safe');
            switch (op) {
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
                window.location.href = "user#/accountManager/sec";
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
          if($scope.userInfo.userEmail==null ? true:false){
            $scope.checkSuccess = true;
          }

          //验证用户新输入的邮箱是否可用
          $scope.checkSuccess1 = false;
          $scope.checkFailed1 = false;
          $scope.checkFailed1_1 = false;
          $scope.emailEnable = function (newUserEmail) {
            //邮箱不可用 /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
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
              window.location.href = "user#/accountManager/sec";
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

  // 手机验证Controller
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

          // 发送验证码
          $scope.codeSuccess = false;
          $scope.sendSuccess = true;
          // 发送验证码
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
              window.location.href = "user#/accountManager/sec";
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
              window.location.href = "user#/accountManager/sec";
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
              window.location.href = "user#/accountManager/sec";
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
          window.location.href = "user#/accountManager/sec";
          window.location.reload();
          $modalInstance.close();
        }, function(response){
          toaster.pop('error', '错误', response.data);
          $modalInstance.close();
        });
      };

          $scope.cancel = function () {
            $modalInstance.close();
          };
        }]);
});

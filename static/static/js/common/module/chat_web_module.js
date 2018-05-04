
define([ 'common/query/chat', 'common/query/enterprise' ], function() {
	'use strict';
	var module = angular.module('WebChatModule', ['ChatService', 'common.query.enterprise']);

	module.service('ChatBusinessLayer', ['Chat', 'Enterprise', function (Chat, Enterprise) {

		function getParamsFromUserInfo(userInfo) {
			if (!userInfo || !userInfo.enterprises || userInfo.enterprises.length < 1) {
				return {};
			}

			var param = { phone: userInfo.userTel };
			for (var i = 0; i < userInfo.enterprises.length; i++) {
				if (userInfo.enterprises[i].current) {
					param.enUU = userInfo.enterprises[i].uu;
					break ;
				}
			}
			return param;
		}

		function getAdminInfo(enUU) {
			/*Enterprise.getEnterpriseAdminInfo({enuu : enUU}, function(data) {
				var phone = data.userTel;
				if (!/^1\d{10}$/.test(phone)){
					return phone;
				}
			},function(response) {
				return;
			});
*/
			var promise = Enterprise.getEnterpriseAdminInfo({enuu : enUU}, {}).$promise;

			return promise.then(function (data) {
				return data.userTel;
			}, function () {
				return 0;
			});
		}
		
		function accessUnreadMessageCount(param) {
			var promise = Chat.countUnReadSessionsWhenUserQuery(param, {}).$promise;

			return promise.then(function (data) {
				if (data.success && data.success == "false") {
					console.log(data.message);
				}
				return data.success && data.success == "true" ? parseInt(data.count) : 0;
			}, function () {
				return 0;
			});
		}

		function getEnterpriseInfo(enUU) {
			var  promise = Enterprise.getEnterpriseInfo({ enuu: enUU }).$promise;

			return promise.then(function (enterprise) {
				return {
					enUU: enterprise.uu,
					name: enterprise.enName
				}
			});
		}

		/**
		 * 访问web chat页面
		 *
		 * @param chatInfoDto	聊天信息DTO
		 * @param type			聊天类型
		 */
		function visitWebChat(chatInfoDto, type) {
			if (!chatInfoDto || !type || (type === 'CHAT' && !chatInfoDto.otherEnUU)) return {};
			chatInfoDto.type = type;

			var promise = getEnterpriseInfo(chatInfoDto.enUU ? chatInfoDto.enUU : 0).then(function (enterprise) {
				if (enterprise && enterprise.enUU) {
					chatInfoDto.enterprise = enterprise;
				} else {
					chatInfoDto.enterprise = {};
				}
				return chatInfoDto;
			});

			if (type === 'CHAT') {
				promise =  promise.then(function (chatInfoDto) {
					return getEnterpriseInfo(chatInfoDto.otherEnUU).then(function (enterprise) {
						if (enterprise && enterprise.enUU) {
							chatInfoDto.otherEnterprise = enterprise;
						} else {
							chatInfoDto.otherEnterprise = {};
						}
						return chatInfoDto;
					});
				});
			}

			return promise.then(function (chatInfoDto) {
				var promise = Chat.generateChatInfoWhenUserVisitListOrChat({}, chatInfoDto).$promise;

				return promise.then(function (data) {
					if (!data.success) {
						console.log(data.message);
					}
					return data.success ? data.content : null;
				});
			});
		}

		this.visitWebChat = visitWebChat;
		this.getParamsFromUserInfo = getParamsFromUserInfo;
		this.accessUnreadMessageCount = accessUnreadMessageCount;
		this.getAdminInfo = getAdminInfo;
	}]);

	module.controller('ChatContactCtrl', ['$rootScope', 'ChatBusinessLayer', 'toaster','Enterprise', function ($rootScope, ChatBusinessLayer, toaster, Enterprise) {

		var vm = this;
		vm.param = {};
		vm.UserType = { ENTERPRISE: 'ENTERPRISE', STORE: 'STORE' };
		vm.contactWithOther = contactWithOther;

		active();
		
		function active() {
			vm.param = ChatBusinessLayer.getParamsFromUserInfo($rootScope.userInfo);
		}

		/**
		 * 联系联系人
		 *
		 * @param phone		联系人手机号
		 * @param enUU		联系人企业UU
		 * @param userType	联系人用户类型
		 */
		function contactWithOther(phone, enUU, userType) {
			//获得窗口的垂直位置
			var iTop = (window.screen.availHeight - 30 - 780) / 2;
			//获得窗口的水平位置
			var iLeft = (window.screen.availWidth - 10 - 1030) / 2;
			if (!/^1\d{10}$/.test(phone)){
				ChatBusinessLayer.getAdminInfo(enUU).then(function (userTel) {
					phone = userTel;
					/*if (!/^1\d{10}$/.test(phone)){
						toaster.pop('warning', '该店铺暂无管理员电话号码！');
						return;
					}*/
					console.log(phone, enUU, userType,iTop,iLeft);
					startChat(phone,enUU,userType,iTop,iLeft);
				});
			}else {
                startChat(phone,enUU,userType,iTop,iLeft);
			}
		}

		var startChat= function (phone,enUU,userType,iTop,iLeft) {
            if ($rootScope.newTab){
                $rootScope.newTab.close();
            }
            var newTab = window.open('', '即时对话框', 'height=750, width=1000, top=' + iTop + ', left=' + iLeft + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
            newTab.close();
            var newTab = window.open('', '即时对话框', 'height=750, width=1000, top=' + iTop + ', left=' + iLeft + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
			var chatInfoDto = {
                    userPhone: vm.param.phone,
                    enUU: vm.param.enUU,
                    userType: userType == vm.UserType.STORE ? vm.UserType.ENTERPRISE : vm.UserType.STORE,
                    toPhone: phone,
                    otherEnUU: enUU,
                    otherUserType: userType
                };
            ChatBusinessLayer.visitWebChat(chatInfoDto, 'CHAT').then(function (gid) {
                if (!gid || gid == ''){
                    newTab.close();
                    toaster.pop('warning', '您暂未开通聊天帐号！');
                    return;
                }
                //newTab.location.href = 'http://192.168.253.121:20220/chat/visit?gid=' +  gid;
                newTab.location.href = 'https://im.ubtob.com/chat/visit?gid=' + gid;
            }, function (error) {
                console.log(error);
                newTab.close();
                toaster.pop('warning', '对方没有开通客服系统，请联系官方客服！');
            });
            $rootScope.newTab = newTab;
        }

	}]);

});
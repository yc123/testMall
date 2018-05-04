define([ 'ngResource' ], function() {
	angular.module('ChatService', [ 'ngResource' ]).factory('Chat', ['$resource', function($resource) {

		var address = 'https://im.ubtob.com/';
		//var address = 'http://192.168.253.31:20220/';

		return $resource('api/chat/infos', {}, {
            // 获取列表
            get: {
                method: 'GET',
                isArray: true
            },
			/**
			 * 根据手机号获取用户信息
			 *
			 * @param from		发送者手机号
			 * @param to		接收者手机号
			 */
			findChatUserInfo: {
            	url: address + 'api/chat/infos',
				method: 'GET',
				params: {
            		condition: 'phone'
				}
			},
			/**
			 * 用户查询未读会话数据
			 *
			 * @param phone 	用户手机号
			 */
			countUnReadSessionsWhenUserQuery: {
				url: address + 'api/chat/message',
				method: 'GET',
				params: {
					operate: 'count_unread'
				}
			},
			/**
			 * 当用户访问会话列表或发起客服，生成会话信息
			 *
			 * @param chatInfoDto		聊天信息
			 */
			generateChatInfoWhenUserVisitListOrChat: {
				url: address + 'api/chat/infos',
				method: 'POST',
				params: {
					condition: 'chat_info'
				}
			}
		});
	}])
});

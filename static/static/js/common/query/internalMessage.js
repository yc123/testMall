define([ 'ngResource' ], function() {
    angular.module('internalMessageServices', ['ngResource']).factory('InternalMessage', ['$resource', 'BaseService', function ($resource, BaseService) {
        return $resource('internalmessage-service', {}, {
            getUnReadCount: {
                url: 'internalmessage-service/unReadCount',
                method: 'GET'
            },
            getUnReadPrivateCount: {
                url: 'internalmessage-service/unReadCount/private',
                method: 'GET'
            },
            getUnReadPublicCount: {
                url: 'internalmessage-service/unReadCount/public',
                method: 'GET'
            },
            getMessagesPagePrivate: {
                url: 'internalmessage-service/private',
                method: 'GET'
            },
            getMessagesPagePublic: {
                url: 'internalmessage-service/public',
                method: 'GET'
            },
            sendPublic: {
                url: 'internalmessage-service/public/save',
                method: 'POST'
            },
            readMessage: {
                url: 'internalmessage-service/:id',
                method: 'PUT'
            },
            deleteMessage: {
                url: 'internalmessage-service/:id',
                method: 'DELETE'
            },
            deleteBatchMessage: {
                url: 'internalmessage-service/batch/:ids',
                method: 'DELETE'
            },
            // 分页获取消息（管理后台）
            getPageAdmin: {
                url: 'internalmessage-service/admin',
                method: 'GET'
            },
            // 通过消息内容id分页获取消息记录
            getLogsByText: {
                url: 'internalmessage-service/byText',
                method: 'GET'
            }
        });
    }])
});
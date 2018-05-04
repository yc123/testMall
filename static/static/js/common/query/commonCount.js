define([ 'ngResource' ], function() {
    'use strict';
    angular.module('commonCountServices', [ 'ngResource' ]).factory('CommonCountAPI', ['$resource', function($resource) {
        return $resource('api/product/commoncount', {}, {
            // 获取全部激活的计数器
            getActived : {
                method : 'GET',
                isArray : true,
                params : { _status : 'actived'}
            }
        });
    }]);
});


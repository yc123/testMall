define([ 'ngResource' ], function() {
    angular.module('helpServices', ['ngResource']).factory('Help', ['$resource', 'BaseService', function ($resource, BaseService) {
        //获取ComponentSubmit的分页数据
        return $resource('help-service', {}, {
            deleteById: {
                url: 'help-service/:id',
                method: 'DELETE'
            },
            updateNav: {
                url: 'help-service',
                method: 'PUT'
            },
            exchangeDetno: {
                url: 'help-service/exchange',
                method: 'POST'
            }
        });
    }]).factory('HelpAPI', ['$resource', 'BaseService', function ($resource, BaseService) {
        //获取ComponentSubmit的分页数据
        return $resource('api/help-service/issue', {}, {
            //取得完整的消息
            findAllChildren: {
                url: 'api/help-service/helps',
                method: 'GET',
                isArray: true
            },
            findByLevel: {
                url: 'api/help-service/level/:level',
                method: 'GET',
                isArray: true
            },
            findChildren: {
                url: 'api/help-service/children',
                method: 'GET',
                isArray: true
            },
            findStructingNav: {
                url: 'api/help-service/parents/:id',
                method: 'GET',
                isArray: true,
                params: {
                    _status : 'structing'
                }
            },
            get: {
                url: 'api/help-service/:id',
                method: 'GET'
            }
        })
    }]).factory('HelpIssue', ['$resource', 'BaseService', function ($resource, BaseService) {
        //获取ComponentSubmit的分页数据
        return $resource('help-service/issue', {}, {
            //取得完整的消息
            saveAndPublish: {
                url: 'help-service/issue/publish',
                method: 'POST'
            },
            getAll: {
                url: 'help-service/issue/issues',
                method: 'GET',
                params: {
                    _state : 'all'
                }
            },
            getPublished: {
                url: 'help-service/issue/issues',
                method: 'GET',
                params: {
                    _state : 'publish'
                }
            },
            getInputing: {
                url: 'help-service/issue/issues',
                method: 'GET',
                params: {
                    _state : 'inputing'
                }
            },
            get: {
                url: 'help-service/issue/:id',
                method: 'GET'
            },
            deleteById: {
                url: 'help-service/issue/:id',
                method: 'DELETE'
            },
            publish: {
                url: 'help-service/issue/publish',
                method: 'PUT'
            },
            publishAndFlush: {
                url: 'help-service/issue/publishAndFlush/:id',
                method: 'PUT'
            },
            update: {
                url: 'help-service/issue/update',
                method: 'PUT'
            },
            exchangeDetno: {
                url: 'help-service/issue/exchange',
                method: 'POST'
            }
        })
    }]).factory('HelpIssueAPI', ['$resource', 'BaseService', function ($resource, BaseService) {
        //获取ComponentSubmit的分页数据
        return $resource('api/help-service/issues', {}, {
            //取得完整的消息
            getIssues: {
                url: 'api/help-service/issues',
                method: 'GET',
                isArray: true
            },
            getIssue: {
                url: 'api/help-service/issues/:num',
                method: 'GET'
            }
        })
    }]);
});

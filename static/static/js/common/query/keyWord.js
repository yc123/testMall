define([ 'ngResource' ], function() {
  angular.module('keyWordServices', [ 'ngResource' ]).factory('KeyWord', ['$resource', 'BaseService', function($resource, BaseService) {
    const rootPath = BaseService.getRootPath();
    return $resource('keyword', {}, {
      getOneKeyWord:{
        url : 'keyword/getOneKeyWord/:id',
        method : 'GET'
      },
      getKeyWordPageInfo:{
        url : 'keyword/getKeyWordPageInfo',
        method : 'GET'
      },
      deleteKeyWord:{
        url : 'keyword/deleteKeyWord/:id',
        method : 'DELETE'
      },
      saveKeyWord:{
        url : 'keyword/saveKeyWord',
        method : 'PUT'
      },
      batchAddKeyWord:{
        url : 'keyword/batchAddKeyWord',
        method : 'PUT'
      }
    });
  }])
});
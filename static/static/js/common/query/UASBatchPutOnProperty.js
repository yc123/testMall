define([ 'ngResource'], function() {
    angular.module('UASBatchPutOnPropertyModule', [ 'ngResource']).factory('UASBatchPutOnPropertyServices', ['$resource' , function($resource) {
        return $resource('UASBatchPutOnProperty', {}, {
            save: {
                url : 'UASBatchPutOnProperty/save',
                method : 'POST'
            }
        });
    }]);
});
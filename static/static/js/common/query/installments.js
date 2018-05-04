define([ 'ngResource' ], function() {
    angular.module('installmentServices', [ 'ngResource' ]).factory('Installment', ['$resource', 'BaseService', function($resource, BaseService) {
        var rootPath = BaseService.getRootPath();
        return $resource('/trade/installments', {}, {
            // 新增分期信息
            addInstallment: {
                url: rootPath + '/trade/installments',
                method: 'POST'
            },
            // 更新分期信息
            updateInstallment: {
                url: rootPath + '/trade/installments',
                method: 'PUT'
            },
            // 删除分期信息
            deleteInstallment: {
                url: rootPath + '/trade/installments/:purchaseId',
                method: 'DELETE'
            },
            // 验证是否能启用分期信息
            validationCount: {
                url: rootPath + '/trade/installments/:purchaseId/validate',
                method: 'GET'
            }
        });
    }])
});

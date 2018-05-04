define([ 'ngResource' ], function() {
    angular.module('materialServices', ['ngResource']).factory('Material', ['$resource', function ($resource) {
        return $resource('trade/products', {}, {
            // 获取全部物料信息
            getAll: {
                url: 'trade/products',
                method: 'GET',
                params: {
                    _status : 'all'
                }
            },
            // 获取全部个人物料信息
            getAllByPerson: {
                url: 'trade/products/person',
                method: 'GET',
                params: {
                    _status : 'all'
                }
            },
            // 删除
            deleteBatch: {
                url: 'trade/products/:ids',
                method: 'DELETE'
            },
            // 绑定个人物料
            setAllProductsByPerson: {
                url: 'trade/products/person',
                method: 'POST'
            },
            // 批量保存个人替代物料信息
            setProductReplacesByPerson: {
                url: 'trade/products/productReplace',
                method: 'POST'
            },
            // 删除所有非标的信息
            deleteUnstandardAll: {
                url: 'trade/products/unstandard',
                method: 'DELETE'
            },
            // 删除所有非标的信息
            deleteStandardAll: {
                url: 'trade/products/standard',
                method: 'DELETE'
            },
            // 单个匹配
            match: {
                url: 'trade/products/match/:id',
                method: 'GET'
            },
			// 根据标准产品进行商品上架
			newStockByStandardProduct: {
            	url: 'trade/products/:id/stock',
				method: 'POST'
            },
            // 一键匹配
            matchAll : {
                url: 'trade/products/match',
                method: 'GET'
            },
            // 匹配非标产品，非标上架版本
            matchNonProduct : {
                url: 'trade/products/match/nonProduct',
                method: 'GET'
            },
            // 多选匹配，非标上架版本
            matchSelected : {
                url: 'trade/products/match/selected',
                method: 'POST'
            },
            // 根据批次获取产品列表
            getDataByBatch : {
                url: 'trade/products/match/batch',
                method: 'GET',
                isArray: true
            },
            updateProduct : {
                url: 'trade/products/update',
                method: 'POST'
            },
            // 获取物料交易信息
            getProductDetail : {
                url: 'trade/products/detail/:id',
                method: 'GET'
            },
            submitProduct: {
                url: 'trade/products/validition',
                method: 'POST'
            },
            saveDetail: {
                url: 'trade/products/savedetail/:productId',
                method: 'POST'
            },
            //返回标准和非标的数量
            getCountOfProduct : {
                url: 'trade/products/count',
                method: 'GET'
            },
            //根据物料id的信息获取产品信息
            getGoodsByProductId : {
                url: 'trade/products/goods/productid/:id',
                method: 'GET',
                isArray: true
            },
            //选择保留产品信息后更新在售相关信息
            updateInfoAfterChoose : {
                url: 'trade/products/update/goods',
                method: 'POST'
            },
            // 导出选择的列表
            exportSelectedProduct: {
                url: 'trade/products/template/selected/data',
                method: 'POST'
            },
            //批量上架信息
            batchPutOn: {
                url: 'trade/products/batch',
                method: 'PUT'
            }
        });
    }]);
});
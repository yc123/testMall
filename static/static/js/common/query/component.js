define([ 'ngResource' ], function() {
	angular.module('componentServices', [ 'ngResource' ]).factory('ComponentsSubmit', ['$resource', function($resource) {
		//获取ComponentSubmit的分页数据
		return $resource('produce/componentSubmit', {}, {
			//未审核
			getUnAudited : {
				params : { _state : 'unAudited'}
			},
			//已通过
			getAllow : {
				params : { _state : 'allow'}
			},
			//未通过
			getNotAllow : {
				params : { _state : 'notAllow'}
			}
		});
	}]).factory('ComponentSubmit', ['$resource', function($resource) {
		//对单个ComponentSubmit的操作
		return $resource('produce/componentSubmit/:id', {}, {
			/**
			 * get,根据uuid查找ComponentSubmit详细信息
			 */
			//审核通过
			valid : {
				url : 'produce/componentSubmit/audit',
				method : 'PUT',
				params : {
					valid : true
				}
			},
			//审核不通过
			invalid : {
				url : 'produce/componentSubmit/audit/:id',
				method : 'PUT',
				params : {
					valid : false
				}
			},
			// 下载批量器件建档模板
			downloadExcel : {
				url : 'produce/componentSubmit/template',
				method : 'POST'
			},
			// 未审核批量申请（用户）
			unAuditedBatch : {
				url : 'produce/componentSubmit/batch',
				method : 'GET',
				params : { _status : 'unAudited'}
			},
			// 已通过批量申请（用户）
			passBatch : {
				url : 'produce/componentSubmit/batch',
				method : 'GET',
				params : { _status : 'pass'}
			},
			// 全部批量申请（用户）
			allBatch : {
				url : 'produce/componentSubmit/batch',
				method : 'GET',
				params : { _status : 'all'}
			},
			// 未通过批量申请（用户）
			forbiddenBatch : {
				url : 'produce/componentSubmit/batch',
				method : 'GET',
				params : { _status : 'forbidden'}
			},
			// 全部批量申请（后台）
			allBatchManage : {
				url : 'produce/componentSubmit/manage/batch',
				method : 'GET',
				params : { _status : 'all'}
			},
			// 未审核批量申请（后台）
			unAuditedBatchManage : {
				url : 'produce/componentSubmit/manage/batch',
				method : 'GET',
				params : { _status : 'unAudited'}
			},
			// 已通过批量申请（后台）
			passBatchManage : {
				url : 'produce/componentSubmit/manage/batch',
				method : 'GET',
				params : { _status : 'pass'}
			},
			// 未通过批量申请（后台）
			forbiddenBatchManage : {
				url : 'produce/componentSubmit/manage/batch',
				method : 'GET',
				params : { _status : 'forbidden'}
			},
			// 获取批量申请详情
			getBatchDetails : {
				url : 'produce/componentSubmit/batch/:submitId',
				method : 'GET'
			},
			// 批量器件建档审核通过
			auditBatch : {
				url : 'produce/componentSubmit/audit/batch',
				method : 'PUT'
			},
			// 批量器件建档审核不通过
			unAuditBatch : {
				url : 'produce/componentSubmit/unAudit/batch',
				method : 'PUT'
			},
			// 获取尚未处理的建档申请
			tobe_handleTask : {
				url : 'produce/componentSubmit/getDetail/batch',
				method : 'GET',
				params : {_status : 'tobe_handle'}
			},
			// 获取任务中的建档申请
			pendingTask : {
				url : 'produce/componentSubmit/getDetail/batch',
				method : 'GET',
				params : {_status : 'pending'}
			},
			// 获取已完成的建档申请
			completeTask : {
				url : 'produce/componentSubmit/getDetail/batch',
				method : 'GET',
				params : {_status : 'complete'}
			},
			// 获取爬取失败的建档申请
			failedTask : {
				url : 'produce/componentSubmit/getDetail/batch',
				method : 'GET',
				params : {_status : 'failed'}
			},
			// 选取用户申请发起任务
			saveTask : {
				url : 'produce/componentSubmit/task',
				method : 'POST'
			},
			// 用户直接提交批量建档申请
			saveSubmits : {
				url : 'produce/componentSubmit/submitBatch',
				method : 'POST'
			}
		});
	}]).factory('ComponentVersion', ['$resource', function($resource) {
		//获取根据uuid获取ComponentVersion列表
		return $resource('produce/componentVersion/:uuid', {}, {
			/**
			 * get,根据uuid,version获取ComponentVersion对象
			 */
			//根据uuid获取ComponentVersion列表
			getList : {
				url : 'produce/componentVersion/list/:uuid',
				method : 'GET',
				isArray : true
			},
			//根据uuid获取ComponentVersion数量
			getCount : {
				url : 'produce/componentVersion/count/:uuid',
				method : 'GET'
			}
		});
	}]).factory('ComponentActive', ['$resource', function($resource) {
		//获取ComponentActive的分页数据
		return $resource('api/product/component/:uuid', {}, {
			/*
			 * get 获ComponentsActive的分页数据，根据uuid获得ComponentActive
			 */
			//根据kindid获得ComponentsActiveSimpleInfo的分页数据
			getSimpleInfo : {
				url : 'api/product/component/info',
				method : 'GET',
                isArray : true
			},
            getSimpleInfoByWeight: {
                url : 'api/product/component/searchWeight',
                method : 'GET',
                isArray : true
			},
            setSimpleInfoWeight: {
                url : 'api/product/component/searchWeight',
                method : 'PUT'
			},
			//获取ComponentInfo的分页数据
			getInfoPage: {
				url: 'produce/component/list',
				method: 'GET'
			},
			// 根据UUid获取单个器件的简要信息
			getSimpleInfoByUuid: {
				url: 'api/product/component/Info/:uuid',
				method: 'GET'
			},
			// 根据原厂型号(code)获得ComponentActive
			getByCode : {
				url : 'api/product/component/byCode/:code',
				method : 'GET',
				isArray : true
			},
			// 根据UUId获取器件详情
			getComponentListByUuid: {
				url: 'api/product/component/byUuids',
				method: 'GET',
				isArray: true
			},
			// 禁用ComponentActive
			disable : {
				url : 'produce/component/:uuid/disable',
				method : 'PUT'
			},
			// 根据UUid 获取列表
			getByUuid: {
				url : 'api/product/component/byUuid',
				method : 'GET',
				isArray : true
			},
			//根据批次号获取器件信息
			getByBatchCode: {
				url : 'produce/component/:batchCode/detail',
				method : 'GET'
			},//根据原厂型号和品牌获取器件信息
			getByCodeAndBrandId: {
				url: 'produce/component/codeAndBrandId/:code',
				method: 'GET',
				isArray: true
			},//根据原厂型号和类目获取器件信息
			getByCodeAndKindId: {
				url: 'produce/component/codeAndKindId/:code',
				method: 'GET',
				isArray: true
			},
			/*样品*/
			getProofCompon: {
				url: 'api/product/component/list/proofing',
				method: 'GET'
			},
			hasSamples: {
				url: 'api/product/component/proofing/hasSample',
				method: 'POST'
			},
			recommendProofing: {
				url: 'api/product/component/:qty/recommend/proofing',
				method: 'GET',
				isArray: true
			},
			/*现货*/
			getOriginalCompon: {
				url: 'api/product/component/list/original',
				method: 'GET'
			},
			recommendOriginal: {
				url: 'api/product/component/:qty/recommend/original',
				method: 'GET',
				isArray: true
			},
			// 根据类目id获取封装规格
			getPackagingByKindid: {
				url: 'produce/component/packaging/:kindid',
				method: 'GET',
				isArray: true
			},
			// 批量修改器件类目
			moveCmp: {
				url: 'produce/component/moveCmp',
				method: 'PUT',
				isArray : true
			},
			// 获取每月器件增长数量
			getIncreaseCount: {
				url: 'produce/component/increaseCount',
				method: 'GET',
				isArray: true
			}
		});
	}]).factory('ComponentDisable', ['$resource', function($resource) {
		return $resource('produce/componentDisable/:uuid', {}, {
			/*
			 * get 根据uuid获得ComponentDisable
			 */
			// 分页获取全部已禁用器件的简要信息
			getSimpleInfoPage : {
				url: 'produce/componentDisable/info/ByPage',
				method: 'GET'
			}
		})
	}]).factory('Compare', ['$resource', function($resource) {
		// 产品对比数据处理
		return $resource('api/product/compare', {}, {
			add: {
				url: 'api/product/compare',
				method: 'POST',
				isArray: true
			},
			remove: {
				url: 'api/product/compare',
				method: 'DELETE',
				isArray: true
			},
			get: {
				url: 'api/product/compare',
				method: 'GET',
				isArray: true
			},
			removeAll: {
				url: 'api/product/compare/all',
				method: 'DELETE',
				isArray: true
			}
		});
	}]).factory('ComponentTest', ['$resource', function($resource) {
		return $resource('produce/component/:uuid', {}, {
			/*
			 * get 获ComponentsActive的分页数据，根据uuid获得ComponentActive
			 */
			//获取ComponentActive的分页数据
			getInfoPage: {
				url: 'produce/component/info',
				method: 'GET'
			}
		});
	}]).factory('ComponentActiveAPI', ['$resource', function($resource){
		return $resource('api/product/component', {},{
			//TEST
			getOneComp: {
				url: 'api/product/component/list/test',
				method: 'GET'
			},
			//获取ComponentInfo的分页数据
			getInfoPage: {
				url: 'api/product/component/list',
				method: 'GET'
			},
			//根据uuid获取器件信息
			get: {
				url: 'api/product/component/:uuid',
				method: 'GET'
			},// 根据UUid获取单个器件的简要信息
			getSimpleInfoByUuid: {
				url: 'api/product/component/Info/:uuid',
				method: 'GET'
			},
			getByUuids: {
				url: 'api/product/component/byUuids',
				method: 'GET',
				isArray: true
			},
			// 分页获取简要信息
			getInfo: {
				url: 'api/product/component/info',
				method: 'GET'
			}
		});
	}]);
});
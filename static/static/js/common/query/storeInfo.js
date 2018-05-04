define([ 'ngResource' ], function() {
    'use strict';
    angular.module('storeInfoServices', [ 'ngResource' ]).factory('StoreInfo', ['$resource', 'BaseService', function($resource, BaseService) {
        return $resource('api/store-service/stores', {}, {
            /**
             * 根据店铺UUID获取店铺信息
             */
            findByUuid: {
                url: 'api/store-service/stores',
                method: 'GET'
            },
			/**
			 * 获取当前企业的上一条开铺申请信息
			 */
			findLastUnPassApplyByEnuu: {
				url: 'store-service/applications',
				method: 'GET',
				params: {
					name: 'findLastUnPass'
				}
			},
            /**
             * 申请开店铺
             */
            applyToOpenStore: {
                url : 'store-service/applications',
                method: 'POST'
            },
            /**
             * 通过器件uuid获取店铺信息
             */
            findStoreByUuid: {
                url: 'api/store-service/stores/uuid/:uuid',
                method: 'GET',
                isArray: true
            },
            getUmallStoreId: {
                url: 'api/store-service/stores/UmallStore',
                method: 'GET'
            },
            /**
             * 分页获取待处理的店铺申请
			 * @Deprecated
             */
            getPrepareHandlerApplications: {
                url: 'store-service/applications',
                method: 'GET',
                params: {
                    operate : 'page'
                }
            },
			/**
			 * 分页获取店铺审核信息
			 *
			 * @param params		分页参数
			 * @param status		店铺审核状态
			 * @param type			店铺类型
			 * @param keyword		搜索关键字，主要是公司名称
			 */
			pageStoreApplications: {
            	url: 'store-service/applications',
				method: 'GET',
				params: {
            		operate: 'authPage'
				}
			},
			/**
			 * 保存店铺申请信息
			 *
			 * @param uuid			店铺申请UUID
			 * @param apply			待更新店铺申请信息
			 */
			saveUpdateOfApply: {
				url: 'store-service/applications',
				method: 'PUT',
				params: {
					operate: 'OnlyUpdate'
				}
			},
            handlerApply: {
                url: 'store-service/applications',
                method: 'PUT'
            },
            getStoreInfoByEnuu: {
                url: 'store-service/stores',
                method: 'GET',
                params : {
                    filter : 'enUU'
                }
            },
			getUuidByEnuu: {
				url: 'store-service/byEnUU/uuid',
				method: 'GET'
			},
            // 分页获取店铺信息
            findStoresByPage : {
                url : 'api/store-service/stores',
                method : 'GET',
                params : {
                    op : 'page'
                }
            },
			// 分页获取店铺信息，根据店铺名称过滤
			findStoresPageByKeyword : {
				url : 'store-service/stores/page',
				method : 'GET'
			},
            // 检测当前企业是否已开店铺
            existStore : {
                url : 'store-service/stores',
                method : 'GET',
                params : {
                    op : 'check'
                }
            },
            // 查询当前企业的店铺申请状态信息
            checkShopOwnerApplyStatus : {
                url : 'store-service/applications',
                method : 'GET',
                params : {
                    operator : 'owner'
                }
            },
            // 获取一个新开的推荐店铺信息
            getNewStore : {
                url : 'store-service/stores/new',
                method : 'GET'
            },
			// 根据店铺申请UUID获取店铺申请信息
			findApplyByUuid : {
				url : 'store-service/applications',
				method : 'GET'
			},
			// 获取当前店铺的待处理和已通过申请信息，应当有且只有一条记录
			findShopOwnerApplyByNormalStatus : {
            	url : 'store-service/applications',
				method : 'GET',
				params : {
					status : 'normal'
				}
			},
			// 卖家确认开铺
			confirmOpenStore : {
            	url : 'store-service/applications',
				method : 'PUT',
				params : {
            		operate : 'confirm'
				}
			},
			// 店家维护店铺的基础信息
			updateStoreInfo : {
				url : 'store-service/stores/:uuid',
				method : 'PUT'
			},
			//根据店铺类型获取前5的店铺信息
			fiveStoresByTypes : {
				url : 'api/store-service/stores/five',
				method : 'GET',
				isArray : true
			},
			// 根据店铺的类型统计店铺数量信息
			countByStatusType : {
            	url : 'api/store-service/stores/type/count',
				method : 'GET'
			},
			// 根据店铺类型和关键字信息分页获取店铺信息
			pageStoresByTypesAndKeyword : {
				url : 'api/store-service/stores',
				method : 'GET',
				params : {
					op : 'pageByType'
				}
			},
			// 获取最近开店的店铺信息
			findNewStore : {
				url : 'api/store-service/stores',
				method : 'GET',
				params : {
					filter : 'newStore'
				}
			},
			// 获取交易量前几的店铺的信息
			findTopStoreBySales : {
            	url : 'api/store-service/stores',
				method : 'GET',
				isArray : true,
				params : {
            		filter : 'topBySales'
				}
			},
			// 店铺管理员管理店铺时，分页获取店铺信息
			pageStoreInfoWhenAdminQuery: {
				url: 'store-service/stores',
				method: 'GET',
				params: {
					op: 'admin_page_query'
				}
			},
			/**
			 * 批量获取店铺的信息
			 */
			getContactInfo: {
				url: 'store-service/storeids',
				method: 'GET',
			}
        });
    }]).factory('ConsignmentAgreementRecord', ['$resource', 'BaseService', function ($resource, BaseService) {
    	// 自营转寄售协议，同意操作记录
		return $resource('auth/store/consignment/record', {}, {
			/**
			 * 用户自营转寄售时，获取寄售协议
			 */
			obtainAConsignmentAgreement: {
				url: 'http://www.usoftmall.com/api/help-service/issues/16',
				method: 'GET'
			},
			/**
			 * 用户自营转寄售时，查询用户同意寄售协议的记录
			 */
			findRecordOfUser: {
				url: 'auth/store/consignment/record/findByUser',
				method: 'GET'
			},
			/**
			 * 用户第一次同意自营转寄售时，保存用户的操作记录信息
			 *
			 * @param record 操作记录信息
			 */
			saveRecordWhenUserAgree: {
				url: 'auth/store/consignment/record',
				method: 'POST'
			},
			/**
			 * 管理员在管理后台查看店铺信息时，按操作时间降序获取操作记录信息
			 *
			 * @param pageParams	分页参数
			 * @param enUU			企业UU
			 */
			pageRecordWhenAdminQueryInfo: {
				url: 'auth/store/consignment/record/pageByAdmin',
				method: 'GET'
			},
			/**
			 * 后台管理员分页获取同意寄售协议的企业信息
			 *
			 * @param page 页码，默认从0开始，第一页页码为0
			 * @param size 每页记录数目，默认10条
			 */
			pageEnterpriseWhenAdminQueryRecord: {
				url: 'auth/store/consignment/record/pageEnterprise',
				method: 'GET'
			}
		});
	}]).factory('StoreAdsInformation', ['$resource', function ($resource) {
		return $resource('auth/api/store', {}, {
			/**
			 * 当管理员推荐店铺的时候，保存店铺的广告信息
			 *
			 * @param type		店铺广告类型
			 * @param store		店铺信息
			 */
			tagStoreInWhenAdminRecommend: {
				url: 'auth/api/store/tag-store',
				method: 'PUT'
			},
			/**
			 * 当管理员推荐店铺的时候，取消推荐店铺
			 *
			 * @param type		店铺广告类型
			 * @param store		店铺信息
			 */
			cancelStoreTagsWhenAdminCancel: {
				url: 'auth/api/store/cancel-tag',
				method: 'PUT'
			},
			/**
			 * 用户获取热销店铺列表信息
			 *
			 * @param page		页面，默认从0开始
			 * @param size		页面大小
			 * @param types		店铺类型
			 */
			showSalesListWhenUserQuery: {
				url: 'api/ads/store/sales-list',
				method: 'GET',
				isArray: true
			},
			/**
			 * 用户获取优秀店铺列表信息
			 *
			 * @param page		页面，默认从0开始
			 * @param size		页面大小
			 * @param types		店铺类型
			 */
			showExcellenceListWhenUserQuery: {
				url: 'api/ads/store/excellence-list',
				method: 'GET',
				isArray: true
			}
		});
	}]);
});

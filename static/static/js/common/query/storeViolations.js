define([ 'ngResource' ], function() {
	angular.module('StoreViolationsServices', [ 'ngResource' ])
		.factory('StoreViolations', ['$resource', function($resource) {
			// 店铺违规处理信息
			return $resource('auth/store/violations', {}, {
				/**
				 * 当前管理员发现店铺违规行为时，发起店铺违规处理
				 */
				launchViolationsHandlerWhenAdminFind: {
					url: 'auth/store/violations',
					method: 'POST'
				},
				/**
				 * 当买家有异议时，发起店铺违规申述
				 */
				launchComplaintWhenSellerDisagree: {
					url: 'auth/store/violations',
					method: 'PUT',
					params: {
						op: 'seller_disagree'
					}
				},
				/**
				 * 当管理员收到卖家的申述信息，审核申述信息
				 */
				launchAuthWhenAdminReceiveComplaint: {
					url: 'auth/store/violations',
					method: 'PUT',
					params: {
						op: 'auth_complaint'
					}
				},
				/**
				 * 当卖家收到违规关店通知后，查询我的店铺信息时，获取违规关店信息
				 */
				showViolationsWhenSellerReadNotification: {
					url: 'auth/store/violations',
					method: 'GET',
					params: {
						op: 'seller_read'
					}
				},
				/**
				 * 当管理员重新店铺违规记录时，分页获取店铺违规记录信息
				 */
				pageViolationsWhenAdminQuery: {
					url: 'auth/store/violations',
					method: 'GET',
					params: {
						op: 'admin_page_query'
					}
				},
				/**
				 * 管理员后台恢复店铺经营状态
				 */
				restoreStoreOpenStatusWhenAdminRestore: {
					url: 'auth/store/violations',
					method: 'PUT',
					params: {
						op: 'restore_status'
					}
				}
			});
		}]);
});
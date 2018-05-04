define(['ngResource'], function(ngResource) {
	angular.module('bankInfo', ['ngResource']).factory('bankInfoService', ['$resource', function($resource) {
		return $resource('trade/bankInfo', {}, {
			getBuyPersonalBank : {
				url : 'trade/bankInfo/buy/personal',
				method : 'GET',
				params : {type : 'buyer'}
			},
			getBuyEnterpriseBank : {
				url : 'trade/bankInfo/buy/enterprise',
				method : 'GET',
				isArray : true,
				params : {
					type : 'buyer',
					status : 104
				}
			},
			getSaleEeterpriseBank : {
				url : 'trade/bankInfo/sale/enterprise',
				method: 'GET',
				params : {type : 'sup'}
			},
			getSaleEeterpriseBankAudit : {
				url : 'trade/bankInfo/sale/enterprise',
				method: 'GET',
				isArray : true,
				params : {
					type : 'sup',
					status : 104
				}
			},
			getSaleEeterprise : {
				url : 'trade/bankInfo/sale/enterprise/:enuu',
				method: 'GET',
				isArray : true,
				params : {
					type : 'sup',
					status : 104
				}
			},
			getPageStatusBankInfo : {
				url : 'trade/bankInfo/page/bankinfo',
				method : 'GET'
			},
			//传入uu的
			getVenderBank: {
				url : 'trade/bankInfo/vender/enterprise/:venduu',
				method: 'GET',
				isArray : true,
				params : {
					type : 'sup',
					status : 104
				}
			},
			//不需要传入uu
			getVenderBankDefault: {
				url : 'trade/bankInfo/vender/enterprise',
				method: 'GET',
				isArray : true,
				params : {
					type : 'sup',
					status : 104
				}
			},
			getCountByNumber : {
				url : 'trade/bankInfo/number/count',
				method: 'GET'
			},
			deleteBank : {
				url : 'trade/bankInfo/delete/:id',
				method : 'DELETE'
			},
			
			setDefaultAccount: {
				url : 'trade/bankInfo/setDefaultAccount/:id',
				method : 'GET'
			},
			getAdminEnterAccount: {
				url : 'trade/bankInfo/b2c/enterprise',
				method : 'GET',
				isArray : true,
				params : {
					type : 'mall',
					status : 104
				}
			},
			getAdminPersAccount: {
				url : 'trade/bankInfo/b2c/personal',
				method : 'GET',
				isArray : true,
				params : {type : 'mall'}
			},
			saveBuyPersonalBank : {
				url : 'trade/bankInfo/save/personal',
				method: 'POST',
				params : {type : 'buyer'}
			},

			// saveBuyEnterpriseBank : {
			// 	url : 'trade/bankInfo/save/enterprise',
			// 	method : 'POST',
			// 	params : {type : 'buyer'}
			// },

			//保存商城的企业账户
			saveAdminEnteAccount: {
				url : 'trade/bankInfo/b2c/enterprise/save',
				method : 'POST',
				params : {type : 'mall'}
			},
			//保存商城的个人账户
			saveAdminPerAccount: {
				url : 'trade/bankInfo/b2c/personal/save',
				method : 'POST',
				params : {type : 'mall'}
			},
			//保存卖家的账户信息
			saveSupAccount : {
				url : 'trade/bankInfo/save/enterprise',
				method : 'POST',
				params : {type : 'sup'}
			},
			//管理平台审核银行账户通过方法
			auditBankInfoPass : {
				url : 'trade/bankInfo/audit/:id',
				method : 'PUT',
				params : {status : 'pass'}
			},
			//管理平台审核银行账户通过方法
			auditBankInfoFail : {
				url : 'trade/bankInfo/audit/:id',
				method : 'PUT',
				params : {status : 'fail'}
			}
		});
	}]);
})
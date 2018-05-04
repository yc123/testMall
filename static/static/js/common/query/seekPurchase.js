define([ 'ngResource' ], function() {
	angular.module('seekPurchaseServices', [ 'ngResource' ]).factory('seekPurchase', ['$resource', 'BaseService', function($resource, BaseService) {
		const rootPath = BaseService.getRootPath();
		return $resource('seek', {}, {
		  getSeekUrl: {
		    url: 'seek/accessUrl',
        method: 'GET'
      },
      getSeekPurchaseRate: {
        url: 'seek/offer/getSeekPurchaseRate',
        method: 'GET'
      },
      getSeekPushGoodsPageInfo: {
        url: 'http://218.17.158.219:24000/inquiry/public',
        method: 'GET',
      },
      saveOneSeekPurchase: {
        url: 'http://218.17.158.219:24000/inquiry/buyer/save',
        method: 'POST'
      },
      saveOneSeekPurchaseProd: {
        url: 'https://api-inquiry.usoftmall.com/inquiry/buyer/save',
        method: 'POST'
      },
      saveOffer: {
        url: 'http://218.17.158.219:24000/inquiry/sale/item/save',
        method: 'POST'
      },
      saveOfferProd: {
        url: 'https://api-inquiry.usoftmall.com/inquiry/sale/item/save',
        method: 'POST'
      },
      getUserSeekPageInfo: {
        url: 'http://218.17.158.219:24000/inquiry/buyer/list',
        method: 'GET'
      },
      getUserSeekPageInfoByStatus: {
        url: 'http://218.17.158.219:24000/inquiry/buyer/quotations',
        method: 'GET'
      },
      getMallGoodsList: {
        url: 'seek/getMallGoodsList',
        method: 'GET',
        isArray: true
      },
      getSeekPurchaseOfferPageInfo: {
        url: 'http://218.17.158.219:24000/inquiry/buyer/product/detail',
        method: 'GET'
      },
      getMyOfferPageInfo: {
        url: 'http://218.17.158.219:24000/inquiry/public/quotation/list',
        method: 'GET'
      },
      updateSeekPurchaseStatus: {
        url: 'http://218.17.158.219:24000/inquiry/buyer/decide',
        method: 'POST'
      },
      getSeekPurchaseBomListPage: {
        url: 'http://218.17.158.219:24000/inquiry/buyer/inquiryList',
        method: 'GET'
      },
      findOneBom: {
          url: 'http://218.17.158.219:24000/inquiry/public/findInquiryById',
          method: 'GET'
      },
      saveBomName: {
          url: 'seek/updateSeekPurchaseBom',
          method: 'PUT'
      },
      getBomDetail: {
          url: 'http://218.17.158.219:24000/inquiry/sale/publicInquiry/detail',
          method: 'GET'
      }
		});
}])
});
'use strict'
$(function() {
	vipspa.start({
		view: '.ui-view',
		router: {
			'/component/:uuid/': {
				templateUrl: 'static/view/mobile/product/component.html',
				controller: 'static/js/mobile/product/controller/componentController.js'
			},
			'/batch/:uuid' : {
				templateUrl: 'static/view/mobile/product/batch.html',
				controller: 'static/js/mobile/product/controller/batch.js'
			}
		}
	});
});
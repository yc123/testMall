'use strict'
$(function() {
	vipspa.start({
		view: '.ui-view',
		router: {
			'/component/:w': {
				templateUrl: 'static/view/mobile/comomSearch/componentList.html',
				controller: 'static/js/mobile/commonSearch/controller/commonSearchController.js'
			}
		}
	});
});
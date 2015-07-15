angular.module('select.mocks')
		.service('mockAssortmentCurrentService', function () {
			var mockDeferredPromise = {
				then: function (callback) {
					callback();
				}
			};
			var mockAssortmentCurrentService = {
				findProductById: function (id){
					return mockDeferredPromise;
				},
				bulkPersistProductQuantities : function(assortmentId, products){
					return mockDeferredPromise;
				},

				fetch: function () {
					return mockDeferredPromise;
				},
				findById: function (id){
					return mockDeferredPromise;
				}

			};
			return mockAssortmentCurrentService;
		});
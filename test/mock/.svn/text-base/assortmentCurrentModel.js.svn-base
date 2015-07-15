angular.module('select.mocks')
		.service('mockAssortmentCurrentModel', function () {

			var mockAssortmentCurrentModel = {
				findProductById: function (id) {
					return {
						then: function (callback) {
							callback(_.where(mockAssortmentCurrentModel.mockAssortmentProduct, {id: id}));
						}
					};
				}
			}

			return mockAssortmentCurrentModel;
		});
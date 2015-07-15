'use strict';

angular.module('conductivEcatalogApp.models')
		.service('AssortmentTab', function (AssortmentServiceTab, AssortmentCurrentService, $q) {
			var currentTab = null;
			var service = {
				find: function (id) {
					return AssortmentServiceTab.find(id);
				},
				all: function () {
					return AssortmentServiceTab.all();
				},
				duplicate: function (id) {
					return AssortmentServiceTab.duplicate(id);
				},
				rename: function (id, description) {
					return AssortmentServiceTab.rename(id, description);
				},
				remove: function (id) {
					return AssortmentServiceTab.remove(id);
				},
				current: {
					get: function () {
						if (currentTab) {
							return currentTab;
						} else {
							return null;
						}
					},
					set: function (id) {
						var deferred = $q.defer();
						service.find(id).then(function(found){
							currentTab = found;
							deferred.resolve(currentTab);
						});
						return deferred.promise;
					},
					addDisplayStyles: function (id, displayStyles) {
						var deferred = $q.defer();
            service.find(id).then(function(found){
              currentTab = found;
            });
						currentTab.links['product-styles'].push(displayStyles);
            deferred.resolve(currentTab);
						return deferred.promise;
					},
					addQuantities: function (id, product, quantity) {
						var deferred = $q.defer();
            service.find(id).then(function(found){
              currentTab = found;
            });

						product.quantity = quantity;
            currentTab.links["products"].push(product);
						deferred.resolve(currentTab);

						return deferred.promise;
					}
				}
			};
			return service;
		});

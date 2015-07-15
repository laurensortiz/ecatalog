'use strict';

angular.module('conductivEcatalogApp')
  .service('AssortmentServiceTab', function AssortmentService($http, httpCapi, $q, OfflineManager) {
			var ENTITY_TYPE = "Assortment";

			var offlineStorage;
			var getOfflineStorage = function () {
				if (offlineStorage === undefined) {
					offlineStorage = OfflineManager.getStorage(ENTITY_TYPE)
				}
				return offlineStorage;
			}

			var service = {
				all: function () {
					var deferred = $q.defer();
					getOfflineStorage().all(function (assortments) {
						deferred.resolve(assortments);
					});
					return deferred.promise;
				},
				find: function(id){
					var deferred = $q.defer();
          getOfflineStorage().get(id, function (foundAssortment) {
            deferred.resolve(foundAssortment);
					});

					return deferred.promise;
				},
				create: function (name) {
					var deferred = $q.defer();
					var assortment = {
						id: Helper.uuid()
					};
					getOfflineStorage().save({description: name, id: assortment.id}, function (savedObject) {
							deferred.resolve(savedObject);
					});
					return deferred.promise;
				},
				rename: function (id, newDescription) {
					var deferred = $q.defer(), updatedAssortment;

          getOfflineStorage().get(id, function (assortment) {
            updatedAssortment = assortment;
						updatedAssortment.description = newDescription;
						deferred.resolve(updatedAssortment);
					});

					getOfflineStorage().save(updatedAssortment, function (assortmentSaved) {
						deferred.resolve(assortmentSaved);
					});

					return deferred.promise;
				},
				remove: function(id){
					var deferred = $q.defer();
					getOfflineStorage().remove(id, function (assortmentDeleted) {
						deferred.resolve(assortmentDeleted);
					});

					return deferred.promise;
				},
				save: function(assortment){
					var deferred = $q.defer();
					getOfflineStorage().save(assortment, function (assortmentSaved) {
						deferred.resolve(assortmentSaved);
					});
					return deferred.promise;
				},
				duplicate: function(id, shouldDuplicateQuantities){
					var deferred = $q.defer();
					service.find(id).then(function (assortment) {
						service.create(assortment.description+' copy').then(function (newAssortment) {
							service.duplicate(newAssortment.id,shouldDuplicateQuantities).then(function (duplicated) {
								deferred.resolve(newAssortment);
							});
						});
					});
					return deferred.promise;
				}
			};
			return service;
		});
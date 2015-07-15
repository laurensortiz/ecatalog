'use strict';

angular.module('conductivEcatalogApp')
		.service('UserService', function UserService($q, OfflineManager, authentication) {
			var ENTITY_TYPE = "USER";

			var offlineStorage;
            var getCustomers;
			var getOfflineStorage = function () {
				if (offlineStorage === undefined) {
					offlineStorage = OfflineManager.getStorage(ENTITY_TYPE, authentication.getTenant(), authentication.currentUser());
				}
				return offlineStorage;
			}

			var service = {
                all: function () {
                    var deferred = $q.defer();
                    getOfflineStorage().all(function (foundAssortmentGroups) {
                        deferred.resolve(foundAssortmentGroups);
                    });
                    return deferred.promise;
                }
			};
			return service;
		});

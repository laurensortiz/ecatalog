'use strict';

angular.module('conductivEcatalogApp')
		.service('AssortmentService', function AssortmentService($q, OfflineManager, authentication, AssortmentTab, Helper) {
			var ENTITY_TYPE = "ASSORTMENT_GROUP";

			var offlineStorage;
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
				},
				create: function (name) {
					var deferred = $q.defer();
					var assortmentGroup = {
						id: Helper.uuid()
					};
					getOfflineStorage().save(assortmentGroup, function (savedObject) {
						AssortmentTab.create({name: name, groupId: assortmentGroup.id}).then(function () {
							deferred.resolve(savedObject);
						});
					});
					return deferred.promise;
				},
				find: function (id) {
					var deferred = $q.defer();
          getOfflineStorage().get(id, function (found) {
            deferred.resolve(found);
					});
					return deferred.promise;
				},
				save: function (updatedAssortmentGroup) {
					var deferred = $q.defer();
					getOfflineStorage().save(updatedAssortmentGroup, function (saved) {
						deferred.resolve(saved);
					});
					return deferred.promise;
				},
				remove: function (id) {
					var deferred = $q.defer();
					getOfflineStorage().remove(id, function (removed) {
						deferred.resolve(removed);
					});
					return deferred.promise;
				},
				rename: function (groupId, assortmentDescription) {
					var deferred = $q.defer();
					service.find(groupId).then(function (group) {
						group.name = assortmentDescription;
						service.save(group).then(function (saved) {
							deferred.resolve(saved);
						});
					});

					return deferred.promise;
				},
				assortmentTabs: function (groupId) {
					var deferred = $q.defer();
					AssortmentTab.findByGroup(groupId).then(function (tabs) {
						deferred.resolve(tabs);
					});
					return deferred.promise;
				},
				duplicate: function (groupId, shouldDuplicateQuantities) {
					var deferred = $q.defer();
					service.find(groupId).then(function (group) {
						service.create(group.name).then(function (newGroup) {
							service.assortmentTabs(groupId).then(function (assortmentTabs) {
								angular.forEach(assortmentTabs, function (assortmentTab, index) {
									AssortmentTab.duplicate(assortmentTab.id, newGroup.id, shouldDuplicateQuantities).then(function (duplicated) {
										if (index === assortmentTabs.length - 1) {
											deferred.resolve(newGroup);
										}
									});
								});
							});
						});
					});
					return deferred.promise;
				}
			};
			return service;
		});

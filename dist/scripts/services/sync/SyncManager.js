'use strict';
/*
 This service is a facade that talks with every service and decides whether to
 server offline data or httpCapi data, 
 TODO: it also is responsible of refreshing the offlineData on a certain time span.
 */
angular.module('conductivEcatalogApp').service('SyncManager', function ($q, $timeout, $http, OfflineManager, Environment, EntityDefinitions) {
    var syncQueue = {
        applicationLoad: []
    };

    var generateKey = function (type, object) {
        if (object === undefined) {
            return type;
        } else {
            var definitions = EntityDefinitions;
            var def = definitions[type];
            if (def === undefined) {
                def = definitions['default'];
            }
            return type + "|" + object[def.key];
        }
    }

    var syncManager = {
        /*
         This function is called when a list of a certain Entity needs to be called.
         */
        fetch: function (fetchFromHTTP, entityType, info) {
            var deferred = $q.defer()
                , entityKey = generateKey(entityType, info)
                , promise = OfflineManager.find(entityKey);
            setTimeout(promise.then(function (data) {
                if (!_.isNull(data)) {
                    deferred.resolve(data);
                } else {
                    fetchFromHTTP().then(function (data) {
                        deferred.resolve(data);
                    });
                }
            }), 10);
            return deferred.promise;
        },
        save: function (fetchFromHTTP, entityType, object) {
            if (OfflineManager.supported()) {
                var entityKey = generateKey(entityType, object);
                var deferred = $q.defer();
                return fetchFromHTTP().then(function (data) {
                    var tempData = data;
                    tempData.key = entityKey;
                    OfflineManager.save(tempData);
                    deferred.resolve(tempData);
                    return deferred.promise;
                });
            }
        },
        registerSync: function (syncMethod, queueName) {
            var queue = null;
            if (queueName !== undefined && queueName !== null) {
                if (syncQueue[queueName] === undefined) {
                    syncQueue[queueName] = [];
                }
                queue = syncQueue[queueName];
            } else {
                queue = syncQueue.applicationLoad;
            }
            queue.push(syncMethod);
        },
        sync: function (queueName, args) {
            var queue = null;
            if (queueName !== undefined && queueName !== null) {
                queue = syncQueue[queueName];
            } else {
                queue = syncQueue.applicationLoad;
            }
            var total = (queue || []).length;
            var promise = new $.Deferred();

            var performSync = function (index) {
                if (queue) {
                    var doSync = queue[index];
                    doSync(args).then(function () {
                        if (index === total - 1) {
                            promise.resolve();
                        } else {
                            promise.notify((index + 1) / total * 100);
                            index++;
                            performSync(index);
                        }
                    });
                }
            }
            var startIndex = 0;
            performSync(startIndex);
            return promise;
        }
    };
    return syncManager;
});
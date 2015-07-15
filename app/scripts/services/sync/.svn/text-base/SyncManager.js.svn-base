'use strict';
/*
 This service syncs the data in the application.
 It manages sync queues on which clients can latch on and get processed when a sync queue is synced.
 */
angular.module('conductivEcatalogApp').service('SyncManager', function ($q, /* TODO: Remove following dependencies */
                                                                        OfflineManager, EntityDefinitions
                                                                        /* TODO: Remove above dependencies */) {
  var syncQueue = {
    application: []
  };

  /* TODO: Remove following */
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
  /* TODO: Remove above */

  var syncManager = {
    /* TODO: Remove following */
    /*
     This function is called when a list of a certain Entity needs to be called.
     */
    fetch: function (fetchFromHTTP, entityType, info) {
      console.warn('SyncManager::fetch deprecated: Use offline manager to fetch from local storage. Called for entity: ' + entityType);
      var deferred = $q.defer();
      var entityKey = generateKey(entityType, info);

      OfflineManager.find(entityKey).then(function (data) {
        if (!_.isNull(data)) {
          deferred.resolve(data);
        } else {
          fetchFromHTTP().then(function (data) {
            deferred.resolve(data);
          });
        }
      });

      return deferred.promise;
    },
    save: function (fetchFromHTTP, entityType, object) {
      console.warn('SyncManager::save deprecated: Use offline manager to save to local storage');
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
    /* TODO: Remove above */

    registerSync: function (syncMethod, queueName) {
      var queue = null;
      if (queueName !== undefined && queueName !== null) {
        if (syncQueue[queueName] === undefined) {
          syncQueue[queueName] = [];
        }
        queue = syncQueue[queueName];
      } else {
        queue = syncQueue.application;
      }
      queue.push(syncMethod);
    },
    sync: function (queueName, args) {
      var queue = null;
      if (queueName !== undefined && queueName !== null) {
        queue = syncQueue[queueName];
      } else {
        queue = syncQueue.application;
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
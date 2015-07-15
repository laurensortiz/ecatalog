'use strict';
/*
 This service is a deferred/promised-based layer between the Lawnchair which implements a
 Custom Webkit adapter, plus indexed-db. This services communicate with SyncManager and returns information
 that is being saved on the local storage. Available Entities should be retrieved (and eventually added)
 from entityDefinition.js, please look at setEntity() function.
 */
angular.module('conductivEcatalogApp').service('OfflineManager', function ($timeout, $http, EntityDefinitions, Environment) {
  //TODO: Offline manager should only have offlineManager::getStorage which initializes and returns a lawnchair store.

  /*
   This is the actual Lawnchair Store, it's called on every method in offlineManager
   At this moment we are supporting indexed-db
   Useful Links:
   http://brian.io/lawnchair
   https://gist.github.com/brianleroux/798155
   https://gist.github.com/brianleroux/240460
   */

  //TODO: Remove below.
  var lawnChairStore = Lawnchair({
    adapter: ['conductiv-webkit', 'dom'],
    name: 'eCatalogObjects',
    record: 'eCatalogObject'
  }, function (e) {
    //console.info('offlineManager: storage ready');
  });
  //TODO: Remove above.

  /*
   This is the object that exposes Lawnchair functionality.
   The methods performs Promise/Deferred operations.
   */
  var storageCache = {};
  var generateKey = function (candidate) {
    var process = function (item) {
      if (item.key === undefined || item.key === null) {
        item.key = item.id;
      }
      return item;
    }
    if (candidate instanceof Array) {
      angular.forEach(candidate, function (item) {
        item = process(item);
      });
    } else {
      candidate = process(candidate);
    }
    return candidate;
  }

  var offlineManager = {
    getStorage: function (entityType, tenant, userId) {
      if (typeof entityType !== "undefined" && entityType !== null && typeof tenant !== "undefined" && tenant !== null) {
        var storageScope = (userId || "application") + "@" + tenant + "." + entityType;
        var foundCached = storageCache[storageScope];
        if (foundCached) {
          return foundCached;
        } else {
          var storage = Lawnchair({
            adapter: ['conductiv-webkit', 'dom'],
            name: storageScope,
            record: entityType
          });
          storageCache[storageScope] = storage;
          storage.before('save', function (record) {
            if (record.key === undefined || record.key === null) {
              record.key = record.id;
            }
          });
          return storage;
        }
      } else {
        //Not enough information to initialize the lawnchair adapter
        return null;
      }
    },
    /*
     LAWNCHAIR ACCESS GENERIC FUNCTIONS
     */
    /*
     This is the generic function to save data into the lawnChairStore Object,
     it receives a json object (preferably with a key property to easily find it)
     and returns a deferred resolve once the Lawnchair API Save method is executed
     */
    supported: function () {
      //TODO: Change this for Environment Service
      return true;
    },
    save: function (object) {
      console.warn('OfflineManager::save deprecated: Use OfflineManager::getStorage to get the lawnchair instance');
      var deferredObj = new $.Deferred();
      lawnChairStore.save(object, function (record) {
        deferredObj.resolve(record);
      });
      return deferredObj.promise();
    },

    /*
     This is the generic function to find data by Key into the lawnChairStore Object,
     it receives a string representing the key for the object
     and returns a deferred resolve once the Lawnchair API Save method is executed
     */
    find: function (key) {
      console.warn('OfflineManager::find deprecated: Use OfflineManager::getStorage to get the lawnchair instance');
      var deferredObj = new $.Deferred();
      lawnChairStore.get(key, function (doc) {
        deferredObj.resolve(doc);
      });
      return deferredObj.promise();
    },

    /*
     This is the generic function to see if data exists by Key into the lawnChairStore Object,
     it receives a string representing the key for the object
     and returns a deferred resolve once the Lawnchair API Exists method is executed
     */
    exists: function (key) {
      console.warn('OfflineManager::exists deprecated: Use OfflineManager::getStorage to get the lawnchair instance');
      var deferredObj = new $.Deferred();
      lawnChairStore.exists(key, function (exists) {
        deferredObj.resolve(exists);
      });
    },

    /*
     This is the generic function to remove data by Key from the lawnChairStore Object,
     it receives a string representing the key for the object
     and returns a deferred resolve once the Lawnchair API Remove method is executed
     */
    removeByKey: function (key) {
      console.warn('OfflineManager::removeByKey deprecated: Use OfflineManager::getStorage to get the lawnchair instance');
      var deferredObj = new $.Deferred();
      lawnChairStore.remove(key, function (data) {
        //console.info('offlineManager: removeByKey() success.');
        deferredObj.resolve();
      });
      return deferredObj.promise();
    },

    /*
     This is the generic function to NUKE data by from the lawnChairStore Object,
     returns a deferred resolve once the Lawnchair API Nuke method is executed
     */
    nuke: function () {
      console.warn('OfflineManager::nuke deprecated: Use OfflineManager::getStorage to get the lawnchair instance');
      var deferredObj = new $.Deferred();
      lawnChairStore.nuke(function () {
        deferredObj.resolve();
      });
      return deferredObj.promise();
    }
  };

  return offlineManager;
});
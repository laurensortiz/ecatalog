'use strict';
/*
 This service is a deferred/promised-based layer between the Lawnchair which implements a
 Custom Webkit adapter, plus indexed-db. This services communicate with SyncManager and returns information
 that is being saved on the local storage. Available Entities should be retrieved (and eventually added)
 from entityDefinition.js, please look at setEntity() function.
 */
angular.module('conductivEcatalogApp').service('OfflineManager', function ($timeout, $http, EntityDefinitions, Environment) {
    /*
     This is the actual Lawnchair Store, it's called on every method in offlineManager
     At this moment we are supporting indexed-db
     Useful Links:
     http://brian.io/lawnchair
     https://gist.github.com/brianleroux/798155
     https://gist.github.com/brianleroux/240460
     */

    var lawnChairStore = Lawnchair({
            adapter: ['conductiv-webkit', 'dom'],
            name: 'eCatalogObjects',
            record: 'eCatalogObject'
        }, function (e) {
            //console.info('offlineManager: storage ready');
        }),
    /*
     This is the object that exposes Lawnchair functionality.
     The methods performs Promise/Deferred operations.
     */
        offlineManager = {
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
                var deferredObj = new $.Deferred();
                lawnChairStore.nuke(function () {
                    deferredObj.resolve();
                });
                return deferredObj.promise();
            }
        };

    return offlineManager;
});
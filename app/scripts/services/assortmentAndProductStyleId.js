'use strict';

angular.module('conductivEcatalogApp')
    .factory('assortmentAndProductStyleId', function ($http, assortment, httpCapi, SyncManager, $q) {

        var service = {};

        var ENTITY_TYPE = 'Assortment';

        var fetchAllOrders = function () {
            var deferred = $q.defer();
            $http({
                method: "GET",
                url: httpCapi.generateBaseApiUrl() + "/assortments",
                headers: httpCapi.generateCommonAPIHeaders()
            }).then(function (response) {
                    deferred.resolve(response.data);
                });

            return deferred.promise;
        }


        /*
         var service = {};

         service.getAssortmentAndProductStyleId  = function(productIdCode){
         var defer = $q.defer();
         var result = {"assortmentId":'10010',"productStyleId":'10040'};
         $timeout(function(){
         defer.resolve(result);
         },500);
         return defer.promise;
         }
         // Public API here
         return service;
         */
    });

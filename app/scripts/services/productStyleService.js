'use strict';

angular.module('conductivEcatalogApp')
    .service('ProductStyleService', function ProductService($http, httpCapi, SyncManager, OfflineManager, $q) {
      var ENTITY_TYPE = 'ProductStyles';
      var CONTENT_TYPE_IMAGE = 'Image';
      var ASSORTMENT_UPDATE_PRODUCTSTYLE_LIST = [];
      var offlineStorage;
      var getOfflineStorage = function () {
        if (offlineStorage === undefined) {
          offlineStorage = OfflineManager.getStorage(ENTITY_TYPE, "wrangler");
        }
        return offlineStorage;
      }
      var service = {
        allFromCapi: function () {
          var deferred = $q.defer();
          $http({
            method: "GET",
            url: httpCapi.generateBaseApiUrl() + "/product-styles",
            headers: httpCapi.generateCommonAPIHeaders()
          }).then(function (response) {
                deferred.resolve(response.data);
              });
          return deferred.promise;
        },
        all: function () {
          var deferred = $q.defer();
          deferred.resolve(SyncManager.fetch(this.allFromCapi, ENTITY_TYPE));
          return deferred.promise;
        },

        find: function(id){
          var deferred = $q.defer();
          SyncManager.fetch(this.allFromCapi, ENTITY_TYPE).then(function (products) {
            var foundProduct = _.find(products, function(products){
              return products.id === id;
            });
            deferred.resolve(foundProduct);
          });
          return deferred.promise;
        },
        associateWithAssortmentCAPI: function (product, assortment) {
          var deferred = $q.defer();
          $http({
            method: "POST",
            data: {"productStyleId": product},
            url: httpCapi.generateBaseApiUrl() + "/assortments/" + assortment + "/product-styles?productStyleId=" + product ,
            headers: httpCapi.generateCommonAPIHeaders()
          }).then(function (response) {
                deferred.resolve(response.data);
              });
          return deferred.promise;

        },
        associateWithAssortment: function (productStyleID, assortmentId) {

          var deferred = $q.defer();
          OfflineManager.find('ASSORTMENT_UPDATE_PRODUCTSTYLE_LIST').then(function (updateAssortmentList) {
            if(updateAssortmentList == null){
              updateAssortmentList= {"data":[]};
            }
            updateAssortmentList.data.push({"productStyleId": productStyleID, "assortmentId": assortmentId});
            getOfflineStorage().save(updateAssortmentList, function (response) {
              deferred.resolve(response);
            });
          });
          return deferred.promise;
        },
        sync: function (productStyle) {
          return SyncManager.save(
              function () {
                return find(id)
              },
              ENTITY_TYPE, {id: productStyle}
          );
        }
      };
      return service;
    });
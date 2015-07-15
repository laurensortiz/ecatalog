'use strict';

angular.module('conductivEcatalogApp')
    .service('ProductService', function ProductService($http, httpCapi, SyncManager, OfflineManager, $q, authentication) {
      var ENTITY_TYPE = "Product";
      var fetchAllFromCAPI = function () {
        var deferred = $q.defer();
        $http({
          method: "GET",
          url: httpCapi.generateBaseApiUrl() + "/product-styles?expand=self,products,media",
          headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
              deferred.resolve(response.data);
            });
        return deferred.promise;
      };

      var getRootCatalogPath = function (products) {
        var folderName = products.name.replace(/ /g, "_");
        return httpCapi.generateFilesUrl() + "/" + sessionStorage['tenant'] + "/Products/" + folderName;
      }


      var offlineStorage;
      var getOfflineStorage = function () {
        if (offlineStorage === undefined) {
          offlineStorage = OfflineManager.getStorage(ENTITY_TYPE, authentication.getTenant());

        }
        return offlineStorage;
      }

      var service = {
        all: function () {
          var deferred = $q.defer();
          getOfflineStorage().all(function (allProducts) {
            deferred.resolve(allProducts);
          });
          return deferred.promise;
        },
        find: function (id) {
          var deferred = $q.defer();
          this.all().then(function (allProducts) {
            var found = _.find(allProducts, function (product) {
              return product.id === id;
            });
            deferred.resolve(found);
          });
          return deferred.promise;
        },
        getQuantity: function (id){
          var deferred = $q.defer();
          getOfflineStorage().find(id, function (id) {
            var found = _.find(id, function (quantity){
               return quantity;
            });
            deferred.resolve(found)
          });
          return deferred.promise;
        },
        setQuantity: function (id, quantity) {
          var deferred = $q.defer();
          getOfflineStorage().save([id, quantity], function (saved) {
             deferred.resolve(saved);
          });
          return deferred.promise;
        },
        sync: function (product) {
          return SyncManager.fetch(fetchAllFromCAPI, ENTITY_TYPE);
        },
        associateWithAssortment: function (product, assortment) {
          var deferred = $q.defer();
          var updateAssortmentList = [];
          updateAssortmentList.push({productId: product, assortmentId: assortment});
          getOfflineStorage().save(updateAssortmentList, function (savedObject) {
            deferred.resolve(savedObject);
          });
          return deferred.promise;
        }
      };
      return service;
    });

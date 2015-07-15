'use strict';

angular.module('conductivEcatalogApp')
    .service('virtualProduct', ['$http', '$q', 'httpCapi', 'SyncManager', function virtualProduct($http, $q, httpCapi, SyncManager) {
      var ENTITY_TYPE = "VIRTUAL_PRODUCT";
      var fetchAllFromCAPI = function () {
        var deferred = $q.defer();
        $http({
          method: "GET",
          url: httpCapi.generateBaseApiUrl() + "products?include=virtuals",
          headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
              deferred.resolve(response.data);
            });
        return deferred.promise;
      };

      return {
        all: function () {
          return SyncManager.fetch(fetchAllFromCAPI, ENTITY_TYPE);
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
        image: function (id) {
          var deferred = $q.defer();
          this.find(id).then(function (product) {
            deferred.resolve(product.links.image);
          });
          return deferred.promise;
        }
      };
    }]);

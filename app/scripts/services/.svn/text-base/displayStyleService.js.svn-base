'use strict';

angular.module('conductivEcatalogApp')
    .service('DisplayStyleService', function ProductService($http, httpCapi, SyncManager, OfflineManager, $q, authentication) {
      var ENTITY_TYPE = 'ProductStyles';
      var CONTENT_TYPE_IMAGE = 'Image';

      var allFromCapi = function () {
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

      var fetchProductStyle = function (productStyle) {
        var deferred = $q.defer();
        var psId = productStyle.styleCode;
        $http({
          method: "GET",
          url: httpCapi.generateBaseApiUrl() + '/product-styles/' + psId + '/products',
          headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
              deferred.resolve(response.data);
            });
        return deferred.promise;
      }

      var productStyleImages = function (productStyleID) {
        var deferred = $q.defer();
        $http({
          method: "GET",
          url: httpCapi.generateBaseApiUrl() + "/product-style/" + productStyleID + "/product-styles/images",
          headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
              deferred.resolve(response.data);
            });
        return deferred.promise;
      }

      var getRootCatalogPath = function (products) {
        var folderName = products.name.replace(/ /g, "_");
        return httpCapi.generateFilesUrl() + "/" + sessionStorage['tenant'] + "/media.productContentType/" + folderName;
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
          getOfflineStorage().all(function (allStyles) {
            deferred.resolve(allStyles);
          });
          return deferred.promise;
        },
        find: function (id) {
          var deferred = $q.defer();
          this.all().then(function (allStyles) {
            var found = _.find(allStyles, function (productStyle) {
              return productStyle.id === id;
            });
            deferred.resolve(found);
          });
          return deferred.promise;
        },
        sync: function () {
          var deferred = $q.defer();
          allFromCapi().then(function (productStyle) {
            angular.forEach(productStyle, function () {
              getOfflineStorage().batch(productStyle, function (savedProductStyle) {
                deferred.resolve(savedProductStyle);
              });
            });
          });
          return deferred.promise;
        },
        getImage: function (styleId, imageType) {
          var deferred = $q.defer();
          service.find(styleId).then(function (style) {
            var image = null;
            var foundMedia = _.find(style.media, function (media) {
              return media.contentType === CONTENT_TYPE_IMAGE && media.productContentType === imageType;
            })
            if (foundMedia) {
              image = foundMedia.links.image;
            } else {
              image = style.links.image;
            }
            deferred.resolve(image);
          });
          return deferred.promise;
        }
      };
      return service;
    });




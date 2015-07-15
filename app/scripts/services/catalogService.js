'use strict';

angular.module('conductivEcatalogApp')
    .service('CatalogService', function CatalogService($http, httpCapi, $q, OfflineManager, fileSync, authentication) {
      var CATALOG_ENTITY_TYPE = "Catalog";

      var getRootCatalogPath = function (catalog) {
        var folderName = catalog.name.replace(/ /g, "_");
        return httpCapi.generateFilesUrl() + "/" + sessionStorage['tenant'] + "/Catalogs/" + folderName;
      }

      var offlineStorage;
      var getOfflineStorage = function () {
        if (offlineStorage === undefined) {
          offlineStorage = OfflineManager.getStorage(CATALOG_ENTITY_TYPE, authentication.getTenant());
        }
        return offlineStorage;
      }

      var allFromCapi = function () {
        var deferred = $q.defer();
        $http({
          method: "GET",
          url: httpCapi.generateBaseApiUrl() + "/master-catalogs",
          headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
              var catalogs = response.data
              angular.forEach(catalogs, function (thisCatalog, index) {
                thisCatalog.links.image = httpCapi.translateToLocalFileUrl(thisCatalog.links.image);
              });
              deferred.resolve(catalogs);
            });
        return deferred.promise;
      }

      var getStylesheetFromCapi = function (id) {
        var deferred = $q.defer();
        $http({
          method: "GET",
          url: httpCapi.generateBaseApiUrl() + "/master-catalogs/" + id,
          headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
              var catalog = response.data;
              catalog.links.stylesheet = httpCapi.translateToLocalFileUrl(catalog.links.stylesheet);
              deferred.resolve(catalog.links.stylesheet);
            });
        return deferred.promise;
      }

      var allPagesFromCapi = function (catalog) {
        var deferred = $q.defer();
        $http({
          method: "GET",
          url: httpCapi.generateBaseApiUrl() + "/master-catalogs" + "/" + catalog.id + "/pages?expand=self",
          headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
              var pages = response.data;
              if (pages.length === 0) deferred.resolve(pages);
              angular.forEach(pages, function (page, index) {
                page.thumbnail = catalog.rootCatalogPath + "/Thumbnails/page" + page.masterCatalogPageNumber + ".jpg";
                page.rootCatalogPath = catalog.rootCatalogPath;
                var resolvedPath = httpCapi.translateToLocalFileUrl(page.links.template);
                page.links.template = resolvedPath;
                if (index === pages.length - 1) deferred.resolve(pages);
              });
            });
        return deferred.promise;
      }

      var productStyleImages = function (catalogId) {
        var deferred = $q.defer();
        $http({
          method: "GET",
          url: httpCapi.generateBaseApiUrl() + "/master-catalogs/" + catalogId + "/product-styles/images",
          headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
              deferred.resolve(response.data);
            });
        return deferred.promise;
      }

      var service = {
        all: function () {
          var deferred = $q.defer();
          getOfflineStorage().all(function (catalogs) {
            deferred.resolve(catalogs);
          });
          return deferred.promise;
        },
        find: function (id) {
          var deferred = $q.defer();
          getOfflineStorage().get(id, function (foundCatalog) {
            if (foundCatalog) foundCatalog.rootCatalogPath = getRootCatalogPath(foundCatalog);
            deferred.resolve(foundCatalog);
          });
          return deferred.promise;
        },
        pages: function (catalogId) {
          var deferred = $q.defer();
          getOfflineStorage().get(catalogId, function (catalog) {
            deferred.resolve(catalog.pages);
          });
          return deferred.promise;
        },
        sync: function () {
          var deferred = $q.defer();
          allFromCapi().then(function (catalogs) {
            angular.forEach(catalogs, function (catalog, index) {
              getOfflineStorage().batch(catalogs, function (savedCatalogs) {
                deferred.resolve(savedCatalogs);
              });
            });
          });
          return deferred.promise;
        },
        syncFiles: function (catalogId) {
          var deferred = $q.defer();
          service.find(catalogId).then(function (catalog) {
            var catalogName = catalog.name.replace(/ /g, "_");
            var foldersToCheckForUpdates = [
              "/Catalogs/" + catalogName
            ];
            var filesToCheckForUpdates = [];
            productStyleImages(catalogId).then(function (images) {
              angular.forEach(images, function (imageInfo) {
                var imageUrl = imageInfo.links.image;
                var imageName = imageUrl.slice(imageUrl.lastIndexOf('/') + 1, imageUrl.length);
                var relativeImageUrl = "/Products/" + imageName;
                var imageModifiedAt = imageInfo.lastModified;
                filesToCheckForUpdates.push({name: imageName, lastModified: imageModifiedAt, relativeTenantPath: relativeImageUrl});
              });
              fileSync.perform(foldersToCheckForUpdates, filesToCheckForUpdates).then(function () {
                deferred.resolve();
              });
            });
          });
          return deferred.promise;
        },
        syncDetails: function (catalogId) {
          var deferred = $q.defer();
          service.find(catalogId).then(function (catalog) {
            getStylesheetFromCapi(catalogId).then(function (stylesheetUrl) {
              catalog.links.stylesheet = stylesheetUrl;
              allPagesFromCapi(catalog).then(function (pages) {
                catalog.pages = pages;
                getOfflineStorage().save(catalog, function () {
                  deferred.resolve(catalog);
                });
              });
            });
          })
          return deferred.promise;
        }
      };
      return service;
    });

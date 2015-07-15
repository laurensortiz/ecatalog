'use strict';

angular.module('conductivEcatalogApp.models')
    .service('Catalog', function (CatalogService) {
      var service = {
        find: function (id) {
          return CatalogService.find(id);
        },
        all: function () {
          return CatalogService.all();
        },
        sync: function () {
          return CatalogService.sync();
        },
        syncFiles: function (catalogId) {
          return CatalogService.syncFiles(catalogId);
        },
        syncDetails: function (catalogId) {
          return CatalogService.syncDetails(catalogId);
        },
        pages: function (catalogId) {
          return CatalogService.pages(catalogId);
        }
      };
      return service;
    });
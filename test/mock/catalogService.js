angular.module('select.mocks')
    .service('mockCatalogService', function () {
      var mockDeferredPromise = {
        then: function (callback) {
          callback();
        }
      };
      var mockCatalogService = {
        find: function (id) {
          return mockDeferredPromise;
        },
        all: function () {
          return mockDeferredPromise;
        },
        sync: function () {
          return mockDeferredPromise;
        },
        syncFiles: function () {
          return mockDeferredPromise;
        },
        syncDetails: function () {
          return mockDeferredPromise;
        },
        pages: function () {
          return mockDeferredPromise;
        }
      }
      return mockCatalogService;
    });
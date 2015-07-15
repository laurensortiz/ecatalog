angular.module('select.mocks')
    .service('mockAssortmentTabService', function () {
      var mockDeferredPromise = {
        then: function (callback) {
          callback();
        }
      };
      var mockAssortmentTabService = {
        find: function (id) {

          return mockDeferredPromise;
        },
        all: function () {
          return mockDeferredPromise;
        },
        save: function (assortment) {
          return mockDeferredPromise;
        },
        duplicate: function (id, shouldDuplicateQuantities) {
          return mockDeferredPromise;
        },
        rename: function (id, newDescription) {
          return mockDeferredPromise;
        },
        remove: function (id) {
          return mockDeferredPromise;
        },
        create: function (params) {
          return mockDeferredPromise;
        }
      }
      return mockAssortmentTabService;
    });
angular.module('select.mocks')
    .service('mockProductService', function () {
      var mockDeferredPromise = {
        then: function (callback) {
          callback();
        }
      };
      var mockProductService = {
        all: function () {
          return mockDeferredPromise;
        },
        find: function (id) {
          return mockDeferredPromise;
        },
        setQuantity: function (id, quantity) {
          return mockDeferredPromise;
        },
        duplicate: function (id, shouldDuplicateQuantities) {
          return mockDeferredPromise;
        },
        sync: function () {
          return mockDeferredPromise;
        }
      }
      return mockAssortmentTabService;
    });
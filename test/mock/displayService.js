angular.module('select.mocks')
    .service('mockDisplayStyleService', function () {
      var mockDeferredPromise = {
        then: function (callback) {
          callback();
        }
      };
      var mockDisplayStyleService = {
        all: function () {
          return mockDeferredPromise;
        },
        find: function (id) {
          return mockDeferredPromise;
        },
        image: function (id, style) {
          return mockDeferredPromise;
        },
        sync: function () {
          return mockDeferredPromise;
        }
      }
      return mockDisplayStyleService;
});
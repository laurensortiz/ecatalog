angular.module('select.mocks')
    .service('mockAssortmentService', function () {
        var mockDeferredPromise = {
            then: function (callback) {
              callback();
            }
        };
        var mockAssortmentService = {
            find: function (id) {
                return mockDeferredPromise;
            },
            all: function () {
                return mockDeferredPromise;
            },
            duplicate: function(groupId, shouldDuplicateQuantities) {
                return mockDeferredPromise;
            },
            rename: function() {
                return mockDeferredPromise;
            },
            remove: function(id) {
                return mockDeferredPromise;
            }
        };

      return mockAssortmentService;
    });
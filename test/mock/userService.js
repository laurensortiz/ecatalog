angular.module('select.mocks')
    .service('mockUserService', function () {
        var mockDeferredPromise = {
            then: function (callback) {
                callback();
            }
        };
        var mockUserService = {
            get : function(id) {
                return mockDeferredPromise;
            }
        }

        return mockUserService;
    });

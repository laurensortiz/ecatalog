'use strict';

// Manages network connection state
// Clients can listen to the event "event:network-connectivity"
// eg. $scope.$on('event:network-connectivity', function () { Do something... )}
angular.module('conductivEcatalogApp').factory('network', function ($window, $rootScope, Environment) {
    var service = {};
    var appOnline = false;

    //Notify subscribers
    var broadcast = function (state) {
        appOnline = state;
        $rootScope.$broadcast('event:network-connectivity', state);
    }

    if (Environment.isIOS) {
        // Setup a callback that gets fired whenever WebKit goes online or offline
        StartConnectionCallback(function (isOnline) {
            broadcast(isOnline === 'true');
        });
    } else {
        appOnline = $window.navigator.onLine;

        // Setup a callback that fires whenever the browser goes online
        $window.addEventListener("online", function () {
            broadcast(true);
        }, false);

        // Setup a callback that fires whenever the browser goes offline
        $window.addEventListener("offline", function () {
            broadcast(false);
        }, false);
    }

    // Returns true if the client can currently connect to the internet. Otherwise false.
    service.canConnect = function () {
        return appOnline;
    }

    // Public API here
    return service;
});

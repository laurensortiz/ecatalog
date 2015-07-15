'use strict';

angular.module('conductivEcatalogApp')
    .factory('Environment', function () {

        var ua = navigator.userAgent.toLowerCase();

        // Public API here
        return {
            isIOS: (ua.indexOf("conductivmobileios") > 0),
            //isIOS : true,
            isAndroid: (ua.indexOf("conductivmobileandroid") > 0),
            isInWebkitContainer: ((ua.indexOf("conductivmobileandroid") > 0) === true || (ua.indexOf("conductivmobileios") > 0) === true)
        };
    });

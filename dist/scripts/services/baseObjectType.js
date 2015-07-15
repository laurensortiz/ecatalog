'use strict';

angular.module('conductivEcatalogApp')
    .factory('baseObjectType', function () {
        // Service logic
        // ...

        var meaningOfLife = 42;

        // Public API here
        return {
            someMethod: function () {
                return meaningOfLife;
            }
        };
    });

'use strict';

angular.module('conductivEcatalogApp')
    .filter('startByOneIndex', function () {
        return function (input) {
            return input + 1;
        };
    });

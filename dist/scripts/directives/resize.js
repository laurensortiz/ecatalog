'use strict';

angular.module('conductivEcatalogApp')
    .directive('resize', function ($window) {
        return function (scope, element, attrs) {

            angular.element($window).bind('resize', function () {
                scope.adjustSize();
            });
        }
    });

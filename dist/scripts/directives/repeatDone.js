'use strict';
//
angular.module('conductivEcatalogApp')
    .directive('repeatDone', function ($rootScope, $timeout) {
        return function (scope, element, attrs) {
            if (scope.$last) {
                $timeout(function () {

                });
            }
        };
    });

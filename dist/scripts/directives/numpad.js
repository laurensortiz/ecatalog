'use strict';

angular.module('conductivEcatalogApp')
    .directive('numpad', function () {
        return {
            templateUrl: 'views/numpad.html',
            restrict: 'E',
            scope: {
                numpad: "=data",
                visibility: "="
            },
            replace: true,
            link: function postLink(scope, element, attrs) {
                scope.hideNumpad = function () {
                    scope.visibility = false;
                }
            }
        };
    });

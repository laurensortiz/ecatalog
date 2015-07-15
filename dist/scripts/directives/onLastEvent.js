'use strict';

angular.module('conductivEcatalogApp')
    .directive('onLastEvent', function () {
        return {
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                if ($scope.$last) {

                }
            }
        };
    });

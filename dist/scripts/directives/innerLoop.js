'use strict';

angular.module('conductivEcatalogApp').directive('innerLoop', function ($timeout) {
    return function (scope, element) {
        if (scope.$last) {
            if (scope.$parent.$last) {
                $timeout(function () {
                    scope.$emit('outerLoopEnds');
                })
            }
        }
        scope.$on('outerLoopEnds', function () {
            $('#addressbook-slider').sliderNav();
        })
    }
});

'use strict';

angular.module('conductivEcatalogApp').directive('navbar', function () {
    return {
        templateUrl: 'views/template/navbar/topNavBar.html',
        restrict: 'E',
        scope: {
            navElements: "=",
            showToggle: "=",
            showHeader: "=",
            showBackButton: "=",
            hideAll: "=",
            int: "="
        },
        replace: true,
        link: function ($scope, element, attrs) {
            $scope.$watch('navElements', function (value) {
                _.each(value, function (navElement) {
                    if (!navElement.action) {
                        navElement.action = function () {
                            return true
                        };
                        // no-op pass through
                    }
                });
            });
        }
    };
});

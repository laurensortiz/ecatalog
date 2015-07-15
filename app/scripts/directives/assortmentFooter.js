'use strict';
angular.module('conductivEcatalogApp').directive('assortmentFooter', function ($rootScope) {
    return {
        templateUrl: 'views/template/footer/assortmentFooter.html',
        restrict: 'E',
        scope: {
            isEditing: "@"
        },
        transclude: true,
        replace: true,
        link: function (scope, element, attrs) {
            scope.assortment = function () {
                return $rootScope.currentAssortment;
            }
        }
    };
});

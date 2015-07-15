'use strict';

angular.module('conductivEcatalogApp')
    .directive('appConnectionStatusDirective', function ($location, $rootScope) {
        return {
            restrict: 'C',
            link: function (scope, elem, attrs) {

                scope.$on('event:connection-lost', function () {
                    if (!$rootScope.connectionStatusError) {
                        if ($rootScope.loading) {
                            $rootScope.loading = false;
                        }
                        $rootScope.connectionStatusError = true;
                        $location.path("/home/menu");
                    }
                });
                scope.$on('event:connection-confirmed', function () {
                });
            }
        }
    });
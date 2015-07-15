'use strict';

angular.module('conductivEcatalogApp')
    .directive('appAuthDirective', function ($location, authentication, $rootScope) {
        return {
            restrict: 'C',
            link: function (scope, elem, attrs) {

                scope.$on('event:auth-loginRequired', function () {
                    if (!authentication.isUserLoggedIn()) {
                        if ($rootScope.loading) $rootScope.loading = false;
                        $location.path("/login");
                    }
                });
                scope.$on('event:auth-loginConfirmed', function () {
                });
            }
        }
    });

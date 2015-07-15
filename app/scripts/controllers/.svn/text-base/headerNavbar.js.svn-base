'use strict';

angular.module('conductivEcatalogApp')
    .controller('HeaderNavbarCtrl', function ($scope, $rootScope, $route, Catalog, $routeParams) {
      $scope.previousPage = $rootScope.previousPage;
      $scope.$on('$routeChangeSuccess', function (scope, current) {
        if (current.$$route.templateUrl == 'views/masterCatalogBrowse.html') {
          $scope.templateName = '';
          Catalog.find($routeParams.catalogId).then(function (catalog) {
            $scope.templateName = catalog.name;
          });
        }
        else {
          $scope.templateName = $route.current.$$route.templateName;
        }
      });
    });

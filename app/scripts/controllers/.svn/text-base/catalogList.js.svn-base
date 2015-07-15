'use strict';

angular.module('conductivEcatalogApp').controller('CatalogListCtrl', function ($scope, Catalog) {
  Catalog.all().then(function (allCatalogs) {
    $scope.catalogs = allCatalogs;
  });
});

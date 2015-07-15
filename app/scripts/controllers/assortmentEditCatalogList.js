'use strict';

angular.module('conductivEcatalogApp').controller('AssortmentEditCatalogListCtrl', function ($scope, $rootScope, $location, Catalog) {
  catalog.all().then(function (found) {
    $scope.catalogs = found;
  });

  $scope.selectCatalog = function (catalog) {
    $rootScope.closeCatalogListModal();
    if ($rootScope.currentAssortment === undefined || $rootScope.currentAssortment === null) {
      $location.path('catalog/master/' + catalog.id + '/browse');
    } else {
      $location.path("assortment/edit/" + $rootScope.currentAssortment.id + "/catalog/master/" + catalog.id + "/browse");
    }
  };
});

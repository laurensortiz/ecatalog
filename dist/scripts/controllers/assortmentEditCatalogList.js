'use strict';

angular.module('conductivEcatalogApp').controller('AssortmentEditCatalogListCtrl', function ($scope, $rootScope, $location, catalog, httpCapi) {

    catalog.getMasterCatalogs().then(function (data) {
        var catalogName = data[0].name;

        httpCapi.getFileResourceOrder(data[0].links.image).then(function (resolvedURL) {
            data[0].links.image = resolvedURL;
        });

        //$scope.catalogLinkImg = '../images/' + catalogName.toLowerCase().split(' ').join('_') + '.png';
        $scope.catalogLinkImg = data[0].links.image;
        $scope.Master = data;
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

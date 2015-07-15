'use strict';

angular.module('conductivEcatalogApp').controller('CatalogListCtrl', function ($scope, $location, $routeParams, catalog, $http, authentication) {
    catalog.getMasterCatalogs().then(function (foundCatalogs) {
        //Fetch offline url for the catalog thumbnail image
        $scope.catalogs = catalog.resolveRemoteUrls(foundCatalogs);
    });
});

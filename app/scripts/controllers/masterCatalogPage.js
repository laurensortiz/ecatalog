'use strict';

angular.module('conductivEcatalogApp').controller('MasterCatalogPageCtrl', function ($scope, $routeParams, catalog, httpCapi, $http) {

    $scope.$root.headerOptions.showToggle = true;
    $scope.$root.headerOptions.hideEntireHeader = true;
    $scope.pageId = $routeParams.pageId;
    $scope.catalogId = $routeParams.catalogId;
    $scope.page = null;

    catalog.getMasterCatalog($routeParams.catalogId).then(function (data) {
        $scope.parentCatalog = data;
        $scope.parentCatalog.catalogClassName = $scope.parentCatalog.name.replace(/ /g, "-");
        httpCapi.getFileResource($scope.parentCatalog.links.stylesheet).done(function (resolvedPath) {

            if ($("head").find('[href="' + resolvedPath + '"]').length == 0) {
                $("head").append("<link rel='stylesheet' href=" + resolvedPath + " type='text/css'>");
            }
        });

        if (!$scope.$digest) {
            $scope.$apply();
        }
    });

    catalog.getMasterCatalogPage($scope.catalogId, $scope.pageId).then(function (data) {
        page.loadTemplate = true;

        $scope.page = data;
        if (!$scope.$digest) {
            $scope.$apply();
        }
    });
});

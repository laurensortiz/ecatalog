'use strict';

angular.module('conductivEcatalogApp')
    .controller('HeaderCtrl', function ($scope, productStyles, $route, catalog, $routeParams) {
        $scope.allStylesAvailable = [];
        $scope.allCatalogsAvailable = [];
        $scope.catalogFilter = false;
        $scope.styleFilter = false;
        $scope.genderFilter = false;
        $scope.productSearchResultSlider = null;
        var self = this;
    });
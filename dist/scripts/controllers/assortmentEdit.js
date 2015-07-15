'use strict';

angular.module('conductivEcatalogApp')
    .controller('AssortmentEditCtrl', function ($scope, $routeParams, assortment, $location) {
        assortment.getAssortment($routeParams.assortmentId).then(function () {
            $location.path('/assortment/edit/' + $routeParams.assortmentId + '/whiteboard').replace();
        }, function (error) {
            $scope.errorMessage = "assortment not found";
        });
    });

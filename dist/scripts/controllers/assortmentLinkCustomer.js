'use strict';

var app = angular.module('conductivEcatalogApp');

app.controller('AssortmentLinkCustomerCtrl', function ($scope, customer, assortment, $routeParams, $location) {
    //This property will keep track of all the assortments coming from service

    $scope.customers = [];

    // Fetch Assortments from Public API
    customer.getCustomers().then(function (data) {
        $scope.customers = data;
        $scope.sortedCustomers = _.sortBy($scope.customers, "name");
        $scope.groupedCustomers = _.groupBy($scope.sortedCustomers, function (customer) {
            return customer.name.charAt(0);
        });
    });

    $scope.linkCustomer = function (customer) {
        assortment.deleteCustomerLinking($routeParams.assortmentId).then(function (data) {
            if (data) {
                assortment.linkCustomer($routeParams.assortmentId, customer).then(function (data) {
                    if (data.id > 0) {
                        $location.path("/catalog/list");
                    }
                });
            }
            else {
                assortment.linkCustomer($routeParams.assortmentId, customer).then(function (data) {
                    if (data.id > 0) {
                        $location.path("/assortment/create/" + $routeParams.assortmentId + "/catalog/list");
                    }
                });
            }
        });

    }

});

app.directive('innerLoop', function ($timeout) {
    return function (scope, element) {
        if (scope.$last) {
            if (scope.$parent.$last) {
                $timeout(function () {
                    scope.$emit('outerLoopEnds');
                })
            }
        }
        scope.$on('outerLoopEnds', function () {
            $('#addressbook-slider').sliderNav();
        })
    }
});
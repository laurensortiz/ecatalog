'use strict';

angular.module('conductivEcatalogApp')
    .controller('AssortmentEditLinkCustomerCtrl', function ($scope, customer, assortment, $routeParams, $location) {

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
                            $location.path("/assortment/edit/" + $routeParams.assortmentId + "/whiteboard");
                        }
                    });
                }
                else {
                    assortment.linkCustomer($routeParams.assortmentId, customer).then(function (data) {
                        if (data.id > 0) {
                            $location.path("/assortment/edit/" + $routeParams.assortmentId + "/whiteboard");
                        }
                    });
                }
            });

        }

    });

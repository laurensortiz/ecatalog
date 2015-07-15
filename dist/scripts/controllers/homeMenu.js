'use strict';

angular.module('conductivEcatalogApp').controller('HomeMenuCtrl', function ($scope, $location, assortment, catalog, authentication, order) {
    catalog.getMasterCatalogs().then(function (data) {
        $scope.masterCatalogs = catalog.resolveRemoteUrls(data);
    });

    assortment.getAssortments().then(function (infoAssortment) {
        //TODO create a service, tha same function is being used in assortmentList.js
        var cleanAssortments = [];
        _.each(infoAssortment.data, function(eachAssortment){
            if(!eachAssortment.order){
                cleanAssortments.push(eachAssortment);
            }
        });
        $scope.listOfAssortments = cleanAssortments
    });

    $scope.defaultSelection = function (assortmentId) {
        $location.path("/assortment/edit/" + assortmentId + "/linesheet");
    };

    order.getAllOrders().then(function(orderList){
        $scope.orders = orderList.data;
    });

    $scope.redirectToOrderSummary = function (orderId) {
        $location.path("/orders/" + orderId);
    }
});

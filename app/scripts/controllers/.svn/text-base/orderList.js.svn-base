'use strict';

angular.module('conductivEcatalogApp').controller('OrderListCtrl', function ($scope, order, $location, $rootScope) {
    $rootScope.loading = true;

    order.all().then(function(orderList){
        $scope.orders = orderList.data;
        $rootScope.loading = false;
    });
    //TODO Refactor and check if $scope is needed.
    $scope.goToOrderSummary = function (orderId) {
        $location.path('/orders/' + orderId);
    };
});
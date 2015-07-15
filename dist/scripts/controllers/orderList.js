'use strict';

angular.module('conductivEcatalogApp').controller('OrderListCtrl', function ($scope, order, $location, $rootScope) {
    $rootScope.loading = true;

    order.getAllOrders().then(function(orderList){
        $scope.orders = orderList.data;
        $rootScope.loading = false;
    });
    $scope.goToOrderSummary = function (orderId) {
        $location.path('/orders/' + orderId);
    };
});
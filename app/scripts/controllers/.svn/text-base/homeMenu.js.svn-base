'use strict';

angular.module('conductivEcatalogApp').controller('HomeMenuCtrl', function ($scope, $location, assortment, order, Catalog) {
  Catalog.all().then(function (foundCatalogs) {
    $scope.masterCatalogs = foundCatalogs;
  });

  assortment.getAssortments().then(function (infoAssortment) {
    //TODO create a service, tha same function is being used in assortmentList.js
    var cleanAssortments = [];
    _.each(infoAssortment.data, function (eachAssortment) {
      if (!eachAssortment.order) {
        cleanAssortments.push(eachAssortment);
      }
    });
    $scope.listOfAssortments = cleanAssortments
  });

  $scope.defaultSelection = function (assortmentId) {
    $location.path("/assortment/edit/" + assortmentId + "/linesheet");
  };

  order.getAllOrders().then(function (orderList) {
    $scope.orders = orderList.data;
  });

  $scope.redirectToOrderSummary = function (orderId) {
    $location.path("/orders/" + orderId);
  }
});

'use strict';

angular.module('conductivEcatalogApp.models')
    .service('Order', function (OrderService) {
      var service = {
        find: function (id) {
          return OrderService.find(id);
        },
        all: function () {
          return OrderService.all();
        },
        create: function (order) {
          return OrderService.save(order);
        },
        email: function (email, order) {
          return OrderService.email(order, email);
        },
        sync: function () {
          return OrderService.sync();
        }
      };
      return service;
    });
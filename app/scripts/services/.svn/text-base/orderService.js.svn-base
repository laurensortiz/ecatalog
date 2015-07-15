'use strict';

angular.module('conductivEcatalogApp')
    .service('OrderService', function OrderService($http, httpCapi, $q, OfflineManager) {
      var ENTITY_TYPE = "Order";
      var offlineStorage;
      var userId = '123';
      var tenant = "wrangler";
      var getOfflineStorage = function () {
        if (offlineStorage === undefined) {
          offlineStorage = OfflineManager.getStorage(ENTITY_TYPE, tenant , userId);
        }
        return offlineStorage;
      }
      var service = {
        allFromCapi: function (method, url) {
          var deferred = $q.defer();
          $http({
            method: method,
            url: httpCapi.generateBaseApiUrl() + "/" + url,
            headers: httpCapi.generateCommonAPIHeaders()
          }).then(function (response) {
                deferred.resolve(response.data);
              });
          return deferred.promise;
        },
        all: function () {
          var deferred = $q.defer();
          getOfflineStorage().all(function (orderList) {
            deferred.resolve(orderList);
          });
          return deferred.promise;
        },
        find: function (id) {
          var deferred = $q.defer();
          getOfflineStorage().get(id, function (foundOrder) {
            deferred.resolve(foundOrder);
          });
          return deferred.promise;
        },
        newCAPI: function (order) {
          var deferred = $q.defer();
          $http({
            method: "POST",
            data: order,
            url: httpCapi.generateBaseApiUrl() + "/orders",
            headers: httpCapi.generateCommonAPIHeaders()
          }).then(function (response) {
                deferred.resolve(response.data);
              });
          return deferred.promise;
        },
        save: function (order) {
          var deferred = $q.defer();
          getOfflineStorage().save(order, function (response) {
            deferred.resolve(response);
          });
          return deferred.promise;
        },
        email: function (order, email) {
          var subject = "123";
          var format = "Excel";
          var deferred = $q.defer();
          $http({
            method: "POST",
            data: {
              'orderId': order.id,
              'format': format,
              'subject': subject,
              'recipients': email,
              'message': subject
            },
            url: httpCapi.generateBaseApiUrl() + "/actions/send-order-notification",
            headers: httpCapi.generateCommonAPIHeaders()
          }).then(function (response) {
                deferred.resolve(response.status);
              });
          return deferred.promise;
        },
        sync: function () {
          var deferred = $q.defer();
          this.allFromCapi().then(function (capiOrderList) {
            this.all().then(function (orderList) {
              angular.forEach(orderList, function (order) {
                //Let's check for unsubmitted orders, send them to CAPI and then add them to all the new CAPI orders
                if (order.id) {
                  this.newCAPI(order).then(function (newOrder) {
                    if (newOrder.id) {
                      order.id = newOrder.id;
                      order.status = 'submitted';
                    } else {
                      order.status = 'unsubmitted';
                    }
                  });
                  capiOrderList.push(order);
                }
              });
              deferred.resolve(capiOrderList);
            });
          });
          return deferred.promise;
        }
      };

      return service;
    });

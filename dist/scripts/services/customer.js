'use strict';

angular.module('conductivEcatalogApp')
    .factory('customer', function ($http, $q, httpCapi, SyncManager) {
        // Public API here
        var service = {};

        var ENTITY_TYPE_CUSTOMERS = 'Customers';
        var fetchCustomers = function () {
            var promise = $http({
                method: "GET",
                url: httpCapi.generateBaseApiUrl() + "/customers/?expand=postal-addresses",
                headers: httpCapi.generateCommonAPIHeaders()
            }).then(function (response) {
                    return response.data;
                });
            return promise;
        }

        service.getCustomers = function () {
            return SyncManager.fetch(fetchCustomers, ENTITY_TYPE_CUSTOMERS);
        };

        service.saveCustomers = function () {
            return SyncManager.save(fetchCustomers, ENTITY_TYPE_CUSTOMERS);
        };

        return service;

    });

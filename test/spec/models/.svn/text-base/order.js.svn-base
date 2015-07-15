'use strict';

describe('Model: Order', function() {
    // instantiate service
    var Order, q, rootScope;

    var mockDeferred;
    var mockOrderService = {
        find: function (id) {
            mockDeferred = q.defer();
            return mockDeferred.promise;
        },
        all: function() {
            mockDeferred = q.defer();
            return mockDeferred.promise;
        }
    }

    beforeEach(module('conductivEcatalogApp.models', function ($provide) {
        $provide.value('OrderService', mockOrderService);
    }));

    beforeEach(inject(function (_Order_, _$q_, _$rootScope_) {
        Order = _Order_;
        q = _$q_;
        rootScope = _$rootScope_;
    }));

    it('finds one by id', function () {
        var foundOrder;
        dump(Order)
        Order.find('123').then(function (found) {

            foundOrder = found;
        });
        mockDeferred.resolve({});
        rootScope.$apply();
        expect(foundOrder).toBeDefined();
    });

    it('fetches all the Orders', function () {
        var Orders;
        Order.all().then(function (found) {
            Orders = found;
        });
        mockDeferred.resolve([
            Factory.build('Order')
        ]);
        rootScope.$apply();
        expect(Orders.length).toBeGreaterThan(0);
    });
});

'use strict';

describe('Service: OrderService', function () {
  // instantiate service
  var OrderService, httpBackend, q, rootScope, mockDeferred, mockHttpCapi, mockOfflineManager;

  var sampleOrder = [Factory.build('Order', {id: '123456789'}), Factory.build('Order')];
  var VALID_ORDER_ID = '123456789';

  var mockSyncManager = {
    fetch: function () {
      mockDeferred = q.defer();
      return mockDeferred.promise;
    }
  }

  // load the service's module
  var provide;
  beforeEach(module('conductivEcatalogApp', 'select.mocks', function ($provide) {
    $provide.value('httpCapi', mockHttpCapi);
    $provide.value('SyncManager', mockSyncManager);
    $provide.value('OfflineManager', mockOfflineManager);
  }));

  beforeEach(inject(function (_OrderService_, _$httpBackend_, _$q_, _$rootScope_, _mockHttpCapi_, _mockOfflineManager_) {
    OrderService = _OrderService_;
    httpBackend = _$httpBackend_;

    q = _$q_;
    rootScope = _$rootScope_;
    mockHttpCapi = _mockHttpCapi_;
    mockOfflineManager = _mockOfflineManager_;
    mockOfflineManager.testObjects = sampleOrder;
  }));

  it('should be defined and true', function () {
    expect(!!OrderService).toBe(true);
  });

  it('should get an order from webkit', function () {
    var order;
    OrderService.find(VALID_ORDER_ID).then(function (found) {
      order = found;
    });

    rootScope.$apply();
    expect(order).toBeDefined();
  });

  it('should get all orders from webkit', function () {
    var orderList;
    OrderService.all().then(function (found) {
      orderList = found;
    });
    rootScope.$apply();
    expect(orderList).toBeDefined();
  });

  it('should save a new order to webkit', function () {
    var savedOrder;
    OrderService.save(sampleOrder).then(function (response) {
      savedOrder = response;
    });
    rootScope.$apply();
    expect(savedOrder).toBeDefined();
  });

  describe("When online", function () {
    it('should get all orders from CAPI and', function () {
      httpBackend.expectGET('/orders').respond(200, sampleOrder);

      var orderList;
      OrderService.allFromCapi("GET","orders").then(function (found) {
        orderList = found;
      });
      httpBackend.flush();

      expect(orderList.length).toBe(2);
    });

    it('should get all promotion codes from CAPI', function () {
      httpBackend.expectGET('/product-promos').respond(200, sampleOrder);

      var promoCodeList;
      OrderService.allFromCapi("GET", "product-promos").then(function (found) {
        promoCodeList = found;
      });
      httpBackend.flush();

      var savedCodes;
      OrderService.save(promoCodeList).then(function (response) {
        savedCodes = response;
      });
      rootScope.$apply();

      expect(savedCodes).toBeDefined();
    });

    it('should get all shipping methods from CAPI', function () {
      httpBackend.expectGET('/shipment-methods').respond(200, sampleOrder);

      var shipMethodList;
      OrderService.allFromCapi("GET", "shipment-methods").then(function (found) {
        shipMethodList = found;
      });
      httpBackend.flush();

      var savedShippingMethods;
      OrderService.save(shipMethodList).then(function (response) {
        savedShippingMethods = response;
      });
      rootScope.$apply();

      expect(savedShippingMethods).toBeDefined();
    });

    var newOrder;
    describe('should send order to CAPI when online', function () {
      it('should save a new order to CAPI', function () {
        httpBackend.expectPOST('/orders').respond(200, sampleOrder);

        OrderService.newCAPI(sampleOrder).then(function (response) {
          newOrder = response;
          sampleOrder.status = 'submitted';
        });

        httpBackend.flush();

        expect(newOrder).toBeDefined();
      });
    });
    it('should send an email with a given order', function () {
      var sampleEmail = "aorlich@77digital.com";
      httpBackend.expectPOST('/actions/send-order-notification').respond(200, sampleOrder);

      var sent = false;
      OrderService.email(sampleOrder, sampleEmail).then(function (response) {
        if (response == 200) {
          sent = true;
        }
      });
      httpBackend.flush();

      expect(sent).toBeTruthy();
    });


  });

});

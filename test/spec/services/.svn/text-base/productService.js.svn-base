'use strict';

describe('Service: ProductService', function () {
  // instantiate service
  var ProductService, httpBackend, q, rootScope, mockDeferred, mockHttpCapi, mockOfflineManager, mockAuthentication, mockFileSync ;

  var sampleProducts = [Factory.build('product', {id: '10840', quantity: '25'}), Factory.build('product-style-image', {connection:'SomeConnection', media: 'video,image'})];

  var VALID_PRODUCT_ID = '10840';
  var VALID_ASSORTMENT_ID = '1234';
  var ASSORTMENT_UPDATE_PRODUCT_LIST = '10840';

  var mockProductService = {
    all: function () {
      mockDeferred = q.defer();
      return mockDeferred.promise;
    },
    find: function (id) {
      mockDeferred = q.defer();
      return mockDeferred.promise;
    },
    setQuantity: function (id, quantity) {
      mockDeferred = q.defer();
      return mockDeferred.promise;
    },
    sync: function () {
      mockDeferred = q.defer();
      return mockDeferred.promise;
    }
  }

  // load the service's module
  beforeEach(module('conductivEcatalogApp', 'select.mocks', function ($provide) {
    $provide.value('httpCapi', mockHttpCapi);
    $provide.value('OfflineManager', mockOfflineManager);
    $provide.value('fileSync', mockFileSync);
    $provide.value('authentication', mockAuthentication);
  }));

  beforeEach(inject(function (_ProductService_, _$httpBackend_, _$q_, _$rootScope_, _mockHttpCapi_, _mockOfflineManager_, _mockFileSync_, _mockAuthentication_ ) {
    ProductService = _ProductService_;
    httpBackend = _$httpBackend_;
    q = _$q_;
    rootScope = _$rootScope_;
    mockHttpCapi = _mockHttpCapi_;
    mockOfflineManager = _mockOfflineManager_;
    mockFileSync = _mockFileSync_;
    mockOfflineManager.testObjects = sampleProducts;
    mockAuthentication = _mockAuthentication_;
  }));

  it('should be defined and true', function () {
    expect(!!ProductService).toBe(true);
  });

  it('should find all products from CAPI', function () {
    var product;
    ProductService.all().then(function (found) {
      product = found;
    });
    rootScope.$apply();
    expect(product).toBeDefined();
  });

  describe('when associating products to an Assortment', function () {

    it('should associate with Assortment in local storage', function (){
      var spyOnSetAssociation = jasmine.createSpy();
      ProductService.associateWithAssortment(VALID_PRODUCT_ID, VALID_ASSORTMENT_ID).then(spyOnSetAssociation);
      rootScope.$apply();
      expect(spyOnSetAssociation).toHaveBeenCalled();
    });

  });

//  describe('when products have been associated to an Assortment and quantities need edits, they', function () {
//
//    it('should set the product quantity', function (){
//      var quantity = 25;
//      var spySetQuantity = jasmine.createSpy();
//      ProductService.setQuantity(VALID_PRODUCT_ID, quantity).then(spySetQuantity);
//      rootScope.$apply();
//      expect(quantity).toBeDefined();
//    });
//
//    it('should return the product quantity by Id', function (){
//      var quantity;
//      ProductService.getQuantity(VALID_PRODUCT_ID).then(function (found) {
//        dump(found);
//        quantity = found;
//      });
//      mockDeferred.resolve(sampleProducts);
//      rootScope.$apply();
//      expect(product).toBeDefined();
//
//    });
//  });
//
//  describe('when syncing a product', function () {
//    it('should be able to sync all products', function () {
//      httpBackend.expectGET('/assortments/' + VALID_ASSORTMENT_ID + '/displayStyle').respond(200, sampleProducts);
//
//      var mockCallback = jasmine.createSpy();
//      ProductService.sync(VALID_PRODUCT_ID).then(mockCallback);
//      rootScope.$apply();
//      httpBackend.flush();
//      expect(mockCallback).toHaveBeenCalled();
//    });
//  });


});

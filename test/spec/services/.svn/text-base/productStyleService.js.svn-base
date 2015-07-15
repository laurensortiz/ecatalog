'use strict';

describe('Service: ProductStyleService', function () {
  // instantiate service
  var ProductStyleService, httpBackend, q, rootScope, mockDeferred, mockHttpCapi;
  var ASSORTMENT_UPDATE_PRODUCTSTYLE_LIST = [];
  var VALID_PRODUCTSTYLE_ID = '10840';

  var sampleProductStyleServer = [Factory.build('productStyle', {id: VALID_PRODUCTSTYLE_ID}), Factory.build('product-style-image', {connection:'SomeConnection', media: 'video,image'})];
  var sampleProductStylelocal = [Factory.build('productStyle-local', {id: VALID_PRODUCTSTYLE_ID}), Factory.build('productStyle-local')];

  var mockSyncManager = {
    fetch: function () {
      mockDeferred = q.defer();
      return mockDeferred.promise;
    }
  }

  // load the service's module
  beforeEach(module('conductivEcatalogApp', 'select.mocks', function ($provide) {
    $provide.value('httpCapi', mockHttpCapi);
    $provide.value('SyncManager', mockSyncManager);
  }));

  beforeEach(inject(function (_ProductStyleService_, _$httpBackend_, _$q_, _$rootScope_, _mockHttpCapi_) {
    ProductStyleService = _ProductStyleService_;
    httpBackend = _$httpBackend_;
    q = _$q_;
    rootScope = _$rootScope_;
    mockHttpCapi = _mockHttpCapi_;
  }));

  it('should be defined and true', function () {
    expect(!!ProductStyleService).toBe(true);
  });

  it('should fetch all product styles from local storage', function () {
    httpBackend.expectGET('/product-styles').respond(200, sampleProductStyleServer);

    var products;
    ProductStyleService.allFromCapi().then(function (found) {
      products = found;
    });
    httpBackend.flush();

    expect(products.length).toBe(2);
  });

  it('should get a product style from local Storage', function () {
    var product;
    ProductStyleService.find(VALID_PRODUCTSTYLE_ID).then(function (found) {
      product = found;
    });
    mockDeferred.resolve(sampleProductStyleServer);
    rootScope.$apply();
    expect(product).toBeDefined();
  });

  describe('when associating products styles to an Assortment', function () {

    it('should associate with Assortment in CAPI', function (){
      var productStyleId = 10480, assortmentId = 12345 ;
      httpBackend.expectPOST("/assortments/" + assortmentId + "/product-styles?productStyleId=" + productStyleId).respond(200, sampleProductStyleServer);

      var updatedList;
      ProductStyleService.associateWithAssortmentCAPI(productStyleId, assortmentId).then(function (newList) {
        updatedList = newList;
      });
      httpBackend.flush();

      expect(updatedList).toBeDefined();
    });
    it('should associate Product Style with Assortment in local storage', function (){
      var productStyleId = 10480, assortmentId = 12345 ;
      var updatedList;
      ProductStyleService.associateWithAssortment(productStyleId, assortmentId).then(function (newList) {
        updatedList = newList;
      });

      mockDeferred.resolve(sampleProductStylelocal);
      rootScope.$apply();
      expect(updatedList).toBeDefined();
    });
  });
});


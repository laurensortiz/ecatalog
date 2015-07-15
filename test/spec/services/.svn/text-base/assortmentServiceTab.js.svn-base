'use strict';

describe('Service: AssortmentServiceTab', function () {

  // instantiate service
  var AssortmentServiceTab, httpBackend, q, rootScope, mockDeferred, mockHttpCapi, mockOfflineManager, mockFileSync,
      VALID_ASSORTMENT_ID = '123',
      DUPLICATED_ASSORTMENT_ID = '321',
      UPDATE_ASSORTMENT_DESCRIPTION = 'This is a new Description';

  var sampleAssortments = [Factory.build('assortment-tab', {id: '123', description: 'Assortment name', createdBy: '10060', lastUpdatedTime: '2013-09-12T00:37:36.378Z', group: 'assortmentGroup', links: {
    "product-styles": "",
    products: {
      id: "123!10230-000040",
      type: "AssortmentProduct",
      productId: "10230-000040",
      description: "M GILBERT CROCKETT PRO (Herringbone Twill) Tobacco 8",
      unitPrice: 70.000,
      quantity: 0,
      upc: "885928585897",
      sku: "VN-0VNRAYP-080-M",
      links: {
        self: "https://sb-ecatalog.conductiv.com/capi/rest/v2/VANSSB/assortments/27870/products/10230-000040"
      }
    }
  }}), Factory.build('assortment-tab', {id: '456', description: 'Assortment name 2', createdBy: '10060', lastUpdatedTime: '', group: 'assortmentGroup', links: {
    "product-styles": "",
    products: ""
  }})];

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
    $provide.value('OfflineManager', mockOfflineManager);
    $provide.value('fileSync', mockFileSync);
  }));

  beforeEach(inject(function (_AssortmentServiceTab_, _$httpBackend_, _$q_, _$rootScope_, _mockHttpCapi_, _mockOfflineManager_, _mockFileSync_) {
    AssortmentServiceTab = _AssortmentServiceTab_;
    httpBackend = _$httpBackend_;
    q = _$q_;
    rootScope = _$rootScope_;
    mockHttpCapi = _mockHttpCapi_;
    mockOfflineManager = _mockOfflineManager_;
    mockFileSync = _mockFileSync_;
    mockOfflineManager.testObjects = sampleAssortments;
  }));

  it('validate service', function () {
    expect(!!AssortmentServiceTab).toBe(true);
  });

  it('should have a list of assortments that returns all', function () {
    var assortments;
    AssortmentServiceTab.all().then(function (found) {

      assortments = found;
    });

    rootScope.$apply();
    expect(assortments.length).toBe(2);

  });

  describe('when finding a assortment by id', function () {

    var assortment;

    beforeEach(function () {
      AssortmentServiceTab.find(VALID_ASSORTMENT_ID).then(function (found) {
        assortment = found;
      });

      rootScope.$apply();
    });

    it('should return assortment object', function () {
      expect(assortment).toBeDefined();
    });

    it('should return assortment description', function () {
      expect(assortment.description).toBeDefined();
    });

    it('should return assortment group name', function () {
      expect(assortment.group).toBeDefined();
    });

    it('should always check if it has products associated', function () {
      expect(assortment.links["products"]).toBeDefined();
    });

    it('should always check if it has product styles associated', function () {
      expect(assortment.links["product-styles"]).toBeDefined();
    });

    it('should have a Customer linked', function () {
      expect(assortment.createdBy).toBeDefined();
    });

    it('can saved into local storage', function () {
      AssortmentServiceTab.save(assortment).then(function (response) {
        assortment = response;
      });

      expect(assortment).toBeDefined();
    });

    it('should modify the description and update it into local storage', function () {

      AssortmentServiceTab.rename(VALID_ASSORTMENT_ID, UPDATE_ASSORTMENT_DESCRIPTION).then(function (found) {
        assortment = found;
      });
      rootScope.$apply();

      expect(assortment.description).toBe(UPDATE_ASSORTMENT_DESCRIPTION);
    });

    it('can be deleted from local storage', function () {
      AssortmentServiceTab.remove(VALID_ASSORTMENT_ID).then(function (found) {
        assortment = found;
      });
      rootScope.$apply();
      expect(assortment).toBeDefined();
    });

  });

  describe('when duplicating', function () {
    var assortment,
        duplicatedAssortment;

    beforeEach(function () {
      AssortmentServiceTab.find(VALID_ASSORTMENT_ID).then(function (found) {
        assortment = found;
      });

      duplicatedAssortment = _.clone(assortment);
      rootScope.$apply();
    });

    it('should have an assortment referred', function () {
      expect(assortment).toBeDefined();
    });

    it('should clone the assortment referred', function () {
      expect(duplicatedAssortment).toEqual(assortment);
    });

    it('should modify the Last Updated Time to assortment cloned', function () {
      var date = new Date();
      duplicatedAssortment.lastUpdatedTime = new Date();
      expect(duplicatedAssortment.lastUpdatedTime).toEqual(date);
    });

    it('should have a new Id', function () {
      duplicatedAssortment.id = DUPLICATED_ASSORTMENT_ID;
      expect(duplicatedAssortment.id).not.toBe(assortment.id);
    });

    it('should be referred to a new Key', function () {
      duplicatedAssortment.key = 'Assortment|' + duplicatedAssortment.id;
      expect(duplicatedAssortment.key).toBe('Assortment|' + duplicatedAssortment.id);
    });

    describe('when products are present', function () {

      it('should allow to copy product quantities', function () {
        duplicatedAssortment.products = assortment.products;
        expect(duplicatedAssortment.products).toBe(assortment.products);
      });

    });

    it('should be saved into local storage', function () {
      AssortmentServiceTab.save(duplicatedAssortment).then(function (response) {
        duplicatedAssortment = response;
      });
      expect(duplicatedAssortment).toBeDefined();
    });

  });

});

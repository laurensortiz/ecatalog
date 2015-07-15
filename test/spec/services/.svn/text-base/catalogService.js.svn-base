'use strict';

describe('Service: CatalogService', function () {

  // instantiate service
  var CatalogService, httpBackend, q, rootScope, mockDeferred, mockHttpCapi, mockOfflineManager, mockFileSync, mockAuthentication;

  var VALID_CATALOG_ID = '10070';
  var INVALID_CATALOG_ID = '123123123';
  var SYNCED_CATALOG_ID = '10080';

  var sampleCatalogs = [Factory.build('catalog', {id: VALID_CATALOG_ID}), Factory.build('synced-catalog', {id: SYNCED_CATALOG_ID}), Factory.build('catalog')];
  var sampleProductStyleImages = [Factory.build('product-style-image'), Factory.build('product-style-image')];

  // load the service's module
  var provide;
  beforeEach(module('conductivEcatalogApp', 'select.mocks', function ($provide) {
    $provide.value('httpCapi', mockHttpCapi);
    $provide.value('OfflineManager', mockOfflineManager);
    $provide.value('fileSync', mockFileSync);
    $provide.value('authentication', mockAuthentication);
  }));

  beforeEach(inject(function (_CatalogService_, _$httpBackend_, _$q_, _$rootScope_, _mockHttpCapi_, _mockOfflineManager_, _mockFileSync_, _mockAuthentication_) {
    CatalogService = _CatalogService_;
    httpBackend = _$httpBackend_;
    q = _$q_;
    rootScope = _$rootScope_;
    mockHttpCapi = _mockHttpCapi_;
    mockOfflineManager = _mockOfflineManager_;
    mockFileSync = _mockFileSync_;
    mockOfflineManager.testObjects = sampleCatalogs;
    mockAuthentication = _mockAuthentication_;
  }));

  it('should exist', function () {
    expect(!!CatalogService).toBe(true);
  });

  it('should fetch all from local storage', function () {
    var catalogs;
    CatalogService.all().then(function (found) {
      catalogs = found;
    });

    rootScope.$apply();
    expect(catalogs.length).toBeGreaterThan(0);
  });

  describe('when finding a catalog by id', function () {
    var catalog;
    describe('when the catalog is present', function () {
      beforeEach(function () {
        CatalogService.find(VALID_CATALOG_ID).then(function (found) {
          catalog = found;
        });
        rootScope.$apply();
      });

      it('should exist', function () {
        expect(catalog).toBeDefined();
      });

      it('should have a root catalog path', function () {
        expect(catalog.rootCatalogPath).toBeDefined();
      });
    });

    it('should not fetch a catalog when not present', function () {
      var catalog;
      CatalogService.find(INVALID_CATALOG_ID).then(function (found) {
        catalog = found;
      });
      rootScope.$apply();
      expect(catalog).toBeUndefined();
    });
  });

  describe('when fetching pages for a catalog from offline storage', function () {
    it("should return the pages if the catalog is already synced", function () {
      var pages;
      CatalogService.pages(SYNCED_CATALOG_ID).then(function (found) {
        pages = found;
      });
      rootScope.$apply();
      expect(pages.length).toBeGreaterThan(0);
    });

    it("should not return the pages if the catalog is not synced", function () {
      var pages;
      CatalogService.pages(VALID_CATALOG_ID).then(function (found) {
        pages = found;
      });
      rootScope.$apply();
      expect(pages).toBeUndefined();
    });
  });

  it('should be able to sync the data', function () {
    httpBackend.expectGET('/master-catalogs').respond(200, sampleCatalogs);

    var savedCatalogs;
    CatalogService.sync().then(function (savedCatalogsFromCallback) {
      savedCatalogs = savedCatalogsFromCallback
    });
    httpBackend.flush();
    expect(sampleCatalogs.length).toBe(savedCatalogs.length);
  });

  it('should be able to sync files related to a catalog', function () {
    httpBackend.expectGET('/master-catalogs/' + VALID_CATALOG_ID + '/product-styles/images').respond(200, sampleProductStyleImages);

    var mockCallback = jasmine.createSpy();
    CatalogService.syncFiles(VALID_CATALOG_ID).then(mockCallback);
    rootScope.$apply();
    httpBackend.flush();
    expect(mockCallback).toHaveBeenCalled();
  });

  it('should be able to sync the detailed information (pages and stylesheet) related to a catalog', function () {
    var sampleCatalogPages = [Factory.build('catalog-page'), Factory.build('catalog-page')];
    httpBackend.expectGET('/master-catalogs/' + VALID_CATALOG_ID).respond(200, Factory.build('catalog-details', {id: VALID_CATALOG_ID}));
    httpBackend.expectGET('/master-catalogs/' + VALID_CATALOG_ID + '/pages?expand=self').respond(200, sampleCatalogPages);
    var savedCatalog;
    CatalogService.syncDetails(VALID_CATALOG_ID).then(function (catalog) {
      savedCatalog = catalog;
    });
    rootScope.$apply();
    httpBackend.flush();
    expect(savedCatalog.links.stylesheet).toBeDefined();
    expect(savedCatalog.pages.length).toBeDefined();
  });
});

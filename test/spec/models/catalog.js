'use strict';

describe('Model: catalog', function () {
  // instantiate service
  var Catalog, q, rootScope, mockCatalogService;

  var VALID_CATALOG_ID = '100010';
  // load the service's module
  beforeEach(module('conductivEcatalogApp.models', 'select.mocks', function ($provide) {
    $provide.value('CatalogService', mockCatalogService);
  }));

  beforeEach(inject(function (_Catalog_, _$q_, _$rootScope_, _mockCatalogService_) {
    Catalog = _Catalog_;
    q = _$q_;
    rootScope = _$rootScope_;
    mockCatalogService = _mockCatalogService_;
  }));

  it('should do something', function () {
    expect(!!Catalog).toBe(true);
  });

  it('finds one by id', function () {
    var successCallback = jasmine.createSpy();
    Catalog.find(VALID_CATALOG_ID).then(successCallback);
    expect(successCallback).toHaveBeenCalled();
  });

  it('fetches all the catalogs', function () {
    var successCallback = jasmine.createSpy();
    Catalog.all().then(successCallback);
    expect(successCallback).toHaveBeenCalled();
  });

  it('syncs the data for all the catalogs', function () {
    var successCallback = jasmine.createSpy();
    Catalog.sync().then(successCallback);
    expect(successCallback).toHaveBeenCalled();
  });

  it('syncs the files for a particular catalog', function () {
    var successCallback = jasmine.createSpy();
    Catalog.syncFiles(VALID_CATALOG_ID).then(successCallback);
    expect(successCallback).toHaveBeenCalled();
  });

  it('syncs detailed data related to a particular catalog', function () {
    var successCallback = jasmine.createSpy();
    Catalog.syncDetails(VALID_CATALOG_ID).then(successCallback);
    expect(successCallback).toHaveBeenCalled();
  });

  it('fetches pages related to a given catalog', function () {
    var successCallback = jasmine.createSpy();
    Catalog.pages(VALID_CATALOG_ID).then(successCallback);
    expect(successCallback).toHaveBeenCalled();
  });
});
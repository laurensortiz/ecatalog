'use strict';

describe('Model: Product', function() {
  // load the model
  var Product, q, rootScope;
  var sampleProducts = [Factory.build('product', {id: '10840'}), Factory.build('product')];

  var mockDeferred;
  var mockProductService = {
    all: function () {
      mockDeferred = q.defer();
      return mockDeferred.promise;
    },
    find: function (id) {
      mockDeferred = q.defer();
      return mockDeferred.promise;
    }
  }

/// load the service's module
  beforeEach(module('conductivEcatalogApp.models', function ($provide) {
    $provide.value('ProductService', mockProductService);
  }));

  beforeEach(inject(function (_Product_, _$q_, _$rootScope_) {
    Product = _Product_;
    q = _$q_;
    rootScope = _$rootScope_;
  }));

  it('should be defined and true', function() {
    return expect(!!Product).toBe(true);
  });

  it('should find one product by id', function () {
    var foundProduct;
    Product.find('123').then(function (found) {
      foundProduct = found;
    });
    mockDeferred.resolve({});
    rootScope.$apply();
    expect(foundProduct).toBeDefined();
  });

  it('should find all products', function () {
    var productFound;
    Product.all().then(function (found) {
      productFound = found;
    });
    mockDeferred.resolve(sampleProducts);
    rootScope.$apply();
    expect(productFound.length).toBeGreaterThan(0);
  });

});

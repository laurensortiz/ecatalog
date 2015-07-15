'use strict';

describe('Model: ProductStyle', function() {
  // load the model
  var ProductStyle, q, rootScope;

  var mockDeferred;
  var mockProductStyle = {
    find: function (id) {
      mockDeferred = q.defer();
      return mockDeferred.promise;
    },
    sync: function () {
      mockDeferred = q.defer();
      return mockDeferred.promise;
    }
  }

/// load the service's module
  beforeEach(module('conductivEcatalogApp.models', function ($provide) {
    $provide.value('ProductStyle', mockProductStyle);
  }));

  beforeEach(inject(function (_ProductStyle_, _$q_, _$rootScope_) {
    ProductStyle = _ProductStyle_;
    q = _$q_;
    rootScope = _$rootScope_;
  }));

  it('should be present', function() {
    return expect(!!ProductStyle).toBe(true);
  });

  it('syncs all the products', function () {
    var successCallback = jasmine.createSpy();
    ProductStyle.sync().then(successCallback);
    mockDeferred.resolve();
    rootScope.$apply();
    expect(successCallback).toHaveBeenCalled();
  });
});


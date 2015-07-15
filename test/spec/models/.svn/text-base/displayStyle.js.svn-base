'use strict';

describe('Model: DisplayStyle', function() {
  // load the model
  var DisplayStyle, q, rootScope;

  var sampleDisplayStyle = [Factory.build('product', {id: '10840'}), Factory.build('product')];

  var mockDeferred;
  var mockProductService = {
    all: function () {
      mockDeferred = q.defer();
      return mockDeferred.promise;
    },
    find: function (id) {
      mockDeferred = q.defer();
      return mockDeferred.promise;
    },
    sync: function (filter) {
      mockDeferred = q.defer();
      return mockDeferred.promise;
    },
    image: function (filter) {
      mockDeferred = q.defer();
      return mockDeferred.promise;
    }
  }

  // load the service's module
  beforeEach(module('conductivEcatalogApp.models', function ($provide) {
    $provide.value('DisplayStyleService', mockProductService);
  }));

  beforeEach(inject(function (_DisplayStyle_, _$q_, _$rootScope_) {
    DisplayStyle = _DisplayStyle_;
    q = _$q_;
    rootScope = _$rootScope_;
  }));

  it('should be present', function() {
    return expect(!!DisplayStyle).toBe(true);
  });

    it('should find all DisplayStyles', function () {
      var foundAllDisplayStyle;
      DisplayStyle.all().then(function (found) {
        foundAllDisplayStyle = found;
      });
      mockDeferred.resolve(sampleDisplayStyle);
      rootScope.$apply();
      expect(foundAllDisplayStyle.length).toBeGreaterThan(0);
    });

    it('finds one by id', function () {
      var foundDisplayStyle;
      DisplayStyle.find('123').then(function (found) {

        foundDisplayStyle = found;
      });
      mockDeferred.resolve({});
      rootScope.$apply();
      expect(foundDisplayStyle).toBeDefined();
    });

    it('syncs all the DisplayStyle', function () {
      var successCallback = jasmine.createSpy();
      DisplayStyle.sync().then(successCallback);
      mockDeferred.resolve();
      rootScope.$apply();
      expect(successCallback).toHaveBeenCalled();
    });
});


'use strict';

describe('Service: OfflineManager', function () {
  var OfflineManager;
  beforeEach(module('conductivEcatalogApp'));
  beforeEach(inject(function (_OfflineManager_) {
    OfflineManager = _OfflineManager_;
  }));

  it('should do something', function () {
    expect(!!OfflineManager).toBe(true);
  });

  it('should be able to generate storage given both entity type and username and tenant', function () {
    var storage = OfflineManager.getStorage("ProductStyle", "vibhor@wrangler");
    expect(storage instanceof Lawnchair).toBeTruthy();
  });

  it('should be able to generate storage given the entity type and tenant', function () {
    var storage = OfflineManager.getStorage("ProductStyle", "wrangler");
    expect(storage instanceof Lawnchair).toBeTruthy();
  });

  describe('when trying to generate storage with invalid input', function () {
    it('should be null when no params', function () {
      var storage = OfflineManager.getStorage();
      expect(storage).toBeNull();
    });

    it('should be null when entity type absent', function () {
      var storage = OfflineManager.getStorage(null, 'wrangler', 'vibhor');
      expect(storage).toBeNull();
    });

    it('should be null when tenant is absent', function () {
      var storage = OfflineManager.getStorage("ProductStyle", null, 'vibhor');
      expect(storage).toBeNull();
    });

    it('should be null when both entity type and tenant are absent', function () {
      var storage = OfflineManager.getStorage(null, null, 'vibhor');
      expect(storage).toBeNull();
    });
  });
});
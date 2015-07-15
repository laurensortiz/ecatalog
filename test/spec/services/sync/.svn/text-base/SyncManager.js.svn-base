'use strict';

describe('Service: SyncManager', function () {
  var SyncManager, q, rootScope;
  beforeEach(module('conductivEcatalogApp'));
  beforeEach(inject(function (_SyncManager_, _$q_, _$rootScope_) {
    SyncManager = _SyncManager_;
    q = _$q_;
    rootScope = _$rootScope_;
  }));

  it('should do something', function () {
    expect(!!SyncManager).toBe(true);
  });

  describe('when a client registers', function () {
    var syncMethod, syncMethodDeferred;
    beforeEach(function () {
      syncMethodDeferred = q.defer();
      syncMethod = jasmine.createSpy().andReturn(syncMethodDeferred.promise);
    });

    describe('on the application queue', function(){
      beforeEach(function(){
        SyncManager.registerSync(syncMethod);
      });

      it("should run the sync method on syncing the application queue", function(){
        SyncManager.sync().then(function(){});
        syncMethodDeferred.resolve();
        rootScope.$apply();
        expect(syncMethod).toHaveBeenCalled();
      });

      it("should not run the sync method on syncing some other queue", function(){
        var anotherSyncDefer = q.defer();
        var anotherSyncMethod = jasmine.createSpy().andReturn(anotherSyncDefer.promise);
        SyncManager.registerSync(anotherSyncMethod, 'TestQueue');
        SyncManager.sync('TestQueue').then(function(){});
        anotherSyncDefer.resolve();
        rootScope.$apply();
        expect(syncMethod).not.toHaveBeenCalled();
        expect(anotherSyncMethod).toHaveBeenCalled();
      });
    });

  });
});
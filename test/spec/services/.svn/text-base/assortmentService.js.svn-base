'use strict';

describe('Service: AssortmentService', function () {
  // instantiate service
  var AssortmentService, rootScope, mockOfflineManager, mockAssortmentTab, mockHelperService;

  var VALID_ASSORTMENT_ID = "10000123";

  var sampleAssortmentGroups = [Factory.build('assortment-group', {id: VALID_ASSORTMENT_ID})];

  var sampleAssortmentTabs = [Factory.build('assortment-tab', {groupId: VALID_ASSORTMENT_ID}), Factory.build('assortment-tab', {groupId: VALID_ASSORTMENT_ID})];

  beforeEach(module('conductivEcatalogApp', 'select.mocks', function ($provide) {
    $provide.value('OfflineManager', mockOfflineManager);
    $provide.value('AssortmentTab', mockAssortmentTab);
    $provide.value('Helper', mockHelperService);
  }));

  beforeEach(inject(function (_AssortmentService_, _$rootScope_, _mockOfflineManager_, _mockAssortmentTabModel_, _mockHelper_) {
    AssortmentService = _AssortmentService_;
    rootScope = _$rootScope_;
    mockOfflineManager = _mockOfflineManager_;
    mockAssortmentTab = _mockAssortmentTabModel_;
    mockHelperService = _mockHelper_;

    mockAssortmentTab.mockAssortmentTabs = sampleAssortmentTabs;
    mockOfflineManager.testObjects = sampleAssortmentGroups;
  }));

  it('validate service', function () {
    expect(!!AssortmentService).toBe(true);
  });

  it('should fetch all assortment groups', function () {
    var assortmentGroups;
    AssortmentService.all().then(function (foundAssortmentGroups) {
      assortmentGroups = foundAssortmentGroups;
    });
    rootScope.$apply();
    expect(assortmentGroups.length).toBeDefined();
  });

  describe('when creating a new assortment group', function () {
    it('should create an assortment group', function () {
      var spyOnGroupCreation = jasmine.createSpy();
      AssortmentService.create('Lawrens').then(spyOnGroupCreation);
      rootScope.$apply();
      expect(spyOnGroupCreation).toHaveBeenCalled();
    });

    it('should create and associate an assortment with this group', function () {
      var originalNumberOfTabs = mockAssortmentTab.mockAssortmentTabs.length;
      AssortmentService.create('Lawrens').then(function () {
      });
      rootScope.$apply();
      expect(mockAssortmentTab.mockAssortmentTabs.length).toBe(originalNumberOfTabs + 1);
    });

    describe('when finding', function () {
      it('should be able to find an assortment group given valid id', function () {
        var foundAssortmentGroup;
        AssortmentService.find(VALID_ASSORTMENT_ID).then(function (found) {
          foundAssortmentGroup = found;
        });

        rootScope.$apply();
        expect(foundAssortmentGroup.id).toBe(VALID_ASSORTMENT_ID);
      });

      it('should not be able to find an assortment group given invalid id', function () {
        var foundAssortmentGroup;
        AssortmentService.find('invalid id').then(function (found) {
          foundAssortmentGroup = found;
        });

        rootScope.$apply();
        expect(foundAssortmentGroup).toBeUndefined();
      });
    });

    it('should update assortment group', function () {
      var testAssortmentGroup = Factory.build('assortment-group');
      var updatedAssortmentGroup;
      var NEW_NAME = "new name";
      AssortmentService.create(testAssortmentGroup).then(function () {
        testAssortmentGroup.name = NEW_NAME;
        AssortmentService.save(testAssortmentGroup).then(function (updated) {
          updatedAssortmentGroup = updated;
        });
      });
      rootScope.$apply();
      expect(updatedAssortmentGroup.name).toBe(NEW_NAME);
    });

    it('should be able to remove an assortment group', function () {
      var testAssortmentGroup = Factory.build('assortment-group');
      var foundAssortmentGroupAfterDeletion;
      AssortmentService.create(testAssortmentGroup).then(function () {
        AssortmentService.remove(testAssortmentGroup).then(function () {
          AssortmentService.find(testAssortmentGroup.id).then(function (found) {
            foundAssortmentGroupAfterDeletion = found;
          });
        });
      });
      rootScope.$apply();
      expect(foundAssortmentGroupAfterDeletion).toBeUndefined();
    });

    it('should be able to find all associated assortments', function () {
      var tabs;
      AssortmentService.assortmentTabs(VALID_ASSORTMENT_ID).then(function (foundTabs) {
        tabs = foundTabs;
      });
      rootScope.$apply();
      expect(tabs.length).toBe(2);
    });

    describe('when duplicating', function () {
      it('should be able to duplicate with quantities', function () {
        var duplicateQuantitiesFalse = false;
        var spy = jasmine.createSpy();
        AssortmentService.duplicate(VALID_ASSORTMENT_ID, duplicateQuantitiesFalse).then(spy);
        rootScope.$apply();
        expect(spy).toHaveBeenCalled();
      });

      it('should be able to duplicate without quantities', function () {
        var duplicateQuantitiesFalse = true;
        var spy = jasmine.createSpy();
        AssortmentService.duplicate(VALID_ASSORTMENT_ID, duplicateQuantitiesFalse).then(spy);
        rootScope.$apply();
        expect(spy).toHaveBeenCalled();
      });
    })

  });
});

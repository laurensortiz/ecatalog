'use strict';

describe('Model: Assortment', function() {
  // instantiate service
  var Assortment, q, rootScope, mockAssortmentService;

	var VALID_ASSORTMENT_GROUP_NAME = 'groupName',
			VALID_ASSORTMENT_ID = '123',
			VALID_ASSORTMENT_GROUP_ID = '100647',
			DUPLICATE_QUANTITIES = true,
			VALID_ASSORTMENT_GROUP = [{}],
			UPDATE_ASSORTMENT_DESCRIPTION = 'This is a new Description Group';
	// load the service's module
	beforeEach(module('conductivEcatalogApp.models', 'select.mocks', function ($provide) {
		$provide.value('AssortmentService', mockAssortmentService);
	}));

	beforeEach(inject(function (_Assortment_, _$q_, _$rootScope_, _mockAssortmentService_) {
		Assortment = _Assortment_;
		q = _$q_;
		rootScope = _$rootScope_;
		mockAssortmentService = _mockAssortmentService_;
	}));

	it('validate service', function () {
		expect(!!Assortment).toBe(true);
	});

	it('duplicate selected', function () {
		var successCallback = jasmine.createSpy();
		Assortment.duplicate(VALID_ASSORTMENT_GROUP_ID, DUPLICATE_QUANTITIES).then(successCallback);
		expect(successCallback).toHaveBeenCalled();
	});

	it('change the description', function () {
		var successCallback = jasmine.createSpy();
		Assortment.rename(VALID_ASSORTMENT_GROUP_ID, UPDATE_ASSORTMENT_DESCRIPTION).then(successCallback);
		expect(successCallback).toHaveBeenCalled();
	});

	it('delete selected', function () {
		var successCallback = jasmine.createSpy();
		Assortment.remove(VALID_ASSORTMENT_ID).then(successCallback);
		expect(successCallback).toHaveBeenCalled();
	});


});

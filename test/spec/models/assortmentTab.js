'use strict';

describe('Model: AssortmentTab', function () {
	// instantiate service
	var AssortmentTab, q, rootScope, mockAssortmentTabService, mockAssortmentCurrentService;

	var VALID_ASSORTMENT_ID = '123',
			DUPLICATE_QUANTITIES = true,
			UPDATE_ASSORTMENT_DESCRIPTION = 'This is a new Description';
	// load the service's module
	beforeEach(module('conductivEcatalogApp.models', 'select.mocks', function ($provide) {
		$provide.value('AssortmentServiceTab', mockAssortmentTabService);
		$provide.value('AssortmentCurrentService', mockAssortmentCurrentService);
	}));

	beforeEach(inject(function (_AssortmentTab_, _$q_, _$rootScope_, _mockAssortmentTabService_, _mockAssortmentCurrentService_) {
		AssortmentTab = _AssortmentTab_;
		q = _$q_;
		rootScope = _$rootScope_;
		mockAssortmentTabService = _mockAssortmentTabService_;
		mockAssortmentCurrentService = _mockAssortmentCurrentService_;
		mockAssortmentTabService.find = function(){
			return {
				then: function(callback){
					callback(Factory.build('assortment-tab', {id: VALID_ASSORTMENT_ID}));
				}
			}
		}
	}));

	it('validate service', function () {
		expect(!!AssortmentTab).toBe(true);
	});

	it('finds one by id', function () {
		var assortment;
		AssortmentTab.find(VALID_ASSORTMENT_ID).then(function(found){
			assortment = found;
		});
		rootScope.$apply();
		expect(assortment).toBeDefined();
		expect(assortment).not.toBeNull();
	});

	it('fetches all the assortments', function () {
		var successCallback = jasmine.createSpy();
		AssortmentTab.all().then(successCallback);
		expect(successCallback).toHaveBeenCalled();
	});

	it('duplicate selected', function () {
		var successCallback = jasmine.createSpy();
		AssortmentTab.duplicate(VALID_ASSORTMENT_ID, DUPLICATE_QUANTITIES).then(successCallback);
		expect(successCallback).toHaveBeenCalled();
	});

	it('change the description', function () {
		var successCallback = jasmine.createSpy();
		AssortmentTab.rename(VALID_ASSORTMENT_ID, UPDATE_ASSORTMENT_DESCRIPTION).then(successCallback);
		expect(successCallback).toHaveBeenCalled();
	});

	it('delete selected', function () {
		var successCallback = jasmine.createSpy();
		AssortmentTab.remove(VALID_ASSORTMENT_ID).then(successCallback);
		expect(successCallback).toHaveBeenCalled();
	});

	describe('current assortment', function () {
		describe('when not set', function(){
			it('should not be able to fetch the current assortment', function(){
				var currentTab = AssortmentTab.current.get();
				expect(currentTab).toBeNull();
			});
		});

		it('should be able to set', function(){
			var callback = jasmine.createSpy();
			AssortmentTab.current.set(VALID_ASSORTMENT_ID).then(callback);
			rootScope.$apply();
			expect(callback).toHaveBeenCalled();
		});

		describe('when set', function(){
			it('should be able to get the tab that was set', function(){
				var tab;
				AssortmentTab.current.set(VALID_ASSORTMENT_ID).then(function(){
					tab = AssortmentTab.current.get();
				});
				rootScope.$apply();
				expect(tab.id).toBe(VALID_ASSORTMENT_ID);
			});

			it('should be able to add Styles to display', function(){
				var sampleStyle = [Factory.build('productStyle-local'), Factory.build('productStyle-local')];
				var assortment;
				AssortmentTab.current.addDisplayStyles(VALID_ASSORTMENT_ID, sampleStyle).then(function(currentTab){
                    assortment = currentTab;
				});
				rootScope.$apply();

				expect(assortment.links["product-styles"]).toContain(sampleStyle);
			});
			it('should be able to set product quantities', function () {
				var quantity = 10;
        var product = [Factory.build('product', {id: '10840', quantity: '0'}), Factory.build('product-style-image', {connection:'SomeConnection', media: 'video,image'})];
        var assortment;

				AssortmentTab.current.addQuantities(VALID_ASSORTMENT_ID, product, quantity).then(function(updatedAssortment){
					assortment = updatedAssortment;
				});

				rootScope.$apply();


				expect(assortment.links["products"][0].quantity).toBe(quantity);

			});


		});


	});
});

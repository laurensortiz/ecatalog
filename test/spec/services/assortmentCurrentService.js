'use strict';

describe('Service: AssortmentCurrentService', function () {
	// instantiate service
	var AssortmentCurrentService, httpBackend, q, rootScope, mockAssortmentCurrent,mockDeferred, mockOfflineManager;
	var VALID_ASSORTMENT_ID = '123';
	var VALID_PRODUCT_ID = '10840';
	var VALID_PRODUCTSTYLE_ID = "10480";
	var sampleProductStylelocal = [Factory.build('productStyle-local', {id: VALID_PRODUCTSTYLE_ID}), Factory.build('productStyle-local')];

	var sampleProducts = [Factory.build('product', {id: VALID_PRODUCT_ID}), Factory.build('product')];
	var sampleAssortment = [Factory.build('assortment-tab', {id: VALID_ASSORTMENT_ID, description: 'Assortment name', createdBy: '10060', lastUpdatedTime: '2013-09-12T00:37:36.378Z', group: 'assortmentGroup', links: {
		"product-styles": "",
		products: {
			id: "123!10230-000040",
			type: "AssortmentProduct",
			productId: "10230-000040",
			description: "M GILBERT CROCKETT PRO (Herringbone Twill) Tobacco 8",
			unitPrice: 70.000,
			quantity: 0,
			upc: "885928585897",
			sku: "VN-0VNRAYP-080-M",
			links: {
				self: "https://sb-ecatalog.conductiv.com/capi/rest/v2/VANSSB/assortments/27870/products/10230-000040"
			}
		}
	}}), Factory.build('assortment-tab', {id: '456', description: 'Assortment name 2', createdBy: '10060', lastUpdatedTime: '', group: 'assortmentGroup', links: {
		"product-styles": "",
		products: ""
	}})];

	// load the service's module
	beforeEach(module('conductivEcatalogApp', 'select.mocks', function ($provide) {
		$provide.value('OfflineManager', mockOfflineManager);
		$provide.value('AssortmentCurrent', mockAssortmentCurrent);
	}));

	beforeEach(inject(function (_AssortmentCurrentService_, _$httpBackend_, _$q_, _$rootScope_, _mockOfflineManager_,_mockAssortmentCurrentModel_) {
		AssortmentCurrentService = _AssortmentCurrentService_;
		httpBackend = _$httpBackend_;
		q = _$q_;
		rootScope = _$rootScope_;
		mockOfflineManager = _mockOfflineManager_;
		mockAssortmentCurrent = _mockAssortmentCurrentModel_;

		mockOfflineManager.testObjects = sampleAssortment;
		mockAssortmentCurrent.mockAssortmentProduct = sampleProducts;

	}));

	it('should be defined and true', function () {
		expect(!!AssortmentCurrentService).toBe(true);
	});

	describe('when managing Assortment in memory and local storage', function () {

		it('should set the current Assortment in memory scope', function (){
			var currentAssortment;
			AssortmentCurrentService.findById(VALID_ASSORTMENT_ID).then(function(assortment){
				currentAssortment = assortment;
			});

			rootScope.$apply();
			expect(currentAssortment).toBeDefined();
		});
	});

	describe('when associating a product to assortment', function () {


		it('should find product by Id', function () {
			var product;
			AssortmentCurrentService.findProductById(VALID_PRODUCT_ID).then(function (found) {
				product = found;
			});
			rootScope.$apply();
			expect(product).toBeDefined();
		});

	});

	describe('when an assortment has a product associated', function () {
		var product = {};

		beforeEach(function () {

			AssortmentCurrentService.findProductById(VALID_PRODUCT_ID).then(function (found) {
				product = found;

			});
			rootScope.$apply();

		});

		it('should be able to set product quantities', function () {
			var quantity = 10;

			AssortmentCurrentService.setProductQuantity(product, quantity).then(function(updated){
				product = updated;
			});

			expect(product.quantity).toBe(quantity);

		});

		it('should be able to persist product quantities', function () {
			var quantity = 10;

			AssortmentCurrentService.setProductQuantity(product, quantity).then(function(updated){
				product = updated;
			});

			expect(product.quantity).toBe(quantity);

		});
	});



	describe('when associating a product style to an assortment', function () {

		it('should be present', function(){


		});

		it('should be able to remove a product style', function(){

		});

		it('should be able to remove all product styles', function(){

		});


	});
});

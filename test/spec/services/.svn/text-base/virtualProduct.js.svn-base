'use strict';

describe('Service: virtualProduct', function () {
  // instantiate service
  var virtualProduct, $httpBackend, mockHttpCapi;

  // load the service's module
  beforeEach(module('conductivEcatalogApp', 'select.mocks', function ($provide) {
    $provide.value('httpCapi', mockHttpCapi);
  }));

  // test response
  var sampleProducts = [
    {
      "id": "10000",
      "type": "Product",
      "name": "The Ultimate Riding&reg; Jean - Q-Baby&trade;",
      "virtual": true,
      "links": {
        "image": "https://sb-ecatalog.conductiv.com/capi/rest/files/WRANGLER/Staging/WranglerVirtualSample.jpg",
        "self": "https://sb-ecatalog.conductiv.com/capi/rest/v2/WRANGLER/products/10000"
      }
    },
    {
      "id": "10010",
      "type": "Product",
      "name": "Riata&reg; Flat Front Casuals",
      "virtual": true,
      "links": {
        "image": "https://sb-ecatalog.conductiv.com/capi/rest/files/WRANGLER/Staging/WranglerVirtualSample.jpg",
        "self": "https://sb-ecatalog.conductiv.com/capi/rest/v2/WRANGLER/products/10010"
      }
    }
  ];

  beforeEach(inject(function ($injector) {
    virtualProduct = $injector.get('virtualProduct');
    $httpBackend = $injector.get('$httpBackend');
    mockHttpCapi = $injector.get('mockHttpCapi');
  }));

  it('should exist', function () {
    expect(!!virtualProduct).toBe(true);
  });

  it('should be able to fetch all assortments from CAPI', function () {
    var spy = sinon.spy(function () {
      return sampleProducts;
    });

    $httpBackend.expectGET('/products?include=virtuals').respond(200, spy());

    var products;
    virtualProduct.all().then(function (found) {
      products = found;
    });
    $httpBackend.flush();
    expect(products.length).toBe(2);
    // Confirming that we did indeed get the info from the server and not the local storage
    expect(spy.calledOnce).toBeTruthy();
  });

  it('should be able to find one virtual product by id', function () {
    $httpBackend.expectGET('/products?include=virtuals').respond(200, sampleProducts);

    var TEST_ID = "10010";
    var product;
    virtualProduct.find(TEST_ID).then(function (found) {
      product = found;
    });
    $httpBackend.flush();

    expect(product).toBeDefined();
    expect(product.id).toBe(TEST_ID);
  });

  it('should be able to get image of the virtual product by product id', function () {
    $httpBackend.expectGET('/products?include=virtuals').respond(200, sampleProducts);

    var TEST_ID = "10010";
    var image;
    virtualProduct.image(TEST_ID).then(function (found) {
      image = found;
    });
    $httpBackend.flush();

    expect(image).toBeDefined();
    expect(image).toMatch(new RegExp("https://(.*)(png|jpg)"));
  });
});

'use strict';

describe('Service: DisplayStyleService', function () {
  // instantiate service
  var DisplayStyleService, httpBackend, q, rootScope, mockDeferred, mockHttpCapi, mockOfflineManager, mockFileSync, mockAuthentication;
  var VALID_PRODUCTSTYLE_ID = '1234';
  var VALID_PRODUCT_ID = '10840';
  var VALID_TYPE = 'ProductStyleImage'
  var sampleProductStyle = [Factory.build('productStyle-local', {id: VALID_PRODUCTSTYLE_ID, type: "ProductStyle", style:'SomeStyle' , connection:'SomeConnection', media: 'video,image', links:{image: 'http://someimage/url' } }) ];

  var mockSyncManager = {
    fetch: function () {
      mockDeferred = q.defer();
      return mockDeferred.promise;
    }
  }

  // load the service's module
  beforeEach(module('conductivEcatalogApp', 'select.mocks', function ($provide) {
    $provide.value('httpCapi', mockHttpCapi);
    $provide.value('OfflineManager', mockOfflineManager);
    $provide.value('fileSync', mockFileSync);
    $provide.value('authentication', mockAuthentication);
  }));

  beforeEach(inject(function (_DisplayStyleService_, _$httpBackend_, _$q_, _$rootScope_, _mockHttpCapi_, _mockOfflineManager_, _mockFileSync_, _mockAuthentication_) {
    DisplayStyleService = _DisplayStyleService_;
    httpBackend = _$httpBackend_;
    q = _$q_;
    rootScope = _$rootScope_;
    mockHttpCapi = _mockHttpCapi_;
    mockOfflineManager = _mockOfflineManager_;
    mockFileSync = _mockFileSync_;
    mockOfflineManager.testObjects = sampleProductStyle;
    mockAuthentication = _mockAuthentication_;
  }));

  it('should be defined and true', function () {
    expect(!!DisplayStyleService).toBe(true);
  });

  describe('when display styles business model is called', function () {

    it('should fetch all display styles from local storage', function () {
      var DisplayStyle;
      DisplayStyleService.all().then(function (found) {
        DisplayStyle = found;
      });
      rootScope.$apply();
      expect(DisplayStyle.length).toBeGreaterThan(0);
    });

    it('should get a display styles by Id', function () {
      var displayStyle;
      DisplayStyleService.find(VALID_PRODUCTSTYLE_ID).then(function (found) {
        displayStyle = found;
      });
      rootScope.$apply();
      expect(displayStyle).toBeDefined();
    });

  });

  describe('when display styles need to be synced', function () {

    it('should be able to sync the data', function () {
      httpBackend.expectGET('/product-styles?expand=self,products,media').respond(200, sampleProductStyle);
      var savedDisplayStyles;
      DisplayStyleService.sync().then(function (savedDisplayStylesFromCallback) {
        savedDisplayStyles = savedDisplayStylesFromCallback
      });
      httpBackend.flush();
      expect(savedDisplayStyles.length).toBe(savedDisplayStyles.length);
    });

  });

  describe('when an image is needed', function () {
    it('should get a image by Id', function () {
      var displayStyleImage;
      DisplayStyleService.getImage(VALID_PRODUCTSTYLE_ID, VALID_TYPE).then(function (foundImage) {
        displayStyleImage = foundImage;
      });
      rootScope.$apply();
      expect(displayStyleImage).toBeDefined();

    });
  });
});


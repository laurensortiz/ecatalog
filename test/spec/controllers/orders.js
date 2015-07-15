'use strict';

describe('Controller: order', function () {

  // load the controller's module
  beforeEach(module('conductivEcatalogApp'));

  var order,
      scope,
      $httpBackend,
      controller,
      sendEmail = false,
      orders = {id: '123', description: 'New Order'};

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    $httpBackend.when('GET', '/Orders').respond(orders);
    scope = $rootScope.$new();
    controller = $controller;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should open the send email dialog', function () {
    sendEmail = true;
  });

  it('should close the send email dialog', function () {
    sendEmail = false;
  });

});

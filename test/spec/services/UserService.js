'use strict';

describe('Service: User', function () {
    // instantiate service

    var UserService, httpBackend, q, rootScope, mockDeferred, mockOfflineManager,mockHelperService, mockHttpCapi;
    var VALID_USER_ID  = 123;
    var VALID_PASSWORD = 'conductiv13';
    var ORGANIZATION   = 'VANSSB';
    var VALID_USERNAME = '10060';

    var sampleUser = [Factory.build('users', {id: 123, username:'10060', password: 'conductiv13', organization:'VANSSB',
        customers : [
            'walter-white', 'jesse-pinkman', 'saul-goodman', 'gustavo-fring'
        ]
    }), Factory.build('users')];

    var mockSyncManager = {
        fetch: function () {
            mockDeferred = q.defer();
            return mockDeferred.promise;
        }
    }

    // load the service's module
    beforeEach(module('conductivEcatalogApp', 'select.mocks', function ($provide) {
        $provide.value('SyncManager', mockSyncManager);
        $provide.value('OfflineManager', mockOfflineManager);
        $provide.value('httpCapi', mockHttpCapi);
        $provide.value('Helper', mockHelperService);
    }));

    beforeEach(inject(function (_UserService_, _$httpBackend_, _$q_, _$rootScope_, _mockOfflineManager_, _mockUserService_, _mockHttpCapi_) {

        UserService = _UserService_;
        httpBackend = _$httpBackend_;
        mockHttpCapi = _mockHttpCapi_;

        q = _$q_;
        rootScope = _$rootScope_;
        mockOfflineManager = _mockOfflineManager_;
        mockOfflineManager.testObjects = sampleUser;
    }));

    describe('when login', function(){
        it('Auth success', function(){
            expect(VALID_PASSWORD).toEqual(sampleUser[0].password);
            expect(VALID_USERNAME).toEqual(sampleUser[0].username);
            expect(ORGANIZATION).toEqual(sampleUser[0].organization);
        });
        it('Auth error', function(){
            expect().not.toEqual(sampleUser[0].password);
            expect().not.toEqual(sampleUser[0].username);
            expect().not.toEqual(sampleUser[0].organization);
        });
        it('should be defined and true', function () {
            expect(!!UserService).toBe(true);
        });
        describe('when online', function(){
            it('should get a user from capi', function(){
                httpBackend.expectGET('/users').respond(200, sampleUser);
            });
            it('should get customer list', function(){
                httpBackend.expectGET('/users').respond(200, sampleUser[0].customers);
            });
        });
        describe('when offline', function(){
            it('should get a users from webkit', function(){
                var user;
                UserService.all(VALID_USER_ID).then(function (found) {
                    user = found;
                });

            });
        });
    });
});

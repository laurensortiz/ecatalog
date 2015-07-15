'use strict';

describe('Model: User', function() {
    // instantiate service
    var User, q, rootScope;

    var mockDeferred;
    var mockUserService = {
        get : function (id) {
            mockDeferred = q.defer();
            return mockDeferred.promise;
        }
    }

    beforeEach(module('conductivEcatalogApp.models', function ($provide) {
        $provide.value('UserService', mockUserService);
    }));

    beforeEach(inject(function (_User_, _$q_, _$rootScope_) {
        User = _User_;
        q = _$q_;
        rootScope = _$rootScope_;
    }));


});
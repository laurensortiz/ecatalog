(function () {
    'use strict';

    angular.module('HttpConnectionStatusInterceptor', ['http-auth-interceptor-buffer-connection-status'])

        .factory('connectionStatusService', ['$rootScope', 'httpBufferConnectionStatus', function ($rootScope, httpBuffer) {
            return {
                connectionConfirmed: function () {
                    httpBuffer.retryAll();
                }
            };
        }])

        .config(['$httpProvider', function ($httpProvider) {

            var interceptor = ['$rootScope', '$q', 'httpBufferConnectionStatus', function ($rootScope, $q, httpBuffer) {
                function success(response) {
                    if (!$rootScope.queueRequest) {
                        $rootScope.$broadcast('event:connection-confirmed');
                    } else {
                        $rootScope.queueRequest = false;
                        $rootScope.$broadcast('event:queue-connection-confirmed');
                    }
                    return response;
                }

                function error(response) {
                    if (response.status === 0) {
                        var deferred = $q.defer();
                        httpBuffer.append(response.config, deferred);
                        if (!$rootScope.queueRequest) {
                            $rootScope.$broadcast('event:connection-lost');
                        } else {
                            $rootScope.queueRequest = false;
                            $rootScope.$broadcast('event:queue-connection-lost');
                        }
                        return deferred.promise;
                    }
                    // otherwise, default behaviour
                    return $q.reject(response);
                }

                return function (promise) {
                    return promise.then(success, error);
                };

            }];
            $httpProvider.responseInterceptors.push(interceptor);
        }]);

    /**
     * Private module, an utility, required internally by 'http-auth-interceptor'.
     */
    angular.module('http-auth-interceptor-buffer-connection-status', [])

        .factory('httpBufferConnectionStatus', ['$injector', function ($injector) {
            /** Holds all the requests, so they can be re-requested in future. */
            var buffer = [];

            /** Service initialized later because of circular dependency problem. */
            var $http;

            function retryHttpRequest(config, deferred) {
                function successCallback(response) {
                    deferred.resolve(response);
                }

                function errorCallback(response) {
                    deferred.reject(response);
                }

                $http = $http || $injector.get('$http');
                $http(config).then(successCallback, errorCallback);
            }

            return {
                /**
                 * Appends HTTP request configuration object with deferred response attached to buffer.
                 */
                append: function (config, deferred) {
                    buffer.push({
                        config: config,
                        deferred: deferred
                    });
                },

                /**
                 * Retries all the buffered requests clears the buffer.
                 */
                retryAll: function () {
                    for (var i = 0; i < buffer.length; ++i) {
                        retryHttpRequest(buffer[i].config, buffer[i].deferred);
                    }
                    buffer = [];
                }
            };
        }]);
})();


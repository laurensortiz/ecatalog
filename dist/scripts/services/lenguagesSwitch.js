/**
 * Created with JetBrains WebStorm.
 * User: abdelatencio
 * Date: 15/07/13
 * Time: 17:01
 * To change this template use File | Settings | File Templates.
 */
'use strict';

angular.module('conductivEcatalogApp')
    .factory('lenguagesSwitch', ['$http', '$q', function ($http, $q) {
        return{
            //this function load the correct jason usin the country code.
            getLanguages: function (lang) {
                var deferred = $q.defer();
                $http.get('scripts/i18n/lang_' + lang + '.json').success(function (data) {
                    deferred.resolve(data);
                }).error(function () {
                        deferred.reject();
                    });
                return deferred.promise;
            },
            //this call the geocoder json file, to get the country code
            getCountryCode: function (lat, lng) {
                var deferred = $q.defer();
                $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=true').success(function (data) {
                    deferred.resolve(data);
                }).error(function () {
                        deferred.reject();
                    });
                return deferred.promise;
            }
        };
    }]);
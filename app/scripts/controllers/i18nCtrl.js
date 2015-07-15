/**
 * Created with JetBrains WebStorm.
 * User: abdelatencio
 * Date: 15/07/13
 * Time: 17:06
 * To change this template use File | Settings | File Templates.
 */
'use strict';

angular.module('conductivEcatalogApp').controller('i18nCtrl',
    ['$scope', 'lenguagesSwitch', function ($scope, lenguagesSwitch) {

        //set english as default language
        $scope.countryCode = "US";//use ISO 3166-1-alpha-2 code
        //call the service function and send the contry code as a parameter
        //to load the correct json.
        lenguagesSwitch.getLanguages($scope.countryCode).then(function (data) {
            //fill the $scope object the json data(languages)
            $scope.languagesJSON = data[$scope.countryCode];
        });
        var getUserLang = navigator.language || navigator.userLanguage
            , userLang = getUserLang.trim().toUpperCase();
        if (userLang) {
            if (userLang.length > 2) {
                $scope.countryCode = userLang.substr(userLang.length - 2);
                lenguagesSwitch.getLanguages($scope.countryCode).then(function (data) {
                    //fill the $scope object the json data(languages)
                    $scope.languagesJSON = data[$scope.countryCode];
                });
            } else {
                $scope.countryCode = userLang;
                lenguagesSwitch.getLanguages($scope.countryCode).then(function (data) {
                    //fill the $scope object the json data(languages)
                    $scope.languagesJSON = data[$scope.countryCode];
                });
            }
        }
        //model dropdown languages menu.
        $scope.pageLanguages = [
            {lang: "Español", shortCode: "ES"},
            {lang: "English", shortCode: "US"}//,
            //{lang:"Italiano", shortCode:"IT"},
            //{lang:"Deutsch",  shortCode:"DE"},
            //{lang:"French",   shortCode:"FR"}
        ];

        //this function change the language reciving a parameter from dropdown languages menu.
        //ng-click(language)
        $scope.showCheck = false;
        $scope.changeLang = function (language) {
            //evaluate what is the parameter value
            $scope.showCheck = true;
            $scope.countryCode = language.shortCode;
            lenguagesSwitch.getLanguages($scope.countryCode).then(function (data) {
                $scope.languagesJSON = data[$scope.countryCode];
            });
        }
    }
    ]);
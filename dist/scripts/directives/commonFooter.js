'use strict';

angular.module('conductivEcatalogApp').directive('commonFooter', function ($rootScope, $routeParams, authentication, lenguagesSwitch, Environment, $route, $timeout) {
    return {
        restrict: 'E',
        scope: {
            isEditing: "@",
            show: "@",
            assort: "=",
            languageschg: "=",
            int: "=",
            langme: "&"
        },
        templateUrl: 'views/template/footer/commonFooter.html',
        transclude: true,
        replace: true,
        link: function (scope, element, attrs) {
            var isCatalogLoaded = function () {
                return !($routeParams.catalogId === undefined || $routeParams.catalogId === null);
            }

            scope.isIOS = function () {
                return Environment.isIOS;
            }

            scope.isFooterVisible = function () {
                return !isCatalogLoaded();
            }

            scope.isUserLoggedIn = function () {
                return authentication.isLoggedIn();
            }

            scope.currentUser = function () {
                if(sessionStorage.getItem('username')){
                    return sessionStorage.getItem('username');
                }else{
                    if(localStorage.getItem("auth")){
                        var auth = localStorage.getItem("auth");
                        return auth["username"];
                    }else{
                        return false;
                    }
                }

            }

            scope.inAssortmentScope = function () {
                var notBlue = true;
                if ($route.current.$$route.templateName !== 'Assortment') {
                    notBlue = null;
                }
                return !(notBlue === null || notBlue === undefined);
            }

            scope.assortment = function () {
                if( $rootScope.currentAssortment){
                    scope.group = $rootScope.currentAssortment.group;
                }
            }

            scope.logout = function () {
                $rootScope.logout();
            }

            scope.showUrlNav = function () {
                //EditWebViewUrl();
            }

            scope.settings = function () {
                //ShowOptionsMenu();
            }

            scope.refresh = function () {
                //RefreshWebView();
            }
        }
    };
});

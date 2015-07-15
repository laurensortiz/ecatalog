'use strict';

angular.module('conductivEcatalogApp')
    .directive('switchButton', function ($timeout) {
        return {
            scope: {
                switchbutton: '=switchButton'
            },
            link: function postLink(scope, element, attrs) {

                $timeout(function () {
                    if (scope.switchbutton) {
                        $(element).attr('checked', 'checked');
                    }

                    $(element).switchbutton({
                        classes: 'ui-switchbutton-ios5 right-align'
                    }).change(function () {
                            scope.switchbutton = !scope.switchbutton;
                            scope.$apply();
                        });
                });
            }
        };
    });

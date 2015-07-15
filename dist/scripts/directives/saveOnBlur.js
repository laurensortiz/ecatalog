'use strict';

angular.module('conductivEcatalogApp')
    .directive('saveOnBlur', function () {
        return function (scope, element, attrs) {
            element.bind('blur', function (e) {
                scope.obj.note = e.target.value;
                scope.saveText();
            });
        }
    });

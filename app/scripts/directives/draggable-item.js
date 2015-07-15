'use strict';

angular.module('conductivEcatalogApp')
    .directive('draggableItem', function () {
        return {
            link: function postLink(scope, element, attrs) {
                $(element).draggable(scope.$eval(attrs.draggableOptions) || {});
            }
        }
    });

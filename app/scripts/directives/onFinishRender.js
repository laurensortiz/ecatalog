'use strict';

angular.module('conductivEcatalogApp')
    .directive('onFinishRender', function ($timeout, whiteboardLayout, $routeParams) {
        return function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    var current = whiteboardLayout.get($routeParams.assortmentId);
                    angular.forEach(current, function (ci, key) {
                        if ($('img[data-id="' + key + '"]', '.procItems').length == 0) {
                            delete current[key];
                            $('img[data-id="' + key + '"]', '.dropItem').parent().remove();
                        }
                    });

                    whiteboardLayout.save($routeParams.assortmentId, current);
                });
            }
        }
    });
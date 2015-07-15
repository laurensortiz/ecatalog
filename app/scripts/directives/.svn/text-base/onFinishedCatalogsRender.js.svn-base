'use strict';
//author acole
angular.module('conductivEcatalogApp')
    .directive('onFinishedCatalogsRender', function ($timeout) {
        return function (scope, element, attrs) {
            if (scope.$last) {
                $timeout(
                    function () {
                        var catalogContainerLength = 0;
                        $('.catalog-button').each(function (index, element) {
                            catalogContainerLength += ($(element).width() + 20);
                        });
                        $(".catalog-container").width(catalogContainerLength);
                    }, 100);

            }
        };
    })

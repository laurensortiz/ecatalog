'use strict';

angular.module('conductivEcatalogApp')
    .directive('longTapToShowAssortmentOptions', function ($timeout) {
        return {
            scope: {
                assortment: '=longTapToShowAssortmentOptions'
            },

            link: function postLink(scope, element, attrs) {
                $timeout(function () {

                    Hammer($(element)[0]).on("tap", function (event) {
                        scope.$emit('defaultSelection', $(element), scope.assortment.id);
                    });

                    Hammer($(element)[0]).on("hold", function (event) {
                        scope.$emit('showPopUpOnLongHold', $(element), scope.assortment);
                    });


                });
            }
        };
    });

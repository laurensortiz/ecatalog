'use strict';

angular.module('conductivEcatalogApp').directive('clickable', function (assortmentAndProductStyleId) {
    return {
        scope: {
            clickable: "="
        },
        link: function postLink(scope, element, attrs) {
            var HAS_TOUCH = ('ontouchstart' in window);
            var xor = element,
                MULTI_CLICK_DELAY = 250;
            xor[0].addEventListener(HAS_TOUCH ? 'touchend' : 'mouseup', doubleTap(MULTI_CLICK_DELAY), false);

            var xorClick = xorTap(
                function (e) {
                    // single click action here
                    //scope.$emit('addProductStyleToAssortment', scope.clickable);
                    scope.$emit('handleTapOnProductWidget', scope.clickable);
                },
                function (e) {
                    // double click action here
                    //alert('double click');
                    scope.$emit('handleDoubleTapOnProductWidget', scope.clickable);

                },
                function (e) {
                    // triple click action here
                },
                MULTI_CLICK_DELAY);
            xor[0].addEventListener('tap', xorClick, false);
        }
    };
});

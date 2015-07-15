'use strict';

angular.module('conductivEcatalogApp').directive('catalogNativationAction', function () {
    return {
        restrict: 'A',
        link: function postLink($scope, element, attrs) {

            $(element).click(function (event) {
                var zeroBasedIndex = attrs.pageNumber - 1;
                $scope.$emit('pageRequest', zeroBasedIndex);
            });

        }
    };
});

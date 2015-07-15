'use strict';

angular.module('conductivEcatalogApp').directive('jqUiSlider', function () {
    return {
        templateUrl: 'views/template/slides/bxSlider.html',
        restrict: 'E',
        scope: {
            "pages": "=",
            "currentPageIndex": "=",
            "currentlyPreviewedPageIndex": "="
        },
        link: function ($scope, element, attrs) {

            var sliderElement = $(element).slider({
                min: 0,
                step: 1,
                max: $scope.pages.length - 1,
                value: $scope.currentPageIndex,
                animate: "fast",
                start: function (event, ui) {
                    $('#thumbnailContainer').show("fade", "slow");

                    var pageValue = 0;
                    if (!isNaN(ui.value)) {
                        pageValue = ui.value;
                    }
                    positionThumbnail(pageValue);
                    $scope.currentlyPreviewedPageIndex = pageValue;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }

                },
                change: function (event, ui) {
                    var pageValue = 0
                    if (!isNaN(ui.value)) {
                        pageValue = ui.value;
                    }
                    positionThumbnail(pageValue);
                    $scope.currentlyPreviewedPageIndex = pageValue;
                },
                slide: function (event, ui) {
                    var pageValue = 0
                    if (!isNaN(ui.value)) {
                        pageValue = ui.value;
                    }
                    positionThumbnail(pageValue);
                    $scope.currentlyPreviewedPageIndex = pageValue;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                },
                stop: function (event, ui) {
                    $('#thumbnailContainer').hide("fade", "fast");
                    var pageValue = 0
                    if (!isNaN(ui.value)) {
                        pageValue = ui.value;
                    }
                    positionThumbnail(pageValue);
                    $scope.currentlyPreviewedPageIndex = pageValue;
                    $scope.currentPageIndex = pageValue;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
            });
            $scope.$watch('currentPageIndex', function (value) {
                var pageValue = 0;
                if (value > 0) {
                    pageValue = value;
                }
                if ($(sliderElement).slider('value') != pageValue) {
                    $(sliderElement).slider('value', pageValue);
                }

            }, true);

            $scope.$watch('pages', function (value) {
                var maxValue = 0;
                if (value.length > 0) {
                    maxValue = value.length;
                }
                $(sliderElement).slider('option', 'max', maxValue - 1);
            }, true);


            var positionThumbnail = function (val) {
                var leftPositionPercentage = (1 / ($scope.$parent.pages.length)) * val;
                var pixelsLeft = $(element).width() * leftPositionPercentage;
                var startPosition = $(element).position().left - 21;
                var centeredOnSliderPreview = pixelsLeft + startPosition;
                $('#thumbnailContainer').css({
                    'left': centeredOnSliderPreview
                });
            }
        }
    }

});

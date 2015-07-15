'use strict';

angular.module('conductivEcatalogApp').directive('bxSlider', function ($timeout) {
    return {
        templateUrl: 'views/template/slides/bxSlider.html',
        restrict: 'E',
        scope: {
            "getItems": "&",
            "currentPageIndex": "=",
            "itemsPerSlide": "=",
            "reloadOnChangeOf": "=",
            "reloadOnModelChanges": "="
        },
        transclude: true,
        link: function postLink($scope, element, attrs) {
            $scope.slides = [];
            $scope.bxSlider = null;
            $scope.busy = false;

            if (typeof $scope.reloadOnModelChanges === 'undefined') {
                $scope.reloadOnModelChanges = true;
            }

            $scope.currentAssortment = $scope.$parent.currentAssortment;

            $scope.currentSlideIndex = 0;

            var shouldLoad = function (index) {
                if (index == $scope.currentPageIndex) {
                    return true;
                } else if (index >= $scope.currentPageIndex - ($scope.itemsPerSlide + 1) && index < $scope.currentPageIndex) {
                    return true;
                } else if (index <= $scope.currentPageIndex + ($scope.itemsPerSlide + 1) && index > $scope.currentPageIndex) {
                    return true;
                } else {
                    return false;
                }
            }

            $scope.$watch("reloadOnChangeOf", function (value) {
                buildSlides();

            }, $scope.reloadOnModelChanges);

            var prefetchNextSetOfPages = _.debounce(function () {
                var queueSize = 5;

                var currentItems = $scope.getItems();

                var currentlyOutstandingPrefetches = _.filter(currentItems, function (item) {
                    return !item.prefetched && !item.attemptPrefetch;
                });

                var nonPrefetchedTemplates = _.filter(currentItems, function (item) {
                    return !item.prefetched || !item.attemptPrefetch;
                });
                var roomLeftInQueue = queueSize - currentlyOutstandingPrefetches.length;

                var afterCurrentIndex = _.rest(nonPrefetchedTemplates, $scope.currentPageIndex + 5);
                var toPrefetchQueue = _.first(afterCurrentIndex, queueSize);
                if (toPrefetchQueue.length < queueSize) {
                    var beforeCurrentIndex = _.initial(nonPrefetchedTemplates, $scope.currentPageIndex - 4);
                    toPrefetchQueue.concat(_.first(beforeCurrentIndex, queueSize));

                }
                if (toPrefetchQueue.length > 0) {
                    _.each(toPrefetchQueue, function (item) {
                        item.attemptPrefetch = true;
                    });
                    $timeout(function () {
                        $scope.$apply()
                    });
                } else {
                }

            }, 200);

            $scope.$on('prefetchedTemplate', function (event) {
                prefetchNextSetOfPages();
            });

            var buildSlides = _.debounce(function () {
                if ($scope.getItems().length > 0) {
                    $scope.isBuildingSlides = true;

                    /*var itemsPerSlide = $scope.itemsPerSlide || 1;
                     if (itemsPerSlide == 1) {
                     $scope.initialItem = $scope.getItems()[$scope.currentPageIndex];
                     } else {
                     if ($scope.currentPageIndex % 2) {
                     if ($scope.currentPageIndex == ($scope.getItems().length - 1)) {
                     $scope.initialSlide = $scope.getItems()[$scope.currentPageIndex];
                     } else {
                     $scope.initialItem = $scope.getItems()[$scope.currentPageIndex];
                     $scope.nextItem = $scope.getItems()[$scope.currentPageIndex + 1];
                     }
                     } else {
                     if ($scope.currentPageIndex == 0) {
                     $scope.initialItem = $scope.getItems()[$scope.currentPageIndex];
                     } else {
                     $scope.nextItem = $scope.getItems()[$scope.currentPageIndex];
                     $scope.initialItem = $scope.getItems()[$scope.currentPageIndex - 1];
                     }

                     }
                     }*/
                    $timeout(function () {
                        $scope.$apply()
                    });

                    $scope.slides = _.chain($scope.getItems()).groupBy(function (element, index) {
                        var itemsPerSlide = $scope.itemsPerSlide || 1;
                        return Math.ceil(index / itemsPerSlide);
                    }).toArray().value();

                    var initialLoadingPages = []
                    _.each($scope.getItems(), function (currentItem, index) {
                        if (shouldLoad(index)) {
                            currentItem.loadTemplate = true;
                            initialLoadingPages.push(currentItem);
                        } else {
                            currentItem.loadTemplate = false;
                        }
                    });
                    $scope.$on('finishedLoading', function (event, item) {
                        initialLoadingPages = _.without(initialLoadingPages, item);
                        if (initialLoadingPages.length == 0 && $scope.isBuildingSlides) {
                            $(element).find(".slide-loading-screen").addClass("fade");
                            $scope.initialItem = null;
                            $scope.nextItem = null;
                            adjustSize();
                            setTimeout(function () {
                                if ($scope.isBuildingSlides) {

                                    $scope.isBuildingSlides = false;
                                    $('.bx-controls').css('visibility', 'visible');
                                    $timeout(function () {
                                        $scope.$apply()
                                    });
                                    $(element).find(".slide-loading-screen").removeClass("fade");
                                }

                            }, 1500);

                        }
                    });

                    setTimeout(function () {
                        if ($scope.isBuildingSlides) {

                            $(element).find(".slide-loading-screen").addClass("fade");
                            $scope.initialItem = null;
                            $scope.nextItem = null;
                            adjustSize();
                            setTimeout(function () {
                                if ($scope.isBuildingSlides) {
                                    $scope.isBuildingSlides = false;
                                    $('.bx-controls').css('visibility', 'visible');
                                    $timeout(function () {
                                        $scope.$apply()
                                    });
                                    $(element).find(".slide-loading-screen").removeClass("fade");

                                }

                            }, 1500);
                        }

                    }, 5000);

                    //initial prefetch
                    prefetchNextSetOfPages();
                    $timeout(function () {
                        $scope.$apply()
                    });
                }
            }, 30);

            var existingHeight = $(element).innerHeight();
            var existingWidth = $(element).innerWidth();
            var adjustSize = _.debounce(function () {
                $(element).find(".bx-viewport").height($(element).innerHeight()).width($(element).innerWidth());
                $(element).find(".bx-viewport > ul > li").height($(element).innerHeight()).width($(element).innerWidth());

                existingHeight = $(element).innerHeight();
                existingWidth = $(element).innerWidth();
                if (!window.hasOwnProperty('orientation')) {
                    var bxSliderViewportWidth = $('.bx-viewport').width();
                    var adjustSizeByValue = -1 * bxSliderViewportWidth * ($scope.currentSlideIndex);
                    $('.bx-viewport>ul').css('-webkit-transform', 'translate3d(' + adjustSizeByValue + 'px, 0, 0)');
                }
            }, 100);

            $(window).resize(adjustSize);
            setInterval(function () {
                var currentHeight = $(element).innerHeight();
                var currentWidth = $(element).innerWidth();
                if (existingHeight != currentHeight || currentWidth != existingWidth) {
                    adjustSize();
                }
            }, 500);

            $scope.$watch('itemsPerSlide', function (value) {
                buildSlides();
            }, true);

            var isPageInSlide = function (pageIndexValue, slideIndexValue) {
                return slideIndexValue == Math.ceil(pageIndexValue / $scope.itemsPerSlide);
            };

            var mapSlideIndexToPageIndex = function (slideIndexValue) {
                return slideIndexValue * $scope.itemsPerSlide
            };

            var mapPageIndexToSlideIndex = function (pageIndexValue) {
                return Math.ceil(pageIndexValue / $scope.itemsPerSlide);
            };

            $scope.$watch('currentSlideIndex', function (value) {
                if (!isPageInSlide($scope.currentPageIndex, value)) {
                    $scope.currentPageIndex = mapSlideIndexToPageIndex(value);

                }
            });

            $scope.$on('pageRequest', function (event, pageNumber) {
                $scope.currentPageIndex = parseInt(pageNumber);
                throttledGoToSlide();
                $timeout(function () {
                    $scope.$apply()
                });
            });

            var throttledLazyLoad = _.debounce(function () {
                var currentItems = $scope.getItems();
                _.each(currentItems, function (currentItem, index) {
                    if (shouldLoad(index)) {
                        currentItem.loadTemplate = true;
                    } else {
                        currentItem.loadTemplate = false;
                    }
                });
            }, 50, true);

            $scope.$watch('currentPageIndex', function (value) {
                if (!isPageInSlide(value, $scope.currentSlideIndex)) {
                    $scope.currentSlideIndex = mapPageIndexToSlideIndex(value);

                }
                throttledLazyLoad();
            });

            var throttledGoToSlide = _.debounce(function () {
                $scope.bxSlider.goToSlide($scope.currentSlideIndex);
                $scope.busy = false;
            }, 300);

            $scope.$watch('currentSlideIndex', function (value) {
                if ($scope.bxSlider) {
                    if ($scope.bxSlider.getCurrentSlide() != value) {
                        $scope.busy = true;
                        throttledGoToSlide();
                    }

                }

            });

            var checkOffset = function () {
                var expectedOffset = ($scope.currentSlideIndex * $('.bx-viewport').width()) * -1;
                var matrixValue = $(element).find(".bx-viewport").children("ul").css('-webkit-transform')
                var cssOffsetValue = matrixValue.split(',')[4];
                if (cssOffsetValue != expectedOffset) {
                    $(element).find(".bx-viewport").children("ul").css('-webkit-transform', 'matrix(1, 0, 0, 1,' + expectedOffset + ', 0)');
                }
            }
            var onSlideAfter = function (slideElement, oldIndex, newIndex) {
                if ($scope.currentSlideIndex != newIndex && !$scope.busy) {
                    $scope.currentSlideIndex = newIndex;
                    setTimeout(checkOffset, 50);
                    $timeout(function () {
                        $scope.$apply()
                    });
                }
            }

            $scope.$watch('slides', function (slides) {
                if ($scope.slides.length > 1 && $scope.bxSlider == null) {
                    $scope.bxSlider = $(element).children("ul").bxSlider({
                        touchEnabled: true,
                        maxSlides: 1,
                        speed: 300,
                        easing: 'ease-in',
                        pager: false,
                        infiniteLoop: false,
                        controls: true,
                        hideControlOnEnd: true,
                        preventDefaultSwipeY: true,
                        preventDefaultSwipeX: true,
                        onSliderLoad: adjustSize,
                        onSlideAfter: onSlideAfter
                    });
                } else if ($scope.bxSlider) {
                    var slideStart = mapPageIndexToSlideIndex($scope.currentPageIndex);
                    $timeout(function () {
                        $scope.bxSlider.reloadSlider({
                            touchEnabled: true,
                            maxSlides: 1,
                            speed: 300,
                            easing: 'ease-in',
                            pager: false,
                            infiniteLoop: false,
                            controls: true,
                            hideControlOnEnd: true,
                            preventDefaultSwipeY: true,
                            preventDefaultSwipeX: true,
                            onSliderLoad: function () {
                                if (slideStart > $scope.slides.length - 1) {
                                    slideStart = 0;
                                }

                                var offset = (slideStart * $('.bx-viewport').width()) * -1;
                                $(element).find(".bx-viewport").children("ul").css('-webkit-transform', 'matrix(1, 0, 0, 1,' + offset + ', 0)');

                                $scope.currentSlideIndex = slideStart;
                                adjustSize();
                            },
                            onSlideAfter: onSlideAfter
                        });
                    });
                }
            });
        }
    };
});

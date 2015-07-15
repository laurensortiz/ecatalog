'use strict';

angular.module('conductivEcatalogApp').directive('page', function (httpCapi) {
    return {
        restrict: 'E',
        scope: {
            pagedata: '='
        },
        link: function postLink($scope, element, attrs) {
            var setUpPage = function () {
                $scope.pagedata.prefetched = false;
                $scope.pagedata.attemptPrefetch = false;
                $scope.isLoading = true;

                $scope.$watch('pagedata.loadTemplate', function (value) {
                    if (value) {
                        $scope.isLoading = true;

                        var deferredLoad;
                        if ($scope.pagedata.loadPageDetails !== undefined && !$scope.pagedata.dataLoaded) {
                            deferredLoad = $scope.pagedata.loadPageDetails();
                        } else {
                            deferredLoad = (new $.Deferred()).resolve();
                        }

                        deferredLoad.then(function () {
                            $scope.currentTemplate = $scope.pagedata.links.redirectedTemplate;
                        })
                    } else {
                        $scope.currentTemplate = null;
                        //thumbnail template goes here
                        $scope.isLoading = false;
                    }
                });

                $scope.$watch('pagedata.attemptPrefetch', function (value) {

                    if (value) {

                        var deferredLoad;
                        if (!$scope.pagedata.dataLoaded) {
                            deferredLoad = $scope.pagedata.loadPageDetails();
                        } else {
                            deferredLoad = (new $.Deferred()).resolve();
                        }

                        deferredLoad.then(function () {
                            //prefetch thumbnail
                            var imgTag = $("<img style='display: none'/>").attr("src", $scope.pagedata.thumbnail);
                            $("body").append(imgTag);
                            imgTag.ready(function () {
                                $scope.pagedata.prefetched = true;
                                imgTag.remove();
                                $scope.$emit('prefetchedTemplate');
                            });
                        })
                    }
                });

            };

            if (!$scope.pagedata) {
                $scope.isLoading = true;
                $scope.$watch('pagedata', function () {

                    if ($scope.pagedata) {
                        setUpPage();
                    }
                });

            } else {
                setUpPage();
            }

            var loadStylesConditionally = function (styleBlock) {
                var styleBlockId = $(styleBlock).attr("data-styleId");

                var styleExists = false;
                var pagesWithScripts = $("page[loaded-style-scripts]");

                var pageWithScript = _.find(pagesWithScripts, function (pageElement) {
                    return $(pageElement).attr("loaded-style-scripts") == styleBlockId;

                })
                if (!pageWithScript) {
                    var styleContent = $(styleBlock).html();
                    var parentPage = $(element).append(styleContent);
                    if (!$(element).attr("loaded-style-scripts")) {
                        $(element).attr("loaded-style-scripts", styleBlockId);
                    } else {
                        $(element).attr("loaded-style-scripts", $(element).attr("loaded-style-scripts") + "," + styleBlockId);
                    }

                }

            };

            $scope.$on("$includeContentLoaded", function (event, scope) {
                if ($scope.isLoading) {
                    $scope.isLoading = false;
                    $scope.$emit('finishedLoading', $scope.pagedata);
                }
            });

            $scope.loadPageStyle = function () {
                var styleBlock = $(element).children(".page-container").children("script[type='conditional/css']");
                if (styleBlock.length > 0) {
                    loadStylesConditionally(styleBlock[0]);
                }

            };
        },
        template: '<ng-include class="page-container" src="currentTemplate" onload="loadPageStyle()"></ng-include><div ng-show="isLoading" class="page-placeholder-graphic"></div>'
    };
});

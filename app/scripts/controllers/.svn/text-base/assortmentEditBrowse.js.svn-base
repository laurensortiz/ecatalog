'use strict';

angular.module('conductivEcatalogApp').controller('AssortmentEditBrowseCtrl', function ($scope, assortment, $window, catalog, $routeParams, $rootScope, $http, $timeout, httpCapi) {

    $scope.assortmentLinesheetLink = "#/assortment/edit/" + $routeParams.assortmentId + "/linesheet";
    $scope.$root.headerOptions.showToggle = true;
    $scope.pages = [];
    $scope.currentlyDisplayedPageIndex = 0;
    $scope.currentlyDisplayedPageNumber = 1;
    $scope.currentlyPreviewedPageIndex = 0;
    $scope.pagesPerSlide = 2;
    $scope.sliderIsInFocus = true;
    $scope.getPages = function () {
        return $scope.pages;
    }

    catalog.getMasterCatalog($routeParams.catalogId).then(function (data) {
        $scope.parentCatalog = data;
        $scope.parentCatalog.catalogClassName = $scope.parentCatalog.name.replace(/ /g, "-");
        httpCapi.getFileResource($scope.parentCatalog.links.stylesheet).done(function (localStyleSheet) {
            if ($("head").find('[href="' + localStyleSheet + '"]').length == 0) {
                $("head").append("<link rel='stylesheet' href=" + localStyleSheet + " type='text/css'>");
            }
        });
    });

    catalog.getMasterCatalogPagesDetails($routeParams.catalogId).done(function (data) {
        $scope.pages = data;
        _.each($scope.pages, function (page) {
            _.each(page.widgets, function (widget) {
                if (widget.links) {
                    httpCapi.getFileResource(widget.links.image).then(function (resolvedURL) {
                        widget.links.image = resolvedURL;
                    });
                }
            });
        });

        setTimeout(function () {
            $scope.sliderIsInFocus = false
        }, 800);
        //after post processing
        $timeout(function () {
            $scope.$apply()
        });
    });

    $scope.setBackground = function (image) {
        return {
            'background-image': 'url(' + image + ')'
        }
    }
    $scope.orientation = false;

    var throttlePageIndexSet = _.debounce(function () {
        $scope.currentlyDisplayedPageIndex = $scope.currentlyDisplayedPageNumber - 1;
    }, 30, true);

    $scope.$watch('currentlyDisplayedPageNumber', function (value) {
        if ($scope.currentlyDisplayedPageIndex != (value - 1) && value <= $scope.pages.length && !isNaN(value) && value >= 1) {
            throttlePageIndexSet();
        }
    });

    $scope.$watch('currentlyDisplayedPageIndex', function (value) {
        if ($scope.currentlyDisplayedPageNumber != (value + 1)) {
            $scope.currentlyDisplayedPageNumber = value + 1;
        }
    });

    var fetchThumbnail = _.debounce(function () {
        if ($scope.parentCatalog) {
            var page = $scope.pages[$scope.currentlyPreviewedPageIndex];
            $scope.thumbnail = page.thumbnail;
            $timeout(function () {
                $scope.$apply()
            });
        }
    }, 5);

    $scope.$watch('currentlyPreviewedPageIndex', function (value) {
        fetchThumbnail();

    });

    $scope.manuallyChangeSlide = function () {
        if (!isNaN(goToValue) && goToValue <= $scope.pages.length && goToValue > 0) {
            if ($scope.startByOnePageIndex != goToValue) {
                $scope.startByOnePageIndex = goToValue;
                $timeout(function () {
                    $scope.$apply()
                });
            }
        }
    };

    $scope.popupNavigateToSlide = function (page) {
        $scope.pagePreviewModalShouldBeOpen = false;
        $scope.currentlyDisplayedPageIndex = $scope.pages.indexOf(page);
        $timeout(function () {
            $scope.$apply()
        });
    };

    $scope.openPagePreviewModal = function () {
        $scope.pagePreviewModalShouldBeOpen = true;
    };

    $scope.closePagePreviewModal = function () {
        $scope.pagePreviewModalShouldBeOpen = false;
    }
    var updateOrientation = function () {
        if (window.orientation == 0 || window.orientation == 180) {
            $scope.pagesPerSlide = 1;
        } else {
            $scope.pagesPerSlide = 2;
        }
        $timeout(function () {
            $scope.$apply()
        });
    }

    $(window).bind('orientationchange', function () {
        updateOrientation();
    });
    updateOrientation();

    $scope.hasAnnotation = false;

    $scope.initProductDetailPopup = function (productStyleId) {
        var data = $rootScope.getProductStyle(productStyleId)
        $scope.obj = data;
        $scope.imagePath = data.links.image;
        var ps = $rootScope.getProductStyle(productStyleId);
        if (ps.availableOnCurrentAssortment) {
            catalog.getAssortmentProductStyle($rootScope.currentAssortment.id, productStyleId).then(function (response) {
                $scope.obj.note = response.data.note;
                $scope.hasAnnotation = true;  //show annotation only if the current Product Style belongs to current assortment
                if ($scope.obj.note.length > 0) {
                    $scope.showAnnotation();
                } else {
                    $scope.hideAnnotation();
                }
            }, function (data) {
            });
        } else {
            $scope.hasAnnotation = false;
        }
        $timeout(function () {
            $scope.$apply()
        });
    };

    /**
     * Will same the text in annotation box to CAPI
     */
    $scope.saveText = function () {
        if ($scope.obj.note.length > 0) {
            catalog.saveAnnotation($scope.currentAssortment.id, $scope.obj.id, $scope.obj.note);
            $scope.showAnnotation();
        } else if ($scope.obj.note.length == 0) {
            catalog.saveAnnotation($scope.currentAssortment.id, $scope.obj.id, $scope.obj.note);
            $scope.hideAnnotation();
        } else {
            $scope.hideAnnotation();  //if no text in box then hide the box and show annotation icon
        }
        $timeout(function () {
            $scope.$apply()
        });

    }
    $scope.close = function () {
        $scope.closeMsg = 'I was closed at: ' + new Date();
        $scope.shouldBeOpen = false;
    };
    $scope.opts = {
        backdropFade: true,
        dialogFade: true,
        dialogClass: "modal page-thumbnail-preview"
    };

    $scope.closeProductDetailPopup = function () {
        $scope.closeMsg = 'I was closed at: ' + new Date();
        $scope.productDetailPopupShouldBeOpen = false;
    };
    $scope.productDetailPopupOpts = {
        backdropFade: false,
        dialogFade: false,
        backdropClick: false,
        dialogClass: "modal product-details-popup drop-shadow"
    };

    $scope.openProductDetailPopup = function () {
        $scope.productDetailPopupShouldBeOpen = true;
    };

    $scope.$on('openProductDetailsPopup', function (event, result) {
        $scope.shouldBeOpen = true;
        $scope.initProductDetailPopup($scope.assortmentId, result.styleId);
    })

    /**
     * shows the annotation box, hides the annotation icon
     */
    $scope.showAnnotation = function () {
        $('.annotation-btn').hide();
        $('.annotation-box').show();
        var annotationText = $("#annotation-box").val();
        $("#annotation-box").focus().val("").val(annotationText);
    }

    /**
     * hides the annotation box, shows the annotation icon
     */
    $scope.hideAnnotation = function () {
        $('.annotation-btn').show();
        $('.annotation-box').hide();
    }

    $scope.$on('addProductStyleToAssortment', function (event, result) {
        //$scope.addProductStyleToAssortment(result);
    });

    $scope.addProductStyleToAssortment = function (result) {

        var productStyleIndex = $scope.findProductStyleIndexById(result.styleId);

        if (productStyleIndex == -1) {

            $scope.currentAssortment.addProductStyle($scope.productStyles[productStyleIndex]);
            $scope.showProuctStyleCheckmark[result.styleId] = true;
        } else {
            $scope.currentAssortment.removeProductStyle($scope.productStyles[productStyleIndex]);
            $scope.showProuctStyleCheckmark[result.styleId] = false;
        }
    }

    $scope.deleteProductStyleInAssortment = function (result) {

        catalog.deleteProductStyleInAssortment(result.styleId, $scope.assortmentId).then(function (result) {
            result.assortmentId = null;
        }, function (result) {
        });

    }

    $scope.$on('handleTapOnProductWidget', function (event, result) {
        //$scope.shouldBeOpen = true;
        var productStyle = $rootScope.getProductStyle(result.styleId);
        // toggleProductStyleAvailability expects a ProductStyle object
        $scope.currentAssortment.toggleProductStyleAvailability(productStyle);

    })

    $scope.$on('handleDoubleTapOnProductWidget', function (event, result) {
        //$scope.shouldBeOpen = true;
        $scope.shouldBeOpen = true;
        var productStyle = $rootScope.getProductStyle(result.styleId);
        $scope.initProductDetailPopup(productStyle.id);
        $scope.openProductDetailPopup();

    })

    $scope.goToPage = function (pageNumber) {
        $scope.currentlyDisplayedPageIndex = pageNumber;
        $scope.closePagePreviewModal();
    }

    $('.annotation-box').click(function () {
        $(this).focus();
    });
});

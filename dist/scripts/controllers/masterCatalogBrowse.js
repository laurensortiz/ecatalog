'use strict';

angular.module('conductivEcatalogApp').controller('MasterCatalogBrowseCtrl', function ($rootScope, $scope, $window, catalog, $routeParams, $timeout, $http, httpCapi, productStyles, authentication) {
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
    catalog.getMasterCatalogs().then(function (masterCatalogs) {
      $scope.parentCatalog = data;
      $scope.parentCatalog.catalogClassName = _.findWhere(masterCatalogs, {id: $routeParams.catalogId}).name.replace(/ /g, "_");

      httpCapi.getFileResource($scope.parentCatalog.links.stylesheet).done(function (resolvedPath) {

        if ($("head").find('[href="' + resolvedPath + '"]').length == 0) {
          $("head").append("<link rel='stylesheet' href=" + resolvedPath + " type='text/css'>");
        }
      });

      productStyles.getAllProductStyles().then(function (allProductStyles) {
        _.each(allProductStyles, function (productStyle) {
          productStyle.keyFeatures = _.groupBy(productStyle.features, function (feature) {
            return feature.type;
          });
        });
        $rootScope.productStyles = allProductStyles;
      });
    });
  });

  catalog.getMasterCatalogPagesDetails($routeParams.catalogId).done(function (data) {
    $scope.pages = data;
    //after post processing
    setTimeout(function () {
      $scope.sliderIsInFocus = false
    }, 800);
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

  var fetchThumbnail = function () {
    if ($scope.parentCatalog) {
      var page = $scope.pages[$scope.currentlyPreviewedPageIndex];

      $scope.thumbnail = page.thumbnail;
      $timeout(function () {
        if (!$scope.$$phase) {
          $scope.$digest();
        }
      });
    }
  };

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
      if (!$scope.$$phase) {
        $scope.$digest();
      }
    });
  };

  $scope.openPagePreviewModal = function () {
    $scope.pagePreviewModalShouldBeOpen = true;
  };
  $scope.closePagePreviewModal = function () {
    $scope.pagePreviewModalShouldBeOpen = false;
  }
  var updateOrientation = function (isHorizontal) {
    if (!isHorizontal) {
      $scope.pagesPerSlide = 1;
    } else {
      $scope.pagesPerSlide = 2;
    }

    $timeout(function () {
      if (!$scope.$$phase) {
        $scope.$digest();
      }
    });
  }

  $(window).bind('orientationchange', function () {
    if (window.orientation == 0 || window.orientation == 180) {
      updateOrientation(false)
    } else {
      updateOrientation(true)
    }

  });

  /*var calculateOrientation = _.throttle(function(evt) {
   var eventInfo = JSON.strinfigy(evt);
   alert(eventInfo);
   if (evt.gamma > 70 && evt.gamma < 170) {
   updateOrientation(true);

   } else {
   updateOrientation(false);
   }
   }, 4000);

   $(window).bind('deviceorientation', function(evt) {
   calculateOrientation(evt);
   });*/

  if (window.orientation == 0 || window.orientation == 180) {
    updateOrientation(false)
  } else {
    updateOrientation(true)
  }

  /**----------Popup Code -----------------------**/

  $scope.productDetailsTemplate = httpCapi.generateFilesUrl() + '/' + authentication.getTenant() + '/Templates/productDetails.html';

  $scope.initProductDetailPopup = function (productStyleId) {
    $scope.productStyle = $rootScope.getProductStyle(productStyleId);

    httpCapi.getFileResource($scope.productStyle.links.image).done(function (resolvedPath) {
      $scope.productStyleImage = resolvedPath;
    });

    $timeout(function () {
      $scope.$apply()
    });
  };

  //The popup does not have the annotation box in Catalog Browse mode
  $scope.hasAnnotation = false;

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

  $scope.$on('openProductDetailsPopup', function (event, result) {
    //$scope.shouldBeOpen = true;
    $scope.initProductDetailPopup(result.styleId);
    $scope.open();

  })

  $scope.openProductDetailPopup = function () {
    $scope.productDetailPopupShouldBeOpen = true;
  };

  $scope.$on('handleTapOnProductWidget', function (event, result) {

    $scope.initProductDetailPopup(result.styleId);
    $scope.openProductDetailPopup();

  })

  $scope.$on('handleDoubleTapOnProductWidget', function (event, result) {

  })

  $scope.goToPage = function (pageNumber) {
    $scope.currentlyDisplayedPageIndex = pageNumber;
    $scope.closePagePreviewModal();
  }
});


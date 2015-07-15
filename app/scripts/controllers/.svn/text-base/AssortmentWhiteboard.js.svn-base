'use strict';

angular.module('conductivEcatalogApp').controller('AssortmentEditWhiteboardCtrl', function ($scope, $location, $window, $http, $routeParams, $timeout, assortment, $rootScope, productStyles, whiteboardLayout) {
    $scope.assortmentId = $routeParams.assortmentId;
    $scope.rightPanelItems = whiteboardLayout.get($scope.assortmentId);

    assortment.getAssortment($scope.assortmentId).then(function (data) {
        $scope.assortment = data;
    }, function (error) {
        $scope.errorMessage = "assortment not found";
    });

    $scope.viewportHt = $window.innerHeight - 40;
    //parseInt($('body').css('padding-top')) - parseInt($('body').css('padding-bottom'));
    $('#wb-left-column, #wb-right-column').height($scope.viewportHt);

    angular.element($window).bind('resize', function () {
        $scope.viewportHt = $window.innerHeight - 40;
        //parseInt($('body').css('padding-top')) - parseInt($('body').css('padding-bottom'));
        $scope.$apply($scope.viewportHt);
    });
    $scope.$watch('viewportHt', function (newVal, oldVal) {
        $('#wb-left-column, #wb-right-column').height($scope.viewportHt);
    });
    $('body').on('click', '.closeUpdate', function (e) {
        e.preventDefault();
        $('div.updateEnabled').removeClass('updateEnabled');
        $('#wb-editor').hide();
    });
    $scope.updateValue = "";
    $scope.singleModel = 0;

    $scope.getStylesOnCanvas = function () {
        var foundStyles = [];

        angular.forEach($scope.rightPanelItems, function (positions, styleId) {
            angular.forEach(positions, function (position) {
                foundStyles.push({
                    styleId: styleId,
                    position: position
                });
            });
        });

        return foundStyles;
    }

    $scope.getStyle = function (styleId) {
        return $rootScope.getProductStyle(styleId);
    }


    $scope.stylesOnCanvas = []

    $scope.$watch('rightPanelItems', function (storedLayout) {
        if ($rootScope.productStyles) {
            $scope.stylesOnCanvas = $scope.getStylesOnCanvas();
        }
    });

    $rootScope.$watch('productStyles', function (styles) {
        if ($scope.rightPanelItems) {
            $scope.stylesOnCanvas = $scope.getStylesOnCanvas();
        }
    });

//  $scope.data = [];
//  $timeout(function () {
//    $scope.data = $rootScope.productStyles;
//    $scope.storage = [];
//    angular.forEach($scope.rightPanelItems, function (value, key) {
//      var tmp = _.findWhere($scope.data, {id: key});
//      $scope.storage.push(tmp);
//    });
//  }, 1000);
    $scope.filterdata = [];


    $scope.$watch('cat', function (val1, val2) {
        //if
        $scope.filterdata.push({
            "cat": "catalog",
            "items": val1
        });
    }, true);

    $scope.open = function () {
        $scope.shouldBeOpen = true;
        $scope.updateValue = "0";
    };
    $scope.close = function () {
        $('.updateEnabled').text($scope.updateValue);
        $('input.updateEnabled[type="text"]').val($scope.updateValue);
        $('div.updateEnabled').removeClass('updateEnabled');
        $scope.shouldBeOpen = false;
    };
    $scope.opts = {
        backdropFade: true,
        dialogFade: true,
        dialogClass: 'modal-numpad'
    };
    $scope.updateQty = function (val) {
        $scope.updateValue = $scope.updateValue == "0" ? val : $scope.updateValue + "" + val;
    };
    $scope.clearQty = function () {
        $scope.updateValue = "0";
    };
    $scope.clearOne = function () {
        $scope.updateValue = $scope.updateValue.slice(0, -1) == "" ? "0" : $scope.updateValue.slice(0, -1);
    };
    $scope.getPopoverdata = function () {
        return $('#wb-assortment-filter').html();
    }

    //stephan's modal logic
    $scope.selectedCatalog = null;
    $scope.showCatalogBrowser = false;

    $scope.closeCatalogListModal = function () {
        $scope.showCatalogList = false;
    }
    $scope.openCatalogListModal = function () {
        $scope.showCatalogList = true;
    };

    $scope.$on('catalogSelected', function (event, catalog) {
        $scope.showCatalogList = false;
        $scope.selectedCatalog = catalog;
        $location.path('/assortment/edit/' + $routeParams.assortmentId + '/catalog/master/' + $scope.selectedCatalog.id + "/browse");
    });

    $scope.clearCanvas = function () {
        //Clear styles on the canvas
        $scope.rightPanelItems = [];
        $scope.storage = [];
        $('#wb-right-column .wb-item-panel').empty();
        $('#wb-editor').hide();

        //Clear layout persistence.
        whiteboardLayout.remove($scope.assortmentId);
    }

    $scope.displayComfirmationPopup = false;


    $scope.showComfirmationPopup = function (options) {
        //==> maybe $scope.displayComfirmationPopup = !$scope.displayComfirmationPopup

        if (options === true) {
            $scope.displayComfirmationPopup = true;
        } else {
            $scope.displayComfirmationPopup = false;
        }
    };

    $scope.removeAllProductStylesFromAssortment = function () {
        $scope.clearCanvas();
        //Remove all styles from the assortment
        $rootScope.currentAssortment.removeAllProductStyles();
        $scope.showComfirmationPopup(false);
    }

    /*Top navbar icons */
    $scope.$root.navElements = [
        {
            "text": "Browse Catalogs",
            "icon": "book-icon",
            "action": $scope.openCatalogListModal,
            "type": "iconNavLink"
        },
        {
            "text": "Search",
            "icon": "search-icon",
            "type": "iconNavLink",
            "action": $scope.$root.openSearchingDialog
        },
        {
            "text": "Save & Exit",
            "link": "#/assortment/list",
            "type": "textNavLink"
        }
    ];
});

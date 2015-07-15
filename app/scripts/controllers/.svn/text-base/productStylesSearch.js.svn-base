'use strict';

angular.module('conductivEcatalogApp')
    .controller('ProductStylesSearchCtrl', function ($scope, $rootScope, catalog, assortment, $window, productStyles, $q, $timeout) {
        $scope.currentPageIndex = 0;
        $scope.itemsPerSlide = 1;
        $scope.filteredProducts = []
        var both = [];
        $scope.toggleFilter = function (filter) {
            filter = !filter;
        }

        $scope.catalogs = [];
        //$scope.countNewAddedStyles = null;
        $scope.addedNewStylesApplied = function () {

            if (_.isNumber($scope.countNewAddedStyles)) {
                if ($scope.countNewAddedStyles > -1) {
                    return true;
                } else {
                    $scope.searchFiltersInEffect.term = "";
                    $scope.searchFiltersInEffect.catalogs.selection = [];
                    $scope.searchFiltersInEffect.colors.selection = [];
                    //delete $scope.countNewAddedStyles;
                    return false;
                }
            } else {

                return false;
            }
        }

        $scope.isFilterApplied = function () {
            if ($scope.searchFiltersInEffect === null || $scope.searchFiltersInEffect === undefined) {
                return false;
            } else {
                if ($scope.searchFiltersInEffect.catalogs.selection.length > 0 || $scope.searchFiltersInEffect.colors.selection.length > 0 || $scope.searchFiltersInEffect.term.trim().length > 0) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        $scope.searchFilters = {
            catalogs: {
                list: [],
                multiple: true,
                selection: []
            },
            colors: {
                list: [],
                multiple: true,
                selection: []
            },
            styleCode: {
                list: [],
                multiple: true,
                selection: []
            },
            term: ''
        }

        $scope.addAllFoundToAssortment = function () {
            $scope.countNewAddedStyles = true;
            if ($scope.isFilterApplied()) {
                var alreadyOnAssorment = _.where($scope.filteredProducts, {availableOnCurrentAssortment: true});
                //productStyles.bulkAssociateWithAssortment($scope.filteredProducts, $rootScope.currentAssortment.id);
                angular.forEach($scope.filteredProducts, function (style) {
                    $rootScope.currentAssortment.addProductStyle(style, false);
                });
                $scope.countNewAddedStyles = $scope.filteredProducts.length - alreadyOnAssorment.length;
                clearTimeout($scope.hideCountNewAddedStylesTimeout);
                $scope.hideCountNewAddedStylesTimeout = setTimeout(function () {
                    $scope.countNewAddedStyles = false;
                    $scope.hideCountNewAddedStylesTimeout = null;
                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }
                }, 5000);
            }
        }

        $scope.searchFiltersInEffect = angular.copy($scope.searchFilters);
        if ($scope.searchFilters.catalogs.list.length === 0) {
            //Fetch all catalogs for the filter along with the product styles associated with them.
            var deferred = $q.defer();

            catalog.getMasterCatalogs().then(function (catalogs) {
                angular.forEach(catalogs, function (infoCatalog, index) {
                    catalog.fetchAllInCatalog(infoCatalog.id).then(function (productStyles) {
                        productStyles.productStyleIds = _.pluck(productStyles, 'id');
                        $scope.productStyles = productStyles.productStyleIds;
                        if (index === catalogs.length - 1) {
                            deferred.resolve(catalogs);
                        }
                    });
                });
            });

            deferred.promise.then(function (catalog) {
                $scope.searchFilters.catalogs.list = catalog;

            });

        }

        if ($scope.searchFilters.colors.list.length === 0) {

            //Fetch all catalogs for the filter along with the product styles associated with them.


            productStyles.getAllProductStyles().then(function (productObj) {
                var list1 = [];
                var list2 = [];

                _.each(productObj, function (objConecctions) {
                    _.each(objConecctions.connections, function (objFeatures) {
                        _.each(objFeatures, function (getFeat) {
                            _.each(getFeat.features, function (feat) {
                                if (feat.type === 'COLOR') {
                                    list1.push(feat.value);
                                    list2.push(objConecctions.id);
                                    both = _.object(list1, list2);
                                    var sortByName = _.uniq(_.keys(both));
                                    $scope.searchFilters.colors.list = sortByName.sort();
                                }
                            })
                        });
                    });
                });
            });


        }
        $scope.applyFilters = function () {

            $scope.searchFiltersInEffect = angular.copy($scope.searchFilters);
            $scope.filteredProducts = $scope.getFilteredProducts();
            $('#product-filters input').blur();

        }

        $scope.getFilteredProducts = function () {
            return $scope.filterProducts($rootScope.productStyles, $scope.searchFiltersInEffect);
        }

        $scope.filterProducts = function (productStyles, filters) {


            var filteredProductStyles = [];
            var catalogIds = filters.catalogs.selection;
            var productStyleIdsInSelectedCatalogs = {};

            if (catalogIds.length > 0) {
                var selectedCatalogs = _.filter(filters.catalogs.list, function (catalogs) {
                    return _.contains(catalogIds, catalogs.id);
                });

                angular.forEach(selectedCatalogs, function (catalogs) {
                    angular.forEach($scope.productStyles, function (styleId) {

                        productStyleIdsInSelectedCatalogs[styleId] = true;
                    })
                });
            }
            var colorIds = [];
            colorIds = filters.colors.selection;
            if (colorIds.length > 0) {
                var selectedIds = [];
                for (var i = 0; i < colorIds.length; i++) {
                    selectedIds.push(_.values(_.pick(both, colorIds[i])));
                }
                var selectedColorObj = [];
                _.each(productStyles, function (selectedObj) {
                    _.each(_.flatten(selectedIds), function (selected) {
                        if (selectedObj.id === selected) {
                            selectedColorObj.push(selectedObj);
                        }
                    });
                });
                return filteredProductStyles = _.uniq(selectedColorObj);
            }

            var searchTerm = filters.term.trim().toLowerCase();

            angular.forEach(productStyles, function (productStyle) {
                var productos = productStyle.styleCode;
                var candidate = true;
                var colorFeature = {};
                _.each(productos, function (style) {

                    var searchTermCode = filters.term.trim().toUpperCase();
                    if (productStyle.styleCode === searchTermCode) {
                        filteredProductStyles.push(productStyle);
                    }

                    colorFeature = _.find(style.features, function (feature) {
                        return feature.type === 'COLOR';
                    });

                    if (catalogIds.length > 0) {
                        if (productStyleIdsInSelectedCatalogs[productStyle.id] === undefined) {
                            candidate = false;
                        }
                    }

                    if (candidate && searchTerm.length > 0) {
                        if ((productStyle.name + ' ' + productStyle.code).toLowerCase().indexOf(searchTerm) === -1) {
                            candidate = false;
                        }
                    }

                });
                if (candidate) {
                    if (colorIds.length > 0 && colorFeature && colorIds.indexOf(colorFeature.id) === -1) {
                        candidate = false;
                    }
                }

                if (candidate) {
                    filteredProductStyles.push(productStyle);
                }
            });

            return filteredProductStyles = _.uniq(filteredProductStyles);
        }

        $scope.modalBodyHt = $('.modal').height() - 39 > 0 ? $('.modal').height() - 39 : 565;
        angular.element($window).bind('resize', function () {
            $scope.modalBodyHt = $('.modal').height() - 39;
            $scope.$apply($scope.modalBodyHt);
        });
        $scope.$watch('modalBodyHt', function (newVal, oldVal) {
            //alert(newVal);
            $('.filter-container').animate({'height': newVal + 'px'}, 200);
        });
    });

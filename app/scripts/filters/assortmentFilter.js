'use strict';

angular.module('conductivEcatalogApp')
    .filter('assortmentFilter', function () {
        return function (productStyles, filters) {
            var filteredProductStyles = [];

            var catalogIds = filters.catalogs.selection;

            var colorIds = filters.colors.selection;

            var searchTerm = filters.term.trim().toLowerCase();

            angular.forEach(productStyles, function (productStyle) {
                var candidate = true;

                var colorFeature = _.find(productStyle.features, function (feature) {
                    return feature.type === 'COLOR';
                });

                if (catalogIds.length > 0 && catalogIds.indexOf(productStyle.catalogId) === -1) {
                    candidate = false;
                }

                if (candidate) {
                    if (colorIds.length > 0 && colorFeature && colorIds.indexOf(colorFeature.id) === -1) {
                        candidate = false;
                    }
                }

                if (candidate && searchTerm.length > 0) {
                    if ((productStyle.name + ' ' + productStyle.code + colorFeature.code).toLowerCase().indexOf(searchTerm) === -1) {
                        candidate = false;
                    }
                }

                if (candidate) {
                    filteredProductStyles.push(productStyle);
                }
            });
            return filteredProductStyles;
        };
    });
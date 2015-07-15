'use strict';

angular.module('conductivEcatalogApp').directive('removeonleftswipe', function ($http, $route, $dialog) {
    return function (scope, element, attrs) {
        var el = angular.element(element)[0];

        Hammer(el).on("swipeleft", function () {
            var id = $(el).data('styleidx');
            var index = $(el).index('.procItems ');
            var choice = confirm("Caution: This will permanently delete the product from assortment.")
            if (choice == true) {
                $http({
                    method: "DELETE",
                    url: "/capi/rest/assortments/" + scope.assortmentId + "/product-styles/" + id,
                    headers: httpCapi.generateCommonAPIHeaders()
                }).success(function () {
                        scope.currStyleWidth.splice(index, 1);
                        scope.currStyle.splice(index, 1);
                        scope.data.splice(index, 1);
                    });
            }
        });
    };
});

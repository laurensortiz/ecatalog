'use strict';

angular.module('conductivEcatalogApp')
    .controller('ImageZoomCtrl', function ($scope) {


        $scope.open = function () {
            $scope.shouldBeOpen = true;
        };

        $scope.close = function () {
            $scope.closeMsg = 'I was closed at: ' + new Date();
            $scope.shouldBeOpen = false;
        };

        $scope.opts = {
            backdropFade: true,
            dialogFade: true,
            dialogClass: "modal product-details-popup"
        };

    });

'use strict';

angular.module('conductivEcatalogApp')
    .controller('ProductCtrl', function ($scope, catalog, $routeParams) {


        $scope.init = function (assortmentId, productStyleId) {
            $scope.id = productStyleId;
            $scope.assortmentId = assortmentId;
            catalog.getAssortmentProductStyle(assortmentId, productStyleId).then(function (data) {
                $scope.obj = data;
                $scope.doPostHttpProcessing();
            });

        };


        $scope.saveText = function () {

            if (!$scope.$$phase) {
                $scope.$apply();
            }

            if ($scope.obj.note.length > 0) {
                catalog.saveAnnotation($scope.assortmentId, $scope.id, $scope.obj.note);
            }
            else if ($scope.obj.note.length == 0) {
                catalog.saveAnnotation($scope.assortmentId, $scope.id, $scope.obj.note);
            }
            else {
                $('.annotation-btn').show();
                $('.annotation-box').hide();
            }

        }


        $scope.showAnnotation = function () {
            $('.annotation-btn').hide();
            $('.annotation-box').show();
            $('.annotation-box').focus();
        }

        $scope.doPostHttpProcessing = function () {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }

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

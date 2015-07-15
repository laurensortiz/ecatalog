angular.module('conductivEcatalogApp')
    .controller('CatalogProductWidgetCtrl', function ($scope, $rootScope, httpCapi, productStyles, virtualProduct) {
      $scope.isProductAssociatedWithCurrentAssortment = function (styleId) {
        if ($rootScope.currentAssortment === null || $rootScope.currentAssortment === undefined) {
          return false;
        } else {
          return $rootScope.getProductStyle(styleId).availableOnCurrentAssortment;
        }
      }

      $scope.toggleAvailabilityOnCurrentAssortment = function (styleId) {
        $rootScope.currentAssortment.toggleProductStyleAvailability($rootScope.getProductStyle(styleId));
      }

      $scope.model.keyFeatures = _.groupBy($scope.model.features, function (feature) {
        return feature.type;
      });

      httpCapi.getFileResource($scope.model.links.template).done(function (resolvedPath) {
        $scope.tenantTemplateSrc = resolvedPath;
      });

      $scope.foundProductImage = null;

      var loadImage = function (image) {
        httpCapi.getFileResource(image).done(function (resolvedPath) {
          $scope.foundProductImage = image;//resolvedPath;
        });
      }

      if ($scope.widgetAttributes.isVirtual) {
        virtualProduct.image($scope.model.styleId).then(loadImage);
      } else {
        productStyles.getImage($scope.model.styleId, $scope.widgetAttributes.imageType).then(loadImage);
      }
    });
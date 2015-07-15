'use strict';

angular.module('conductivEcatalogApp')
    .controller('OrderCtrl', function ($scope, order, product, $routeParams, $window, $http, httpCapi, $q, $rootScope, catalog, productStyles) {

      $rootScope.setPageTitle('Order Summary');
      //TODO check if $scope.readOnlyView = true is still needed.
      //$scope.readOnlyView = true;

        productService.find = function (productId) {
            return _.find($scope.order.products, function (product) {
                return product.productId === productId;
            });
        }

        $rootScope.loading = true;
        order.find($routeParams.orderId).then(function (response) {
            //TODO See if catalog.getPromocodes() functionality is ready in the Catalog/User model before we remove or change..
            catalog.getPromocodes().then(function (data) {
                _.each(data, function (code) {
                    if(code.id == $scope.order.promotionId){
                        $scope.order.promotion = code.description;
                    }
                });
            });
            $scope.order = response;

            var justQty = [];
            //TODO refactor $scope.order.myProductStyles to use Product Style Business Model
            if (!$scope.order.productStyles && $scope.order.myProductStyles) {
                $scope.order.productStyles = $scope.order.myProductStyles;
            }

            _.each($scope.order.productStyles, function (eachAssor) {
                // Get the connections data
                _.each(eachAssor.connections, function (connectData) {
                    // Get the qty
                    _.each(connectData, function (qty) {
                        // Evaluate if the assorttment has any value up to 0
                        if (qty.quantity > 0) {
                            // Create an array just with products with qty's
                            justQty.push(eachAssor);
                        }
                    })
                });
            });

            $scope.orderedProductStylesInCurrentAssortment = productStyles.fetchOrderedProductStyles(_.uniq(justQty));
            $rootScope.loading = false;

        });

      order.find($routeParams.orderId).then(function(currentOrder){
          $scope.order = currentOrder;
          product.find = function (productId) {
              return _.find($scope.order.products, function (product) {
                  return product.productId === productId;
              });
          }
          if($scope.order.promotionId){
            //TODO verify catalog.getPromocodes() is in the new catalog/user Model before we refactor
              catalog.getPromocodes().then(function (data) {
                  _.each(data, function (code) {
                      if (code.id === $scope.order.promotionId) {
                          $scope.order.promotion = code.description;
                      }
                  });
              })
          }
          var justQty = [];
          //New order have myProductStyles, old orders have productStyles
          //TODO refactor $scope.order.myProductStyles to new Product Styles
          if (!$scope.order.myProductStyles && $scope.order.productStyles) {
              $scope.order.myProductStyles = $scope.order.productStyles;
          }
          if (!$scope.order.productStyles && $scope.order.myProductStyles) {
              $scope.order.productStyles = $scope.order.myProductStyles;
          }
          _.each($scope.order.productStyles, function (eachAssor) {
              // Get the connections data
              _.each(eachAssor.connections, function (connectData) {
                  // Get the qty
                  _.each(connectData, function (qty) {
                      // Evaluate if the assortment has any value up to 0
                      if (qty.quantity > 0) {
                          // Create an array just with products with qty's
                          justQty.push(eachAssor);
                      }
                  })
              });
          });
          //TODO refactor $scope.orderedProductStylesInCurrentAssortment to new models
          $scope.orderedProductStylesInCurrentAssortment = productStyles.fetchOrderedProductStyles(_.uniq(justQty));
          $rootScope.loading = false;
      });
      //TODO add to $scope.getFeaturesInProductStyle Product Styles before we refactor
      $scope.getFeaturesInProductStyle = function (productStyle) {
        return productStyles.getFeatures(productStyle);
      }
      //TODO add to $scope.getProductsInProductStyle Product Styles before we refactor
      $scope.getProductsInProductStyle = function (productStyle, width) {
        //VANS does not have a filter for width... We might use it to filter the products for other tenants in future.
        return _.sortBy(productStyle.products, function (product) {
          return product.size;
        });
      }
      //TODO remove product.getQuantity = function this is not being used.
      product.getQuantity = function (product) {
//        if (product.quantity !== undefined && product.quantity !== null) {
//          return product.quantity;
//        } else {
//          var found = $scope.findProductById(product.productId);
//          if (found) {
//            product.quantity = found.quantity;
//          } else {
//            product.quantity = 0;
//          }
          return product.quantity;
//       }
      }
      //TODO add $scope.pricePerUnitForProductStyle to Product Styles before we refactor
      $scope.pricePerUnitForProductStyle = function (productStyle) {
        return productStyle.connections.products[0].unitPrice;
      }
      //TODO add $scope.totalQuantityForProductStyle to Product Styles before we refactor
      $scope.totalQuantityForProductStyle = function (productStyle) {
        var sum = 0;
        angular.forEach(productStyle.connections.products, function (product) {
          sum = sum + $scope.getProductQuantity(product);
        });
        return sum;
      }
      //TODO add $scope.totalPriceForProductStyle to Product Styles before we refactor
      $scope.totalPriceForProductStyle = function (productStyle) {
        var sum = 0;
        angular.forEach(productStyle.connections.products, function (product) {
          sum = sum + $scope.getProductQuantity(product) * product.unitPrice;
        });
        return sum;
      }

      product.getQuantity = function (productStyle) {
        var productQty = [];
        _.each(productStyle.connections.products, function (data) {
          productQty.push(data);
        });
        productQty = _.sortBy(productQty, function (product) {
          return parseInt(_.findWhere(product.features, {type: "SIZE"}).sequenceNumber, 10);
        });

        return productQty;
      }

      $scope.resendingOrderEmailDialogShouldBeOpen = false;

      $scope.openResendingOrderEmailDialog = function () {
        $scope.resendingOrderEmailDialogShouldBeOpen = true;

      }

      $scope.closeResendingOrderEmailDialog = function () {
        $scope.resendingOrderEmailDialogShouldBeOpen = false;
      }

      $scope.$root.navElements = [
        {
          "text": "Resend Email",
          "action": $scope.openResendingOrderEmailDialog,
          "icon": "submit-order-icon",
          "type": "iconNavLink"
        }
      ];
      //TODO add $scope.totalPriceForAssortment to assortmentService before we refactor
      $scope.totalPriceForAssortment = function () {
        return $scope.order.estimatedTotalAmount;
      }
    });

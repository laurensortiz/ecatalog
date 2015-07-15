'use strict';

angular.module('conductivEcatalogApp')
    .controller('AssortmentOrderSummaryCtrl', function ($scope, assortment, httpCapi, order, $routeParams, $window, $rootScope, catalog, productStyles, $location, $timeout) {

      $scope.assortmentCurrentId = $routeParams.assortmentId;
			$scope.assortmentGroup = $rootScope.currentAssortment.group;

      $scope.catalogListLink = "#/assortment/edit/" + $scope.assortmentCurrentId + "/catalog/list";
      $scope.expandProductStyleColor = [];
      $scope.expandVirtualProduct = [];
      $scope.showDeleteButton = [];


			$scope.orderHeaderByGroupInfo = $rootScope.orderOrderedByHeader;

			$scope.getPositionInsideGroup = function(){
				var  parentGroupObject = null;
				_.each($scope.orderHeaderByGroupInfo, function(assortmentGroup){
					var group = _.toArray(assortmentGroup);

					$scope.findGroupObject = _.findWhere(group,{assortmentId: $scope.assortmentCurrentId});

						if($scope.findGroupObject){
							parentGroupObject = assortmentGroup;
							$scope.order = $scope.findGroupObject;
							$scope.formFields = $scope.order.formFields;
						}
				});
				return parentGroupObject;
			}

			$scope.positionInsideGroup = $scope.getPositionInsideGroup();

			$scope.isActive = function(assortmetID){
				var active = (assortmetID === $scope.assortmentCurrentId);
				return active ? "tab-active" : "";
			}

			$scope.openAssortmentSummary = _.debounce(function (assortmentId) {
				if(assortmentId !== $scope.assortmentCurrentId){
					$rootScope.loading = true;
					$location.path("/assortment/edit/" + assortmentId + "/ordersummary");
				}
			}, 1000, true);


			$scope.getProductQuantity = function (product) {

        if($scope.positionInsideGroup){
          var found = $scope.findProductById(product.productId);

          if (found) {
              product.quantity = found.quantity;
          } else {
              product.quantity = 0;
          }
          return product.quantity;
        }
      }

			$scope.findProductById = function (productId) {

				var res = false;
			_.each($scope.positionInsideGroup, function (products) {
				_.each(products.products, function (product) {
					if (product.productId == productId) {
						res = product;
					};
				});
			});

				return res;
			}

      $scope.getFeaturesInProductStyle = function (productStyle) {
          return productStyles.getFeatures(productStyle);
      }

      $scope.getProductsInProductStyle = function (productStyle, width) {
        //VANS does not have a filter for width... We might use it to filter the products for other tenants in future.
        return _.sortBy(productStyle.products, function (product) {
            return product.size;
        });
      }

      $scope.totalPriceForAssortment = function () {

          var sum = 0;
          var qty = 0;
          _.each(_.toArray($scope.positionInsideGroup), function (assortmentOrder) {
            _.each(assortmentOrder.myProductStyles, function (allProducts) {
              _.each(allProducts.connections.products, function (product) {
                sum = sum + product.unitPrice * product.quantity;
                qty = qty + product.quantity;
              });
            });
          });

          $scope.order.estimatedTotalUnits = qty;
          $scope.order.estimatedTotalAmount = sum;
          _.each(_.toArray($scope.positionInsideGroup), function (assortmentOrder) {
            if (assortmentOrder.promotion) {
              $scope.order.estimatedTotalAmount = sum - (sum * assortmentOrder.promotion.amount) / 100;
            }

          });

        return $scope.order.estimatedTotalAmount;
      }

      /*
       calculate & set the total price & quantity
       */

      $scope.totalQuantityForProductStyle = function (productStyle) {
        var sum = 0;
        _.each(productStyle.connections.products, function (product) {
            sum = sum + $scope.getProductQuantity(product);
        });
        return sum;
      }


      $scope.totalPriceForProductStyle = function (productStyle) {
        var sum = 0;
        _.each(productStyle.connections.products, function (product) {
            sum = sum + $scope.getProductQuantity(product) * product.unitPrice;
        });
        return sum;
      }


      $scope.resendingOrderEmailDialogShouldBeOpen = false;
      $scope.openResendingOrderEmailDialog = function () {
          $scope.resendingOrderEmailDialogShouldBeOpen = true;
      }

      $scope.closeResendingOrderEmailDialog = function () {
          $scope.resendingOrderEmailDialogShouldBeOpen = false;
      }

      $scope.fetchOrderedProductStylesInCurrentAssortment = function () {

        if ($rootScope.currentAssortment) {

            var validIds = [];
            _.forEach($rootScope.currentAssortment.productStyles(), function (thisProductStyle) {
                _.forEach(thisProductStyle.products, function (qty) {
                    if (qty.quantity > 0) {
                        validIds.push(thisProductStyle.id);
                    }
                });
            });
            var readyOrder = [];
            _.forEach(validIds, function (id) {
                var justQty = _.where($rootScope.currentAssortment.productStyles(), {'id': id});
                readyOrder.push(_.first(justQty));
            });
            return productStyles.fetchOrderedProductStyles(readyOrder);
        }
        else {
            return null;
        }
      }


      $scope.getCurrentAssortment = function () {
        $scope.assortment = $rootScope.currentAssortment;
	      _.each(_.toArray($scope.positionInsideGroup), function (assortmentOrder) {
		      _.each(assortmentOrder.myProductStyles, function (productStyle) {
			      httpCapi.getFileResourceOrder(productStyle.links.image).then(function (resolvedURL) {
				      productStyle.links.image = resolvedURL;
			      });
		      });
	      });

	      var justQty = [];

        if (!$scope.order.productStyles && $scope.order.myProductStyles) {
            $scope.order.productStyles = $scope.order.myProductStyles;

        }

	      _.each(_.toArray($scope.positionInsideGroup), function (assortmentOrder) {
		      // Run all the products of the assortments
		      _.each(assortmentOrder.myProductStyles, function (eachAssor) {
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
	      });

	      $scope.orderedProductStylesInCurrentAssortment = productStyles.fetchOrderedProductStyles(_.uniq(justQty));

	      $rootScope.loading = false;

      }();

        $scope.productStylesVisible = [];

        $scope.togglePsVisibility = function (virtualStyleCode) {
            if ($scope.productStylesVisible[virtualStyleCode]) {
                $scope.productStylesVisible[virtualStyleCode] = false;
            } else {
                $scope.productStylesVisible[virtualStyleCode] = true;
            }
        }

        $timeout(function () {
            _.each($scope.orderedProductStylesInCurrentAssortment, function (pair, key) {
                $scope.togglePsVisibility(pair[0]);
            });
        }, 200);

        $scope.saveMyOrder = function () {
	        _.each($scope.orderHeaderByGroupInfo, function(orders){

		        var totalUnits = 0,
		            totalAmount = 0,
				        myProductStyles = [],
				        products = [],
				        emails = [];

		        $scope.estimatedTotalUnits = function(){
			        _.each(orders, function(units){
				        totalUnits = totalUnits + units.estimatedTotalUnits;
			        });
			        return totalUnits;
		        };


		        $scope.estimatedTotalAmount = function(){
			        _.each(orders, function(units){
				        totalAmount = totalAmount + units.estimatedTotalAmount;
			        });
			        return totalAmount;
		        };

		        _.each(orders, function (order) {

			        _.each(order.myProductStyles, function (productStyle) {
				        //myProductStyles.push({productStyleId: productStyle.id});
				        myProductStyles.push(productStyle);
				        _.each(productStyle.connections.products, function (product) {
					        if (product.quantity > 0) {
						        //products.push({productId: product.id, quantity: product.quantity});
						        products.push(product);
					        }
				        });
			        });
	          });

		        _.each(orders, function (order) {
				        emails.push(order.email);
		        });

		        $scope.allEmails = emails;

		        var myOrder = {};
		        myOrder.customerId = orders[0].customerId;
		        myOrder.customerName = orders[0].customerName;
		        myOrder.shippingAddressId = orders[0].shippingAddressId;
		        myOrder.shipMethodId = orders[0].shipMethodId;
		        myOrder.shipBy = orders[0].shipBy;
		        myOrder.cancelAfter = orders[0].cancelAfter;
		        myOrder.purchaseOrder = orders[0].purchaseOrder;
		        myOrder.remarks = orders[0].remarks;

		        myOrder.estimatedTotalUnits = $scope.estimatedTotalUnits();
		        myOrder.estimatedTotalAmount = $scope.estimatedTotalAmount();


		        myOrder.postalAddress = orders[0].postalAddress;

		        myOrder.myProductStyles = myProductStyles;
		        myOrder.products = products;

		        myOrder.email = emails;


		        if ($scope.order.promotion) {
			        myOrder.promotionId = $scope.order.promotion.id;
		        }

		       $timeout(function(){
			       order.saveOrder(myOrder);
	        },1000);


	        });

	        $scope.openOrderSubmitModal();

	        //Code before Assortment Waves
						/*
            $rootScope.loading = true;
            $scope.order.estimatedTotalUnits = $scope.totalQuantityForAssortment;
            $scope.order.estimatedTotalAmount = $scope.totalPriceForAssortment();

            var myOrder = {};
            myOrder.assortmentId = $rootScope.currentAssortment.id;
            myOrder.customerId = $scope.order.customerId;
            myOrder.customerName = $scope.order.customerName;
            myOrder.shippingAddressId = $scope.order.shippingAddressId;
            myOrder.shipMethodId = $scope.order.shipMethodId;
            myOrder.shipBy = $scope.order.shipBy;
            myOrder.cancelAfter = $scope.order.cancelAfter;
            myOrder.purchaseOrder = $scope.order.purchaseOrder;
            myOrder.remarks = $scope.order.remarks;
            myOrder.estimatedTotalUnits = $scope.order.estimatedTotalUnits;
            myOrder.estimatedTotalAmount = $scope.order.estimatedTotalAmount;
            myOrder.postalAddress = $scope.order.postalAddress;
            myOrder.myProductStyles = $scope.order.myProductStyles;
            myOrder.products = $scope.order.products;
            myOrder.email = $scope.formFields.email.split(",");

            if ($scope.order.promotion) {
                myOrder.promotionId = $scope.order.promotion.id;
            }

            order.saveOrder(myOrder).then(function (response) {
                $scope.openOrderSubmitModal();
            });
	        */
        }

        $scope.cancelOrder = function () {
            $location.path("/assortment/edit/" + $rootScope.currentAssortment.id + "/linesheet");
        }


        $scope.getProductsQty = function (productStyle) {
	        var productQty = [];
	        _.each(productStyle.connections.products, function(data){
		        productQty.push(data);
	        });
          productQty = _.sortBy(productQty,function(product){
            return parseInt(_.findWhere(product.features,{type:"SIZE"}).sequenceNumber,10);
	        });
	        return productQty;
        }

        $scope.sendEmails = function () {
            order.sendEmail($rootScope.currentAssortment.id, "Excel", 'PO #' + $scope.order.purchaseOrder, $scope.formFields.email.split(","))
                .then(function () {
                    $rootScope.loading = false;
                });
            $rootScope.loading = false;
        }

        $scope.showOrderSubmitModal = false;

        $scope.orderSubmitModalOptions = {
            backdropFade: false,
            dialogFade: false,
            backdropClick: false,
            dialogClass: "modal small-modal drop-shadow"
        };

        $scope.closeOrderSubmitModal = function () {
            $scope.showOrderSubmitModal = false;
        };
        $scope.openOrderSubmitModal = function () {
            $scope.showOrderSubmitModal = true;
        };

        $scope.$root.navElements = [
            {
                "text": "Confirm Order",
                "icon": "submit-order-icon",
                "action": $scope.saveMyOrder,
                "type": "iconNavLink"
            }
        ];

			$scope.redirectAfterOrderSent = function () {
				$rootScope.loading = false;
				var helper, numberOfOrders;

                numberOfOrders = _.toArray($scope.orderHeaderByGroupInfo);

                //used to recursively delete the assortment from the assortment group related to the order
                helper = function(){
                    var i = 0;

                    return function(order){

                        if(i+1 < order.length){
                            //delete an assortment from the group and call helper again
                            assortment.deleteAssortment(order[i].assortmentId).then(function(){
                                i++;
                                helper(order);
                            });
                        }else{

                            var index = _.indexOf(numberOfOrders, order);

                            if((index + 1) < numberOfOrders.length){
                                //if its the last assorment in the order, delete it and call the next order
                                assortment.deleteAssortment(order[i].assortmentId).then(function(){
                                    //resets the assortment counter
                                    i = 0;
                                    helper(numberOfOrders[index + 1]);
                                });
                            }else{
                                //if its the last assortment in the last order, delete the order header info and load the menu page
                                assortment.deleteAssortment(order[i].assortmentId).then(function(){
                                    delete $scope.orderHeaderByGroupInfo;
                                    $rootScope.orderPopupShouldBeOpen = false;
                                    $location.path('/home/menu');
                                });
                            }
                        }
                    }
                }();

                //start deletion process
				helper(numberOfOrders[0]);
			};

        $scope.pricePerUnitForProductStyle = function (productStyle) {
            return productStyle.connections.products[0].unitPrice;
        };
    });
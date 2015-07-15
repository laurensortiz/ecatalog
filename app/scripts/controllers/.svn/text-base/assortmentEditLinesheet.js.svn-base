'use strict';

angular.module('conductivEcatalogApp').controller('AssortmentEditLinesheetCtrl', function ($rootScope, $scope,QueueManager, assortment, productStyles, $routeParams, $location, $timeout,Environment,$window,network) {

	$scope.assortmentId = $routeParams.assortmentId;
	$scope.whiteboardLink = "#/assortment/edit/" + $scope.assortmentId + "/whiteboard";
	$scope.expandProductStyleColor = [];
	$scope.assotmentModified = false;
	$scope.showDeleteButton = [];
	$scope.productStylesVisible = [];



	//=> Navigation Tabs
	$scope.showLeftNavTabs = false;
	$scope.showRightNavTabs = false;
	$rootScope.numberTabs = null;
	$scope.indexTabActive = null;
	var totalTabsRight,
			totalTabsLeft;
	// Navigation Tabs <==


	$rootScope.loading = true;
  if(network.canConnect() && Environment.isIOS){
    $rootScope.$broadcast('event:network-connectivity', true);
  }
	var thisAssortment = assortment.getAssortments($scope.assortmentId).then(function (response) {
		$scope.assortment = response;
		//$scope.orderedProductStylesInCurrentAssortment = productStyles.fetchOrderedProductStyles($scope.assortment.productStyles);
		$rootScope.loading = false;
	});


	$scope.toggleProductStyleColorDrillDown = function (productStyleId, event) {
	  //if it's not called from a delete button then toggle
		if (event.srcElement.className.indexOf('delete-button') === -1) {
			$scope.expandProductStyleColor[productStyleId] = !$scope.expandProductStyleColor[productStyleId];

			if ($scope.expandProductStyleColor[productStyleId] == true) {
			  //If ProductStyle has no Products Information at the moment we are open it the grid...
				var index = $rootScope.findProductStyleIndexById(productStyleId);
				if($rootScope.productStyles[index].products.length === 0){
          _.each($rootScope.productStyles[index].connections.products, function (product) {
            //Attaching extra data on the products for optimization when searching for next product.
            product.productStyleId = $rootScope.productStyles[index].id;
            product.productStyleCode = $rootScope.productStyles[index].code;
            var productOnAssortment = $rootScope.currentAssortment.findProductById(product.productId);
            if (productOnAssortment === undefined || productOnAssortment === null) {
              product.quantity = 0;
            } else {
              product.quantity = productOnAssortment.quantity;
            }
          });
          $rootScope.productStyles[index].products = productStyles.sortProductsBySize($rootScope.productStyles[index].connections.products);
          $('.assortment-list-container').animate({
            scrollTop: '+=100px'
          });
				} else {
					$('.assortment-list-container').animate({
						scrollTop: '+=100px'
					});
				}
			}
		}
	}

	$scope.findVirtualProductByCode = function (styleCode) {
		return _.find($scope.orderedProductStylesInCurrentAssortment, function (pair) {
            return pair[0] === styleCode;
		});
	}

	$scope.removeVirtualSubProduct = function (productStyle) {
		$scope.assotmentModified = true;
		$scope.hideNumpad();
		$scope.showDeleteButton[productStyle.id] = false;
		$rootScope.currentAssortment.removeProductStyle(productStyle);
		$scope.expandProductStyleColor[productStyle.id] = false;
		$scope.productStylesVisible[productStyle.code] = false
	}

	$scope.removeVirtualProduct = function (styleCode, event) {
		event.preventDefault();
		$scope.assotmentModified = true;
		$scope.hideNumpad();
		var found = $scope.findVirtualProductByCode(styleCode);

		if (found) {
			angular.forEach(found[1], function (productStyle) {
				$scope.showDeleteButton[productStyle.id] = false;
				$scope.expandProductStyleColor[productStyle.id] = false;
				$rootScope.currentAssortment.removeProductStyle(productStyle);
				$scope.showDeleteButton[styleCode] = false;
				$scope.productStylesVisible[styleCode] = false
			});
		}

	}

  $scope.schedulePersistenceOfQuantities = function () {
    if (!($scope.callbackPersistenceOfQuantities === undefined || $scope.callbackPersistenceOfQuantities === null)) {
      //Cancel existing timeout. It will be scheduled again.
      clearTimeout($scope.callbackPersistenceOfQuantities);
      $scope.callbackPersistenceOfQuantities = null;
    }

    $scope.callbackPersistenceOfQuantities = setTimeout(
      function () {
        $scope.callbackPersistenceOfQuantities = null;
        $rootScope.currentAssortment.persistProductQuantities();
      }, 3000);
  }

  $scope.showNumpad = function (product) {
    $scope.numpadVisible = true;
    $scope.numpad = {
      product: product,
      tempQuantity: angular.copy(product.quantity),
      pristineValue: true,
      updateQty: function (quantity) {
        if ($scope.numpad.tempQuantity.toString().length < 14) {   // Limiting the numbers to 15 digits
          if ($scope.numpad.pristineValue) {
            $scope.numpad.tempQuantity = quantity;
            $scope.numpad.pristineValue = false;
          } else {
            $scope.numpad.tempQuantity = $scope.numpad.tempQuantity * 10 + quantity;
          }
        }
      },
      persistQuantity: function () {
        if ($scope.numpad.product.quantity !== $scope.numpad.tempQuantity) {
	      $scope.assotmentModified = true;
          $scope.numpad.product.quantity = $scope.numpad.tempQuantity;
          $rootScope.currentAssortment.setProductQuantity($scope.numpad.product, $scope.numpad.tempQuantity);
          $scope.addProductStyleToAssortment($scope.numpad.product);
                    if(!$scope.numpad.product.productStyleCode){
                        $scope.numpad.product.productStyleCode = productStyles.getProductNameById($scope.numpad.product.name.slice(0, -($scope.numpad.product.size.length+1)));
                    }
          $rootScope.updateVirtualProductPriceQuantityCache($scope.numpad.product.productStyleCode);
          $rootScope.updateProducts();
          $timeout(function () {
              QueueManager.updateCurrentAssortment();
          }, 75);
      	}
      },
      next: function () {
        $scope.numpad.persistQuantity();

        var next = $scope.findNextProduct($scope.numpad.product);
        if (next) {
          $scope.numpad.setProduct(next);
          $scope.numpad.tempQuantity = next.quantity;
        }else{
          $scope.numpadVisible = false;
        }
        $timeout(function(){
          if(network.canConnect() && Environment.isIOS){
            $rootScope.$broadcast('event:network-connectivity', true);
          }
        },300);
      },
      ok: function () {
        $scope.numpad.persistQuantity();
        $scope.numpadVisible = false;
        $scope.numpad.product = null;
        $timeout(function(){
          if(network.canConnect() && Environment.isIOS){
            $rootScope.$broadcast('event:network-connectivity', true);
          }
        },300);
      },
      clear: function () {
        $scope.numpad.tempQuantity = 0;
      },
      del: function () {
        $scope.numpad.tempQuantity = Math.floor($scope.numpad.tempQuantity / 10);
      },
      setProduct: function (product) {
        $scope.numpad.product = product;
        $scope.numpad.tempQuantity = angular.copy(product.quantity);
        $scope.productStylesVisible[product.virtualStyleCode] = true;
        $scope.expandProductStyleColor[product.productStyleId] = true;
        $scope.numpad.pristineValue = true;
        $('.main-content').clearQueue();
        $('.main-content').scrollTo("#product-" + product.productId, 0, {axis: 'y', queue: false, offset: -150});
      }
    };
  }

  $scope.addProductStyleToAssortment = function(product){
      var tempSid = $rootScope.findProductStyleIndexById(productStyles.getProductStyleByName(product));
      if(!(_.findWhere($rootScope.currentAssortment.myProductStyles, {id:$rootScope.productStyles[tempSid].id}))){
          //Find productStyle by product name and adding it to currentAssortment
          $rootScope.currentAssortment.myProductStyles.push($rootScope.productStyles[tempSid]);
      }

  }

  $scope.hideNumpad = function () {
    $scope.numpadVisible = false;
    $scope.currentProductInNumpad = null;
  }

  $scope.getFeaturesInProductStyle = function (productStyle) {
    return productStyles.getFeatures(productStyle);
  }

  $rootScope.updateProducts = function(){
    var sum = 0;
    var qty = 0;
    if ($rootScope.currentAssortment) {
      _.each($rootScope.currentAssortment.products, function (product) {
          if (product.id) {
              sum = sum + product.unitPrice * product.quantity;
              qty = qty + product.quantity;
          }
      });
    }
    $scope.totalPriceForAssortment = sum;
    $scope.totalQuantityForAssortment = qty;
  }

  $rootScope.$watch('currentAssortment.products', $rootScope.updateProducts, true);

  $scope.initQuantityPriceCache = function () {
    $rootScope.quantityPriceCache = {productStyles: {}, virtualProducts: {}};
      if ($scope.orderedProductStylesInCurrentAssortment !== undefined && $scope.orderedProductStylesInCurrentAssortment !== null && $scope.orderedProductStylesInCurrentAssortment.length > 0) {
      _.each($scope.orderedProductStylesInCurrentAssortment, function (virtualProducts) {
        $rootScope.updateVirtualProductPriceQuantityCache(virtualProducts[0]);
      });
    }
  }

  $scope.pricePerUnitForProductStyle = function (productStyle) {
    var product = productStyle.connections.products[0];
    if (product) {
      return product.unitPrice;
    }
  }

  $scope.updateProductStylePriceQuantityCache = function (productStyle) {
	$rootScope.assotmentModified = true;
    var cache = $rootScope.quantityPriceCache.productStyles[productStyle.id];
    var price = 0;
    var sum = 0;
    _.each(productStyle.connections.products, function (product) {
      if(product.quantity == undefined) {
         product.quantity = 0
      }
      sum = sum + product.quantity;
      price = price + product.quantity * product.unitPrice;
    });
    if (cache === undefined) {
      $rootScope.quantityPriceCache.productStyles[productStyle.id] = {quantity: sum, price: price};
      cache = $rootScope.quantityPriceCache.productStyles[productStyle.id];
    } else {
      cache.quantity = sum;
      cache.price = price;
    }
  }

  $rootScope.updateVirtualProductPriceQuantityCache = function (productCode) {
    var cache = $rootScope.quantityPriceCache.virtualProducts[productCode];
    var sum = 0;
    var price = 0;
    var found = $scope.findVirtualProductByCode(productCode);
    if (found) {
      _.each(found[1], function (productStyle) {
        $scope.updateProductStylePriceQuantityCache(productStyle);
        var productStyleCache = $rootScope.quantityPriceCache.productStyles[productStyle.id];
        sum = sum + productStyleCache.quantity;
        price = price + productStyleCache.price;
      });
      if (cache === undefined) {
        $rootScope.quantityPriceCache.virtualProducts[productCode] = {quantity: sum, price: price};
        cache = $rootScope.quantityPriceCache.virtualProducts[productCode];
      } else {
        cache.quantity = sum;
        cache.price = price;
      }
    }
  }

  $scope.fetchOrderedProductStylesInCurrentAssortment = function () {
    if ($rootScope.currentAssortment) {
      return productStyles.fetchOrderedProductStyles($rootScope.currentAssortment.productStyles());
    } else {
      return null;
    }
  }

    $scope.findNextProduct = function (currentProduct) {
        for (var productIndex = 0; productIndex < $scope.orderedProductStylesInCurrentAssortment.length; productIndex++) {
            if(!currentProduct.productStyleCode){
                currentProduct.productStyleCode = productStyles.getProductNameById(currentProduct.name.slice(0, -(currentProduct.size.length+1)));
            }

            if($scope.orderedProductStylesInCurrentAssortment[productIndex][0] == currentProduct.productStyleCode){
                for (var styleIndex = 0; styleIndex < $scope.orderedProductStylesInCurrentAssortment[productIndex][1].length; styleIndex++) {
                    for (var productStyleIndex = 0; productStyleIndex < $scope.orderedProductStylesInCurrentAssortment[productIndex][1][styleIndex].products.length; productStyleIndex++) {
                        if(currentProduct.id ===  $scope.orderedProductStylesInCurrentAssortment[productIndex][1][styleIndex].products[productStyleIndex].id){
                            if($scope.orderedProductStylesInCurrentAssortment[productIndex][1][styleIndex].products[productStyleIndex+1]){
                                $scope.productStylesVisible[$scope.orderedProductStylesInCurrentAssortment[productIndex][1][styleIndex].products[productStyleIndex+1].styleCode] = true;
                                $scope.expandProductStyleColor[$scope.orderedProductStylesInCurrentAssortment[productIndex][1][styleIndex].id] = true;
                                return $scope.orderedProductStylesInCurrentAssortment[productIndex][1][styleIndex].products[productStyleIndex+1];
                                //Next product size
                            }else{
                                if($scope.orderedProductStylesInCurrentAssortment[productIndex][1][styleIndex+1]){
                                    $scope.expandProductStyleColor[$scope.orderedProductStylesInCurrentAssortment[productIndex][1][styleIndex+1].id] = true;
                                    $scope.productStylesVisible[$scope.orderedProductStylesInCurrentAssortment[productIndex][1][styleIndex+1].products[0].styleCode] = true;
                                    $('.assortment-list-container').animate({
                                        scrollTop: '+=100px'
                                    });
                                    return $scope.orderedProductStylesInCurrentAssortment[productIndex][1][styleIndex+1].products[0];
                                    //Next product
                                }else{
                                    if($scope.orderedProductStylesInCurrentAssortment[productIndex+1] && $scope.orderedProductStylesInCurrentAssortment[productIndex+1][1][0]){
                                        $scope.productStylesVisible[$scope.orderedProductStylesInCurrentAssortment[productIndex+1][0]] = true;
                                        $scope.expandProductStyleColor[$scope.orderedProductStylesInCurrentAssortment[productIndex+1][1][0].id] = true;
                                        $('.assortment-list-container').animate({
                                            scrollTop: '+=200px'
                                        });
                                        return $scope.orderedProductStylesInCurrentAssortment[productIndex+1][1][0].products[0];
                                        //Next product parent
                                    }else{
                                        return false;
                                        //Last one
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

	$scope.openOrderPopup = function () {

		var actualProduct = jQuery.grep($rootScope.currentAssortment.products, function (n) {
			return n.quantity > 0;
		});
		if (actualProduct.length == 0) {

			return;
		}

		$rootScope.orderPopupShouldBeOpen = true;

	}
	$scope.closeOrderPopup = function () {
        $rootScope.orderPopupShouldBeOpen = false
	}



  var init = function () {
    $scope.orderedProductStylesInCurrentAssortment = $scope.fetchOrderedProductStylesInCurrentAssortment();
    $scope.initQuantityPriceCache();
	  if($rootScope.orderPopupShouldBeOpen){
	    $scope.openOrderPopup();
	  }
  }

  init();

  $rootScope.$on('changed-product-styles-assortment-association', function () {
    init();
  });

  $scope.togglePsVisibility = function (virtualStyleCode, event) {
    //if it's not called from a delete button then toggle
    if (event.srcElement.className.indexOf('delete-button') === -1) {
      if ($scope.productStylesVisible[virtualStyleCode]) {
        $scope.productStylesVisible[virtualStyleCode] = false;
      } else {
        $scope.productStylesVisible[virtualStyleCode] = true;
        var clickedEle = angular.element(event.srcElement);
        if (clickedEle.position().top + 200 > $(window).height()) {
          $('.assortment-list-container').animate({
            scrollTop: '+=100px'
          })
        }
      }
    }
  }

  $scope.isProductActiveInVirtualNumpad = function (product) {
    if ($scope.numpadVisible) {
      if (product.productId === $scope.numpad.product.productId) {
        return 'active';
      } else if (product.quantity > 0) {
        return 'filled';
      }
    } else if (product.quantity > 0) {
      return 'filled';
    }
    return '';
  }



	/*========== Assortment WAVES  ============*/

	//Modal for New Assortment
	$rootScope.showNewAssortmentModal = false;

	$scope.openAssortmentNewModal  = function () {

		$rootScope.showNewAssortmentModal = true;
	}
	$scope.closeAssortmentNewModal  = function () {

		$rootScope.showNewAssortmentModal = false;
	}



	//List all assortments by group
	$scope.productStylesVisible = [];
    $scope.togglePsVisibility = function (virtualStyleCode, event) {
        //if it's not called from a delete button then toggle
        if (event.srcElement.className.indexOf('delete-button') === -1) {
            if ($scope.productStylesVisible[virtualStyleCode]) {
                $scope.productStylesVisible[virtualStyleCode] = false;
            } else {
                $scope.productStylesVisible[virtualStyleCode] = true;
                var clickedEle = angular.element(event.srcElement);
                if (clickedEle.position().top + 200 > $(window).height()) {
                    $('.assortment-list-container').animate({
                        scrollTop: '+=100px'
                    })
                }
            }
        }
    }

    $scope.isProductActiveInVirtualNumpad = function (product) {
        if ($scope.numpadVisible) {
            if (product.productId === $scope.numpad.product.productId) {
                return 'active';
            } else if (product.quantity > 0) {
                return 'filled';
            }
        } else if (product.quantity > 0) {
            return 'filled';
        }
        return '';
    }


    //Modal for New Assortment
    $scope.showNewAssortmentModal = false;

    $scope.openAssortmentNewModal  = function () {
        $scope.showNewAssortmentModal = true;
    }
    $scope.closeAssortmentNewModal  = function () {
        $scope.showNewAssortmentModal = false;
    }

    $rootScope.$on('event:refresh-assortment-tabs', function(event, assortmentId){

      //If I'm deleting the same assortment that I'm looking at, then let's move it to the previous one.
      if($scope.currentAssortment.id === assortmentId){
        var previousId = $scope.listOfAssortments[_.indexOf($scope.listOfAssortments,_.findWhere($scope.listOfAssortments,{id:assortmentId}))-1].id
        $scope.openAssortment(previousId);
      }
      $scope.getAssortments();
    });

    //List all assortments by group
    $scope.getAssortments = function(){
        assortment.getAssortment($scope.assortmentId).then(function(current){
            assortment.getAssortments().then(function (infoAssorment) {


                $scope.listOfAssortments =  _.filter(infoAssorment.data, function(name){
                    return name.group == current.group;
                });

                //We need to know the position INDEX of the current Active tab
                //_.findWhere = find inside $scope.listOfAssortments an object with the same ID of our assortment
                //and after that _.indexOf return the position INDEX of that object inside $scope.listOfAssortments
                $scope.indexTabActive = _.indexOf($scope.listOfAssortments,_.findWhere($scope.listOfAssortments,{id:$scope.assortmentId}))+1;

                //Set the number of tabs to this varible
	              $rootScope.numberTabs = $scope.listOfAssortments.length;

                //Get the size of contentTaps
                $scope.sizeContentTabs = $rootScope.numberTabs * 165;

                // ask if the tabs width is major than 675
                if($scope.sizeContentTabs > 675){
                    $scope.sizeContentTabs = 675;
                }
                //set the size related with current tabs.
                $('.taps-content').width($scope.sizeContentTabs);

                if($rootScope.numberTabs > 4){
                    $scope.showRightNavTabs = true;
                }
                if($scope.indexTabActive > 4){
                    $scope.showLeftNavTabs = true;

                    $scope.positionStart = -($scope.indexTabActive -4) * 165.5;



                }
                totalTabsRight = $rootScope.numberTabs - $scope.indexTabActive;
                totalTabsLeft = ($rootScope.numberTabs - totalTabsRight)-1 ;


                if(totalTabsRight == 0){
                    $scope.showRightNavTabs = false;
                }



            });


        });
    }

    $scope.getAssortments();

    $scope.isActive = function(assortmetID){
        if($rootScope.orderPopupShouldBeOpen){
            $rootScope.orderPopupShouldBeOpen = true;
        }
        var active = (assortmetID === $scope.assortmentId);
        return active ? "tab-active" : "";
    }


    $scope.navegationTabs ={

        next : function(){
            if ($('.taps-content ul').is(':animated'))
            {
                return false;
            }
                if($rootScope.numberTabs > 5 && $scope.indexTabActive != 1){
                    if($scope.indexTabActive == 2){
                        if(totalTabsRight <= 3){
                            $scope.showRightNavTabs = false;
                        }
                    }
                    if($scope.indexTabActive == 3){
                        if(totalTabsRight <= 2){
                            $scope.showRightNavTabs = false;
                        }
                    }
                    if(totalTabsRight <= 1){
                        $scope.showRightNavTabs = false;
                    }
                }else{
                    if(totalTabsRight <= 4){
                        $scope.showRightNavTabs = false;
                    }
                }
                if(totalTabsRight > 0){
                    $('.taps-content ul').stop(true, true).animate({
                        'left': '-=166px'
                    },400, function(){
                        totalTabsRight--;
                        totalTabsLeft++;
                    });
                }
                $scope.showLeftNavTabs = true;
        },
        prev: function(){
            if ($('.taps-content ul').is(':animated'))
            {
                return false;
            }
            if($rootScope.numberTabs > 5 && ($scope.indexTabActive == 1 || $scope.indexTabActive == 2 || $scope.indexTabActive == 3)){
                if($scope.indexTabActive == 1){
                    if( totalTabsLeft <= 1){
                        $scope.showLeftNavTabs = false;
                    }
                }
                if($scope.indexTabActive == 2){
                    if( totalTabsLeft <= 2){
                        $scope.showLeftNavTabs = false;
                    }
                }
                if($scope.indexTabActive == 3){
                    if( totalTabsLeft <= 3){
                        $scope.showLeftNavTabs = false;
                    }
                }
            }else{
                if(totalTabsLeft <= 4){
                    $scope.showLeftNavTabs = false;
                }
            }

            if(totalTabsLeft > 0){
                $('.taps-content ul').stop(true, true).animate({
                    'left': '+=166px'
                },400,function(){
                    totalTabsLeft--;
                    totalTabsRight++;

                });
            }

            $scope.showRightNavTabs = true;
            if($scope.showLeftNavTabs === false){
                $('.taps-content').css('margin-left', '5px');
            }
        }

    }

    $scope.openAssortment = _.debounce(function (assortmentId) {

        if(assortmentId !==$scope.assortmentId){
            $rootScope.loading = true;
            $location.path("/assortment/edit/" + assortmentId + "/linesheet");

        }
    }, 1000, true);


    $scope.$on('showPopUpOnLongHold', function (event, element, assortment) {
        $rootScope.optionsPopUpOnLongHold(event, element, assortment);

    });

	/*========== end/ Assortment WAVES  ============*/

    $scope.$root.navElements = [
        {
            "text": "Browse Catalogs",
            "icon": "book-icon",
            "action": $scope.$root.openCatalogListModal,
            "type": "iconNavLink"
        },
        {
            "text": "Search",
            "icon": "search-icon",
            "type": "iconNavLink",
            "action": $scope.$root.searchModal.open
        },
        {
            "text": "Whiteboard",
            "icon": "whiteboard-icon",
            "type": "iconNavLink",
            "link": $scope.whiteboardLink
        },
        {
            "text": "Confirm Order",
            "icon": "create-order-icon",
            "action": $scope.openOrderPopup,
            "type": "iconNavLink"
        }
    ];
    $scope.$root.initialElements = [
        {
            "text": "Browse Catalogs",
            "icon": "browse-catalog",
            "action": $scope.$root.openCatalogListModal,
            "type": "initialElementsLink"
        },
        {
            "text": "Product Search",
            "icon": "product-search",
            "type": "initialElementsLink",
            "action": $scope.$root.searchModal.open
        }
    ];

    $scope.totalQuantityForProductStyle = function (productStyle) {
        var sum = 0;
        angular.forEach(productStyle.connections.products, function (product) {
            sum = sum + $scope.getProductQuantity(product);
        });
        return sum;
    }

    $scope.totalPriceForProductStyle = function (productStyle) {
        var sum = 0;
        angular.forEach(productStyle.connections.products, function (product) {
            var unitPrice = _.values(_.pick(product, 'unitPrice'));
            sum = sum + $scope.getProductQuantity(product) * unitPrice;
        });
        return sum;
    }

    $scope.getProductsQty = function (productStyle) {
        var productQty = [];
        _.each(productStyle.connections.products, function(data){
            productQty.push(data);
        });
        productQty.sort(function(a,b) {
            return parseFloat(a.size) - parseFloat(b.size)
        });
        return productQty;
    }

    $scope.getProductQuantity = function (product) {
        if (product.quantity !== undefined && product.quantity !== null) {
            return product.quantity;
        } else {
            var found = $rootScope.currentAssortment.findProductById(product.productId);
            if (found) {
                product.quantity = found.quantity;
            } else {
                product.quantity = 0;
            }
            return product.quantity;
        }
    }
});

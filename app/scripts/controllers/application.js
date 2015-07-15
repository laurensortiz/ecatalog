'use strict';

angular.module('conductivEcatalogApp').controller('ApplicationCtrl', function ($scope, productStyles, assortment, Catalog, catalog, $rootScope, $filter, $location, authentication, $window, $timeout, fileSync, httpCapi, SyncManager, OfflineManager, QueueManager, Environment) {

  var isUserLoggedIn = authentication.isUserLoggedIn();
  $rootScope.allColors = [];
  $scope.showUserDropdown = {main: false, lang: false};

  var getTenantStyleSheets = function () {
    var tenantStylesheets = [];
    var organization = null;
    var currentStyle;

    var savedStyle = localStorage.getItem("organization-style:");
    if (authentication.isLoggedIn()) {
      organization = sessionStorage['tenant'];
    } else {
      var loginInfo = authentication.getSavedUserInfo();
      if (loginInfo !== null && loginInfo !== undefined) {
        organization = loginInfo.organization;
      }
    }
    //Let's check if our styles are saved into teh localStorage
    if (savedStyle) {
      tenantStylesheets = [
        {href: savedStyle, type: 'text/css'}
      ];
    } else {
      if (organization !== undefined && organization !== null && organization.trim() !== '') {
        tenantStylesheets = [
          {href: httpCapi.generateFilesUrl() + "/" + organization + "/Styles/style.css", type: 'text/css'}
        ];
        currentStyle = tenantStylesheets[0].href;
        localStorage.setItem("organization-style:", currentStyle);
      }
    }
    return tenantStylesheets;
  }

  $scope.tenantStylesheets = getTenantStyleSheets();

  $rootScope.browseCatalog = function (catalogId) {
    //Setting Up Offline Handlers
    if (catalog.isDownloaded(catalogId)) {
      $location.path('catalog/master/' + catalogId + '/browse');
    } else {
      $rootScope.loading = true;
      $rootScope.progressBarStatus = 1;
      $rootScope.openingCatalogId = catalogId;

      Catalog.syncDetails(catalogId).then(function () {
        //Catalog.syncFiles(catalogId).then(function () {
        catalog.markDownloaded(catalogId);
        $rootScope.loading = false;
        $rootScope.openingCatalogId = null;
        $location.path('catalog/master/' + catalogId + '/browse');
        // });
      });
    }
  }

  $rootScope.defaultGlobalLinks = [];

  $scope.productName = "Conductiv e-Catalog";


  $rootScope.setPageTitle = function (title) {
    $scope.pageTitle = $scope.productName + " - " + title;
  }

  $rootScope.connectionStatusError = false;
  $rootScope.errorLoading = false;
  $rootScope.loading = false;
  $rootScope.progressBarStatus = null;

  $rootScope.connectionStatusErrorRedirect = function () {
    $rootScope.connectionStatusError = false;
  }

  $rootScope.closeErrorMessage = function () {
    $rootScope.errorLoading = false;
  }

  $rootScope.reloadPage = function () {
    $window.location.reload();
  }

  $rootScope.logout = function () {
    if (Environment.isIOS) {
      QueueManager.stopAssortentQueue();
      QueueManager.stopOrderQueue();
      QueueManager.stopConnectionCheck();
    }
    $rootScope.loggedIn = false;
    authentication.logout();
    $location.path('/login');
  };

  $rootScope.modalReset = null;

  $rootScope.navElements = _.clone($rootScope.defaultGlobalLinks);
  $rootScope.headerOptions = {
    showToggle: false,
    showHeader: false,
    showBackButton: false,
    hideEntireHeader: false
  };

  $rootScope.$on('$routeChangeStart', function () {
    $scope.tenantStylesheets = getTenantStyleSheets();
    $rootScope.headerOptions.showHeader = false;
    $rootScope.headerOptions.showToggle = false;
    $rootScope.headerOptions.showBackButton = false;
    $rootScope.previousPageLocation = '/login';
    $scope.pageTitle = $scope.productName;
    $rootScope.navElements = _.clone($rootScope.defaultGlobalLinks);
    $(".modal").remove();
    $(".modal-backdrop").remove();
    if (!$rootScope.$$phase) {
      $rootScope.$apply();
    }
  });
  $rootScope.previousPage = function () {
    $location.path($rootScope.previousPageLocation);
  }
  $rootScope.$on('$routeChangeSuccess', function (scope, current, prev) {
    //hide the header for Login Screen
    if ($location.path() == "/login") {
      $rootScope.headerOptions.showHeader = true;
      $rootScope.headerOptions.showBackButton = false;
    } else if ($location.path() == "/home/menu") {
      $rootScope.headerOptions.showHeader = true;
      $rootScope.headerOptions.showBackButton = false;
    } else {
      $rootScope.headerOptions.showHeader = true;
      $rootScope.headerOptions.showBackButton = true;
    }
    switch (current.$$route.templateUrl) {
      case 'views/catalogList.html':
        $rootScope.previousPageLocation = '/home/menu';
        break;
      case 'views/masterCatalogBrowse.html':
        $rootScope.previousPageLocation = '/catalog/list';
        break;
      case 'views/assortmentEditBrowse.html':
        switch (prev.$$route.templateUrl) {
          case 'views/assortmentEditLinesheet.html':
            $rootScope.previousPageLocation = '/assortment/edit/' + $rootScope.currentAssortment.id + '/linesheet';
            break;
          case 'views/assortmentEditWhiteboard.html':
            $rootScope.previousPageLocation = '/assortment/edit/' + $rootScope.currentAssortment.id + '/whiteboard';
            break;
          default:
            $rootScope.previousPageLocation = '/assortment/edit/' + $rootScope.currentAssortment.id + '/linesheet';
            break;
        }
        ;
        break;
      case 'views/assortmentList.html':
        $rootScope.previousPageLocation = '/home/menu';
        break;
      case 'views/assortmentEditLinesheet.html':
        $rootScope.previousPageLocation = '/assortment/list';
        break;
      case 'views/assortmentEditWhiteboard.html':
        $rootScope.previousPageLocation = '/assortment/list';
        break;
      case 'views/assortmentOrderSummary.html':
        $rootScope.previousPageLocation = '/assortment/edit/' + $rootScope.currentAssortment.id + '/linesheet';
        break;
      case 'views/order.html':
        $rootScope.previousPageLocation = 'order/list';
        break;
      case 'views/draftOrder.html':
        $rootScope.previousPageLocation = '/assortment/edit/' + $rootScope.currentAssortment.id + '/linesheet';
        break;
      case 'views/orderList.html':
        $rootScope.previousPageLocation = '/home/menu';
        break;
      case 'views/salesDashboard.html':
        $rootScope.previousPageLocation = '/home/menu';
        break;
      case 'views/futureConcept.html':
        $rootScope.previousPageLocation = '/catalog/list';
        break;
    }

  });

  $rootScope.loggedIn = false;

  // Assortment operations start
  $rootScope.findProductStyleIndexById = function (productStyleId) {
    for (var index = 0; index < $rootScope.productStyles.length; index++) {
      if ($rootScope.productStyles[index].id == productStyleId) {
        return index;
      }
    }
    return -1;
    // Not found
  }

  $rootScope.getProductStyle = function (productStyleId) {
    if ($rootScope.productStyles) {
      return $rootScope.productStyles[$rootScope.findProductStyleIndexById(productStyleId)];
    }
  }
  //TODO  Move to assortmentCurrentService...
  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    if (next.params.assortmentId) {
      if ($rootScope.currentAssortment === null || $rootScope.currentAssortment === undefined || $rootScope.currentAssortment.id != next.params.assortmentId) {
        assortment.getAssortment(next.params.assortmentId).then(function (thisAssortment) {
          $rootScope.setCurrentAssortment(thisAssortment);
        });
      }
    } else {
      if (!($rootScope.currentAssortment === undefined || $rootScope.currentAssortment === null)) {
        // Assortment has already been saved and deleted -> $rootScope.currentAssortment.persistProductQuantities();
        var assortmentToSave = $rootScope.currentAssortment;
        assortmentToSave.key = 'Assortment|' + assortmentToSave.id;
        assortmentToSave.update = true;
        OfflineManager.save(assortmentToSave);
      }
      $rootScope.setCurrentAssortment(null);
    }
  });
  //TODO Move to assortmentCurrentService ...
  $rootScope.setCurrentAssortment = function (thisAssortment) {
    if (!(thisAssortment === null || thisAssortment === undefined)) {
      //this in order to avoid the overwrite of the function productStyles() that is appended
      // to the currentAssortment OBJ.
      if (_.isUndefined(thisAssortment.myProductStyles)) {
        thisAssortment.myProductStyles = thisAssortment.productStyles;
      }
      $rootScope.currentAssortment = thisAssortment;

      $rootScope.currentAssortment.findProductById = function (productId) {
        var res = false;
        _.each($rootScope.currentAssortment.products, function (product) {
          if (product.productId == productId) {
            res = product;
          }
          ;
        });
        return res;
      }

      //TODO  Move to assortmentCurrentService...
      $rootScope.currentAssortment.persistProductQuantities = function () {
        var toPersist = _.where($rootScope.currentAssortment.products, {
          persistQuantity: true
        });

        if (toPersist.length > 0) {

          assortment.bulkPersistProductQuantities($rootScope.currentAssortment.id, toPersist, function () {
            //Clear the flag for all the persisted products
            _.each(toPersist, function (product) {
              product.persistQuantity = undefined;
            });
          });
        }
      }

      //TODO  Move to assortmentCurrentService...
      $rootScope.currentAssortment.setProductQuantity = function (product, quantity) {
        var found = $rootScope.currentAssortment.findProductById(product.productId);
        if (found) {
          if (quantity === 0) {
            //Delete the product
            var index = 0;
            _.each($rootScope.currentAssortment.products, function (prod) {
              if (prod.productId === product.productId) {
                $rootScope.currentAssortment.products.splice(index, 1)
              }
              index++;
            });
          } else {
            found.quantity = quantity;
            found.persistQuantity = true;
          }
        } else {
          found = product;
          $rootScope.currentAssortment.products.push(found);
        }
      }
      //TODO  Move to assortmentCurrentService...
      $rootScope.currentAssortment.addProductStyle = function (productStyle, skipPersistence) {
        if (!productStyle.availableOnCurrentAssortment) {
          changeProductStyleAssociationWithAssortment(productStyle, true, skipPersistence);
        }
      }
      //TODO  Move to assortmentCurrentService...
      $rootScope.currentAssortment.removeProductStyle = function (productStyle) {
        if (productStyle.availableOnCurrentAssortment) {
          // Now remove the product style
          changeProductStyleAssociationWithAssortment(productStyle, false);
        }
      }
      //TODO  Move to assortmentCurrentService...
      $rootScope.currentAssortment.removeAllProductStyles = function () {
        _.each($rootScope.currentAssortment.productStyles(), function (style) {
          $rootScope.currentAssortment.removeProductStyle(style);
        });
      }
      //TODO  Remove if not needed...
      $rootScope.currentAssortment.toggleProductStyleAvailability = function (productStyle) {
        var availability = productStyle.availableOnCurrentAssortment || false;
        if (availability)
          $rootScope.$emit('productRemovedFromAssortment', productStyle.id);
        changeProductStyleAssociationWithAssortment(productStyle, !availability);
        //Let's update the product count...
        $timeout(function () {
          $rootScope.currentAssortment.products = [];
          _.each($rootScope.currentAssortment.myProductStyles, function (theProductstyle) {
            _.each(theProductstyle.connections.products, function (product) {
              if (product.quantity > 0) {
                $rootScope.currentAssortment.products.push(product);
              }
            });
          });
//                  $rootScope.$broadcast('event:network-connectivity-assortments', true);
          if (!$rootScope.$$phase) {
            $rootScope.$apply();
          }
        }, 1000);
      }
      //TODO  Move to appropriate area in the application if needed and aggregate myProductStyles and productStyles...
      $rootScope.currentAssortment.productStyles = function () {
        //We going thru all the Product Styles and attach our current products so the grid can show the actual quantities...
        var myCurrentStylesIds = _.pluck($rootScope.currentAssortment.myProductStyles, 'id');
        _.each(myCurrentStylesIds, function (myCurrentStylesId) {
          _.findWhere($rootScope.productStyles, {id: myCurrentStylesId}).connections.products = _.findWhere($rootScope.currentAssortment.myProductStyles, {id: myCurrentStylesId}).connections.products;
          _.findWhere($rootScope.productStyles, {id: myCurrentStylesId}).products = _.findWhere($rootScope.currentAssortment.myProductStyles, {id: myCurrentStylesId}).connections.products;
        });

        return $filter('filter')($rootScope.productStyles, {
          availableOnCurrentAssortment: true
        });
      }

      $rootScope.loading = true;

      //TODO  Move to productStyleService...
      productStyles.getAllProductStyles().then(function (allProductStyles) {
        //Let´s change before the path to local
        _.each(allProductStyles, function (productStyle) {
          httpCapi.getFileResource(productStyle.links.image).then(function (resolvedURL) {
            productStyle.links.image = resolvedURL;
          });

          //Now get the key feature foe each product style
          //Not beeing used anymore
          productStyle.keyFeatures = _.groupBy(productStyle.features, function (feature) {
            return feature.type;
          });
        });

        $rootScope.productStyles = allProductStyles;
        if (_.isUndefined(thisAssortment.myProductStyles)) {
          thisAssortment.myProductStyles = thisAssortment.productStyles;
        }
        if (thisAssortment.myProductStyles.length === 0) {
          $rootScope.loading = false;
        }
        _.each(thisAssortment.myProductStyles, function (foundProductStyle, foundProductStyleIndex) {
          var index = $rootScope.findProductStyleIndexById(foundProductStyle.id);
          $rootScope.productStyles[index].availableOnCurrentAssortment = true;

          // Fetch all the products associated with the product styles
          var products = foundProductStyle.connections.products;
          if (products.length === 0) {
            $rootScope.loading = false;
          }
          _.each(products, function (product) {
            //Attaching extra data on the products for optimization when searching for next product.
            product.productStyleId = $rootScope.productStyles[index].id;
            product.productStyleCode = $rootScope.productStyles[index].code;
            var productOnAssortment = $rootScope.currentAssortment.findProductById(product.productId);
            if (productOnAssortment === undefined || productOnAssortment === null) {
              product.quantity = 0;
            } else {
              product.quantity = productOnAssortment.quantity;
            }
          })
          $rootScope.productStyles[index].products = products;
          if (foundProductStyleIndex === (thisAssortment.myProductStyles.length - 1)) {
            $rootScope.$emit('changed-product-styles-assortment-association');
            $rootScope.loading = false;
          }
        });

        //Alphabetizing Color List
        var regexNoSymbols = /[^\w\s]/gi;
        $rootScope.allColors.sort(function (color1, color2) {
          //removing special chars to treat "(A - Skate) Charcoal" as "A Skate Charcoal"
          var color1NoSymbols = color1.name.replace(regexNoSymbols, ''), color2NoSymbols = color2.name.replace(regexNoSymbols, '');
          if (color1NoSymbols < color2NoSymbols)
            return -1;
          if (color1NoSymbols > color2NoSymbols)
            return 1;
          return 0;
        });
      });
    } else {
      // Reset product styles
      if (!($rootScope.currentAssortment === null || $rootScope.currentAssortment === undefined)) {
        angular.forEach($rootScope.productStyles, function (style) {
          style.availableOnCurrentAssortment = false;
        });
        $rootScope.$emit('changed-product-styles-assortment-association');
      }

    }
  }
  //TODO  Move to assortmentCurrentService...
  var changeProductStyleAssociationWithAssortment = function (productStyle, presence, skipPersistence) {

    var index = $rootScope.findProductStyleIndexById(productStyle.id);
    if (index > -1) {
      productStyle.processingOperation = true;
      var operation = null;
      if (presence == true) {// Adding style
        operation = productStyles.associateWithAssortment;
        $rootScope.currentAssortment.myProductStyles.push(productStyle);
      } else {
        // Removing style
        // Remove the product quantities from the cache first
        var productIdsToRemove = [];
        _.each(productStyle.products, function (product) {
          product.quantity = 0;
          productIdsToRemove.push(product.productId);
        });
        var indexProd = [];
        _.each($rootScope.currentAssortment.products, function (product) {
          if (!_.contains(productIdsToRemove, product.id)) {
            if (product.id) {
              indexProd.push(product);
            }
          }
        });
        $rootScope.currentAssortment.products = indexProd;
        operation = catalog.deleteProductStyleInAssortment;
        $rootScope.updateProducts();
      }
      if (skipPersistence) {
        $rootScope.productStyles[index].availableOnCurrentAssortment = presence;
        $rootScope.$emit('changed-product-styles-assortment-association');
        productStyle.processingOperation = false;
      } else {
        operation(productStyle.id, $rootScope.currentAssortment.id).then(function (data) {
          if (data == '2') {// Indicating success. eg. 200, 204 etc.
          }
          productStyle.processingOperation = false;
        });
      }
    }
  }

  // Assortment operations end

  /*
   * Common Modal Box option
   */
  $rootScope.modalOpts = {
    dialogClass: "modal large-form-modal drop-shadow",
    backdropClick: false
  };

  $rootScope.openCatalogListModal = function () {
    $rootScope.showCatalogListModal = true;
  }

  $rootScope.closeCatalogListModal = function () {
    $rootScope.showCatalogListModal = false;
  }

  $rootScope.searchModal = {
    searchingDialogShouldBeOpen: false,
    options: {
      dialogClass: "modal drop-shadow modal-search-box large-form-modal",
      backdropClick: false
    },
    open: function () {
      $rootScope.searchModal.searchingDialogShouldBeOpen = true;
      setTimeout(function () {
        var modalBodyHt = $('.modal').height() - 39;
        $('.filter-container').height(modalBodyHt);
      }, 500);
    },
    close: function () {
      $rootScope.searchModal.searchingDialogShouldBeOpen = false;
    }
  };

  // Product search operations end
  /*
   Call the validation API. To be done once the app starts.
   Then which ever forms need validation they can use the JSON in this response.
   */
  if (isUserLoggedIn) {
    if ($rootScope.validations === undefined || $rootScope.validations === null) {
      catalog.getValidations().then(function (data) {
        $rootScope.validations = data;
      });
    }
  }
});
'use strict';

angular.module('conductivEcatalogApp')
    .factory('productStyles', function ($http, httpCapi, SyncManager, $q, assortment, OfflineManager, $rootScope) {
      // Public API here
      var service = {};

      var ENTITY_TYPE = 'ProductStyles';
      var CONTENT_TYPE_IMAGE = 'Image';

      var fetchAllProductStyles = function () {
        var deferred = $q.defer();
        $http({
          method: "GET",
          url: httpCapi.generateBaseApiUrl() + "/product-styles?expand=self,products",
          headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
              _.each(response.data, function (productStyle) {
                // TODO: We Order The products By some Sequence... We need to figure out tenant agnostic.
                // TODO: Commenting the following is expected to cause a regression in the linesheet products sequence.
                /*productStyle.connections.products = _.sortBy(productStyle.connections.products, function (product) {
                 return _.where(product.features, {type: "SIZE"})[0].sequenceNumber;
                 });*/
                //We are doing this each because there's no quantity for product styles...
                _.each(productStyle.connections.products, function (product) {
                  product.quantity = 0;
                });
              });
              deferred.resolve(response.data);
            });
        return deferred.promise;
      }

      var fetchProductStyle = function (productStyle) {
        var deferred = $q.defer();
        var psId = productStyle.styleCode;
        $http({
          method: "GET",
          url: httpCapi.generateBaseApiUrl() + '/product-styles/' + psId + '/products',
          headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
              deferred.resolve(response.data);
            });
        return deferred.promise;
      }

      service.getAllProductStyles = function () {
        return SyncManager.fetch(fetchAllProductStyles, ENTITY_TYPE);
      }

      service.getProductStyle = function (id) {
        var deferred = $q.defer();
        SyncManager.fetch(fetchAllProductStyles, ENTITY_TYPE).then(function (productStyles) {
          var found = _.find(productStyles, function (productStyle) {
            return productStyle.id === id;
          });
          deferred.resolve(found);
        })
        return deferred.promise;
      }

      service.getProducts = function (id) {
        return SyncManager.fetch(
            function () {
              return fetchProductStyle(id)
            },
            ENTITY_TYPE, {id: id}
        );
      };
      service.saveAllProductStyles = function () {
        return SyncManager.save(fetchAllProductStyles, ENTITY_TYPE);
      }

      service.persist = function (id) {
        return SyncManager.save(
            function () {
              return fetchProductStyle(id)
            },
            ENTITY_TYPE, {id: id}
        );
      };

      service.createUpdateProductSyleList = function () {
        var updateAssortemtList = {key: 'ASSORTMENT_UPDATE_PRODUCTSTYLE_LIST', data: []};
        OfflineManager.save(updateAssortemtList);
      }

      service.associateWithAssortment = function (productId, assortmentId) {
        var defer = $q.defer();
        var index;

        OfflineManager.find('ASSORTMENT_UPDATE_PRODUCTSTYLE_LIST').then(function (updateAssortemtList) {
          updateAssortemtList.data.push({"productId": productId, "assortmentId": assortmentId});
          OfflineManager.save(updateAssortemtList);
        });

        assortment.getAssortment(assortmentId).then(function (myAssortment) {
          service.getAllProductStyles(productId).then(function (productStyles) {
            var myProductStyle = _.findWhere(productStyles, {id: productId});

            index = $rootScope.findProductStyleIndexById(myProductStyle.id);
            if (myAssortment.myProductStyles) {
              myAssortment.myProductStyles.push(myProductStyle);

            } else {
              myAssortment.myProductStyles = [];
              myAssortment.myProductStyles.push(myProductStyle);
            }
            myAssortment.key = 'Assortment|' + myAssortment.id;
            myAssortment.update = true;

            OfflineManager.save(myAssortment).then(function () {
              $rootScope.productStyles[index].availableOnCurrentAssortment = true;
              $rootScope.$emit('changed-product-styles-assortment-association');
            });
          });
        });

        return defer.promise;
      }

      service.associateWithAssortmentCAPI = function (pId, aId) {
        var promise = $http({
          method: "POST",
          url: httpCapi.generateBaseApiUrl() + "/assortments/" + aId + "/product-styles?productStyleId=" + pId,
          headers: httpCapi.generateCommonAPIHeaders(),
          data: [
            {
              productStyleId: pId
            }
          ]
        }).then(function (response) {
              return response;
            }, function (reason) {
              return reason;
            });
        return promise;
      }

      //This function is required by productStylesSearch
      service.bulkAssociateWithAssortment = function (productStyles, assortmentId) {
        var defer = $q.defer();
        var data = _.map(productStyles, function (productStyle) {
          return {productStyleId: productStyle.id};
        });
        return defer.promise;
      }

      service.bulkAssociateWithAssortmentCAPI = function (productData, assortmentId) {
        var promise = $http({
          method: "POST",
          url: httpCapi.generateBaseApiUrl() + "/assortments/" + assortmentId + "/product-styles",
          headers: httpCapi.generateCommonAPIHeaders(),
          data: productData
        }).then(function (response) {
              return response;
            }, function (reason) {
              return reason;
            });
        return promise;
      }

      service.getFeatures = function (productStyle) {
        var features = {
          size: [],
          width: ['M']
        };
        if (productStyle.connections) {
          _.forEach(productStyle.connections.products, function (product) {
            var size = _.findWhere(product.features, {type: "SIZE"});
            product.size = size.value;
            features.size.push(size);
          });
        }

        features.size = _.sortBy(_.uniq(features.size), function (thisSize) {
          return parseInt(thisSize.sequenceNumber, 10);
        });

        features.size = _.pluck(features.size, 'value');
        return features;
      }

      service.sortProductsBySize = function (products) {
        return _.sortBy(products, function (product) {
          return parseInt(_.findWhere(product.features, {type: "SIZE"}).sequenceNumber, 10);
        });
      }

      service.fetchOrderedProductStyles = function (productStyles) {
        // Sort the products inside product styles by the sequence number
        _.forEach(productStyles, function (thisProductStyle) {
          thisProductStyle.products = service.sortProductsBySize(thisProductStyle.products);
        });

        // Group the product styles by the virtual product style's name (the code)
        var ordered = _.groupBy(productStyles, function (style) {
          return style.code;
        });
        var orderedPairs = _.pairs(ordered);

        // Sort the virtual products alphabetically
        var orderedAlphaPairs = _.sortBy(orderedPairs, function (pair) {
          return pair[0];
        });

        return orderedAlphaPairs;
      }

      service.fetchAllInCatalog = function (catalogId) {
        var promise = $http({
          method: "GET",
          url: httpCapi.generateBaseApiUrl() + "/master-catalogs/" + catalogId + "/product-styles",
          headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
              return response.data;
            });
        return promise;
      }

      service.getProductStyleByName = function (product) {
        var styleId = 0;
        _.each($rootScope.productStyles, function (style) {
          if (product.name.replace(/\s+/g, '') == (style.name + " " + product.size).replace(/\s+/g, '')) {
            styleId = style.id;
          }
        });
        return styleId;
      }
      service.getProductNameById = function (productStyleName) {
        for (var i = 0; i < $rootScope.productStyles.length; ++i) {
          if (productStyleName === $rootScope.productStyles[i].name) {
            return $rootScope.productStyles[i].code;
            break;
          }
        }
      }

      service.getImage = function (styleId, type) {
        var deferred = $q.defer();

        service.getProductStyle(styleId).then(function (style) {
          var image = null;

          var foundMedia = _.find(style.connections.media, function (media) {
            return media.contentType === CONTENT_TYPE_IMAGE && media.productContentType === type;
          })

          if (foundMedia) {
            image = foundMedia.links.image;
          }

          deferred.resolve(image);
        });
        return deferred.promise;
      }

      return service;
    });

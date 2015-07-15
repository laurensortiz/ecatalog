'use strict';

angular.module('conductivEcatalogApp')
    .service('AssortmentCurrentService', function AssortmentCurrentService($http, httpCapi, SyncManager, $q, OfflineManager, AssortmentCurrent) {
      var ENTITY_TYPE_ASSORTMENT = "Assortment";
			var ASSORTMENT_UPDATE_PRODUCTSTYLE_LIST = [];

			var offlineStorage;
			var getOfflineStorage = function (entity_type) {
				if (offlineStorage === undefined) {
					offlineStorage = OfflineManager.getStorage(entity_type)
				}
				return offlineStorage;
			}

      var service = {

        findById: function(id){

          var deferred = $q.defer();
          getOfflineStorage(ENTITY_TYPE_ASSORTMENT).get(id, function (found) {

            deferred.resolve(found);
          });

          return deferred.promise;
        },
        findProductById: function(id){
          var deferred = $q.defer();
	        AssortmentCurrent.findProductById(id).then(function (found) {
		        deferred.resolve(found);
	        });
          return deferred.promise;
        },
	      bulkPersistProductQuantities : function(assortmentId, products){
		      var deferred = $q.defer();


		      return deferred.promise;
	      },
	      setProductQuantity: function(product, quantity){

		      var deferred = $q.defer();
					product.quantity = quantity;
		      deferred.resolve(product)

		      return deferred.promise;
	      },
	      associateProductStyleWithAssortment: function (productStyleID, assortmentId) {
		      var deferred = $q.defer();

		      //TODO change this
		      OfflineManager.find('ASSORTMENT_UPDATE_PRODUCTSTYLE_LIST').then(function (updateAssortmentList) {
			      if(updateAssortmentList == null){
				      updateAssortmentList= {"data":[]};
			      }
			      updateAssortmentList.data.push({"productStyleId": productStyleID, "assortmentId": assortmentId});

			      getOfflineStorage().save(updateAssortmentList, function (response) {
				      deferred.resolve(response);
			      });
		      });
		      return deferred.promise;
	      }

      };
      return service;
    });

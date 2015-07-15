'use strict';

angular.module('conductivEcatalogApp.models')
  .service('Assortment', function(AssortmentService) {
        var service = {
            find: function(id){
                return AssortmentService.find(id);
            },
            all: function(){
                return AssortmentService.all();
            },
            duplicate: function(groupId, shouldDuplicateQuantities) {
                return AssortmentService.duplicate(groupId, shouldDuplicateQuantities);
            },
            rename: function(groupId, assortmentDescription) {
                return AssortmentService.rename(groupId, assortmentDescription);
            },
            remove: function(id) {
                return AssortmentService.remove(id);
            }
        };
        return service;
  });

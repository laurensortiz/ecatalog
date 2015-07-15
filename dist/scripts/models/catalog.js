'use strict';

angular.module('conductivEcatalogApp.models')
    .service('catalog', function (catalogService) {
      var service = {
        find: function(id){
          return catalogService.find(id);
        },
        all: function(){
          return catalogService.all();
        },
        sync: function(){
          return catalogService.sync();
        }
      };
      return service;
    });
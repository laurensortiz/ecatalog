'use strict';

angular.module('conductivEcatalogApp.models')
    .service('Product', function (ProductService) {
      var service = {
        all: function(){
          return ProductService.all();
        },
        find: function(id){
          return ProductService.find(id);
        }
      };
      return service;
    });

//(old) Virtual style -> Product Style
//(old) Product Style -> Display Style
//(old) Product -> Product
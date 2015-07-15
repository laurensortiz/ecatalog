'use strict';

angular.module('conductivEcatalogApp.models')
    .service('ProductStyle', function (ProductStyleService) {
      var service = {
        find: function(id){
          return ProductStyleService.find(id);
        },
        image: function(id, type ){
          return ProductStyleService.image(id, type);
        },
        sync: function(){
          return ProductStyleService.sync();
        }
      };
      return service;
    });

//(old) Virtual style -> Product Style
//(old) Product Style -> Display Style
//(old) Product -> Product
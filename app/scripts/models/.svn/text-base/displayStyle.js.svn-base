'use strict';

angular.module('conductivEcatalogApp.models')
    .service('DisplayStyle', function (DisplayStyleService) {
      var service = {
        all: function () {
          return DisplayStyleService.all();
        },
        find: function (id) {
          return DisplayStyleService.find(id);
        },
        sync: function () {
          return DisplayStyleService.sync();
        },
        image: function (id, type) {
          return DisplayStyleService.sync(id, type);
        }
      };
      return service;
    });

//(old) Virtual style -> Product Style
//(old) Product Style -> Display Style
//(old) Product -> Product
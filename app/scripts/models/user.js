'use strict';

angular.module('conductivEcatalogApp.models')
  .service('User', function(UserService) {
        var service = {
		        get : function(id) {
                    UserService.get(id);
		        }
	        };
        return service;
  });

angular.module('select.mocks')
    .service('mockOfflineManager', function () {
      var service = {
        mockLawnChair: function () {
          return {
            all: function (callback) {
              callback(service.testObjects);
            },
            get: function (key, callback) {

              var found = _.find(service.testObjects, function (item) {
                return item.id === key;
              });
              callback(found);
            },
            save: function (object, callback) {
              callback(object);
            },
            batch: function (array, callback) {
              callback(array);
            },
            remove: function (key, callback) {
              var found = _.find(service.testObjects, function (item) {
                return item.id === key;
              });

              var deleted = _.without(service.testObjects, found);
              callback(deleted);
            }
          };
        },
        getStorage: function () {
          return this.mockLawnChair();
        }
      };
      return service;
    });
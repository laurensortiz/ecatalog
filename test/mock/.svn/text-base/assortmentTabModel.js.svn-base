angular.module('select.mocks')
    .service('mockAssortmentTabModel', function () {

      var mockAssortmentTabModel = {
        create: function () {
          mockAssortmentTabModel.mockAssortmentTabs.push(Factory.build('assortment-tab'));
          return {
            then: function (callback) {
              callback();
            }
          };
        },
        findByGroup: function (groupId) {
          return {
            then: function (callback) {
              callback(_.where(mockAssortmentTabModel.mockAssortmentTabs, {groupId: groupId}));
            }
          };
        },
        duplicate: function (tabId, groupId, shouldDuplicateQuantity) {
          return {
            then: function (callback) {
              callback(Factory.build('assortment-tab'));
            }
          };
        },
          current: {
              findProductById: function (id) {
                  return {
                      then: function (callback) {
                          callback(_.where(mockAssortmentTabModel.mockAssortmentProduct, {id: id}));
                      }
                  };
              }
          }
      }

      return mockAssortmentTabModel;
    });
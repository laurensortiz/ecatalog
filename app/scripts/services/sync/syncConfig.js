'use strict';

angular.module('conductivEcatalogApp')
    .service('SyncConfig', function syncConfig(Catalog, Environment, SyncManager, DisplayStyle, Order) {
      return {
        init: function () {
          /* Register data sync services for the application sync */
          SyncManager.registerSync(Catalog.sync);
          SyncManager.registerSync(DisplayStyle.sync);
          SyncManager.registerSync(Order.sync);
          /* end registration */

          if (Environment.isInWebkitContainer) {
            /* Register file sync services for the application sync */
            //TODO: All the file sync related methods get registered here.
            /* end registration */
          }
        }
      }
    });
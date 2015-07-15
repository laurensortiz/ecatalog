'use strict';

angular.module('conductivEcatalogApp')
    .factory('fileSync', function (catalog, customer, order, productStyles, assortment, $routeParams, s3directoryService, $location, $timeout, $rootScope, Environment, authentication, QueueManager) {

      function addfiles(foldersToCheckForUpdates, aggregatedRecentlyChangedFiles, onSuccess, loaderStartFrom) {

        loaderStartFrom = loaderStartFrom || 1;
        var addFilesToQueueIfNew = function (folderPath) {
          var fileListDeferred = new $.Deferred();
          s3directoryService.getContentListOfTenantFolder(folderPath).then(function (fileList) {
            fileListDeferred.notify();
            var recentlyChangedFiles = _.filter(fileList, function (file) {
              var lastUpdateString = localStorage.getItem("last-time-updated:" + authentication.getTenant() + file.relativeTenantPath);
              var isUpdated = false;
              if (lastUpdateString !== undefined && lastUpdateString !== null) {
                var lastUpdate = new Date(lastUpdateString);
                if (file.lastModified < lastUpdate) {
                  isUpdated = true;
                }
              } else {
                isUpdated = true;
              }
              return isUpdated;
            });

            aggregatedRecentlyChangedFiles.push.apply(aggregatedRecentlyChangedFiles, recentlyChangedFiles);
            fileListDeferred.resolve();
          }, function () {
            fileListDeferred.reject();
          });

          return fileListDeferred;
        };

        var deferredFolderListResults = [];
        _.each(foldersToCheckForUpdates, function (folderPath) {
          var deferredList = addFilesToQueueIfNew(folderPath);
          deferredFolderListResults.push(deferredList);
        });

        $.when.apply(null, deferredFolderListResults).done(function () {
          if (aggregatedRecentlyChangedFiles.length > 0) {
            $rootScope.progressBarStatus = loaderStartFrom;
            var fractionCalc = 100 - loaderStartFrom;
            var downloadDeferredStatus = s3directoryService.downloadListOfFiles(aggregatedRecentlyChangedFiles);
            var fractionOfDownloadProgress = fractionCalc * (1 / aggregatedRecentlyChangedFiles.length);
            downloadDeferredStatus.progress(function () {
              $rootScope.progressBarStatus += fractionOfDownloadProgress;
              $timeout(function () {
                if (!$rootScope.$$phase) {
                  $rootScope.$digest();
                }
              });
            }).done(function () {
                  for (var index = 0; index < aggregatedRecentlyChangedFiles.length; index++) {
                    var fileInfo = aggregatedRecentlyChangedFiles[index];
                    localStorage.setItem("last-time-updated:" + authentication.getTenant() + fileInfo.relativeTenantPath, fileInfo.lastModified);
                  }
                  setTimeout(function () {
                    //All Setup, starting the Queue Manager...
                    QueueManager.connectionCheck();
                    //And Closing the Loader...
                    $rootScope.loading = false;
                    $rootScope.progressBarStatus = null;
                    onSuccess();
                  }, 1000);
                }).fail(function () {
                  $rootScope.progressBarStatus = 1;
                  $rootScope.openingCatalogId = null;
                  $timeout(function () {
                    $rootScope.loading = false;
                    $rootScope.progressBarStatus = null;
                    $rootScope.$broadcast('event:connection-lost');
                  }, 1000);

                });
          } else {
            $rootScope.progressBarStatus = loaderStartFrom;
            var fractionOfDownloadProgress = 100 - loaderStartFrom;
            //catalog.completeBar() is temporal solution until we
            //can handler the .progress() without notify()
            var completeBar = catalog.completeBar();
            completeBar.progress(function () {
              $rootScope.progressBarStatus += fractionOfDownloadProgress;
              setTimeout(function () {
                //All Setup, starting the Queue Manager...
                QueueManager.connectionCheck();
                //And Closing the Loader...
                $rootScope.loading = false;
                $rootScope.progressBarStatus = null;
                onSuccess();
              }, 1000);
            });
          }
        });
      }// End addFiles()

      return {
        syncApplication: function (onSuccess) {
          //All Setup, starting the Queue Manager...
          //OfflineManager.nuke();
          //We need send the local info before load info from the CAPI
          QueueManager.connectionCheck();
          //Syncing Promo Codes, this lasts for ~500ms so there's no need to add it to the
          //progressStatus Queue, adding to localStorage too (that's why it's outside of
          // Environment.isIOS
          catalog.savePromoCodes();
          //Validations...
          catalog.persistValidations();
          //Same for Custosmers...
          customer.saveCustomers();
          //Same for Shipment Methods...
          catalog.saveShipmentMethods();
          //Same for Customer Tiers...
          catalog.saveCustomerTiers();
          //We need to save all the ProductStyle into assortment
          //until we have internet connection
          productStyles.createUpdateProductSyleList();
          //We need the same with Products into assortment
          assortment.createUpdateProdutsList();

          //Now let's Syncing All AllAssortments Data...
          assortment.saveAssortments().then(function (assortments) {
            assortment.createDeletionList();

            //Syncing All Orders Data on both Webkit and DOM too, not a biggie...
            order.saveAllOrdersOffline().then(function (orders) {
              order.createSendMailList();
              order.getOrderStyles();
              if (Environment.isIOS) {
                //Save all Product Styles...
                catalog.syncCatalogProductStyle();
                //Saving Master Catalog Image Files...
                catalog.saveMasterCatalogImageFiles();
                //40% of the Load Time is for Orders
                var fractionOfDownloadProgress = 30 * (1 / orders.data.length);
                $rootScope.progressBarStatus = fractionOfDownloadProgress;
                var orderSyncDeferred = order.syncOrdersData();
                orderSyncDeferred.progress(function () {
                  $rootScope.progressBarStatus += fractionOfDownloadProgress;
                  $timeout(function () {
                    if (!$rootScope.$$phase) {
                      $rootScope.$digest();
                    }
                  });
                }).done(function () {
                      //20% of the Load Time is for Orders, and we were on 30%, so 20 + 30 = 50, look at addFiles...
                      var fractionCalc = 30;
                      $rootScope.progressBarStatus = 30;
                      var fractionOfDownloadProgress = fractionCalc * (1 / assortments.data.length);
                      //$rootScope.progressBarStatus = fractionOfDownloadProgress;
                      var assortmentSyncDeferred = assortment.syncAssortmentsData();
                      assortmentSyncDeferred.progress(function () {
                        $rootScope.progressBarStatus += fractionOfDownloadProgress;
                        $timeout(function () {
                          if (!$rootScope.$$phase) {
                            $rootScope.$digest();
                          }
                        });

                      }).done(function () {
                            //30% of the Load Time is for load all the Products Styles into each Catalog
                            var fractionCalc = 0.10;
                            $rootScope.progressBarStatus = 40;
                            var fractionOfDownloadProgress = fractionCalc * (1 / catalogs.length);
                            var catalogSyncDeferred = catalog.syncCatalogData();
                            catalogSyncDeferred.progress(function () {
                              $rootScope.progressBarStatus += fractionOfDownloadProgress;
                              $timeout(function () {
                                if (!$rootScope.$$phase) {
                                  $rootScope.$digest();
                                }
                              });
                            }).done(function () {
                                  $timeout(function () {
                                    // Once the Orders, Assortments and Catalogs are done, Loading Files...
                                    // $rootScope.foldersCatalogToCheckForUpdates & $rootScope.foldersCatalogToCheckForUpdates = comes from catalog.syncCatalogData()
                                    var foldersToCheckForUpdates = [$rootScope.foldersCatalogToCheckForUpdates, "/Templates", "/Widget_Definitions", "/Styles"];
                                    var aggregatedRecentlyChangedFiles = $rootScope.aggregatedRecentlyCatalogChangedFiles;
                                    //Sending the las param as 80 so it can start at that poing counting what's left on de
                                    //progressBar
                                    addfiles(foldersToCheckForUpdates, aggregatedRecentlyChangedFiles, onSuccess, 80);
                                  }, 1000);
                                }).fail();//Catalogs
                          }).fail();//Assortment
                    }).fail();// Order
              } else {
                onSuccess();
              }
            });

          });//save assortment
        },
        // Handler some error on Sync progress
        syncError: function () {
          $rootScope.progressBarStatus = 1;
          $rootScope.openingCatalogId = null;
          $timeout(function () {
            $rootScope.loading = false;
            $rootScope.progressBarStatus = null;
            $rootScope.$broadcast('event:connection-lost');
          }, 1000);
        },

        syncCatalog: function (catalogId, onSuccess) {
          if (Environment.isIOS) {
            $rootScope.loading = true;
            catalog.getMasterCatalog(catalogId).then(function (catalogInfo) {
              catalog.getMasterCatalogs().then(function (data) {

                $rootScope.progressBarStatus = 1;
                var catalogName = _.findWhere(data, {id: catalogId}).name.replace(/ /g, "_");
                var foldersToCheckForUpdates = [
                  "/Catalogs/" + catalogName
                ];
                catalog.getProductStyleImages(catalogId).then(function (productStyles) {
                  var aggregatedRecentlyChangedFiles = [];
                  for (var index = 0; index < productStyles.length; index++) {
                    var style = productStyles[index];
                    var imageUrl = style.links.image;
                    var fileName = imageUrl.slice(imageUrl.lastIndexOf('/') + 1, imageUrl.length);
                    var relativePath = "/Products/" + fileName;
                    var lastUpdateString = localStorage.getItem("last-time-updated:" + relativePath);
                    var isUpdated = false;

                    if (lastUpdateString !== undefined && lastUpdateString !== null) {
                      var lastUpdate = new Date(lastUpdateString);
                      if (style.lastModified < lastUpdate) {
                        isUpdated = true;
                      }
                    } else {
                      isUpdated = true;
                    }
                    if (isUpdated) {
                      aggregatedRecentlyChangedFiles.push({name: fileName, lastModified: style.lastModified, relativeTenantPath: relativePath});
                    }
                  }
                  addfiles(foldersToCheckForUpdates, aggregatedRecentlyChangedFiles, onSuccess);
                });
              });
            });
          } else {
            onSuccess();
          }
        }
      };
    });
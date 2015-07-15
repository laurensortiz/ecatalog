'use strict';

angular.module('conductivEcatalogApp').factory('catalog', function ($http, $location, authentication, assortment, httpCapi, OfflineManager, Environment, SyncManager, $q, s3directoryService, $rootScope, $timeout, productStyles) {
    //All The Entity Types...
    var ENTITY_TYPE = 'Catalog',
        ENTITY_TYPE_MASTER = 'Catalog_Master',
        ENTITY_TYPE_PAGES = 'Catalog_Pages',
        ENTITY_TYPE_PAGE = 'Catalog_Page';

    var service = {};

    var fetchCatalogsFromServer = function () {
        var promisedCatalogList = $http({
            method: "GET",
            url: httpCapi.generateBaseApiUrl() + "/master-catalogs",
            headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
                var foundCatalogs = response.data;
                //Alphabetizing Master Catalog List
                var regexNoSymbols = /[^\w\s]/gi;
                foundCatalogs.sort(function (catalog1, catalog2) {
                    //removing special chars to treat "(A - Skate) Charcoal" as "A Skate Charcoal"
                    var catalog1NoSymbols = catalog2.name.replace(regexNoSymbols, ''), catalog2NoSymbols = catalog2.name.replace(regexNoSymbols, '');
                    if (catalog1NoSymbols < catalog2NoSymbols)
                        return -1;
                    if (catalog1NoSymbols > catalog2NoSymbols)
                        return 1;
                    return 0;
                });

                return foundCatalogs;
            });
        return promisedCatalogList;
    };

    service.getMasterCatalogs = function () {
        return SyncManager.fetch(fetchCatalogsFromServer, ENTITY_TYPE);
    }

    service.resolveRemoteUrls = function (catalogs) {
        _.each(catalogs, function (thisCatalog) {
            httpCapi.getFileResource(thisCatalog.links.image).then(function (resolvedURL) {
                thisCatalog.links.image = resolvedURL;
            })
        });
        return catalogs;
    }

    service.saveMasterCatalogImageFiles = function () {
        var defer = $q.defer();
        service.getMasterCatalogs().then(function (catalogs) {
            var indexCatalogs = 0;
            _.each(catalogs, function (catalog, index) {
                var remotePath = catalog.links.image;
                httpCapi.getFileResource(remotePath).then(function (filePath) {
                    SaveLocalFile(remotePath, filePath, function () {
                        indexCatalogs++;
                        if (indexCatalogs === catalogs.length) {
                            defer.resolve();
                        }
                    }, function () {
                        if (indexCatalogs === catalogs.length) {
                            defer.resolve();
                        }
                    });
                })
            });
        });
        return defer.promise;
    }


    service.persistCatalogsListOffline = function () {
        return SyncManager.save(fetchCatalogsFromServer, ENTITY_TYPE);
    }

    //SyncManager.registerSync(service.persistCatalogsListOffline);

    service.getCustomCatalogs = function () {
        var promise = $http({
            method: "GET",
            url: httpCapi.generateBaseApiUrl() + "/custom-catalogs",
            headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {

                return response.data;
                ;
            });
        return promise;
    }

    var fetchMasterCatalogFromServer = function (catalogId) {
        var promise = $http({
            method: "GET",
            url: httpCapi.generateBaseApiUrl() + "/" + "master-catalogs" + "/" + catalogId,
            headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
                var catalog = response.data;
                var folderName = catalog.name.replace(/ /g, "_");
                catalog.rootCatalogPath = httpCapi.generateFilesUrl() + "/" + sessionStorage['tenant'] + "/Catalogs/" + folderName;

                return catalog;
            });
        return promise;
    };


    service.getMasterCatalog = function (catalogId) {
        return SyncManager.fetch(function () {
            return fetchMasterCatalogFromServer(catalogId)
        }, ENTITY_TYPE_MASTER, {id: catalogId});
    };

    service.persistMasterCatalogOffline = function (catalogId) {
        return SyncManager.save(function () {
            return fetchMasterCatalogFromServer(catalogId)
        }, ENTITY_TYPE_MASTER, {id: catalogId});
    };

    var fetchMasterCatalogPagesFromServer = function (catalogId) {
        var promisedPages = new $.Deferred();
        service.getMasterCatalog(catalogId).then(function (catalog) {
            $http({
                method: "GET",
                url: httpCapi.generateBaseApiUrl() + "/" + "master-catalogs" + "/" + catalogId + "/pages?expand=self",
                headers: httpCapi.generateCommonAPIHeaders()
            }).then(function (response) {
                    var pages = response.data;
                    var pageIndex = 0;
                    var enrichPages = function () {
                        var page = pages[pageIndex];
                        page.thumbnail = catalog.rootCatalogPath + "/Thumbnails/page" + page.masterCatalogPageNumber + ".jpg";

                        page.rootCatalogPath = catalog.rootCatalogPath;

                        httpCapi.getFileResource(page.links.template).done(function (resolvedPath) {

                            page.links.redirectedTemplate = resolvedPath;

                            pageIndex++;

                            if (pageIndex < pages.length) {
                                enrichPages();
                            } else {
                                promisedPages.resolve(pages);
                            }
                        });
                    }
                    if (pages.length > 0) {
                        enrichPages();
                    }
                });
        });
        return promisedPages;
    };

    service.getMasterCatalogPages = function (catalogId) {
        return SyncManager.fetch(function () {
            return fetchMasterCatalogPagesFromServer(catalogId)
        }, ENTITY_TYPE_PAGES, {id: catalogId});
    };

    service.persistMasterCatalogPagesListOffline = function (catalogId) {
        return SyncManager.save(function () {
            return fetchMasterCatalogPagesFromServer(catalogId)
        }, ENTITY_TYPE_PAGES, {id: catalogId});
    };
    //END TODO

    var fetchMasterCatalogPage = function (masterCatalogId, pageId) {
        var promisedMasterCatalogDetails = new $.Deferred();
        var rootCatalogPath;
        var catalog;

        service.getMasterCatalog(masterCatalogId).then(function (catalogData) {
            catalog = catalogData;

            service.getMasterCatalogPages(masterCatalogId).then(function (pageStubs) {
                promisedMasterCatalogDetails.resolve();
            });

        });
        var promisedPageDetails = new $.Deferred();
        promisedMasterCatalogDetails.done(function () {
            $http({
                method: "GET",
                url: httpCapi.generateBaseApiUrl() + "/" + "master-catalogs" + "/" + masterCatalogId + "/pages/" + pageId,
                headers: httpCapi.generateCommonAPIHeaders()
            }).then(function (response) {
                    var page = response.data;

                    page.thumbnail = catalog.rootCatalogPath + "/Thumbnails/page" + page.masterCatalogPageNumber + ".jpg";

                    page.rootCatalogPath = catalog.rootCatalogPath;

                    httpCapi.getFileResource(page.links.template).done(function (resolvedPath) {

                        page.links.redirectedTemplate = resolvedPath;
                        promisedPageDetails.resolve(page);
                    });
                });
        });

        return promisedPageDetails;
    }

    service.getPageWidget = function (page, domId) {
        return _.find(page.widgets, function (widget) {
            if (widget.domId == domId) {
                return widget;
            }
        });
    }

    service.getMasterCatalogPage = function (masterCatalogId, pageId) {
        return SyncManager.fetch(function () {
            return fetchMasterCatalogPage(masterCatalogId, pageId)
        }, ENTITY_TYPE_PAGE, {id: masterCatalogId + pageId});
    };

    service.persistMasterCatalogPageOffline = function (masterCatalogId, pageId) {
        return SyncManager.save(function () {
            return fetchMasterCatalogPage(masterCatalogId, pageId)
        }, ENTITY_TYPE_PAGE, {id: masterCatalogId + pageId});
    };


    var fetchMasterCatalogProductsFromServer = function (catalogId) {
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: httpCapi.generateBaseApiUrl() + "/master-catalogs/" + catalogId + "/product-styles",
            headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
                //So we want to reuse all the product Styles that we already downloaded.
                //First, we get the IDS of the Product Styles related to a specific Master Catalog
                var masterCatalogProductStyleIds = _.pluck(response.data, 'id');

                //This the array we are going to return;
                var masterCatalogProductStyles = [];

                //We need the ProductStyle List that we already saved...
                productStyles.getAllProductStyles().then(function (productStylesList) {
                    _.each(masterCatalogProductStyleIds, function (masterCatalogProductStyleId) {
                        masterCatalogProductStyles.push(_.findWhere(productStylesList, {id: masterCatalogProductStyleId}));
                    });
                    deferred.resolve(masterCatalogProductStyles);
                });


            });
        return deferred.promise;
    }


    service.fetchAllInCatalog = function (catalogId) {
        return SyncManager.fetch(function () {
            return fetchMasterCatalogProductsFromServer(catalogId)
        }, ENTITY_TYPE, {id: catalogId});
    };

    service.persistAllInCatalogOffline = function (catalogId) {
        return SyncManager.save(function () {
            return fetchMasterCatalogProductsFromServer(catalogId)
        }, ENTITY_TYPE, {id: catalogId});
    };

    service.getProduct = function (productId) {
        var promise = $http({
            method: "GET",
            url: httpCapi.generateBaseApiUrl() + "/" + "product-styles" + "/" + productId,
            headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
                return response.data;
            });
        return promise;
    }

    service.getAssortmentProductStyle = function (assortmentId, productId) {
        var promise = $http({
            method: "GET",
            url: httpCapi.generateBaseApiUrl() + "/" + "assortments" + "/" + assortmentId + "/product-styles/" + productId,
            headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
                return response;
            });
        return promise;
    }

    service.saveAnnotation = function (assortmentId, productId, text) {

        var promise = $http({
            method: "PUT",
            data: {
                'note': text
            },
            url: httpCapi.generateBaseApiUrl() + "/" + "assortments/" + assortmentId + "/product-styles/" + productId,
            headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {

                return response.data;
            });
        return promise;
    }

    service.getMasterCatalogPagesDetails = function (masterCatalogId) {
        var catalog;
        var rootCatalogPath;

        var promisedPageStubs = new $.Deferred();

        service.getMasterCatalog(masterCatalogId).then(function (catalogData) {
            service.getMasterCatalogs().then(function (data) {
                catalog = catalogData;

                var folderName = _.findWhere(data, {id: masterCatalogId}).name.replace(/ /g, "_");
                rootCatalogPath = httpCapi.generateFilesUrl() + "/" + sessionStorage['tenant'] + "/Catalogs/" + folderName;

                service.getMasterCatalogPages(masterCatalogId).then(function (pageStubs) {
                    promisedPageStubs.resolve(pageStubs);
                });
            });
        });

        //need to refactor towards angular promise impl.
        var promisedPageDetails = new $.Deferred();

        promisedPageStubs.then(function (pageStubs) {
            var pagesToAdd = [];
            var sortedSlides = _.sortBy(pageStubs, function (page) {
                return page.masterCatalogPageNumber;
            });

            //Persisting Master Catalog Pages...
            var slideIds = _.pluck(sortedSlides, 'id');
            var masterCatalogPageOfflinePersisted = localStorage.getItem("masterCatalogPageOfflinePersisted");

            if (!masterCatalogPageOfflinePersisted) {
                _.each(slideIds, function (id) {
                    service.persistMasterCatalogPageOffline(masterCatalogId, id);
                });
                localStorage.setItem("masterCatalogPageOfflinePersisted", JSON.stringify(true));
            }

            _.each(sortedSlides, function (pageStub, pageStubIndex) {

                pageStub.dataLoaded = false;
                pageStub.loadPageDetails = function () {
                    var deferredPageObj = new $.Deferred();

                    var callPageService = function (onSuccess, onFailure, timeouts) {
                        //need those timeouts for wait to pages to save on the webkit side...
                        $timeout(function () {
                            if (!timeouts) {
                                timeouts = 0;
                            }
                            service.getMasterCatalogPage(masterCatalogId, pageStub.id).then(onSuccess, onFailure, timeouts);
                        }, 1500);


                    }
                    var onSuccessfulPageService = function (page) {

                        pageStub.dataLoaded = true;
                        _.extend(pageStub, pageStub, page);

                        deferredPageObj.resolve();
                    };

                    var timeouts = 0;
                    var onFailureOfService = function (page) {
                        if (timeouts < 2) {
                            timeouts++;
                            callPageService(onSuccessfulPageService, onFailureOfService, timeouts);
                        } else {
                            deferredPageObj.reject();
                        }
                    };

                    callPageService(onSuccessfulPageService, onFailureOfService, timeouts);

                    return deferredPageObj;
                }
            });
            promisedPageDetails.resolve(sortedSlides);

        });
        return promisedPageDetails;
    };

    service.getProductStyleImages = function (catalogId) {

        var promise = $http({
            method: "GET",
            url: httpCapi.generateBaseApiUrl() + "/master-catalogs/" + catalogId + "/product-styles/images",
            headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
                return response.data;
            });
        return promise;
    }

    service.getProductStyle = function (productId) {
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: httpCapi.generateBaseApiUrl() + "/" + "product-styles/" + productId,
            headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
                deferred.resolve(response.data);
            });
        return deferred.promise;
    }


    service.deleteProductStyleInAssortment = function (productId, assortmentId) {
        var defer = $q.defer(),
            index;
        var myProductStyle = _.findWhere($rootScope.currentAssortment.myProductStyles, {id: productId});
        var productStyleIndex = $rootScope.findProductStyleIndexById(myProductStyle.id);
        _.each($rootScope.currentAssortment.myProductStyles, function (style) {
            if (style.id == productId) {
                $rootScope.currentAssortment.myProductStyles = _.without($rootScope.currentAssortment.myProductStyles, _.findWhere($rootScope.currentAssortment.myProductStyles, {id: productId}));
            }
            index++;
        });
        $rootScope.productStyles[productStyleIndex].availableOnCurrentAssortment = false;
        $rootScope.$emit('changed-product-styles-assortment-association');
        OfflineManager.save($rootScope.currentAssortment).then(function () {
            defer.resolve(assortment);
        });
        return defer.promise;
    };

    var ENTITY_TYPE_CUSTOMER_TIERS = 'CustomerTiers';
    var fetchCustomerTiersFromServer = function () {
        var promisedCustomerTiers = $http({
            method: "GET",
            url: httpCapi.generateBaseApiUrl() + "/" + "customer-tiers",
            headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
                return response.data;
            });
        return promisedCustomerTiers;
    };

    service.getCustomerTiers = function () {
        return SyncManager.fetch(fetchCustomerTiersFromServer, ENTITY_TYPE_CUSTOMER_TIERS);
    }

    service.saveCustomerTiers = function () {
        return SyncManager.save(fetchCustomerTiersFromServer, ENTITY_TYPE_CUSTOMER_TIERS);
    };

    service.setCustomerTier = function (tierId, description, assortmentId) {
        var promise = $http({
            method: "POST",
            url: httpCapi.generateBaseApiUrl() + "/" + "assortments/" + assortmentId + "/customer-tier?customerTierId=" + tierId,
            headers: httpCapi.generateCommonAPIHeaders(),
            data: {}
        }).then(function (response) {
                return response.data;
            });
        return promise;
    }

    var ENTITY_TYPE_VALIDATION = 'Validation';
    var fetchValidations = function () {
        var promise = $http({
            method: "GET",
            url: httpCapi.generateBaseApiUrl() + "/" + "validations",
            headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
                return response.data;
            });
        return promise;
    };

    service.getValidations = function () {
        return SyncManager.fetch(fetchValidations, ENTITY_TYPE_VALIDATION);
    };

    service.persistValidations = function () {
        return SyncManager.save(fetchValidations, ENTITY_TYPE_VALIDATION);
    };

    var ENTITY_TYPE_SHIPMENT_METHODS = 'Shipment_Methods';
    var fetchShipmentMethods = function () {
        var promise = $http({
            method: "GET",
            url: httpCapi.generateBaseApiUrl() + "/shipment-methods",
            headers: httpCapi.generateCommonAPIHeaders()
        }).then(function (response) {
                return response.data;
            });
        return promise;
    };

    service.saveShipmentMethods = function () {
        return SyncManager.save(fetchShipmentMethods, ENTITY_TYPE_SHIPMENT_METHODS);
    };

    service.getShipmentMethods = function () {
        return SyncManager.fetch(fetchShipmentMethods, ENTITY_TYPE_SHIPMENT_METHODS);
    }

    service.saveShipmentMethods = function () {
        return SyncManager.save(fetchShipmentMethods, ENTITY_TYPE_SHIPMENT_METHODS);
    };

    var fetchPromocodes = function () {
            var promise = $http({
                method: "GET",
                url: httpCapi.generateBaseApiUrl() + "/product-promos",
                headers: httpCapi.generateCommonAPIHeaders()
            }).then(function (response) {
                    return response.data;
                });
            return promise;
        }
        , ENTITY_PROMO = 'PromoCodes';

    service.getPromocodes = function () {
        return SyncManager.fetch(fetchPromocodes, ENTITY_PROMO);
    }

    service.savePromoCodes = function () {
        return SyncManager.save(fetchPromocodes, ENTITY_PROMO);
    }

    service.sendEmails = function (orderId, format, subject, recipients) {
        var promise = $http({
            method: "POST",
            data: {
                'orderId': orderId,
                'format': format,
                'subject': subject,
                'recipients': recipients,
                'message': subject
            },
            url: httpCapi.generateBaseApiUrl() + "/actions/send-order-notification",
            headers: httpCapi.generateCommonAPIHeaders(),
            timeout: 60000
        }).then(function (response) {
                return response;
            }, function (error) {
                if ($rootScope.loading) {
                    $rootScope.loading = false;
                }
                console.log(error);
                console.log(orderId);
                console.log(recipients);
                $rootScope.connectionStatusError = true;
                $location.path("/home/menu");
            });
        return promise;

    }

    service.isDownloaded = function (catalogId) {
        var found = localStorage.getItem("catalog-downloaded:" + catalogId);
        if (found === undefined || found === null) {
            return false;
        } else {
            return found;
        }
    }

    service.markDownloaded = function (catalogId) {
        localStorage.setItem("catalog-downloaded:" + catalogId, true);
    }
    //Temporal function - is just for complete 100% of the bar
    //when all products are all ready downloaded
    //You can see it into fileSync.js
    service.completeBar = function () {
        var deferred = new $.Deferred();
        deferred.notify();
        return deferred;
    }

    service.syncCatalogData = function () {
        var deferred = new $.Deferred();

        service.getMasterCatalogs().then(function (response) {

            var catalogs = response
                , catalogLength = catalogs.length - 1
                , currentCatalogIndex = 0;

            _.each(catalogs, function (catalog) {
                var catalogName = catalog.name.replace(/ /g, "_");
                $rootScope.foldersCatalogToCheckForUpdates = [
                    "/Catalogs/" + catalogName
                ];
                service.getProductStyleImages(catalog.id).then(function (productStyles) {
                    $rootScope.aggregatedRecentlyCatalogChangedFiles = [];

                    for (var index = 0; index < productStyles.length; index++) {

                        var style = productStyles[index];
                        var imageUrl = style.links.image;
                        var fileName = imageUrl.slice(imageUrl.lastIndexOf('/') + 1, imageUrl.length);
                        var relativePath = "/Products/" + fileName;
                        var lastUpdateString = localStorage.getItem("last-time-updated:" + authentication.getTenant() + relativePath);

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
                            $rootScope.aggregatedRecentlyCatalogChangedFiles.push({name: fileName, lastModified: style.lastModified, relativeTenantPath: relativePath});
                        }
                        deferred.notify();
                    }
                    deferred.resolve();
                });//GET Prodcuts Style

                currentCatalogIndex++;
                //deferred.notify();

                if (currentCatalogIndex === catalogLength) {
                    //deferred.resolve();
                }
            });// end each
            //deferred.notify();
        });

        return deferred;
    }


    //this function Syncs the assortment list and each assortment
    service.syncCatalogProductStyle = function () {
        var deferred = new $.Deferred();
        //We need to sync the assortment list first...
        //then we are going to go thru each assortment and get the whole object...
        service.getMasterCatalogs().then(function (response) {

            var catalogs = response
                , catalogsLength = catalogs.length - 1
                , currentCatalogIndex = 0;

            _.each(catalogs, function (catalog) {
                service.persistAllInCatalogOffline(catalog.id).then(function (data) {

                    currentCatalogIndex++;
                    deferred.notify();
                    //resolving when all the assortments are saved...
                    if (currentCatalogIndex === catalogsLength) {
                        deferred.resolve();
                    }
                });
            });
        });
        return deferred;
    }

    SyncManager.registerSync(service.persistValidations);

    return service;

});

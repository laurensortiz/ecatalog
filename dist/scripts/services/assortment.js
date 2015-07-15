'use strict';

angular.module('conductivEcatalogApp')
    .factory('assortment', function ($http, httpCapi, $q, SyncManager, OfflineManager, network, $rootScope) {
        // Public API here
        var service = {};

        var ENTITY_TYPE = 'Assortment';

        var fetchAssortmentList = function () {
            var deferred = $q.defer();
            $http({
                method: "GET",
                url: httpCapi.generateBaseApiUrl() + "/assortments",
                headers: httpCapi.generateCommonAPIHeaders()
            }).then(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        var fetchAssortment = function (id) {
            var deferred = $q.defer();
            var rejectCallback = function () {
                deferred.reject();
            };
            $http({
                method: 'GET',
                url: httpCapi.generateBaseApiUrl() + "/assortments/" + id,
                headers: httpCapi.generateCommonAPIHeaders()
                //Let´s get the all the info of the Assorment
            }).success(function (assortment) {
                    $http({
                        method: 'GET',
                        url: assortment.links.products,
                        headers: httpCapi.generateCommonAPIHeaders()
                        //Let´s get the all the Products of the Assorment
                    }).success(function (allProducts) {
                            assortment.products = allProducts;
                            $http({
                                method: "GET",
                                url: assortment.links["product-styles"] + '/?expand=self,products',
                                headers: httpCapi.generateCommonAPIHeaders()
                                //Let´s get the all the Product Styles of the Assorment
                            }).success(function (styles) {
                                    //Let´s change before the path to local

                                    // Order all products according to size
                                    if (styles !== null && styles !== undefined && styles.length > 0) {
                                        angular.forEach(styles, function (style) {
                                            var products = style.connections.products;

                                            if (products !== null && products !== undefined && products.length > 0) {
                                                products.sort(function (product1, product2) {
                                                    var s1 = 999;
                                                    var s2 = 999;

                                                    for (var i = 0; i < product1.features.length; i++) {
                                                        if (product1.features[i].type === "SIZE") {
                                                            s1 = parseInt(product1.features[i].sequenceNumber);
                                                            break;
                                                        }
                                                    }

                                                    for (var j = 0; j < product2.features.length; j++) {
                                                        if (product2.features[j].type === "SIZE") {
                                                            s2 = parseInt(product2.features[j].sequenceNumber);
                                                            break;
                                                        }
                                                    }

                                                    if (s1 < s2)
                                                        return -1;
                                                    if (s1 > s2)
                                                        return 1;
                                                    return 0;

                                                });
                                            }
                                        });
                                    }

                                    assortment.myProductStyles = styles;

                                    deferred.resolve(assortment);
                                }).error(rejectCallback);
                        }).error(rejectCallback);
                }).error(rejectCallback);
            return deferred.promise;
        };

        service.getAssortments = function () {
            return SyncManager.fetch(fetchAssortmentList, ENTITY_TYPE);
        };

        service.getAssortment = function (id) {
            return SyncManager.fetch(
                function () {
                    //return fetchAssortment(id)
                },
                ENTITY_TYPE, {id: id}
            );
        };

        service.persist = function (id) {
            var guidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
            //if it's guuid it should not persist.
            /*
            if (!guidRegex.test(id)) {
                return SyncManager.save(
                    function () {
                        return fetchAssortment(id)
                    },
                    ENTITY_TYPE, {id: id }
                );
            } else {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            }
            */
        };

        service.saveAssortments = function () {
            var deferred = $q.defer();
            OfflineManager.find('Assortment').then(function(assortmentList){
                //This prevents the re-save after you logout and login again
                if (!assortmentList || !assortmentList.data) {
                    SyncManager.save(fetchAssortmentList, ENTITY_TYPE).then(function(assortmentList){
                        deferred.resolve(assortmentList);
                    });
                }else{
                    deferred.resolve(assortmentList);
                }
            });
            return deferred.promise;
        };

        service.saveAssortmentsOffline = function(assortmentList){
            var deferred = $q.defer();
            OfflineManager.save(assortmentList).then(function(response){
                //console.log(response)
                service.saveAssortments().then(function(){
                    deferred.resolve(response);
                })
            })
            return deferred.promise;
        }

        service.getAllAssortmentsOnline = function () {
            var promise = $http({
                method: "GET",
                url: httpCapi.generateBaseApiUrl() + "/assortments",
                headers: httpCapi.generateCommonAPIHeaders()
            }).then(function (response) {
                    return response;
                });
            return promise;
        }

        service.createNewAssortment = function (description) {
            var promise = $http({
                method: "POST",
                url: httpCapi.generateBaseApiUrl() + "/assortments",
                data: {"description": description},
                headers: httpCapi.generateCommonAPIHeaders()
            }).then(function (response) {
                    return response.data;
                });
            return promise;
        }

        //This function saves a Assortment in an asynchornous way.
        service.createNewAssortmentAsync = function (assortmentAsyncObj) {
            var promise = $http({
                method: "POST",
                url: httpCapi.generateBaseApiUrl() + "/assortments?async=false",
                data: assortmentAsyncObj,
                headers: httpCapi.generateCommonAPIHeaders()
            }).then(function (response) {
                    return response;
                }, function (reason) {
                    return reason;
                });
            return promise;
        }

        service.linkCustomer = function (assortmentId, customer) {
            var promise = $http({
                method: "POST",
                url: httpCapi.generateBaseApiUrl() + "/assortments/" + assortmentId + "/customer?customerId=" + customer.id,
                headers: httpCapi.generateCommonAPIHeaders()
            }).then(function (response) {
                    return response.data;
                });
            return promise;
        }

        service.deleteCustomerLinking = function (assortmentId) {
            var promise = $http({
                method: "DELETE",
                url: httpCapi.generateBaseApiUrl() + "/assortments/" + assortmentId + "/customer",
                headers: httpCapi.generateCommonAPIHeaders(),
                data: {}
            }).then(function (response) {
                    return true;
                }, function (reason) {
                    return false;
                });
            return promise;
        }

        service.renameAssortment = function (currentAssortment, newDescription) {

            var defer = $q.defer();
            OfflineManager.find('Assortment|' + currentAssortment.id).then(function (assortment) {
                assortment.description = newDescription;
                OfflineManager.save(assortment).then(function () {
                    //Updating the Assorment List
                    service.getAssortments().then(function (assortments) {
                        var indexToChange = _.indexOf(assortments.data,
                            _.findWhere(assortments.data, {id: assortment.id}));
                        assortments.data[indexToChange] = assortment;
                        OfflineManager.save(assortments).then(function () {
                            defer.resolve(assortment);
                        });
                    });
                });
            });
            return defer.promise;
        };

        service.renameGroup = function (currentAssortment, newGroup) {
            var defer = $q.defer();
            OfflineManager.find('Assortment|' + currentAssortment.id).then(function (assortment) {
                assortment.group = newGroup;

                OfflineManager.save(assortment).then(function () {
                    //Updating the Assorment List
                    service.getAssortments().then(function (assortments) {
                        var indexToChange = _.indexOf(assortments.data,
                            _.findWhere(assortments.data, {id: assortment.id}));
                        assortments.data[indexToChange] = assortment;
                        OfflineManager.save(assortments).then(function () {
                            defer.resolve(assortment);
                        });

                    });
                });
            });


            return defer.promise;
        };

        service.renameAssortmentCAPI = function (assortmentId, newDescription) {
            var promise = $http({
                method: "PUT",
                url: httpCapi.generateBaseApiUrl() + "/assortments/" + assortmentId,
                data: {"description": newDescription},
                headers: httpCapi.generateCommonAPIHeaders()
            }).then(function (response) {
                    return response.data;
                });
            return promise;
        }

        service.updateAssortment = function (assortmentId, newDescription) {
            var promise = $http({
                method: "PUT",
                url: httpCapi.generateBaseApiUrl() + "/assortments/" + assortmentId,
                data: {"description": newDescription},
                headers: httpCapi.generateCommonAPIHeaders()
            }).then(function (response) {
                    return response.data;
                });
            return promise;
        }

        service.deleteAssortment = function (assortmentId) {
            var defer = $q.defer();
            service.getAssortment(assortmentId).then(function (assortment) {
              //Adding The Id To ASSORTMENT_DELETION_LIST, so we can then go
              //thru this list and delete them on CAPI side...
              OfflineManager.find('ASSORTMENT_DELETION_LIST').then(function (deletionList) {
                deletionList.data.push(assortment);
                OfflineManager.save(deletionList);
              });
                OfflineManager.removeByKey('Assortment|' + assortment.id).then(function () {
                    service.getAssortments().then(function (assortments) {
                        var indexToDelete = _.indexOf(assortments.data,
                            _.findWhere(assortments.data, {id: assortment.id}));
                        assortments.data = _.without(assortments.data, assortments.data[indexToDelete]);
                        OfflineManager.save(assortments).then(function () {
                            defer.resolve(assortment);
                        });
                    });
                });
            });
            return defer.promise;
        }

        service.deleteCapi = function (assortmentId) {
            var promise = $http({
                method: "DELETE",
                url: httpCapi.generateBaseApiUrl() + "/assortments/" + assortmentId,
                headers: httpCapi.generateCommonAPIHeaders(),
                data: {}
            }).then(function (response) {
                    return true;
                }, function (reason) {
                    return false;
                });
            return promise;
        }

        service.createDeletionList = function () {
            var deletionList = {key: 'ASSORTMENT_DELETION_LIST', data: []};
            OfflineManager.save(deletionList);
        }

        service.guid = function () {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        var s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        };

        service.duplicateAssortment = function (group, assortmentId, duplicateQuantities) {
            var defer = $q.defer();
            service.getAssortment(assortmentId).then(function (assortment) {
                console.log(assortment)
                console.log(group)
                var duplicatedAssortment = _.clone(assortment);

                duplicatedAssortment.lastUpdatedTime = moment().format('YYYY-MM-DD hh:mm:ss');
                duplicatedAssortment.group = group;
                duplicatedAssortment.id = service.guid();
                duplicatedAssortment.key = 'Assortment|' + duplicatedAssortment.id;
                duplicatedAssortment.products = assortment.products;

                if(!duplicateQuantities) {
                    //Removing all the "Quantities"
                    duplicatedAssortment.products = [];
                    _.each(duplicatedAssortment.productStyles, function (productStyle) {
                        _.each(productStyle.products, function (product) {
                            product.quantity = 0;
                        });
                    });
                }

                OfflineManager.save(duplicatedAssortment).then(function () {
                    service.getAssortments().then(function (infoAssorment) {
                        infoAssorment.key = 'Assortment';
                        infoAssorment.data.push(duplicatedAssortment);
                        OfflineManager.save(infoAssorment).then(function () {
                            defer.resolve();
                            //$rootScope.$broadcast('event:network-connectivity-assortments', true);
                        });
                    });
                });
            });
            return defer.promise;
        };

        service.setProductQuantity = function (assortmentId, product, quantity) {
            var promise = $http({
                method: "PUT",
                url: httpCapi.generateBaseApiUrl() + "/assortments/" + assortmentId + "/products/" + product.productId,
                data: {"quantity": quantity},
                headers: httpCapi.generateCommonAPIHeaders()
            }).then(function (response) {
                    return response.data;
                });
            return promise;
        }


        service.createUpdateProdutsList = function () {
            var updateProductList = {key: 'ASSORTMENT_UPDATE_PRODUCTS_LIST', data: []};
            OfflineManager.save(updateProductList);
        }

        service.bulkPersistProductQuantities = function (assortmentId, products, successCallback) {
            var defer = $q.defer();
            var data = _.map(products, function (product) {
                return {productId: product.productId, quantity: product.quantity};
            });

            OfflineManager.find('ASSORTMENT_UPDATE_PRODUCTS_LIST').then(function (updateAssortemtProductList) {
                updateAssortemtProductList.data.push({"productData": data, "assortmentId": assortmentId});
                OfflineManager.save(updateAssortemtProductList);
            });

            service.getAssortment(assortmentId).then(function (assortment) {
                _.each(data, function (productInfo) {
                    assortment.products.push(productInfo);
                    assortment.key = 'Assortment|' + assortmentId;
                    assortment.updateProducts = true;
                    OfflineManager.save(assortment);
                });

                OfflineManager.save(assortment).then(function () {
                    defer.resolve();
                });
            });
            return defer.promise;
        }


        service.bulkPersistProductQuantitiesCAPI = function (productData, assortmentId, successCallback) {
            var promise = $http({
                method: "POST",
                url: httpCapi.generateBaseApiUrl() + "/assortments/" + assortmentId + "/products",
                data: productData,
                headers: httpCapi.generateCommonAPIHeaders()
            }).then(function (response) {
                    return true;
                }, function (reason) {
                    return false;
                });
            return promise;
        }


        service.deleteProductQuantity = function (assortmentId, product) {
            var promise = $http({
                method: "DELETE",
                url: httpCapi.generateBaseApiUrl() + "/assortments/" + assortmentId + "/products/" + product.productId,
                headers: httpCapi.generateCommonAPIHeaders(),
                data: {}
            }).then(function (response) {
                    return true;
                }, function (reason) {
                    return false;
                });
            return promise;
        }

        //this function Syncs the assortment list and each assortment
        service.syncAssortmentsData = function () {
            var deferred = new $.Deferred();
            //We need to sync the assortment list first...
            //then we are going to go thru each assortment and get the whole object...
            service.getAssortments().then(function (response) {
                var assortments = response.data
                    , assortmentsLength = assortments.length
                    , currentAssortmentIndex = 0;

                if (assortmentsLength > 0) {
                    _.each(assortments, function (assortment) {
                        //service.persist(assortment.id).then(function (data) {
                            currentAssortmentIndex++;
                            deferred.notify();
                            //resolving when all the assortments are saved...
                            if (currentAssortmentIndex >= assortmentsLength) {
                                deferred.resolve();
                            }
                        //});
                    });
                } else {
                    deferred.resolve();

                }
            });
            return deferred;
        }
        service.saveNewOfflineAssortment = function(){
            var flag = false;
            var deferred = $q.defer();
            service.getAssortments().then(function (listOfAssortment) {
                _.each(listOfAssortment.data, function(eachAssortment){
                    if($rootScope.currentAssortment.id == eachAssortment.id){
                        flag = true;
                        deferred.resolve(true);
                        //TODO check if assortment has updated
                    }
                });
                if(!flag){
                    //Saving new assortment to eCatalogObjects.Assortment
                    listOfAssortment.data.push($rootScope.currentAssortment);
                    OfflineManager.save(listOfAssortment).then(function () {
                        //Get the new Assortment list and check for the new assortment
                        service.getAssortments().then(function (newListAssortments) {
                            _.each(newListAssortments.data, function(newAssortment){
                                if($rootScope.currentAssortment.id == newAssortment.id){
                                    deferred.resolve(true);
                                }
                            })
                        });
                    });
                }else{
                    deferred.reject(false);
                }
            });
            return deferred.promise;
        }
        return service;
    });

'use strict';

angular.module('conductivEcatalogApp')
    .factory('order', function ($http, httpCapi, SyncManager, $q, productStyles, catalog, OfflineManager, $rootScope, $location, network) {
        // Public API here
        var service = {};
        var ENTITY_TYPE = 'Order';
        var fetchAllOrders = function () {
            var deferred = $q.defer();
            $http({
                method: "GET",
                url: httpCapi.generateBaseApiUrl() + "/orders",
                headers: httpCapi.generateCommonAPIHeaders()
            }).then(function (response) {
                    OfflineManager.find('Order').then(function(offlineOrders){
                        if(offlineOrders){
                            //TODO: Use underscore to reduce the amount of lines
                            _.each(offlineOrders.data, function(eachOrder){
                                if (eachOrder.status){
                                    response.data.push(eachOrder);
                                }
                            })
                        }
                    })
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        var fetchOrder = function (orderId) {
            var deferred = $q.defer();
            var rejectCallback = function () {
                deferred.reject();
            };
            $http({
                method: "GET",
                url: httpCapi.generateBaseApiUrl() + "/orders/" + orderId,
                headers: httpCapi.generateCommonAPIHeaders()
            }).success(function (order) {
                    // We got the order info. Now lets get the ship to address
                    $http({
                        method: "GET",
                        url: order.links.shipToAddress,
                        headers: httpCapi.generateCommonAPIHeaders()
                    }).success(function (postalAddress) {
                            var formattedAddress = postalAddress.address1;
                            if (postalAddress.address2 && postalAddress.address2.trim().length > 0) {
                                formattedAddress = formattedAddress + ', ' + postalAddress.address2;
                            }
                            formattedAddress = formattedAddress + ', ' + postalAddress.city + ', ' + postalAddress.state + ', ' + postalAddress.country + ' ' + postalAddress.postalCode;
                            order.postalAddress = formattedAddress;
                            //Fetch all the products associated with the order
                            $http({
                                method: "GET",
                                url: order.links.products,
                                headers: httpCapi.generateCommonAPIHeaders()
                            }).success(function (allProducts) {
                                    order.products = allProducts;
                                    // Lets get the product styles available on the order
                                    $http({
                                        method: "GET",
                                        url: order.links["product-styles"] + '/?expand=self,products',
                                        headers: httpCapi.generateCommonAPIHeaders()
                                    }).success(function (styles) {
                                            _.each(styles, function (productStyle) {
                                                httpCapi.getFileResource(productStyle.links.image).then(function (resolvedURL) {
                                                    productStyle.links.image = resolvedURL;
                                                });
                                            });
                                            order.productStyles = styles;
                                            deferred.resolve(order);
                                        }).error(rejectCallback);
                                }).error(rejectCallback);
                        }).error(rejectCallback);
                })
                .error(rejectCallback);
            return deferred.promise;
        };

        //Orders Summary
        service.getAllOrders = function () {
            return SyncManager.fetch(fetchAllOrders, ENTITY_TYPE);
        }

        service.saveAllOrdersOffline = function () {
            return SyncManager.save(fetchAllOrders, ENTITY_TYPE);
        }

        service.getAllOrdersOnline = function () {
            var promise = $http({
                method: "GET",
                url: httpCapi.generateBaseApiUrl() + "/orders",
                headers: httpCapi.generateCommonAPIHeaders()
            }).then(function (response) {
                    return response;
            });
            return promise;
        }

        //Single Orders
        service.obtain = function (orderId) {
            return SyncManager.fetch(
                function () {
                    return fetchOrder(orderId)
                },
                ENTITY_TYPE, {id: orderId}
            );
        };
        service.fetchSingleOrder = function(orderId){
            var deferred = $q.defer();
            if(network.canConnect()){
                return fetchOrder(orderId)
            }else{
                service.getAllOrders().then(function(orderList){
                    _.each(orderList.data, function(eachOrder){
                        if(eachOrder.id === orderId){
                            deferred.resolve(eachOrder);
                        }
                    })
                });
            }
            return deferred.promise;
        }
        //Save Single Order
        service.persist = function (orderId) {
            return SyncManager.save(
                function () {
                    return fetchOrder(orderId)
                },
                ENTITY_TYPE, {id: orderId}
            );
        };

        service.guid = function () {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        var s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        };

        //Save Order
        service.saveOrder = function (myOrder) {
	        console.log(myOrder);
            var defer = $q.defer();
            var email = myOrder.email;
            myOrder.id = service.guid();
            myOrder.key = 'Order|' + myOrder.id;
            myOrder.lastUpdatedTime = moment().format('YYYY-MM-DD HH:mm:ss');
            var oldOrder = [];
            oldOrder = angular.copy(myOrder);
            service.getAllOrders().then(function (allOrders) {
                if(network.canConnect()){
                    service.convertOrderToCapi(myOrder).then(function(capiOrder){
                        var orderdefer = $q.defer();
                        orderdefer.promise.then(function(newOrder){
                            //If CAPI's response is slow, and I don;t get and id back, set status to submitted
                            if(newOrder.data.id){
                                oldOrder.id = newOrder.data.id;
                                delete oldOrder.status;
                            }else{
                                oldOrder.status = "submitted";
                            }
                            allOrders.data.push(oldOrder);
                            OfflineManager.save(allOrders).then(function () {
                                defer.resolve();
                            });
                        });
                        service.createNewOrder(capiOrder, email).then(function(newOrder){
                            orderdefer.resolve(newOrder);
                        });

                    });
                }else{ //Offline
                    oldOrder.status = "unsubmitted";
                    allOrders.data.push(oldOrder);
                    OfflineManager.save(allOrders).then(function () {
                        defer.resolve();
                    });
                }
            });
            return defer.promise;
        }
        service.convertOrderToCapi = function(oldOrder){
            var deferredObj = new $.Deferred();
            var orderToConvert = oldOrder;
            _.each(orderToConvert.myProductStyles, function (eachProductStyle) {
                if(!orderToConvert.productStyles){
                    orderToConvert.productStyles = [];
                }
                orderToConvert.productStyles.push({productStyleId: eachProductStyle.id});
                _.each(eachProductStyle.connections.products, function (product) {
                    if (product.quantity > 0) {
                        if(!orderToConvert.orderItems){
                            orderToConvert.orderItems = [];
                        }
                        orderToConvert.orderItems.push({productId: product.id, quantity: product.quantity});
                    }
                });
            });

            delete orderToConvert.key;
            delete orderToConvert.customerName;
            delete orderToConvert.email;
            delete orderToConvert.postalAddress;
            delete orderToConvert.myProductStyles;
            delete orderToConvert.products;
            delete orderToConvert.lastUpdatedTime;
            delete orderToConvert.assortmentId;
            delete orderToConvert.id;
            delete orderToConvert.status;
            deferredObj.resolve(orderToConvert);
            return deferredObj.promise();
        };

        //Save the Order into the CAPI
        service.createNewOrder = function (order, email) {
            var promise = $http({
                method: "POST",
                data: order,
                url: httpCapi.generateBaseApiUrl() + "/orders",
                headers: httpCapi.generateCommonAPIHeaders()
            }).success(function (order) {
                    return service.sendEmailsCAPI(order.id, "Excel", 'PO #' + order.purchaseOrder, email);
                }).error(function(data, status, headers, config) {
                    console.log(data);
                    console.log(status);
                    console.log(headers);
                    console.log(config);
              });
            return promise;
        }

        service.deleteOrder = function (orderId) {
            var defer = $q.defer();
            service.getAllOrders().then(function (orders) {
                _.each(orders.data, function(eachOrder){
                    if (eachOrder.id !== orderId){
                        orders.data.push(eachOrder);
                    }
                });
                OfflineManager.save(orders).then(function () {
                    defer.resolve();
                });
            });
            return defer.promise;
        }

        service.createSendMailList = function () {
            var sendEmailList = {key: 'ORDER_SENDEMAIL_LIST', data: []};
            OfflineManager.save(sendEmailList);
        }
        //TODO: Name should be changed to OrderQueue or similar
        service.sendEmail = function (orderId, format, subject, recipients) {
            var defer = $q.defer();
            OfflineManager.find('ORDER_SENDEMAIL_LIST').then(function (sendEmailList) {
                sendEmailList.data.push({'orderId': orderId, 'format': format, 'subject': subject, 'recipients': recipients});
                sendEmailList.data = _.uniq(sendEmailList.data);
                OfflineManager.save(sendEmailList).then(function () {
                    defer.resolve();
                });
            });
            return defer.promise;
        }

        service.sendEmailsCAPI = function (orderId, format, subject, recipients) {
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
                headers: httpCapi.generateCommonAPIHeaders()
            }).then(function (response) {
                    OfflineManager.find('ORDER_SENDEMAIL_LIST').then(function (sendEmailList) {
                        if(response.status !== 204){
                            //There was an error, add it to ORDER_SENDEMAIL_LIST, if it exists, leave it there, if not add it.
                            var exists = _.findWhere(sendEmailList.data, {orderId: orderId})
                            console.log(exists);
                            if(!exists){
                                sendEmailList.data.push({'orderId': orderId, 'format': format, 'subject': subject, 'recipients': recipients});
                            }
                        }else{
                            //Sent ok, remove from ORDER_SENDERMAIL_LIST
                            sendEmailList.data = _.reject(sendEmailList.data, function(eachEmail){ return orderId === eachEmail.orderId });
                        }
                        OfflineManager.save(sendEmailList);
                    });
                    return response;
            })
            return promise;
        }
        service.getOrderStyles = function(){
            var deferred = $q.defer();
            service.getAllOrders().then(function (orderList) {
                var fullOrders = [];
                var orderdefer = $q.defer();
                orderdefer.promise.then(function(fullOrders){
                    orderList.data = fullOrders;
                    OfflineManager.save(orderList).then(function(response){
                        //console.log(response)
                    });
                });
                var indexOrder = 0;
                _.each(orderList.data, function(eachOrder){
                    fetchOrder(eachOrder.id).then(function(eachOrder){
                        fullOrders.push(eachOrder);
                        if(orderList.data.length === indexOrder+1){
                            orderdefer.resolve(fullOrders);
                        }
                        indexOrder++;
                    });
                });
            })
            return deferred.promise;
        }
        //this function Syncs the order list and each order
        //TODO: Do this only when the orders are really getting synced. This doesnt make any sense!!!
        service.syncOrdersData = function () {
            var deferred = new $.Deferred();
            //We need to sync the order list first...
            //then we are going to go thru each order and get the whole object...
            service.getAllOrdersOnline().then(function (response) {
                  var orders = response.data
                    , ordersLength = orders.length
                    , currentOrderIndex = 0;
                if (orders.length === 0) {
                    deferred.resolve();
                    return deferred;
                }
                _.each(orders, function (eachOrder) {
                    currentOrderIndex++;
                    deferred.notify();
                    //resolving when all the orders are saved...
                    if (currentOrderIndex === ordersLength) {
                        deferred.resolve();
                    }
                });
            })
            return deferred;
        }
        return service;
    });
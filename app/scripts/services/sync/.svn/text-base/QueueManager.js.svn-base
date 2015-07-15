'use strict';

/*
 *
 * QueueManager looks Periodically for the state of
 * Offline Data, and if the application has internet connection,
 * attempts to save the data into de CAPI.
 *
 * The timers are maintained on the Webkit, and are accessed through
 * StopTimedCallback and StartTimedCallback
 *
 *
 * */
angular.module('conductivEcatalogApp').factory('QueueManager', function ($http, $rootScope, $location, $timeout, catalog, productStyles, assortment, order, OfflineManager, network, $q) {

    //We are saving offline Assortments with an GUUID... so we need to know when
    // they are offline or not, if the id is a GUUID, they were created offline.
    var guidRegex = new RegExp("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"),
        ASSORTMENT_TIMER = 'Assortment_Timer',
        ORDER_TIMER = 'Order_Timer',
        CONNECTION_CHECK_TIMER = 'Connection_Check_Timer'

    $rootScope.$on('event:network-connectivity', function (event, canConnect) {
        if (canConnect === true) {
            QueueManager.startOrderQueue();
            SendEmailOrderQueue();
        }
    });
    $rootScope.$on('event:network-connectivity-orders', function (event, canConnect) {
        if (canConnect) {
            QueueManager.startOrderQueue();
            SendEmailOrderQueue();
        }
    });

    function prepareOfflineAssortment(assortmentObj) {
        var capiAsyncJSON = {};
        capiAsyncJSON.customerId = null;
        capiAsyncJSON.description = assortmentObj.description;
        capiAsyncJSON.orderItems = [];
        capiAsyncJSON.productStyles = [];
        _.each(assortmentObj.myProductStyles, function (productStyle) {
            capiAsyncJSON.productStyles.push({productStyleId: productStyle.id});
        });
        _.each(assortmentObj.products, function (product) {
            capiAsyncJSON.orderItems.push({productId: product.productId, quantity: product.quantity});
        });
        return capiAsyncJSON;
    }

    //This function saves an new Assortment to CAPI that has not been saved, (contains an UUID)
    // Taken out from startAssortentQueue() for readability purposes...
    function saveAssortmentUUID(assortmentObj) {
        //A new assortment is created...
        var assortmentAsyncObj = prepareOfflineAssortment(assortmentObj);
        assortment.createNewAssortmentAsync(assortmentAsyncObj)
            .then(function (newAssortment) {
                //And UUID Assortment is deleted from the Assorment List.
                OfflineManager.removeByKey(assortmentObj.key);
                assortment.getAssortments().then(function (infoAssorment) {
                    infoAssorment.key = 'Assortment';
                    //infoAssorment.data.push(newAssortment);
                    //Deleting the assortment
                    var indexToDelete = infoAssorment.data.indexOf(_.findWhere(infoAssorment.data, {id: assortmentObj.id}));
                    infoAssorment.data.splice(indexToDelete, 1);
                    //And save the Assortment List again, with our new guy
                    OfflineManager.save(infoAssorment).then(function () {
                        //At this moment, the new assortment should be already saved... syncing all the assortments...
                        assortment.saveAssortments().then(function () {
                            //assortment.syncAssortmentsData().then(function () {
                                assortment.getAssortments().then(function (infoAssorment) {
                                    //If we are seeing the UUID Assortment, then let's move to the CAPI Assortment...
                                    var syncCreatedAssortment = _.findWhere(infoAssorment.data, {description: assortmentAsyncObj.description});
                                    if ($location.path().indexOf("assortment/edit") !== -1) {
                                        $location.path("/assortment/edit/" + syncCreatedAssortment.id + "/linesheet");
                                    }
                                });
                            //});
                        });

                    });
                });
            });
        capiDeleteAssortment();
    }

    //This function saves an new Order to CAPI that has not been saved, (contains an UUID)
    function saveOrderUUID(OrderInProcess) {
        var defer = $q.defer();
        var uuid = OrderInProcess.id;
        var email = OrderInProcess.email;
        var updatedOrderList = [];
        var OrderCopy = [];
        OrderCopy = angular.copy(OrderInProcess);
        if(network.canConnect()){
            order.convertOrderToCapi(OrderInProcess).then(function(capiOrder){
                order.createNewOrder(capiOrder, email).then(function(newOrder){
                    order.getAllOrders().then(function (allOrders) {
                        _.each(allOrders.data, function(eachOrder){
                            if(eachOrder.id === uuid){
                                if(newOrder.data.id){
                                    OrderCopy.id = newOrder.data.id;
                                    delete OrderCopy.status;
                                }else{
                                    OrderCopy.status = "submitted";
                                }
                                updatedOrderList.push(OrderCopy);
                            }else{
                                updatedOrderList.push(eachOrder);
                            }

                        })
                        allOrders.data = updatedOrderList;
                        OfflineManager.save(allOrders).then(function () {
                            defer.resolve();
                        });
                    });
                })
            });
        };
        return defer;
    }

    //This function changes an renamed assortment back to the CAPI, and restores the basic state
    // Of the assortment on the Webkit, just to ensure code consistence.
    function saveRenamedAssortment(assortmentObj) {
        assortment.renameAssortmentCAPI(assortmentObj.id, assortmentObj.description).then(function (assortmentFromCapi) {
            assortmentFromCapi.key = 'Assortment|' + assortmentFromCapi.id;
            assortmentFromCapi.description = assortmentObj.description;
            assortmentFromCapi.products = assortmentObj.products;
            assortmentFromCapi.myProductStyles = assortmentObj.myProductStyles;
            OfflineManager.save(assortmentFromCapi);
        });
    }

    //This function iterates thru the ASSORTMENT_DELETION_LIST data that holds
    // The assortment ids that are deleted from Webkit so we can call the CAPI Delete
    function capiDeleteAssortment() {
        OfflineManager.find('ASSORTMENT_DELETION_LIST').then(function (deletionList) {
            deletionList = deletionList || {data: []};
            _.each(deletionList.data, function (assortmentToDeleteId) {
                assortment.deleteCapi(assortmentToDeleteId);
            });
            deletionList.data = [];
            OfflineManager.save(deletionList);
        });
    }

    //This function include Product Styles into assortment back to the CAPI, and restores the basic state
    // Of the assortment on the Webkit, just to ensure code consistence.
    function updateProductStyleAssortment() {
        OfflineManager.find('ASSORTMENT_UPDATE_PRODUCTSTYLE_LIST').then(function (updateAssortemtList) {
            _.each(updateAssortemtList.data, function (assortmentUpdate) {
                productStyles.associateWithAssortmentCAPI(assortmentUpdate.productId, assortmentUpdate.assortmentId);
            });
            updateAssortemtList.data = [];
            OfflineManager.save(updateAssortemtList);
        });
    }

    //This function include Products into assortment back to the CAPI.
    function updateProductsAssortment() {
        OfflineManager.find('ASSORTMENT_UPDATE_PRODUCTS_LIST').then(function (updateAssortemtProductList) {
            _.each(updateAssortemtProductList.data, function (assortmentUpdate) {
                assortment.bulkPersistProductQuantitiesCAPI(assortmentUpdate.productData, assortmentUpdate.assortmentId);
            });
            updateAssortemtProductList.data = [];
            OfflineManager.save(updateAssortemtProductList);
        });
    }

    //This function sets up the structure needed for CAPI to create a new Assortment
    //in an async fashion.
    function updateProductQuantities(assortmentFullObj) {
        //service.setProductQuantity = function (assortmentId, product, quantity) {
        var assortmentId = assortmentFullObj.id;
        _.each(assortmentFullObj.myProductStyles, function (productStyle) {
            _.each(productStyle.connections.products, function (product) {
                if (product.quantity > 0) {
                    //assortment.setProductQuantity(assortmentId, product, product.quantity);
                }
            });
        });
    }

    //This function iterates thru the ORDER_SENDEMAIL_LIST data that holds
    //Now we need to send the email notification of the order by Capi
    function SendEmailOrderQueue() {
        OfflineManager.find('ORDER_SENDEMAIL_LIST').then(function (sendEmailList) {
            if (sendEmailList.data) {
                _.each(sendEmailList.data, function (orderEmailInfo) {
                    order.sendEmailsCAPI(orderEmailInfo.orderId, orderEmailInfo.format, orderEmailInfo.subject, orderEmailInfo.recipients);
                });
            }
        });
    }

    var QueueManager = {
        updateCurrentAssortment: function () {
            //If there's an current assortment, let's keep the current data back to the
            //Webkit
            if ($rootScope.currentAssortment) {
                OfflineManager.find('Assortment|' + $rootScope.currentAssortment.id).then(function (currentAssrotment) {
                    currentAssrotment.myProductStyles = $rootScope.currentAssortment.myProductStyles;
                    currentAssrotment.products = $rootScope.currentAssortment.products;
                    //currentAssrotment.needCAPIUpload = true;
                    OfflineManager.save(currentAssrotment).then(function () {
                        updateProductQuantities(currentAssrotment);
                    });
                });
            }
        },

        /*
         * This function uses the network service to know if it's able to connect,
         * if it is, it executes the QueueManager Assortment and Order Queues.*/
        connectionCheck: function () {
            if (network.canConnect()) {
                QueueManager.startAssortentQueue();
                QueueManager.startOrderQueue();
            }
        },
        /*
         startAssortentQueue is called on the fileSync, this function takes
         care of persist the current state of Offline Assortments
         and save them on the CAPI.

         It looks for the current state of all the assortments, and if it
         sees that there's something changed, tries to access the the CAPI (when it's online)
         and updates the current assormtent(s).
         */
        startAssortentQueue: function () {
            QueueManager.updateCurrentAssortment();
        },

        startOrderQueue: function () {
            //ORDERS_READY_TO_SYNC is set to true at the moment we are know
            // there's internet connection

            if (network.canConnect()) {
                OfflineManager.find('Order').then(function (orderList) {
                    if (orderList) {
                      var myOrdersToSend = [];
                        _.each(orderList.data, function (orderObj) {
                            if (orderObj) {
                                if (guidRegex.test(orderObj.id)) {
                                  myOrdersToSend.push(orderObj);
                                }
                            }
                        });
                        _.each(myOrdersToSend,function(orderFullObj,index){
                            $timeout(function(){
                                saveOrderUUID(orderFullObj);
                            },5500*index);
                        });
                    }
                });
            }
        },

        /*
         * Corey's Sample to stop a Timed Callback in the Webkit
         * */
        doStopTimedCallback: function () {
            StopTimedCallback('TestTimer', function (ret) {
                    if (ret) {
                        var obj = JSON.parse(ret);
                    }
                },
                function (ret) {
                    if (ret) {
                        var obj = JSON.parse(ret);
                    }
                });
        },
        /*
         Stops the Assortment Queue
         */
        stopAssortentQueue: function () {
            StopTimedCallback(ASSORTMENT_TIMER,
                function (ret) {
                    if (ret) {
                        var obj = JSON.parse(ret);
                    }
                },
                function (ret) {
                    if (ret) {
                        var obj = JSON.parse(ret);
                    }
                });
        },
        /*
         Stops the Assortment Queue
         */
        stopOrderQueue: function () {
            StopTimedCallback(ORDER_TIMER,
                function (ret) {
                    if (ret) {
                        var obj = JSON.parse(ret);
                    }
                },
                function (ret) {
                    if (ret) {
                        var obj = JSON.parse(ret);
                    }
                });
        },
        /*
         Stops the Connection Check
         */
        stopConnectionCheck: function () {
            StopTimedCallback(CONNECTION_CHECK_TIMER,
                function (ret) {
                    if (ret) {
                        var obj = JSON.parse(ret);
                    }
                },
                function (ret) {
                    if (ret) {
                        var obj = JSON.parse(ret);
                    }
                });
        }
    }

    return QueueManager;
});
'use strict';

angular.module('conductivEcatalogApp')
    .controller('OrderPopupCtrl', function ($scope, catalog, customer, $timeout, $rootScope, $location,$routeParams) {

        $scope.formFields = {};  //data binding with form elements
        $scope.selected = undefined;
        $scope.copyHeader = {check: false};

        $scope.dateOptions = {
            minDate: new Date(),
            onSelect: function (currdate) {
                var maxdate = new Date(new Date(currdate).getTime() + 2592000000);
                var mindate = new Date(maxdate.getTime() - 1296000000);
                $scope.formFields.cancelDate = maxdate;
                $scope.cancelAfterOptions = {
                    maxDate: maxdate,
                    minDate: mindate
                }
            }
        };

				//If $rootScope.formFieldsByGroup not exist let's create it :)
				//Inside this object we are going to store all the temporary
				//orders
				if(!$rootScope.ordersByGroup){
					$rootScope.ordersByGroup = [];
				}

        $scope.order = {}; //data pertaining to the Order obj to be stored on server.

        customer.getCustomers().then(function (data) {
            $scope.customers = data;
        });

        catalog.getPromocodes().then(function (data) {
            $scope.promocodes = data;

            $scope.promocodeStrings = [];
            _.each($scope.promocodes, function (code) {
                $scope.promocodeStrings.push(code.name);
            });
        });

        //create string from addresses JSON to be listed in order form.
        var createAddressStrings = function () {
            var addressStrings = [];
            _.each($scope.addresses, function (address) {
                addressStrings.push(address.address.address1 + "," + address.address.city + "," +
                    address.address.state + "," + address.address.postalCode);
            });

            return addressStrings;
        }

        $scope.$watch('formFields.customer', function (newValue) {
            $scope.getCustomerAddresses(newValue);

        });

        $scope.getCustomerAddresses = function (newValue) {
            if (newValue != undefined) {
                var customer = _.findWhere($scope.customers, {
                    name: newValue
                });
                $scope.customer = customer;

                if (customer != undefined) {
                    $scope.addresses = customer.connections['postal-addresses'];
                    $scope.addressStrings = createAddressStrings();
                    $scope.formFields.shipToAddress = $scope.addressStrings[0];
                }
            }
        }
        $scope.setCustomer = function () {
            /* _.each($scope.customers, function(customer){
             //alert($scope.formFields.customer.name + " " + JSON.stringify(customer.name));
             //console.log(customer);
             if(customer.name == $scope.formFields.customer.name){
             $scope.formFields.customer = customer;
             return
             }
             })*/
        }
        $scope.orderPopupOptions = {
            backdropFade: false,
            dialogFade: false,
            backdropClick: false,
            dialogClass: "modal order-product-popup drop-shadow"
        }

        //call this method before submitting to validate emails (returns true if all emails are correct)

        $scope.validateEmail = function (value) {
            if (value == undefined || value == '') {
                return false;
            }
            var valid = true;
            var emails = value.split(',');
            var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
            angular.forEach(emails, function (email, key) {
                if (!pattern.test(email)) {
                    valid = false;
                }
            });
            return valid;
        };

        catalog.getShipmentMethods().then(function (data) {
            $scope.shippingMethods = data.reverse();
            $scope.createShippingMethodStrings();
        });

        $scope.createShippingMethodStrings = function () {
            $scope.shippingMethodStrings = [];
            _.each($scope.shippingMethods, function (method) {
                $scope.shippingMethodStrings.push(method.description);
            });
            return $scope.shippingMethodStrings;
        }


        $scope.saveFields = function (invalid) {

            if (!invalid) {
                $scope.order = {};
                $scope.order.assortmentId = $rootScope.currentAssortment.id;
	              $scope.order.assortmentGroup = $rootScope.currentAssortment.group;
                $scope.order.customerId = $scope.customer.id;
                $scope.order.customer = $scope.customer;
                $scope.order.customerName = $scope.customer.name;
                $scope.order.shippingAddressId = $scope.addresses[$("#ship-to").prop("selectedIndex")].address.id;
                $scope.order.postalAddress = $scope.addresses[$("#ship-to").prop("selectedIndex")].address.address1
                    + ", " + $scope.addresses[$("#ship-to").prop("selectedIndex")].address.city,
                    +", " + $scope.addresses[$("#ship-to").prop("selectedIndex")].address.state,
                    +", " + $scope.addresses[$("#ship-to").prop("selectedIndex")].address.postalCode;
                $scope.order.email = $scope.formFields.email;
                $scope.order.shipMethodId = $scope.shippingMethods[$("#ship-method").prop("selectedIndex")].id;
                $scope.order.myProductStyles = $rootScope.currentAssortment.myProductStyles;
                $scope.order.products = $rootScope.currentAssortment.products;

                if ($scope.formFields.promotion) {
                    $scope.order.promotion = $scope.formFields.promotion;
                }

                $scope.order.shipBy = $scope.formFields.shippingDate;
                $scope.order.cancelAfter = $scope.formFields.cancelDate;
                $scope.order.purchaseOrder = $scope.formFields.po;
                $scope.order.remarks = $scope.formFields.remarks;

                $rootScope.currentAssortment.order = {};
                $rootScope.currentAssortment.order = $scope.order;
                $rootScope.currentAssortment.order.formFields = $scope.formFields;



								if($rootScope.currentAssortmentByGroup){
									var assortmentIndex = _.indexOf($rootScope.ordersByGroup,$rootScope.currentAssortmentByGroup);

									$rootScope.ordersByGroup.splice(assortmentIndex,1);

								}

	              $rootScope.ordersByGroup.push($scope.order);

            }

        }


			$scope.$watch('order', function (newValue) {

				// The Magic for group all the Orders goes here ========>
				$rootScope.currentAssortmentByGroup = _.findWhere($rootScope.ordersByGroup,{assortmentId:$rootScope.currentAssortment.id});

				$rootScope.currentAssortmentByGroupOrdered = _.uniq(_.groupBy($rootScope.ordersByGroup, 'assortmentGroup'));

				$scope.getPositionInsideGroup = function(){
					var findGroupObject = null,
							parentGroupObject = null;
					_.each($rootScope.currentAssortmentByGroupOrdered, function(group){

						findGroupObject = _.findWhere(group,{assortmentId: $rootScope.currentAssortment.id});
						if(findGroupObject){
							parentGroupObject = group;
						}
					});
					return parentGroupObject;
				}

				$scope.positionInsideGroup = $scope.getPositionInsideGroup();
				$rootScope.submitOrders = false;
				//Check if we are ready for show the submit all orders button
				if($rootScope.currentAssortmentByGroupOrdered){

					if($rootScope.numberTabs  == _.toArray($scope.positionInsideGroup).length){
						$rootScope.submitOrders = true;
					}
				}
				//Let's group the Orders by Purchase Order, Ship Location, Ship Date, Cancel Date
				$rootScope.orderOrderedByHeader = _.groupBy($scope.positionInsideGroup, function(record){
					return (record.purchaseOrder+record.shippingAddressId+record.shipBy+record.cancelAfter);
				});
				//<============================
			});

				$scope.submitOrder = function (invalid) {
					$scope.saveFields(invalid);

						$location.path("/assortment/edit/" + $rootScope.currentAssortment.id + "/ordersummary");
				
				}

				$scope.saveOrderHeader = function(invalid){
					$scope.saveFields(invalid);
					//$scope.closeOrderPopup();
				}

        $scope.dateInFuture = function (value) {
            // A little ugly, but we can use toDateString to "floor" the current timestamp to the start of the calendar day:
            var today = new Date(new Date().toDateString()),
                date = new Date(value);
            // Don't validate unpopulated fields
            if (value == undefined || value == '') {
                return true;
            }

            return today <= date;
        };
        $scope.dateWithinRequiredRange = function (date) {
            if (date == undefined) {
                return true;
            }
            var cancelAfter = new Date(date);
            var requestedShipDate = new Date($scope.formFields.shippingDate);
            var dateDiff = cancelAfter - requestedShipDate;
            var daysDiff = Math.round(dateDiff / 1000 / 60 / 60 / 24);
            if (daysDiff >= 15 && daysDiff <= 30) {
                return true;
            }
            else {
                return false;
            }
        }
        $scope.changeCancelAfter = function () {
            var requestedShipDate = new Date($scope.formFields.shippingDate);
            var cancelAfter = new Date(requestedShipDate.getTime() + 2592000000);
            var cancelAfterMonth = cancelAfter.getMonth();
            var cancelAfterDate = cancelAfter.getDate();
            if (cancelAfterMonth < 9) {
                cancelAfterMonth = "0" + (cancelAfterMonth + 1);
            }
            else {
                cancelAfterMonth = cancelAfterMonth + 1;
            }
            if (cancelAfterDate <= 9) {
                cancelAfterDate = "0" + cancelAfterDate;
            }
            $scope.formFields.cancelDate = cancelAfter.getFullYear() + "-" + cancelAfterMonth + "-" + cancelAfterDate;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }

        /**
         * Populate form fields when user clicks 'back' buttons & comes back to this page
         */
        $scope.autofillForm = function () {

	        if($rootScope.currentAssortmentByGroup != undefined && $rootScope.currentAssortmentByGroup !== null){

		        $scope.formFields = $rootScope.currentAssortmentByGroup.formFields;

		        $("#orderProductForm-customerName").select2("val", $scope.formFields.customer.name);
		        $scope.getCustomerAddresses($scope.formFields.customer, "");
	        }

	        /*
            if ($rootScope.currentAssortment !== undefined && $rootScope.currentAssortment !== null && $rootScope.currentAssortment.order !== undefined && $rootScope.currentAssortment.order !== null) {

                $scope.formFields = $rootScope.currentAssortment.order.formFields;

                $("#orderProductForm-customerName").select2("val", $scope.formFields.customer.name);
                $scope.getCustomerAddresses($scope.formFields.customer, "");
            }
            */
        }

				$scope.closeOrderPopup = function () {
					$rootScope.orderPopupShouldBeOpen = false;
				}

        $scope.$watch('$parent.orderPopupShouldBeOpen', function (newValue, oldValue) {
            //alert(newValue + " " + oldValue)
		        if($rootScope.numberTabs > 1){
			        $scope.moreThanOneTab = true;
		        }
            $scope.autofillForm();
        });

        $scope.$watch('copyHeader.check', function(newValue, oldValue){

            if(newValue && $rootScope.currentAssortmentByGroupOrdered.length > 0){

                for(var i = 0; i < $scope.listOfAssortments.length; i++){

                    if($scope.listOfAssortments[i].id === $rootScope.currentAssortment.id && i > 0){

                        for(var x = 0; x < $rootScope.currentAssortmentByGroupOrdered[0].length; x++){

                            if($rootScope.currentAssortmentByGroupOrdered[0][x].assortmentId === $scope.listOfAssortments[i-1].id){

                                $scope.formFields = _.clone($rootScope.currentAssortmentByGroupOrdered[0][x].formFields);

                                break;

                            }else if($rootScope.currentAssortmentByGroupOrdered[0].length - 1 === x){
                                $scope.formFields = _.clone($rootScope.currentAssortmentByGroupOrdered[0][$rootScope.currentAssortmentByGroupOrdered.length-1].formFields);
                            }
                        }

                        break;

                    }else if(i === 0){
                        $scope.formFields = _.clone($rootScope.currentAssortmentByGroupOrdered[0][$rootScope.currentAssortmentByGroupOrdered.length-1].formFields);
                    }
                }
            }else if(oldValue){
                $scope.formFields = {};
            }
        });
    });
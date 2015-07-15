'use strict';

angular.module('conductivEcatalogApp')
		.controller('AssortmentNewPopupCtrl', function ($scope,$routeParams, assortment,catalog, $timeout, $rootScope, $location, OfflineManager) {

			$scope.assortmentId = $routeParams.assortmentId;
			$scope.customerTiers = null;
			$scope.newAsssortmentDescription= "";
			$scope.urlPoint = ($location.$$url).split('/')[4];


			catalog.getCustomerTiers().then(function (data) {
				$scope.customerTiers = data;
				$scope.customerTier = data[0];

			}, function (error) {
				$scope.customerTiers = null;
			});


			assortment.getAssortment($scope.assortmentId).then(function(assortmentInfo){
				$scope.assortmentGroupName = assortmentInfo;
			});

			$scope.newAssortmentPopupOptions = {
				backdropFade: false,
				dialogFade: false,
				backdropClick: false,
				dialogClass: "modal small-form-modal drop-shadow"
			}




			//Let's check the name length of the new Assortment
			$scope.verifyAssortmentNameLength = function (ev) {
				var assortmentNameLength = ($scope.newAsssortmentDescription || "").length + 1;
				if (assortmentNameLength > 100) {
					ev.preventDefault();
				}
			}

			/*
			 * This is the default structure we are starting with when creating a new Assortment
			 */
			$scope.templateAssortment = {
				createdBy:'10060',
				createdTime: '2013-07-22 15:53:45.0',
				customerTier: 'National Account',
				description: 'Don DummyAssortment',
				id:'19670',
				lastUpdatedTime: '2013-07-22 15:53:45.0',
				links:{},
				group:'',
				productStyles:[],
				products:[],
				type:'Assortment'
			};

			$scope.createNewAssortment = function () {
				//Cloning Assortment Template
				var newAssortmentFromTemplate = _.clone($scope.templateAssortment)
						, createdDateTime = moment().format('YYYY-MM-DD hh:mm:ss'),
						urlPosition =($location.$$url).split('/')[4];


				angular.extend(newAssortmentFromTemplate,{
					createdBy : sessionStorage.getItem('username'),
					createdTime : createdDateTime,
					customerTier : $scope.customerTier.name,
					description : $scope.newAsssortmentDescription,
					id : assortment.guid(),
					group:$scope.assortmentGroupName.group,
					lastUpdatedTime : createdDateTime
				});


				newAssortmentFromTemplate.key = 'Assortment|'+newAssortmentFromTemplate.id;
				newAssortmentFromTemplate.myProductStyles = [];

				OfflineManager.save(newAssortmentFromTemplate).then(function(assortmentObj){
					$scope.newAssortmentDialogShouldBeOpen = false;
					assortment.getAssortments().then(function (infoAssorment) {
						infoAssorment.key = 'Assortment';
						infoAssorment.data.push(newAssortmentFromTemplate);
						OfflineManager.save(infoAssorment);

						$location.path("/assortment/edit/" + newAssortmentFromTemplate.id + "/"+$scope.urlPoint);
					});
				});

				/*assortment.createNewAssortment($scope.newAsssortmentDescription).then(function (data) {
				 catalog.setCustomerTier($scope.customerTier.id, $scope.newAsssortmentDescription, data.id);
				 $scope.newAssortmentDialogShouldBeOpen = false;
				 $location.path("/assortment/edit/" + data.id + "/linesheet");
				 });*/
			};

		});
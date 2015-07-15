'use strict';

angular.module('conductivEcatalogApp').controller('AssortmentActionsCtrl', function ($rootScope, $scope, assortment, productStyles,catalog, $routeParams, $location, $timeout,Environment,OfflineManager,$window) {

	$scope.newAsssortmentDescription = "";
	$scope.duplicateQuantities = false;
	$scope.assortmentId = $routeParams.assortmentId;
	$scope.customerTiers = null;
	$scope.urlPoint = ($location.$$url).split('/')[4];


	/*=== General Functions ====*/
	assortment.getAssortment($scope.assortmentId).then(function(assortmentInfo){
		$scope.assortmentGroupName = assortmentInfo;
	});

	catalog.getCustomerTiers().then(function (data) {
		$scope.customerTiers = data;
		$scope.customerTier = data[0];

	}, function (error) {
		$scope.customerTiers = null;
	});

	//Let's check the name length of the new Assortment
	$scope.verifyAssortmentNameLength = function (ev) {
		var assortmentNameLength = ($scope.newAsssortmentDescription || "").length + 1;
		if (assortmentNameLength > 100) {
			ev.preventDefault();
		}
	}


	var repositionMenu = function () {

		var topOffset = 180;
		var leftOffset = 100;


		//If the popup comes below the screen, adjust the offset
		if ($($scope.clickedElement).position().top + 250 >= $window.innerHeight) {

			if (window.orientation == 0 || window.orientation == 180) { //portrait
				topOffset = 0;
			} else {
				topOffset = -200; //portrait
			}


		} else if ($($scope.clickedElement).position().top + 350 >= $window.innerHeight) {
			topOffset = 50;
		}

		//$(".mypopover").offset({ top: $(element).position().top +180, left: $(element).position().left + 100});
		$(".mypopover").offset({ top: $($scope.clickedElement).position().top + topOffset, left: $($scope.clickedElement).position().left + leftOffset});
	}

	//Show the Pop-up menu with "Delete, Rename and Duplicate"
	//This call come from assortmentEditLinesheet or assortmentEditWhiteboard
	//$scope.$on('showPopUpOnLongHold', function (event, element, assortment){...}

	$rootScope.optionsPopUpOnLongHold = function(event, element, assortment){
		$rootScope.selectedAssortment = assortment;
		$scope.duplicateAssortmentDescription = assortment.description + " copy";
		$scope.selectedAssortment.newName = $rootScope.selectedAssortment.description;
		$scope.selectedAssortment.group = $rootScope.selectedAssortment.group;
		$scope.clickedElement = element;


		$('.assortment-pop-over-container').css({
			"display": "block"
		});

		var popupMenu = $(".mypopover"),
		    pos = $(element).offset(),
		    topOffset = 40,
		    leftOffset = 80,
				posTop = 72,
				posLeft = pos.left;



		popupMenu.css({ top: posTop + topOffset, left: posLeft + leftOffset});
/*
		if ($($scope.clickedElement).position().top + 250 >= $window.innerHeight) {
			topOffset = 50;
		} else if ($($scope.clickedElement).position().top + 350 >= $window.innerHeight) {
			topOffset = 50;
		}
		$(".mypopover").offset({ top: $(element).position().top + topOffset, left: $(element).position().left + leftOffset});
		*/

	}

	$scope.hidePopUp = function (event, id) {
		$('.assortment-pop-over-container').css({
			"display": "none"
		});
	};

	$(window).bind('orientationchange', function () {
		$(".assortment-pop-over-container").hide();
	});


	/*=== New Assortment ====*/

	$scope.newAssortmentPopupOptions = {
		backdropFade: false,
		dialogFade: false,
		backdropClick: false,
		dialogClass: "modal small-form-modal drop-shadow"
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





	/*=== Delete Assortment ====*/
  $scope.openDeletingDialog = function(){
    $rootScope.cantDeleteOneTab = false;
    $rootScope.DeletingDialogShouldBeOpen = true;
  }

  $scope.closeDeletingDialog = function(){
    $rootScope.cantDeleteOneTab = false;
    $rootScope.DeletingDialogShouldBeOpen = false;
  }

  $scope.deleteAction = function(){
    assortment.getAssortments().then(function(assortments){
      var assortmentWaveLength = _.where(assortments.data,{group:$scope.selectedAssortment.group}).length;
      if(assortmentWaveLength > 1){
        $rootScope.DeletingDialogShouldBeOpen = false;
        assortment.deleteAssortment($scope.selectedAssortment.id).then(function(){
          $rootScope.$broadcast('event:refresh-assortment-tabs',$scope.selectedAssortment.id);
        });
      }else{
        $rootScope.cantDeleteOneTab = true;
      }
    });

  }

	/*=== Duplicate Assortment ====*/

    // this fucntion open the duplicate modal
    $scope.openDuplicateAssortmentDialog = function() {
        $rootScope.duplicateAssortmentDialogShouldBeOpen = true;
    };

    // this function close the modal
    $scope.closeDuplicateAssortmentDialog = function() {
        $rootScope.duplicateAssortmentDialogShouldBeOpen = false;
    }

    $scope.duplicateAction = function () {
        // take the original assortment name to compare with the new one.
        var originalName = $scope.selectedAssortment.description;
        // change the name of the duplicate
        $scope.selectedAssortment.description = $scope.selectedAssortment.newName;
        // generate a new id for the duplicate
        $scope.selectedAssortment.id = assortment.guid();
        $scope.duplicate = _.clone($scope.selectedAssortment);
        // get the last modify moment
        $scope.duplicate.lastUpdatedTime = moment().format('YYYY-MM-DD hh:mm:ss');
        $scope.duplicate.key = 'Assortment|'+ $scope.duplicate.id;
        // compare id have the same name if is true add copy to the name
        if(originalName === $scope.duplicate.description){
            $scope.duplicate.description = $scope.selectedAssortment.description + ' copy';
        }
        OfflineManager.save($scope.duplicate).then(function(){
            assortment.getAssortments().then(function (infoAssorment) {
                infoAssorment.key = 'Assortment';
                infoAssorment.data.push($scope.duplicate);
                OfflineManager.save(infoAssorment);
                $location.path("/assortment/edit/" + $scope.duplicate.id + "/"+$scope.urlPoint);
            });
        });
        $rootScope.duplicateAssortmentDialogShouldBeOpen = false;
    }
    /*=== Rename Assortment ====*/
	$scope.renameAction = function () {
		$rootScope.RenamingDialogShouldBeOpen = false;
		assortment.renameAssortment($scope.selectedAssortment, $scope.selectedAssortment.newName,$scope.selectedAssortment.group).then(function (updatedAssortment) {
			$scope.selectedAssortment.description = updatedAssortment.description;

			$scope.getAssortments();
		});
	}

	$scope.openRenamingDialog = function () {
		$rootScope.RenamingDialogShouldBeOpen = true;
	};

	$scope.closeRenamingDialog = function () {
		$rootScope.RenamingDialogShouldBeOpen = false;
	};

});

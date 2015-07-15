'use strict';

angular.module('conductivEcatalogApp')
  .controller('AssortmentListCtrl', function (OfflineManager, $scope, assortment, indexeddb, $location, catalog, $routeParams, $window, $rootScope, Environment, $timeout) {

    $rootScope.loading = true;
    $scope.newAsssortmentDescription = "";
    $scope.duplicateQuantities = false;
    $scope.showWhiteBoard = false;
    $scope.whiteboardLink = "#/assortment/edit/" + $scope.assortmentId + "/whiteboard";

    $scope.getAssortments = function(){

      assortment.getAssortments().then(function (infoAssorment) {
	      $scope.listOfAssortments = [];

	      _.each(infoAssorment.data, function(assortment){

		      if(assortment.group){
			      $scope.listOfAssortments.push(assortment);
		      }
	      });

	      $scope.listOfAssortments = _.uniq(_.groupBy($scope.listOfAssortments, 'group')).reverse();

	      console.log($scope.listOfAssortments);
          $rootScope.loading = false;
      });
    };

    $scope.getAssortments();

    $scope.verifyAssortmentDescriptionLength = function (ev) {
      var assortmentDescriptionLength = ($scope.newAsssortmentDescription || "").length + 1;
      if (assortmentDescriptionLength > 100) {
        ev.preventDefault();
      }
    }

    $scope.edit = function () {
      $location.path("/assortment/edit/" + $scope.selectedAssortment.id);
    };

    $scope.duplicateAction = function () {

        var helper = function(){
            var i = 0;

            return function(group){

                if(i+1 < group.length){
                    assortment.duplicateAssortment($scope.duplicateAssortmentGroup, group[i].id, $scope.duplicateQuantities).then(function(){
                        i++;
                        helper(group);
                    });
                }else{
                    //if its the last of the group refresh the assortment list after renaming
                    assortment.duplicateAssortment($scope.duplicateAssortmentGroup, group[i].id, $scope.duplicateQuantities).then(function(){
                        $scope.closeDuplicateAssortmentDialog();
                        $scope.getAssortments();
                    });
                }
            }
        }();

        _.each($scope.listOfAssortments, function(group){

            if($scope.selectedAssortment[0].group === group[0].group) {
                helper(group);
                return;
            }
        });
    }

    $scope.openDuplicateAssortmentDialog = function () {
      $scope.duplicateQuantities = false;
      $scope.duplicateAssortmentDialogShouldBeOpen = true;
    };

    $scope.closeDuplicateAssortmentDialog = function () {
      $scope.duplicateAssortmentDialogShouldBeOpen = false;
    };

    $scope.renameAction = function () {
        $scope.RenamingDialogShouldBeOpen = false;

        var helper = function(){
            var i = 0;

            return function(group){

                if(i+1 < group.length){
                    assortment.renameGroup(group[i], $scope.selectedAssortment.newName).then(function(){
                        i++;
                        helper(group);
                    });
                }else{
                    //if its the last of the group refresh the assortment list after renaming
                    assortment.renameGroup(group[i], $scope.selectedAssortment.newName).then(function(){
                        $scope.getAssortments();
                    });
                }
            }
        }();

        _.each($scope.listOfAssortments, function(group){

            if($scope.selectedAssortment[0].group === group[0].group) {
                helper(group);
                return;
            }
        });
    };

    $scope.openRenamingDialog = function () {
      $scope.RenamingDialogShouldBeOpen = true;
    };

    $scope.closeRenamingDialog = function () {
      $scope.RenamingDialogShouldBeOpen = false;
    };

    $scope.deleteAction = function () {
        $scope.DeletingDialogShouldBeOpen = false;

        var helper = function(){
            var i = 0;

            return function(group){

                if(i+1 < group.length){
                    assortment.deleteAssortment(group[i].id).then(function(){
                        i++;
                        helper(group);
                    });
                }else{
                    //if its the last of the group refresh the assortment list after renaming
                    assortment.deleteAssortment(group[i].id).then(function(){
                        $scope.getAssortments();
                    });
                }
            }
        }();

        _.each($scope.listOfAssortments, function(group){

            if($scope.selectedAssortment[0].group === group[0].group) {
                helper(group);
                return;
            }

        });
    };

    $scope.openDeletingDialog = function () {
      $scope.DeletingDialogShouldBeOpen = true;
    };

    $scope.closeDeletingDialog = function () {
      $scope.DeletingDialogShouldBeOpen = false;
    };

    $scope.export = function () {
      alert("Not in S3");
    };

    $scope.hidePopUp = function (event, id) {
      $('.assortment-pop-over-container').css({
        "display": "none"
      });
    };

    /*
    * This is the default structure we are starting with when creating a new Assortment
    */
    $scope.templateAssortment = {
      createdBy:localStorage.getItem("userID"),
      createdTime: '2013-07-22 15:53:45.0',
      customerTier: 'National Account',
      description: 'Don DummyAssortment',
      id:'19670',
      lastUpdatedTime: '2013-07-22 15:53:45.0',
      links:{},
      productStyles:[],
      products:[],
      type:'Assortment',
      group:'groupName'
    };
    $scope.newAssortmentAction = function () {
      //Cloning Assortment Template
      var newAssortmentFromTemplate = _.clone($scope.templateAssortment)
        , createdDateTime = moment().format('YYYY-MM-DD HH:mm:ss');

      angular.extend(newAssortmentFromTemplate,{
        createdBy : sessionStorage.getItem('username'),
        createdTime : createdDateTime,
        customerTier : $scope.customerTier.name,
        description : $scope.newAsssortmentDescription,
        id : assortment.guid(),
        group : $scope.newAsssortmentDescription,
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

            if($scope.showWhiteBoard){
               $location.path("/assortment/edit/" + newAssortmentFromTemplate.id + "/whiteboard");
            }else{
                $location.path("/assortment/edit/" + newAssortmentFromTemplate.id + "/linesheet");
            }
        });
      });



      /*assortment.createNewAssortment($scope.newAsssortmentDescription).then(function (data) {
        catalog.setCustomerTier($scope.customerTier.id, $scope.newAsssortmentDescription, data.id);
        $scope.newAssortmentDialogShouldBeOpen = false;
        $location.path("/assortment/edit/" + data.id + "/linesheet");
      });*/
    };

    $scope.$on('showPopUpOnLongHold', function (event, element, assortment) {
      $scope.selectedAssortment = assortment;
      $scope.duplicateAssortmentGroup = assortment[0].group + " copy";

      $scope.clickedElement = element;
      $('.assortment-pop-over-container').css({
        "display": "block"
      });

      var popupMenu = $(".mypopover");
      var topOffset = 170;
      var leftOffset = 70;

      //If the popup comes below the screen, adjust the offset
      if ($($scope.clickedElement).position().top + 250 >= $window.innerHeight) {
        topOffset = 50;
      } else if ($($scope.clickedElement).position().top + 350 >= $window.innerHeight) {
        topOffset = 50;
      }

      //$(".mypopover").offset({ top: $(element).position().top +180, left: $(element).position().left + 100});
      $(".mypopover").offset({ top: $(element).position().top + topOffset, left: $(element).position().left + leftOffset});
    });


    $scope.openNewAssortmentDialog = function () {
      $scope.newAsssortmentDescription = "";
      $scope.newAssortmentDialogShouldBeOpen = true;
    };

    $scope.closeNewAssortmentDialog = function () {
      $scope.newAssortmentDialogShouldBeOpen = false;
    };


    $scope.customerTiers = null;
    catalog.getCustomerTiers().then(function (data) {
      $scope.customerTiers = data;
      $scope.customerTier = data[0];

    }, function (error) {
      $scope.customerTiers = null;
    });


    $scope.setCustomerTier = function (tierId) {
      $scope.customerTierId = tierId;
    }

    $scope.openAssortment = _.debounce(function (assortmentId) {
      $rootScope.loading = true;
      $location.path("/assortment/edit/" + assortmentId + "/linesheet");
    }, 1000, true);


    $(window).bind('orientationchange', function () {
      $(".assortment-pop-over-container").hide();
    });

    var showMenu = function () {

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


        $scope.$root.initialElements = [
            {
                "text": "White Board",

                "link": $scope.whiteboardLink

            },
            {
                "text": "Linesheet",
                "action": $scope.$root.searchModal.open,
                "type": "initialElementsLink"
            }
        ];
  });

'use strict';

angular.module('conductivEcatalogApp').controller('AssortmentEditWhiteboardCtrl', function ($scope, $location, $window, $http, $routeParams, $timeout, assortment, $rootScope, productStyles, whiteboardLayout) {
	$scope.assortmentId = $routeParams.assortmentId;
	$scope.linesheetLink = "#/assortment/edit/" + $scope.assortmentId + "/linesheet";
	$scope.rightPanelItems = whiteboardLayout.get($scope.assortmentId);
	$scope.viewportHt = $window.innerHeight - 110;

	$scope.showLeftNavTabs = false;
	$scope.showRightNavTabs = false;
	$scope.numberTabs = null;
	$scope.indexTabActive = null;


	var totalTabsRight,
			totalTabsLeft;

	//parseInt($('body').css('padding-top')) - parseInt($('body').css('padding-bottom'));
	$('#wb-left-column, #wb-right-column').height($scope.viewportHt);

	angular.element($window).bind('resize', function () {
		$scope.viewportHt = $window.innerHeight - 110;
		//parseInt($('body').css('padding-top')) - parseInt($('body').css('padding-bottom'));
		$scope.$apply($scope.viewportHt);
	});
	$scope.$watch('viewportHt', function (newVal, oldVal) {
		$('#wb-left-column, #wb-right-column').height($scope.viewportHt);
	});
	$('body').on('click', '.closeUpdate', function (e) {
		e.preventDefault();
		$('div.updateEnabled').removeClass('updateEnabled');
		$('#wb-editor').hide();
	});
	$scope.updateValue = "";
	$scope.singleModel = 0;

	$scope.getStyle = function (styleId) {
		return $rootScope.getProductStyle(styleId);
	}

	$scope.getStylesOnCanvas = function () {
		var foundStyles = [];

		angular.forEach($scope.rightPanelItems, function (positions, styleId) {
			angular.forEach(positions, function (position) {
				foundStyles.push({
					style: $scope.getStyle(styleId),
					position: position
				});
			});
		});

		return foundStyles;
	}
	$scope.stylesOnCanvas = []

	$scope.$watch('rightPanelItems', function (storedLayout) {
		if ($rootScope.productStyles) {
			$scope.stylesOnCanvas = $scope.getStylesOnCanvas();
		}
	}, true);

	$rootScope.$watch('productStyles', function (styles) {
		if ($scope.rightPanelItems) {
			$scope.stylesOnCanvas = $scope.getStylesOnCanvas();
		}
	}, true);

	$scope.filterdata = [];

	$scope.$watch('cat', function (val1, val2) {
		//if
		$scope.filterdata.push({
			"cat": "catalog",
			"items": val1
		});
	}, true);

	$scope.open = function () {
		$scope.shouldBeOpen = true;
		$scope.updateValue = "0";
	};
	$scope.close = function () {
		$('.updateEnabled').text($scope.updateValue);
		$('input.updateEnabled[type="text"]').val($scope.updateValue);
		$('div.updateEnabled').removeClass('updateEnabled');
		$scope.shouldBeOpen = false;
	};
	$scope.opts = {
		backdropFade: false,
		dialogFade: true,
		dialogClass: 'modal-numpad drop-shadow'
	};
	$scope.updateQty = function (val) {
		$scope.updateValue = $scope.updateValue == "0" ? val : $scope.updateValue + "" + val;
	};
	$scope.clearQty = function () {
		$scope.updateValue = "0";
	};
	$scope.clearOne = function () {
		$scope.updateValue = $scope.updateValue.slice(0, -1) == "" ? "0" : $scope.updateValue.slice(0, -1);
	};
	$scope.getPopoverdata = function () {
		return $('#wb-assortment-filter').html();
	}

	$scope.clearCanvas = function () {
		//Clear styles on the canvas
		$scope.rightPanelItems = {};
		$scope.stylesOnCanvas = [];
		$scope.storage = [];
		$('#wb-editor').hide();

		//Clear layout persistence.
		whiteboardLayout.remove($scope.assortmentId);
	}

	$rootScope.$on('productRemovedFromAssortment', function(event, id){
		var temp = whiteboardLayout.get($scope.assortmentId);
		delete temp[id];
		$scope.rightPanelItems = temp;
		whiteboardLayout.save($scope.assortmentId, temp);
	});

	$scope.displayComfirmationPopup = false;


	$scope.showComfirmationPopup = function (options) {
		if (options === true) {
			$scope.displayComfirmationPopup = true;
		} else {
			$scope.displayComfirmationPopup = false;
		}
	};

	$scope.removeAllProductStylesFromAssortment = function () {
		$scope.clearCanvas();
		//Remove all styles from the assortment
		$rootScope.currentAssortment.removeAllProductStyles();
		$scope.showComfirmationPopup(false);
	};

	//<< AssortmentWaves Functionality >>//

	//Modal for New Assortment
	$scope.showNewAssortmentModal = false;

	$scope.openAssortmentNewModal  = function () {
		$scope.showNewAssortmentModal = true;
	}
	$scope.closeAssortmentNewModal  = function () {
		$scope.showNewAssortmentModal = false;
	}

	//List all assortments by group
	$scope.getAssortments = function(){
		assortment.getAssortment($scope.assortmentId).then(function(current){
			assortment.getAssortments().then(function (infoAssorment) {

				$scope.listOfAssortments =  _.filter(infoAssorment.data, function(name){
					return name.group == current.group;
				});

				//We need to know the position INDEX of the current Active tab
				//_.findWhere = find inside $scope.listOfAssortments an object with the same ID of our assortment
				//and after that _.indexOf return the position INDEX of that object inside $scope.listOfAssortments
				$scope.indexTabActive = _.indexOf($scope.listOfAssortments,_.findWhere($scope.listOfAssortments,{id:$scope.assortmentId}))+1;

				//Set the number of tabs to this varible
				$scope.numberTabs = $scope.listOfAssortments.length;

				//Get the size of contentTaps
				$scope.sizeContentTabs = $scope.numberTabs * 165;

                // ask if the tabs width is major than 675
                if($scope.sizeContentTabs > 500){
                    $scope.sizeContentTabs = 500;
                }
                //set the size related with current tabs.
                $('.taps-content').width($scope.sizeContentTabs);

				if($scope.numberTabs > 3){
					$scope.showRightNavTabs = true;
				}
				if($scope.indexTabActive > 3){
					$scope.showLeftNavTabs = true;
					$scope.positionStart = -($scope.indexTabActive -3) * 165;



				}
				totalTabsRight = $scope.numberTabs - $scope.indexTabActive;
				totalTabsLeft = ($scope.numberTabs - totalTabsRight)-1 ;

				if(totalTabsRight == 0){
					$scope.showRightNavTabs = false;
				}


			});


		});
	}

	$scope.getAssortments();

	$scope.isActive = function(assortmetID){
		var active = (assortmetID === $scope.assortmentId);
		return active ? "tab-active" : "";
	}


    $scope.navegationTabs ={

        next : function(){
            if ($('.taps-content ul').is(':animated'))
            {
                return false;
            }
            if($scope.indexTabActive == 1 || $scope.indexTabActive == 2 || $scope.indexTabActive == 3){
                if($scope.indexTabActive == 1){
                    if(totalTabsRight <= 3){
                        $scope.showRightNavTabs = false;
                    }
                }
                if($scope.indexTabActive == 2){
                    if(totalTabsRight <= 2){
                        $scope.showRightNavTabs = false;
                    }
                }
                if(totalTabsRight <= 1){
                    $scope.showRightNavTabs = false;
                }
            }else{
                if(totalTabsRight <= 1){
                    $scope.showRightNavTabs = false;
                }
            }
            if(totalTabsRight > 0){
                $('.taps-content ul').stop(true, true).animate({
                    'left': '-=165px'
                },400, function(){
                    totalTabsRight--;
                    totalTabsLeft++;
                });
            }
            $scope.showLeftNavTabs = true;
        },
        prev: function(){
            if ($('.taps-content ul').is(':animated'))
            {
                return false;
            }
            console.log(totalTabsLeft);
            if($scope.indexTabActive == 1 || $scope.indexTabActive == 2 || $scope.indexTabActive == 3){
                if($scope.indexTabActive == 1){
                    if( totalTabsLeft <= 1){

                        $scope.showLeftNavTabs = false;
                    }
                }
                if($scope.indexTabActive == 2){
                    if( totalTabsLeft <= 2){
                        $scope.showLeftNavTabs = false;
                    }
                }
                if($scope.indexTabActive == 3){
                    if( totalTabsLeft <= 3){
                        console.log('haha');
                        $scope.showLeftNavTabs = false;
                    }
                }
            }else{
                if(totalTabsLeft <= 3){
                    $scope.showLeftNavTabs = false;
                }
            }

            if(totalTabsLeft > 0){
                $('.taps-content ul').stop(true, true).animate({
                    'left': '+=165px'
                },400,function(){
                    totalTabsLeft--;
                    totalTabsRight++;

                });
            }

            $scope.showRightNavTabs = true;
        }


    }

	$scope.openAssortment = _.debounce(function (assortmentId) {

		if(assortmentId !==$scope.assortmentId){
			$rootScope.loading = true;
			$location.path("/assortment/edit/" + assortmentId + "/whiteboard");
		}
	}, 1000, true);

    $scope.$on('showPopUpOnLongHold', function (event, element, assortment) {
        $rootScope.optionsPopUpOnLongHold(event, element, assortment);

    });


	/*Top navbar icons */
	$scope.$root.navElements = [
		{
			"text": "Browse Catalogs",
			"icon": "book-icon",
			"action": $scope.$root.openCatalogListModal,
			"type": "iconNavLink"
		},
		{
			"text": "Search",
			"icon": "search-icon",
			"type": "iconNavLink",
			"action": $scope.$root.searchModal.open
		},
		{
			"text": "Linesheet",
			"icon": "whiteboard-icon",
			"type": "iconNavLink",
			"link": $scope.linesheetLink
		}
	];
});

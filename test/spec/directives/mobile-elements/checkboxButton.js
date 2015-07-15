/*'use strict';

describe('Directive: checkboxButton', function () {
  var $scope, $compile,ctrl;
  beforeEach(module('conductivEcatalogApp'));
  beforeEach(inject(function (_$rootScope_, _$compile_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
  }));

  it('should properly compile along with data binding', function () {
	//compile the directive
	var element = $compile('<checkbox-button ng-model="loginInfo.rememberPass">Remember Password</checkbox-button>')($scope);
	// apply scope as initially checked
	$scope.$apply(function() {
		$scope.loginInfo = {
			rememberPass : true
		};
        return $scope;
    });
    //check for binding
	var checkBoxValue = angular.element(element).find('input[type=checkbox]').is(':checked');
	expect(checkBoxValue).toEqual(true);

	//alter the scope to un-check
	$scope.$apply(function() {
		$scope.loginInfo.rememberPass = false;
        return $scope;
    });

	//check for the same thing again
	checkBoxValue = angular.element(element).find('input[type=checkbox]').is(':checked');
	expect(checkBoxValue).toEqual(false);
  });

  it('should update model on changing the state of checkbox', function () {
  	//compile the directive
	var element = $compile('<checkbox-button ng-model="loginInfo.rememberPass">Remember Password</checkbox-button>')($scope);
	// apply scope as initially un-checked
	$scope.$apply(function() {
		$scope.loginInfo = {
			rememberPass : false
		};
        return $scope;
    });
	//check the checkbox manually
	angular.element(element).find('input[type=checkbox]').click();
	//Now expecting the model to be checked
	expect($scope.loginInfo.rememberPass).toEqual(true);

	//un-check the checkbox manually
	angular.element(element).find('input[type=checkbox]').click();
	//Now expecting the model to be un-checked
	expect($scope.loginInfo.rememberPass).toEqual(false);
  });

});*/

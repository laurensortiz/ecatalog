'use strict';

angular.module('conductivEcatalogApp').controller('LoginCtrl', function ($rootScope, $scope, indexeddb, authentication, $location, authService, httpCapi, fileSync, $timeout, SyncManager, SyncConfig, network) {

  httpCapi.resetWebServices();

  $scope.loginInfo = {
    username: '',
    password: '',
    organization: '',
    rememberUsernameOrg: false,
    rememberPass: false,
    passwordMd5: '',
    error: ''
  };

  $scope.$watch('loginInfo.rememberUsernameOrg', function (value) {
    if (value === false) {
      $scope.loginInfo.rememberPass = false;
    }
  });

  $scope.prefillForm = function () {
    $scope.loginInfo = authentication.getSavedUserInfo();
  }

  $scope.authenticate = function () {
    $scope.loginInfo.passwordMd5 = CryptoJS.MD5("" + $scope.loginInfo.password).toString();
    var connected = network.canConnect();
    if (connected === true) {
      $scope.loginOnline();
    } else {
      $scope.loginOffline();
    }
  }

  $scope.loginOnline = function () {
    var authDeferred = authentication.loginOnline($scope.loginInfo.username, $scope.loginInfo.organization, $scope.loginInfo.password);
    authDeferred.done(function () {
      //Store the login credentials to localStorage
      $scope.loginInfo.error = "";

      //unique userID is stored to localStorage for use when saving to local storage in offline mode with multiple users.
      var userID = $scope.loginInfo.username + $scope.loginInfo.organization;
      localStorage.setItem("userID", userID);

      if ($scope.loginInfo.rememberUsernameOrg && $scope.loginInfo.rememberPass) {
        var isLogged = true;
        localStorage.setItem("isLog", JSON.stringify(isLogged));
        localStorage.setItem("auth", JSON.stringify($scope.loginInfo));
      }
      else if ($scope.loginInfo.rememberUsernameOrg) {
        $scope.loginInfo.password = "";
        localStorage.setItem("auth", JSON.stringify($scope.loginInfo));
      }
      else {
        $scope.loginInfo = {
          username: '',
          password: '',
          organization: '',
          rememberUsernameOrg: false,
          rememberPass: false,
          passwordMd5: '',
          error: ''
        };
        localStorage.setItem("auth", JSON.stringify($scope.loginInfo));
      }
      authService.loginConfirmed();

      $rootScope.loading = true;
      $rootScope.progressBarStatus = 1;
      SyncConfig.init();
      SyncManager.sync().then(function () {
        fileSync.syncApplication(function () {
          $timeout(function () {
            $rootScope.loading = false;
            $rootScope.progressBarStatus = null;
            $location.path("/home/menu");
          }, 1000);
        });
      });
    });

    authDeferred.fail(function () {
      $scope.$apply(function () {
        $scope.loginInfo.error = "Login failed. Please try again";
      });
    });
  }

  $scope.loginOffline = function () {
    var auth = localStorage.getItem("auth");
    var jsonAuth = JSON.parse(auth);
    if (jsonAuth !== null && jsonAuth.passwordMd5 === $scope.loginInfo.passwordMd5 && jsonAuth.username === $scope.loginInfo.username && jsonAuth.organization === $scope.loginInfo.organization) {
      var isLogged = true;
      localStorage.setItem("isLog", JSON.stringify(isLogged));
      $location.path("/home/menu");

    } else {
      $scope.loginInfo.error = "Login failed. Please connect to the Internet for initial catalog download.";
    }
  }

  $scope.prefillForm();

  $scope.tenantLogo = function () {
    var loginInfo = authentication.getSavedUserInfo();
    var returnImage = "images/conductiv_logo_login.png";
    if (loginInfo !== null && loginInfo !== undefined) {
      var organization = loginInfo.organization;
      if (organization !== undefined && organization !== null && organization.trim() !== '') {
        returnImage = httpCapi.generateFilesUrl() + "/" + organization + "/Styles/images/logo.png";
      }
    }
    return returnImage;
  }
});

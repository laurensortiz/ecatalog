'use strict';

angular.module('conductivEcatalogApp').factory('authentication', ['base64', 'httpCapi', 'network', '$rootScope', '$http',
  function (Base64, httpCapi, network, $rootScope, $http, $q, SyncManager) {

    var iv = "12345678901234567890";
    var key = "this_is_the_secret_algorithm_key";
    var auth = {};

    auth.header = '';
    auth.tenant = '';


    auth.isUserLoggedIn = function () {
      var existingAuthHeader = sessionStorage['auth-header'];
      if (existingAuthHeader) {
        return true;
      } else {
        return false;
      }
    }

    auth.generateHeader = function (username, organization, password) {
      var authHeader = username + "@" + organization + ":" + password;
      auth.tenant = organization;

      var encoded = Base64.encode(authHeader);
      auth.header = "Basic " + encoded;
      //$http.defaults.headers.common.Authorization = 'Basic ' + encoded;
      return auth;
    }

    auth.loginOnline = function (username, organization, password) {

      var deferredObj = new $.Deferred();

      var authentication = auth.generateHeader(username, organization, password);


      $.ajax({
        url: ecatalog_config.apiServer + "/capi/rest/login",
        beforeSend: function (req) {
          req.setRequestHeader('Authorization', authentication.header);
        },
        type: "POST",
        dataType: "json",
        success: function (data) {
          httpCapi.resetWebServices();
          sessionStorage.setItem('auth-header', authentication.header);
          sessionStorage.setItem('tenant', authentication.tenant);
          sessionStorage.setItem('username', username);
          $rootScope.loggedIn = true;
          deferredObj.resolve(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
          deferredObj.reject([jqXHR, textStatus, errorThrown]);
        }
      });

      return deferredObj;

    }

    auth.setLatestUser = function (username) {
      localStorage['latestUser'] = username
    }

    auth.clearLatestUser = function () {
      localStorage['latestUser'] = '';
    }
    /*
     * This method forms the JS object to be stored in indexeddb according to the options chosen on login form.
     */
    auth.getFormJson = function (username, organization, password, rememberUsernameOrg, rememberPass, passwordMd5) {
      var jsonStr = '';
      if (rememberPass && rememberUsernameOrg) {
        jsonStr = {
          "username": username,
          "passwordMd5": passwordMd5,
          "organization": organization,
          "password": auth.encrypt(password)
        }
        auth.setLatestUser(username);
      } else if (rememberPass) {
        jsonStr = {
          "username": username,
          "passwordMd5": passwordMd5,
          "password": auth.encrypt(password)
        }
        auth.setLatestUser(username);
      } else if (rememberUsernameOrg) {
        jsonStr = {
          "username": username,
          "passwordMd5": passwordMd5,
          "organization": organization
        }
        auth.setLatestUser(username);
      } else {
        jsonStr = {
          "username": username,
          "passwordMd5": passwordMd5
        }
        auth.clearLatestUser();
      }
      return jsonStr;

    }

    auth.md5 = function (data) {
      return CryptoJS.MD5(data, {
        iv: iv,
        key: key
      }).toString();
    }

    auth.encrypt = function (data) {
      return CryptoJS.AES.encrypt(data, "mytopsecret", {
        iv: iv,
        key: key
      }).toString();
    }

    auth.decrypt = function (data) {
      var encodedHash = CryptoJS.AES.decrypt(data, "mytopsecret", {
        iv: iv,
        key: key
      });
      return encodedHash.toString(CryptoJS.enc.Utf8);
    }

    auth.getSavedUserInfo = function () {
      var info = localStorage.getItem("auth");
      if (info !== undefined && info !== null) {
        info = JSON.parse(info);
      }
      return info;
    }

    auth.isLoggedIn = function () {
      var value = sessionStorage.getItem('auth-header');
      var auth = localStorage.getItem("isLog");
      var offlineVerification = JSON.parse(auth);
      var connected = network.canConnect();

      if (connected === true) {
        return !(value === undefined || value === null);
      } else {
        return !(offlineVerification === undefined || offlineVerification === null);
      }
    }
    auth.logout = function () {
      httpCapi.resetWebServices();
      sessionStorage.removeItem('auth-header');
      sessionStorage.removeItem('tenant');
      var connected = network.canConnect();

      if (connected == true) {
      } else {
        localStorage.removeItem("isLog");
      }
    }

    auth.getTenant = function () {
      return sessionStorage['tenant'];
    }

    auth.currentUser = function () {
      if (sessionStorage.getItem('username')) {
        return sessionStorage.getItem('username');
      } else {
        if (localStorage.getItem("auth")) {
          var info = localStorage.getItem("auth");
          return info["username"];
        } else {
          return false;
        }
      }
    }

    return auth;

  }]);
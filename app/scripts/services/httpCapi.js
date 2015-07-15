'use strict';

angular.module('conductivEcatalogApp').factory('httpCapi', function ($http, $q, $timeout, Environment, network) {

  //eventually this service can hold many convinience functions for making calls to api server
  var service = {};

  // Generate the base file storage url pointing to capi
  service.baseRemoteFileUrl = ecatalog_config.apiServer + "/capi/rest/files";

  service.getRelativePath = function (remoteUrl) {
    return remoteUrl.replace(service.baseRemoteFileUrl, '');
  }

  service.translateToLocalFileUrl = function (remoteUrl) {
    return service.generateFilesUrl() + service.getRelativePath(remoteUrl)
  }

  service.resetWebServices = function () {
    sessionStorage.removeItem("generatedBaseApiUrl");
    sessionStorage.removeItem("generatedFileUrl");
  };

  service.generateBaseApiUrl = function () {
    if (sessionStorage.getItem("generatedBaseApiUrl")) {
      return sessionStorage.getItem("generatedBaseApiUrl");
    }
    var path = "";
    if (sessionStorage.getItem('tenant')) {
      path = ecatalog_config.apiServer + "/capi/rest/v2/" + sessionStorage['tenant'];
    } else {
      path = ecatalog_config.apiServer + "/capi/rest/v2/";
    }
    sessionStorage.setItem("generatedBaseApiUrl", path);
    return path;
  };

  service.generateFilesUrl = function () {
    if (sessionStorage.getItem("generatedFileUrl") && sessionStorage.getItem('tenant')) {
      return sessionStorage.getItem("generatedFileUrl");
    }
    var path = "";
    if (ecatalog_config.debugLocal) {
      path = "/data";
    } else if (Environment.isIOS) {
      path = "data";
    } else {
      path = ecatalog_config.apiServer + "/TenantImages";
    }
    sessionStorage.setItem("generatedFileUrl", path);
    return path;
  };

  service.generateCommonAPIHeaders = function () {
    return {
      "Authorization": sessionStorage['auth-header'],
      "Content-Type": "application/json"
    };
  };
  //function to retry a failed download
  function retryDownload(remotePath, filePath, deferredSaveStatus, retryVal) {
    SaveLocalFile(remotePath, filePath, function () {
      $timeout(function () {
        deferredSaveStatus.resolve();
      }, 10);
    }, function () {
      retryVal++;
      if (retryVal < 5) {
        $timeout(function () {
          retryDownload(remotePath, filePath, deferredSaveStatus, retryVal);
        }, 1500);
      } else {
        deferredSaveStatus.reject();
      }
    });
  }

  service.saveFileResource = function (fileObj) {
    if (Environment.isIOS) {
      AutoSleep('off');
    }

    var path = "";
    var filePath = "";
    var remotePath = "";
    if (fileObj.remoteFilePath) {
      remotePath = fileObj.remoteFilePath;
      var a = document.createElement('a');
      a.href = fileObj.remoteFilePath;
      var fileNameWithBucket = a.pathname;
      path = a.pathname.substring(a.pathname.indexOf('/', 1))
      filePath = "/data/" + path;

    } else if (fileObj.relativePath) {
      remotePath = "https://s3-us-west-1.amazonaws.com/conductiv-ecat-files/" + fileObj.relativePath;
      path = fileObj.relativePath;
      filePath = "/data/" + path;
    } else if (fileObj.relativeTenantPath) {
      path = sessionStorage['tenant'] + fileObj.relativeTenantPath;
      filePath = "/data/" + path;
      remotePath = "https://s3-us-west-1.amazonaws.com/conductiv-ecat-files/" + path;
    }
    var deferredSaveStatus = $q.defer();
    if (Environment.isIOS) {
      var retryVal = 0;
      retryDownload(remotePath, filePath, deferredSaveStatus, retryVal);
    } else {
      deferredSaveStatus.resolve();
    }
    if (Environment.isIOS) {
      AutoSleep('on');
    }
    return deferredSaveStatus.promise;
  };

  service.getFileResourceOrder = function (remoteFileName) {
    if (Environment.isIOS) {
      AutoSleep('off');
    }

    var promisedFilePath = new $.Deferred();

    //save to session??
    if (sessionStorage.getItem("file-path|" + remoteFileName)) {
      promisedFilePath.resolve(sessionStorage.getItem("file-path|" + remoteFileName));

      return promisedFilePath;
    } else {
      var fileStart = remoteFileName.split('/', 1);

      if (network.canConnect() || fileStart[0] === 'data') {

        sessionStorage.setItem("file-path|" + remoteFileName, remoteFileName);
        promisedFilePath.resolve(remoteFileName);

      } else {

        var a = document.createElement('a');
        a.href = remoteFileName;
        var fileNameWithoutBucket = '/' + a.pathname.split('/').slice(4).join('/');
        sessionStorage.setItem("file-path|" + remoteFileName, service.generateFilesUrl() + fileNameWithoutBucket);
        promisedFilePath.resolve(service.generateFilesUrl() + fileNameWithoutBucket);
      }
    }
    if (Environment.isIOS) {
      AutoSleep('on');
    }
    return promisedFilePath;
  };

  service.getFileResource = function (remoteFileName) {
    console.warn("httpCapi::getFileResource is deprecated. Use httpCapi::translateToLocalFileUrl")
    if (Environment.isIOS) {
      AutoSleep('off');
    }

    var promisedFilePath = new $.Deferred();
    //save to session??
    if (localStorage.getItem("file-path|" + remoteFileName)) {
      promisedFilePath.resolve(localStorage.getItem("file-path|" + remoteFileName));
      return promisedFilePath;
    } else {
      var a = document.createElement('a');
      a.href = remoteFileName;
      var fileNameWithoutBucket = '/' + a.pathname.split('/').slice(4).join('/');

      localStorage.setItem("file-path|" + remoteFileName, service.generateFilesUrl() + fileNameWithoutBucket);
      promisedFilePath.resolve(service.generateFilesUrl() + fileNameWithoutBucket);
    }
    if (Environment.isIOS) {
      AutoSleep('on');
    }
    return promisedFilePath;
  };

  // Public API here
  return service;
});

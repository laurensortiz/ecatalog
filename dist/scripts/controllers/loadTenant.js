'use strict';

angular.module('conductivEcatalogApp').controller('LoadTenantCtrl', function ($scope, s3directoryService, $rootScope, $location, $timeout) {
    $scope.progressBar = {
        value: 0,
        type: 'success'
    };
    $scope.status = "Checking for updates";
    var foldersToCheckForUpdates = ["/Templates", "/Widget_Definitions"];
    var aggregatedRecentlyChangedFiles = [];

    var addFilesToQueueIfNew = function (folderPath) {
        var fileListDeferred = new $.Deferred();
        s3directoryService.getContentListOfTenantFolder(folderPath).then(function (fileList) {
            fileListDeferred.notify();
            var recentlyChangedFiles = _.filter(fileList, function (file) {
                var lastUpdateString = localStorage.getItem("last-time-updated:" + file.relativeTenantPath);
                var isUpdated = false;
                if (lastUpdateString !== undefined && lastUpdateString !== null) {
                    var lastUpdate = new Date(lastUpdateString);
                    if (file.lastModified < lastUpdate) {
                        isUpdated = true;
                    }
                } else {
                    isUpdated = true;
                }
                return isUpdated;
            });
            aggregatedRecentlyChangedFiles.push.apply(aggregatedRecentlyChangedFiles, recentlyChangedFiles);

            fileListDeferred.resolve();

        }, function () {
            fileListDeferred.reject();
        });
        return fileListDeferred;
    };

    var deferredFolderListResults = [];
    _.each(foldersToCheckForUpdates, function (folderPath) {
        var deferredList = addFilesToQueueIfNew(folderPath);
        deferredList.progress(function () {
            $scope.progressBar.value += 100 * (1 / foldersToCheckForUpdates.length);
        });
        deferredFolderListResults.push(deferredList);
    });

    $.when.apply(null, deferredFolderListResults).done(function () {
        if (aggregatedRecentlyChangedFiles.length > 0) {
            $scope.status = "Updating files";
            $scope.type = 'info';
            $scope.progressBar.value = 0;
            var downloadDeferredStatus = s3directoryService.downloadListOfFiles(aggregatedRecentlyChangedFiles);
            var fractionOfDownloadProgress = 100 * (1 / aggregatedRecentlyChangedFiles.length);
            downloadDeferredStatus.progress(function () {

                $scope.progressBar.value += fractionOfDownloadProgress;
                $timeout(function () {
                    $scope.$digest();
                });
            });
            downloadDeferredStatus.done(function () {
                for (var index = 0; index < aggregatedRecentlyChangedFiles.length; index++) {
                    var fileInfo = aggregatedRecentlyChangedFiles[index];
                    localStorage.setItem("last-time-updated:" + fileInfo.relativeTenantPath, fileInfo.lastModified);
                }
                $scope.status = "Update complete";
                $scope.progressBar.value = 100;
                setTimeout(function () {
                    $location.path('home/menu');
                }, 300);
            });

        } else {
            $scope.status = "";
            setTimeout(function () {
                $location.path('home/menu');
            }, 300);
        }
    });
});

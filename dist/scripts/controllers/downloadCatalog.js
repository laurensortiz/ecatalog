'use strict';

angular.module('conductivEcatalogApp')
    .controller('DownloadCatalogCtrl', function ($scope, catalog, $routeParams, s3directoryService, $location, $timeout, Environment) {
        if (Environment.isIOS) {
            $scope.progressBar = {
                value: 0,
                type: 'success'
            };
            $scope.status = "Checking for updates";

            var foldersToCheckForUpdates = [
                "/Catalogs/S14_PRO_SKATE"
            ];

            catalog.getProductStyleImages($routeParams.catalogId).then(function (productStyles) {
                var aggregatedRecentlyChangedFiles = [];

                for (var index = 0; index < productStyles.length; index++) {
                    var style = productStyles[index];
                    var imageUrl = style.links.image;
                    var fileName = imageUrl.slice(imageUrl.lastIndexOf('/') + 1, imageUrl.length);
                    var relativePath = "/Products/" + fileName;
                    var lastUpdateString = localStorage.getItem("last-time-updated:" + relativePath);
                    var isUpdated = false;
                    if (lastUpdateString !== undefined && lastUpdateString !== null) {
                        var lastUpdate = new Date(lastUpdateString);
                        if (style.lastModified < lastUpdate) {
                            isUpdated = true;
                        }
                    } else {
                        isUpdated = true;
                    }
                    if (isUpdated) {
                        aggregatedRecentlyChangedFiles.push({name: fileName, lastModified: style.lastModified, relativeTenantPath: relativePath});
                    }
                }

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
                            $location.path('catalog/master/' + $routeParams.catalogId + '/browse');
                        });

                    } else {
                        $scope.status = "";
                        $location.path('catalog/master/' + $routeParams.catalogId + '/browse');
                    }
                });
            });
        } else {
            $location.path('catalog/master/' + $routeParams.catalogId + '/browse');
        }
    });

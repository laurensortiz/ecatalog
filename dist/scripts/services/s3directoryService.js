'use strict';

angular.module('conductivEcatalogApp').factory('s3directoryService', function (httpCapi, $http, $q) {
    var service = {};

    service.getContentListOfTenantFolder = function (folderPath) {
        var fileList = [];
        var subFoldersToDownload = [];
        var deferredAggregateList = new $.Deferred();

        var getContentsOfFolder = function (folder, levelsDeep) {
            if (!levelsDeep) {
                //not sure how I'll use this yet. Sanity escape hatch maybe?
                levelsDeep = 0;
            }

            var deferredRecursiveFolderList = new $.Deferred();
            var resolveRecursiveFolderList = function () {
                //I will add more information here soon
                //like the most recent modified tag
                deferredRecursiveFolderList.resolve();
            }

            var subFolderDeferredLists = [];
            $http({
                method: "GET",
                url: httpCapi.generateBaseApiUrl() + "/" + "storage" + folder.relativeTenantPath,
                headers: {
                    "Authorization": sessionStorage['auth-header']
                }
            }).then(function (response) {
                    var folderInfo = response.data;
                    var relativeTenantPathPrefix = folderInfo.prefix.slice(folderInfo.prefix.indexOf('/'));

                    if (folderInfo.truncated) {
                        var folder = {};
                        folder.relativeTenantPath = relativeTenantPathPrefix + "?marker=" + folderInfo.marker;
                        subFolderDeferredLists.push(getContentsOfFolder(folder, levelsDeep));
                    }

                    _.each(folderInfo.folders, function (folder) {
                        folder.relativeTenantPath = relativeTenantPathPrefix + folder.name;
                        subFolderDeferredLists.push(getContentsOfFolder(folder, levelsDeep + 1));
                    });

                    _.each(folderInfo.files, function (file) {
                        file.relativeTenantPath = relativeTenantPathPrefix + file.name;
                        file.lastModified = new Date(file.lastModified);
                    })

                    fileList.push.apply(fileList, folderInfo.files);

                    if (subFolderDeferredLists.length > 0) {
                        /*var timeout = setTimeout(function() {
                         deferredRecursiveFolderList.reject();
                         //we should go ahead and cancel the remaing downloads at this point

                         }, subFolderDeferredLists.length * 3500 + (1000 / (levelsDeep + 1)));*/

                        $.when.apply(null, subFolderDeferredLists).done(function () {
                            //clearTimeout(timeout);
                            resolveRecursiveFolderList();
                        });
                    } else {
                        resolveRecursiveFolderList();
                    }
                });

            return deferredRecursiveFolderList;
        };

        var folderObj = {
            relativeTenantPath: folderPath
        };

        getContentsOfFolder(folderObj).done(function () {
            deferredAggregateList.resolve(fileList);
        });

        return deferredAggregateList;
    }

    service.downloadListOfFiles = function (fileList) {
        var deferredAggregateDownloadProgress = new $.Deferred();
        var deferredDownloadList = [];

        var currentIndex = 0;

        var downloadNextFile = function () {
            var file = fileList[currentIndex];
            //console.log("imitating download for file: " + file.relativeTenantPath);
            var deferredDownloadProgress = new $.Deferred();
            deferredDownloadList.push(deferredDownloadProgress);
            httpCapi.saveFileResource(file).then(function () {
                //console.log("another file saved!");
                deferredAggregateDownloadProgress.notify(file);
                deferredDownloadProgress.resolve();
                currentIndex++;
                if (currentIndex === fileList.length) {
                    //console.log("all files saved!");
                    deferredAggregateDownloadProgress.resolve();
                } else {
                    downloadNextFile();
                }
            });
        }
        downloadNextFile();
        return deferredAggregateDownloadProgress;

    };
    // Public API here
    return service;
});

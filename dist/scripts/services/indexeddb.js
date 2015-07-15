'use strict';

angular.module('conductivEcatalogApp').factory('indexeddb', function () {

    var dbService = {}; //the service object
    var dbHandle = {};	//the handle to the database in indexeddb

    dbService.open = function () {

        var deferredObj = new $.Deferred();

        dbHandle = new DB("db", "loginStrore", "username");
        dbHandle.open().fail(function () {
            deferredObj.reject(false);
        }).done(function () {
                //console.log("dbHandle.open() PASS");
                deferredObj.resolve(true);
            });

        return deferredObj;
    }

    dbService.setData = function (data) {
        var deferredObj = new $.Deferred();

        dbHandle.setData(data).fail(function (err, event) {
            //console.log("dbHandle.setData() FAIL");
            deferredObj.reject(err, event);
        }).done(function () {
                //console.log("dbHandle.setData() PASS");
                deferredObj.resolve(true);
            })

        return deferredObj;
    }

    dbService.getData = function (username) {
        var deferredObj = new $.Deferred();

        dbHandle.getData(username).fail(function (err, event) {
            //console.log("dbHandle.getData() FAIL");
            deferredObj.reject(err, event);
        }).done(function (row) {
                //console.log("dbHandle.getData() PASS " + JSON.stringify(row));
                deferredObj.resolve(row);
            })

        return deferredObj;
    }

    dbService.delete = function () {

        //console.log("in db dbService.delete" + dbService.dbName);

        var deferredObj = new $.Deferred();

        dbHandle.
            delete().fail(function (err, event) {
                //console.log("dbService.delete() FAIL " + dbService.dbName);
                deferredObj.reject(err, event);
            }).done(function (row) {
                //console.log("dbService.delete() PASS " + dbService.dbName);
                deferredObj.resolve(true);
            });

        return deferredObj;

    }

    dbService.putData = function (data) {
        var deferredObj = new $.Deferred();

        dbHandle.putData(data).fail(function (err, event) {
            //console.log("dbHandle.putData(data, key) FAIL");
            deferredObj.reject(err, event);
        }).done(function () {
                //console.log("dbHandle.putData(data, key) PASS");
                deferredObj.resolve(true);
            })

        return deferredObj;
    }

    return dbService;

});

function DB(dbName, storeName, key, indexes) {

    this.key = key;
    this.dbName = dbName;
    this.storeName = storeName;
    this.indexes = indexes

    this.open = function () {

        // Simply open the database once so that it is created with the required tables
        var deferredObj = new $.Deferred();

        $.indexedDB(dbName, {
            "version": 1,
            "schema": {
                "1": function (versionTransaction) {

                    var objectStore = versionTransaction.createObjectStore(storeName, {
                        // Options to create object store.
                        "keyPath": key // the path of key in the object, defaults to key that has to be specified separately
                    });

                    objectStore.createIndex(key, /*Optional*/
                        {

                        });


                }
            }
        }).then(function (db, event) {
                return deferredObj.resolve();
            }, function (err) {
                return deferredObj.fail();
            });

        return deferredObj;
    }

    this.setData = function (data) {
        //data = 	{"username" : "username21122","md5" : "md5"};
        //console.log("In setData");

        //console.log("dbName " + dbName + " storeName " + storeName);

        var objectStore = $.indexedDB(dbName).objectStore(storeName);

        var deferredObj = new $.Deferred();

        //var transaction = objectStore.add({"username" : "username122","md5" : "md5"});
        var transaction = objectStore.add(data);

        transaction.then(function () {
            //console.log("setData transaction success for :");
            deferredObj.resolve(true);
        }, function (err, event) {
            //console.log("setData transaction failed for :" );
            //console.log(err);
            deferredObj.reject(err);
            //return deferredObj.reject();
        });

        return deferredObj;

    }

    this.getData = function (searchKey) {

        //console.log("getData for " + searchKey);
        var objectStore = $.indexedDB(dbName).objectStore(this.storeName);

        var transaction = objectStore.get(searchKey);

        var deferredObj = new $.Deferred();

        transaction.then(function (row) {

            if (typeof row === 'undefined') {
                //console.log("getData transaction failed :" + searchKey);
                deferredObj.reject(false, false);
            }
            else {
                //console.log("getData transaction success for Object:" + JSON.stringify(row));
                deferredObj.resolve(row);
            }
        }, function (err, event) {
            //console.log("getData transaction failed :" + searchKey);
            //console.log(err);
            deferredObj.reject(err, event);
        });

        return deferredObj;

    }

    this.delete = function () {
        // Delete the database
        //console.log("in delete :" + dbName);

        var deferredObj = new $.Deferred();

        response = $.indexedDB(dbName).deleteDatabase();

        response.then(function () {
            //console.log("delete success for :" + this.dbName);
            deferredObj.resolve(true);
        }, function (err, event) {
            //console.log("delete failed for :" + this.dbName);
            //console.log(err);
            deferredObj.reject(err, event);
            //return deferredObj.reject();
        });

        return deferredObj;
    }

    this.putData = function (data) {
        //console.log("In putData");

        //console.log("key " + key + " data " + JSON.stringify(data));

        var objectStore = $.indexedDB(dbName).objectStore(storeName);

        var deferredObj = new $.Deferred();

        //var transaction = objectStore.add({"username" : "username122","md5" : "md5"});
        var transaction = objectStore.put(data);

        transaction.then(function () {
            //console.log("putData transaction success for :" + JSON.stringify(data));
            deferredObj.resolve(true);
        }, function (err, event) {
            //console.log("putData transaction failed for :" + JSON.stringify(data));
            //console.log(err, event);
            deferredObj.reject(event);
            //return deferredObj.reject();
        });

        return deferredObj;
    }

}
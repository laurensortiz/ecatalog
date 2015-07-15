/*
 This is the Lawnchair Adapter for the Conductiv WebKit Application
 */
Lawnchair.adapter('conductiv-webkit', (function () {

    return {
        valid: function () {
            var ua = navigator.userAgent.toLowerCase(),
                isValid = ((ua.indexOf("conductivmobileandroid") > 0) === true || (ua.indexOf("conductivmobileios") > 0) === true);
            return isValid;
        },
        init: function () {
      //console.info("conductiv-webkit: init NOT IMPLEMENTED");
        },
        save: function (obj, callback) {
      //console.info('conductiv-webkit: Attempting to save:');
      //console.info(obj);
            var typeAndIdSplit = obj.key.split('|')
                , type = typeAndIdSplit[0]
                , id = typeAndIdSplit[1];

            if (_.isUndefined(id)) {
                id = type;
            }
            var userID;
            if (type == "Assortment" || type == "Order") {
                userID = localStorage.getItem("userID");
            }
            else {
                userID = "Global";
            }
            PutObjectStoreItem(type, id, userID, JSON.stringify(obj), callback, function (error) {
                console.log('PutObjectStoreItem');
                console.log(key);
                console.log(error);
            });
        },
        get: function (key, callback) {
            var typeAndIdSplit = key.split('|')
                , type = typeAndIdSplit[0]
                , id = typeAndIdSplit[1];
            if (_.isUndefined(id)) {
                id = type;
            }
            var userID;

      //TODO: The adapter should not be aware of Assortments and orders!
            if (type == "Assortment" || type == "Order") {
                userID = localStorage.getItem("userID");
            }
            else {
                userID = "Global";
            }
      PutObjectStoreItem(type, id, userID, JSON.stringify(obj), callback, function (error) {
        console.log('PutObjectStoreItem');
        console.log(key);
        console.log(error);
      });
    },
    get: function (key, callback) {

      var typeAndIdSplit = key.split('|')
          , type = typeAndIdSplit[0]
          , id = typeAndIdSplit[1];

      if (_.isUndefined(id)) {
        id = type;
      }
      var userID;
      //TODO: The adapter should not be aware of Assortments and orders!
      if (type == "Assortment" || type == "Order") {
        userID = localStorage.getItem("userID");
      }
      else {
                userID = "Global";
            }
      //TODO: Need to have a function to handle the case when obj is typeof array
      //console.info('conductiv-webkit: Attempting to get');
      //console.info(key);
            GetObjectStoreItem(type, id, userID, function (data) {
                if(data){callback(JSON.parse(data).result);}
                //Need to add [0] since it looks we are saving the data in Webkit inside an array...
            }, function (error) {
                callback();
                console.log('GetObjectStoreItem');
                console.log(key);
                console.log(error);
            });
        },
        exists: function (key, callback) {
            var typeAndIdSplit = key.split('|')
                , type = typeAndIdSplit[0]
                , id = typeAndIdSplit[1];

            if (_.isUndefined(id)) {
                id = type;
            }
            var userID;
            if (type == "Assortment" || type == "Order") {
                userID = localStorage.getItem("userID");
            }
            else {
                userID = "Global";
            }
            callWebKitFunction('ObjectStoreItemExists', type, id, userID, callback, function (error) {
                console.log('RemoveObjectStoreItem');
                console.log(key);
                console.log(error);
            });
        },
        /*TO BE DONE*/
        keys: function (callback) {
            //console.info("conductiv-webkit: NOT IMPLEMENTED");
        },
        batch: function (array, callback) {
            //console.info("conductiv-webkit: NOT IMPLEMENTED");
        },
        all: function (callback) {
            //console.info("conductiv-webkit: NOT IMPLEMENTED");
        },
        remove: function (key, callback) {
            var typeAndIdSplit = key.split('|')
                , type = typeAndIdSplit[0]
                , id = typeAndIdSplit[1];

            if (_.isUndefined(id)) {
                id = type;
            }
            var userID;
            if (type == "Assortment" || type == "Order") {
                userID = localStorage.getItem("userID");
            }
            else {
                userID = "Global";
            }
            RemoveObjectStoreItem(type, id, userID, callback, function (error) {
                console.log('RemoveObjectStoreItem');
                console.log(key);
                console.log(error);
            });
            //console.info("conductiv-webkit: NOT IMPLEMENTED");
        },
        nuke: function () {
            //console.info("conductiv-webkit: NOT IMPLEMENTED");
        }
    }
})());
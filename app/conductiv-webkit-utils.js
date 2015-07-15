
function AutoSleep(shouldTurn, successCallback, errorCallback)
{
  callWebKitFunction('AutoSleep', 'PUT', [shouldTurn], function(){}, function(){});
}
function ShowToolbar(shouldShow)
{
  callWebKitFunction('ShowToolbar', 'PUT', [shouldShow], null, null);
}
function SetWebViewOfflineApp(isOffline)
{
  callWebKitFunction('SetWebViewOfflineApp', 'PUT', [isOffline], null, null);
}

function StartConnectionCallback(connectionCallback)
{
  var callbackName;

  if (connectionCallback)
  {
    if (typeof connectionCallback == 'function')
      callbackName = createCallbackFunction("connectionCallback", connectionCallback);
    else
      callbackName = timedCallback;
  }

  callWebKitFunction('StartConnectionCallback', 'PUT', [callbackName], function(){}, function(){});
}

function ShowOptionsMenu(shouldShow)
{
  callWebKitFunction('ShowOptionsMenu', 'PUT', [shouldShow], null, null);
}

function EnableElasticScroll(shouldEnable)
{
  callWebKitFunction('EnableElasticScroll', 'PUT', [shouldEnable], null, null);
}

function GetObjectStoreItem(objectType, objectId, objectUser, successCallback, errorCallback)
{
  callWebKitFunction('GetObjectStoreItem', 'GET', [objectType, objectId, objectUser], successCallback, errorCallback);
}

function RemoveObjectStoreItem(objectType, objectId, objectUser, successCallback, errorCallback)
{
  callWebKitFunction('RemoveObjectStoreItem', 'GET', [objectType, objectId, objectUser], successCallback, errorCallback);
}

function PutObjectStoreItem(objectType, objectId, objectUser, objectData, successCallback, errorCallback)
{
  callWebKitFunction('PutObjectStoreItem', 'PUT', [objectType, objectId, objectUser, objectData], successCallback, errorCallback);
}

function ObjectStoreItemExists(objectType, objectId, objectUser, successCallback, errorCallback)
{
  callWebKitFunction('ObjectStoreItemExists', 'GET', [objectType, objectId, objectUser], successCallback, errorCallback);
}

function SaveLocalFile(sourceFileUrl, localFilePath, successCallback, errorCallback)
{
  callWebKitFunction('SaveLocalFile', 'PUT', [sourceFileUrl, localFilePath], successCallback, errorCallback);
}

function GetLocalFileEpochTimestamp(localFilePath, successCallback, errorCallback)
{
  callWebKitFunction('GetLocalFileEpochTimestamp', 'GET', [localFilePath], successCallback, errorCallback);
}

function EditWebViewUrl()
{
  callWebKitFunction('EditWebViewUrl', 'PUT', null, null, null);
}

function SetWebViewUrl(url)
{
  callWebKitFunction('EditWebViewUrl', 'PUT', [url], null, null);
}

function RefreshWebView()
{
  callWebKitFunction('RefreshWebView', 'PUT', null, null, null);
}

function SearchIndex(name, type, key, filter, successCallback, errorCallback)
{
  callWebKitFunction('SearchIndex', 'GET', [name, type, key, filter], successCallback, errorCallback);
}

function StartTimedCallback(name, intervalSeconds, timedCallback, successCallback, errorCallback)
{
  var callbackName;

  if (timedCallback)
  {
    if (typeof timedCallback == 'function')
      callbackName = createCallbackFunction("timedCallback", timedCallback);
    else
      callbackName = timedCallback;
  }

  callWebKitFunction('StartTimedCallback', 'PUT', [name, intervalSeconds, callbackName], successCallback, errorCallback);
}

function StartTimedCallbackWithObject(name, intervalSeconds, object, timedCallback, successCallback, errorCallback)
{
  var callbackName;

  if (timedCallback)
  {
    if (typeof timedCallback == 'function')
      callbackName = createCallbackFunction("timedCallback", timedCallback);
    else
      callbackName = timedCallback;
  }

  callWebKitFunction('StartTimedCallback', 'PUT', [name, intervalSeconds, callbackName, object], successCallback, errorCallback);
}

function StopTimedCallback(name, successCallback, errorCallback)
{
  callWebKitFunction('StopTimedCallback', 'PUT', [name], successCallback, errorCallback);
}

function callWebKitFunction(functionName, method, args, successCallback, errorCallback)
{
  var xmlhttp = new XMLHttpRequest();
  var urlStr = "http://webkit.conductiv.com/" + functionName + "/";

  var callInfo = {};
  callInfo.args = args;
  var callInfoString = JSON.stringify(callInfo);

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
      var obj = xmlhttp.responseText.substring(2, 7);
      if (obj == "error") {
        errorCallback(xmlhttp.responseText);
      }
      else if(obj == "waiti"){
        var millisecondsToWait = 100;
        setTimeout(function() {
          callWebKitFunction('GetSaveInfo','GET',null,successCallback,errorCallback);
        },millisecondsToWait);
      }
      else {
        successCallback(xmlhttp.responseText);
      }
    }
  }

  if (method == "PUT") {
    xmlhttp.open(method,urlStr,false);
    xmlhttp.setRequestHeader("Content-type","application/json");
    xmlhttp.send(callInfoString);
  } else {
    xmlhttp.open(method,urlStr + callInfoString,false);
    xmlhttp.send();
  }
}

functionIndexMap = {};

function createCallbackFunction (funcName, callbackFunc)
{
  if (callbackFunc && callbackFunc.name != null && callbackFunc.name.length > 0)
  {
    return callbackFunc.name;
  }

  if (typeof window[funcName+0] != 'function')
  {
    window[funcName+0] = callbackFunc;
    functionIndexMap[funcName] = 0;
    return funcName+0

  } else
  {
    var maxIndex = functionIndexMap[funcName];
    var callbackFuncStr = callbackFunc.toString();
    var newIndex = ++functionIndexMap[funcName];
    functionIndexMap[funcName] = newIndex;
    window[funcName+newIndex] = callbackFunc;
    return funcName+newIndex;
  }
}
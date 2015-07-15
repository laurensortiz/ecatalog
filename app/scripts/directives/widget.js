'use strict';

angular.module('conductivEcatalogApp').directive('widget', function ($rootScope, $http, httpCapi, catalog) {
  return {
    template: '<div ng-show="templateSrc" style="widgetStyle" ng-include src="templateSrc" onload="loadStyles()"></div>',
    restrict: 'E',
    scope: {
      widgetId: '@',
      data: "="
    },
    link: function postLink($scope, element, attrs) {
      $scope.widgetAttributes = attrs;
      // We assume that one of the following might hold the widgets related data for the page:
      // $scope.$parent.$parent.pagedata
      // $scope.$parent
      // TODO: Need to revisit it to understand under what conditions these change. We can inject this from outside in.

      var widgetModel = $scope.data || catalog.getPageWidget($scope.$parent.$parent.pagedata || $scope.$parent, attrs.widgetId);

      if (widgetModel) {
        $scope.model = widgetModel;
        $scope.widgetStyle = {};
        $scope.widgetClass = widgetModel.type;
        $scope.templateSrc = "views/widgets/" + widgetModel.type.charAt(0).toLowerCase() + widgetModel.type.slice(1) + ".html";

        if (widgetModel.links && widgetModel.links.image) {
          httpCapi.getFileResource(widgetModel.links.image).done(function (resolvedPath) {
            $scope.imagePath = resolvedPath;
          });
        }
        $scope.textContent = widgetModel.text;
      }
      else {
        if (attrs.debugwithplaceholder && ecatalog_config.debugLocal) {
          $scope.templateSrc = "views/widgets/placeholder.html"
        }
      }

      // Following code deals with loading the css conditionally...
      // Not sure the cost/benefit of it since widgets don't have a lot of CSS related to them and we are loading everything from local storage.
      // TODO: We may want to revisit it.

      var loadStylesConditionally = function (styleBlock) {
        var styleBlockId = $(styleBlock).attr("data-styleId");

        var styleExists = false;
        var pagesWithScripts = $("page[loaded-style-scripts]");

        var pageWithScript = _.find(pagesWithScripts, function (pageElement) {
          return ($(pageElement).attr("loaded-style-scripts").indexOf(styleBlockId) != -1);
        })

        if (!pageWithScript) {
          var styleContent = $(styleBlock).html();
          var parentPage = $(element).closest("page").append(styleContent);
          if (!$(parentPage).attr("loaded-style-scripts")) {
            $(parentPage).attr("loaded-style-scripts", styleBlockId);
          } else {
            $(parentPage).attr("loaded-style-scripts", $(element).attr("loaded-style-scripts") + "," + styleBlockId);
          }

        }
      }

      $scope.loadTenantStyles = function () {
        var styleBlock = $(element).find(".widget-functionality-wrapper").children("script[type='conditional/css']");
        if (styleBlock.length > 0) {
          loadStylesConditionally(styleBlock[0]);
        }

      };

      $scope.loadStyles = function () {
        var styleBlock = $(element).children("div").children("script[type='conditional/css']");
        if (styleBlock.length > 0) {
          loadStylesConditionally(styleBlock[0]);
        }
      };
    }
  };
});

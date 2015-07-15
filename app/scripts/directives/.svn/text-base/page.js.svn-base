'use strict';

angular.module('conductivEcatalogApp').directive('page', function (httpCapi) {
  return {
    template: '<ng-include class="page-container" src="currentTemplate" onload="loadPageStyle()"></ng-include>',
    restrict: 'E',
    scope: {
      pagedata: '='
    },
    link: function postLink($scope, element, attrs) {
      var setUpPage = function () {
        $scope.currentTemplate = $scope.pagedata.links.template;
      };

      if (!$scope.pagedata) {
        $scope.$watch('pagedata', function () {
          if ($scope.pagedata) {
            setUpPage();
          }
        });
      } else {
        setUpPage();
      }

      var loadStylesConditionally = function (styleBlock) {
        var styleBlockId = $(styleBlock).attr("data-styleId");

        var pagesWithScripts = $("page[loaded-style-scripts]");

        var pageWithScript = _.find(pagesWithScripts, function (pageElement) {
          return $(pageElement).attr("loaded-style-scripts") == styleBlockId;
        })
        if (!pageWithScript) {
          var styleContent = $(styleBlock).html();
          var parentPage = $(element).append(styleContent);
          if (!$(element).attr("loaded-style-scripts")) {
            $(element).attr("loaded-style-scripts", styleBlockId);
          } else {
            $(element).attr("loaded-style-scripts", $(element).attr("loaded-style-scripts") + "," + styleBlockId);
          }
        }
      };

      $scope.loadPageStyle = function () {
        var styleBlock = $(element).children(".page-container").children("script[type='conditional/css']");
        if (styleBlock.length > 0) {
          loadStylesConditionally(styleBlock[0]);
        }
      };
    }
  };
});

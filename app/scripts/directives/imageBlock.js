'use strict';

angular.module('conductivEcatalogApp').directive('backgroundImage', function ($rootScope) {
    return {
        restrict: 'A',
        priority: 99,
        link: function postLink(scope, element, attrs) {
            var updateImage = function () {
                if (attrs.basePath) {
                    var webPath = attrs.basePath + "/" + attrs.backgroundImage;

                    if ($(element).attr("style")) {
                        $(element).attr("style", $(element).attr("style") + "background-image: url('" + webPath + "')");
                    } else {
                        $(element).attr("style", "background-image: url('" + webPath + "')");
                    }

                    /*if ($rootScope.isiOS) {

                     alert(webPath);
                     try {
                     SaveLocalFile(webPath, function(successObj) {
                     alert(successObj);
                     }, function(errorObj) {
                     alert(successObj);
                     });
                     } catch(e) {
                     alert("exception");
                     alert(e);
                     }

                     }*/

                }

            }

            attrs.$observe('basePath', updateImage);

        }
    };
});

'use strict';

angular.module('conductivEcatalogApp')
    .controller('FutureConceptCtrl', function ($scope, httpCapi) {
        $scope.currentTemplate = httpCapi.generateFilesUrl() + "/" + sessionStorage['tenant'] + "/Templates/FUTURE_CONCEPTS/template.html";

        $scope.startCustomScript = function () {
            future_concept.onLoad();
        }

    });

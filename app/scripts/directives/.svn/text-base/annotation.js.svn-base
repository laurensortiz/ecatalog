'use strict';

angular.module('conductivEcatalogApp')
    .directive('annotation', function () {

        var editTemplate = '<textarea ng-show="isEditMode" ng-click="switchToPreview()" class="annotation-box">This is a sticky note you can type and edit.</textarea>';
        var previewTemplate = '<div ng-hide="isEditMode" ng-click="switchToEdit()" class="annotation-box">I love this world</div>';
        return {
            restrict: 'E',
            compile: function (ele, attr, transclude) {

                alert(id);
                ele.html(editTemplate);
                var editElement = angular.element(editTemplate);
                var previewElement = angular.element(previewTemplate);
                ele.append(previewElement);

                return function (scope, ele, attr) {
                    scope.isEditMode = true;

                    scope.switchToPreview = function () {
                        scope.isEditMode = false;
                        previewElement.text(editElement.text());
                    }

                    scope.switchToEdit = function () {
                        scope.isEditMode = true;
                    }


                }
            }
        };
    });

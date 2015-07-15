'use strict';

angular.module('conductivEcatalogApp')
    .directive('checkboxButton', function () {
        return {
            scope: { checkboxModel: '=ngModel' },
            restrict: 'E',
            transclude: true,
            template: '<div class="checkbox-btn">\
          <label class="btn btn-large btn-inverse btn-block">\
            <input ng-model="checkboxModel" type="checkbox"><span></span>\
              <span class="ui-btn-text" ng-transclude></span>\
            </label>\
          </div>\
        </div>'

        };
    });

'use strict';

angular.module('conductivEcatalogApp')
    .directive('droppable', function ($compile, whiteboardLayout, $rootScope) {
        return function (scope, element, attrs) {
            var counter = 0;
            var currentassortment = scope.assortmentId;
            $(element).droppable({
                greedy: true,
                accept: '.procItems',
                drop: function (event, ui) {
                    var draggableDocumentOffset = ui.helper.offset();
                    var droppableDocumentOffset = $(this).offset();
                    var left = draggableDocumentOffset.left - droppableDocumentOffset.left;
                    var top = draggableDocumentOffset.top - droppableDocumentOffset.top + parseInt($('.wb-item-wrapper:eq(1)').scrollTop());
                    var id = $('img', ui.helper).data('id');
                    if (scope.rightPanelItems[id] === undefined || scope.rightPanelItems[id] === null) {
                        scope.rightPanelItems[id] = {};
                    }
                    var positionKey = left + 'px|' + top + 'px';
                    scope.rightPanelItems[id][positionKey] = {left: left + 'px', top: top + 'px'};
                    whiteboardLayout.save(currentassortment, scope.rightPanelItems);

                    scope.$apply(
                        scope.stylesOnCanvas.push({
                            style: scope.getStyle(id),
                            position: {left: left + 'px', top: top + 'px'}
                        })
                    );
                }
            });
        };
    });

//ui.draggable.html()

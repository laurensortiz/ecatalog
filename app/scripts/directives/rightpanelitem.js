'use strict';

angular.module('conductivEcatalogApp')
    .directive('rightpanelitem', function (whiteboardLayout) {
        return function (scope, element, attrs) {
            var id;
            var currentassortment = scope.assortmentId;
            scope.orignalPosition = {};
            element.draggable({
                containment: "#wrapper-right-panel",
                start: function () {
                    $('#wb-editor').hide();
                    id = $('img', this).data('id');
                    var top = $(this).css('top');
                    var left = $(this).css('left');
                    scope.orignalPosition = {top: top, left: left};
                },

                stop: function () {
                    var left = $(this).css('left');
                    var top = $(this).css('top');

                    var oldPositionKey = scope.orignalPosition.left + '|' + scope.orignalPosition.top;
                    delete scope.rightPanelItems[id][oldPositionKey];

                    var newPositionKey = left + '|' + top;
                    scope.rightPanelItems[id][newPositionKey] = {left: left, top: top};
                    whiteboardLayout.save(currentassortment, scope.rightPanelItems);
                }
            });


            element.bind('click', function () {
                $('.updateEnabled').removeClass('updateEnabled');
                var ele = $('img', element);
                var quantity = $(ele).text();
                var name = $(ele).data("name");
                var code = $(ele).data("code");
                //$('#wb-editor').find('input').val(quantity);
                var top = $(this).offset().top + 20;
                var left = $(this).offset().left + $(this).width() + 20;
                $('span', '#wb-detailTitle').text(name);
                $('#wb-detailStyle').text(code);
                scope.selectionid = $(element).data("id");
                $('#wb-editor').css({left: left + 'px', top: top + 'px'}).show();
            });
        };
    });

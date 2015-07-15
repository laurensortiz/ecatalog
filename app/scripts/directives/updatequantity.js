'use strict';

angular.module('conductivEcatalogApp')
    .directive('updatequantity', function () {
        return function (scope, element, attrs) {
            element.bind('click', function () {
                $('.updateEnabled').removeClass('updateEnabled');
                var ele = $(element);
                var quantity = $(element).text();
                var name = $(element).data("name");
                var code = $(element).data("code");
                $('#wb-editor').find('input').val(quantity);
                var top = $(this).parent().offset().top + 40;
                var left = $(this).offset().left + $(this).width() - 20;
                $('span', '#wb-detailTitle').text(name);
                $('#wb-detailStyle').text(code);
                scope.selectionid = $(element).data("id");
                $('#wb-editor').css({left: left + 'px', top: top + 'px'}).show().find('input[type="text"]').click(function (e) {
                    e.preventDefault();
                    $('.updateEnabled').removeClass('updateEnabled');
                    $(ele).addClass('updateEnabled');
                    var that = $(this)[0];
                    $(that).addClass('updateEnabled');
                });

            });
        };
    });

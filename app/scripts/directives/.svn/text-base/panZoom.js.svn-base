'use strict';

angular.module('conductivEcatalogApp')
    .directive('panZoom', function ($timeout) {
        return {
            link: function postLink(scope, element, attrs) {
                $timeout(function () {
                    var jqElement = $(element);
                    $(element).panzoom();
                    $(element).on("panzoomend", function (e, panzoom, changed) {
                        var elementImgHeight = jqElement.find('img').height();
                        var elementImgWidth = jqElement.find('img').width();
                        var elementParent = jqElement.parent();
                        var elementParentHeight = elementParent.height();
                        var elementParentWidth = elementParent.width();
                        var imageWidth = jqElement.find('img').width();
                        var reqHeight = -elementImgHeight;
                        var reqWidth = -elementImgWidth;
                        var magnification = jqElement.panzoom("getMatrix")[0];
                        var elementTop = jqElement.find('img').position().top;
                        var elementLeft = jqElement.find('img').position().left;
                        var marginForReset = 20;
                        if (elementTop < (magnification * reqHeight) + marginForReset || elementTop > (elementParentHeight) - marginForReset || elementLeft < (magnification * reqWidth) + marginForReset || elementLeft > elementParentWidth - marginForReset) {
                            jqElement.panzoom("setMatrix", [ magnification, 0, 0, magnification, 0, 0 ], {animate: true});
                        }
                    })
                });
            }
        };
    });

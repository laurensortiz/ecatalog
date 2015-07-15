'use strict';

//prevents special characters from being inserted into the assortment name input
angular.module('conductivEcatalogApp')
    .directive('ngEnter', function () {
        var validate = function (scope, element) {
            element.bind("keypress", function (event) {

                var regex, errorMessage, key;

                //regex that will allow alphanumeric, spaces and dots
                regex = new RegExp("^[0-9a-zA-Z _.]+$");

                //get's the character to be inserted onto the input
                key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

                if (!regex.test(key)) {
                    //prevents default keypress behavior
                    event.preventDefault();

                    errorMessage = element[0].parentNode.nextSibling

                    //just in case the next node is not an element
                    while(errorMessage&&errorMessage.nodeType!=1){
                        errorMessage = errorMessage.nextSibling;
                    }

                    //set the incorrect character into de error message
                    $(errorMessage)[0].children[0].children[0].innerHTML = "'"+key+"'";
                    $(errorMessage).show();

                    //fade animation
                    var timeOut = setTimeout(function(){
                        $(errorMessage).animate({opacity: 0.15}, 500, function(){$(errorMessage).hide().css('opacity',1); clearTimeout(timeOut);})
                    }, 2500);


                    return false;
                }
            });
        };

        return{
            link: validate,
            restrict: 'A'
        }
    });

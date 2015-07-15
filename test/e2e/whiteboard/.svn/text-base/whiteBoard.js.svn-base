'use strict';

describe('White Board',function(){

	describe('click the item name All in the AssortmentList',function(){
        beforeEach(function(){
            browser().navigateTo('/#/login');
            input('loginInfo.username').enter('admin1');
            input('loginInfo.password').enter('conductiv12');
            input('loginInfo.organization').enter('VANSSB');
            element(':submit').click();
            sleep(5);
            browser().navigateTo('/#/assortment/list');
            sleep(5);
        });
        
        it('should link to white board view of the assortmentList',function(){
            element('.span6.assortment:contains("All")').click();
            sleep(5);
            browser().navigateTo('/#/assortment/edit/12950/whiteboard');
            
        });
    });

	describe("white board render", function(){
        beforeEach(function(){
            browser().navigateTo('/#/login');
            input('loginInfo.username').enter('admin1');
            input('loginInfo.password').enter('conductiv12');
            input('loginInfo.organization').enter('VANSSB');
            element(':submit').click();
            sleep(2);
            browser().navigateTo('/#/assortment/edit/12950/whiteboard');
        }); 
        it('should display white board heading correctly',function(){
            expect(element('.ecatalog .topBarHeader .conductiv-name').text()).toMatch("Assortment Whiteboard");
        });        
        
        it('should ensure the back button works in the white board',function(){
            element('.ios-arrow-left').click();
            sleep(2);
            expect(browser().location().path()).toBe('/assortment/list');           
        });
        
        it('should display fiftynine items in the left panel of the white board',function(){
        	 expect(repeater('.span4 .wrapper-anchor .wrapper .wb-item-wrapper div').count()).toEqual(59);       
        });
        
        it('should ensure no. of items in the left panel equals the no. displayed at the bottom right of the page',function(){
       	     expect(element('.span3.product-styles-count span').text()).toEqual("59");   	     
       });
        
        it('should ensure the white board rendered is the correct one',function(){
            expect(element('.assortment-name span').text()).toMatch("All");        
        });
        
        it('should ensure right panel erase button click clears all the added items in the right panel',function(){
            element('.span8 .wrapper-anchor .actionPanel a').click();
            sleep(2);
       	    expect(repeater('#wb-item-panel div').count()).toEqual(0);          
        });
        
        it('should ensure left panel erase button click opens a confirmation popup',function(){
            element('.span4 .wrapper-anchor .actionPanel a:last').click();
            sleep(2);
       	    expect(element('div.modal-numpad').count()).toEqual(1);          
        });
        
        it('should ensure confirmation popup opened has yes and no buttons',function(){
            element('.span4 .wrapper-anchor .actionPanel a:last').click();
            sleep(2);
       	    expect(element('.modal-numpad .modal-footer button.btn-inverse').text()).toMatch("No"); 
       	    sleep(2);
       	    expect(element('.modal-numpad .modal-footer button.btn-warning').text()).toMatch("Yes");         
        });
        
        it('should ensure the linesheet button works in the white board',function(){
            element('i.icon.whiteboard-icon').click();
            sleep(2);
            expect(browser().location().path()).toMatch(/\/assortment\/edit\/\d+\/linesheet/);           
        });
	});


    describe('click bottom left button with user name',function(){
        beforeEach(function(){
            browser().navigateTo('/#/login');
            input('loginInfo.username').enter('admin1');
            input('loginInfo.password').enter('conductiv12');
            input('loginInfo.organization').enter('VANSSB');
            element(':submit').click();
            sleep(2);
            browser().navigateTo('/#/assortment/edit/12950/whiteboard');
        }); 
        it('should open the drop down menu',function(){
            element('a.dropdown-toggle').click();
            expect(element('ul.dropdown-menu').css('display')).toEqual('block');
        });
        it('should logout on click of logout in dropdown',function(){
            element('a.dropdown-toggle').click();
            element('a[ng-click="logout()"]').click();
            sleep(3);
            expect(browser().location().path()).toBe('/login');
        });
    });
});
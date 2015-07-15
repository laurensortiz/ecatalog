'use strict';

describe('order list page',function(){
    describe('check for page title and other UI',function(){
        beforeEach(function(){
            browser().navigateTo('/#/login');
            input('loginInfo.username').enter('admin1');
            input('loginInfo.password').enter('conductiv12');
            input('loginInfo.organization').enter('VANSSB');
            element(':submit').click();
            sleep(5);
            browser().navigateTo('/#/order/list');
            sleep(5);
        });

        it('should show filtered orders',function(){
            input("query").enter("freestyle");
            expect(element('.cust-name-and-po:first div:first').text()).toMatch(/FREESTYLE OUTDOORS LLC/);
        });


        it('should render orders list page',function(){
            expect(element('.conductiv-name').text()).toMatch(/Order List/);
        });

        it('should have back button',function(){
            expect(element('.ios-arrow-left').text()).toEqual("Back");  
        }); 


        it('should change URL',function(){
            expect(browser().location().path()).toBe('/order/list');  
        });
       

    });

    describe('back button utility',function(){
        beforeEach(function(){
            browser().navigateTo('/#/login');
            input('loginInfo.username').enter('admin1');
            input('loginInfo.password').enter('conductiv12');
            input('loginInfo.organization').enter('VANSSB');
            element(':submit').click();
            sleep(5);
            browser().navigateTo('/#/order/list');
            sleep(5);

        });

        it('should redirect to home page',function(){
            element('.ios-arrow-left').click();
            sleep(5);
            expect(browser().location().path()).toBe('/home/menu');
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
            browser().navigateTo('/#/order/list');
            sleep(5);
        });
        it('should open the drop down menu',function(){
            element('a.dropdown-toggle').click();
            expect(element('ul.dropdown-menu').css('display')).toEqual('block');
        });
    });




});
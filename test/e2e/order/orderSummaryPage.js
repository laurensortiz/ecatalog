'use strict';

describe('order summary page',function(){
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
            element('.order:first').click();
            sleep(5);
        });

        it('should render orders summary page',function(){
            expect(element('.conductiv-name').text()).toMatch(/Order/);
        });

        it('should have back button',function(){
            expect(element('.ios-arrow-left').text()).toEqual("Back");  
        });       
        it('should have resend email button',function(){
            expect(element('a[title="Resend Email"]').count()).toEqual(1);  
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
            element('.order:first').click();
            sleep(5);
        });

        it('should redirect to order list page',function(){
            element('.ios-arrow-left').click();
            sleep(5);
            expect(browser().location().path()).toBe('/order/list');
        });

    });


    describe('Resend Email utility',function(){
        beforeEach(function(){
            browser().navigateTo('/#/login');
            input('loginInfo.username').enter('admin1');
            input('loginInfo.password').enter('conductiv12');
            input('loginInfo.organization').enter('VANSSB');
            element(':submit').click();
            sleep(5);
            browser().navigateTo('/#/order/list');
            sleep(5);
            element('.order:first').click();
            sleep(5);
        });

        it('should open resend email Dialog Box',function(){
            element('a[title="Resend Email"]').click();
            expect(element('div.modal').css('display')).toEqual('block');
            
        });

        it('should check for valid emails',function(){
            element('a[title="Resend Email"]').click();
            expect(element('div.modal').css('display')).toEqual('block');
            
            input("emails").enter("example@example.com");
            expect(element('.control-group div:nth-child(3)').css('display')).toEqual('none');
            
        });        

        it('should check for in-valid emails',function(){
            element('a[title="Resend Email"]').click();
            expect(element('div.modal').css('display')).toEqual('block');
            
            input("emails").enter("example");
            expect(element('.control-group div:nth-child(3)').css('display')).toEqual('block');
            
        }); 

        
        it('click on OK button in the popup should close email confirmation Dialog Box',function(){
            element('a[title="Resend Email"]').click();        
            input("emails").enter("example@example.com");
            element('button[ng-click="sendEmails()"]').click();           
            element('.small-modal .modal-footer button').tap();
            expect(element('div.modal').count()).toEqual(0);
            
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
            element('.order:first').click();
            sleep(5);
        });
        it('should open the drop down menu',function(){
            element('a.dropdown-toggle').click();
            expect(element('ul.dropdown-menu').css('display')).toEqual('block');
        });
    });




});
'use strict';

describe('assortment list page',function(){




    describe('check for page title and other UI',function(){
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

        it('should show filtered assortments',function(){
            input("query.description").enter("vibhor");
            //expect(element('.assortment-description:first').text()).toMatch("vibhor");
            expect(element('.assortment-description:contains("vibhor")').text()).not().toBeNull();
        });


        it('should render assortment list page',function(){
            expect(element('.conductiv-name').text()).toMatch("Assortment List");
        });

        it('should have four buttons',function(){
            expect(element('.btn').count()).toEqual(4);  
        }); 

        it('should have New Assortment button',function(){
            expect(element('.btn:first').text()).toMatch("New Assortment");  
        }); 

        it('should change URL',function(){
            expect(browser().location().path()).toBe('/assortment/list');  
        });
       
        it('should open the linesheet view of an assortment when clicked in the assortmentList',function(){
            element('.span6.assortment:contains("All")').tap();
            sleep(10);
            expect(browser().location().path()).toMatch(/\/assortment\/edit\/\d+\/linesheet/); 
        });
        
        it('hold on an assortment should open the popup containing the rename-duplicate-delete buttons',function(){
            element('.span6.assortment:contains("All")').hold();
            sleep(5);
            expect(element('.assortment-pop-over-container').css('display')).toEqual('block');
            pause();
        });

    });





/*    describe('click bottom left button with user name',function(){
        beforeEach(function(){
            browser().navigateTo('/#/login');
            input('loginInfo.username').enter('admin1');
            input('loginInfo.password').enter('conductiv12');
            input('loginInfo.organization').enter('VANSSB');
            element(':submit').click();
            sleep(2);
            browser().navigateTo('/#/assortment/list');
            sleep(5);
        });
        it('should open the drop down menu',function(){
            element('a.dropdown-toggle').click();
            expect(element('ul.dropdown-menu').css('display')).toEqual('block');
        });
    });*/



});
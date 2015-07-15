'use strict';

describe('home page',function(){
    describe('login and redirect to home page',function(){
        beforeEach(function(){
            browser().navigateTo('/#/login');
            input('loginInfo.username').enter('admin1');
            input('loginInfo.password').enter('conductiv12');
            input('loginInfo.organization').enter('VANSSB');
            element('input[type="submit"]').click();
            sleep(5);
        })
        it('should render home page correctly',function(){
            expect(element('.button-text:first').text()).toMatch(/Catalogs/);
        });
        it('should render page heading correctly',function(){
            expect(element('.conductiv-name').text()).toMatch(/Homepage/);
        })
        
    });
    describe('click on left items',function(){
        beforeEach(function(){
            browser().navigateTo('/#/login');
            input('loginInfo.username').enter('admin1');
            input('loginInfo.password').enter('conductiv12');
            input('loginInfo.organization').enter('VANSSB');
            element('input[type="submit"]').click();
            sleep(2);
        });
        it('should link to catalogs page',function(){
            element('.catalog-dashboard').click();
            sleep(2);
            expect(browser().location().path()).toBe('/catalog/list');
        });  
        it('should link to assortments page',function(){
            element('.assortment-dashboard').click();
            sleep(2);
            expect(browser().location().path()).toBe('/assortment/list');
        });
        it('should link to orders page',function(){
            element('.order-dashboard').click();
            sleep(2);
            expect(browser().location().path()).toBe('/order/list');
        });
    }); 
    describe('click on right items',function(){
        beforeEach(function(){
            browser().navigateTo('/#/login');
            input('loginInfo.username').enter('admin1');
            input('loginInfo.password').enter('conductiv12');
            input('loginInfo.organization').enter('VANSSB');
            element('input[type="submit"]').click();
            sleep(2);
        });
        
        it('should link to single catalog',function(){
            element('.dashboard-button-extras-container.catalog-container a:first').click();
            sleep(2);
            expect(browser().location().path()).toMatch(/\/catalog\/master\/\d+\/browse/);
        })
        it('should link to single assortment',function(){
            element('td.assortment-menu:first').click();
            sleep(2);
            expect(browser().location().path()).toMatch(/\/assortment\/edit\/\d+\/linesheet/);
        })
        it('should link to single order',function(){
            element('td.order-menu:first').click();
            sleep(2);
            expect(browser().location().path()).toMatch(/\/orders\/\d+/);
        })
    });
    describe('click bottom left button with user name',function(){
        beforeEach(function(){
            browser().navigateTo('/#/login');
            input('loginInfo.username').enter('admin1');
            input('loginInfo.password').enter('conductiv12');
            input('loginInfo.organization').enter('VANSSB');
            element('input[type="submit"]').click();
            sleep(2);
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
describe('catalog list',function(){
    describe('login and redirect to catalog list page',function(){
        beforeEach(function(){
            browser().navigateTo('/#/login');
            input('loginInfo.username').enter('admin1');
            input('loginInfo.password').enter('conductiv12');
            input('loginInfo.organization').enter('VANSSB');
            element('input[type="submit"]').click();
            sleep(3);
            browser().navigateTo('/#/catalog/list');
            sleep(2);
        });
        it('should render page heading correctly',function(){
            expect(element('.conductiv-name').text()).toMatch(/Master Catalogs/);
        });
    });
    describe('click on catalog list items',function(){
        beforeEach(function(){
            browser().navigateTo('/#/login');
            input('loginInfo.username').enter('admin1');
            input('loginInfo.password').enter('conductiv12');
            input('loginInfo.organization').enter('VANSSB');
            element('input[type="submit"]').click();
            sleep(3);
            browser().navigateTo('/#/catalog/list');
            sleep(2);
        });
        it('should link to single catalog',function(){
            element('.catalogList ul.thumbnails li>a:first').click();
            sleep(2);
            expect(browser().location().path()).toMatch(/\/catalog\/master\/\d+\/browse/);
        });
    });
    describe('click bottom left button with user name',function(){
        beforeEach(function(){
            browser().navigateTo('/#/login');
            input('loginInfo.username').enter('admin1');
            input('loginInfo.password').enter('conductiv12');
            input('loginInfo.organization').enter('VANSSB');
            element('input[type="submit"]').click();
            sleep(2);
            browser().navigateTo('/#/catalog/list');
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
    describe('click on back button',function(){
        beforeEach(function(){
            browser().navigateTo('/#/login');
            input('loginInfo.username').enter('admin1');
            input('loginInfo.password').enter('conductiv12');
            input('loginInfo.organization').enter('VANSSB');
            element('input[type="submit"]').click();
            sleep(2);
            browser().navigateTo('/#/catalog/list');
            sleep(2);
        });
        it('should redirect to home page',function(){
            element('.ios-arrow-left').click();
            sleep(2);
            expect(browser().location().path()).toBe('/home/menu');
        })
    })
});
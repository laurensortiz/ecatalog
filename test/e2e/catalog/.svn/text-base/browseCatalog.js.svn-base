describe('home page',function(){
    describe('login and redirect to home page',function(){
        beforeEach(function(){
            browser().navigateTo('/#/login');
            input('loginInfo.username').enter('admin1');
            input('loginInfo.password').enter('conductiv12');
            input('loginInfo.organization').enter('VANSSB');
            element('input[type="submit"]').click();
            sleep(5);
        });
        it('should render page heading correctly',function(){
            browser().navigateTo('/#/catalog/master/10070/browse');
            sleep(5);
            expect(element('.conductiv-name').text()).toMatch(/S14 PRO SKATE/);
        });
        it('should navigate to another page',function(){
            browser().navigateTo('/#/catalog/master/10070/browse');
            sleep(2);
            element('.grid-icon').click();
            sleep(2);
            element('.page-thumbnail-container:eq(12)').click();
            sleep(2);
            element('.widget-functionality-wrapper:first').tap();
            sleep(2);
            expect(element('.product-details-popup').css('display')).toEqual('block');
        });
        
        it('click on back button in the top left corner of the catalog should navigate to catalog list',function(){
        	browser().navigateTo('/#/catalog/master/10070/browse');
        	sleep(2);
            element('.ios-arrow-left').click();
            sleep(2);
            expect(browser().location().path()).toBe('/catalog/list');
        });
        
        it('click on next button in the catalog should navigate to next page',function(){
        	browser().navigateTo('/#/catalog/master/10070/browse');
        	sleep(2);
            element('.bx-next').click();
            sleep(2);
            expect(input('currentlyDisplayedPageNumber').val()).toBe('3');           
        });
        
        it('click on previous button in the catalog should navigate to previous page',function(){
        	browser().navigateTo('/#/catalog/master/10070/browse');
        	sleep(2);
            element('.bx-next').click();
            sleep(2);
            element('.bx-prev').click();
            sleep(5);
            expect(input('currentlyDisplayedPageNumber').val()).toBe('1');           
        });
        
        it('enter the slide number in the input field in the catalog',function(){
        	browser().navigateTo('/#/catalog/master/10070/browse');
        	sleep(2);
            element('.bx-next').click();
            sleep(2);
        	input('currentlyDisplayedPageNumber').enter(2);
            sleep(2);
            expect(element('#thumb').attr('src')).toMatch('/data\/VANSSB\/Catalogs\/S14_PRO_SKATE\/Thumbnails\/page2.jpg');
        });
        
        it('hold on an item in the product widget should open the product detail popup',function(){
            browser().navigateTo('/#/catalog/master/10070/browse');
            sleep(2);
            element('.grid-icon').click();
            sleep(2);
            element('.page-thumbnail-container:eq(12)').click();
            sleep(2);
            element('.widget-functionality-wrapper:first').hold();
            sleep(2);
            expect(element('.product-details-popup').css('display')).toEqual('block');
        });
        
    });
});
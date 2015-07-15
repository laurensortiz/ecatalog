"use strict";
describe("Linesheet", function(){

    describe("Linesheet view render", function(){
        beforeEach(function(){
            browser().navigateTo("/#/login");
            input("loginInfo.username").enter("admin1");
            input("loginInfo.password").enter("conductiv12");
            input("loginInfo.organization").enter("VANSSB");
            element(":submit").click();
        });

        it("should render Linesheet view", function(){
            sleep(3);
            element("td.assortment-menu:first").click();
            expect(element(".conductiv-name").text()).toMatch(/Assortment/)
        });

        it("should return to assortment list when clicked on back", function(){
            sleep(3);
            element("td.assortment-menu:first").click();
            sleep(2);
            element(".ios-arrow-left").click();
            sleep(1);
            expect(browser().location().path()).toBe("/assortment/list");
        });

        it("should open browse catalog window when clicked on catalog icon", function(){
            sleep(3);
            element("td.assortment-menu:first").click();
            sleep(2);
            element("ul.position-relative>li:eq(0) > a").click();
            sleep(1);
            expect(element(".modal h3:first").text()).toMatch(/Master Catalogs/);
        });

        it("should open search product window when clicked on search icon", function(){
            sleep(3);
            element("td.assortment-menu:first").click();
            sleep(2);
            element("ul.position-relative>li:eq(1) > a").click();
            sleep(1);
            expect(element(".modal h3:first").text()).toMatch(/Product Search/);
        });

        it("should open whiteboard", function(){
            sleep(3);
            element("td.assortment-menu:first").click();
            sleep(2);
            element("ul.position-relative>li:eq(2) > a").click();
            sleep(2);
            expect(element(".conductiv-name").text()).toMatch(/Assortment Whiteboard/);
        });

        it("should open create order form window when clicked on search icon when atleast one product has quantity more than one in the assortment", function(){
            sleep(3);
            element('td.assortment-menu:contains("All")').click();
            sleep(2);
            element("ul.position-relative>li:eq(3) > a").click();
            sleep(1);
            expect(element(".modal h3:first").text()).toMatch(/Order Header/);
        });

        it("should should have exact number of member products as shown in bubble", function(){
            sleep(3);
            element('td.assortment-menu:contains("All")').click();
            sleep(15);
            element(".shoe-container:first .procItems").click();
            sleep(3);
            expect(element(".shoe-container:first .procItems+div .procItems").count()).toBe(3);
        })
        it("should render initial content", function(){
            sleep(3);
            browser().navigateTo("/#/assortment/list");
            element(".btn:contains('New Assortment')").click();
            input("newAsssortmentDescription").enter("Presentation Assortment");
            element(".btn:contains('Create Assortment')").click();
            sleep(2);
            expect(element(".span6.assortment-name").text()).toMatch(/Presentation Assortment/);
            expect(element(".button-text:first").text()).toMatch(/Browse Catalogs/);
            expect(element(".span2.counter").text()).toMatch(/0/);
            expect(element(".span3.product-styles-count>span").text()).toMatch(/0/);
        });

        /*it("should render 3 product in the list when 3 products are added via browse catalog", function(){
            sleep(3);
            browser().navigateTo("/#/assortment/list");
            element(".btn:contains('New Assortment')").click();
            input("newAsssortmentDescription").enter("Presentation Assortment");
            element(".btn:contains('Create Assortment')").click();
            sleep(2);
            element(".button-text:first").click();
            element("li.clickable:first > a").click();
            sleep(7)
            element(".grid-icon").click();
            element(".page-thumbnail-container:eq(12)").click();
            sleep(2)
            element(".widget-functionality-wrapper").click();
            element(".ios-arrow-left").click();
            expect(element('.procItems').count()).toBe(3)
        });*/
    });
});

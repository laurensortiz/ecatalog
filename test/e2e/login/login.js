'use strict';

describe("Login Route", function(){
	
	describe("login page render", function(){
		
		beforeEach( function(){
			browser().navigateTo('/#/login');
		});

		it('should render login page', function(){
			expect(element('span:first').text()).toMatch(/Log In/);
		});
	});
	
	describe("Login using correct credentials", function(){
		beforeEach( function(){
			browser().navigateTo('/#/login');
		});
		
		it("should navigate to home page when logged in with correct credentials", function(){
			input('loginInfo.username').enter('admin1');
			input('loginInfo.password').enter('conductiv12');
			input('loginInfo.organization').enter('VANSSB');
			element(':submit').click();
			sleep(6);
			expect(browser().location().path()).toBe('/home/menu');
		});
		
		it("should not log in without incorrect credentials", function(){
			input('loginInfo.username').enter('admin');
			input('loginInfo.password').enter('conductiv');
			input('loginInfo.organization').enter('VANS');
			element(':submit').click();
			sleep(1);
			expect(element('.error-message').css('display')).toEqual('block');
		});

		it("should not log in without username", function(){
			input('loginInfo.password').enter('conductiv12');
			input('loginInfo.organization').enter('VANSSB');
			element(':submit').click();
			sleep(1);
			expect(element('.error-message').css('display')).toEqual('block');
		});

		it("should not log in without password", function(){
			input('loginInfo.username').enter('admin1');
			input('loginInfo.organization').enter('VANSSB');
			element(':submit').click();
			sleep(1);
			expect(element('.error-message').css('display')).toEqual('block');
		});

		it("should not log in without organization", function(){
			input('loginInfo.username').enter('admin1');
			input('loginInfo.password').enter('conductiv12');
			element(':submit').click();
			sleep(1);
			expect(element('.error-message').css('display')).toEqual('block');
		});

		it("should remember username and organization when remember username and organization is checked", function(){
			input('loginInfo.username').enter('admin1');
			input('loginInfo.password').enter('conductiv12');
			input('loginInfo.organization').enter('VANSSB');
			element('.control-group:first input[type="checkbox"]').click();
			element(':submit').click();
			sleep(3);
			element('.dropdown-toggle').click();
			element('.dropdown-menu > li:eq(3) > a').click();
			sleep(3)
			expect(element('#ct-username').prop('value')).toEqual('admin1');
			expect(element('#ct-organization').prop('value')).toEqual('VANSSB');
			expect(element('.control-group:eq(1)').css('display')).toEqual('block');
		});
		
		it("should remember username and organization when remember username, password, organization is checked", function(){
			sleep(10);
			input('loginInfo.username').enter('admin1');
			input('loginInfo.password').enter('conductiv12');
			input('loginInfo.organization').enter('VANSSB');
			element('.control-group:eq(1)  input[type="checkbox"]').click();
			element(':submit').click();
			sleep(3);
			element('.dropdown-toggle').click();
			element('.dropdown-menu > li:eq(3) > a').click();
			sleep(3)
			expect(element('#ct-username').prop('value')).toEqual('admin1');
			expect(element('#ct-password').prop('value')).toEqual('conductiv12');
			expect(element('#ct-organization').prop('value')).toEqual('VANSSB');
		});
		
	});

	
});

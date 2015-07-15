'use strict';

angular.module('conductivEcatalogApp.models', []);
angular.module('conductivEcatalogApp', ['ui', 'ui.bootstrap', 'hmTouchevents', 'customHmTouchevents', 'http-auth-interceptor', 'HttpConnectionStatusInterceptor', 'conductivEcatalogApp.models']).config(function ($routeProvider, $httpProvider) {
    $routeProvider.when('/', {
        redirectTo: '/login'
    }).when('/home/menu', {
            templateUrl: 'views/homeMenu.html',
            controller: 'HomeMenuCtrl',
            templateName: 'Homepage'
        }).when('/home', {
            redirectTo: '/home/menu'
        });
    /*-------------------CATALOG LIST/MANAGEMENT ROUTES ------------------------*/
    $routeProvider.when('/catalog/list', {
        templateUrl: 'views/catalogList.html',
        controller: 'CatalogListCtrl',
        templateName: 'Master Catalogs'
    }).when('/catalog', {
            redirectTo: '/catalog/list'
        });

    /*-------------------CATALOG BROWSE ROUTES ------------------------*/

    $routeProvider.when('/catalog/master/:catalogId/browse', {
        templateUrl: 'views/masterCatalogBrowse.html',
        controller: 'MasterCatalogBrowseCtrl'
    });

    $routeProvider.when('/catalog/master/:catalogId/page/:pageId', {
        templateUrl: 'views/masterCatalogPage.html',
        controller: 'MasterCatalogPageCtrl'
    });
    $routeProvider.when('/catalog/master/:catalogId/page', {
        templateUrl: 'views/masterCatalogPage.html',
        controller: 'MasterCatalogPageCtrl'
    });

    $routeProvider.when('/catalog/custom/:id/browse', {
        templateUrl: 'views/customCatalogBrowse.html',
        controller: 'CustomCatalogBrowseCtrl'
    });
    /*-------------------CUSTOM CATALOG CREATE ROUTES ------------------------*/
    $routeProvider.when('/catalog/create/:cid', {
        templateUrl: 'views/catalogCreate.html',
        controller: 'CatalogCreateCtrl'
    }).when('/catalog/create/:cid/import', {
            templateUrl: 'views/catalogCreateImport.html',
            controller: 'CatalogCreateImportCtrl'
        }).when('/catalog/create/:cid/browse', {
            templateUrl: 'views/catalogCreateBrowse.html',
            controller: 'CatalogCreateBrowseCtrl'
        }).when('/catalog/create/:cid/submit', {
            templateUrl: 'views/catalogCreateSubmit.html',
            controller: 'CatalogCreateSubmitCtrl'
        }).when('/catalog/create', {
            templateUrl: 'views/catalogCreate.html',
            controller: 'CatalogCreateCtrl'
        });

    /*-------------------Assortment List/Management Routes--------------------------------*/
    $routeProvider.when('/assortment/list', {
        templateUrl: 'views/assortmentList.html',
        controller: 'AssortmentListCtrl',
        templateName: 'Assortment List'
    }).when('/assortment/:assortmentId/linkCustomer', {
            templateUrl: 'views/assortmentLinkCustomer.html',
            controller: 'AssortmentLinkCustomerCtrl'
        }).when('/assortment', {
            redirectTo: '/assortment/list'
        });

    /*-------------------Assortment Create Routes--------------------------------*/
    $routeProvider.when('/assortment/create/:assortmentId', {
        templateUrl: 'views/assortmentCreate.html',
        controller: 'AssortmentCreateCtrl'
    }).when('/assortment/create', {
            templateUrl: 'views/assortmentCreate.html',
            controller: 'AssortmentCreateCtrl'
        });

    $routeProvider.when('/assortment/create/:assortmentId/customer/link', {
        templateUrl: 'views/assortmentCreateLinkCustomer.html',
        controller: 'AssortmentCreateLinkCustomerCtrl'
    });

    $routeProvider.when('/assortment/create/:assortmentId/whiteboard', {
        templateUrl: 'views/assortmentWhiteboard.html',
        controller: 'AssortmentWhiteboardCtrl',
        templateName: 'Assortment Whiteboard'
    });

    $routeProvider.when('/assortment/create/:assortmentId/linesheet', {
        templateUrl: 'views/assortmentLinesheet.html',
        controller: 'AssortmentLinesheetCtrl'
    });

    $routeProvider.when('/assortment/create/:assortmentId/catalog/list', {
        templateUrl: 'views/assortmentCreateCatalogList.html',
        controller: 'AssortmentCreateCatalogListCtrl'
    }).when('/assortment/create/:assortmentId/catalog/master/:catalogId/browse', {
            templateUrl: 'views/assortmentCreateBrowse.html',
            controller: 'AssortmentCreateBrowseCtrl'
        });

    /*-------------------Assortment Edit Routes--------------------------------*/
    $routeProvider.when('/assortment/edit/:assortmentId', {
        templateUrl: 'views/assortmentEdit.html',
        controller: 'AssortmentEditCtrl'
    });

    $routeProvider.when('/assortment/edit/:assortmentId/customer/link', {
        templateUrl: 'views/assortmentEditLinkCustomer.html',
        controller: 'AssortmentEditLinkCustomerCtrl'
    });

    $routeProvider.when('/assortment/edit/:assortmentId/whiteboard', {
        templateUrl: 'views/assortmentEditWhiteboard.html',
        controller: 'AssortmentEditWhiteboardCtrl',
        templateName: 'Assortment Whiteboard'
    });

    $routeProvider.when('/assortment/edit/:assortmentId/linesheet', {
        templateUrl: 'views/assortmentEditLinesheet.html',
        controller: 'AssortmentEditLinesheetCtrl',
        templateName: 'Assortment'
    });

    $routeProvider.when('/assortment/edit/:assortmentId/catalog/list', {
        templateUrl: 'views/assortmentEditCatalogList.html',
        controller: 'AssortmentEditCatalogListCtrl'
    }).when('/assortment/edit/:assortmentId/catalog/master/:catalogId/browse', {
            templateUrl: 'views/assortmentEditBrowse.html',
            controller: 'AssortmentEditBrowseCtrl'
        });

    $routeProvider.when('/assortment/edit/:assortmentId/ordersummary', {
        templateUrl: 'views/assortmentOrderSummary.html',
        controller: 'AssortmentOrderSummaryCtrl',
        templateName: 'Order Summary'
    });

    /*----------------------SALES ROUTES ---------------------*/
    $routeProvider.when('/sales/dashboard', {
        templateUrl: 'views/salesDashboard.html',
        controller: 'SalesDashboardCtrl',
        templateName: 'Sales Dashboard'
    }).when('/sales', {
            redirectTo: '/sales/dashboard'
        });

    /*-------------------ORDER ROUTES-------------------------------*/
    $routeProvider.when('/order/list', {
        templateUrl: 'views/orderList.html',
        controller: 'OrderListCtrl',
        templateName: 'Order List'
    }).when('/order', {
            redirectTo: '/order/list'
        }).when('/orders/:orderId', {
            templateUrl: 'views/order.html',
            controller: 'OrderCtrl',
            templateName: 'Order'
        });

    /*-------------------Authentication--------------------------------*/
    $routeProvider.when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        templateName: 'Conductiv Select'
    });

    /*------------------------Route not found------------------------*/

    $routeProvider.when('/404', {
        templateUrl: 'views/404.html',
        controller: '404Ctrl'
    });

    /*-------------------------Product Search--------------------------*/
    $routeProvider.when('/product-styles/search', {
        templateUrl: 'views/404.html',
        controller: '404Ctrl'
    });

    /*-------------------tempepory page | product details -------------*/
    $routeProvider.when('/product/:id', {
        templateUrl: 'views/productDetails.html',
        controller: 'ProductCtrl'
    });

    $routeProvider.when('/future', {
        templateUrl: 'views/futureConcept.html',
        controller: 'FutureConceptCtrl'
    });

    $routeProvider.otherwise({
        redirectTo: '/404'
    });

    //configuration for ajax
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
//Webkit dragging input scroll fix (ECAT-719)
$('body').on('mousedown', 'input', function (e) {
    $(e.target).focus();
    e.preventDefault();
});

angular.module('select.mocks', []);

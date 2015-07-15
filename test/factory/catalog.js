Factory.define('catalog')
    .sequence('id', function (i) {
      return "1000" + i;
    })
    .sequence('name', function (i) {
      return "Catalog " + i;
    })
    .attr('type', "MasterCatalog")
    .attr('links', {
      "image": "https://sb-ecatalog.conductiv.com/capi/rest/files/VANSSB/Catalogs/S14_PRO_SKATE/ProSkate2014.png"
    });

Factory.define('catalog-details').extend('catalog')
    .attr('links', {
      "image": "https://sb-ecatalog.conductiv.com/capi/rest/files/VANSSB/Catalogs/S14_PRO_SKATE/ProSkate2014.png",
      "pages": "https://sb-ecatalog.conductiv.com/capi/rest/v2/VANSSB/master-catalogs/10070/pages",
      "product-styles": "https://sb-ecatalog.conductiv.com/capi/rest/v2/VANSSB/master-catalogs/10070/product-styles",
      "stylesheet": "https://sb-ecatalog.conductiv.com/capi/rest/files/VANSSB/Catalogs/S14_PRO_SKATE/layout.css"
    });

Factory.define('synced-catalog').extend('catalog-details')
    .attr('pages', function () {
      return [
        Factory.attributes('catalog-page'),
        Factory.attributes('catalog-page')
      ];
    });
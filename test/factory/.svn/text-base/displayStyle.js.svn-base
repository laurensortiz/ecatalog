Factory.define('displayStyle')
    .sequence('id', function (i) {
      return "10840" + i;
    })
    .attr('name', "links", "image", "style", "media", "connections")
Factory.define('displayStyle-local').extend('displayStyle')
    .sequence('key');

Factory.define('product-styles').extend('displayStyle')
    .attr('links', {
      "image": "https://sb-ecatalog.conductiv.com/capi/rest/files/VANSSB/Catalogs/S14_PRO_SKATE/ProSkate2014.png",
      "pages": "https://sb-ecatalog.conductiv.com/capi/rest/v2/VANSSB/master-catalogs/10070/pages",
      "product-styles": "https://sb-ecatalog.conductiv.com/capi/rest/v2/VANSSB/master-catalogs/10070/product-styles",
      "stylesheet": "https://sb-ecatalog.conductiv.com/capi/rest/files/VANSSB/Catalogs/S14_PRO_SKATE/layout.css"
    });

Factory.define('product-style-image').extend('displayStyle')
    .attr('styleId', "10840")
    .attr('type', "ProductStyleImage")
    .attr('media', "http://sb-ecatalog.conductiv.com/capi/rest/v2/VANSSB/product-styles/10840/media")
    .attr('lastModified', "Sun Jul 21 21:38:12 EDT 2013")
    .attr('links', {
      "image": "https://sb-ecatalog.conductiv.com/capi/rest/files/VANSSB/Products/VN-0VNRAYP.jpg",
      "style": "ProductStyleImage",
      "connections": "https://sb-ecatalog.conductiv.com/capi/rest/files/VANSSB/Catalogs/",
      "media": "video.jpg"
    });


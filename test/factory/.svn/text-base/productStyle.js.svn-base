Factory.define('productStyle')
    .sequence('id', function (i) {
      return "10840" + i;
    })
    .attr('name', "links")
Factory.define('productStyle-local').extend('productStyle')
    .sequence('key');

Factory.define('product-style-image').extend('productStyle')
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

Factory.define('product')
    .sequence('id', function (i) {
      "" + i;
    })
    .attr('name', false)
    .attr('type', false)
    .attr('code', false)
    .attr('styleCode', false)
		.attr('persistQuantity', false)
		.attr('quantity', false)
    .attr('code', false)
    .attr('links', function() {
      return [{}];
    });
Factory.define('product-style-image').extend('displayStyle')
    .attr('styleId', "10840")
    .attr('type', "ProductStyleImage")
    .attr('media', "http://sb-ecatalog.conductiv.com/capi/rest/v2/VANSSB/product-styles/10840/media")
    .attr('lastModified', "Sun Jul 21 21:38:12 EDT 2013")
    .attr('links', {
      image: "https://sb-ecatalog.conductiv.com/capi/rest/files/VANSSB/Products/VN-0VNRAYP.jpg",
      "style": "ProductStyleImage",
      "connections": "https://sb-ecatalog.conductiv.com/capi/rest/files/VANSSB/Catalogs/",
      "media": "video,jpg"
    });







Factory.define('catalog-page')
    .sequence('id', function (i) {
      return "1000" + i;
    })
    .sequence('masterCatalogPageNumber')
    .attr('type', "CatalogPage")
    .attr('links', function () {
      return {
        "template": "https://sb-ecatalog.conductiv.com/capi/rest/files/VANSSB/Templates/COVER_PAGE/template.html"
      }
    });
Factory.define('assortment-tab')
    .sequence('id')
    .sequence('description', function (i) {
      return "Tab " + i;
    })
    .sequence('groupId')
    .attr('createdBy', "laurens")
    .attr('lastUpdatedTime', "")
    .attr('links', {

        "products": [],
        "product-styles": []

    });


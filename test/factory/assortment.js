Factory.define('assortment-group')
    .sequence('id')
    .sequence('name', function (i) {
      return "Assortment Group " + i;
    });

/* Subscribe button events */
function formatDollars(number) {
  return "$ " + number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}

function onSubscribe() {
  var productId = this.dataset.product;
  var variantId = this.dataset.variant;
  var regularPriceUnformatted = parseFloat(this.dataset.regularprice, 10) / 100;
  var regularPrice = formatDollars(regularPriceUnformatted);
  var subscriptionPriceUnformatted = parseFloat(this.dataset.subscriptionprice, 10);
  var subscriptionPrice = formatDollars(subscriptionPriceUnformatted);
  var input = document.getElementById(variantId);
  var price = document.getElementById('price' + variantId);

  this.classList.toggle("btn-default");
  this.classList.toggle("btn-secondary");
  if (this.innerHTML === "Subscribe") {
    this.innerHTML = "Unsubscribe";
    price.innerHTML = subscriptionPrice;
    input.dataset.subscription = 1;
  } else {
    this.innerHTML = "Subscribe";
    price.innerHTML = regularPrice;
    input.dataset.subscription = 0;
  }
}

let subscribeButtons = document.querySelectorAll('.subscribe');
for (let i = 0; i < subscribeButtons.length; i++) {
  subscribeButtons[i].addEventListener('click', onSubscribe, false);
}
/* Subscribe button events end */




// Add to cart
Shopify.itemsToAdd = [];
Shopify.addItemstoTheCart = function() {
  if (Shopify.itemsToAdd.length) {
    var item = Shopify.itemsToAdd.pop();
    $.ajax({
      url: '/cart/add',
      dataType: 'json',
      type: 'post',
      data: item,
      success: Shopify.addItemstoTheCart,
      error: Shopify.addItemstoTheCart
    });
  } else {
    window.location.href = '/cart';
  }
}

jQuery(function($) {
  $('table .quantity:first').focus();
  $('[max]').change(function() {
    var max = parseInt($(this).attr('max'), 10);
    var value = parseInt($(this).val(), 10) || 0;
    if (value > max) {
      alert('We only have ' + max + ' of this item in stock');
      $(this).val(max);
    }
  });

  // Add products with quantity to array
  $('.add-to-cart-order-form').click(function() {
    Shopify.itemsToAdd = [];
    $('.input-number').each(function() {
      var subscription = this.dataset.subscription;
      var quantity = parseInt(this.value.replace(/\D/g, ''));
      var variantId = this.dataset.id;
      var subscribeVariantId = this.dataset.subscribeid;
      if (quantity) {
        if (subscription > 0) {
          Shopify.itemsToAdd.push({
            'id': subscribeVariantId,
            'quantity': quantity,
            'properties[shipping_interval_frequency]': "1",
            'properties[shipping_interval_unit_type]': "Weeks",
            'properties[subscription_id]': "14788"
          });
        } else {
          Shopify.itemsToAdd.push({
            'id': variantId,
            'quantity': quantity
          });
        }
      }
    });
    if (Shopify.itemsToAdd.length) {
      Shopify.addItemstoTheCart();
    }
    else {
      alert('All quantities are set to zero.');
      $('.add-to-cart-order-form').removeAttr('disabled').removeClass('disabled');
    }
  });
});

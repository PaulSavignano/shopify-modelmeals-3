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



// Plus and minus button events
function onChange(event) {
  console.log('clicked');
  let input;
  if (this.classList.contains('btn-number')) {
    input = this.parentNode.parentNode.children[1];
  } else {
    input = this;
  }
  // handle plus and minus buttons
  let qty = parseInt(input.value.replace(/\D/g, ''), 10);
  if (isNaN(qty)) {
    qty = 0;
  }
  let dataType = this.getAttribute('data-type');
  if (dataType === "minus") {
    if (qty > 0) {
      qty = qty - 1;
    }
  } else if (dataType === "plus") {
    qty = qty + 1;
  }
  // handle zero values
  if (qty === 0) {
    input.value = ''
  } else {
    input.value = qty;
  }
}

// Listen for click on inputs
let inputButtons = document.querySelectorAll('.btn-number');
for (let i = 0; i < inputButtons.length; i++) {
  inputButtons[i].addEventListener('click', onChange, false);
}



// Modal Carousel Script
$("#modal-carousel").carousel({interval:false});

/* change modal title when slide changes */
$("#modal-carousel").on("slid.bs.carousel", function () {
  $(".modal-title").html($(this).find(".active img").attr("title"));
});

/* click an image */
$(".modal-img").click(function() {
  console.log(this);
  var collection = this.dataset.collectionid;
  var top_level_div = document.getElementById('img-repo' + collection);
  var count = top_level_div.getElementsByTagName('div').length;
  var body = $(".modal-body");
  var title = $(".modal-title");
  body.empty();
  title.empty();
  var addCarousel = '';
  if (count > 1) {
    addCarousel = $('<div id="modal-carousel" class="carousel">\
                      <div class="carousel-inner"></div>\
                        <a class="carousel-control left" href="#modal-carousel" data-slide="prev">\
                          <i class="glyphicon glyphicon-chevron-left"></i>\
                        </a>\
                        <a class="carousel-control right" href="#modal-carousel" data-slide="next">\
                          <i class="glyphicon glyphicon-chevron-right"></i>\
                        </a>\
                      </div>');
  } else {
    addCarousel = $('<div id="modal-carousel" class="carousel">\
                      <div class="carousel-inner"></div>\
                      </div>');
  }
  body.append(addCarousel);
  var content = $(".carousel-inner");
  var id = this.id;
  var repo = $("#img-repo" + collection + " .item");
  var repoCopy = repo.filter("#" + id).clone();
  var active = repoCopy.first();
  active.addClass("active");
  title.html(active.find("img").attr("title"));
  content.append(repoCopy);
  $("#modal-gallery").modal("show");
});

/* Click a product title */
$(".modal-description").click(function(){
    $(".modal-title").empty;
    $(".modal-body").empty;
    var title = $(this).data('title');
    var description = $(this).data('description');
    $(".modal-title").html(title);
    $(".modal-body").html(description);
    $("#modal-gallery").modal("show");
});




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

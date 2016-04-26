NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
document.addEventListener("DOMContentLoaded", function(event) {


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



  /* Validate form quantities */
  let package8selections = 4;
  let package16selections = 8;
  let totalProductSelections;
  let productCollection1selected;
  let productCollection1remaining;
  let productCollection2remaining;
  let totalSelectionsRemaining;
  let totalPackageQty;
  let package1selections;
  let package2selections;
  let package1qty = 0;
  let package2qty = 0;

  // Disable product collection empty inputs if max
  function disableInputs(inputsClass, collectionRemaining) {
    let collectionInputs = inputsClass;
    for (let input of collectionInputs) {
      if (collectionRemaining === 0 && input.value === "") {
        input.disabled = "true";
      }
      if (collectionRemaining === 0 && input.value !== "") {
        input.value = input.value;
      }
      if (collectionRemaining > 0) {
        input.removeAttribute('disabled');
      }
    }
  }

  // display selected dishes
  function displaySelected(collectionRemaining, display, collectionSelected) {
    if (collectionRemaining > 0) {
      display.classList.remove("hidden");
      display.classList.add("show");
      if (display.id === 'display-main-dish-options') {
        display.innerHTML = "Choose " + collectionRemaining + " (max " + 2 * totalPackageQty + " of each main dish)";
      } else {
        display.innerHTML = "Choose " + collectionRemaining;
      }
      display.style.color = 'black'
    } else if (collectionSelected > 0) {
      if (display.id === 'display-main-dish-options') {
        display.innerHTML = "You've choosen " + collectionSelected + ", you're ready for your side dishes.";
      } else {
        display.innerHTML = "You've choosen " + collectionSelected + ", you're ready for any add on options.";
      }
      display.style.color = 'green'
    } else {
      display.classList.add("hidden");
      display.classList.remove("show");
      display.innerHTML = "";
    }
  }

  // set product collection 1 & 2 input max
  function setMax(productCollectionInputs, productCollectionRemaining, totalPackageQty, totalProductSelections) {
    for (let input of productCollectionInputs) {
      let max;
      if (productCollectionRemaining > 0) {
        input.setAttribute('lastvalue', input.value);
      }
      if (input.classList.contains('main-dish-options')) {
        max = 2 * totalPackageQty;
      } else if (input.classList.contains('side-dish-options')) {
        max = totalProductSelections;
      }
      input.setAttribute('max', max);
    }
  }






  function display() {
    // Get total package quantities
    let packageInputs = document.querySelectorAll(".package-options");
    for (let input of packageInputs) {
      if (input.dataset.product === "16-Dish Package") {
        if (input.value === '') {
          package1qty = 0;
          package1selections = 0;
        } else {
          package1qty = parseInt(input.value, 10)
          package1selections = package1qty * package16selections;
        }
      }
      if (input.dataset.product === "8-Dish Package") {
        if (input.value === '') {
          package2qty = 0;
          package2selections = 0;
        } else {
          package2qty = parseInt(input.value, 10)
          package2selections = package2qty * package8selections;
        }
      }
    }
    // Get total packages inputed
    totalPackageQty = package1qty + package2qty;
    // Get total product selection available
    totalProductSelections = package1selections + package2selections;

    // Find product collection 1 quantities
    let productCollection1inputs = document.querySelectorAll(".main-dish-options");
    productCollection1selected = 0;
    for (let input of productCollection1inputs) {
      if (input.value !== '') {
        productCollection1selected += parseInt(input.value,10);
      }
    }

    // Find Product Collection2 Quantities
    let productCollection2inputs = document.querySelectorAll(".side-dish-options");
    let productCollection2selected = 0;
    for (let input of productCollection2inputs) {
      if (input.value !== '') {
        productCollection2selected += parseInt(input.value,10);
      }
    }

    // Display Selected for Product Collection1
    let displayProductCollection1selected = document.getElementById('display-main-dish-options');
    productCollection1remaining = totalProductSelections - productCollection1selected;
    displaySelected(productCollection1remaining, displayProductCollection1selected, productCollection1selected);

    // Display Selected for Product Collection2
    let displayProductCollection2selected = document.getElementById('display-side-dish-options');
    productCollection2remaining = totalProductSelections - productCollection2selected;
    displaySelected(productCollection2remaining, displayProductCollection2selected, productCollection2selected);

    // Enable add to cart button
    totalSelectionsRemaining = productCollection1remaining + productCollection2remaining;
    let addToCartBtn = document.getElementById("add-to-cart-order-form");
    if (totalSelectionsRemaining === 0 && totalPackageQty > 0) {
      addToCartBtn.removeAttribute('disabled');
    } else {
      addToCartBtn.setAttribute('disabled', 'disabled');
    }
    // Disable product collection1 empty inputs if max
    disableInputs(productCollection1inputs, productCollection1remaining);
    disableInputs(productCollection2inputs, productCollection2remaining);

    // set input max for product collection 1 & 2
    setMax(productCollection1inputs, productCollection1remaining, totalPackageQty, totalProductSelections);
    setMax(productCollection2inputs, productCollection2remaining, totalPackageQty, totalProductSelections);

  }


  display();


  // On change functions
  function onChange(event) {
    // get input from button click or input focus
    let input;
    if (this.classList.contains('btn-number')) {
      input = this.parentNode.parentNode.children[1];
    } else {
      input = this;
    }

    // Click event updates to input
    if (event.type === 'click') {
      let qty = parseInt(input.value.replace(/\D/g, ''), 10);
      if (isNaN(qty)) {
        qty = 0;
      }

      // handle plus and minus buttons
      let dataType = this.getAttribute('data-type');
      if (dataType === "minus") {
        if (qty > 0) {
          qty = qty - 1;
          if (input.classList.contains('main-dish-options')) {
            productCollection1remaining = productCollection1remaining + 1;
          }
          if (input.classList.contains('side-dish-options')) {
            productCollection2remaining = productCollection2remaining + 1;
          }
        }
      } else if (dataType === "plus") {
        if (input.classList.contains('main-dish-options')) {
          if (qty < input.max && productCollection1remaining > 0) {
            qty = qty + 1;
            productCollection1remaining = productCollection1remaining - 1;
          }
        } else if (input.classList.contains('side-dish-options')) {
          if (qty < input.max && productCollection2remaining > 0) {
            qty = qty + 1;
            productCollection2remaining = productCollection2remaining - 1;
          }
        } else {
          qty = qty + 1
        }
      }

      // handle zero values
      if (qty === 0) {
        input.value = ''
      } else {
        input.value = qty;
      }
    }

    // handle keyup inputs
    if (event.type === 'keyup') {
      function validate(input, remaining, display) {
        if (input.value > remaining) {
          if (remaining > input.max) {
            input.value = input.max;
            remaining -= input.value
          } else if (input.value.length > 1) {
            console.log('length: ' + 1);
            input.value = display.dataset.quantity;
            remaining -= input.value
          } else {
            input.value = display.dataset.quantity;
            remaining -= input.value
          }
        } else if (input.value > input.max) {
          input.value = input.max;
          remaining -= input.value
        }
      }

      if (input.classList.contains('main-dish-options')) {
        let display = document.getElementById('display-main-dish-options');
        validate(input, productCollection1remaining, display);
      }

      if (input.classList.contains('side-dish-options')) {
        let display = document.getElementById('display-side-dish-options');
        validate(input, productCollection2remaining, display);
      }
      display();
    }

    // Set dataset for quantity and id to handle input values of length
    if (event.type === 'focus' || event.keyCode === 8) {
      let displayMainEl = document.getElementById('display-main-dish-options');
      let displaySideEl = document.getElementById('display-side-dish-options');
      displayMainEl.dataset.event = input.id;
      displayMainEl.dataset.quantity = productCollection1remaining;
      displaySideEl.dataset.event = input.id;
      displaySideEl.dataset.quantity = productCollection2remaining;
    }

    // Disable product collection empty inputs if max
    let productCollection1inputs = document.querySelectorAll(".main-dish-options");
    let productCollection2inputs = document.querySelectorAll(".side-dish-options");
    disableInputs(productCollection1inputs, productCollection1remaining);
    disableInputs(productCollection2inputs, productCollection2remaining);

    // Clear inputs if package quantity is reduced
    if (input.classList.contains("package-options")) {
      if (input.getAttribute('lastvalue') === input.value) {
        input.setAttribute('lastvalue', input.value);
      } else {
        console.log(input.value < input.getAttribute('lastvalue') ? 'decrement' : 'increment');
        if (input.value < input.getAttribute('lastvalue')) {
          let productCollection1and2inputs = document.querySelectorAll(".main-dish-options, .side-dish-options");
          for (let input of productCollection1and2inputs) {
            input.value = '';
            input.removeAttribute('disabled');
          }
        }
        if (input.value === '') {
          input.setAttribute('lastvalue', 0);
        } else {
          input.setAttribute('lastvalue', input.value);
        }
      }
    }
    display();
  }

  // Listen for click on inputs
  let inputButtons = document.querySelectorAll('.btn-number');
  for (let i = 0; i < inputButtons.length; i++) {
    inputButtons[i].addEventListener('click', onChange, false);
    inputButtons[i].addEventListener('focus', onChange, false);
    inputButtons[i].parentNode.parentNode.children[1].addEventListener('keyup', onChange, false);
    inputButtons[i].parentNode.parentNode.children[1].addEventListener('focus', onChange, false);
  }
});




// Modal Carousel Script
$("#modal-carousel").carousel({interval:false});

/* change modal title when slide changes */
$("#modal-carousel").on("slid.bs.carousel", function () {
  $(".modal-title").html($(this).find(".active img").attr("title"));
});

/* click an image */
$(".modal-img").click(function() {
  var collection = this.dataset.collection;
  var top_level_div = document.getElementById('img-repo' + collection);
  var count = top_level_div.getElementsByTagName('div').length;
  var body = $(".modal-body");
  var title = $(".modal-title");
  body.empty();
  title.empty();
  var addCarousel = '';
  if (count > 1) {
    addCarousel = $('<div id="modal-carousel" class="carousel">' +
                      '<div class="carousel-inner"></div>' +
                        '<a class="carousel-control left" href="#modal-carousel" data-slide="prev">' +
                          '<i class="glyphicon glyphicon-chevron-left"></i>' +
                        '</a>' +
                        '<a class="carousel-control right" href="#modal-carousel" data-slide="next">' +
                          '<i class="glyphicon glyphicon-chevron-right"></i>' +
                        '</a>' +
                      '</div>');
  } else {
    addCarousel = $('<div id="modal-carousel" class="carousel">' +
                      '<div class="carousel-inner"></div>' +
                      '</div>');
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

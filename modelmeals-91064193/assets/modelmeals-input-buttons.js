/* Plus and minus button events */
function onClick(event) {
  $(".alert").alert()
  var input = this.parentNode.parentNode.children[1]
  var max = parseInt(input.max.replace(/\D/g, ''), 10);

  var qty = parseInt(input.value.replace(/\D/g, ''), 10);
  if (isNaN(qty)) {
    qty = 0;
  }
  // click event
  var dataType = this.getAttribute('data-type');
  if (dataType === "minus") {
    if (qty > 0) {
      qty = qty - 1;
    }
  } else if (dataType === "plus") {
    if (max) {
      if (qty < max) {
        qty = qty + 1;
      } else {
        qty = qty;
        $("#flash-message").html('We only have ' + max + ' of this item in stock.');
        $("#flash-message").fadeIn();
        closeFlashMessage();
        alert('We only have ' + max + ' of this item in stock.');
      }
    } else {
      qty = qty + 1;
    }
  }

  // handle zero values
  if (qty === 0) {
    input.value = ''
  } else {
    input.value = qty;
  }
}


// Keyup listener
function onKeyup(event) {
  if (isNaN(this.value)) {
    this.value = 0;
  }

  var input = parseInt(this.value.replace(/\D/g, ''), 10)
  var max = parseInt(this.max.replace(/\D/g, ''), 10);
  if (input > max) {
    this.value = max;
    $("#flash-message").html('We only have ' + max + ' of this item in stock.');
    $("#flash-message").fadeIn();
    closeFlashMessage();
    alert('We only have ' + max + ' of this item in stock');
  }

  if (input === 0) {
    this.value = ''
  }
}

var inputButtons = document.querySelectorAll('.btn-number');
for (var i = 0; i < inputButtons.length; i++) {
  inputButtons[i].addEventListener('click', onClick, false);
  inputButtons[i].parentNode.parentNode.children[1].addEventListener('keyup', onKeyup, false);
}
/* Plus and minus button events end */

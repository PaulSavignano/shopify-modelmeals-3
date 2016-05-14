/* Plus and minus button events */
function onChange(event) {
  var input;
  if (this.classList.contains('btn-number')) {
    input = this.parentNode.parentNode.children[1];
  } else {
    input = this;
  }
  // handle plus and minus buttons
  var qty = parseInt(input.value.replace(/\D/g, ''), 10);
  if (isNaN(qty)) {
    qty = 0;
  }
  var dataType = this.getAttribute('data-type');
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

var inputButtons = document.querySelectorAll('.btn-number');
for (var i = 0; i < inputButtons.length; i++) {
  inputButtons[i].addEventListener('click', onChange, false);
}
/* Plus and minus button events end */

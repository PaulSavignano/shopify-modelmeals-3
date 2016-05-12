/* Plus and minus button events */
function onChange(event) {
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

let inputButtons = document.querySelectorAll('.btn-number');
for (let i = 0; i < inputButtons.length; i++) {
  inputButtons[i].addEventListener('click', onChange, false);
}
/* Plus and minus button events end */

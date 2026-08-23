import {
  cart,
  deleteFromCart,
  updateCartQuantity,
  saveToStorage,
} from "../data/cart.js";
import { products } from "../data/products.js";

const today = dayjs();
console.log(`todays date: ${today}`);
const newDate = today.add(7, "days");
console.log(`7 days later date: ${newDate}`);

console.log(today.format("DD, MMMM YYYY"));

let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((productItem) => {
    if (productId === productItem.id) {
      matchingProduct = productItem;
    }
  });

  cartSummaryHTML += `
          <div class="cart-item-container js-cart-item-container-${matchingProduct.id}" data-container-id=${matchingProduct.id}>
            <div class="delivery-date">Delivery date: Tuesday, June 21</div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src="${matchingProduct.image}"
              />

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">$${(matchingProduct.priceCents / 100).toFixed("2")}</div>
                <div class="product-quantity">
                  <span> Quantity: <span class="quantity-label js-quantity-label">${cartItem.quantity}</span> </span>
                  <span class="update-quantity-link js-update-link link-primary" data-product-id = ${matchingProduct.id}>
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input">
                  <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id = ${matchingProduct.id}>Save</span>
                  <span class="delete-quantity-link js-delete-link link-primary" data-product-id = ${matchingProduct.id}>
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input
                    type="radio"
                    checked
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}"
                  />
                  <div>
                    <div class="delivery-option-date">Tuesday, June 21</div>
                    <div class="delivery-option-price">FREE Shipping</div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input
                    type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}"
                  />
                  <div>
                    <div class="delivery-option-date">Wednesday, June 15</div>
                    <div class="delivery-option-price">$4.99 - Shipping</div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input
                    type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}"
                  />
                  <div>
                    <div class="delivery-option-date">Monday, June 13</div>
                    <div class="delivery-option-price">$9.99 - Shipping</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  `;
});

document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    deleteFromCart(productId);
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`,
    );
    container.remove();
    updateCartQuantity();
  });
});
updateCartQuantity();

document.querySelectorAll(".js-update-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`,
    );
    container.classList.add("is-editing-quantity");
    console.log(container);
  });
});

// Enter key on the quantity input
document.querySelectorAll(".js-quantity-input").forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const container = input.closest(".cart-item-container");
      const productId = container.dataset.containerId;

      saveQuantity(productId, container);
    }
  });
});

// Click on Save
document.querySelectorAll(".js-save-quantity-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`,
    );

    saveQuantity(productId, container);
  });
});

function saveQuantity(productId, container) {
  const input = container.querySelector(".js-quantity-input");

  const newQuantity = Number(input.value);
  if (newQuantity <= 0 || newQuantity > 100) {
    alert("invalid Quantity");
    return;
  }

  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      cartItem.quantity = newQuantity;
    }
  });
  saveToStorage();
  updateCartQuantity();
  container.querySelector(".js-quantity-label").innerHTML = newQuantity;

  container.classList.remove("is-editing-quantity");
}

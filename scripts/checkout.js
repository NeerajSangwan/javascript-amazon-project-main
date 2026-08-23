import {
  cart,
  deleteFromCart,
  updateCartQuantity,
  saveToStorage,
  updateDeliveryOption,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { deliveryOptions } from "../data/deliveryOptions.js";
import { formatMoney } from "./utils/money.js";

function renderOrderSummary() {
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct;

    products.forEach((productItem) => {
      if (productId === productItem.id) {
        matchingProduct = productItem;
      }
    });

    const deliveryOptionId = cartItem.deliveryOptionsId;

    let deliveryOption;

    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
      }
    });
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHTML += `
              <div class="cart-item-container js-cart-item-container-${matchingProduct.id}" data-container-id=${matchingProduct.id}>
                <div class="delivery-date">Delivery date: ${dateString}</div>

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

                  <div class="delivery-options ">
                    <div class="delivery-options-title">
                      Choose a delivery option:
                    </div>
                            ${deliveryOptionsHTML(matchingProduct, cartItem)}
                  </div>
                </div>
              </div>
      `;
  });
  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";

    const today = dayjs();
    deliveryOptions.forEach((option) => {
      const deliveryDate = today.add(option.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");

      const priceString =
        option.priceCents === 0
          ? "FREE"
          : `$${formatMoney(option.priceCents)} - Shipping`;

      const isChecked = option.id === cartItem.deliveryOptionsId;

      html += `
          <div class="delivery-option js-delivery-option" data-delivery-option-id = "${option.id}" data-product-id = "${matchingProduct.id}">
            <input
              type="radio"
              ${isChecked ? "Checked" : ""}
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}"
            />
            <div>
              <div class="delivery-option-date">${dateString}</div>
              <div class="delivery-option-price">${priceString}</div>
            </div>
          </div>
        `;
    });

    return html;
  }

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
    });
  });

  document.querySelectorAll(".js-quantity-input").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const container = input.closest(".cart-item-container");
        const productId = container.dataset.containerId;

        saveQuantity(productId, container);
      }
    });
  });

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

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
    });
  });
}

renderOrderSummary();

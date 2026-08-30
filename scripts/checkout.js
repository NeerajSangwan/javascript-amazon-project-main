import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";

// import "../data/cart-class.js";
import "../data/backend-practice.js";

new Promise((resolve) => {
  loadProducts(() => {
    resolve();
  });
}).then(() => {
  loadProducts(() => {
    renderOrderSummary();
    renderPaymentSummary();
  });
});

/*
loadProducts(() => {
  renderOrderSummary();
  renderPaymentSummary();
});
*/

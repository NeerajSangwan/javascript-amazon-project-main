import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";

// import "../data/cart-class.js";
import "../data/backend-practice.js";

/*
async function loadPage() {
  await loadProductsFetch();

  await new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  });

  renderOrderSummary();
  renderPaymentSummary();
}
loadPage();
*/

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

import renderHeader from "../components/header.js";
import renderFooter from "../components/footer.js";
import showToast from "../components/toast.js";
import { getOrders, cancelOrder } from "../utils/api.js";
import { qs } from "../utils/dom.js";
import { isLoggedIn } from "../utils/auth.js";

renderHeader();
renderFooter();

const ordersList = qs("#ordersList");

window.addEventListener("DOMContentLoaded", async () => {
  if (!isLoggedIn()) {
    showToast("Please login to view your orders.", "error");
    window.location.href = "login.html";
    return;
  }
  await loadOrders();
});

async function loadOrders() {
  ordersList.innerHTML = '<div style="text-align:center">Loading...</div>';
  try {
    const orders = await getOrders();
    if (!orders.length) {
      ordersList.innerHTML = '<div style="text-align:center;margin:40px 0;">No orders yet.</div>';
      return;
    }
    ordersList.innerHTML = "";
    orders.forEach(renderOrderCard);
  } catch (err) {
    ordersList.innerHTML = `<div style="color:#d00;margin-top:18px;">Failed to load orders.<br>${err.message}</div>`;
  }
}

function renderOrderCard(order) {
  const div = document.createElement("div");
  div.className = "order-card";
  div.innerHTML = `
    <h3>Order #:${order.id} <span style="font-weight:400;font-size:.97rem;color:#999;">(${new Date(order.created_at).toLocaleString()})</span></h3>
    <ul class="order-items-list">
      ${order.items.map(item => `
        <li>
          <img src="${item.image || "images/sample1.png"}" alt="${item.name}" />
          <span>${item.name}</span>  .     (x <span>${item.quantity}</span> &mdash; 
          <span>$${Number(item.price).toLocaleString()})</span>
        </li>
      `).join("")}
    </ul>
    <div class="order-total">Total: $${Number(order.total).toLocaleString()}</div>
    <button class="order-cancel-btn">Cancel Order</button>
  `;
  // Cancel
  div.querySelector(".order-cancel-btn").onclick = async () => {
    if (!confirm("Cancel this order?")) return;
    try {
      await cancelOrder(order.id);
      showToast("Order cancelled.", "success");
      await loadOrders();
    } catch (err) {
      showToast(err.message, "error");
    }
  };
  ordersList.appendChild(div);
}
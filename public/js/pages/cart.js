import renderHeader, { updateCartCountUI } from "../components/header.js";
import renderFooter from "../components/footer.js";
import showToast from "../components/toast.js";
import {
  getCart,
  updateCartQuantity,
  removeCartItem,
  checkoutOrder,
} from "../utils/api.js";
import { qs } from "../utils/dom.js";
import { isLoggedIn } from "../utils/auth.js";

renderHeader();
renderFooter();

const cartList = qs("#cartList");
const cartSummary = qs("#cartSummary");

window.addEventListener("DOMContentLoaded", async () => {
  if (!isLoggedIn()) {
    showToast("Please login to view your cart.", "error");
    window.location.href = "login.html";
    return;
  }
  await loadCart();
});

async function loadCart() {
  cartList.innerHTML =
    '<div style="text-align:center;margin-top:28px;">Loading...</div>';
  cartSummary.innerHTML = "";
  try {
    const cart = await getCart();
    if (!cart.length) {
      cartList.innerHTML =
        '<div style="text-align:center;margin:38px 0 0 0;">Your cart is empty.</div>';
      await updateCartCountUI(); // update cart count if emptied
      return;
    }
    cartList.innerHTML = "";
    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += item.price * item.quantity;
      renderCartItem(item);
    });
    renderSummary(subtotal);
    await updateCartCountUI(); // update cart count after loading cart
  } catch (err) {
    cartList.innerHTML = `<div style="color:#d00;margin-top:18px;">Failed to load cart.<br>${err.message}</div>`;
  }
}

function renderCartItem(item) {
  const div = document.createElement("div");
  div.className = "cart-item";
  div.innerHTML = `
    <a href="product.html?id=${item.id}" class="cart-item-link">
      <img src="${item.image || "images/sample1.png"}" alt="${item.name}" />
    </a>
    <div class="cart-item-details">
      <a href="product.html?id=${item.id}" class="cart-item-link">
        <div class="cart-item-name">${item.name}</div>
      </a>
      <div class="cart-item-price">$${Number(item.price).toLocaleString()}</div>
      <div class="cart-item-qty">
        <button aria-label="Decrease quantity" class="qty-decrease">-</button>
        <span>${item.quantity}</span>
        <button aria-label="Increase quantity" class="qty-increase">+</button>
        <button class="cart-item-remove" aria-label="Remove item">&times;</button>
      </div>
    </div>
  `;
  // Correctly get the 3 buttons in order
  const [decBtn, incBtn, removeBtn] = div.querySelectorAll("button");
  if (decBtn && incBtn && removeBtn) {
    decBtn.onclick = async () => {
      if (item.quantity > 1) {
        await updateQty(item.id, item.quantity - 1);
      }
    };
    incBtn.onclick = async () => {
      if (item.quantity < item.stock) {
        await updateQty(item.id, item.quantity + 1);
      } else {
        showToast("Max stock reached.", "info");
      }
    };
    removeBtn.onclick = async () => {
      try {
        await removeCartItem(item.id);
        showToast("Removed from cart.", "success");
        await loadCart();
        await updateCartCountUI(); // update cart count after removing
      } catch (err) {
        showToast(err.message, "error");
      }
    };
  } else {
    // Defensive: log error if markup is not as expected
    console.error("Cart item buttons missing!", { decBtn, incBtn, removeBtn, item });
  }
  cartList.appendChild(div);
}

async function updateQty(productId, qty) {
  try {
    await updateCartQuantity(productId, qty);
    await loadCart();
    await updateCartCountUI(); // update cart count after qty change
  } catch (err) {
    showToast(err.message, "error");
  }
}

function renderSummary(subtotal) {
  // Shipping: N5 if subtotal < 50, else free
  const shipping = subtotal < 50 ? 5 : 0;
  const total = subtotal + shipping;
  cartSummary.innerHTML = `
    <div class="total-row"><span>Subtotal</span><span>$${subtotal.toLocaleString()}</span></div>
    <div class="total-row"><span>Shipping</span><span>$${shipping}</span></div>
    <div class="total-row"><b>Total</b><b>$${total.toLocaleString()}</b></div>
    <button class="checkout-btn">Checkout</button>
  `;
  cartSummary.querySelector(".checkout-btn").onclick = async () => {
    try {
      const res = await checkoutOrder();
      showToast(`Order placed! Shipping: $${res.shipping}.`, "success", 5000);
      setTimeout(() => (window.location.href = "orders.html"), 1000);
      await updateCartCountUI(); // update cart count after checkout
    } catch (err) {
      showToast(err.message, "error");
    }
  };
}
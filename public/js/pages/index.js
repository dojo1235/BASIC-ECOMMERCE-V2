// pages/index.js

import renderHeader, { updateCartCountUI } from "../components/header.js";
import renderFooter from "../components/footer.js";
import showToast from "../components/toast.js";
import { fetchProducts, addToCart } from "../utils/api.js";
import { qs } from "../utils/dom.js";
import { isLoggedIn } from "../utils/auth.js";

// Render header/footer
renderHeader();
renderFooter();

const productGrid = qs("#productGrid");
const searchInput = qs("#searchInput");
const searchBtn = qs("#searchBtn");

let products = [];

window.addEventListener("DOMContentLoaded", async () => {
  await loadProducts();
});

if (searchBtn) {
  searchBtn.onclick = async () => {
    await loadProducts(searchInput.value.trim());
  };
}

if (searchInput) {
  searchInput.addEventListener("keyup", async (e) => {
    if (e.key === "Enter") {
      await loadProducts(searchInput.value.trim());
    }
  });
}

async function loadProducts(search = "") {
  productGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center">Loading...</div>`;
  try {
    products = await fetchProducts(search);
    if (!Array.isArray(products) || !products.length) {
      productGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center">No products found.</div>`;
      return;
    }

    productGrid.innerHTML = "";
    products.forEach(renderProductCard);
  } catch (err) {
    productGrid.innerHTML = `<div style="color:#d00;text-align:center">Failed to load products.<br>${err.message}</div>`;
  }
}

function renderProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", product.name);

  card.innerHTML = `
    <img src="${product.image || 'images/sample1.png'}" alt="${product.name}" />
    <div class="product-name">${product.name}</div>
    <div class="product-price">$${Number(product.price).toLocaleString()}</div>
    <button class="btn-add-cart"
      ${!isLoggedIn() ? "disabled title='Login to add to cart'" : ""}
      ${product.stock < 1 ? "disabled title='Out of stock'" : ""}>
      Add to Cart
    </button>
  `;

  card.onclick = (e) => {
    if (e.target.classList.contains("btn-add-cart")) return;
    window.location.href = `product.html?id=${product.id}`;
  };

  const addBtn = card.querySelector(".btn-add-cart");
  if (addBtn) {
    addBtn.onclick = async (e) => {
      e.stopPropagation();
      if (!isLoggedIn()) {
        showToast("Please login to add to cart.", "error");
        window.location.href = "login.html";
        return;
      }

      try {
        await addToCart(product.id, 1);
        showToast("Added to cart!", "success");
        await updateCartCountUI();
      } catch (err) {
        showToast(err.message, "error");
      }
    };
  }

  productGrid.appendChild(card);
}
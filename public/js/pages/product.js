import renderHeader, { updateCartCountUI } from "../components/header.js";
import renderFooter from "../components/footer.js";
import showToast from "../components/toast.js";
import { fetchProductById, addToCart } from "../utils/api.js";
import { qs } from "../utils/dom.js";
import { isLoggedIn } from "../utils/auth.js";

// Render header/footer
renderHeader();
renderFooter();

const productDetails = qs("#productDetails");
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

window.addEventListener("DOMContentLoaded", async () => {
  if (!productId) {
    productDetails.innerHTML = `<div>Product not found.</div>`;
    return;
  }
  try {
    const products = await fetchProductById(productId);
    renderProductDetails(products);
  } catch (err) {
    productDetails.innerHTML = `<div style="color:#d00;">Failed to load product.<br>${err.message}</div>`;
  }
});

function renderProductDetails(product) {
  productDetails.innerHTML = `
    <img src="${product.image || 'images/sample1.png'}" alt="${product.name}" />
    <div class="product-name">${product.name}</div>
    <div class="product-desc">${product.description || ""}</div>
    <div class="product-price">$${Number(product.price).toLocaleString()}</div>
    <div class="product-stock">${product.stock > 0 ? `In stock: ${product.stock}` : `<span style="color:#d00">Out of stock</span>`}</div>
    <button class="btn-add-cart" ${!isLoggedIn() ? "disabled title='Login to add to cart'" : ""} ${product.stock < 1 ? "disabled title='Out of stock'" : ""}>Add to Cart</button>
  `;

  const addBtn = productDetails.querySelector(".btn-add-cart");
  addBtn.onclick = async () => {
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
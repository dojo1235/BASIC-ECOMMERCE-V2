// utils/api.js

import { getToken } from "./auth.js";

const BASE_URL = "/api";

// Fetch helper that handles token and errors
async function apiFetch(url, options = {}) {
  const token = getToken();
  options.headers = options.headers || {};
  options.headers["Content-Type"] = "application/json";
  if (token) options.headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(BASE_URL + url, options);
  let json = {};

  try {
    json = await res.json();
  } catch (e) {
    // fallback for non-JSON responses
    throw new Error("Invalid server response");
  }

  if (!res.ok) {
    throw new Error(json.message || "API Error");
  }

  return json; // no more auto .data
}

// PRODUCTS
export async function fetchProducts(search = "") {
  let url = "/products";
  if (search) url += "?search=" + encodeURIComponent(search);
  const res = await apiFetch(url);
  // Adjust depending on actual backend return
  return res.products || res.data?.products || []; // safe fallback
}

export async function fetchProductById(id) {
  const res = await apiFetch(`/products/${id}`);
  return res.product || res.data?.product;
}

// CART
export async function getCart() {
  const res = await apiFetch("/cart");
  return res.cart || res.data?.cart || [];
}

export async function getCartCount() {
  try {
    const cart = await getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  } catch {
    return 0;
  }
}

export async function addToCart(productId, quantity = 1) {
  return apiFetch("/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function updateCartQuantity(productId, quantity) {
  return apiFetch("/cart", {
    method: "PUT",
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function removeCartItem(productId) {
  return apiFetch(`/cart/${productId}`, {
    method: "DELETE",
  });
}

// ORDERS
export async function getOrders() {
  const res = await apiFetch("/orders");
  return res.orders || res.data?.orders || [];
}

export async function checkoutOrder() {
  return apiFetch("/orders/checkout", { method: "POST" });
}

export async function cancelOrder(orderId) {
  return apiFetch(`/orders/${orderId}`, { method: "DELETE" });
}

// AUTH
export async function loginApi(email, password) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerApi(name, email, password) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}
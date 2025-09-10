// Header Component (renders on all pages)
import { getCartCount } from "../utils/api.js";
import { logout, isLoggedIn } from "../utils/auth.js";
import showToast from "./toast.js";

// --- Add this function for live cart count updates ---
export async function updateCartCountUI() {
  try {
    const count = await getCartCount();
    const cartCountElem = document.getElementById("cartCount");
    if (cartCountElem) {
      cartCountElem.innerText = count;
      cartCountElem.style.display = count > 0 ? "inline-block" : "none";
    }
  } catch {
    const cartCountElem = document.getElementById("cartCount");
    if (cartCountElem) cartCountElem.innerText = "0";
  }
}

function renderHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  header.innerHTML = `
    <div class="header">
      <div class="left">
        <button class="hamburger" aria-label="Menu" id="menuBtn">&#9776;</button>
        <span class="logo"><a href="index.html" style="text-decoration:none;color:#ff9900">Dojo's Tech</a></span>
      </div>
      <div class="right">
        <a href="cart.html" aria-label="View cart" class="cart-icon" id="cartIcon">
          🛒<span class="cart-count" id="cartCount">0</span>
        </a>
      </div>
    </div>
    <aside class="menu-drawer" id="menuDrawer" tabindex="-1" aria-label="Menu">
      <div class="menu-header">
        <span style="font-weight:700;font-size:1.12rem">MENU</span>
        <button class="close-btn" id="closeMenuBtn" aria-label="Close menu">&times;</button>
      </div>
      <nav>
        <a href="orders.html">Orders</a>
        <a href="#" id="aboutLink">About Us</a>
        <a href="#" id="contactLink">Contact Us</a>
        ${isLoggedIn() ? `<a href="#" class="logout" id="logoutBtn">Logout</a>` : `<a href="login.html">Login</a>`}
      </nav>
    </aside>
    <div id="drawer-backdrop" style="display:none;position:fixed;z-index:1999;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.13)"></div>
  `;

  // Hamburger menu logic
  const menuBtn = document.getElementById("menuBtn");
  const closeMenuBtn = document.getElementById("closeMenuBtn");
  const menuDrawer = document.getElementById("menuDrawer");
  const backdrop = document.getElementById("drawer-backdrop");
  menuBtn.onclick = () => openDrawer();
  closeMenuBtn.onclick = () => closeDrawer();
  backdrop.onclick = () => closeDrawer();

  function openDrawer() {
    menuDrawer.classList.add("open");
    backdrop.style.display = "block";
    menuDrawer.focus();
  }
  function closeDrawer() {
    menuDrawer.classList.remove("open");
    backdrop.style.display = "none";
  }

  // Trap focus in drawer
  menuDrawer.onkeydown = (e) => {
    if (e.key === "Escape") closeDrawer();
  };

  // About/Contact modals
  document.getElementById("aboutLink").onclick = (e) => {
    e.preventDefault();
    showToast("PFalcon Shop &copy; 2025. Inspired by Jumia.com.ng. Demo only.", "info", 5000);
    closeDrawer();
  };
  document.getElementById("contactLink").onclick = (e) => {
    e.preventDefault();
    showToast("Contact: PFalcon@example.com<br>Phone: +234-800-0000", "info", 6000);
    closeDrawer();
  };

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = (e) => {
      e.preventDefault();
      logout();
      showToast("Logged out.", "success");
      window.location.href = "login.html";
    };
  }

  // --- Use the exported updater for initial count ---
  updateCartCountUI();
}

export default renderHeader;
// Toast Notification System
// Usage: showToast("Message", "success"|"error"|"info", timeout_ms)
function showToast(message, type = "info", timeout = 3000) {
  const container = document.getElementById("toast-container") || (() => {
    const c = document.createElement("div");
    c.id = "toast-container";
    document.body.appendChild(c);
    return c;
  })();

  // Remove HTML tags for screen readers, but support <br>
  const msg = message.replace(/<script.*?>.*?<\/script>/gi, "").replace(/</g, "&lt;").replace(/&lt;br&gt;/g, "<br>");

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${msg}</span>
    <button class="toast-close" aria-label="Close">&times;</button>`;
  container.appendChild(toast);

  // Close on click
  toast.querySelector(".toast-close").onclick = () => {
    toast.remove();
  };
  setTimeout(() => toast.remove(), timeout);

  // Make globally accessible
  window.showToast = showToast;
}
export default showToast;
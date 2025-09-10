// Footer Component (renders on all pages)
function renderFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return;
  footer.innerHTML = `
    <div class="footer">
      <div class="footer-links">
        <a href="#" onclick="showFooterModal('about')">About Us</a> |
        <a href="#" onclick="showFooterModal('contact')">Contact Us</a>
      </div>
      <div class="copyright">
        &copy; 2025 PFalcon Shop | Demo. Not affiliated with jumia.com.ng.
      </div>
    </div>
  `;
}
// Simple modal using toast for About/Contact in footer
window.showFooterModal = function(type) {
  const showToast = window.showToast || ((msg) => alert(msg));
  if (type === "about")
    showToast("PFalcon Shop is a demo project inspired by Jumia.com.ng. &copy; 2025", "info", 5000);
  if (type === "contact")
    showToast("Contact: PFalcon@example.com<br>Phone: +234-800-0000", "info", 6000);
};

export default renderFooter;
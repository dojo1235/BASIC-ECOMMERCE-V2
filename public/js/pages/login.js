import renderHeader from "../components/header.js";
import renderFooter from "../components/footer.js";
import showToast from "../components/toast.js";
import { loginApi } from "../utils/api.js";
import { setToken, setUser, isLoggedIn } from "../utils/auth.js";
import { qs } from "../utils/dom.js";

renderHeader();
renderFooter();

const form = qs("#loginForm");
if (form) {
  form.onsubmit = async (e) => {
    e.preventDefault();
    const email = qs("#email").value.trim();
    const password = qs("#password").value;
    if (!email || !password) {
      showToast("All fields required.", "error");
      return;
    }
    try {
      const res = await loginApi(email, password);
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      showToast("Login successful!", "success");
      setTimeout(() => (window.location.href = "index.html"), 600);
    } catch (err) {
      showToast(err.message, "error");
    }
  };
}

window.addEventListener("DOMContentLoaded", () => {
  if (isLoggedIn()) window.location.href = "index.html";
});
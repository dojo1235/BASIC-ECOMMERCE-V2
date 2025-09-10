import renderHeader from "../components/header.js";
import renderFooter from "../components/footer.js";
import showToast from "../components/toast.js";
import { registerApi } from "../utils/api.js";
import { setToken, setUser, isLoggedIn } from "../utils/auth.js";
import { qs } from "../utils/dom.js";

renderHeader();
renderFooter();

const form = qs("#registerForm");
if (form) {
  form.onsubmit = async (e) => {
    e.preventDefault();
    const name = qs("#name").value.trim();
    const email = qs("#email").value.trim();
    const password = qs("#password").value;
    if (!name || !email || !password) {
      showToast("All fields required.", "error");
      return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }
    try {
      const res = await registerApi(name, email, password);
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      showToast("Registration successful!", "success");
      setTimeout(() => (window.location.href = "index.html"), 600);
    } catch (err) {
      showToast(err.message, "error");
    }
  };
}

window.addEventListener("DOMContentLoaded", () => {
  if (isLoggedIn()) window.location.href = "index.html";
});
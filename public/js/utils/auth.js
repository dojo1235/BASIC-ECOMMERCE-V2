// Frontend Auth helpers using localStorage
const TOKEN_KEY = "jwt_token";
const USER_KEY = "user";

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}
export function isLoggedIn() {
  return !!getToken();
}
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
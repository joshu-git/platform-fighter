const API_BASE = "/.netlify/functions";

export const api = {
  async login(username, password) {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    localStorage.setItem("authToken", data.token);
    localStorage.setItem("username", data.user.username);
    if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);

    return data;
  },

  async register(username, email, password) {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    return data;
  },

  async verify(token) {
    const res = await fetch(`${API_BASE}/verify?token=${encodeURIComponent(token)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Verification failed");

    // Store tokens automatically after verification
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("username", data.user.username);

    return data;
  },

  async refreshToken() {
    const token = localStorage.getItem("refreshToken");
    if (!token) return null;

    const res = await fetch(`${API_BASE}/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    localStorage.setItem("authToken", data.token);
    return data.token;
  },

  getToken() {
    return localStorage.getItem("authToken");
  },

  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
  },
};
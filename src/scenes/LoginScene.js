import { api } from "../utils/api.js";

export class LoginScene extends Phaser.Scene {
  constructor() {
    super({ key: "LoginScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#0b0d16");

    this.add.text(this.scale.width / 2, 100, "Login", {
      fontSize: "36px",
      color: "#FFD700",
      fontFamily: "Poppins",
      fontStyle: "bold",
    }).setOrigin(0.5);

    const domContainer = document.createElement("div");
    domContainer.classList.add("dom-ui");
    domContainer.innerHTML = `
      <input id="username" type="text" placeholder="Username or Email" autocomplete="username" />
      <input id="password" type="password" placeholder="Password" autocomplete="current-password" />
      <button id="login-btn">Login</button>
      <button id="register-btn">Register</button>
      <p id="status" style="color:#FFD700; font-size:1rem; margin-top:8px;"></p>
    `;
    document.getElementById("game-container").appendChild(domContainer);

    const username = domContainer.querySelector("#username");
    const password = domContainer.querySelector("#password");
    const loginBtn = domContainer.querySelector("#login-btn");
    const registerBtn = domContainer.querySelector("#register-btn");
    const status = domContainer.querySelector("#status");

    // Auto-login if token exists
    const token = localStorage.getItem("authToken");
    if (token) {
      this.switchScene("ModeSelectScene", domContainer);
      return;
    }

    // Enter key support
    domContainer.addEventListener("keydown", e => {
      if (e.key === "Enter") loginBtn.click();
    });

    // Login logic
    loginBtn.addEventListener("click", async () => {
      const user = username.value.trim();
      const pass = password.value.trim();

      if (!user || !pass) {
        status.textContent = "Please fill in all fields.";
        return;
      }

      status.textContent = "Logging in...";

      try {
        const res = await api.login(user, pass);

        // If email not verified
        if (res.error === "Email not verified") {
          status.textContent = "Email not verified. Check your inbox.";
          return;
        }

        // Save token and redirect
        localStorage.setItem("authToken", res.token);
        this.switchScene("ModeSelectScene", domContainer);
      } catch (err) {
        status.textContent = err.message || "Login failed. Try again.";
      }
    });

    // Go to register scene
    registerBtn.addEventListener("click", () => {
      this.switchScene("RegisterScene", domContainer);
    });

    // Handle email verification token in URL
    const verifyToken = new URLSearchParams(window.location.search).get("token");
    if (verifyToken) {
      api.verify(verifyToken)
        .then(() => this.switchScene("ModeSelectScene", domContainer))
        .catch(console.error);
    }
  }

  switchScene(sceneKey, domContainer) {
    domContainer.remove();
    this.scene.start(sceneKey);
  }
}
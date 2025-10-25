import { api } from "../src/api.js";

export class LoginScene extends Phaser.Scene {
  constructor() {
    super({ key: "LoginScene" });
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Title
    this.add.text(this.scale.width / 2, 100, "Login", {
      fontSize: "36px",
      color: "#fff",
    }).setOrigin(0.5);

    // DOM container
    const domContainer = document.createElement("div");
    domContainer.classList.add("dom-ui");
    domContainer.innerHTML = `
      <input id="username" type="text" name="username" placeholder="Username" autocomplete="username" />
      <input id="password" type="password" name="password" placeholder="Password" autocomplete="current-password" />
      <button id="login-btn">Login</button>
      <button id="register-btn">Register</button>
      <p id="status" style="color:#fff; font-size:1rem; margin-top:8px;"></p>
    `;
    document.getElementById("game-container").appendChild(domContainer);

    const usernameInput = domContainer.querySelector("#username");
    const passwordInput = domContainer.querySelector("#password");
    const loginBtn = domContainer.querySelector("#login-btn");
    const registerBtn = domContainer.querySelector("#register-btn");
    const status = domContainer.querySelector("#status");

    // Auto-login check
    const token = localStorage.getItem("authToken");
    if (token) {
      this.fadeOutTo("ModeSelectScene", domContainer);
      return;
    }

    // Enter key support
    domContainer.addEventListener("keydown", (e) => {
      if (e.key === "Enter") loginBtn.click();
    });

    // Login logic
    loginBtn.addEventListener("click", async () => {
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
      if (!username || !password) {
        status.textContent = "Please fill in all fields.";
        return;
      }

      status.textContent = "Logging in...";

      try {
        await api.login(username, password);
        this.fadeOutTo("ModeSelectScene", domContainer);
      } catch (err) {
        status.textContent = err.message;
      }
    });

    // Go to register scene
    registerBtn.addEventListener("click", () => {
      this.fadeOutTo("RegisterScene", domContainer);
    });

    // Handle email verification automatically if token exists in URL
    const urlParams = new URLSearchParams(window.location.search);
    const verifyToken = urlParams.get("token");
    if (verifyToken) {
      api.verify(verifyToken)
        .then(() => this.fadeOutTo("ModeSelectScene", domContainer))
        .catch(err => console.error(err));
    }
  }

  fadeOutTo(sceneKey, domContainer) {
    domContainer.classList.add("fade-out");
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      domContainer.remove();
      this.scene.start(sceneKey);
    });
  }
}
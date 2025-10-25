import { api } from "../utils/api.js";

export class RegisterScene extends Phaser.Scene {
  constructor() {
    super({ key: "RegisterScene" });
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Title
    this.add.text(this.scale.width / 2, 100, "Register", {
      fontSize: "36px",
      color: "#fff",
    }).setOrigin(0.5);

    // DOM container
    const domContainer = document.createElement("div");
    domContainer.classList.add("dom-ui");
    domContainer.innerHTML = `
      <input id="username" type="text" name="username" placeholder="Username" autocomplete="username" />
      <input id="email" type="email" name="email" placeholder="Email" autocomplete="email" />
      <input id="password" type="password" name="password" placeholder="Password" autocomplete="new-password" />
      <button id="register-btn">Register</button>
      <button id="back-btn">Back to Login</button>
      <p id="status" style="color:#fff; font-size:1rem; margin-top:8px;"></p>
    `;
    document.getElementById("game-container").appendChild(domContainer);

    const usernameInput = domContainer.querySelector("#username");
    const emailInput = domContainer.querySelector("#email");
    const passwordInput = domContainer.querySelector("#password");
    const registerBtn = domContainer.querySelector("#register-btn");
    const backBtn = domContainer.querySelector("#back-btn");
    const status = domContainer.querySelector("#status");

    // Enter key support
    domContainer.addEventListener("keydown", (e) => {
      if (e.key === "Enter") registerBtn.click();
    });

    registerBtn.addEventListener("click", async () => {
      const username = usernameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!username || !email || !password) {
        status.textContent = "Please fill in all fields.";
        return;
      }

      status.textContent = "Registering...";

      try {
        await api.register(username, email, password);
        status.textContent = "Registration successful! Check your email to verify your account.";
      } catch (err) {
        status.textContent = err.message;
      }
    });

    backBtn.addEventListener("click", () => {
      this.fadeOutTo("LoginScene", domContainer);
    });
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
import { api } from "../utils/api.js";

export class LoginScene extends Phaser.Scene {
  constructor() {
    super({ key: "LoginScene" });
  }

  create() {
    this.cameras.main.fadeIn(250, 0, 0, 0);

    this.add.text(this.scale.width / 2, 100, "Login", {
      fontSize: "36px",
      color: "#FFC107",
      fontFamily: "Poppins",
      fontStyle: "bold",
    }).setOrigin(0.5);

    const domContainer = document.createElement("div");
    domContainer.classList.add("dom-ui");
    domContainer.innerHTML = `
      <input id="username" type="text" placeholder="Username" autocomplete="username" />
      <input id="password" type="password" placeholder="Password" autocomplete="current-password" />
      <button id="login-btn">Login</button>
      <button id="register-btn">Register</button>
      <p id="status" style="color:#FFC107; font-size:1rem; margin-top:8px;"></p>
    `;
    document.getElementById("game-container").appendChild(domContainer);

    const username = domContainer.querySelector("#username");
    const password = domContainer.querySelector("#password");
    const loginBtn = domContainer.querySelector("#login-btn");
    const registerBtn = domContainer.querySelector("#register-btn");
    const status = domContainer.querySelector("#status");

    const token = localStorage.getItem("authToken");
    if (token) return this.fadeOutTo("ModeSelectScene", domContainer);

    domContainer.addEventListener("keydown", e => {
      if (e.key === "Enter") loginBtn.click();
    });

    loginBtn.addEventListener("click", async () => {
      const user = username.value.trim();
      const pass = password.value.trim();
      if (!user || !pass) return (status.textContent = "Please fill in all fields.");

      status.textContent = "Logging in...";

      try {
        await api.login(user, pass);
        this.fadeOutTo("ModeSelectScene", domContainer);
      } catch (err) {
        status.textContent = err.message;
      }
    });

    registerBtn.addEventListener("click", () => {
      this.fadeOutTo("RegisterScene", domContainer);
    });

    const verifyToken = new URLSearchParams(window.location.search).get("token");
    if (verifyToken) {
      api.verify(verifyToken)
        .then(() => this.fadeOutTo("ModeSelectScene", domContainer))
        .catch(err => console.error(err));
    }
  }

  fadeOutTo(sceneKey, domContainer) {
    domContainer.classList.add("fade-out");
    this.cameras.main.fadeOut(250, 0, 0, 0);
    this.time.delayedCall(250, () => {
      domContainer.remove();
      this.scene.start(sceneKey);
    });
  }
}
import { api } from "../utils/api.js";

export class RegisterScene extends Phaser.Scene {
  constructor() {
    super({ key: "RegisterScene" });
  }

  create() {
    this.cameras.main.fadeIn(250, 0, 0, 0);

    this.add.text(this.scale.width / 2, 100, "Register", {
      fontSize: "36px",
      color: "#FFC107",
      fontFamily: "Poppins",
      fontStyle: "bold",
    }).setOrigin(0.5);

    const domContainer = document.createElement("div");
    domContainer.classList.add("dom-ui");
    domContainer.innerHTML = `
      <input id="username" type="text" placeholder="Username" />
      <input id="email" type="email" placeholder="Email" />
      <input id="password" type="password" placeholder="Password" />
      <button id="register-btn">Register</button>
      <button id="back-btn">Back</button>
      <p id="status" style="color:#FFC107; font-size:1rem; margin-top:8px;"></p>
    `;
    document.getElementById("game-container").appendChild(domContainer);

    const username = domContainer.querySelector("#username");
    const email = domContainer.querySelector("#email");
    const password = domContainer.querySelector("#password");
    const registerBtn = domContainer.querySelector("#register-btn");
    const backBtn = domContainer.querySelector("#back-btn");
    const status = domContainer.querySelector("#status");

    domContainer.addEventListener("keydown", (e) => {
      if (e.key === "Enter") registerBtn.click();
    });

    registerBtn.addEventListener("click", async () => {
      const user = username.value.trim();
      const mail = email.value.trim();
      const pass = password.value.trim();

      if (!user || !mail || !pass) {
        status.textContent = "Please fill in all fields.";
        return;
      }

      status.textContent = "Registering...";

      try {
        await api.register(user, mail, pass);
        status.textContent = "Success! Check your email to verify your account.";
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
    this.cameras.main.fadeOut(250, 0, 0, 0);
    this.time.delayedCall(250, () => {
      domContainer.remove();
      this.scene.start(sceneKey);
    });
  }
}
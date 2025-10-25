import { api } from "../api.js";

export class LogoutScene extends Phaser.Scene {
  constructor() {
    super({ key: "LogoutScene" });
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Clear user data
    api.logout();

    // DOM UI
    const domContainer = document.createElement("div");
    domContainer.classList.add("dom-ui");
    domContainer.innerHTML = `
      <p style="color:#fff; font-size:1.4rem;">You have been logged out.</p>
      <button id="back-login">Return to Login</button>
    `;
    document.getElementById("game-container").appendChild(domContainer);

    const backBtn = domContainer.querySelector("#back-login");

    // Fade transition back to LoginScene
    backBtn.addEventListener("click", () => {
      this.fadeOutTo("LoginScene", domContainer);
    });

    // Auto redirect after 2 seconds
    this.time.delayedCall(2000, () => {
      if (this.scene.isActive("LogoutScene")) {
        this.fadeOutTo("LoginScene", domContainer);
      }
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
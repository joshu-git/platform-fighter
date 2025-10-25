import { api } from "../utils/api.js";

export class LogoutScene extends Phaser.Scene {
  constructor() {
    super({ key: "LogoutScene" });
  }

  create() {
    this.cameras.main.fadeIn(250, 0, 0, 0);

    // Clear user session
    api.logout();

    // UI Container
    const domContainer = document.createElement("div");
    domContainer.classList.add("dom-ui");
    domContainer.innerHTML = `
      <p style="color:#FFC107; font-size:1.3rem; text-align:center;">
        You have been logged out.
      </p>
      <button id="back-login">Return to Login</button>
    `;
    document.getElementById("game-container").appendChild(domContainer);

    const backBtn = domContainer.querySelector("#back-login");

    // Allow Enter key to confirm
    domContainer.addEventListener("keydown", (e) => {
      if (e.key === "Enter") backBtn.click();
    });

    // Manual back button
    backBtn.addEventListener("click", () => {
      this.fadeOutTo("LoginScene", domContainer);
    });

    // Auto redirect after 1.5s
    this.time.delayedCall(1500, () => {
      if (this.scene.isActive("LogoutScene")) {
        this.fadeOutTo("LoginScene", domContainer);
      }
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
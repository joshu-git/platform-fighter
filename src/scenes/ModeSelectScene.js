import { api } from "../api.js";

export class ModeSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: "ModeSelectScene" });
  }

  async create() {
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Verify auth token
    let token = api.getToken();
    if (!token) {
      // Try refreshing
      token = await api.refreshToken();
      if (!token) {
        this.scene.start("LoginScene");
        return;
      }
    }

    // Welcome message
    const username = localStorage.getItem("username") || "Player";
    this.add.text(this.scale.width / 2, 100, `Welcome, ${username}!`, {
      fontSize: "32px",
      color: "#fff",
    }).setOrigin(0.5);

    // DOM UI
    const domContainer = document.createElement("div");
    domContainer.classList.add("dom-ui");
    domContainer.innerHTML = `
      <button id="start-btn">Play Game</button>
      <button id="profile-btn">Profile</button>
      <button id="logout-btn">Logout</button>
      <p id="status" style="color:#fff; margin-top:10px;"></p>
    `;
    document.getElementById("game-container").appendChild(domContainer);

    const startBtn = domContainer.querySelector("#start-btn");
    const profileBtn = domContainer.querySelector("#profile-btn");
    const logoutBtn = domContainer.querySelector("#logout-btn");

    // Example buttons
    startBtn.addEventListener("click", () => {
      this.fadeOutTo("GameScene", domContainer);
    });

    profileBtn.addEventListener("click", () => {
      this.fadeOutTo("ProfileScene", domContainer);
    });

    logoutBtn.addEventListener("click", () => {
      this.fadeOutTo("LogoutScene", domContainer);
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
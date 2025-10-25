import { api } from "../utils/api.js";

export class ModeSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: "ModeSelectScene" });
  }

  async create() {
    this.cameras.main.fadeIn(250, 0, 0, 0);

    // Token check
    let token = api.getToken();
    if (!token) {
      token = await api.refreshToken();
      if (!token) {
        this.scene.start("LoginScene");
        return;
      }
    }

    // Welcome message
    const username = localStorage.getItem("username") || "Player";
    this.add.text(this.scale.width / 2, 80, `Welcome, ${username}!`, {
      fontSize: "34px",
      color: "#FFC107",
      fontFamily: "Poppins",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // UI container
    const domContainer = document.createElement("div");
    domContainer.classList.add("dom-ui");
    domContainer.innerHTML = `
      <button id="start-btn">▶ Play Game</button>
      <button id="profile-btn">👤 Profile</button>
      <button id="logout-btn">🚪 Logout</button>
      <p id="status" style="color:#FFC107; margin-top:10px;"></p>
    `;
    document.getElementById("game-container").appendChild(domContainer);

    const startBtn = domContainer.querySelector("#start-btn");
    const profileBtn = domContainer.querySelector("#profile-btn");
    const logoutBtn = domContainer.querySelector("#logout-btn");

    // Keyboard navigation
    domContainer.addEventListener("keydown", (e) => {
      if (e.key === "Enter") startBtn.click();
    });

    startBtn.addEventListener("click", () => this.fadeOutTo("GameScene", domContainer));
    profileBtn.addEventListener("click", () => this.fadeOutTo("ProfileScene", domContainer));
    logoutBtn.addEventListener("click", () => this.fadeOutTo("LogoutScene", domContainer));
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
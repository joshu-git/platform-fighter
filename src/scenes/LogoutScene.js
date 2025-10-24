import Phaser from "phaser";

export class LogoutScene extends Phaser.Scene {
  constructor() {
    super({ key: "LogoutScene" });
  }

  create() {
    // Clear token and username
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");

    // Optional: show message
    const message = this.add.text(
      window.innerWidth / 2,
      window.innerHeight / 2,
      "You have been logged out.",
      { fontSize: "28px", color: "#fff" }
    ).setOrigin(0.5);

    // After a short delay, return to LoginScene
    this.time.delayedCall(1500, () => {
      this.scene.start("LoginScene");
    });
  }
}
import Phaser from "phaser";

// Import all scenes
import { LoginScene } from "./scenes/LoginScene.js";
import { RegisterScene } from "./scenes/RegisterScene.js";
import { ModeSelectScene } from "./scenes/ModeSelectScene.js";
import { CharacterSelectScene } from "./scenes/CharacterSelectScene.js";
import { GameScene } from "./scenes/GameScene.js";
import { LogoutScene } from "./scenes/LogoutScene.js";

// Phaser game config
const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 1000 }, debug: false },
  },
  scene: [
    LoginScene,
    RegisterScene,
    ModeSelectScene,
    CharacterSelectScene,
    GameScene,
    LogoutScene,
  ],
};

// Create the game instance
const game = new Phaser.Game(config);

// Handle browser resize
window.addEventListener("resize", () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});

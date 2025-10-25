import './style.css';
import { LoginScene } from "./scenes/LoginScene.js";
import { RegisterScene } from "./scenes/RegisterScene.js";
import { ModeSelectScene } from "./scenes/ModeSelectScene.js";
import { CharacterSelectScene } from "./scenes/CharacterSelectScene.js";
import { GameScene } from "./scenes/GameScene.js";
import { LogoutScene } from "./scenes/LogoutScene.js";

const container=document.getElementById("game-container");

const config={
  type: Phaser.AUTO,
  parent: container,
  width: container.clientWidth,
  height: container.clientHeight,
  scale:{ mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics:{ default:"arcade", arcade:{ gravity:{y:1000}, debug:false } },
  dom:{ createContainer:true },
  scene:[ LoginScene, RegisterScene, ModeSelectScene, CharacterSelectScene, GameScene, LogoutScene ]
};

const game=new Phaser.Game(config);
window.addEventListener("resize", ()=>game.scale.resize(container.clientWidth, container.clientHeight));
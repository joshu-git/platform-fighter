import { api } from "../utils/api.js";

export class ModeSelectScene extends Phaser.Scene {
  constructor(){ super({ key:"ModeSelectScene" }); }

  async create(){
    this.cameras.main.setBackgroundColor("#0b0d16");

    let token=api.getToken();
    if(!token){ token=await api.refreshToken(); if(!token){ this.scene.start("LoginScene"); return; } }

    const username=localStorage.getItem("username")||"Player";
    this.add.text(this.scale.width/2, 80, `Welcome, ${username}!`, {
      fontSize:"34px",
      color:"#FFD700",
      fontFamily:"Poppins",
      fontStyle:"bold"
    }).setOrigin(0.5);

    const domContainer=document.createElement("div");
    domContainer.classList.add("dom-ui");
    domContainer.innerHTML=`
      <button id="start-btn">▶ Play Game</button>
      <button id="profile-btn">👤 Profile</button>
      <button id="logout-btn">🚪 Logout</button>
      <p id="status" style="color:#FFD700; margin-top:10px;"></p>
    `;
    document.getElementById("game-container").appendChild(domContainer);

    const startBtn=domContainer.querySelector("#start-btn");
    const profileBtn=domContainer.querySelector("#profile-btn");
    const logoutBtn=domContainer.querySelector("#logout-btn");

    domContainer.addEventListener("keydown", e=>{ if(e.key==="Enter") startBtn.click(); });

    startBtn.addEventListener("click", ()=>this.switchScene("GameScene", domContainer));
    profileBtn.addEventListener("click", ()=>this.switchScene("ProfileScene", domContainer));
    logoutBtn.addEventListener("click", ()=>this.switchScene("LogoutScene", domContainer));
  }

  switchScene(sceneKey, domContainer){
    domContainer.remove();
    this.scene.start(sceneKey);
  }
}
import { api } from "../utils/api.js";

export class LogoutScene extends Phaser.Scene {
  constructor(){ super({ key:"LogoutScene" }); }

  create(){
    this.cameras.main.setBackgroundColor("#0b0d16");
    api.logout();

    const domContainer=document.createElement("div");
    domContainer.classList.add("dom-ui");
    domContainer.innerHTML=`
      <p style="color:#FFD700; font-size:1.3rem; text-align:center;">You have been logged out.</p>
      <button id="back-login">Return to Login</button>
    `;
    document.getElementById("game-container").appendChild(domContainer);

    const backBtn=domContainer.querySelector("#back-login");
    domContainer.addEventListener("keydown", e=>{ if(e.key==="Enter") backBtn.click(); });
    backBtn.addEventListener("click", ()=>this.switchScene("LoginScene", domContainer));

    this.time.delayedCall(1500, ()=>{
      if(this.scene.isActive("LogoutScene")) this.switchScene("LoginScene", domContainer);
    });
  }

  switchScene(sceneKey, domContainer){
    domContainer.remove();
    this.scene.start(sceneKey);
  }
}
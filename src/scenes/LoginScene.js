export class LoginScene extends Phaser.Scene {
  constructor() {
    super({ key: "LoginScene" });
  }

  create() {
    this.add
      .text(window.innerWidth / 2, 100, "Login", {
        fontSize: "32px",
        color: "#fff",
      })
      .setOrigin(0.5);

    const usernameInput = this.add.dom(window.innerWidth / 2, 200, "input", {
      type: "text",
      placeholder: "Username",
      fontSize: "24px",
    });

    const passwordInput = this.add.dom(window.innerWidth / 2, 260, "input", {
      type: "password",
      placeholder: "Password",
      fontSize: "24px",
    });

    const status = this.add
      .text(window.innerWidth / 2, 400, "", {
        fontSize: "20px",
        color: "#fff",
      })
      .setOrigin(0.5);

    // Check if user already logged in
    const token = localStorage.getItem("authToken");
    if (token) {
      this.scene.start("ModeSelectScene");
      return;
    }

    const loginBtn = this.add
      .text(window.innerWidth / 2, 330, "Login", {
        fontSize: "28px",
        color: "#00ff00",
      })
      .setOrigin(0.5)
      .setInteractive();

    const registerBtn = this.add
      .text(window.innerWidth / 2, 380, "Register", {
        fontSize: "24px",
        color: "#00aaff",
      })
      .setOrigin(0.5)
      .setInteractive();

    loginBtn.on("pointerdown", async () => {
      const username = usernameInput.node.value.trim();
      const password = passwordInput.node.value.trim();
      if (!username || !password) {
        status.text = "Please fill in all fields.";
        return;
      }

      status.text = "Logging in...";

      try {
        const res = await fetch("/.netlify/functions/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", data.user.username);
        this.scene.start("ModeSelectScene");
      } catch (err) {
        status.text = err.message;
      }
    });

    registerBtn.on("pointerdown", () => {
      this.scene.start("RegisterScene");
    });
  }
}

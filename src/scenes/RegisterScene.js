import Phaser from "phaser";

export class RegisterScene extends Phaser.Scene {
  constructor() {
    super({ key: "RegisterScene" });
  }

  create() {
    this.add
      .text(window.innerWidth / 2, 100, "Register", {
        fontSize: "32px",
        color: "#fff",
      })
      .setOrigin(0.5);

    // Input fields
    const usernameInput = this.add.dom(window.innerWidth / 2, 200, "input", {
      type: "text",
      placeholder: "Username",
      fontSize: "24px",
    });

    const emailInput = this.add.dom(window.innerWidth / 2, 260, "input", {
      type: "email",
      placeholder: "Email",
      fontSize: "24px",
    });

    const passwordInput = this.add.dom(window.innerWidth / 2, 320, "input", {
      type: "password",
      placeholder: "Password",
      fontSize: "24px",
    });

    const status = this.add
      .text(window.innerWidth / 2, 460, "", {
        fontSize: "20px",
        color: "#fff",
        wordWrap: { width: 500 },
        align: "center",
      })
      .setOrigin(0.5);

    // Buttons
    const registerBtn = this.add
      .text(window.innerWidth / 2, 390, "Register", {
        fontSize: "28px",
        color: "#00ff00",
      })
      .setOrigin(0.5)
      .setInteractive();

    const backBtn = this.add
      .text(window.innerWidth / 2, 440, "Back to Login", {
        fontSize: "22px",
        color: "#00aaff",
      })
      .setOrigin(0.5)
      .setInteractive();

    // Handle register button click
    registerBtn.on("pointerdown", async () => {
      const username = usernameInput.node.value.trim();
      const email = emailInput.node.value.trim();
      const password = passwordInput.node.value.trim();

      if (!username || !email || !password) {
        status.text = "Please fill in all fields.";
        return;
      }

      status.text = "Registering...";

      try {
        const res = await fetch("/.netlify/functions/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration failed");

        status.text = "Registration successful! Check your email to verify your account.";
      } catch (err) {
        status.text = err.message;
      }
    });

    // Back to Login
    backBtn.on("pointerdown", () => {
      this.scene.start("LoginScene");
    });
  }
}
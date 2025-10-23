const { Keyboard, Input } = Phaser;

//characters
const bobby = Object.freeze({weight: 0, fastfallspeed: 0, dashspeed: 0, runspeed: 0, jumpsquat: 0});
const josh = Object.freeze({weight: 69, fastfallspeed: 0, dashspeed: 0, runspeed: 0, jumpsquat: 0});
const howard = Object.freeze({weight: 0, fastfallspeed: 0, dashspeed: 0, runspeed: 0, jumpsquat: 0});
const jules = Object.freeze({weight: 0, fastfallspeed: 0, dashspeed: 0, runspeed: 0, jumpsquat: 0});
const jubran = Object.freeze({weight: 0, fastfallspeed: 0, dashspeed: 0, runspeed: 0, jumpsquat: 0});
const pawel = Object.freeze({weight: 0, fastfallspeed: 0, dashspeed: 0, runspeed: 0, jumpsquat: 0});

//stages
const stageone = Object.freeze({background: assets/backgrounds/stageone.png, platforms: assets/platforms/stageone, stage: assets/stages/stageone})
const stagetwo = Object.freeze({background: assets/backgrounds/stagetwo.png, platforms: assets/platforms/stagetwo, stage: assets/stages/stagetwo})
const stagethree = Object.freeze({background: assets/backgrounds/stagethree.png, platforms: assets/platforms/stagethree, stage: assets/stages/stagethree})
const stagefour = Object.freeze({background: assets/backgrounds/stagefour.png, platforms: assets/platforms/stagefour, stage: assets/stages/stagefour})
const stagefive = Object.freeze({background: assets/backgrounds/stagefive.png, platforms: assets/platforms/stagefive, stage: assets/stages/stagefive})
const stagesix = Object.freeze({background: assets/backgrounds/stagesix.png, platforms: assets/platforms/stagesix, stage: assets/stages/stagesix})

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,      // automatically resize to fill screen
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game-container',
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 1000 }, debug: false },
  },
  scene: [LoginScene, RegisterScene, ModeSelectScene, CharacterSelectScene, GameScene, LogoutScene]
};

const game = new Phaser.Game(config);

// Optional: handle browser resize
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});

class LoginScene extends Phaser.Scene {
  constructor() {
    super({ key: "LoginScene" });
  }

  create() {
    this.add.text(window.innerWidth / 2, 100, "Login", { fontSize: "32px", color: "#fff" }).setOrigin(0.5);

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

    const status = this.add.text(window.innerWidth / 2, 400, "", {
      fontSize: "20px",
      color: "#fff",
    }).setOrigin(0.5);

    // If user already logged in
    const token = localStorage.getItem("authToken");
    if (token) {
      this.scene.start("ModeSelectScene");
      return;
    }

    const loginBtn = this.add.text(window.innerWidth / 2, 330, "Login", {
      fontSize: "28px",
      color: "#00ff00",
    }).setOrigin(0.5).setInteractive();

    const registerBtn = this.add.text(window.innerWidth / 2, 380, "Register", {
      fontSize: "24px",
      color: "#00aaff",
    }).setOrigin(0.5).setInteractive();

    loginBtn.on("pointerdown", async () => {
      const username = usernameInput.node.value.trim();
      const password = passwordInput.node.value.trim();
      if (!username || !password) return (status.text = "Please fill in all fields.");

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

class RegisterScene extends Phaser.Scene {
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

class LogoutScene extends Phaser.Scene {
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

let player;
let platforms;
let cursors;

function preload() {
  // Preload your assets here
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('platform', 'assets/platform.png');
}

function create() {
  // Create your game objects here
  this.background = this.add.image(0, 0, 'background');
  this.background.setOrigin(0, 0);
  this.background.setDisplaySize(window.innerWidth, window.innerHeight);

  // Set the stage as solid
  this.physics.add.collider(player, platforms);

  // Create the main stage
  createPlatform(window.innerWidth / 2, window.innerHeight * 0.8, window.innerWidth, 50);

  // Create the floating platforms
  createFloatingPlatform(window.innerWidth / 4, window.innerHeight * 0.6, window.innerWidth / 4, 50);
  createFloatingPlatform(window.innerWidth * 3 / 4, window.innerHeight * 0.6, window.innerWidth / 4, 50);
  createFloatingPlatform(window.innerWidth / 2, window.innerHeight * 0.4, window.innerWidth / 4, 50);

  player = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'player');
  player.setScale(0.5);
  player.setCollideWorldBounds(true);
  this.physics.world.enableBody(player);

const secondCharacter = this.physics.add.sprite(500, 300, 'secondCharacter');
secondCharacter.setScale(0.5);
secondCharacter.setCollideWorldBounds(true);
this.physics.world.enableBody(secondCharacter);

const attackHitbox = this.physics.add.sprite(0, 0, 'attackHitbox');
attackHitbox.setDepth(-1);
attackHitbox.setVisible(false);

this.physics.add.collider(attackHitbox, platforms);
this.physics.add.collider(attackHitbox, player);

// Set the initial position of the attack hitbox relative to the second character
attackHitbox.setXY(secondCharacter.x, secondCharacter.y);

  

  playeronecontrols = this.input.keyboard.createCursorKeys();

  // Display the FPS
  this.fpsText = this.add.text(10, 10, 'FPS: 0', { fontSize: '16px', fill: '#000000ff' });
  this.fpsText.setScrollFactor(0);
}

function createPlatform(x, y, width, height) {
  const platform = this.physics.add.image(x, y, 'platform');
  platform.setDisplaySize(width, height);
  platforms.add(platform);
}

function createFloatingPlatform(x, y, width, height) {
  const platform = this.physics.add.image(x, y - height / 2, 'platform');
  platform.setDisplaySize(width, height);
  platform.setVelocityY(50);
  platforms.add(platform);
}

function update() {
  // Update your game objects here
  const speed = 200;

  if (cursors.left.isDown) {
    player.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.setVelocityX(speed);
  } else {
    player.setVelocityX(0);
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-400);
  }

   attackHitbox.x = secondCharacter.x;
  attackHitbox.y = secondCharacter.y;

  player.body.velocity.x = Phaser.Math.Clamp(player.body.velocity.x, -speed, speed);

  platforms.children.iterate((child) => {
    if (player.body.overlap(child) && cursors.down.isDown) {
      player.setVelocityY(400);
    }
  });

  // Update the hitboxes
  platforms.children.iterate((child) => {
    if (secondCharacter.body.overlap(child) && cursors2.down.isDown) {
      secondCharacter.setVelocityY(400);
    }
  });

   // Update the second character's attack
  if (cursors2.space.isDown) {
    attackHitbox.setVisible(true);
  } else {
    attackHitbox.setVisible(false);
  }

  // Update the FPS display
  this.fpsText.setText('FPS: ' + this.time.fps);
}

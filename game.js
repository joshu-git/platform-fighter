const { Keyboard, Input } = Phaser;

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game-container',
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 3500 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

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

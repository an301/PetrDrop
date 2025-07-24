// PetrDrop Game - Main JavaScript File

class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  preload() {
    this.load.image("startBG", "assets/startscene.png"); // You can change the image file name
    //this.load.image('startButton', 'assets/start-button.png'); // Optional: or use text instead
  }

  create() {
    // Add background image
    const bg = this.add.image(0, 0, "startBG").setOrigin(0, 0);
    bg.displayWidth = this.sys.game.config.width;
    bg.displayHeight = this.sys.game.config.height;

    // Option 2 (if no image): use plain text as button
    const startText = this.add
      .text(400, 500, "START", { fontSize: "48px", fill: "#fff" })
      .setOrigin(0.5);
    startText.setInteractive();
    startText.on("pointerdown", () => {
      // Fade out the current camera
      this.cameras.main.fadeOut(500, 0, 0, 0); // duration 500ms, fade to black (RGB 0,0,0)

      // After the fade completes, start the main scene
      this.time.delayedCall(500, () => {
        this.scene.start("MainScene");
      });
    });
  }
}

class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }
  preload() {
    this.load.image("sky", "assets/background.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/petr.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("tree", "assets/tree.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 540,
      frameHeight: 216,
    });
  }
  create() {
    //  A simple background for our game
    this.add.image(0, 0, "sky");

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    platforms.create(400, 568, "ground").setScale(2).refreshBody();

    // Adding trees as obstacles with improved collision
    for (let i = 0; i < 3; i++) {
      const treeX = Phaser.Math.Between(50, 750);
      const treeY = 545;
      // This makes the tree visible, but won't be in the way of the player
      this.add.image(treeX, treeY, "tree").setScale(0.2).setOrigin(0.5, 1);
      // Area where the smaller section of the tree can be interacted with by the player (where they can jump on it)
      const treePlatform = this.physics.add
        .staticImage(treeX, treeY - 100, null)
        .setSize(50, 20)
        .refreshBody();
      // Makes the block/platform for the tree invisible but still allows the player to interact with it
      treePlatform.setVisible(false);
      // Now adding the platform to the static group
      platforms.add(treePlatform);
    }

    // Improved ledge generation to prevent same-level placement
    // ledgeOne
    const firstX = Phaser.Math.Between(0, 750);
    const firstY = Phaser.Math.Between(300, 400);
    platforms.create(firstX, firstY, "ground");
    // ledgeTwo
    const secondX = Phaser.Math.Between(50, 750);
    const secondY = Phaser.Math.Between(150, 250);
    platforms.create(secondX, secondY, "ground");

    // The player and its settings
    player = this.physics.add.sprite(100, 450, "dude");
    player.setScale(0.3);

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    // Fixed collision bounds for better collision detection
    player.setSize(180, 200).setOffset(180, 20);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
      key: "left",
      frames: [{ key: "dude", frame: 0 }],
      frameRate: 1,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 1 }],
      frameRate: 1,
    });

    this.anims.create({
      key: "right",
      frames: [{ key: "dude", frame: 1 }],
      frameRate: 1,
      repeat: -1,
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some stars to collect, 8 in total, evenly spaced 90 pixels apart along the x axis
    stars = this.physics.add.group({
      key: "star",
      repeat: 7,
      setXY: { x: 40, y: 0, stepX: 100 },
    });

    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
      child.setScale(0.1); // 👈 Add this line to shrink the star
    });

    enemies = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000",
    });

    //  The timer
    timerText = this.add.text(config.width - 16, 16, "Time: 0:00", {
      fontSize: "32px",
      fill: "#000",
    });
    timerText.setOrigin(1, 0); // Right-align the timer

    // Initialize game timer
    initializeTimer();

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(enemies, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.physics.add.collider(player, enemies, hitEnemy, null, this);
  }
  update() {
    if (gameOver) {
      return;
    }

    // Update timer
    updateGameTimer();

    if (cursors.left.isDown) {
      player.setVelocityX(-160);

      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);

      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);

      player.anims.play("turn");
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }
    // Example: Switch to next scene if player reaches right edge
    if (player.x > 770) {
      this.scene.start("SecondScene");
    }
  }
}

// New scene for the second page
class SecondScene extends Phaser.Scene {
  constructor() {
    super("SecondScene");
  }
  preload() {
    this.load.image("sky", "assets/background.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/petr.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 540,
      frameHeight: 216,
    });
  }
  create() {
    //  A simple background for our game
    this.add.image(0, 0, "sky");

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, "ground").setScale(2).refreshBody();

    // Adding trees as obstacles with improved collision
    for (let i = 0; i < 3; i++) {
      const treeX = Phaser.Math.Between(50, 750);
      const treeY = 545;
      // This makes the tree visible, but won't be in the way of the player
      this.add.image(treeX, treeY, "tree").setScale(0.2).setOrigin(0.5, 1);
      // Area where the smaller section of the tree can be interacted with by the player (where they can jump on it)
      const treePlatform = this.physics.add
        .staticImage(treeX, treeY - 100, null)
        .setSize(50, 20)
        .refreshBody();
      // Makes the block/platform for the tree invisible but still allows the player to interact with it
      treePlatform.setVisible(false);
      // Now adding the platform to the static group
      platforms.add(treePlatform);
    }

    // Improved ledge generation to prevent same-level placement
    // ledgeOne
    const firstX = Phaser.Math.Between(0, 750);
    const firstY = Phaser.Math.Between(300, 400);
    platforms.create(firstX, firstY, "ground");
    // ledgeTwo
    const secondX = Phaser.Math.Between(50, 750);
    const secondY = Phaser.Math.Between(150, 250);
    platforms.create(secondX, secondY, "ground");

    // The player and its settings
    player = this.physics.add.sprite(100, 450, "dude");
    player.setScale(0.3);

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    // Fixed collision bounds for better collision detection
    player.setSize(180, 200).setOffset(180, 20);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
      key: "left",
      frames: [{ key: "dude", frame: 0 }],
      frameRate: 1,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 1 }],
      frameRate: 1,
    });

    this.anims.create({
      key: "right",
      frames: [{ key: "dude", frame: 1 }],
      frameRate: 1,
      repeat: -1,
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some stars to collect, 8 in total, evenly spaced 90 pixels apart along the x axis
    stars = this.physics.add.group({
      key: "star",
      repeat: 7,
      setXY: { x: 40, y: 0, stepX: 100 },
    });

    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
      child.setScale(0.1); // 👈 Add this line to shrink the star
    });

    enemies = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, "score: " + score, {
      fontSize: "32px",
      fill: "#000",
    });

    //  The timer
    timerText = this.add.text(
      config.width - 16,
      16,
      "Time: " + formatTime(gameTime),
      { fontSize: "32px", fill: "#000" }
    );
    timerText.setOrigin(1, 0); // Right-align the timer

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(enemies, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.physics.add.collider(player, enemies, hitEnemy, null, this);
  }
  update() {
    if (gameOver) {
      return;
    }

    // Update timer
    updateGameTimer();

    if (cursors.left.isDown) {
      player.setVelocityX(-160);

      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);

      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);

      player.anims.play("turn");
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }
    // Example: Switch to next scene if player reaches right edge
    if (player.x > 770) {
      this.scene.start("SecondScene", { score: score });
    }
  }
}

// Game configuration
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  physics: { default: "arcade", arcade: { gravity: { y: 300 }, debug: false } },
  scene: [StartScene, MainScene, SecondScene],
};

// Global variables
var player;
var stars;
var enemies;
var platforms;
var cursors;
var score = 0;
var scoreEnemy = 0;
var gameOver = false;
var scoreText;
var timerText;
var gameTime = 0;
var gameStartTime;
var completionTime = null; // Track when player reaches 500 points

// Collection tracking
var collectedPetr = 0;
var petrCollectionHistory = [];

// Initialize the game
var game = new Phaser.Game(config);

// Timer functionality
function initializeTimer() {
  gameStartTime = Date.now();
  gameTime = 0;
}

function updateGameTimer() {
  if (!gameOver && gameStartTime) {
    gameTime = Math.floor((Date.now() - gameStartTime) / 1000);
    if (timerText) {
      timerText.setText("Time: " + formatTime(gameTime));
    }

    // Check if 1.5 minutes (90 seconds) have passed without reaching 500 points
    if (gameTime >= 90 && score < 500 && completionTime === null) {
      // Set game over to prevent further updates
      gameOver = true;

      // Store the final score for lose screen
      localStorage.setItem("finalScore", score);
      localStorage.setItem("petrCollected", collectedPetr);
      localStorage.setItem("timePlayed", gameTime);

      // Redirect to lose screen
      window.location.href = "lose.html";
    }
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return minutes + ":" + remainingSeconds.toString().padStart(2, "0");
}

function resetTimer() {
  gameTime = 0;
  gameStartTime = Date.now();
  if (timerText) {
    timerText.setText("Time: 0:00");
  }
}

// Menu and UI functionality
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const menuContent = document.getElementById("menu-content");
  const viewCollectionBtn = document.getElementById("view-collection-btn");
  const restartBtn = document.getElementById("restart-btn");
  const collectionModal = document.getElementById("collection-modal");
  const closeCollection = document.getElementById("close-collection");

  let isMenuOpen = false;

  // Menu toggle functionality
  menuToggle.addEventListener("click", function () {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
      menuContent.classList.remove("menu-hidden");
      menuContent.classList.add("menu-visible");
    } else {
      menuContent.classList.remove("menu-visible");
      menuContent.classList.add("menu-hidden");
    }
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !document.getElementById("menu-tab").contains(event.target) &&
      isMenuOpen
    ) {
      isMenuOpen = false;
      menuContent.classList.remove("menu-visible");
      menuContent.classList.add("menu-hidden");
    }
  });

  // View collection functionality
  viewCollectionBtn.addEventListener("click", function () {
    updateCollectionDisplay();
    collectionModal.classList.remove("modal-hidden");
    collectionModal.classList.add("modal-visible");

    // Close menu
    isMenuOpen = false;
    menuContent.classList.remove("menu-visible");
    menuContent.classList.add("menu-hidden");
  });

  // Close collection modal
  closeCollection.addEventListener("click", function () {
    collectionModal.classList.remove("modal-visible");
    collectionModal.classList.add("modal-hidden");
  });

  // Close modal when clicking outside
  collectionModal.addEventListener("click", function (event) {
    if (event.target === collectionModal) {
      collectionModal.classList.remove("modal-visible");
      collectionModal.classList.add("modal-hidden");
    }
  });

  // Restart functionality
  restartBtn.addEventListener("click", function () {
    // Reset game state
    score = 0;
    collectedPetr = 0;
    petrCollectionHistory = [];
    gameOver = false;

    // Always restart from MainScene (beginning of the game)
    // Stop all scenes and start fresh from MainScene
    game.scene.stop("MainScene");
    game.scene.stop("SecondScene");

    // Start MainScene fresh
    setTimeout(() => {
      game.scene.start("MainScene");
      // Reset timer after scene starts
      setTimeout(() => {
        resetTimer();
        // Reset cursor keys to prevent auto-movement
        if (cursors) {
          cursors.left.isDown = false;
          cursors.right.isDown = false;
          cursors.up.isDown = false;
        }
      }, 50);
    }, 100);

    // Close menu
    isMenuOpen = false;
    menuContent.classList.remove("menu-visible");
    menuContent.classList.add("menu-hidden");
  });
});

// Update collection display
function updateCollectionDisplay() {
  const totalScoreEl = document.getElementById("total-score");
  const petrCountEl = document.getElementById("petr-count");
  const timePlayedEl = document.getElementById("time-played");
  const petrBoxesEl = document.getElementById("petr-boxes");

  totalScoreEl.textContent = score;
  petrCountEl.textContent = collectedPetr;
  timePlayedEl.textContent = formatTime(gameTime);

  // Clear and rebuild petr boxes
  petrBoxesEl.innerHTML = "";

  for (let i = 0; i < collectedPetr; i++) {
    const petrBox = document.createElement("div");
    petrBox.className = "petr-box";

    // Create the Petr image element
    const petrImage = document.createElement("div");
    petrImage.className = "petr-image";

    const petrNumber = document.createElement("div");
    petrNumber.className = "petr-number";
    petrNumber.textContent = i + 1;

    petrBox.appendChild(petrImage);
    petrBox.appendChild(petrNumber);
    petrBoxesEl.appendChild(petrBox);
  }
}

// Function to add collected Petr to the collection
function addPetrToCollection() {
  collectedPetr++;
  const timestamp = new Date().toISOString();
  petrCollectionHistory.push({
    id: collectedPetr,
    timestamp: timestamp,
    score: score,
  });
}

// Game functions
function collectStar(player, star) {
  star.disableBody(true, true);

  //  Add to collection tracking
  addPetrToCollection();

  //  Add and update the score
  score += 10;
  scoreEnemy += 10;
  scoreText.setText("Score: " + score);

  // Check if player has reached 500 points to show win screen
  if (score >= 500 && completionTime === null) {
    // Record completion time (time to reach 500 points)
    completionTime = gameTime;

    // Store the final score in localStorage for the win screen
    localStorage.setItem("finalScore", score);
    localStorage.setItem("petrCollected", collectedPetr);
    localStorage.setItem("timePlayed", gameTime);
    localStorage.setItem("completionTime", completionTime);

    // Save to high scores
    saveHighScore(score, collectedPetr, completionTime);

    // Redirect to win screen
    window.location.href = "win-screen.html";
    return;
  }

  if (scoreEnemy == 100) {
    //  A new batch of stars to collect
    scoreEnemy = 0;

    stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });

    var x =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    var enemy = enemies.create(x, 16, "enemy").setScale(0.08);
    enemy.setSize(700, 1300);        // tweak to match visual size
    enemy.setOffset(900, 270);      // aligns the hitbox with sprite
    enemy.setBounce(1);
    enemy.setCollideWorldBounds(true);
    enemy.setVelocity(Phaser.Math.Between(-200, 200), 20);
    enemy.allowGravity = true;
  }
}

function hitEnemy(player, enemy) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play("turn");

  gameOver = true;

  // Store the final score for lose screen
  localStorage.setItem("finalScore", score);
  localStorage.setItem("petrCollected", collectedPetr);
  localStorage.setItem("timePlayed", gameTime);

  // Redirect to lose screen after a short delay
  setTimeout(() => {
    window.location.href = "lose.html";
  }, 1500);
}

// Function to save high score
function saveHighScore(score, petrCollected, completionTime) {
  // Get existing high scores
  let highScores = JSON.parse(localStorage.getItem("highScores") || "[]");
  let totalGames = parseInt(localStorage.getItem("totalGames") || "0");

  // Create new score entry
  const newScore = {
    score: score,
    petrCollected: petrCollected,
    completionTime: completionTime, // Time to reach 500 points
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
  };

  // Add new score to array
  highScores.push(newScore);

  // Sort by completion time (fastest first) and keep only top 10
  highScores.sort((a, b) => a.completionTime - b.completionTime);
  highScores = highScores.slice(0, 10);

  // Update total games played
  totalGames++;

  // Save back to localStorage
  localStorage.setItem("highScores", JSON.stringify(highScores));
  localStorage.setItem("totalGames", totalGames.toString());
}

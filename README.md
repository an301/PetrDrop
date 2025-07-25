# PetrDrop

**PetrDrop** is a fun platformer game built using [Phaser 3](https://phaser.io/). Help the player collect petrs while avoiding enemies and jumping across platforms and trees.

## 🧠 Game Concept

You control a character navigating a 2D side-scrolling world filled with collectibles called "petrs" and bouncing enemies. The game includes multiple levels, dynamic obstacles, and a real-time timer and score tracking system.

## 🚀 Features

- Platforming mechanics with double-layered ledges and trees
- Interactive environment (players can jump on trees!)
- Enemies with bounce and random velocity
- Smooth scene transitions
- Collection tracking system 
- Pause menu with UI and collection modal
- Time and score tracking
- Level progression (scene switching)

## 🕹️ Controls

- **← / → Arrow Keys** – Move left or right  
- **↑ Arrow Key** – Jump  
- **Click "START"** – Begin the game  
- **Menu Button (Top-Right)** – Access collection and restart options
- **Restart button (Win and lose screen)** - Restart the game with clean scores 

## 🧩 Technologies

- JavaScript
- Phaser 3
- HTML/CSS 

## 📁 Project Structure
PetrDrop/
├── game.js # Main game logic and scene definitions
├── high-scores.html # High score display page (if implemented)
├── petrdrop.html # Optional alternative entry point
├── win-screen.html # Screen shown after game is won
├── lose.html # Screen shown after game is lost
├── README.md # Project documentation
├── styles.css # Styling for menus, modals, and UI elements
├── app/
│ ├── index.html # Entry point of the game
├── assets/ # Game assets: images, sprites, backgrounds
│ ├── background.png
│ ├── bobapetr.png
│ ├── platform.png
│ ├── tree.png
│ ├── petr.png
│ ├── pickleballpetr.png
│ ├── platform.png
│ ├── enemy.png
│ ├── dude.png
│ ├── sprite_left.png
│ ├── sprite_right.png
│ └── startscene.png
│ ├── schoolspiritpetr.png
├── public/ # Assets used outside main game scenes
│ └── win_petr.png # Image shown in win screen or collection

## ⚙️ Setup & Run

1. Clone or download this repository
2. Open `petrdrop.html` in a web browser using Live Server
3. Press ' petrdrop.html' and click **START** to play!

> No server or build tools required — the game runs entirely in the browser.

## 🛠️ Customization Tips

- Replace `assets/startscene.png` to change the start menu background.
- Modify platform generation logic in `MainScene` or `SecondScene` to adjust difficulty.

## 📦 To-Do / Future Features

- Add background music and sound effects
- Add lives/health mechanic
- Add a final win screen or boss level
- Implement power-ups
- Add more backgrounds and character customization

---

### 💡 Author

Made with by Kaelyn Sung, Sanaa Bebal, Anish Nambirajan, Derrick Thrower 

---



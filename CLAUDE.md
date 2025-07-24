# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PetrDrop is a Phaser 3-based 2D platformer game built as a single HTML file. The game features a player character that can collect stars, avoid bombs, and navigate between different scenes/levels.

## Architecture

### Core Structure
- **Single-file application**: The entire game is contained in `part10.html`
- **Phaser 3 framework**: Uses Phaser 3.11.0 loaded from CDN
- **Scene-based architecture**: Game uses multiple scenes (`MainScene`, `SecondScene`) for different levels
- **Physics system**: Uses Arcade Physics for collision detection and movement

### Key Components
- **MainScene**: First level with randomized platform placement (lines 17-140)
- **SecondScene**: Second level with fixed platform layout (lines 143-264)
- **Game entities**: Player sprite, collectible stars, harmful bombs, static platforms
- **Game mechanics**: Score tracking, collision detection, scene transitions

### Global Variables
The game uses several global variables defined at lines 274-281:
- `player`: Main character sprite
- `platforms`: Static physics group for platforms
- `stars`: Dynamic physics group for collectible items  
- `bombs`: Dynamic physics group for harmful objects
- `cursors`: Keyboard input handling
- `score`: Current player score
- `gameOver`: Game state flag
- `scoreText`: Score display text object

## Development Commands

### Running the Game
- Open `part10.html` directly in a web browser
- No build process or package manager required
- Uses CDN-hosted Phaser 3 library

### Assets
All game assets are located in the `assets/` directory:
- `sky.png`: Background image
- `platform.png`: Ground/platform sprites
- `dude.png`: Player character spritesheet (32x48 frames)
- `star.png`: Collectible item sprite
- `bomb.png`: Hazard sprite

## Game Logic

### Scene Management
- Player transitions from MainScene to SecondScene when reaching x > 780
- Each scene has independent setup but shares global variables
- MainScene uses randomized ledge placement, SecondScene uses fixed positions

### Physics and Collision
- Arcade Physics with gravity (y: 300)
- Player has bounce (0.2) and world bounds collision
- Collision groups: player-platforms, stars-platforms, bombs-platforms, player-bombs
- Overlap detection for star collection

### Input Handling
- Arrow keys for movement (left/right at 160 velocity, up for jump at -330 velocity)
- Jump only works when player is touching ground (`player.body.touching.down`)

## Key Functions

### Game Loop Functions
- `collectStar()` (lines 285-311): Handles star collection, score updates, and bomb spawning
- `hitBomb()` (lines 313-322): Handles game over state when player hits bomb

### Animation System
Each scene defines three animations for the player:
- `'left'`: Walking left animation (frames 0-3)
- `'right'`: Walking right animation (frames 5-8) 
- `'turn'`: Idle/turning animation (frame 4)
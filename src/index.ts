import * as PIXI from "pixi.js";
import { Controller } from "./Controller";
import { InputManager } from "./InputManager";
import { Game } from "./Game";
import { Screen } from "./Screen";

// Import assets
import bulletPng from "../assets/bullet.png";
import shipPng from "../assets/ship.png";

const app = new PIXI.Application({
  backgroundAlpha: 0
});
PIXI.utils.clearTextureCache(); // Reset cache between reloads

// Screen
// Draws things to screen
// collisions: Tell the Controller "bullet collided with player"
const screen = new Screen({ app });

// InputHandler - EASY :)
// keyboard input: Tell the game "right is being pressed/released"
const inputManager = new InputManager({ app });

// Game
// This runs the game loop
// Destroy things on collision
// Tell the screen to move
const game = new Game({ screen });

// Controller
// update game data on input
// update game data on collision
const controller = new Controller({ inputManager, game, screen });

// Logging every frame crashes codesandbox
let frameCounter = 0;
function logGameMessage() {
  frameCounter++;
  if (Game.message && frameCounter % 120 === 0) {
    frameCounter = 0;
    console.log("Game.message: " + Game.message);
  }
}

// load the texture we need
app.loader
  .add("ship", shipPng)
  .add("bullet", bulletPng)
  .load((loader, resources) => {
    const ship = new PIXI.Sprite(resources.ship.texture);

    // Set up view
    screen.initialize({
      bulletTexture: resources.bullet.texture,
      text: "JC JIMMY",
      ship: ship
    });
    controller.start();
    window.onresize = () => screen.onWindowResize();

    // Listen for frame updates
    app.ticker.add((delta) => {
      logGameMessage();
      game.loop(delta);
    });
  });

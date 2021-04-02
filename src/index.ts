import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";
import { Controller } from "./Controller";
import { InputHandler } from "./InputHandler";
import { Game } from "./Game";
import { Screen } from "./Screen";

// Import assets
import bulletPng from "../assets/bullet.png";
import shipPng from "../assets/ship.png";

const app = new PIXI.Application();
PIXI.utils.clearTextureCache(); // Reset cache between reloads

// Screen
// Draws things to screen
// collisions: Tell the Controller "bullet collided with player"
const screen = new Screen({ app });

// InputHandler - EASY :)
// keyboard input: Tell the game "right is being pressed/released"
const inputHandler = new InputHandler();

// Game
// This runs the game loop
// Destroy things on collision
// Tell the screen to move
const game = new Game({ screen });

// Controller
// update game data on input
// update game data on collision
const controller = new Controller({ inputHandler, game, screen });

// load the texture we need
app.loader
  .add("ship", shipPng)
  .add("bullet", bulletPng)
  .load((loader, resources) => {
    const ship = new PIXI.Sprite(resources.ship.texture);

    screen.initialize({
      bulletTexture: resources.bullet.texture,
      ship: ship
    });
    screen.addPlayer(ship);
    screen.addBullet(); // Demo bullet

    // Listen for frame updates
    app.ticker.add(() => game.loop());
    controller.start();
  });

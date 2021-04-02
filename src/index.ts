import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";
import shipPng from "./ship.png";
import { Controller } from "./Controller";
import { InputHandler } from "./InputHandler";
import { Game } from "./Game";
import { Screen } from "./Screen";

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

let ship: Sprite;

// load the texture we need
app.loader.add("ship", shipPng).load((loader, resources) => {
  ship = new PIXI.Sprite(resources.ship.texture);
  // screen.addText("JC The Great")
  screen.addPlayer(ship);

  // Listen for frame updates
  app.ticker.add(() => game.loop());
  controller.start();
});

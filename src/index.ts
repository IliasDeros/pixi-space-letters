import * as PIXI from "pixi.js";
import ship from "./ship.png";

const app = new PIXI.Application();

// Reset cache between reloads
PIXI.utils.clearTextureCache();

document.body.appendChild(app.view);

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.resize(window.innerWidth, window.innerHeight);

// load the texture we need
app.loader.add("ship", ship).load((loader, resources) => {
  const ship = new PIXI.Sprite(resources.ship.texture);

  // Setup the position of the ship
  ship.x = app.renderer.width / 2;
  ship.y = app.renderer.height - app.renderer.height / 5;

  // Rotate around the center
  ship.anchor.x = 0.5;
  ship.anchor.y = 0.5;

  // Add the ship to the scene we are building.
  app.stage.addChild(ship);

  // Listen for frame updates
  app.ticker.add(() => {
    // each frame we spin the ship around a bit
    ship.rotation += 0.01;
  });
});

import * as PIXI from "pixi.js";
import { Application, Texture, Sprite } from "pixi.js";

export type ScreenDrawerProps = {
  app: Application;
  bulletTexture: Texture;
};

// draws things in canvas
export class ScreenDrawer {
  app: Application;
  bulletTexture: Texture;

  constructor({ app, bulletTexture }: ScreenDrawerProps) {
    this.app = app;
    this.bulletTexture = bulletTexture;

    document.body.appendChild(app.view);

    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.resize(window.innerWidth, window.innerHeight);
  }

  addBullet({ x, y }: { x: number; y: number }) {
    // Add bullet on top of the player
    const { app, bulletTexture } = this;
    const bulletSprite = new PIXI.Sprite(bulletTexture);

    app.stage.addChild(bulletSprite);

    // Setup the position of the ship
    bulletSprite.x = x;
    bulletSprite.y = y;

    // Rotate around the center
    bulletSprite.anchor.x = 0.5;
    bulletSprite.anchor.y = 0.5;

    return bulletSprite;
  }

  addPlayer({
    x,
    y,
    playerSprite
  }: {
    x: number;
    y: number;
    playerSprite: Sprite;
  }) {
    const { app } = this;
    app.stage.addChild(playerSprite);

    // Setup the position of the ship
    playerSprite.x = x;
    playerSprite.y = y;

    // Rotate around the center
    playerSprite.anchor.x = 0.5;
    playerSprite.anchor.y = 0.5;
  }
}
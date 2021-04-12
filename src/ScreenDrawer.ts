import * as PIXI from "pixi.js";
import { Application, Texture, Sprite } from "pixi.js";
import { Stars } from "../vendor/Stars";

export type ScreenDrawerProps = {
  app: Application;
  bulletTexture: Texture;
};

type AddTextProps = {
  text: string;
  x: number;
  y: number;
};

// draws things in canvas
export class ScreenDrawer {
  app: Application;
  bulletTexture: Texture;
  stars: Stars;

  constructor({ app, bulletTexture }: ScreenDrawerProps) {
    this.app = app;
    this.bulletTexture = bulletTexture;
    // Add stars background
    this.stars = new Stars({ app } as any);

    document.body.appendChild(app.view);

    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    this.onWindowResize();
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

  removeSprite(sprite: Sprite) {
    const { app } = this;
    app.stage.removeChild(sprite);
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

  addText({ text, x, y }: AddTextProps) {
    const textElement = this.generateText(text);

    textElement.x = x + textElement.width / 2;
    textElement.y = y + textElement.height / 2;

    this.app.stage.addChild(textElement);
    return textElement;
  }

  generateText(text: string) {
    return new PIXI.Text(text, {
      align: "center",
      fill: 0x4cbb17,
      fontFamily: "starjedi, Arial Black",
      fontSize: 64,
      wordWrap: true
    });
  }

  onWindowResize() {
    // On android, the "outer" width is smaller than the innerWidth
    const width = Math.min(window.innerWidth, window.outerWidth);
    const height = Math.min(window.innerHeight, window.outerHeight);

    this.app.renderer.resize(width, height);
    this.stars.renderFullScreen();
  }
}

import * as PIXI from "pixi.js";
import { Application, Sprite, Texture } from "pixi.js";
import { ScreenDrawer } from "./ScreenDrawer";
import { Game } from "./Game";

export type ScreenProps = {
  app: Application;
};

export type ScreenInitializeProps = {
  ship: Sprite;
  bulletTexture: Texture;
};

export class Screen {
  app: Application;
  bulletSprites: Sprite[] = [];
  letterSprites: Sprite[] = [];
  playerSprite!: Sprite;
  screenDrawer!: ScreenDrawer;

  constructor({ app }: ScreenProps) {
    this.app = app;
  }

  initialize({ bulletTexture, ship }: ScreenInitializeProps) {
    this.screenDrawer = new ScreenDrawer({
      app: this.app,
      bulletTexture
    });

    this.addPlayer(ship);
  }

  addBullet = () => {
    const spawn = this.getBulletSpawn();
    const bulletSprite = this.screenDrawer.addBullet(spawn);
    this.bulletSprites.push(bulletSprite);
  };

  addText = (text: string) => {
    const { app, screenDrawer } = this;
    const lettersStartY = app.renderer.height / 10;

    // Split up words
    const words = text.split(" ");

    // Draw each letters in the words individually
    words.reduce((y, word) => {
      const wordText = screenDrawer.generateText(word);
      const wordWidth = wordText.width;

      // Center the word horizontally
      const screenCenterX = app.renderer.width / 2;
      const wordStartX = screenCenterX - wordWidth / 2;
      word.split("").reduce((x, letter) => {
        const letterSprite = screenDrawer.addText({
          text: letter,
          x,
          y
        });

        this.letterSprites.push(letterSprite);

        return x + letterSprite.width;
      }, wordStartX);

      return y + wordText.height;
    }, lettersStartY);
  };

  addPlayer = (sprite: Sprite) => {
    const { app } = this;
    this.playerSprite = sprite;
    sprite.interactive = true;

    this.screenDrawer.addPlayer({
      playerSprite: sprite,
      x: app.renderer.width / 2,
      y: app.renderer.height - app.renderer.height / 5
    });
  };

  limitPlayerX() {
    const fusee = this.playerSprite;

    fusee.x = Math.min(fusee.x, this.app.renderer.width);
    fusee.x = Math.max(fusee.x, 0);
  }

  onClickPlayer(callback: () => void) {
    this.playerSprite.on("mousedown", callback);
    this.playerSprite.on("touchstart", callback);
  }

  movePlayerRelative({ x = 0, y = 0 }) {
    this.playerSprite.x += x;
    this.playerSprite.y += y;

    // Avoid the player going off screen
    this.limitPlayerX();
  }

  moveBulletRelative({ y = 0 }) {
    this.bulletSprites.forEach((sprite) => (sprite.y += y));
  }

  rotatePlayer(factor: number) {
    this.playerSprite.rotation += factor;
  }

  /** Spawn on top of the player */
  private getBulletSpawn() {
    const { playerSprite } = this;
    const playerCenter = playerSprite.x + playerSprite.width / 2;
    const playerTop = playerSprite.y;

    const bulletImageOffsetX = 20;
    const bulletImageOffsetY = -5;

    return {
      x: bulletImageOffsetX + playerCenter,
      y: playerTop + bulletImageOffsetY
    };
  }
}

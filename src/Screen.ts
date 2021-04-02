import { Application, Sprite, Texture } from "pixi.js";
import { ScreenDrawer } from "./ScreenDrawer";

export type ScreenProps = {
  app: Application;
};

export type ScreenInitializeProps = {
  ship: Sprite;
  bulletTexture: Texture;
};

export class Screen {
  app: Application;
  bulletSprites: Sprite[];
  playerSprite!: Sprite;
  screenDrawer!: ScreenDrawer;

  constructor({ app }: ScreenProps) {
    this.app = app;
    this.bulletSprites = [];
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

  onClickPlayer(callback: () => void) {
    this.playerSprite.on("mousedown", callback);
    this.playerSprite.on("touchstart", callback);
  }

  movePlayerRelative({ x = 0, y = 0 }) {
    this.playerSprite.x += x;
    this.playerSprite.y += y;
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

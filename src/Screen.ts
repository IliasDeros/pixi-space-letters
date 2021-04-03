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
  bulletSprites: Sprite[] = [];
  letterSprites: Sprite[] = [];
  playerSprite!: Sprite;
  screenDrawer!: ScreenDrawer;

  constructor({ app }: ScreenProps) {
    this.app = app;
  }

  initialize({ bulletTexture, ship }: ScreenInitializeProps) {
    const { app } = this;
    this.screenDrawer = new ScreenDrawer({ app, bulletTexture });

    // Add stars background
    this.screenDrawer.addBackground();
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
    const ship = this.playerSprite;

    const offsetX = ship.width / 2;
    const maxPlayerX = this.app.renderer.width - offsetX;
    const minPlayerX = 0 + offsetX;

    ship.x = Math.min(ship.x, maxPlayerX);
    ship.x = Math.max(ship.x, minPlayerX);
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
